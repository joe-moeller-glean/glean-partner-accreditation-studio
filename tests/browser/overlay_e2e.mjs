// End-to-end test of the development review overlay against the feedback dev server.
//
//   node tests/browser/overlay_e2e.mjs <dev-server-url> <module-id> <accreditation-id> <out.json>
//
// Drives the real reviewer flow: select text, suggest an edit, comment, highlight, reload and
// re-anchor, reply, resolve, then archive with the CLI and confirm the database is emptied.
// Also checks that the overlay never changes the page's own text or breaks its runtime.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const [base, moduleId, accredId, out] = process.argv.slice(2);
if (!base || !moduleId || !accredId || !out) {
  console.error('usage: overlay_e2e.mjs <dev-server-url> <module-id> <accreditation-id> <out.json>');
  process.exit(2);
}
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const steps = [];
let failed = 0;
async function step(name, fn) {
  try {
    await fn();
    steps.push({ name, ok: true });
    console.log('PASS  ' + name);
  } catch (err) {
    failed++;
    steps.push({ name, ok: false, error: String(err && err.message || err).slice(0, 400) });
    console.log('FAIL  ' + name + '  ' + String(err && err.message || err).slice(0, 200));
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }
async function api(page, p) {
  return page.evaluate(async (u) => (await fetch(u)).json(), base + '/__feedback/api' + p);
}
const pageErrors = [];
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
const ov = (sel) => page.locator('glean-feedback-overlay').locator(sel);
const ready = () => page.waitForFunction(() => window.__GLEAN_FEEDBACK__ && window.__GLEAN_FEEDBACK__.ready, null, { timeout: 15000 });
const pageText = () => page.evaluate(() => {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('glean-feedback-overlay').forEach((n) => n.remove());
  return clone.textContent.replace(/\s+/g, ' ').trim();
});
// Select the first `chars` characters of the first substantial paragraph of visible lesson text.
const selectText = (skip = 0, chars = 40) => page.evaluate(({ skip, chars }) => {
  const paras = [...document.querySelectorAll('main p, article p, section p, p')]
    .filter((p) => p.offsetParent !== null && p.textContent.trim().length > 80 && p.firstChild && p.firstChild.nodeType === 3 && p.firstChild.data.trim().length > chars + 5);
  const p = paras[skip];
  if (!p) return null;
  const node = p.firstChild;
  const start = node.data.length - node.data.trimStart().length;
  const r = document.createRange();
  r.setStart(node, start);
  r.setEnd(node, start + chars);
  const sel = getSelection();
  sel.removeAllRanges();
  sel.addRange(r);
  p.scrollIntoView({ block: 'center' });
  document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  return sel.toString().replace(/\s+/g, ' ').trim();
}, { skip, chars });
const highlightSize = (name) => page.evaluate((n) => (CSS.highlights.get(n) || { size: 0 }).size, name);

let before = '';
let suggestion = '';
let commentQuote = '';
await step('module page loads with the overlay injected', async () => {
  await page.goto(`${base}/m/${moduleId}/`, { waitUntil: 'load' });
  await ready();
  assert(await page.locator('glean-feedback-overlay').count() === 1, 'overlay host missing');
  before = await pageText();
  assert(before.length > 200, 'module rendered too little text');
});
await step('suggest an edit on selected text', async () => {
  suggestion = await selectText(0, 40);
  assert(suggestion, 'no paragraph to select');
  await ov('.toolbar').waitFor({ state: 'visible' });
  await ov('.toolbar [data-act="suggestion"]').click();
  await ov('.author input').fill('E2E Reviewer');
  await ov('.composer .replacement').fill('A clearer replacement sentence.');
  await ov('.composer .body').fill('Shorter and clearer.');
  await ov('.composer button[type="submit"]').click();
  await ov('.card.kind-suggestion').waitFor();
  const j = await api(page, `/comments?scope_type=module&scope_id=${moduleId}&page=index.html`);
  const s = j.comments.find((c) => c.kind === 'suggestion');
  assert(s, 'suggestion not stored');
  assert(s.quote === suggestion, `stored quote ${JSON.stringify(s.quote)} != selection ${JSON.stringify(suggestion)}`);
  assert(s.replacement === 'A clearer replacement sentence.', 'replacement not stored');
  assert(s.author === 'E2E Reviewer', 'author not stored');
  assert(s.accreditations.includes(accredId), 'comment not linked to its accreditation');
  assert(await highlightSize('fb-suggest') === 1, 'suggestion is not redlined on the page');
  assert(await ov('.layer .ins').count() === 1, 'insertion bubble missing');
});
await step('comment and highlight on other text', async () => {
  commentQuote = await selectText(1, 30);
  assert(commentQuote, 'no second paragraph to select');
  await ov('.toolbar [data-act="comment"]').click();
  await ov('.composer .body').fill('Is this claim sourced?');
  await ov('.composer button[type="submit"]').click();
  await page.waitForFunction(() => (CSS.highlights.get('fb-comment') || { size: 0 }).size === 1);
  const hq = await selectText(2, 25);
  assert(hq, 'no third paragraph to select');
  await ov('.toolbar [data-act="highlight"]').click();
  await ov('.composer button[type="submit"]').click();
  await page.waitForFunction(() => (CSS.highlights.get('fb-mark') || { size: 0 }).size === 1);
  assert(await ov('.card').count() === 3, 'expected three cards');
  assert((await ov('.fab .count').textContent()).trim() === '3', 'open count is not 3');
});
await step('a comment without text is rejected', async () => {
  await selectText(3, 20);
  await ov('.toolbar [data-act="comment"]').click();
  await ov('.composer button[type="submit"]').click();
  await ov('.toast.error').waitFor({ state: 'visible' });
  await ov('.composer .cancel').click();
});
await step('the overlay never changes page text', async () => {
  assert(await pageText() === before, 'page text changed after annotating');
});
await step('comments re-anchor after reload', async () => {
  await page.reload({ waitUntil: 'load' });
  await ready();
  assert(await highlightSize('fb-suggest') === 1, 'suggestion did not re-anchor');
  assert(await highlightSize('fb-comment') === 1, 'comment did not re-anchor');
  assert(await highlightSize('fb-mark') === 1, 'highlight did not re-anchor');
  assert(await ov('.card.orphan').count() === 0, 'a comment was orphaned after reload');
});
await step('reply and resolve from the panel', async () => {
  const card = ov('.card.kind-comment');
  await card.locator('form.reply textarea').fill('Source is S12.');
  await card.locator('form.reply button').click();
  await card.locator('.replies li').waitFor();
  await card.locator('[data-act="resolve"]').click();
  await page.waitForFunction(() => (CSS.highlights.get('fb-comment') || { size: 0 }).size === 0);
  const j = await api(page, `/comments?scope_type=module&scope_id=${moduleId}&page=index.html&status=all`);
  const c = j.comments.find((x) => x.kind === 'comment');
  assert(c.status === 'resolved' && c.replies.length === 1, 'resolve or reply not stored');
});
await step('accreditation page is annotatable', async () => {
  await page.goto(`${base}/a/${accredId}/`, { waitUntil: 'load' });
  await ready();
  assert(await page.locator('glean-feedback-overlay').count() === 1, 'overlay missing on accreditation page');
});
await step('index lists modules with feedback counts', async () => {
  await page.goto(`${base}/`, { waitUntil: 'load' });
  const text = await page.textContent('body');
  assert(text.includes(moduleId), 'module missing from index');
  assert(await page.locator('glean-feedback-overlay').count() === 0, 'index page should not carry the overlay');
});
await step('apply and archive move feedback out of SQLite into history', async () => {
  const j = await api(page, `/comments?scope_type=module&scope_id=${moduleId}&page=index.html&status=all`);
  const s = j.comments.find((c) => c.kind === 'suggestion');
  const cli = path.join(ROOT, 'tools', 'feedback', 'cli.py');
  const exported = execFileSync('python3', [cli, 'export', '--scope', moduleId], { encoding: 'utf8' });
  assert(exported.includes(s.id), 'export does not list the open suggestion');
  execFileSync('python3', [cli, 'apply', s.id, '--note', 'Applied in E2E', '--by', 'E2E'], { encoding: 'utf8' });
  execFileSync('python3', [cli, 'archive'], { encoding: 'utf8' });
  const left = await api(page, `/comments?scope_type=module&scope_id=${moduleId}&page=index.html&status=all`);
  assert(left.comments.length === 1 && left.comments[0].kind === 'highlight', 'only the open highlight should remain');
  const hist = fs.readFileSync(path.join(process.env.FEEDBACK_HISTORY, `${moduleId}.md`), 'utf8');
  for (const needle of [s.id, 'Applied in E2E', 'A clearer replacement sentence.', 'Source is S12.']) {
    assert(hist.includes(needle), 'history missing ' + needle);
  }
});
await step('no uncaught page errors with the overlay', async () => {
  assert(!pageErrors.length, pageErrors.slice(0, 3).join(' | '));
});
await browser.close();
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), module: moduleId, steps, failed }, null, 2) + '\n');
console.log(`overlay e2e: ${steps.length} step(s), ${failed} failed`);
process.exit(failed ? 1 : 0);
