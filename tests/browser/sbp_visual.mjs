// Drive the SBP visual and figure QA harnesses headlessly against extracted production packages.
//
//   node tests/browser/sbp_visual.mjs <sbp-root> <base-url> <out-dir>
//
// <sbp-root>/<SBP-ID>/ holds each extracted SBP package; tools/sbp/visual_qa.html and
// figure_qa.html are copied next to them and served from <base-url>. Writes
// visual-qa-results.json (same shape as plan/sales-blueprinting/visual-qa-results.json, so
// tests/run.sh --update-evidence can promote it) and figure-qa-results.json, plus screenshots of
// the first screen of each module at 1280px and 320px for human review.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const [root, base, outDir] = process.argv.slice(2);
if (!root || !base || !outDir) {
  console.error('usage: sbp_visual.mjs <sbp-root> <base-url> <out-dir>');
  process.exit(2);
}
const HERE = path.dirname(new URL(import.meta.url).pathname);
const TOOLS = path.resolve(HERE, '..', '..', 'tools', 'sbp');
fs.copyFileSync(path.join(TOOLS, 'visual_qa.html'), path.join(root, 'visual_qa.html'));
fs.copyFileSync(path.join(TOOLS, 'figure_qa.html'), path.join(root, 'figure_qa.html'));
const mods = fs.readdirSync(root).filter((d) => /^SBP-/.test(d) && fs.statSync(path.join(root, d)).isDirectory()).sort();
const svgs = mods.flatMap((m) => {
  const dir = path.join(root, m, 'assets', 'fig');
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.svg')).sort().map((f) => `${m}/assets/fig/${f}`) : [];
});
fs.writeFileSync(path.join(root, '_figlist.json'), JSON.stringify(svgs));
fs.mkdirSync(path.join(outDir, 'screenshots'), { recursive: true });

const browser = await chromium.launch();
const version = browser.version();
let failed = 0;

// Visual QA
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e.message || e)));
await page.goto(`${base}/visual_qa.html`, { waitUntil: 'load' });
await page.waitForFunction(() => window.RESULT && window.RESULT.done, null, { timeout: 15 * 60 * 1000, polling: 1000 });
const R = await page.evaluate(() => window.RESULT);
if (R.error) { failed++; console.log('FAIL  visual QA harness: ' + R.error.slice(0, 300)); }
const results = Object.entries(R.modules).map(([id, rec]) => ({ module_id: id, ...rec, failures: rec.issues || [] }));
for (const r of results) {
  if (r.failures.length) failed++;
  console.log(`${r.failures.length ? 'FAIL' : 'PASS'}  visual ${r.module_id}  screens=${r.screens} figures=${r.figures || 0}` +
    (r.failures.length ? '  ' + JSON.stringify(r.failures[0]).slice(0, 160) : ''));
}
const missing = mods.filter((m) => !R.modules[m]);
if (missing.length) { failed++; console.log('FAIL  visual QA did not test: ' + missing.join(', ')); }
fs.writeFileSync(path.join(outDir, 'visual-qa-results.json'), JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  tool: 'tools/sbp/visual_qa.html',
  browser: `Chromium ${version}, Playwright, tests/container (network disabled)`,
  packages: 'dist/restricted-preview/*.zip rebuilt and extracted inside the test container',
  checks: ['Each screen at 1280px and 320px: horizontal overflow, clipped or overlapping text, figure load, alt text, focus-visible and reduced-motion rules'],
  not_covered: 'Pixel-level human review of screenshots; screenshots for that review are in tests/.results/sbp/screenshots/.',
  results,
}, null, 2) + '\n');

// Screenshots of each module's first screen for human review.
for (const m of mods) {
  for (const width of [1280, 320]) {
    const shot = await browser.newPage({ viewport: { width, height: 900 } });
    await shot.goto(`${base}/${m}/index.html`, { waitUntil: 'load' });
    await shot.waitForTimeout(300);
    await shot.screenshot({ path: path.join(outDir, 'screenshots', `${m}-${width}.png`), fullPage: true });
    await shot.close();
  }
}

// Figure geometry QA
const fig = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await fig.goto(`${base}/figure_qa.html`, { waitUntil: 'load' });
await fig.waitForFunction(() => window.FIGQA, null, { timeout: 10 * 60 * 1000, polling: 500 });
const F = await fig.evaluate(() => window.FIGQA);
const figList = Array.isArray(F) ? F : [];
const figBad = figList.filter((x) => (x.issues || []).length);
if (!svgs.length || figList.length !== svgs.length) { failed++; console.log(`FAIL  figure QA checked ${figList.length} of ${svgs.length} SVGs`); }
if (figBad.length) { failed++; console.log(`FAIL  figure QA: ${figBad.length} SVG(s) with issues, first ${figBad[0].p}: ${figBad[0].issues[0]}`); }
else console.log(`PASS  figure QA  ${figList.length} SVGs`);
fs.writeFileSync(path.join(outDir, 'figure-qa-results.json'), JSON.stringify({ generated: new Date().toISOString(),
  svgs: svgs.length, checked: figList.length, with_issues: figBad.length, results: figBad }, null, 2) + '\n');
if (errors.length) { failed++; console.log('FAIL  page errors: ' + errors.slice(0, 3).join(' | ')); }
await browser.close();
console.log(`sbp visual: ${results.length} module(s), ${failed} failure(s)`);
process.exit(failed ? 1 : 0);
