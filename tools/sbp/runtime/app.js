/* Sales Blueprinting runtime (single-page module, paged-v1 tokens and styles).
   Each module is one scrolling page: overview, full lessons, toolkit, and the check.
   Implements the workbook SCORM Build Spec: B07 init/resume, B08 score and status,
   B09 compact suspend data, B10 commit/exit, B11 interactions, B12 draw and shuffle,
   B13 attempts, B14 accessibility. Offline; no network calls. */
(function () {
  "use strict";
  var M = window.MODULE, S = window.SCORM;
  var el = {
    page: document.getElementById("screen"), map: document.getElementById("map"),
    prog: document.getElementById("prog"), ptext: document.getElementById("ptext"),
    top: document.getElementById("top"), finish: document.getElementById("finish"),
    status: document.getElementById("status"), title: document.getElementById("mtitle"),
    track: document.getElementById("track"), where: document.getElementById("where")
  };
  var N = M.screens.length;
  var state = { i: 0, vis: {}, att: 0, q: null, hist: [], st: "" };
  var mem = { formative: {}, confirm: false, roi: null };
  var started = Date.now();
  var secs = [];      // section elements, index-aligned with M.screens
  var heads = [];     // section headings (focus targets)
  var bodies = [];    // re-renderable section bodies
  var saveTimer = null;

  // ---------------------------------------------------------------- helpers
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function btn(cls, text, fn) {
    var b = h("button", cls, text);
    b.type = "button";
    b.onclick = fn;
    return b;
  }
  // Inline **bold** only; everything else is plain text (no HTML injection).
  function inline(node, text) {
    String(text).split(/(\*\*[^*]+\*\*)/).forEach(function (part) {
      if (!part) return;
      if (/^\*\*[^*]+\*\*$/.test(part)) node.appendChild(h("strong", null, part.slice(2, -2)));
      else node.appendChild(document.createTextNode(part));
    });
    return node;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(list, r) {
    var a = list.slice();
    for (var k = a.length - 1; k > 0; k--) {
      var j = Math.floor(r() * (k + 1));
      var t = a[k]; a[k] = a[j]; a[j] = t;
    }
    return a;
  }
  function pad(n, w) { n = String(n); while (n.length < w) n = "0" + n; return n; }
  function timespan(ms) {
    var cs = Math.max(0, Math.round(ms / 10));
    var hh = Math.floor(cs / 360000), mm = Math.floor(cs / 6000) % 60;
    var ss = Math.floor(cs / 100) % 60, c = cs % 100;
    return pad(Math.min(hh, 9999), 4) + ":" + pad(mm, 2) + ":" + pad(ss, 2) + "." + pad(c, 2);
  }
  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  var BANK = {};
  (M.bank || []).concat(M.knowledge_checks || []).forEach(function (q) { BANK[q.id] = q; });
  function isCheck(k) { return M.screens[k].type === "quiz"; }

  // ---------------------------------------------------------------- persistence
  function visitedString() {
    var s = "";
    for (var k = 0; k < N; k++) s += state.vis[k] ? "1" : "0";
    return s;
  }
  // Every section read; graded checks count once submitted. exceptLast skips the check itself.
  function allVisited(exceptLast) {
    var stop = exceptLast ? N - 1 : N;
    for (var k = 0; k < stop; k++) if (!state.vis[k]) return false;
    return true;
  }
  function unvisited() {
    var out = [];
    for (var k = 0; k < N; k++) if (!state.vis[k] && !isCheck(k)) out.push(k);
    return out;
  }
  function payload() {
    var d = { v: 3, m: M.id, ver: M.version, i: state.i, vis: visitedString(), att: state.att,
              q: state.q, hist: state.hist, st: state.st };
    var s = JSON.stringify(d);
    if (s.length > 4000) { d.hist = []; s = JSON.stringify(d); }
    return s;
  }
  function save(status) {
    S.set("cmi.core.lesson_location", M.screens[state.i].id);
    S.set("cmi.suspend_data", payload());
    if (status) { state.st = status; S.set("cmi.core.lesson_status", status); }
    S.commit();
  }
  function saveSoon() {
    if (saveTimer) return;
    saveTimer = setTimeout(function () { saveTimer = null; if (!S.isFinished()) save(); }, 800);
  }
  function restore() {
    var raw = S.get("cmi.suspend_data");
    if (!raw) return;
    try {
      var d = JSON.parse(raw);
      if (!d || d.m !== M.id || (d.v !== 3 && d.v !== 2)) return;
      // v2 (paged build) used a different screen list; keep attempts and status, not progress.
      if (d.v === 3) {
        state.i = Math.max(0, Math.min(d.i || 0, N - 1));
        for (var k = 0; k < N && d.vis && k < d.vis.length; k++) if (d.vis.charAt(k) === "1") state.vis[k] = true;
      }
      state.att = d.att || 0;
      state.hist = d.hist || [];
      state.st = d.st || "";
      // Discard an in-progress attempt that references items no longer in this version.
      if (d.q && d.q.ids && d.q.ids.every(function (id) { return BANK[id]; })) state.q = d.q;
    } catch (e) { state.i = 0; }
  }
  function lmsStatus() { return S.get("cmi.core.lesson_status") || ""; }

  // ---------------------------------------------------------------- assessment
  function newAttempt() {
    var seed = (typeof window.SBP_SEED === "number") ? window.SBP_SEED + state.att
      : (Date.now() ^ Math.floor(Math.random() * 4294967296)) >>> 0;
    var r = rng(seed), ids = [];
    if (M.kind === "final") {
      Object.keys(M.final_draws).forEach(function (mid) {
        var pool = M.bank.filter(function (q) { return q.module === mid; }).map(function (q) { return q.id; });
        ids = ids.concat(shuffle(pool, r).slice(0, M.final_draws[mid]));
      });
    } else {
      ids = shuffle(M.bank.map(function (q) { return q.id; }), r).slice(0, M.draw);
    }
    var ord = {};
    ids.forEach(function (id) {
      ord[id] = shuffle(BANK[id].options.map(function (o) { return o.id; }), r).join("");
    });
    state.q = { seed: seed, ids: ids, ord: ord, ans: {}, sub: false, right: 0, n: ids.length, t0: Date.now() };
    mem.confirm = false;
  }
  function optionById(q, id) {
    return q.options.filter(function (o) { return o.id === id; })[0];
  }
  function recordInteractions(q) {
    var base = 0;
    try { base = parseInt(S.get("cmi.interactions._count"), 10) || 0; } catch (e) { base = 0; }
    var lat = timespan(Date.now() - (q.t0 || Date.now()));
    q.ids.forEach(function (id, n) {
      var pick = q.ans[id] || "";
      var right = pick && optionById(BANK[id], pick).correct;
      var p = "cmi.interactions." + (base + n) + ".";
      S.set(p + "id", id);
      S.set(p + "type", "choice");
      S.set(p + "student_response", pick);
      S.set(p + "result", right ? "correct" : "wrong");
      S.set(p + "weighting", "1");
      S.set(p + "latency", lat);
    });
  }
  function grade(k) {
    var q = state.q;
    var right = q.ids.filter(function (id) {
      var pick = q.ans[id];
      return pick && optionById(BANK[id], pick).correct;
    }).length;
    q.right = right;
    q.sub = true;
    state.att += 1;
    var passed = allVisited(true) && right * 100 >= M.mastery * q.n;
    var raw = Math.round((right * 10000) / q.n) / 100;
    state.hist.push({ r: right, n: q.n });
    S.set("cmi.core.score.min", "0");
    S.set("cmi.core.score.max", "100");
    S.set("cmi.core.score.raw", String(raw));
    recordInteractions(q);
    state.vis[k] = true;
    state.i = k;
    save(passed ? "passed" : "failed");
    el.status.textContent = "Assessment scored " + right + " of " + q.n + ". " + (passed ? "Passed." : "Not yet passed.");
    refresh(k, ".result");
    updateChrome();
  }

  // ---------------------------------------------------------------- block renderers
  function renderTable(t, host) {
    var wrap = h("div", "tbl-wrap");
    wrap.tabIndex = 0;
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", t.caption);
    var tbl = h("table", "tbl");
    tbl.appendChild(h("caption", null, t.caption));
    var thead = h("thead"), hr = h("tr");
    t.head.forEach(function (c) { var th = inline(h("th"), c); th.scope = "col"; hr.appendChild(th); });
    thead.appendChild(hr);
    tbl.appendChild(thead);
    var tb = h("tbody");
    t.rows.forEach(function (r) {
      var tr = h("tr");
      r.forEach(function (c, n) {
        var cell = inline(h(n === 0 ? "th" : "td"), c);
        if (n === 0) cell.scope = "row";
        tr.appendChild(cell);
      });
      tb.appendChild(tr);
    });
    tbl.appendChild(tb);
    wrap.appendChild(tbl);
    host.appendChild(wrap);
  }
  function renderBlocks(blocks, host) {
    (blocks || []).forEach(function (b) {
      if (b.t === "p") host.appendChild(inline(h("p"), b.x));
      else if (b.t === "h3") host.appendChild(h("h3", null, b.x));
      else if (b.t === "ul" || b.t === "ol") {
        var list = h(b.t, "bullets");
        b.items.forEach(function (x) { list.appendChild(inline(h("li"), x)); });
        host.appendChild(list);
      } else if (b.t === "callout") {
        var c = h("aside", "callout");
        var p = h("p");
        p.appendChild(h("strong", null, b.label + ": "));
        inline(p, b.x);
        c.appendChild(p);
        host.appendChild(c);
      } else if (b.t === "table") renderTable(b, host);
      else if (b.t === "figure") renderFigure(b, host);
    });
  }
  // Original SVG diagram: wide layout on desktop, single-column layout below 640px.
  function renderFigure(b, host) {
    var fig = h("figure", "fig");
    var pic = h("picture");
    if (b.narrow) {
      var src = h("source");
      src.setAttribute("media", "(max-width: 640px)");
      src.setAttribute("srcset", b.narrow);
      pic.appendChild(src);
    }
    var img = h("img");
    img.src = b.wide;
    img.alt = b.alt;
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    pic.appendChild(img);
    fig.appendChild(pic);
    if (b.caption) fig.appendChild(inline(h("figcaption"), b.caption));
    host.appendChild(fig);
  }
  function renderCards(cards, host) {
    var wrap = h("div", "a-cards");
    cards.forEach(function (c) {
      var card = h("article", "card");
      if (c.tag) card.appendChild(h("span", "tag", c.tag));
      card.appendChild(h("h3", null, c.title));
      (c.lines || []).forEach(function (l) {
        var p = h("p");
        if (l.label) { p.appendChild(h("strong", null, l.label + ": ")); }
        p.appendChild(document.createTextNode(l.text));
        card.appendChild(p);
      });
      wrap.appendChild(card);
    });
    host.appendChild(wrap);
  }

  // One four-option, single-answer formative knowledge check per lesson. It is intentionally
  // ungraded: only module quizzes and the final exam write LMS scores or interactions.
  function renderKnowledgeCheck(scr, host, k) {
    var q = BANK[scr.knowledge_check];
    var f = mem.formative[q.id] || {};
    var box = h("div", "practice knowledge-check");
    box.appendChild(h("h3", null, "Knowledge check"));
    var order = q.options.map(function (o) { return o.id; }).join("");
    var ok = !!(f.checked && optionById(q, f.pick).correct);
    var fs = radioItem(q, order, f.pick, ok, function (oid) {
      f.pick = oid;
      // An incorrect formative response stays retryable. Clear its stale feedback as soon
      // as the learner chooses another option; a correct response remains locked.
      if (f.checked) {
        f.checked = false;
        mem.formative[q.id] = f;
        refresh(k, "#r-" + q.id + "-" + oid);
      } else mem.formative[q.id] = f;
    }, box, 0);
    if (!ok) {
      fs.appendChild(btn("ghost", "Check this answer", function () {
        if (!f.pick) { el.status.textContent = "Choose an option first."; return; }
        f.checked = true; mem.formative[q.id] = f; refresh(k, "#fb-" + q.id);
      }));
    }
    if (f.checked) {
      var fb = h("div", "feedback reveal");
      fb.id = "fb-" + q.id;
      fb.tabIndex = -1;
      fb.appendChild(h("p", "verdict-line", ok ? "Correct." : "Not correct. Try again."));
      fb.appendChild(h("p", null, ok ? q.fb_correct : q.fb_incorrect));
      fs.appendChild(fb);
    }
    box.appendChild(h("p", "note", "Formative only. This question is not scored and is not sent to the LMS."));
    host.appendChild(box);
  }

  function radioItem(q, order, picked, disabled, onPick, host, num) {
    var fs = h("fieldset", "item");
    fs.appendChild(h("legend", null, (num ? num + ". " : "") + q.stem));
    order.split("").forEach(function (oid) {
      var o = optionById(q, oid);
      var rid = "r-" + q.id + "-" + oid;
      var row = h("div", "opt");
      var inp = h("input");
      inp.type = "radio";
      inp.name = "q-" + q.id;
      inp.id = rid;
      inp.value = oid;
      inp.checked = picked === oid;
      inp.disabled = !!disabled;
      inp.onchange = function () { onPick(oid); };
      var lab = h("label", null, o.text);
      lab.htmlFor = rid;
      row.appendChild(inp);
      row.appendChild(lab);
      fs.appendChild(row);
    });
    host.appendChild(fs);
    return fs;
  }

  function renderFormative(scr, host, k) {
    scr.items.forEach(function (id, n) {
      var q = BANK[id];
      var f = mem.formative[id] || {};
      var order = q.options.map(function (o) { return o.id; }).join("");
      var fs = radioItem(q, order, f.pick, f.checked, function (oid) {
        f.pick = oid; mem.formative[id] = f;
      }, host, n + 1);
      if (!f.checked) {
        fs.appendChild(btn("ghost", "Check this answer", function () {
          if (!f.pick) { el.status.textContent = "Choose an option first."; return; }
          f.checked = true; mem.formative[id] = f; refresh(k, "#fb-" + id);
        }));
      } else {
        var ok = optionById(q, f.pick).correct;
        var fb = h("div", "feedback reveal");
        fb.id = "fb-" + id;
        fb.tabIndex = -1;
        fb.appendChild(h("p", "verdict-line", ok ? "Correct." : "Not correct."));
        fb.appendChild(h("p", null, optionById(q, f.pick).feedback));
        fs.appendChild(fb);
      }
    });
    host.appendChild(h("p", "note", "Formative only. These checks are not scored and do not count toward the accreditation."));
  }

  // ROI Lab: transparent capacity model. Inputs update the output table in place.
  function roiCompute(v) {
    var active = v.users * v.adoption;
    var events = active * v.events * v.workdays;
    var burden = events * v.burden / 60;
    var freed = burden * v.removable * v.coverage;
    var credited = freed * v.recapture;
    var gross = credited * v.rate;
    var risk = gross * (1 - v.haircut);
    var cost = v.platform + v.implementation + v.measurement;
    return {
      active: active, events: events, burden: burden, freed: freed, credited: credited,
      gross: gross, risk: risk, cost: cost, net: risk - cost,
      roi: cost > 0 ? (risk - cost) / cost : null,
      multiple: cost > 0 ? risk / cost : null,
      payback: risk > 0 ? cost / (risk / 12) : null
    };
  }
  function money(x) {
    var s = "$" + Math.round(Math.abs(x)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return x < 0 ? "(" + s + ")" : s;
  }
  function num(x, d) {
    return Number(x.toFixed(d || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function renderRoi(scr, host) {
    var R = scr.roi;
    if (!mem.roi) mem.roi = JSON.parse(JSON.stringify(R.presets.base));
    var inputs = {};
    var out = h("div", "roi-out");
    out.setAttribute("aria-live", "polite");
    function shown(f) { return f.pct ? Math.round(mem.roi[f.key] * 1000) / 10 : mem.roi[f.key]; }
    function draw() {
      out.innerHTML = "";
      var v = mem.roi, bad = [];
      R.fields.forEach(function (f) {
        var raw = f.pct ? v[f.key] * 100 : v[f.key];
        if (!isFinite(raw) || raw < f.min || raw > f.max) bad.push(f.label);
      });
      if (bad.length) {
        out.appendChild(h("p", "verdict-line", "Input validity: check " + bad.join(", ") + ". Outputs are not interpretable until every input is in range."));
        return;
      }
      var c = roiCompute(v);
      renderTable({
        caption: "Modeled outputs for these inputs",
        head: ["Calculation", "Value", "How it is computed"],
        rows: [
          ["Annual active users", num(c.active), "Addressable users × adoption"],
          ["Annual in-scope events", num(c.events), "Active users × events per day × workdays"],
          ["Annual avoidable burden hours", num(c.burden), "Events × minutes ÷ 60 (converted once)"],
          ["Annual technically freed hours", num(c.freed), "Burden × removable fraction × coverage"],
          ["Annual credited capacity hours", num(c.credited), "Freed hours × recapture; not FTE reductions"],
          ["Gross credited capacity value", money(c.gross), "Credited hours × loaded rate"],
          ["Risk-adjusted annual capacity value", money(c.risk), "Gross × (1 − risk haircut); directional, not cash"],
          ["First-year all-in cost", money(c.cost), "Platform + implementation + measurement (fictional)"],
          ["Net first-year modeled value", money(c.net), "Risk-adjusted value − cost"],
          ["Net first-year modeled ROI", c.roi === null ? "Not interpretable" : num(c.roi * 100, 1) + "%", "(Value − cost) ÷ cost"],
          ["Simple benefit/cost multiple", c.multiple === null ? "Not interpretable" : num(c.multiple, 2) + "x", "Value ÷ cost; not net ROI"],
          ["Illustrative simple payback", c.payback === null ? "Not interpretable" : num(c.payback, 1) + " months", "Cost ÷ average monthly value; not cash-flow payback"]
        ]
      }, out);
    }
    var bar = h("div", "preset");
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Load a scenario");
    ["conservative", "base", "upside"].forEach(function (key) {
      bar.appendChild(btn("ghost", "Load " + key, function () {
        mem.roi = JSON.parse(JSON.stringify(R.presets[key]));
        R.fields.forEach(function (f) { inputs[f.key].value = shown(f); });
        el.status.textContent = key + " scenario loaded.";
        draw();
      }));
    });
    host.appendChild(bar);
    var form = h("div", "roi-grid");
    R.fields.forEach(function (f) {
      var id = "roi-" + f.key;
      var row = h("div", "roi-field");
      var lab = h("label", null, f.label);
      lab.htmlFor = id;
      var inp = h("input");
      inp.type = "number";
      inp.id = id;
      inp.min = f.min; inp.max = f.max; inp.step = f.step;
      inp.value = shown(f);
      inp.setAttribute("aria-describedby", id + "-u");
      inp.onchange = function () {
        var x = parseFloat(inp.value);
        mem.roi[f.key] = f.pct ? x / 100 : x;
        draw();
      };
      inputs[f.key] = inp;
      row.appendChild(lab);
      row.appendChild(inp);
      var u = h("span", "unit", f.unit);
      u.id = id + "-u";
      row.appendChild(u);
      form.appendChild(row);
    });
    host.appendChild(form);
    draw();
    host.appendChild(out);
  }

  function renderQuiz(scr, host, k) {
    var passedBefore = state.st === "passed" || lmsStatus() === "passed";
    if (scr.wrap) host.appendChild(h("p", null, scr.wrap));
    host.appendChild(h("p", "note", M.kind === "final"
      ? "This exam draws " + M.total_draw + " items across SBP-101 to SBP-113. You need at least " +
        Math.ceil(M.mastery * M.total_draw / 100) + " correct (" + M.mastery + "%). Unanswered items score as incorrect. Proposed policy: " + M.max_attempts + " graded attempts."
      : "This check draws " + M.draw + " of " + M.bank.length + " items. You need at least " +
        Math.ceil(M.mastery * M.draw / 100) + " correct (" + M.mastery + "%) and every section on this page read. Unanswered items score as incorrect. Proposed policy: " + M.max_attempts + " graded attempts."));

    var missing = unvisited();
    if (passedBefore && !(state.q && state.q.sub)) {
      host.appendChild(h("p", "badge", "Passed"));
      return;
    }
    if (missing.length && !(state.q && state.q.sub)) {
      var box = h("div", "feedback unread");
      box.appendChild(h("p", null, "Read every section on this page before you start. " + missing.length + " section(s) not read yet:"));
      var ul = h("ul", "jump");
      missing.slice(0, 12).forEach(function (j) {
        var li = h("li");
        li.appendChild(btn("linkish", M.screens[j].nav || M.screens[j].title, function () { go(j); }));
        ul.appendChild(li);
      });
      box.appendChild(ul);
      host.appendChild(box);
      return;
    }
    if (!state.q) {
      if (state.att >= M.max_attempts) { lockedNote(host); return; }
      host.appendChild(btn("accent start", "Start attempt " + (state.att + 1), function () {
        newAttempt(); state.i = k; save(); refresh(k, "legend");
      }));
      return;
    }
    var q = state.q;
    q.ids.forEach(function (id, n) {
      var item = BANK[id];
      var fs = radioItem(item, q.ord[id], q.ans[id], q.sub, function (oid) {
        q.ans[id] = oid; mem.confirm = false; save();
      }, host, n + 1);
      if (q.sub) {
        var pick = q.ans[id];
        var ok = pick && optionById(item, pick).correct;
        var fb = h("div", "feedback");
        fb.appendChild(h("p", "verdict-line", !pick ? "Not answered: scored incorrect." : (ok ? "Correct." : "Not correct.")));
        fb.appendChild(h("p", null, ok ? item.fb_correct : item.fb_incorrect));
        fs.appendChild(fb);
      }
    });
    if (!q.sub) {
      var blanks = q.ids.filter(function (id) { return !q.ans[id]; }).length;
      var label = blanks && mem.confirm ? "Submit with " + blanks + " unanswered" : "Submit answers";
      host.appendChild(btn("accent submit", label, function () {
        var b2 = q.ids.filter(function (id) { return !q.ans[id]; }).length;
        if (b2 && !mem.confirm) {
          mem.confirm = true;
          el.status.textContent = b2 + " item(s) unanswered. They will score as incorrect. Select submit again to confirm.";
          refresh(k, ".submit");
          return;
        }
        grade(k);
      }));
      return;
    }
    var passed = allVisited(true) && q.right * 100 >= M.mastery * q.n;
    var res = h("div", "feedback result");
    res.tabIndex = -1;
    res.appendChild(h("p", "verdict-line", "Score: " + q.right + " of " + q.n + " (" +
      (Math.round(q.right * 1000 / q.n) / 10) + "%). Mastery " + M.mastery + "%: " + (passed ? "passed." : "not yet passed.")));
    host.insertBefore(res, host.querySelector("fieldset"));
    if (passed) {
      host.appendChild(h("p", "badge", M.kind === "final" ? "Final exam passed" : "Module passed"));
      if (M.kind === "final") host.appendChild(h("p", "note", "The accreditation also requires every module quiz. This exam alone does not award it."));
    } else if (state.att < M.max_attempts) {
      host.appendChild(h("p", null, "Review the lessons behind the items you missed, then start a new attempt. A new attempt draws a fresh set."));
      host.appendChild(btn("ghost start", "Start attempt " + (state.att + 1), function () {
        newAttempt(); save(); refresh(k, "legend");
      }));
    } else {
      lockedNote(host);
    }
  }
  function lockedNote(host) {
    host.appendChild(h("p", "feedback", "You have used the proposed " + M.max_attempts +
      " graded attempts. Complete targeted review, then ask your LMS administrator for a reset."));
  }

  // ---------------------------------------------------------------- sections
  function fillBody(k, body) {
    var scr = M.screens[k];
    body.innerHTML = "";
    if (scr.kicker) body.appendChild(h("p", "kicker", scr.kicker));
    if (scr.objective) {
      var ob = h("p", "objective-line");
      ob.appendChild(h("strong", null, "You will: "));
      ob.appendChild(document.createTextNode(scr.objective));
      body.appendChild(ob);
    }
    if (scr.body) body.appendChild(h("p", "lede", scr.body));
    if (scr.list) {
      if (scr.list_label) body.appendChild(h("p", "list-label", scr.list_label));
      var ul = h(scr.ordered ? "ol" : "ul", "bullets");
      scr.list.forEach(function (x) { ul.appendChild(inline(h("li"), x)); });
      body.appendChild(ul);
    }
    if (scr.blocks) {
      var prose = h("div", "prose");
      renderBlocks(scr.blocks, prose);
      body.appendChild(prose);
    }
    if (scr.knowledge_check) renderKnowledgeCheck(scr, body, k);
    if (scr.table) renderTable(scr.table, body);
    if (scr.tables) scr.tables.forEach(function (t) { renderTable(t, body); });
    if (scr.cards) renderCards(scr.cards, body);
    if (scr.type === "roi") renderRoi(scr, body);
    if (scr.type === "formative") renderFormative(scr, body, k);
    if (scr.type === "quiz") renderQuiz(scr, body, k);
    if (scr.footnote) body.appendChild(h("p", "note", scr.footnote));
  }
  // Re-render one section's body (checks only) and move focus to a stable target in it.
  function refresh(k, focusSel) {
    fillBody(k, bodies[k]);
    var t = focusSel && bodies[k].querySelector(focusSel);
    if (t) {
      if (t.tabIndex < 0 && !/^(BUTTON|INPUT|TEXTAREA)$/.test(t.tagName)) t.tabIndex = -1;
      t.focus();
    }
  }
  function build() {
    el.title.textContent = M.title;
    el.page.innerHTML = "";
    M.screens.forEach(function (scr, k) {
      var sec = h("section", "sec");
      sec.id = "s-" + scr.id;
      sec.dataset.type = scr.type;
      sec.setAttribute("aria-labelledby", "h-" + scr.id);
      var col = h("div", "a-canvas");
      if (scr.eyebrow) col.appendChild(h("p", "eyebrow", scr.eyebrow));
      var head = h(k === 0 ? "h1" : "h2", null, scr.title);
      head.id = "h-" + scr.id;
      head.tabIndex = -1;
      col.appendChild(head);
      var body = h("div", "sec-body");
      col.appendChild(body);
      sec.appendChild(col);
      var end = h("div", "seen-mark");
      end.setAttribute("aria-hidden", "true");
      end.dataset.k = String(k);
      sec.appendChild(end);
      el.page.appendChild(sec);
      secs.push(sec); heads.push(head); bodies.push(body);
      fillBody(k, body);
    });
  }

  // ---------------------------------------------------------------- reading progress
  function markSeen(k) {
    if (k < 0 || k >= N || isCheck(k) || state.vis[k]) return;
    state.vis[k] = true;
    updateChrome();
    var chk = M.screens.length - 1;
    if (isCheck(chk) && !(state.q && state.q.sub)) refreshCheckGate(chk);
    saveSoon();
  }
  // Update the check's "not read yet" list without stealing focus.
  function refreshCheckGate(k) {
    var gate = bodies[k].querySelector(".unread");
    if (gate || !unvisited().length) {
      var hadFocus = bodies[k].contains(document.activeElement);
      fillBody(k, bodies[k]);
      if (hadFocus) heads[k].focus();
    }
  }
  function setCurrent(k) {
    if (k === state.i) return;
    state.i = k;
    updateChrome();
    saveSoon();
  }
  // A section counts as read once its end has reached the viewport (scrolled to, not skipped by
  // a jump link past it). Position-based, so fast scrolling or End cannot miss a section.
  // A section counts as read only when its end has been on screen. Skipping past it (jump link,
  // End key, scrollbar drag) does not count; smooth scrolling from a jump link is ignored until
  // it settles.
  var sweepQueued = false;
  var jumping = false, jumpTimer = null;
  function jumpStart() {
    jumping = true;
    jumpSettle();
  }
  function jumpSettle() {
    clearTimeout(jumpTimer);
    jumpTimer = setTimeout(function () { jumping = false; queueSweep(); }, 250);
  }
  function sweep() {
    sweepQueued = false;
    if (jumping) { jumpSettle(); return; }
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var cur = 0;
    secs.forEach(function (s, k) {
      var top = s.querySelector(".seen-mark").getBoundingClientRect().top;
      if (top >= 0 && top <= vh) markSeen(k);
      if (s.getBoundingClientRect().top <= vh * 0.4) cur = k;
    });
    setCurrent(cur);
  }
  function queueSweep() {
    if (sweepQueued || window.SBP_QA_MANUAL) return;
    sweepQueued = true;
    (window.requestAnimationFrame || setTimeout)(sweep);
  }
  function watch() {
    window.addEventListener("scroll", queueSweep, { passive: true });
    window.addEventListener("resize", queueSweep);
    queueSweep();
  }

  // ---------------------------------------------------------------- shell
  function readCount() {
    var v = 0, t = 0;
    for (var k = 0; k < N; k++) { if (isCheck(k)) continue; t++; if (state.vis[k]) v++; }
    return { v: v, t: t };
  }
  function drawMap() {
    el.map.innerHTML = "";
    M.screens.forEach(function (scr, k) {
      var li = h("li");
      var cur = state.i === k;
      var done = !!state.vis[k];
      li.dataset.state = cur ? "current" : (done ? "done" : "upcoming");
      var a = h("a", "maplink");
      a.href = "#s-" + scr.id;
      a.onclick = function (e) { e.preventDefault(); go(k); };
      a.appendChild(h("span", "dot")).setAttribute("aria-hidden", "true");
      a.appendChild(h("span", null, scr.nav || scr.title));
      a.appendChild(h("span", "sr", done ? (isCheck(k) ? " (submitted)" : " (read)") : ""));
      if (cur) a.setAttribute("aria-current", "location");
      li.appendChild(a);
      el.map.appendChild(li);
    });
  }
  function updateChrome() {
    var c = readCount();
    el.prog.max = c.t;
    el.prog.value = c.v;
    el.ptext.textContent = c.v + " of " + c.t + " sections read";
    if (el.where) el.where.textContent = M.screens[state.i].nav || M.screens[state.i].title;
    drawMap();
  }
  var toc = document.querySelector(".toc");
  function narrow() { return !!(window.matchMedia && window.matchMedia("(max-width: 900px)").matches); }
  function go(k, opts) {
    k = Math.max(0, Math.min(k, N - 1));
    opts = opts || {};
    if (toc && narrow()) toc.open = false;
    jumpStart();
    state.i = k;
    secs[k].scrollIntoView({ behavior: opts.instant || reducedMotion() ? "auto" : "smooth", block: "start" });
    if (!opts.noFocus) heads[k].focus({ preventScroll: true });
    updateChrome();
    save();
  }

  function finishStatus() {
    if (state.st === "passed" || lmsStatus() === "passed") return "passed";
    if (state.q && state.q.sub) return state.st || "failed";
    return "incomplete";
  }
  function exitNow() {
    if (S.isFinished()) return;
    var st = finishStatus();
    var cur = lmsStatus();
    if (cur !== "passed" && st !== cur) S.set("cmi.core.lesson_status", st);
    S.set("cmi.core.exit", st === "incomplete" ? "suspend" : "");
    S.set("cmi.core.session_time", timespan(Date.now() - started));
    save();
    S.finish();
  }
  el.top.onclick = function () { go(0); };
  el.finish.onclick = function () {
    exitNow();
    var st = finishStatus();
    el.status.textContent = (st === "incomplete" ? "Progress saved. You can resume where you left off. " : "") +
      "You can close this window.";
    el.finish.disabled = true;
  };

  // ---------------------------------------------------------------- start
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  var tracked = S.init();
  if (el.track) {
    el.track.textContent = tracked ? "Tracked by your LMS." :
      "Untracked preview: no LMS connection was found. Progress is kept in this browser only and is not reported anywhere.";
  }
  restore();
  var initial = lmsStatus();
  if (initial === "passed") state.st = "passed";
  if (!initial || initial === "not attempted") S.set("cmi.core.lesson_status", "incomplete");
  build();
  if (toc && narrow()) toc.open = false;
  updateChrome();
  if (state.i > 0) go(state.i, { instant: true, noFocus: true });
  watch();
  save();
  window.addEventListener("pagehide", exitNow);
  window.addEventListener("beforeunload", exitNow);
  if (window.SBP_QA) {
    window.SBP_TEST = { state: state, mem: mem, go: go, see: markSeen, roiCompute: roiCompute,
                        payload: payload, exitNow: exitNow, finish: function () { el.finish.click(); },
                        seeAll: function () { for (var k = 0; k < N; k++) markSeen(k); } };
  }
})();
