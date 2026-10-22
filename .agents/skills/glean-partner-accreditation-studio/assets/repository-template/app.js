/* Runtime: renders archetype screens, tracks state, scores the assessment. Offline and keyboard safe. */
(function () {
  var M = window.MODULE, S = window.SCORM;
  var el = { screen: document.getElementById("screen"), map: document.getElementById("map"),
    prog: document.getElementById("prog"), ptext: document.getElementById("ptext"),
    obj: document.getElementById("objective"), prev: document.getElementById("prev"),
    next: document.getElementById("next"), status: document.getElementById("status"),
    title: document.getElementById("mtitle") };
  var state = { i: 0, answers: {}, quiz: {}, visited: {} };

  function save(status) {
    var scr = M.screens[state.i];
    S.set("cmi.core.lesson_location", scr.id);
    S.set("cmi.suspend_data", JSON.stringify({ v: 1, i: state.i, answers: state.answers, quiz: state.quiz }));
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
        state.answers = d.answers || {}; state.quiz = d.quiz || {};
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
      li.dataset.state = n === state.i ? "current" : (state.visited[s.id] ? "done" : "todo");
      li.innerHTML = '<span class="dot" aria-hidden="true"></span><span></span>';
      li.lastChild.textContent = s.eyebrow || s.title;
      if (n === state.i) li.setAttribute("aria-current", "step");
      el.map.appendChild(li);
    });
  }

  function pct() { return Math.round(((state.i + 1) / M.screens.length) * 100); }

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function figure(scr) {
    if (!scr.asset) return null;
    var f = h("figure"), img = document.createElement("img");
    img.src = scr.asset.src; img.alt = scr.asset.alt || ""; f.appendChild(img);
    if (scr.asset.caption) f.appendChild(h("figcaption", null, scr.asset.caption));
    return f;
  }

  function claimNote(scr) {
    if (!scr.claims || !scr.claims.length) return null;
    return h("p", "claim", "Sources: " + scr.claims.join(", "));
  }

  function renderChoice(scr, host) {
    var answered = state.answers[scr.id];
    var ul = h("ul", "choices");
    scr.options.forEach(function (o) {
      var li = document.createElement("li");
      var b = h("button", "choice", null);
      b.type = "button"; b.setAttribute("aria-pressed", answered === o.id ? "true" : "false");
      b.appendChild(h("span", null, o.text));
      if (answered) {
        b.dataset.verdict = o.correct ? "right" : (answered === o.id ? "wrong" : "");
        b.disabled = true;
        if (o.correct || answered === o.id) {
          var v = h("span", "verdict", o.correct ? "Correct: " : "Not this one: ");
          b.insertBefore(v, b.firstChild);
        }
      }
      b.onclick = function () {
        state.answers[scr.id] = o.id; save(); render();
        el.status.textContent = o.correct ? "Correct." : "Not correct. Read the explanation.";
      };
      li.appendChild(b); ul.appendChild(li);
    });
    host.appendChild(ul);
    if (answered) {
      var chosen = scr.options.filter(function (o) { return o.id === answered; })[0];
      var fb = h("div", "feedback reveal");
      fb.appendChild(h("p", null, chosen.feedback || ""));
      host.appendChild(fb);
    }
  }

  function renderQuiz(scr, host) {
    var q = state.quiz[scr.id] || { answers: {}, submitted: false };
    scr.items.forEach(function (item) {
      host.appendChild(h("h3", null, item.stem));
      var ul = h("ul", "choices");
      item.options.forEach(function (o) {
        var li = document.createElement("li"), b = h("button", "choice", null);
        b.type = "button"; b.appendChild(h("span", null, o.text));
        b.setAttribute("aria-pressed", q.answers[item.id] === o.id ? "true" : "false");
        if (q.submitted) {
          b.disabled = true;
          if (o.correct) b.dataset.verdict = "right";
          else if (q.answers[item.id] === o.id) b.dataset.verdict = "wrong";
        }
        b.onclick = function () { q.answers[item.id] = o.id; state.quiz[scr.id] = q; save(); render(); };
        li.appendChild(b); ul.appendChild(li);
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
      sub.type = "button"; sub.disabled = !all;
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
        retry.onclick = function () { state.quiz[scr.id] = { answers: {}, submitted: false }; save(); render(); };
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
    q.submitted = true; state.quiz[scr.id] = q;
    S.set("cmi.core.score.min", 0); S.set("cmi.core.score.max", 100); S.set("cmi.core.score.raw", q.score);
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
    head.tabIndex = -1; col.appendChild(head);
    if (scr.body) col.appendChild(h("p", null, scr.body));
    if (scr.prompt) col.appendChild(h("p", null, scr.prompt));
    if (scr.badge) { var b = h("p"); b.appendChild(h("span", "badge", scr.badge)); col.appendChild(b); }
    if (scr.type === "choice") renderChoice(scr, col);
    if (scr.type === "quiz") renderQuiz(scr, col);
    var note = claimNote(scr); if (note) col.appendChild(note);
    wrap.appendChild(col);
    var fig = figure(scr); if (fig) wrap.appendChild(fig);
    el.screen.appendChild(wrap);
    el.obj.textContent = objectiveText(scr.objective);
    el.prog.value = pct(); el.ptext.textContent = pct() + "%";
    el.prev.disabled = state.i === 0;
    var last = state.i === M.screens.length - 1;
    el.next.textContent = last ? "Finish" : "Continue";
    el.next.disabled = scr.type === "quiz" && !(state.quiz[scr.id] && state.quiz[scr.id].submitted);
    drawMap(); head.focus();
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
  el.prev.onclick = function () { if (state.i > 0) { state.i--; save(); render(); } };
  document.addEventListener("keydown", function (e) {
    if (e.altKey && e.key === "ArrowRight") el.next.click();
    if (e.altKey && e.key === "ArrowLeft") el.prev.click();
  });

  S.init();
  if (!S.get("cmi.core.lesson_status") || S.get("cmi.core.lesson_status") === "not attempted") {
    S.set("cmi.core.lesson_status", "incomplete");
  }
  restore(); render(); save();
  window.addEventListener("beforeunload", function () { S.finish(); });
})();
