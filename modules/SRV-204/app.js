/* Runtime: renders archetype screens, tracks state, scores the assessment.
   Offline, keyboard safe, and screen-reader aware. */
(function () {
  var M = window.MODULE, S = window.SCORM;
  var el = {
    screen: document.getElementById("screen"), map: document.getElementById("map"),
    prog: document.getElementById("prog"), ptext: document.getElementById("ptext"),
    obj: document.getElementById("objective"), prev: document.getElementById("prev"),
    next: document.getElementById("next"), status: document.getElementById("status"),
    title: document.getElementById("mtitle")
  };
  var state = { i: 0, answers: {}, quiz: {}, sorts: {}, visited: {} };

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function save(status) {
    var scr = M.screens[state.i];
    S.set("cmi.core.lesson_location", scr.id);
    S.set("cmi.suspend_data", JSON.stringify({
      v: 1, i: state.i, answers: state.answers, quiz: state.quiz, sorts: state.sorts
    }));
    if (status) S.set("cmi.core.lesson_status", status);
    S.commit();
  }

  function restore() {
    var raw = S.get("cmi.suspend_data");
    if (!raw) return;
    try {
      var d = JSON.parse(raw);
      if (d && d.v === 1) {
        state.i = Math.min(d.i || 0, M.screens.length - 1);
        state.answers = d.answers || {};
        state.quiz = d.quiz || {};
        state.sorts = d.sorts || {};
      }
    } catch (e) { state.i = 0; }
  }

  function objectiveText(id) {
    var o = (M.objectives || []).filter(function (x) { return x.id === id; })[0];
    return o ? "Objective: " + o.text : "";
  }

  function drawMap() {
    el.map.innerHTML = "";
    M.screens.forEach(function (s, n) {
      var li = document.createElement("li");
      li.dataset.state = n === state.i ? "current" : (state.visited[s.id] ? "done" : "upcoming");
      li.appendChild(h("span", "dot")).setAttribute("aria-hidden", "true");
      li.appendChild(h("span", null, s.eyebrow || s.title));
      if (n === state.i) li.setAttribute("aria-current", "step");
      el.map.appendChild(li);
    });
  }

  function pct() { return Math.round(((state.i + 1) / M.screens.length) * 100); }

  function figure(scr) {
    if (!scr.asset) return null;
    var f = h("figure");
    if (scr.asset.svg) {
      f.innerHTML = scr.asset.svg;
      var svg = f.querySelector("svg");
      if (svg) { svg.setAttribute("role", "img"); svg.setAttribute("aria-label", scr.asset.alt || ""); }
    } else if (scr.asset.src) {
      var img = document.createElement("img");
      img.src = scr.asset.src;
      img.alt = scr.asset.alt || "";
      f.appendChild(img);
    }
    if (scr.asset.caption) f.appendChild(h("figcaption", null, scr.asset.caption));
    return f;
  }

  function claimNote(scr) {
    if (!scr.claims || !scr.claims.length) return null;
    return h("p", "claim", "Sources: " + scr.claims.join(", "));
  }

  function renderBullets(scr, host) {
    if (!scr.bullets) return;
    var ul = h("ul", "bullets");
    scr.bullets.forEach(function (b) { ul.appendChild(h("li", null, b)); });
    host.appendChild(ul);
  }

  function renderCards(scr, host) {
    if (!scr.cards) return;
    var wrap = h("div", "a-cards");
    scr.cards.forEach(function (c) {
      var card = h("div", "card");
      if (c.tag) card.appendChild(h("span", "tag", c.tag));
      if (c.title) card.appendChild(h("h3", null, c.title));
      if (c.body) card.appendChild(h("p", null, c.body));
      wrap.appendChild(card);
    });
    host.appendChild(wrap);
  }

  function renderSteps(scr, host) {
    if (!scr.steps) return;
    var ol = h("ol", "steps");
    scr.steps.forEach(function (s) {
      var li = document.createElement("li");
      var box = h("div");
      if (s.title) box.appendChild(h("strong", null, s.title));
      if (s.body) box.appendChild(h("span", null, s.body));
      li.appendChild(box);
      ol.appendChild(li);
    });
    host.appendChild(ol);
  }

  function renderTable(scr, host) {
    if (!scr.table) return;
    var t = h("table", "tbl");
    if (scr.table.caption) t.appendChild(h("caption", null, scr.table.caption));
    var thead = h("thead"), hr = h("tr");
    scr.table.head.forEach(function (c) {
      var th = h("th", null, c);
      th.scope = "col";
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    t.appendChild(thead);
    var tb = h("tbody");
    scr.table.rows.forEach(function (r) {
      var tr = h("tr");
      r.forEach(function (c, n) {
        var cell = h(n === 0 ? "th" : "td", null, c);
        if (n === 0) cell.scope = "row";
        tr.appendChild(cell);
      });
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    host.appendChild(t);
  }

  function renderHotspots(scr, host) {
    if (!scr.hotspots) return;
    var ul = h("ul", "hotspots");
    scr.hotspots.forEach(function (spot, n) {
      var li = document.createElement("li");
      var b = h("button", "hot");
      b.type = "button";
      var open = state.answers[scr.id + ":" + n] === "open";
      b.setAttribute("aria-expanded", open ? "true" : "false");
      b.appendChild(h("strong", null, spot.label));
      li.appendChild(b);
      if (open) li.appendChild(h("p", "hot-body", spot.detail));
      b.onclick = function () {
        state.answers[scr.id + ":" + n] = open ? "" : "open";
        save(); render();
      };
      ul.appendChild(li);
    });
    host.appendChild(ul);
  }

  function renderChoice(scr, host) {
    var answered = state.answers[scr.id];
    var ul = h("ul", "choices");
    scr.options.forEach(function (o) {
      var li = document.createElement("li");
      var b = h("button", "choice");
      b.type = "button";
      b.setAttribute("aria-pressed", answered === o.id ? "true" : "false");
      b.appendChild(h("span", null, o.text));
      if (answered) {
        b.disabled = true;
        if (o.correct) b.dataset.verdict = "right";
        else if (answered === o.id) b.dataset.verdict = "wrong";
        if (o.correct || answered === o.id) {
          b.insertBefore(h("span", "verdict", o.correct ? "Correct: " : "Not this one: "), b.firstChild);
        }
      }
      b.onclick = function () {
        state.answers[scr.id] = o.id;
        save(); render();
        el.status.textContent = o.correct ? "Correct." : "Not correct. Read the explanation.";
      };
      li.appendChild(b);
      ul.appendChild(li);
    });
    host.appendChild(ul);
    if (answered) {
      var chosen = scr.options.filter(function (o) { return o.id === answered; })[0];
      var fb = h("div", "feedback reveal");
      fb.appendChild(h("p", null, chosen.feedback || ""));
      if (scr.takeaway) fb.appendChild(h("p", null, scr.takeaway));
      host.appendChild(fb);
    }
  }

  function renderSort(scr, host) {
    var picks = state.sorts[scr.id] || {};
    scr.pairs.forEach(function (pair, n) {
      var row = h("div", "sortrow");
      row.appendChild(h("p", null, pair.item));
      var sel = document.createElement("select");
      sel.setAttribute("aria-label", "Category for: " + pair.item);
      var blank = document.createElement("option");
      blank.value = ""; blank.textContent = "Choose a category";
      sel.appendChild(blank);
      scr.categories.forEach(function (c) {
        var op = document.createElement("option");
        op.value = c; op.textContent = c;
        if (picks[n] === c) op.selected = true;
        sel.appendChild(op);
      });
      sel.onchange = function () {
        picks[n] = sel.value;
        state.sorts[scr.id] = picks;
        save(); render();
      };
      row.appendChild(sel);
      host.appendChild(row);
    });
    var done = scr.pairs.every(function (p, n) { return picks[n]; });
    if (done) {
      var right = scr.pairs.filter(function (p, n) { return picks[n] === p.category; }).length;
      var fb = h("div", "feedback reveal");
      fb.appendChild(h("p", null, right + " of " + scr.pairs.length + " placed correctly."));
      scr.pairs.forEach(function (p, n) {
        if (picks[n] !== p.category) {
          fb.appendChild(h("p", null, p.item + " belongs in " + p.category + ". " + (p.why || "")));
        }
      });
      if (right === scr.pairs.length && scr.takeaway) fb.appendChild(h("p", null, scr.takeaway));
      host.appendChild(fb);
    }
  }

  function renderQuiz(scr, host) {
    var q = state.quiz[scr.id] || { answers: {}, submitted: false };
    scr.items.forEach(function (item) {
      host.appendChild(h("h3", null, item.stem));
      var ul = h("ul", "choices");
      item.options.forEach(function (o) {
        var li = document.createElement("li");
        var b = h("button", "choice");
        b.type = "button";
        b.appendChild(h("span", null, o.text));
        b.setAttribute("aria-pressed", q.answers[item.id] === o.id ? "true" : "false");
        if (q.submitted) {
          b.disabled = true;
          if (o.correct) b.dataset.verdict = "right";
          else if (q.answers[item.id] === o.id) b.dataset.verdict = "wrong";
        }
        b.onclick = function () {
          q.answers[item.id] = o.id;
          state.quiz[scr.id] = q;
          save(); render();
        };
        li.appendChild(b);
        ul.appendChild(li);
      });
      host.appendChild(ul);
      if (q.submitted) {
        var chosen = item.options.filter(function (o) { return o.id === q.answers[item.id]; })[0];
        var fb = h("div", "feedback");
        fb.appendChild(h("p", null, chosen ? chosen.feedback : "No answer selected."));
        host.appendChild(fb);
      }
    });
    var all = scr.items.every(function (i) { return q.answers[i.id]; });
    if (!q.submitted) {
      var sub = h("button", "accent", "Submit answers");
      sub.type = "button";
      sub.disabled = !all;
      sub.onclick = function () { grade(scr, q); };
      host.appendChild(sub);
    } else {
      var res = h("div", "feedback");
      res.appendChild(h("p", null, "Score " + q.score + "% (mastery " + M.mastery + "%): " +
        (q.score >= M.mastery ? "passed" : "not yet passed")));
      host.appendChild(res);
      if (q.score < M.mastery) {
        var retry = h("button", "ghost", "Retry assessment");
        retry.type = "button";
        retry.onclick = function () {
          state.quiz[scr.id] = { answers: {}, submitted: false };
          save(); render();
        };
        host.appendChild(retry);
      }
    }
  }

  function grade(scr, q) {
    var right = scr.items.filter(function (i) {
      var pick = i.options.filter(function (o) { return o.id === q.answers[i.id]; })[0];
      return pick && pick.correct;
    }).length;
    q.score = Math.round((right / scr.items.length) * 100);
    q.submitted = true;
    state.quiz[scr.id] = q;
    S.set("cmi.core.score.min", 0);
    S.set("cmi.core.score.max", 100);
    S.set("cmi.core.score.raw", q.score);
    save(q.score >= M.mastery ? "passed" : "failed");
    el.status.textContent = "Assessment scored " + q.score + " percent.";
    render();
  }

  function render() {
    var scr = M.screens[state.i];
    state.visited[scr.id] = true;
    el.title.textContent = M.title;
    el.screen.innerHTML = "";
    el.screen.dataset.archetype = scr.archetype || "A3";
    var wrap = h("div", scr.asset ? "a-split" : "a-canvas");
    var col = h("div");
    if (scr.eyebrow) col.appendChild(h("p", "eyebrow", scr.eyebrow));
    var head = h(state.i === 0 ? "h1" : "h2", null, scr.title || "");
    head.tabIndex = -1;
    col.appendChild(head);
    if (scr.body) col.appendChild(h("p", scr.signature ? "lede signature" : "lede", scr.body));
    renderBullets(scr, col);
    if (scr.prompt) col.appendChild(h("p", null, scr.prompt));
    renderSteps(scr, col);
    renderCards(scr, col);
    renderTable(scr, col);
    renderHotspots(scr, col);
    if (scr.badge) {
      var bp = h("p");
      bp.appendChild(h("span", "badge", scr.badge));
      col.appendChild(bp);
    }
    if (scr.type === "choice") renderChoice(scr, col);
    if (scr.type === "sort") renderSort(scr, col);
    if (scr.type === "quiz") renderQuiz(scr, col);
    if (scr.footnote) col.appendChild(h("p", null, scr.footnote));
    var note = claimNote(scr);
    if (note) col.appendChild(note);
    wrap.appendChild(col);
    var fig = figure(scr);
    if (fig) wrap.appendChild(fig);
    el.screen.appendChild(wrap);
    el.obj.textContent = objectiveText(scr.objective);
    el.prog.value = pct();
    el.ptext.textContent = pct() + "%";
    el.prev.disabled = state.i === 0;
    var last = state.i === M.screens.length - 1;
    el.next.textContent = last ? "Finish" : "Continue";
    el.next.disabled = scr.type === "quiz" && !(state.quiz[scr.id] && state.quiz[scr.id].submitted);
    drawMap();
    head.focus();
  }

  function complete() {
    var quizzes = Object.keys(state.quiz).map(function (k) { return state.quiz[k]; });
    var scored = quizzes.filter(function (q) { return typeof q.score === "number"; });
    var status = !scored.length ? "completed"
      : (scored[scored.length - 1].score >= M.mastery ? "passed" : "failed");
    save(status);
    el.status.textContent = "Module " + status + ". Progress saved.";
    el.next.disabled = true;
  }

  el.next.onclick = function () {
    if (state.i < M.screens.length - 1) { state.i++; save(); render(); } else complete();
  };
  el.prev.onclick = function () {
    if (state.i > 0) { state.i--; save(); render(); }
  };
  document.addEventListener("keydown", function (e) {
    if (e.altKey && e.key === "ArrowRight") el.next.click();
    if (e.altKey && e.key === "ArrowLeft") el.prev.click();
  });

  S.init();
  if (!S.get("cmi.core.lesson_status") || S.get("cmi.core.lesson_status") === "not attempted") {
    S.set("cmi.core.lesson_status", "incomplete");
  }
  restore();
  render();
  save();
  window.addEventListener("beforeunload", function () { S.finish(); });
})();
