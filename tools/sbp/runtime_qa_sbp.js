/* Runtime QA harness for the Sales Blueprinting SCOs.
 * Runs the shipped index.html + scorm.js + content.js + app.js in jsdom against a
 * mock SCORM 1.2 API and checks the workbook acceptance tests (B06-B12, B14).
 * Usage: node tools/sbp/runtime_qa_sbp.js [--out path]  */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..');
// SBP_MODULES_DIR lets the containerized suite test extracted production packages instead of sources.
const MODS = process.env.SBP_MODULES_DIR ? path.resolve(process.env.SBP_MODULES_DIR) : path.join(ROOT, 'learning', 'modules');
const outIdx = process.argv.indexOf('--out');
const OUT = outIdx > 0 ? process.argv[outIdx + 1] : path.join(ROOT, 'plan', 'sales-blueprinting', 'runtime-qa-results.json');

function mockApi(store) {
  const calls = [];
  const api = {
    store, calls,
    LMSInitialize: () => { calls.push(['init']); return 'true'; },
    LMSFinish: () => { calls.push(['finish']); return 'true'; },
    LMSGetValue: (k) => { calls.push(['get', k]); return store[k] || ''; },
    LMSSetValue: (k, v) => {
      calls.push(['set', k, v]);
      if (k === 'cmi.suspend_data' && String(v).length > 4096) throw new Error('suspend_data over 4096');
      store[k] = String(v);
      const m = k.match(/^cmi\.interactions\.(\d+)\.id$/);
      if (m) store['cmi.interactions._count'] = String(Math.max(+store['cmi.interactions._count'] || 0, +m[1] + 1));
      return 'true';
    },
    LMSCommit: () => { calls.push(['commit']); return 'true'; },
    LMSGetLastError: () => '0', LMSGetErrorString: () => '', LMSGetDiagnostic: () => '',
  };
  return api;
}

function launch(dir, opts) {
  opts = opts || {};
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8').replace(/<script src="[^"]+"><\/script>/g, '');
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://127.0.0.1/' + path.basename(dir) + '/index.html' });
  const w = dom.window;
  w.SBP_QA = true;
  // jsdom has no layout; tests drive reading progress through SBP_TEST unless opts.sweep is set.
  w.SBP_QA_MANUAL = !opts.sweep;
  if (opts.layout) opts.layout(w);
  w.SBP_SEED = opts.seed == null ? 7 : opts.seed;
  w.HTMLElement.prototype.scrollIntoView = function () {};
  if (opts.api) w.API = opts.api;
  if (opts.storage) for (const [k, v] of Object.entries(opts.storage)) w.localStorage.setItem(k, v);
  const errors = [];
  w.addEventListener('error', (e) => errors.push(String(e.message)));
  for (const f of ['scorm.js', 'content.js', 'app.js']) {
    try { w.eval(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { errors.push(f + ': ' + e.message); }
  }
  return { dom, w, d: w.document, errors, dir };
}

const $ = (d, s) => d.querySelector(s);
const $$ = (d, s) => Array.from(d.querySelectorAll(s));
function button(d, re) { return $$(d, '#screen button').find((b) => re.test(b.textContent)); }
function sec(ctx, k) { return ctx.d.getElementById('s-' + ctx.w.MODULE.screens[k].id); }
function lastSec(ctx) { return sec(ctx, ctx.w.MODULE.screens.length - 1); }
// Whole-page structure: one page, one h1, one h2 per later section, labelled controls.
function pageIssues(ctx) {
  const M = ctx.w.MODULE, d = ctx.d, issues = [];
  if ($$(d, '#screen h1').length !== 1) issues.push('expected exactly one h1 on the page');
  if ($$(d, '#screen section.sec').length !== M.screens.length) issues.push('section count differs from module sections');
  for (let k = 0; k < M.screens.length; k++) {
    const s = sec(ctx, k);
    if (!s) { issues.push(`${M.screens[k].id}: missing section`); continue; }
    const h1 = $$(s, 'h1').length, h2 = $$(s, 'h2').length;
    if (k === 0 && h1 !== 1) issues.push(`${M.screens[k].id}: expected the h1`);
    if (k > 0 && (h1 !== 0 || h2 !== 1)) issues.push(`${M.screens[k].id}: expected one h2 and no h1`);
    if (s.getAttribute('aria-labelledby') !== $(s, 'h1,h2').id) issues.push(`${M.screens[k].id}: section not labelled by its heading`);
    if (!s.textContent.trim()) issues.push(`${M.screens[k].id}: empty section`);
    $$(s, 'input, textarea').forEach((i) => {
      if (!i.id || !$(d, `label[for="${i.id}"]`)) issues.push(`${M.screens[k].id}: unlabeled ${i.tagName}`);
    });
    if (M.screens[k].type === 'lesson') {
      // Tables are lesson body too: count table rows alongside paragraphs and list items.
      if (!$(s, '.prose') || $$(s, '.prose p, .prose li, .prose tbody tr').length < 4) issues.push(`${M.screens[k].id}: lesson body missing`);
      const figs = $$(s, 'figure.fig');
      if (!figs.length) issues.push(`${M.screens[k].id}: lesson figure missing`);
      figs.forEach((f) => {
        const img = $(f, 'img'), srcEl = $(f, 'source');
        if (!img || (img.getAttribute('alt') || '').trim().length < 40) issues.push(`${M.screens[k].id}: figure alt text missing or too short`);
        [img && img.getAttribute('src'), srcEl && srcEl.getAttribute('srcset')].filter(Boolean).forEach((p) => {
          if (/^[a-z]+:/i.test(p) || p.startsWith('//')) issues.push(`${M.screens[k].id}: figure uses a remote asset ${p}`);
          else if (!fs.existsSync(path.join(ctx.dir, p))) issues.push(`${M.screens[k].id}: figure asset not packaged ${p}`);
        });
      });
      if ($$(s, '.knowledge-check fieldset.item').length !== 1 ||
          $$(s, '.knowledge-check input[type=radio]').length !== 4 ||
          !$$(s, '.knowledge-check button').some((b) => /^Check this answer$/.test(b.textContent))) {
        issues.push(`${M.screens[k].id}: four-option lesson knowledge check missing`);
      }
    }
  }
  const links = $$(d, '#map a');
  if (links.length !== M.screens.length || !links.every((a, k) => a.getAttribute('href') === '#s-' + M.screens[k].id)) {
    issues.push('"On this page" links do not match the sections');
  }
  return issues;
}
function walkAll(ctx) { ctx.w.SBP_TEST.seeAll(); return pageIssues(ctx); }
function correctId(M, qid) { return M.bank.find((q) => q.id === qid).options.find((o) => o.correct).id; }
function wrongId(M, qid) { return M.bank.find((q) => q.id === qid).options.find((o) => !o.correct).id; }
function pick(ctx, qid, oid) {
  const r = ctx.d.getElementById(`r-${qid}-${oid}`);
  r.checked = true;
  r.dispatchEvent(new ctx.w.Event('change'));
}
function answer(ctx, nRight) {
  const M = ctx.w.MODULE, q = ctx.w.SBP_TEST.state.q;
  q.ids.forEach((id, n) => pick(ctx, id, n < nRight ? correctId(M, id) : wrongId(M, id)));
}
function startAttempt(ctx) {
  const b = button(ctx.d, /^Start attempt/);
  if (!b) return false;
  b.click();
  return true;
}
function submit(ctx) {
  const b = button(ctx.d, /^Submit/);
  if (!b) throw new Error('no Submit button on the check screen');
  b.click();
}

function testModule(dir) {
  const id = path.basename(dir);
  const R = { module_id: id, checks: [], failures: [] };
  const ok = (name, cond, detail) => {
    R.checks.push({ name, pass: !!cond, detail: detail || '' });
    if (!cond) R.failures.push(name + (detail ? `: ${detail}` : ''));
  };

  // 1. Standalone preview (no LMS): untracked notice, every screen renders, per-module keys.
  let c = launch(dir);
  const M = c.w.MODULE;
  ok('no script errors (preview)', c.errors.length === 0, c.errors.join('; '));
  ok('untracked preview notice', /Untracked preview/.test($(c.d, '#track').textContent));
  ok('restricted preview banner', /Restricted internal preview/.test($(c.d, '.notice').textContent));
  const issues = pageIssues(c);
  ok('single page: every section renders with correct heading level and labels', issues.length === 0, issues.slice(0, 3).join('; '));
  const shown = $(c.d, 'body').textContent;
  const leak = shown.match(/\b(S\d{2}|C-\d{4}|O\d{2})\b|\bSources?:/);
  ok('no source, claim, or open-question IDs shown to learners', !leak, leak && leak[0]);
  ok('progress starts at zero sections read', /^0 of \d+ sections read$/.test($(c.d, '#ptext').textContent), $(c.d, '#ptext').textContent);
  c.w.SBP_TEST.see(0);
  ok('progress counts a read section', /^1 of /.test($(c.d, '#ptext').textContent) &&
     $$(c.d, '#map li')[0].dataset.state !== 'upcoming');
  const keys = Object.keys(c.w.localStorage).filter((k) => k.startsWith('scorm:'));
  ok('standalone keys namespaced per module', keys.length > 0 && keys.every((k) => k.startsWith(`scorm:${id}:`)), keys.slice(0, 2).join(','));

  // 2. Gate: check screen refuses submission until every screen is visited.
  const api0 = mockApi({});
  c = launch(dir, { api: api0 });
  c.w.SBP_TEST.go(M.screens.length - 1);
  const last = M.screens[M.screens.length - 1];
  if (last.type === 'quiz' && M.screens.length > 2) {
    ok('unread sections block the check', /Read every section/.test(lastSec(c).textContent) && !button(c.d, /^Start attempt/));
    const jumps = $$(lastSec(c), '.unread .linkish');
    ok('check lists unread sections as jump links', jumps.length === Math.min(12, M.screens.length - 1), String(jumps.length));
    jumps[0].click();
    ok('jump link moves focus to that section heading', c.d.activeElement === $(sec(c, 0), 'h1'));
    ok('jump link does not count the section as read', !c.w.SBP_TEST.state.vis[0]);
  }
  ok('new attempt sets incomplete', api0.store['cmi.core.lesson_status'] === 'incomplete');
  ok('lesson_location is a section id', M.screens.some((s) => s.id === api0.store['cmi.core.lesson_location']));

  // Every lesson check is a four-option, single-answer formative MCQ and never writes an LMS score.
  const lessonIndexes = M.screens.map((s, i) => s.type === 'lesson' ? i : -1).filter((i) => i >= 0);
  if (lessonIndexes.length) {
    ok('one knowledge-check record per lesson', (M.knowledge_checks || []).length === lessonIndexes.length,
       `${(M.knowledge_checks || []).length} vs ${lessonIndexes.length}`);
    ok('every lesson renders one four-option MCQ', lessonIndexes.every((i) =>
      $$(sec(c, i), '.knowledge-check fieldset.item').length === 1 &&
      $$(sec(c, i), '.knowledge-check input[type=radio]').length === 4 &&
      $$(sec(c, i), '.knowledge-check button').some((b) => /^Check this answer$/.test(b.textContent))));
    ok('lesson checks contain no open-response controls', lessonIndexes.every((i) =>
      !$(sec(c, i), '.knowledge-check textarea') && !$(sec(c, i), '.reveal-btn')));
    const prac = lessonIndexes[0];
    const q = M.knowledge_checks.find((item) => item.id === M.screens[prac].knowledge_check);
    const right = q.options.find((o) => o.correct).id;
    const wrong = q.options.find((o) => !o.correct).id;
    $(sec(c, prac), `.knowledge-check input[value="${wrong}"]`).click();
    $$(sec(c, prac), '.knowledge-check button').find((b) => /^Check this answer$/.test(b.textContent)).click();
    ok('incorrect lesson MCQ gives retry feedback', /Not correct\. Try again\./.test($(sec(c, prac), '.knowledge-check .feedback').textContent));
    ok('incorrect lesson MCQ remains selectable', $$(sec(c, prac), '.knowledge-check input[type=radio]').every((r) => !r.disabled));
    $(sec(c, prac), `.knowledge-check input[value="${right}"]`).click();
    $$(sec(c, prac), '.knowledge-check button').find((b) => /^Check this answer$/.test(b.textContent)).click();
    ok('lesson MCQ accepts a corrected answer', /Correct\./.test($(sec(c, prac), '.knowledge-check .feedback').textContent));
    ok('correct lesson MCQ locks after success', $$(sec(c, prac), '.knowledge-check input[type=radio]').every((r) => r.disabled));
    ok('lesson MCQ does not write score or LMS interaction', !('cmi.core.score.raw' in api0.store) &&
       !Object.keys(api0.store).some((key) => /^cmi\.interactions\./.test(key)));
  }

  // 3. Draw, shuffle, threshold: pass case.
  const draw = M.kind === 'final' ? M.total_draw : M.draw;
  const need = Math.ceil((80 * draw) / 100);
  const passApi = mockApi({});
  c = launch(dir, { api: passApi });
  walkAll(c);
  c.w.SBP_TEST.go(M.screens.length - 1);
  ok('start attempt available after all screens visited', startAttempt(c));
  const q1 = c.w.SBP_TEST.state.q;
  ok('draw size matches settings', q1.ids.length === draw, `${q1.ids.length} vs ${draw}`);
  ok('no duplicate items in attempt', new Set(q1.ids).size === q1.ids.length);
  if (M.kind === 'final') {
    const per = {};
    q1.ids.forEach((qid) => { const m = M.bank.find((b) => b.id === qid).module; per[m] = (per[m] || 0) + 1; });
    ok('final draw stratified by module', Object.keys(M.final_draws).every((m) => per[m] === M.final_draws[m]), JSON.stringify(per));
  }
  const shuffled = q1.ids.some((qid) => q1.ord[qid] !== 'abcd');
  ok('options shuffled for at least one item', shuffled);
  ok('shuffle preserves option identity', q1.ids.every((qid) => q1.ord[qid].split('').sort().join('') === 'abcd'));
  ok('radios rendered per item', $$(lastSec(c), 'fieldset.item').length === draw);
  answer(c, need);
  submit(c);
  ok(`${need}/${draw} passes`, passApi.store['cmi.core.lesson_status'] === 'passed', passApi.store['cmi.core.lesson_status']);
  ok('score raw on 0-100 scale', Number(passApi.store['cmi.core.score.raw']) === Math.round((need * 10000) / draw) / 100 &&
     passApi.store['cmi.core.score.max'] === '100' && passApi.store['cmi.core.score.min'] === '0', passApi.store['cmi.core.score.raw']);
  const n0 = Object.keys(passApi.store).filter((k) => /^cmi\.interactions\.\d+\.result$/.test(k));
  ok('interactions recorded with SCORM 1.2 vocabulary', n0.length === draw && n0.every((k) => ['correct', 'wrong'].includes(passApi.store[k])));
  const sd = passApi.store['cmi.suspend_data'] || '';
  ok('suspend_data within 4096', sd.length <= 4096, String(sd.length));
  ok('result announced and focused', c.d.activeElement === $(lastSec(c), '.result'));
  c.w.SBP_TEST.finish();
  ok('exit empty when passed', passApi.store['cmi.core.exit'] === '');
  ok('session_time CMITimespan', /^\d{4}:\d{2}:\d{2}\.\d{2}$/.test(passApi.store['cmi.core.session_time'] || ''), passApi.store['cmi.core.session_time']);
  c.w.dispatchEvent(new c.w.Event('pagehide'));
  ok('LMSFinish exactly once', passApi.calls.filter((x) => x[0] === 'finish').length === 1);

  // 4. Resume keeps passed status (B07).
  const reopened = mockApi(Object.assign({}, passApi.store));
  c = launch(dir, { api: reopened });
  ok('resume does not overwrite passed', reopened.store['cmi.core.lesson_status'] === 'passed');
  ok('resume restores reading progress', Object.keys(c.w.SBP_TEST.state.vis).length >= M.screens.length - 1);
  c.w.SBP_TEST.finish();
  ok('passed survives a resumed exit', reopened.store['cmi.core.lesson_status'] === 'passed');

  // 5. Fail case, retry with a new draw, then attempt lock.
  const failApi = mockApi({});
  c = launch(dir, { api: failApi });
  walkAll(c);
  c.w.SBP_TEST.go(M.screens.length - 1);
  startAttempt(c);
  const first = c.w.SBP_TEST.state.q.ids.join();
  answer(c, need - 1);
  submit(c);
  ok(`${need - 1}/${draw} fails`, failApi.store['cmi.core.lesson_status'] === 'failed', failApi.store['cmi.core.score.raw']);
  ok('fail score below mastery without rounding up', Number(failApi.store['cmi.core.score.raw']) < 80, failApi.store['cmi.core.score.raw']);
  ok('retry offered after first failure', startAttempt(c));
  ok('retry draws a new set', c.w.SBP_TEST.state.q.ids.join() !== first || draw === M.bank.length);
  // Blank submission needs confirmation and scores incorrect.
  submit(c);
  ok('blank submit asks for confirmation', !c.w.SBP_TEST.state.q.sub);
  submit(c);
  ok('blank items score incorrect', c.w.SBP_TEST.state.q.right === 0 && failApi.store['cmi.core.lesson_status'] === 'failed');
  ok('locked after two graded attempts', !button(c.d, /^Start attempt/) && /administrator/.test(lastSec(c).textContent));

  // 6. Resume mid-attempt restores position and drawn items.
  const midApi = mockApi({});
  c = launch(dir, { api: midApi });
  walkAll(c);
  c.w.SBP_TEST.go(M.screens.length - 1);
  startAttempt(c);
  const qa = c.w.SBP_TEST.state.q;
  pick(c, qa.ids[0], correctId(M, qa.ids[0]));
  const ids = qa.ids.join();
  const c2 = launch(dir, { api: mockApi(Object.assign({}, midApi.store)), seed: 99 });
  const qb = c2.w.SBP_TEST.state.q;
  ok('resume restores drawn items and answers', qb && qb.ids.join() === ids && qb.ans[qa.ids[0]] === correctId(M, qa.ids[0]));
  ok('resume restores location', c2.w.SBP_TEST.state.i === M.screens.length - 1);

  // 7. Worst-case suspend payload: all answered, max history.
  const st = c2.w.SBP_TEST.state;
  st.q.ids.forEach((qid) => { st.q.ans[qid] = 'd'; });
  st.hist = [{ r: draw, n: draw }, { r: draw, n: draw }];
  ok('worst-case suspend_data within 4096', c2.w.SBP_TEST.payload().length <= 4096, String(c2.w.SBP_TEST.payload().length));

  // 8. ROI Lab oracle.
  const roiIdx = M.screens.findIndex((s) => s.type === 'roi');
  if (roiIdx >= 0) {
    const pre = M.screens[roiIdx].roi.presets;
    const r = (k) => Math.round(c2.w.SBP_TEST.roiCompute(pre[k]).risk);
    ok('ROI Lab matches workbook oracle', r('conservative') === 13608 && r('base') === 41472 && r('upside') === 176904,
       `${r('conservative')}/${r('base')}/${r('upside')}`);
    const b = c2.w.SBP_TEST.roiCompute(pre.base);
    ok('ROI base net, ROI, payback', Math.round(b.net) === 11472 && Math.abs(b.roi - 0.3824) < 0.0001 && Math.abs(b.payback - 8.68) < 0.01);
    const rs = sec(c2, roiIdx);
    ok('ROI Lab renders base value', /\$41,472/.test(rs.textContent));
    const users = c2.d.getElementById('roi-users');
    users.focus();
    users.value = '-5';
    users.dispatchEvent(new c2.w.Event('change'));
    ok('ROI Lab blocks invalid inputs', /not interpretable/.test(rs.textContent));
    ok('ROI input keeps focus while outputs update', c2.d.activeElement === users);
  }

  // 9. Scroll rule: a section counts once its end is on screen; skipped sections do not count.
  if (M.screens.length > 3) {
    let offset = 0;
    const vh = 800;
    const layout = (w) => {
      w.innerHeight = vh;
      w.HTMLElement.prototype.getBoundingClientRect = function () {
        // Lay sections out 1500px apart; each end mark sits at the bottom of its section.
        const s = this.classList.contains('seen-mark') ? this.parentNode : this;
        const k = Array.prototype.indexOf.call(s.parentNode ? s.parentNode.children : [], s);
        const top = (k < 0 ? 0 : k * 1500) - offset + (this === s ? 0 : 1499);
        return { top, bottom: top + 1, left: 0, right: 0, width: 0, height: 1 };
      };
    };
    const sw = launch(dir, { api: mockApi({}), sweep: true, layout });
    const tick = () => { sw.w.dispatchEvent(new sw.w.Event('scroll')); return new Promise((z) => setTimeout(z, 30)); };
    R.async = (async () => {
      await tick();
      ok('scroll: nothing read at the top of the page', !sw.w.SBP_TEST.state.vis[0]);
      offset = 1000; await tick();
      ok('scroll: section counted once its end is on screen', !!sw.w.SBP_TEST.state.vis[0] && !sw.w.SBP_TEST.state.vis[1]);
      offset = 1500 * 3 + 1000; await tick();
      ok('scroll: skipped sections are not counted', !sw.w.SBP_TEST.state.vis[1] && !sw.w.SBP_TEST.state.vis[2] && !!sw.w.SBP_TEST.state.vis[3]);
      ok('scroll: current section follows the viewport', sw.w.SBP_TEST.state.i === 3, String(sw.w.SBP_TEST.state.i));
    })();
  }
  return R;
}

function crossModule() {
  // Two modules on one origin must not share standalone state.
  const a = launch(path.join(MODS, 'SBP-101'));
  a.w.SBP_TEST.go(5);
  const storage = {};
  for (let k = 0; k < a.w.localStorage.length; k++) {
    const key = a.w.localStorage.key(k);
    storage[key] = a.w.localStorage.getItem(key);
  }
  const b = launch(path.join(MODS, 'SBP-102'), { storage });
  return b.w.SBP_TEST.state.i === 0;
}

function crossOriginParent() {
  const dir = path.join(MODS, 'SBP-101');
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8').replace(/<script src="[^"]+"><\/script>/g, '');
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://127.0.0.1/x/index.html' });
  const w = dom.window;
  w.SBP_QA = true;
  Object.defineProperty(w, 'parent', { get() { throw new Error('SecurityError'); } });
  try {
    for (const f of ['scorm.js', 'content.js', 'app.js']) w.eval(fs.readFileSync(path.join(dir, f), 'utf8'));
    return !w.SCORM.isLive();
  } catch (e) { return false; }
}

const dirs = fs.readdirSync(MODS).filter((d) => /^SBP-/.test(d)).sort().map((d) => path.join(MODS, d));
// Fingerprint of the shipped runtime files, so release gates can reject QA results for an older build.
const FP_FILES = ['index.html', 'scorm.js', 'content.js', 'app.js', 'sbp.css'];
function fingerprint(dir) {
  const h = require('crypto').createHash('sha256');
  for (const f of FP_FILES) h.update(fs.readFileSync(path.join(dir, f)));
  return h.digest('hex');
}
(async () => {
const results = [];
for (const dir of dirs) {
  let r;
  try {
    r = testModule(dir);
    if (r.async) await r.async;
    delete r.async;
  } catch (e) {
    r = { module_id: path.basename(dir), checks: [{ name: 'harness completed', pass: false, detail: e.message }],
          failures: ['harness exception: ' + e.message] };
  }
  r.build = fingerprint(dir);
  results.push(r);
}
const extra = { cross_module_isolation: crossModule(), cross_origin_parent_safe: crossOriginParent() };
let failed = 0;
for (const r of results) {
  const n = r.checks.length, f = r.failures.length;
  failed += f;
  console.log(`${r.module_id.padEnd(10)} ${f ? 'FAIL' : 'PASS'}  ${n - f}/${n}${f ? '  ' + r.failures.join(' | ') : ''}`);
}
console.log(`cross-module isolation: ${extra.cross_module_isolation ? 'PASS' : 'FAIL'}`);
console.log(`cross-origin parent safe: ${extra.cross_origin_parent_safe ? 'PASS' : 'FAIL'}`);
if (!extra.cross_module_isolation || !extra.cross_origin_parent_safe) failed++;
fs.writeFileSync(OUT, JSON.stringify({ generated: new Date().toISOString().slice(0, 10), results, extra }, null, 2) + '\n');
console.log(failed ? 'FAIL' : 'PASS');
process.exit(failed ? 1 : 0);
})();
