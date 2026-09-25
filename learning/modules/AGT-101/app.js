(function () {
  "use strict";

  var C = window.AGT101 || {};
  var BANDS = C.bands || [];
  var IX = C.interactions || {};
  var QUIZ = C.quiz || { items: [], key: {}, mastery: 80 };
  var ICONS = C.icons || {};

  var state = {
    visited: {},
    current: null,
    ix: {},
    quiz: { idx: 0, answers: {}, submitted: false, attempts: 0, best: 0, passed: false },
    completed: false
  };

  var RAIL_ICONS = {
    hero: "target", goals: "flag", definition: "define", anatomy: "layers",
    modes: "branch", "practice-mode": "scale", triggers: "bolt",
    permissions: "shield", production: "check", lifecycle: "cycle",
    check: "doc", carry: "book"
  };

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function icon(name) {
    var span = el("span");
    span.innerHTML = ICONS[name] || ICONS.define || "";
    var svg = span.firstChild;
    if (svg && svg.setAttribute) svg.setAttribute("aria-hidden", "true");
    return span;
  }
  function reduceMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function blockMetaRow(b) {
    var wrap = el("div", "meta-row");
    b.items.forEach(function (it) {
      var c = el("div", "meta-row__cell");
      c.appendChild(el("div", "meta-row__k", it.k));
      c.appendChild(el("div", "meta-row__v", it.v));
      wrap.appendChild(c);
    });
    return wrap;
  }

  function blockHeroRender() {
    var fig = el("div", "hero-render");
    var img = el("img", "hero-render__img");
    img.src = "assets/hero-flow.svg";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    fig.appendChild(img);
    return fig;
  }

  function blockIconRows(b) {
    var wrap = el("ul", "icon-rows");
    b.items.forEach(function (it) {
      var li = el("li", "icon-row");
      var ic = el("div", "icon-row__icon");
      ic.appendChild(icon(it.icon));
      li.appendChild(ic);
      var body = el("div");
      body.appendChild(el("span", "icon-row__lead", it.lead + " "));
      body.appendChild(el("span", "icon-row__trail", it.trail));
      li.appendChild(body);
      wrap.appendChild(li);
    });
    return wrap;
  }

  function blockNumCards(b) {
    var wrap = el("div", "num-cards");
    b.cards.forEach(function (c) {
      var card = el("div", "num-card");
      card.appendChild(el("div", "num-card__n", c.n));
      card.appendChild(el("div", "num-card__rule"));
      var h = el("h3", "num-card__h");
      h.appendChild(el("span", "num-card__lead", c.lead));
      card.appendChild(h);
      card.appendChild(el("p", "num-card__trail", c.trail));
      wrap.appendChild(card);
    });
    return wrap;
  }

  function blockCallout(b) {
    var d = el("div", "callout" + (b.kind === "warning" ? " callout--warning" : ""));
    var tag = b.kind === "warning" ? "Watch out" : b.kind === "note" ? "Note" : "Insight";
    d.appendChild(el("span", "callout__tag", tag));
    d.appendChild(el("span", null, b.text));
    return d;
  }

  function blockFactRows(b) {
    var wrap = el("ul", "fact-rows");
    b.rows.forEach(function (r) {
      var li = el("li", "fact-row");
      li.appendChild(el("span", "fact-row__lead", r.lead));
      li.appendChild(el("span", "fact-row__trail", r.trail));
      wrap.appendChild(li);
    });
    return wrap;
  }

  function blockPrincipleGrid(b) {
    var wrap = el("div", "principle-grid");
    b.items.forEach(function (p) {
      var d = el("div", "principle");
      d.appendChild(el("span", "principle__lead", p.lead));
      d.appendChild(el("span", "principle__trail", p.trail));
      wrap.appendChild(d);
    });
    return wrap;
  }

  function blockStatGrid(b) {
    var wrap = el("div", "stat-grid");
    b.stats.forEach(function (s) {
      var d = el("div", "stat");
      var v = el("div", "stat__v", reduceMotion() ? String(s.count_to) : "0");
      v.setAttribute("data-count-to", s.count_to);
      d.appendChild(v);
      d.appendChild(el("div", "stat__cap", s.cap));
      wrap.appendChild(d);
    });
    return wrap;
  }

  function blockAidGrid(b) {
    var wrap = el("div", "aid-grid");
    b.items.forEach(function (it) {
      var d = el("div", "aid");
      d.appendChild(el("span", "aid__lead", it.lead));
      d.appendChild(el("span", "aid__trail", it.trail));
      wrap.appendChild(d);
    });
    return wrap;
  }

  function ixHotspot(spec) {
    var wrap = el("div", "ix");
    wrap.appendChild(el("p", "ix__prompt", spec.prompt));
    var grid = el("div", "hotspot");

    var list = el("div", "hotspot__list");
    list.setAttribute("role", "tablist");
    list.setAttribute("aria-label", "Agent building blocks");

    var panel = el("div", "hotspot__panel");
    panel.setAttribute("role", "tabpanel");
    panel.id = spec.id + "-panel";

    var btns = [];
    function select(i) {
      spec.hotspots.forEach(function (h, j) {
        btns[j].setAttribute("aria-selected", j === i ? "true" : "false");
        btns[j].tabIndex = j === i ? 0 : -1;
      });
      var h = spec.hotspots[i];
      panel.innerHTML = "";
      panel.appendChild(el("div", "hotspot__panel-n", h.n));
      panel.appendChild(el("h3", "hotspot__panel-h", h.label));
      panel.appendChild(el("div", "hotspot__panel-rule"));
      panel.appendChild(el("p", "hotspot__panel-b", h.body));
      state.ix[spec.id] = i;
      save();
    }

    spec.hotspots.forEach(function (h, i) {
      var b = el("button", "hotspot__btn");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", panel.id);
      b.appendChild(el("span", "hotspot__n", h.n));
      b.appendChild(el("span", "hotspot__label", h.label));
      b.addEventListener("click", function () { select(i); });
      b.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = (i + d + spec.hotspots.length) % spec.hotspots.length;
        btns[n].focus(); select(n);
      });
      btns.push(b);
      list.appendChild(b);
    });

    grid.appendChild(list);

    var right = el("div");
    var img = el("img", "hotspot__img");
    img.src = spec.diagram;
    img.alt = C.anatomyAlt || "Diagram of the five building blocks of a Glean Agent.";
    right.appendChild(img);
    right.appendChild(panel);
    grid.appendChild(right);

    wrap.appendChild(grid);
    select(state.ix[spec.id] != null ? state.ix[spec.id] : 0);
    return wrap;
  }

  function ixTabs(spec) {
    var wrap = el("div", "ix");
    var list = el("div", "tabs__list");
    list.setAttribute("role", "tablist");
    list.setAttribute("aria-label", "Agent modes");
    var panels = [];
    var tabs = [];

    function select(i) {
      spec.panels.forEach(function (p, j) {
        tabs[j].setAttribute("aria-selected", j === i ? "true" : "false");
        tabs[j].tabIndex = j === i ? 0 : -1;
        panels[j].hidden = j !== i;
      });
      state.ix[spec.id] = i;
      save();
    }

    spec.panels.forEach(function (p, i) {
      var t = el("button", "tabs__tab", p.label);
      t.type = "button";
      t.setAttribute("role", "tab");
      t.id = spec.id + "-tab-" + p.id;
      t.setAttribute("aria-controls", spec.id + "-p-" + p.id);
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = (i + d + spec.panels.length) % spec.panels.length;
        tabs[n].focus(); select(n);
      });
      tabs.push(t);
      list.appendChild(t);

      var pan = el("div", "tabs__panel");
      pan.id = spec.id + "-p-" + p.id;
      pan.setAttribute("role", "tabpanel");
      pan.setAttribute("aria-labelledby", t.id);
      pan.appendChild(el("p", "tabs__tagline", p.tagline));
      var rows = el("ul", "fact-rows");
      p.rows.forEach(function (r) {
        var li = el("li", "fact-row");
        li.appendChild(el("span", "fact-row__lead", r.k));
        li.appendChild(el("span", "fact-row__trail", r.v));
        rows.appendChild(li);
      });
      pan.appendChild(rows);
      panels.push(pan);
    });

    wrap.appendChild(list);
    panels.forEach(function (p) { wrap.appendChild(p); });
    select(state.ix[spec.id] != null ? state.ix[spec.id] : 0);
    return wrap;
  }

  function ixDecisions(spec) {
    var wrap = el("div", "ix");
    state.ix[spec.id] = state.ix[spec.id] || {};
    spec.items.forEach(function (item) {
      var card = el("div", "decision");
      card.appendChild(el("p", "decision__q", item.scenario));
      var opts = el("div", "decision__opts");
      var fb = el("div", "decision__fb");
      fb.hidden = true;
      fb.setAttribute("role", "status");
      fb.setAttribute("aria-live", "polite");
      var buttons = [];

      item.options.forEach(function (o) {
        var b = el("button", "pill pill--ghost", o.label);
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          buttons.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          fb.hidden = false;
          fb.setAttribute("data-correct", o.correct ? "true" : "false");
          fb.innerHTML = "";
          fb.appendChild(el("span", "decision__fb-tag", o.correct ? "Correct" : "Not quite"));
          fb.appendChild(el("span", null, o.feedback));
          state.ix[spec.id][item.id] = o.id;
          save();
        });
        buttons.push(b);
        opts.appendChild(b);
      });

      card.appendChild(opts);
      card.appendChild(fb);
      wrap.appendChild(card);
    });
    return wrap;
  }

  function ixSorter(spec) {
    var wrap = el("div", "ix");
    wrap.appendChild(el("p", "ix__prompt", spec.prompt));
    state.ix[spec.id] = state.ix[spec.id] || {};
    var status = el("p", "ix__status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    var cards = el("div", "sorter__cards");

    function updateStatus() {
      var done = 0, right = 0;
      spec.cards.forEach(function (c) {
        var pick = state.ix[spec.id][c.id];
        if (pick) { done++; if (pick === c.bucket) right++; }
      });
      status.textContent = done + " of " + spec.cards.length + " assigned \u00b7 " + right + " correct";
    }

    spec.cards.forEach(function (c) {
      var card = el("div", "sorter__card");
      var fs = el("fieldset", "sorter__fs");
      fs.appendChild(el("legend", "sorter__text", c.text));
      var opts = el("div", "sorter__opts");
      var why = el("div", "sorter__why");
      why.hidden = true;
      var btns = [];

      spec.buckets.forEach(function (bk) {
        var b = el("button", "sorter__opt", bk.label);
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          btns.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          state.ix[spec.id][c.id] = bk.id;
          var ok = bk.id === c.bucket;
          card.setAttribute("data-state", ok ? "correct" : "review");
          why.hidden = false;
          why.textContent = (ok ? "Correct. " : "Not that one. ") + c.why;
          updateStatus();
          save();
        });
        btns.push(b);
        opts.appendChild(b);
      });

      fs.appendChild(opts);
      card.appendChild(fs);
      card.appendChild(why);
      cards.appendChild(card);
    });

    wrap.appendChild(cards);
    wrap.appendChild(status);
    updateStatus();
    return wrap;
  }

  function ixMyths(spec) {
    var wrap = el("div", "ix");
    wrap.appendChild(el("p", "ix__prompt", spec.prompt));
    state.ix[spec.id] = state.ix[spec.id] || {};
    var grid = el("div", "myths");

    spec.items.forEach(function (m) {
      var card = el("div", "myth");
      card.appendChild(el("p", "myth__claim", m.claim_text));
      var actions = el("div", "myth__actions");
      var reveal = el("div", "myth__reveal");
      reveal.hidden = true;
      reveal.setAttribute("role", "status");
      reveal.setAttribute("aria-live", "polite");

      function show(guess) {
        reveal.hidden = false;
        reveal.innerHTML = "";
        var right = guess === m.is_true;
        reveal.appendChild(el("span", "myth__verdict",
          (right ? "You were right. " : "Actually \u2014 ") + m.verdict));
        reveal.appendChild(el("p", "myth__body", m.body));
        state.ix[spec.id][m.id] = guess;
        save();
      }

      var bT = el("button", "pill pill--ghost", "True");
      bT.type = "button";
      bT.addEventListener("click", function () { show(true); });
      var bF = el("button", "pill pill--ghost", "Myth");
      bF.type = "button";
      bF.addEventListener("click", function () { show(false); });

      actions.appendChild(bT);
      actions.appendChild(bF);
      card.appendChild(actions);
      card.appendChild(reveal);
      grid.appendChild(card);
    });

    wrap.appendChild(grid);
    return wrap;
  }

  function ixRisk(spec) {
    var wrap = el("div", "ix");
    wrap.appendChild(el("p", "ix__prompt", spec.prompt));
    var picked = {};
    var factors = el("div", "risk__factors");
    var result = el("div", "risk__result");
    result.setAttribute("role", "status");
    result.setAttribute("aria-live", "polite");
    function recompute() {
      var n = 0;
      spec.factors.forEach(function (f) { if (picked[f.id]) n += f.weight; });
      var tier = spec.results[spec.results.length - 1];
      for (var i = 0; i < spec.results.length; i++) {
        if (n <= spec.results[i].max) { tier = spec.results[i]; break; }
      }
      result.innerHTML = "";
      result.appendChild(el("div", "risk__tier",
        n + " risk factor" + (n === 1 ? "" : "s") + " selected \u00b7 " + tier.tier));
      result.appendChild(el("div", "risk__process", tier.process + " process"));
      result.appendChild(el("p", "risk__body", tier.body));
      state.ix[spec.id] = picked;
      save();
    }

    spec.factors.forEach(function (f) {
      var lab = el("label", "risk__factor");
      var cb = el("input");
      cb.type = "checkbox";
      cb.addEventListener("change", function () {
        picked[f.id] = cb.checked;
        recompute();
      });
      lab.appendChild(cb);
      lab.appendChild(el("span", null, f.text));
      factors.appendChild(lab);
    });

    wrap.appendChild(factors);
    wrap.appendChild(result);
    if (spec.disclosure) {
      var disc = el("p", "ix__disclosure");
      disc.appendChild(el("span", "ix__disclosure-tag", "How this is scored"));
      disc.appendChild(el("span", null, spec.disclosure));
      wrap.appendChild(disc);
    }
    recompute();
    return wrap;
  }

  function ixStepper(spec) {
    var wrap = el("div", "ix");
    var nav = el("div", "stepper__nav");
    var panel = el("div", "stepper__panel");
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    var seen = {};
    var dots = [];

    function render(i) {
      seen[i] = true;
      var s = spec.steps[i];
      panel.innerHTML = "";
      panel.appendChild(el("div", "stepper__n", "Stage " + s.n + " of " + spec.steps.length));
      panel.appendChild(el("h3", "stepper__h", s.label));
      panel.appendChild(el("div", "stepper__rule"));
      panel.appendChild(el("p", "stepper__b", s.body));
      dots.forEach(function (d, j) {
        d.setAttribute("aria-current", j === i ? "step" : "false");
        if (seen[j]) d.setAttribute("data-seen", "true");
      });
      var ctr = el("div", "stepper__controls");
      var prev = el("button", "pill pill--ghost", "Previous");
      prev.type = "button";
      prev.disabled = i === 0;
      prev.addEventListener("click", function () { render(i - 1); });
      var next = el("button", "pill pill--primary", i === spec.steps.length - 1 ? "Done" : "Next stage");
      next.type = "button";
      next.disabled = i === spec.steps.length - 1;
      next.addEventListener("click", function () { render(i + 1); });
      ctr.appendChild(prev);
      ctr.appendChild(next);
      panel.appendChild(ctr);
      state.ix[spec.id] = i;
      save();
    }

    spec.steps.forEach(function (s, i) {
      var d = el("button", "stepper__dot");
      d.type = "button";
      d.appendChild(el("span", "stepper__dot-n", String(s.n)));
      d.appendChild(el("span", "stepper__dot-l", s.label));
      d.setAttribute("aria-label", "Stage " + s.n + ": " + s.label);
      d.addEventListener("click", function () { render(i); });
      dots.push(d);
      nav.appendChild(d);
    });

    wrap.appendChild(nav);
    wrap.appendChild(panel);
    render(state.ix[spec.id] != null ? state.ix[spec.id] : 0);
    return wrap;
  }

  function buildQuiz() {
    var wrap = el("div", "quiz");
    wrap.id = "quiz";

    function render() {
      wrap.innerHTML = "";
      if (state.quiz.submitted) { renderResult(); return; }

      var items = QUIZ.items;
      var i = state.quiz.idx;
      var item = items[i];

      var meta = el("div", "quiz__meta");
      meta.appendChild(el("span", null, "Question " + (i + 1) + " of " + items.length));
      meta.appendChild(el("span", null, "Pass mark " + QUIZ.mastery + "%"));
      wrap.appendChild(meta);

      var bar = el("div", "quiz__bar");
      var fill = el("div", "quiz__bar-fill");
      fill.style.width = ((i / items.length) * 100) + "%";
      bar.appendChild(fill);
      wrap.appendChild(bar);

      wrap.appendChild(el("h3", "quiz__stem", item.stem));

      var multi = item.type === "multi";
      if (multi) wrap.appendChild(el("p", "hint", "Select all that apply."));

      var opts = el("div", "quiz__opts");
      var chosen = state.quiz.answers[item.id] || (multi ? [] : null);

      item.options.forEach(function (o) {
        var b = el("button", "quiz__opt");
        b.type = "button";
        var isOn = multi ? chosen.indexOf(o.id) > -1 : chosen === o.id;
        b.setAttribute("aria-pressed", isOn ? "true" : "false");
        b.appendChild(el("span", "quiz__mark", o.id.toUpperCase()));
        b.appendChild(el("span", null, o.text));
        b.addEventListener("click", function () {
          if (multi) {
            var arr = state.quiz.answers[item.id] || [];
            var k = arr.indexOf(o.id);
            if (k > -1) arr.splice(k, 1); else arr.push(o.id);
            state.quiz.answers[item.id] = arr;
          } else {
            state.quiz.answers[item.id] = o.id;
          }
          save();
          render();
        });
        opts.appendChild(b);
      });
      wrap.appendChild(opts);

      var ctr = el("div", "quiz__controls");
      var back = el("button", "pill pill--invert", "Back");
      back.type = "button";
      back.disabled = i === 0;
      back.addEventListener("click", function () { state.quiz.idx--; render(); });
      ctr.appendChild(back);

      var answered = multi
        ? (state.quiz.answers[item.id] || []).length > 0
        : !!state.quiz.answers[item.id];

      if (i < items.length - 1) {
        var next = el("button", "pill pill--invert", "Next");
        next.type = "button";
        next.disabled = !answered;
        next.addEventListener("click", function () { state.quiz.idx++; render(); });
        ctr.appendChild(next);
      } else {
        var sub = el("button", "pill pill--invert", "Submit answers");
        sub.type = "button";
        sub.disabled = items.some(function (it) {
          var a = state.quiz.answers[it.id];
          return it.type === "multi" ? !(a && a.length) : !a;
        });
        sub.addEventListener("click", grade);
        ctr.appendChild(sub);
      }
      wrap.appendChild(ctr);
    }

    function isRight(it) {
      var key = QUIZ.key[it.id];
      var a = state.quiz.answers[it.id];
      if (it.type === "multi") {
        return key.correct.slice().sort().join(",") === (a || []).slice().sort().join(",");
      }
      return a === key.correct;
    }

    function grade() {
      var items = QUIZ.items;
      var correct = 0;
      items.forEach(function (it) { if (isRight(it)) correct++; });
      var pct = Math.round((correct / items.length) * 100);
      state.quiz.attempts++;
      state.quiz.correct = correct;
      state.quiz.score = pct;
      if (pct > state.quiz.best) state.quiz.best = pct;
      state.quiz.passed = state.quiz.best >= QUIZ.mastery;
      state.quiz.submitted = true;
      reportScore();
      render();
    }

    function renderResult() {
      var items = QUIZ.items;
      var res = el("div", "quiz__result");
      res.appendChild(el("div", "quiz__score", state.quiz.score + "%"));
      var v = el("div", "quiz__verdict",
        state.quiz.passed
          ? "Passed \u00b7 " + state.quiz.correct + " of " + items.length + " correct"
          : "Not yet \u00b7 " + state.quiz.correct + " of " + items.length +
            " correct \u00b7 " + QUIZ.mastery + "% needed");
      v.setAttribute("data-pass", state.quiz.passed ? "true" : "false");
      res.appendChild(v);
      wrap.appendChild(res);

      items.forEach(function (it, n) {
        var key = QUIZ.key[it.id];
        var a = state.quiz.answers[it.id];
        var ok = isRight(it);
        var block = el("div", "quiz__review");
        block.appendChild(el("div", "quiz__meta", "Question " + (n + 1) + " \u00b7 " + (ok ? "Correct" : "Review")));
        block.appendChild(el("h3", "quiz__stem", it.stem));
        var picked = it.type === "multi" ? (a || []) : [a];
        picked.forEach(function (pid) {
          var opt = it.options.filter(function (o) { return o.id === pid; })[0];
          if (!opt) return;
          var line = el("div", "quiz__fb");
          line.setAttribute("data-verdict", ok ? "correct" : "incorrect");
          line.appendChild(el("span", "quiz__mark", opt.id.toUpperCase()));
          line.appendChild(el("span", null, key.feedback[opt.id] || ""));
          block.appendChild(line);
        });
        if (!ok) {
          var want = it.type === "multi"
            ? key.correct.join(", ").toUpperCase()
            : String(key.correct).toUpperCase();
          var hint = el("div", "quiz__fb");
          hint.appendChild(el("span", null, "Correct answer: " + want));
          block.appendChild(hint);
        }
        wrap.appendChild(block);
      });

      var ctr = el("div", "quiz__controls");
      var again = el("button", "pill pill--invert", "Retake the check");
      again.type = "button";
      again.addEventListener("click", function () {
        state.quiz.submitted = false;
        state.quiz.idx = 0;
        state.quiz.answers = {};
        save();
        render();
      });
      ctr.appendChild(again);
      wrap.appendChild(ctr);
    }

    render();
    return wrap;
  }

  var IX_RENDER = {
    hotspot: ixHotspot, tabs: ixTabs, decision_set: ixDecisions,
    sorter: ixSorter, myth_fact: ixMyths, risk_checklist: ixRisk, stepper: ixStepper
  };

  function renderBands() {
    var main = document.getElementById("bands");
    BANDS.forEach(function (b, i) {
      var sec = el("section", "band");
      sec.id = "band-" + b.id;
      sec.setAttribute("data-surface", b.surface);
      sec.setAttribute("data-band", b.id);
      sec.setAttribute("aria-labelledby", "h-" + b.id);

      if (b.surface === "ink") sec.appendChild(el("div", "band-texture"));

      var inner = el("div", "band-inner");
      if (b.eyebrow) inner.appendChild(el("p", "eyebrow", b.eyebrow));

      var h = el(i === 0 ? "h1" : "h2", "display");
      h.id = "h-" + b.id;
      h.appendChild(el("span", "lead-clause", b.head_lead + " "));
      if (b.head_trail) h.appendChild(el("span", "trail", b.head_trail));
      inner.appendChild(h);

      if (b.lead) inner.appendChild(el("p", "lead", b.lead));

      (b.blocks || []).forEach(function (blk) {
        var node = null;
        switch (blk.type) {
          case "hero_render": node = blockHeroRender(); break;
          case "meta_row": node = blockMetaRow(blk); break;
          case "icon_row_list": node = blockIconRows(blk); break;
          case "numbered_cards": node = blockNumCards(blk); break;
          case "callout": node = blockCallout(blk); break;
          case "fact_rows": node = blockFactRows(blk); break;
          case "principle_grid": node = blockPrincipleGrid(blk); break;
          case "stat_grid": node = blockStatGrid(blk); break;
          case "job_aid":
          case "next_steps": node = blockAidGrid(blk); break;
          case "quiz": node = buildQuiz(); break;
          default:
            if (blk.interaction_id && IX[blk.interaction_id]) {
              var spec = IX[blk.interaction_id];
              var fn = IX_RENDER[spec.type];
              if (fn) node = fn(spec);
            }
        }
        if (node) {
          node.className = node.className + " reveal";
          inner.appendChild(node);
        }
      });

      sec.appendChild(inner);
      main.appendChild(sec);
    });
  }

  function renderRail() {
    var rail = document.getElementById("rail");
    var list = el("ul", "rail__list");
    BANDS.forEach(function (b, i) {
      var li = el("li");
      var a = el("a", "rail__btn");
      a.href = "#band-" + b.id;
      a.setAttribute("data-band", b.id);
      a.setAttribute("aria-label", (i + 1) + ". " + (b.eyebrow || b.head_lead));
      a.appendChild(icon(RAIL_ICONS[b.rail] || "define"));
      li.appendChild(a);
      list.appendChild(li);
    });
    rail.appendChild(list);
  }

  function markCurrent(id) {
    if (state.current === id) return;
    state.current = id;
    var idx = 0;
    BANDS.forEach(function (b, i) { if (b.id === id) idx = i; });
    var nodes = document.querySelectorAll(".rail__btn");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute("aria-current",
        nodes[i].getAttribute("data-band") === id ? "true" : "false");
    }
    var readout = document.getElementById("progress-readout");
    if (readout) readout.textContent = "Section " + (idx + 1) + " of " + BANDS.length;
    updateProgress();
    save();
  }

  function updateProgress() {
    var pct = (countVisited() / BANDS.length) * 100;
    var fillNode = document.getElementById("rail-progress-fill");
    if (fillNode) fillNode.style.width = pct + "%";
  }

  function countVisited() {
    var n = 0;
    for (var k in state.visited) { if (state.visited[k]) n++; }
    return n;
  }

  function visit(id) {
    if (state.visited[id]) return;
    state.visited[id] = true;
    updateProgress();
    checkComplete();
    save();
  }

  function wireObservers() {
    var sections = document.querySelectorAll(".band");
    var reveals = document.querySelectorAll(".reveal");
    var i;

    if (!("IntersectionObserver" in window)) {
      for (i = 0; i < sections.length; i++) visit(sections[i].getAttribute("data-band"));
      for (i = 0; i < reveals.length; i++) reveals[i].classList.remove("is-hidden");
      return;
    }

    var vis = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.getAttribute("data-band");
          visit(id);
          markCurrent(id);
        }
      });
    }, { threshold: 0.12 });
    for (i = 0; i < sections.length; i++) vis.observe(sections[i]);

    if (!reduceMotion()) {
      for (i = 0; i < reveals.length; i++) reveals[i].classList.add("is-hidden");
      var rev = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.remove("is-hidden");
            rev.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      for (i = 0; i < reveals.length; i++) rev.observe(reveals[i]);

      var stats = document.querySelectorAll(".stat__v[data-count-to]");
      if (stats.length) {
        var counted = false;
        var cObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting && !counted) {
              counted = true;
              for (var q = 0; q < stats.length; q++) countUp(stats[q]);
            }
          });
        }, { threshold: 0.4 });
        cObs.observe(stats[0]);
      }
    }
  }

  function countUp(node) {
    var target = parseInt(node.getAttribute("data-count-to"), 10) || 0;
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / 600, 1);
      node.textContent = String(Math.round(target * p));
      if (p < 1) requestAnimationFrame(frame);
    }
    if (window.requestAnimationFrame) requestAnimationFrame(frame);
    else node.textContent = String(target);
  }

  function allBandsSeen() {
    return BANDS.every(function (b) { return !!state.visited[b.id]; });
  }

  function checkComplete() {
    var done = allBandsSeen() && state.quiz.passed;
    if (done && !state.completed) {
      state.completed = true;
      if (window.SCORM) {
        window.SCORM.set("cmi.core.lesson_status", "passed");
        window.SCORM.commit();
      }
    }
    return done;
  }

  function reportScore() {
    if (!window.SCORM) return;
    window.SCORM.set("cmi.core.score.raw", String(state.quiz.best));
    window.SCORM.set("cmi.core.score.min", "0");
    window.SCORM.set("cmi.core.score.max", "100");
    if (!checkComplete()) {
      window.SCORM.set("cmi.core.lesson_status",
        state.quiz.passed ? "incomplete" : "failed");
    }
    save();
    window.SCORM.commit();
  }

  function save() {
    if (!window.SCORM) return;
    try {
      var visited = [];
      for (var k in state.visited) { if (state.visited[k]) visited.push(k); }
      window.SCORM.set("cmi.suspend_data", JSON.stringify({
        v: 1, visited: visited, current: state.current,
        ix: state.ix, quiz: state.quiz
      }));
      if (state.current) window.SCORM.set("cmi.core.lesson_location", state.current);
    } catch (e) { /* never break the learner on storage limits */ }
  }

  function restore() {
    if (!window.SCORM) return;
    var raw = window.SCORM.get("cmi.suspend_data");
    if (!raw) return;
    try {
      var d = JSON.parse(raw);
      if (!d || d.v !== 1) return;
      (d.visited || []).forEach(function (id) { state.visited[id] = true; });
      state.ix = d.ix || {};
      if (d.quiz) state.quiz = d.quiz;
      state.current = d.current || null;
    } catch (e) { /* corrupt state must not block the module */ }
  }

  function boot() {
    if (window.SCORM) window.SCORM.init();
    restore();

    var resumeTo = state.current;
    state.current = null;

    renderBands();
    renderRail();
    wireObservers();

    var node = document.getElementById("colophon-sources");
    if (node) {
      node.textContent = (C.sourceCount || 0) + " vetted sources \u00b7 " +
        (C.claimCount || 0) + " traceable claims";
    }

    if (resumeTo && document.getElementById("band-" + resumeTo)) {
      document.getElementById("band-" + resumeTo).scrollIntoView({ block: "start" });
      markCurrent(resumeTo);
    } else {
      markCurrent(BANDS[0].id);
    }
    updateProgress();

    if (window.SCORM) {
      var st = window.SCORM.get("cmi.core.lesson_status");
      if (!st || st === "not attempted") {
        window.SCORM.set("cmi.core.lesson_status", "incomplete");
        window.SCORM.commit();
      }
    }

    window.addEventListener("beforeunload", function () {
      save();
      if (window.SCORM) window.SCORM.finish();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.__AGT101 = { state: state, bands: BANDS };
})();
