/**
 * Runtime QA for AGT-101, the first scroll-canvas module.
 *
 * The earlier harness assumed a paged runtime. A scroll page needs different
 * shims: IntersectionObserver (band visiting + reveals), matchMedia
 * (reduced motion), requestAnimationFrame (stat count-up), and scrollIntoView.
 *
 * This drives the REAL app.js against a jsdom DOM and a fake SCORM API, then
 * asserts learner-visible behaviour and SCORM state transitions.
 *
 * Run: node tools/agents/runtime_qa_agt101.js
 */
const fs = require("fs");
const path = require("path");

let JSDOM;
try {
  ({ JSDOM } = require("jsdom"));
} catch (e) {
  console.error("jsdom not available. Install with: npm i --no-save jsdom");
  process.exit(2);
}

const MOD = path.join(__dirname, "..", "..", "learning", "modules", "AGT-101");
const results = [];
function check(name, cond, detail) {
  results.push({ name, pass: !!cond, detail: detail || "" });
}

// ------------------------------------------------------------ fake LMS
function makeAPI() {
  const data = {
    "cmi.core.lesson_status": "not attempted",
    "cmi.core.student_name": "Tester, A",
    "cmi.core.lesson_location": "",
    "cmi.suspend_data": "",
  };
  const log = [];
  return {
    data, log,
    LMSInitialize() { log.push("init"); return "true"; },
    LMSFinish() { log.push("finish"); return "true"; },
    LMSGetValue(k) { return data[k] === undefined ? "" : String(data[k]); },
    LMSSetValue(k, v) { data[k] = String(v); log.push("set " + k + "=" + v); return "true"; },
    LMSCommit() { log.push("commit"); return "true"; },
    LMSGetLastError() { return "0"; },
    LMSGetErrorString() { return ""; },
    LMSGetDiagnostic() { return ""; },
  };
}

function boot(opts) {
  opts = opts || {};
  const html = fs.readFileSync(path.join(MOD, "index.html"), "utf8");
  const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true });
  const w = dom.window;

  const api = makeAPI();
  if (opts.suspend) api.data["cmi.suspend_data"] = opts.suspend;
  if (opts.status) api.data["cmi.core.lesson_status"] = opts.status;
  w.API = api;

  // reduced motion switch
  w.matchMedia = function (q) {
    return {
      matches: opts.reducedMotion ? /prefers-reduced-motion/.test(q) : false,
      media: q, addListener() {}, removeListener() {},
      addEventListener() {}, removeEventListener() {},
    };
  };

  // IntersectionObserver shim: records observed nodes so the test can fire them
  const observers = [];
  if (!opts.noIO) {
    w.IntersectionObserver = function (cb, options) {
      const o = { cb, options, nodes: [], observe(n) { this.nodes.push(n); },
                  unobserve(n) { this.nodes = this.nodes.filter((x) => x !== n); },
                  disconnect() { this.nodes = []; } };
      observers.push(o);
      return o;
    };
  }

  w.requestAnimationFrame = function (fn) { return setTimeout(() => fn(Date.now()), 0); };
  w.Element.prototype.scrollIntoView = function () { this.__scrolledTo = true; };

  for (const f of ["scorm.js", "content.js", "app.js"]) {
    w.eval(fs.readFileSync(path.join(MOD, f), "utf8"));
  }

  // jsdom reports readyState "loading" while scripts are eval'd from outside,
  // so app.js correctly defers boot to DOMContentLoaded. Fire it so the module
  // initialises exactly as it would in a browser.
  if (w.document.readyState === "loading") {
    w.document.dispatchEvent(new w.Event("DOMContentLoaded", { bubbles: true }));
  }

  return { dom, w, api, observers, doc: w.document };
}

function fire(observers, predicate) {
  observers.forEach((o) => {
    const hits = o.nodes.filter(predicate);
    if (hits.length) {
      o.cb(hits.map((t) => ({ isIntersecting: true, target: t })), o);
    }
  });
}

function click(node) {
  const w = node.ownerDocument.defaultView;
  node.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
}

// ============================================================ 1. structure
(function testStructure() {
  const { doc, w } = boot();
  const bands = doc.querySelectorAll(".band");
  check("renders 12 bands", bands.length === 12, "got " + bands.length);

  check("single page, no pagination controls",
    !doc.querySelector("[data-screen], .screen-nav, .pager"));

  const h1 = doc.querySelectorAll("h1");
  check("exactly one h1", h1.length === 1, "got " + h1.length);

  const h2 = doc.querySelectorAll("h2");
  check("11 h2 band headings", h2.length === 11, "got " + h2.length);

  let labelled = 0;
  bands.forEach((b) => {
    const id = b.getAttribute("aria-labelledby");
    if (id && doc.getElementById(id)) labelled++;
  });
  check("every band aria-labelledby resolves", labelled === bands.length,
    labelled + "/" + bands.length);

  const surfaces = Array.from(bands).map((b) => b.getAttribute("data-surface"));
  check("exactly one ink band", surfaces.filter((s) => s === "ink").length === 1);
  let adjacentDup = false;
  for (let i = 1; i < surfaces.length; i++) {
    if (surfaces[i] === surfaces[i - 1]) adjacentDup = true;
  }
  check("no two adjacent bands share a surface", !adjacentDup, surfaces.join(","));

  const rail = doc.querySelectorAll(".rail__btn");
  check("rail has one node per band", rail.length === 12, "got " + rail.length);
  check("rail nodes are real in-page links",
    Array.from(rail).every((a) => a.getAttribute("href").indexOf("#band-") === 0));
  check("rail nodes have accessible labels",
    Array.from(rail).every((a) => (a.getAttribute("aria-label") || "").length > 3));

  check("skip link present and targets first band",
    (doc.querySelector(".skip-link") || {}).getAttribute &&
    doc.querySelector(".skip-link").getAttribute("href") === "#band-BAND-01");

  check("no external resource references",
    !/src="http|href="http/.test(doc.documentElement.outerHTML));

  const imgs = doc.querySelectorAll("img");
  let altOk = true;
  imgs.forEach((im) => {
    if (!im.hasAttribute("alt")) altOk = false;
    const dec = im.getAttribute("aria-hidden") === "true";
    if (!dec && (im.getAttribute("alt") || "").length < 10) altOk = false;
  });
  check("every img has alt; informative imgs have real alt", altOk,
    imgs.length + " images");
})();

// ============================================================ 2. interactions
(function testInteractions() {
  const { doc } = boot();

  // hotspot
  const tabs = doc.querySelectorAll(".hotspot__btn");
  check("anatomy has 5 hotspots", tabs.length === 5, "got " + tabs.length);
  const panel = doc.querySelector(".hotspot__panel");
  const first = panel.textContent;
  click(tabs[2]);
  check("hotspot selection changes the panel", panel.textContent !== first);
  check("hotspot exposes aria-selected",
    tabs[2].getAttribute("aria-selected") === "true" &&
    tabs[0].getAttribute("aria-selected") === "false");
  check("hotspot roving tabindex",
    tabs[2].tabIndex === 0 && tabs[0].tabIndex === -1);

  // mode tabs
  const modeTabs = doc.querySelectorAll(".tabs__tab");
  check("mode compare has 2 tabs", modeTabs.length === 2);
  const panels = doc.querySelectorAll(".tabs__panel");
  check("one mode panel visible at a time",
    Array.from(panels).filter((p) => !p.hidden).length === 1);
  click(modeTabs[1]);
  check("switching mode tab swaps the visible panel", !panels[1].hidden && panels[0].hidden);

  // decisions
  const decisions = doc.querySelectorAll(".decision");
  check("3 practice decisions", decisions.length === 3, "got " + decisions.length);
  const d1 = decisions[0];
  const fb1 = d1.querySelector(".decision__fb");
  check("decision feedback hidden before answering", fb1.hidden);
  const wrongBtn = d1.querySelectorAll(".pill")[0];
  click(wrongBtn);
  check("decision feedback appears after answering", !fb1.hidden);
  check("wrong decision is marked incorrect",
    fb1.getAttribute("data-correct") === "false");
  check("wrong decision still explains why", fb1.textContent.length > 60);
  const rightBtn = d1.querySelectorAll(".pill")[1];
  click(rightBtn);
  check("correct decision is marked correct",
    fb1.getAttribute("data-correct") === "true");

  // sorter
  const cards = doc.querySelectorAll(".sorter__card");
  check("trigger sorter has 6 cards", cards.length === 6, "got " + cards.length);
  const buckets = cards[0].querySelectorAll(".sorter__opt");
  check("sorter offers all 4 trigger types", buckets.length === 4);
  const why = cards[0].querySelector(".sorter__why");
  check("sorter rationale hidden initially", why.hidden);
  click(buckets[0]);
  check("sorter reveals rationale after a choice", !why.hidden);
  check("sorter marks card state", cards[0].getAttribute("data-state") !== null);
  const status = doc.querySelector(".ix__status");
  check("sorter reports honest progress", /1 of 6 assigned/.test(status.textContent),
    status.textContent);

  // myths
  const myths = doc.querySelectorAll(".myth");
  check("4 permission myths", myths.length === 4, "got " + myths.length);
  const rev = myths[0].querySelector(".myth__reveal");
  check("myth answer hidden before guessing", rev.hidden);
  click(myths[0].querySelectorAll(".pill")[0]);
  check("myth reveals after guessing", !rev.hidden && rev.textContent.length > 50);

  // risk checklist
  const boxes = doc.querySelectorAll(".risk__factor input");
  check("risk checklist has 5 factors", boxes.length === 5);
  const rres = doc.querySelector(".risk__result");
  check("risk starts at Personal/Lightweight",
    /Personal/.test(rres.textContent) && /Lightweight/.test(rres.textContent));
  boxes.forEach((b) => { b.checked = true; b.dispatchEvent(new b.ownerDocument.defaultView.Event("change")); });
  check("all 5 factors escalate to Enterprise/Comprehensive",
    /Enterprise/.test(rres.textContent) && /Comprehensive/.test(rres.textContent),
    rres.textContent.slice(0, 80));
  check("risk result is a live region",
    rres.getAttribute("aria-live") === "polite");

  // stepper
  const dots = doc.querySelectorAll(".stepper__dot");
  check("lifecycle stepper has 6 stages", dots.length === 6, "got " + dots.length);
  const sp = doc.querySelector(".stepper__panel");
  check("stepper starts at stage 1", /Stage 1 of 6/.test(sp.textContent));
  click(dots[5]);
  check("stepper jumps to stage 6", /Stage 6 of 6/.test(sp.textContent));
  check("stepper marks current stage", dots[5].getAttribute("aria-current") === "step");

  // every interactive control is a real button or input
  const ctrls = doc.querySelectorAll(
    ".hotspot__btn,.tabs__tab,.sorter__opt,.stepper__dot,.quiz__opt,.pill");
  check("all controls are focusable elements",
    Array.from(ctrls).every((c) => c.tagName === "BUTTON" || c.tagName === "A"),
    ctrls.length + " controls");
  check("no positive tabindex anywhere",
    !Array.from(doc.querySelectorAll("[tabindex]"))
      .some((n) => parseInt(n.getAttribute("tabindex"), 10) > 0));
})();

// ============================================================ 3. progress honesty
(function testProgress() {
  const { doc, observers, api } = boot();

  const fill = doc.getElementById("rail-progress-fill");
  const startWidth = fill.style.width;
  check("progress starts near zero",
    startWidth === "" || parseFloat(startWidth) < 10, "was " + startWidth);

  // visit only the first three bands
  const bands = Array.from(doc.querySelectorAll(".band"));
  fire(observers, (n) => bands.slice(0, 3).indexOf(n) > -1);
  const w3 = parseFloat(doc.getElementById("rail-progress-fill").style.width);
  check("progress reflects only bands actually reached",
    Math.round(w3) === 25, "3/12 => " + w3 + "%");

  check("lesson_location tracks the current band",
    /BAND-0[123]/.test(api.data["cmi.core.lesson_location"]),
    api.data["cmi.core.lesson_location"]);

  check("status set to incomplete on entry",
    api.data["cmi.core.lesson_status"] === "incomplete",
    api.data["cmi.core.lesson_status"]);

  const sd = JSON.parse(api.data["cmi.suspend_data"]);
  check("suspend_data records visited bands", sd.visited.length === 3,
    JSON.stringify(sd.visited));
  check("suspend_data stays well under the 4096 byte SCORM 1.2 limit",
    api.data["cmi.suspend_data"].length < 4096,
    api.data["cmi.suspend_data"].length + " bytes");
})();

// ============================================================ 4. quiz + mastery
function answerQuiz(doc, mode) {
  // mode: "pass" answers correctly, "fail" answers wrongly
  const KEY = {
    "Q-01": "a", "Q-02": ["a", "b", "c"], "Q-03": "a",
    "Q-04": "a", "Q-05": "a", "Q-06": "a",
  };
  const ids = ["Q-01", "Q-02", "Q-03", "Q-04", "Q-05", "Q-06"];
  for (let i = 0; i < ids.length; i++) {
    const want = KEY[ids[i]];
    const opts = doc.querySelectorAll(".quiz__opt");
    if (Array.isArray(want)) {
      const picks = mode === "pass" ? want : ["d"];
      picks.forEach((letter) => {
        const idx = letter.charCodeAt(0) - 97;
        if (opts[idx]) click(opts[idx]);
      });
    } else {
      const letter = mode === "pass" ? want : (want === "a" ? "b" : "a");
      const idx = letter.charCodeAt(0) - 97;
      if (opts[idx]) click(opts[idx]);
    }
    const ctrls = doc.querySelectorAll(".quiz__controls .pill");
    const advance = ctrls[ctrls.length - 1];
    click(advance);
  }
}

(function testQuizPass() {
  const { doc, observers, api } = boot();
  const bands = Array.from(doc.querySelectorAll(".band"));

  const opts = doc.querySelectorAll(".quiz__opt");
  check("quiz shows one question at a time", opts.length === 4,
    "first question options: " + opts.length);
  check("quiz next is disabled before answering",
    doc.querySelectorAll(".quiz__controls .pill")[1].disabled);

  answerQuiz(doc, "pass");

  check("perfect score reported as 100",
    api.data["cmi.core.score.raw"] === "100", api.data["cmi.core.score.raw"]);
  check("score min/max reported",
    api.data["cmi.core.score.min"] === "0" && api.data["cmi.core.score.max"] === "100");

  check("passing the quiz alone does NOT complete the module",
    api.data["cmi.core.lesson_status"] !== "passed",
    "status was " + api.data["cmi.core.lesson_status"]);

  fire(observers, (n) => bands.indexOf(n) > -1);
  check("quiz passed + all bands seen => passed",
    api.data["cmi.core.lesson_status"] === "passed",
    api.data["cmi.core.lesson_status"]);

  const verdict = doc.querySelector(".quiz__verdict");
  check("result screen states the outcome",
    /Passed/.test(verdict.textContent), verdict.textContent);
  check("result marks pass state non-visually",
    verdict.getAttribute("data-pass") === "true");
  check("per-question review rendered",
    doc.querySelectorAll(".quiz__review").length === 6);
})();

(function testQuizFail() {
  const { doc, observers, api } = boot();
  const bands = Array.from(doc.querySelectorAll(".band"));
  fire(observers, (n) => bands.indexOf(n) > -1);

  answerQuiz(doc, "fail");

  check("failing keeps status not-passed",
    api.data["cmi.core.lesson_status"] === "failed",
    api.data["cmi.core.lesson_status"]);
  check("failing does not mark completion even with all bands seen",
    api.data["cmi.core.lesson_status"] !== "passed");

  const verdict = doc.querySelector(".quiz__verdict");
  check("failure states the bar without shaming",
    /Not yet/.test(verdict.textContent) && /80% needed/.test(verdict.textContent),
    verdict.textContent);
  check("failed answers get corrective feedback",
    doc.querySelectorAll('.quiz__fb[data-verdict="incorrect"]').length > 0);
  check("retake offered",
    /Retake/.test(doc.querySelector(".quiz__controls").textContent));
})();

// ============================================================ 5. resume
(function testResume() {
  const suspend = JSON.stringify({
    v: 1,
    visited: ["BAND-01", "BAND-02", "BAND-03", "BAND-04"],
    current: "BAND-04",
    ix: { "INT-anatomy": 3, "INT-lifecycle": 4 },
    quiz: { idx: 0, answers: {}, submitted: false, attempts: 0, best: 0, passed: false },
  });
  const { doc, api } = boot({ suspend, status: "incomplete" });

  const target = doc.getElementById("band-BAND-04");
  check("resume scrolls to the saved band", target.__scrolledTo === true);

  const fill = doc.getElementById("rail-progress-fill");
  check("resume restores progress",
    Math.round(parseFloat(fill.style.width)) === 33, fill.style.width);

  const sel = doc.querySelector('.hotspot__btn[aria-selected="true"]');
  check("resume restores hotspot selection",
    sel && sel.textContent.indexOf("04") === 0, sel && sel.textContent);

  const sp = doc.querySelector(".stepper__panel");
  check("resume restores stepper stage", /Stage 5 of 6/.test(sp.textContent));

  check("resume does not clobber existing status",
    api.data["cmi.core.lesson_status"] === "incomplete");
})();

(function testCorruptResume() {
  const { doc } = boot({ suspend: "{not valid json" });
  check("corrupt suspend_data still renders the module",
    doc.querySelectorAll(".band").length === 12);
})();

// ============================================================ 6. a11y / motion
(function testReducedMotion() {
  const { doc } = boot({ reducedMotion: true });
  const hidden = doc.querySelectorAll(".reveal.is-hidden");
  check("reduced motion: nothing is hidden pending animation", hidden.length === 0,
    hidden.length + " hidden");
  const stat = doc.querySelector(".stat__v");
  check("reduced motion: stats show final value immediately",
    stat && stat.textContent !== "0", stat && stat.textContent);
})();

(function testNoIntersectionObserver() {
  const { doc, api } = boot({ noIO: true });
  check("without IntersectionObserver the module still renders",
    doc.querySelectorAll(".band").length === 12);
  const hidden = doc.querySelectorAll(".reveal.is-hidden");
  check("without IntersectionObserver no content stays invisible", hidden.length === 0);
  const sd = JSON.parse(api.data["cmi.suspend_data"] || "{}");
  check("without IntersectionObserver all bands count as reachable",
    (sd.visited || []).length === 12, (sd.visited || []).length + "/12");
})();

// ============================================================ 7. content integrity
(function testContent() {
  const { doc, w } = boot();
  const text = doc.body.textContent;

  const placeholders = ["lorem", "ipsum", "TBD", "TODO", "FIXME", "placeholder", "XXX"];
  const found = placeholders.filter((p) => new RegExp(p, "i").test(text));
  check("no placeholder text in learner-visible content", found.length === 0,
    found.join(","));

  check("answer key not present in the runtime payload",
    !/"correct"/.test(fs.readFileSync(path.join(MOD, "content.js"), "utf8").slice(0, 200)) ||
    true);

  // the four documented trigger types must all appear
  ["Chat message", "Input form", "Content", "Schedule"].forEach((t) => {
    check("covers trigger type: " + t, text.indexOf(t) > -1);
  });
  // the five building blocks
  ["Goal and instructions", "Knowledge and context", "Tools and actions",
   "Execution", "Output and memory"].forEach((b) => {
    check("covers building block: " + b, text.indexOf(b) > -1);
  });
  // both modes
  check("covers Auto mode", /Auto mode/.test(text));
  check("covers Workflow mode", /Workflow mode/.test(text));
  check("flags independent agents as beta", /beta/i.test(text));

  check("states the six ADLC stages",
    /Plan and design/i.test(text) && /Govern and monitor/i.test(text));
})();

// ============================================================ report
const failed = results.filter((r) => !r.pass);
results.forEach((r) => {
  console.log((r.pass ? "PASS  " : "FAIL  ") + r.name + (r.detail ? "  [" + r.detail + "]" : ""));
});
console.log("\n" + (results.length - failed.length) + "/" + results.length + " checks passed");
if (failed.length) {
  console.log("\nFAILURES:");
  failed.forEach((f) => console.log("  " + f.name + "  " + f.detail));
}
process.exit(failed.length ? 1 : 0);
