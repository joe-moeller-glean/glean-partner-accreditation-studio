/* Runtime QA harness. Executes scorm.js, content.js, and app.js for a module
 * against a minimal DOM shim, then exercises real learner behaviour:
 * navigation, choice selection, sort interactions, quiz grading, SCORM calls,
 * and suspend/resume. Reports per-module findings. No network, no jsdom. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function makeEl(tag) {
  const el = {
    tagName: String(tag).toUpperCase(),
    children: [],
    attrs: {},
    dataset: {},
    style: {},
    className: '',
    _text: '',
    disabled: false,
    focused: false,
    get textContent() {
      if (this.children.length) return this.children.map((c) => c.textContent).join('');
      return this._text;
    },
    set textContent(v) { this._text = v == null ? '' : String(v); this.children = []; },
    get firstChild() { return this.children[0] || null; },
    get lastChild() { return this.children[this.children.length - 1] || null; },
    set innerHTML(v) {
      this._html = String(v);
      this.children = [];
      if (this._html) {
        const m = this._html.match(/<svg[\s\S]*<\/svg>/);
        if (m) { const s = makeEl('svg'); s._raw = m[0]; this.children.push(s); }
      }
    },
    get innerHTML() { return this._html || ''; },
    appendChild(c) { this.children.push(c); c.parent = this; return c; },
    insertBefore(c, ref) {
      const i = this.children.indexOf(ref);
      if (i < 0) this.children.push(c); else this.children.splice(i, 0, c);
      c.parent = this;
      return c;
    },
    setAttribute(k, v) { this.attrs[k] = String(v); },
    getAttribute(k) { return this.attrs[k]; },
    removeAttribute(k) { delete this.attrs[k]; },
    focus() { this.focused = true; harness.lastFocus = this; },
    querySelector(sel) { return this.find((e) => e.tagName === sel.toUpperCase()); },
    find(pred) {
      for (const c of this.children) {
        if (pred(c)) return c;
        const r = c.find ? c.find(pred) : null;
        if (r) return r;
      }
      return null;
    },
    all(pred, acc) {
      acc = acc || [];
      for (const c of this.children) {
        if (pred(c)) acc.push(c);
        if (c.all) c.all(pred, acc);
      }
      return acc;
    },
  };
  return el;
}

const harness = { lastFocus: null };

function buildDocument(ids) {
  const store = {};
  ids.forEach((id) => { const e = makeEl('div'); e.id = id; store[id] = e; });
  return {
    store,
    getElementById: (id) => store[id] || null,
    createElement: (t) => makeEl(t),
    addEventListener: () => {},
  };
}

function run(moduleDir) {
  const findings = [];
  const ids = ['screen', 'map', 'prog', 'ptext', 'objective', 'prev', 'next', 'status', 'mtitle'];
  const document = buildDocument(ids);
  const lsData = {};
  const localStorage = {
    getItem: (k) => (k in lsData ? lsData[k] : null),
    setItem: (k, v) => { lsData[k] = String(v); },
  };
  const sandbox = {
    document,
    localStorage,
    console,
    setTimeout,
    JSON,
    Math,
    Object,
    Array,
    String,
    Number,
    parseInt,
    parseFloat,
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.parent = sandbox;
  sandbox.addEventListener = () => {};
  const ctx = vm.createContext(sandbox);

  for (const f of ['scorm.js', 'content.js', 'app.js']) {
    const code = fs.readFileSync(path.join(moduleDir, f), 'utf8');
    try {
      vm.runInContext(code, ctx, { filename: f });
    } catch (e) {
      findings.push(`FAIL ${f} threw: ${e.message}`);
      return findings;
    }
  }

  const M = sandbox.window.MODULE;
  const el = document.store;
  // scorm.js namespaces the standalone fallback per module; read through the same scheme
  const cmi = (k) => lsData[`scorm:${M.id}:${k}`];

  // 1. first screen rendered, title set, progress sane
  if (!el.screen.children.length) findings.push('FAIL first screen rendered nothing');
  if (el.mtitle.textContent !== M.title) findings.push('FAIL module title not rendered');
  const firstPct = Math.round((1 / M.screens.length) * 100);
  if (el.ptext.textContent !== firstPct + '%') {
    findings.push(`FAIL progress text ${el.ptext.textContent} expected ${firstPct}%`);
  }
  if (!el.prev.disabled) findings.push('FAIL back button enabled on first screen');
  if (harness.lastFocus === null) findings.push('FAIL heading did not receive focus');

  // 2. SCORM wrote initial state
  if (cmi('cmi.core.lesson_status') !== 'incomplete') {
    findings.push(`FAIL initial lesson_status ${cmi('cmi.core.lesson_status')}`);
  }
  if (!cmi('cmi.core.lesson_location')) findings.push('FAIL lesson_location not set');
  if (!cmi('cmi.suspend_data')) findings.push('FAIL suspend_data not written');

  // 3. walk every screen, exercising interactions
  const seenArchetypes = new Set();
  let quizScreens = 0;
  for (let i = 0; i < M.screens.length; i++) {
    const scr = M.screens[i];
    seenArchetypes.add(scr.archetype);
    if (el.screen.dataset.archetype !== (scr.archetype || 'A3')) {
      findings.push(`FAIL ${scr.id} archetype attr ${el.screen.dataset.archetype}`);
    }

    // heading text present
    if (scr.title && !el.screen.textContent.includes(scr.title.slice(0, 20))) {
      findings.push(`FAIL ${scr.id} title missing from render`);
    }

    // asset alt text must be non-empty when an asset is present
    if (scr.asset) {
      const img = el.screen.find((e) => e.tagName === 'IMG');
      if (!img) findings.push(`FAIL ${scr.id} asset declared but no img rendered`);
      else if (!img.alt) findings.push(`FAIL ${scr.id} img has empty alt`);
    }

    if (scr.type === 'choice') {
      const buttons = el.screen.all((e) => e.tagName === 'BUTTON' && e.className === 'choice');
      if (buttons.length !== scr.options.length) {
        findings.push(`FAIL ${scr.id} rendered ${buttons.length} of ${scr.options.length} choices`);
      }
      const anyPressed = buttons.some((b) => b.attrs['aria-pressed'] === 'true');
      if (anyPressed) findings.push(`FAIL ${scr.id} option pre-selected before input`);
      // pick a wrong option first to confirm feedback explains why
      const wrongIdx = scr.options.findIndex((o) => !o.correct);
      if (wrongIdx >= 0) {
        buttons[wrongIdx].onclick();
        const fb = el.screen.find((e) => (e.className || '').includes('feedback'));
        if (!fb || !fb.textContent.trim()) {
          findings.push(`FAIL ${scr.id} no feedback after wrong answer`);
        }
        const after = el.screen.all((e) => e.tagName === 'BUTTON' && e.className === 'choice');
        if (!after.every((b) => b.disabled)) {
          findings.push(`FAIL ${scr.id} choices still enabled after answering`);
        }
        const verdicts = after.filter((b) => b.dataset.verdict);
        if (!verdicts.length) findings.push(`FAIL ${scr.id} no verdict marking after answer`);
      }
    }

    if (scr.type === 'sort') {
      const selects = el.screen.all((e) => e.tagName === 'SELECT');
      if (selects.length !== scr.pairs.length) {
        findings.push(`FAIL ${scr.id} ${selects.length} selects for ${scr.pairs.length} pairs`);
      }
      selects.forEach((s) => {
        if (!s.attrs['aria-label']) findings.push(`FAIL ${scr.id} select without aria-label`);
      });
      // answer every pair correctly and confirm the all-correct feedback
      for (let p = 0; p < scr.pairs.length; p++) {
        const live = el.screen.all((e) => e.tagName === 'SELECT');
        live[p].value = scr.pairs[p].category;
        live[p].onchange();
      }
      const fb = el.screen.find((e) => (e.className || '').includes('feedback'));
      if (!fb) findings.push(`FAIL ${scr.id} no feedback after completing sort`);
      else if (!fb.textContent.includes(`${scr.pairs.length} of ${scr.pairs.length}`)) {
        findings.push(`FAIL ${scr.id} correct sort not scored full: ${fb.textContent.slice(0, 60)}`);
      }
    }

    if (scr.type === 'quiz') {
      quizScreens++;
      if (!el.next.disabled) findings.push(`FAIL ${scr.id} continue enabled before quiz submit`);
      const items = scr.items;
      // answer everything wrong -> expect a failing score and a retry path
      items.forEach((item) => {
        const wrong = item.options.find((o) => !o.correct);
        const btns = el.screen.all((e) => e.tagName === 'BUTTON' && e.className === 'choice');
        const target = btns.find((b) => b.textContent.includes(wrong.text.slice(0, 25)));
        if (target) target.onclick();
      });
      let submit = el.screen.all(
        (e) => e.tagName === 'BUTTON' && (e.className || '').includes('accent'));
      if (!submit.length) findings.push(`FAIL ${scr.id} no submit button`);
      else {
        if (submit[0].disabled) findings.push(`FAIL ${scr.id} submit disabled with all answered`);
        submit[0].onclick();
        const raw = Number(cmi('cmi.core.score.raw'));
        if (raw !== 0) findings.push(`FAIL ${scr.id} all-wrong score was ${raw}, expected 0`);
        if (cmi('cmi.core.lesson_status') !== 'failed') {
          findings.push(`FAIL ${scr.id} status ${cmi('cmi.core.lesson_status')} after failing`);
        }
        const retry = el.screen.all(
          (e) => e.tagName === 'BUTTON' && (e.className || '').includes('ghost'));
        if (!retry.length) findings.push(`FAIL ${scr.id} no retry offered after failure`);
        else retry[0].onclick();
      }
      // now answer everything correctly -> expect 100 and passed
      items.forEach((item) => {
        const right = item.options.find((o) => o.correct);
        if (!right) { findings.push(`FAIL ${item.id} has no correct option`); return; }
        const btns = el.screen.all((e) => e.tagName === 'BUTTON' && e.className === 'choice');
        const target = btns.find((b) => b.textContent.includes(right.text.slice(0, 25)));
        if (target) target.onclick();
      });
      submit = el.screen.all(
        (e) => e.tagName === 'BUTTON' && (e.className || '').includes('accent'));
      if (submit.length) {
        submit[0].onclick();
        const raw = Number(cmi('cmi.core.score.raw'));
        if (raw !== 100) findings.push(`FAIL ${scr.id} all-correct score was ${raw}`);
        if (cmi('cmi.core.lesson_status') !== 'passed') {
          findings.push(`FAIL ${scr.id} status ${cmi('cmi.core.lesson_status')} after passing`);
        }
        if (Number(cmi('cmi.core.score.max')) !== 100) findings.push('FAIL score.max not 100');
        if (Number(cmi('cmi.core.score.min')) !== 0) findings.push('FAIL score.min not 0');
      }
      if (el.next.disabled) findings.push(`FAIL ${scr.id} continue still blocked after submit`);
    }

    if (scr.hotspots) {
      const hots = el.screen.all((e) => e.tagName === 'BUTTON' && e.className === 'hot');
      if (hots.length !== scr.hotspots.length) {
        findings.push(`FAIL ${scr.id} ${hots.length} hotspots for ${scr.hotspots.length}`);
      }
      if (hots.length) {
        if (hots[0].attrs['aria-expanded'] !== 'false') {
          findings.push(`FAIL ${scr.id} hotspot not collapsed initially`);
        }
        hots[0].onclick();
        const open = el.screen.all((e) => e.tagName === 'BUTTON' && e.className === 'hot');
        if (open[0].attrs['aria-expanded'] !== 'true') {
          findings.push(`FAIL ${scr.id} hotspot did not expand`);
        }
        const detail = el.screen.find((e) => (e.className || '') === 'hot-body');
        if (!detail || !detail.textContent.trim()) {
          findings.push(`FAIL ${scr.id} hotspot revealed no detail`);
        }
      }
    }

    // claim note must render whenever the screen declares claims
    if (scr.claims && scr.claims.length) {
      const note = el.screen.find((e) => (e.className || '') === 'claim');
      if (!note) findings.push(`FAIL ${scr.id} declares claims but renders no source note`);
    }

    // advance
    const isLast = i === M.screens.length - 1;
    if (isLast) {
      if (el.next.textContent !== 'Finish') findings.push('FAIL last screen button is not Finish');
      el.next.onclick();
      const st = cmi('cmi.core.lesson_status');
      if (!['passed', 'completed', 'failed'].includes(st)) {
        findings.push(`FAIL terminal status ${st}`);
      }
      if (st === 'failed') findings.push('FAIL module ended failed after correct answers');
    } else {
      el.next.onclick();
    }
  }

  // 4. progress honesty and archetype variety
  if (el.ptext.textContent !== '100%') {
    findings.push(`FAIL final progress ${el.ptext.textContent} not 100%`);
  }
  if (quizScreens !== 1) findings.push(`FAIL expected exactly 1 quiz screen, found ${quizScreens}`);
  if (seenArchetypes.size < 4) {
    findings.push(`FAIL only ${seenArchetypes.size} distinct archetypes (min 4)`);
  }
  const arche = M.screens.map((s) => s.archetype);
  for (let i = 2; i < arche.length; i++) {
    if (arche[i] === arche[i - 1] && arche[i] === arche[i - 2]) {
      findings.push(`FAIL 3 consecutive ${arche[i]} screens`);
    }
  }

  // 5. resume: fresh context reading the same suspend_data must restore position
  const doc2 = buildDocument(ids);
  const sandbox2 = Object.assign({}, sandbox, { document: doc2 });
  sandbox2.window = sandbox2;
  sandbox2.parent = sandbox2;
  sandbox2.self = sandbox2;
  sandbox2.localStorage = { getItem: (k) => (k in lsData ? lsData[k] : null), setItem: () => {} };
  const ctx2 = vm.createContext(sandbox2);
  try {
    for (const f of ['scorm.js', 'content.js', 'app.js']) {
      vm.runInContext(fs.readFileSync(path.join(moduleDir, f), 'utf8'), ctx2, { filename: f });
    }
    const loc = JSON.parse(cmi('cmi.suspend_data')).i;
    if (doc2.store.ptext.textContent !== Math.round(((loc + 1) / M.screens.length) * 100) + '%') {
      findings.push('FAIL resume did not restore saved position');
    }
  } catch (e) {
    findings.push(`FAIL resume threw: ${e.message}`);
  }

  return findings;
}

const targets = process.argv.slice(2);
let failed = 0;
const report = {};
for (const t of targets) {
  const name = path.basename(t);
  const f = run(t);
  report[name] = f;
  const pad = name.padEnd(15);
  if (f.length) {
    failed++;
    console.log(`${pad} FAILED`);
    f.forEach((x) => console.log(`    ${x}`));
  } else {
    console.log(`${pad} PASS`);
  }
}

// Cross-module isolation: all modules in a package set are served from one origin,
// so the standalone localStorage fallback must be namespaced per module. Run two
// modules against ONE shared store and confirm the second starts fresh.
if (targets.length >= 2) {
  const shared = {};
  const findings = [];
  const ids = ['screen', 'map', 'prog', 'ptext', 'objective', 'prev', 'next', 'status', 'mtitle'];
  const results = [];
  for (const t of targets.slice(0, 2)) {
    const document = buildDocument(ids);
    const sandbox = {
      document, console, setTimeout, JSON, Math, Object, Array, String, Number,
      parseInt, parseFloat,
      localStorage: {
        getItem: (k) => (k in shared ? shared[k] : null),
        setItem: (k, v) => { shared[k] = String(v); },
      },
    };
    sandbox.window = sandbox;
    sandbox.self = sandbox;
    sandbox.parent = sandbox;
    sandbox.addEventListener = () => {};
    const ctx = vm.createContext(sandbox);
    for (const f of ['scorm.js', 'content.js', 'app.js']) {
      vm.runInContext(fs.readFileSync(path.join(t, f), 'utf8'), ctx, { filename: f });
    }
    // advance a few screens so this module leaves a saved position behind
    for (let i = 0; i < 4; i++) document.store.next.onclick();
    results.push({ name: path.basename(t), pct: document.store.ptext.textContent });
  }
  // reopen the second module fresh against the same store: it must resume ITS OWN
  // position, and the first module's keys must not have been overwritten
  const document = buildDocument(ids);
  const sandbox = {
    document, console, setTimeout, JSON, Math, Object, Array, String, Number,
    parseInt, parseFloat,
    localStorage: {
      getItem: (k) => (k in shared ? shared[k] : null),
      setItem: (k, v) => { shared[k] = String(v); },
    },
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.parent = sandbox;
  sandbox.addEventListener = () => {};
  const ctx = vm.createContext(sandbox);
  for (const f of ['scorm.js', 'content.js', 'app.js']) {
    vm.runInContext(fs.readFileSync(path.join(targets[0], f), 'utf8'), ctx, { filename: f });
  }
  const firstName = path.basename(targets[0]);
  const expected = results.find((r) => r.name === firstName).pct;
  if (document.store.ptext.textContent !== expected) {
    findings.push(`FAIL ${firstName} reopened at ${document.store.ptext.textContent}, ` +
      `expected its own saved ${expected} - state is leaking between modules`);
  }
  const scoped = Object.keys(shared).every((k) => k.startsWith('scorm:'));
  if (!scoped) {
    findings.push(`FAIL unscoped storage keys present: ${Object.keys(shared).filter((k) => !k.startsWith('scorm:')).join(', ')}`);
  }
  report['_cross_module_isolation'] = findings;
  if (findings.length) {
    failed++;
    console.log('cross-module     FAILED');
    findings.forEach((x) => console.log(`    ${x}`));
  } else {
    console.log('cross-module    PASS');
  }
}

fs.writeFileSync(path.join(__dirname, 'runtime-qa-results.json'), JSON.stringify(report, null, 2));
console.log(failed ? `\n${failed} check(s) failed runtime QA` : '\nall modules passed runtime QA');
process.exit(failed ? 1 : 0);
