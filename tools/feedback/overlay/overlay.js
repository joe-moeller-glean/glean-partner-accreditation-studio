/* Glean accreditation review overlay. DEVELOPMENT ONLY.
 *
 * Injected by tools/feedback/server.py into pages it serves. It is never written into a module
 * folder or a SCORM package; tools/feedback/markers.py fails any package containing it.
 *
 * Select text on the page to add a comment, suggest an edit (redline: strike the original and
 * propose replacement text), or highlight it. Comments are anchored by the selected text plus its
 * surrounding context, so they re-attach after reloads and screen changes. Highlights use the CSS
 * Custom Highlight API, so the page DOM, its text, and its event handlers are never modified.
 */
(function () {
  "use strict";
  if (window.__GLEAN_FEEDBACK__) return;
  var script = document.currentScript;
  var CFG = JSON.parse(script.getAttribute("data-config") || "{}");
  window.__GLEAN_FEEDBACK__ = { version: 1, config: CFG, ready: false };

  var HOST_TAG = "glean-feedback-overlay";
  var CONTEXT = 48;
  var LS_AUTHOR = "glean-feedback:author";
  var LS_OPEN = "glean-feedback:panel-open";
  var HAS_HIGHLIGHTS = typeof CSS !== "undefined" && CSS.highlights && typeof Highlight === "function";

  var state = {
    comments: [],
    anchors: new Map(),       // id -> Range | null
    filter: "open",
    activeId: null,
    pending: null,            // { range, kind } while composing
    panelOpen: localStorage.getItem(LS_OPEN) === "1",
    author: localStorage.getItem(LS_AUTHOR) || "",
    editing: null,
  };

  // ---------- API ----------------------------------------------------------------------------
  function api(method, path, body) {
    return fetch(CFG.api + path, {
      method: method,
      headers: { "Content-Type": "application/json", "X-Feedback-Dev": "1" },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error(j.error || "Request failed (" + r.status + ")");
        return j;
      });
    });
  }
  function load() {
    var q = "?scope_type=" + encodeURIComponent(CFG.scope_type) + "&scope_id=" + encodeURIComponent(CFG.scope_id) +
      "&page=" + encodeURIComponent(CFG.page);
    return api("GET", "/comments" + q).then(function (j) {
      state.comments = j.comments;
      reanchor(true);
    }).catch(function (e) { toast(e.message, true); });
  }
  function upsert(c) {
    var i = state.comments.findIndex(function (x) { return x.id === c.id; });
    if (i >= 0) state.comments[i] = c; else state.comments.push(c);
  }

  // ---------- text index and anchoring -------------------------------------------------------
  function skip(node) {
    var p = node.parentElement;
    if (!p) return true;
    return !!p.closest("script,style,noscript,template," + HOST_TAG);
  }
  // Whitespace-normalized text of a root with a map from normalized index to (node, offset).
  function textIndex(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return skip(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; },
    });
    var chars = [], map = [], space = true, n;
    while ((n = walker.nextNode())) {
      var d = n.data;
      for (var i = 0; i < d.length; i++) {
        var ch = d[i];
        if (/\s/.test(ch)) {
          if (space) continue;
          space = true;
          chars.push(" ");
        } else {
          space = false;
          chars.push(ch);
        }
        map.push([n, i]);
      }
    }
    return { text: chars.join(""), map: map };
  }
  function norm(s) { return (s || "").replace(/\s+/g, " ").trim(); }
  function pointIndex(idx, container, offset) {
    var probe = document.createRange();
    probe.setStart(container, offset);
    // First indexed character at or after the boundary point.
    var lo = 0, hi = idx.map.length;
    while (lo < hi) {
      var mid = (lo + hi) >> 1, m = idx.map[mid];
      if (probe.comparePoint(m[0], m[1]) < 0) lo = mid + 1; else hi = mid;
    }
    return lo;
  }
  function rangeFor(idx, start, end) {
    if (start >= end || end > idx.map.length) return null;
    var a = idx.map[start], b = idx.map[end - 1];
    var r = document.createRange();
    r.setStart(a[0], a[1]);
    r.setEnd(b[0], b[1] + 1);
    return r;
  }
  function commonSuffix(a, b) { var n = 0; while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++; return n; }
  function commonPrefix(a, b) { var n = 0; while (n < a.length && n < b.length && a[n] === b[n]) n++; return n; }

  function locate(c, bodyIdx) {
    var quote = norm(c.quote);
    if (!quote) return null;
    var roots = [];
    var sec = c.section_id && document.getElementById(c.section_id);
    if (sec) roots.push([textIndex(sec), true]);
    roots.push([bodyIdx, false]);
    for (var k = 0; k < roots.length; k++) {
      var idx = roots[k][0], best = null, bestScore = -Infinity, from = 0, guard = 0;
      while (guard++ < 200) {
        var at = idx.text.indexOf(quote, from);
        if (at < 0) break;
        var score = commonSuffix(norm(c.prefix), idx.text.slice(Math.max(0, at - CONTEXT), at)) +
          commonPrefix(norm(c.suffix), idx.text.slice(at + quote.length, at + quote.length + CONTEXT));
        if (!roots[k][1] && typeof c.text_offset === "number") score -= Math.abs(at - c.text_offset) / 5000;
        if (score > bestScore) { bestScore = score; best = at; }
        from = at + 1;
      }
      if (best !== null) return rangeFor(idx, best, best + quote.length);
    }
    return null;
  }

  var lastOrphans = "";
  function reanchor(forceCards) {
    var bodyIdx = textIndex(document.body);
    state.comments.forEach(function (c) { state.anchors.set(c.id, c.quote ? locate(c, bodyIdx) : null); });
    paint();
    var orphans = state.comments.filter(isOrphan).map(function (c) { return c.id; }).join(",");
    if (forceCards || orphans !== lastOrphans) renderCards();
    lastOrphans = orphans;
    window.__GLEAN_FEEDBACK__.ready = true;
  }
  function isOrphan(c) { return !!c.quote && !state.anchors.get(c.id); }

  // ---------- painting: highlights and redline insertions ------------------------------------
  function visible(c) {
    if (state.filter === "open") return c.status === "open";
    if (state.filter === "resolved") return c.status !== "open";
    return true;
  }
  function paint() {
    var groups = { "fb-comment": [], "fb-suggest": [], "fb-mark": [], "fb-resolved": [], "fb-active": [] };
    layer.textContent = "";
    state.comments.forEach(function (c) {
      var r = state.anchors.get(c.id);
      if (!r || !visible(c)) return;
      var g = c.status !== "open" ? "fb-resolved" : c.kind === "suggestion" ? "fb-suggest" : c.kind === "highlight" ? "fb-mark" : "fb-comment";
      groups[g].push(r);
      if (c.id === state.activeId) groups["fb-active"].push(r);
      if (c.kind === "suggestion" && c.status === "open") insertionBubble(c, r);
    });
    if (state.pending) groups["fb-active"].push(state.pending.range);
    if (!HAS_HIGHLIGHTS) return;
    Object.keys(groups).forEach(function (name) {
      if (groups[name].length) CSS.highlights.set(name, new Highlight(...groups[name]));
      else CSS.highlights.delete(name);
    });
  }
  function insertionBubble(c, r) {
    var rects = r.getClientRects();
    if (!rects.length) return;
    var last = rects[rects.length - 1];
    if (!last.width && !last.height) return;
    var el = document.createElement("button");
    el.type = "button";
    el.className = "ins";
    el.textContent = c.replacement ? c.replacement : "⌫ delete";
    el.title = "Suggested edit by " + c.author;
    el.style.left = (last.right + window.scrollX + 2) + "px";
    el.style.top = (last.top + window.scrollY) + "px";
    el.addEventListener("click", function () { focusComment(c.id, false); });
    layer.appendChild(el);
  }
  var paintQueued = false;
  function queuePaint() {
    if (paintQueued) return;
    paintQueued = true;
    requestAnimationFrame(function () { paintQueued = false; paint(); });
  }

  // ---------- UI ----------------------------------------------------------------------------
  var host = document.createElement(HOST_TAG);
  host.setAttribute("data-feedback-dev", "");
  var root = host.attachShadow({ mode: "open" });
  root.innerHTML =
    '<link rel="stylesheet" href="/__feedback/overlay.css">' +
    '<div class="layer" aria-hidden="false"></div>' +
    '<div class="toolbar" role="toolbar" aria-label="Review selection" hidden>' +
    '<button type="button" data-act="comment" title="Comment (Ctrl+Alt+M)">Comment</button>' +
    '<button type="button" data-act="suggestion" title="Suggest an edit">Suggest edit</button>' +
    '<button type="button" data-act="highlight" title="Highlight">Highlight</button></div>' +
    '<button type="button" class="fab" aria-expanded="false" aria-controls="fb-panel">Review <span class="count">0</span></button>' +
    '<aside class="panel" id="fb-panel" aria-label="Review comments" hidden>' +
    '<header><div class="title"><strong>Review</strong><span class="scope"></span>' +
    '<button type="button" class="close" aria-label="Close review panel">×</button></div>' +
    '<label class="author">Your name <input type="text" autocomplete="name" maxlength="120"></label>' +
    '<div class="filters" role="group" aria-label="Show">' +
    '<button type="button" data-filter="open">Open</button><button type="button" data-filter="resolved">Resolved</button>' +
    '<button type="button" data-filter="all">All</button></div>' +
    '<button type="button" class="section-comment">Comment on this section</button></header>' +
    '<form class="composer" hidden><p class="composer-kind"></p><blockquote class="composer-quote"></blockquote>' +
    '<label class="replacement-label" hidden>Replace with<textarea class="replacement" rows="3"></textarea></label>' +
    '<label class="body-label"><span>Comment</span><textarea class="body" rows="3"></textarea></label>' +
    '<div class="row"><button type="submit" class="primary">Save</button><button type="button" class="cancel">Cancel</button></div></form>' +
    '<div class="toast" role="status" aria-live="polite"></div>' +
    '<ol class="cards"></ol>' +
    '<footer>Development review overlay. Not included in SCORM packages.</footer></aside>';
  var $ = function (s) { return root.querySelector(s); };
  var layer = $(".layer"), toolbar = $(".toolbar"), fab = $(".fab"), panel = $(".panel"), cards = $(".cards");
  var composer = $(".composer"), authorInput = $(".author input");
  root.querySelector(".scope").textContent = " · " + CFG.scope_id + (CFG.page && CFG.page !== "index.html" && CFG.page !== "accreditation" ? " / " + CFG.page : "");
  authorInput.value = state.author;

  var pageStyle = document.createElement("style");
  pageStyle.setAttribute("data-feedback-dev", "");
  pageStyle.textContent =
    "::highlight(fb-comment){background-color:rgba(255,200,40,.42)}" +
    "::highlight(fb-mark){background-color:rgba(120,230,140,.45)}" +
    "::highlight(fb-suggest){background-color:rgba(229,57,53,.10);color:#b3261e;text-decoration:line-through;text-decoration-color:#d93025;text-decoration-thickness:2px}" +
    "::highlight(fb-resolved){background-color:rgba(140,140,150,.18)}" +
    "::highlight(fb-active){background-color:rgba(51,51,255,.28)}" +
    "html[data-fb-open] body{margin-right:380px!important}" +
    "@media (max-width:900px){html[data-fb-open] body{margin-right:0!important}}";

  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function when(ts) { try { return new Date(ts).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return ts; } }
  function toast(msg, isError) {
    var t = $(".toast");
    t.textContent = msg;
    t.className = "toast show" + (isError ? " error" : "");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.className = "toast"; }, isError ? 6000 : 2500);
    if (isError && !state.panelOpen) setPanel(true);
  }
  function setPanel(open) {
    state.panelOpen = open;
    localStorage.setItem(LS_OPEN, open ? "1" : "0");
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    if (open) document.documentElement.setAttribute("data-fb-open", "");
    else document.documentElement.removeAttribute("data-fb-open");
    queuePaint();
  }
  function updateCount() {
    var n = state.comments.filter(function (c) { return c.status === "open"; }).length;
    fab.querySelector(".count").textContent = n;
  }

  function orderKey(c) {
    var r = state.anchors.get(c.id);
    return r;
  }
  function sorted() {
    return state.comments.filter(visible).sort(function (a, b) {
      var ra = orderKey(a), rb = orderKey(b);
      if (ra && rb) { var cmp = ra.compareBoundaryPoints(Range.START_TO_START, rb); if (cmp) return cmp; }
      else if (ra || rb) return ra ? -1 : 1;
      return a.created_at < b.created_at ? -1 : 1;
    });
  }
  var KIND_LABEL = { comment: "Comment", suggestion: "Suggested edit", highlight: "Highlight" };
  function renderCards() {
    updateCount();
    root.querySelectorAll(".filters button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.filter === state.filter));
    });
    var list = sorted();
    if (!list.length) {
      cards.innerHTML = '<li class="empty">' + (state.filter === "open" ? "No open comments on this page. Select text to add one." : "Nothing to show.") + "</li>";
      return;
    }
    cards.innerHTML = list.map(function (c) {
      var orphan = isOrphan(c);
      var quote = "";
      if (c.kind === "suggestion") {
        quote = '<p class="redline"><del>' + esc(c.quote) + "</del> " + (c.replacement ? "<ins>" + esc(c.replacement) + "</ins>" : '<em class="muted">(delete)</em>') + "</p>";
      } else if (c.quote) {
        quote = '<blockquote>' + esc(c.quote) + "</blockquote>";
      }
      var editing = state.editing === c.id;
      var bodyHtml = editing
        ? '<form class="edit">' + (c.kind === "suggestion" ? '<label>Replace with<textarea class="e-repl" rows="2">' + esc(c.replacement) + "</textarea></label>" : "") +
          '<label>Comment<textarea class="e-body" rows="3">' + esc(c.body) + '</textarea></label><div class="row"><button type="submit" class="primary">Save</button><button type="button" data-act="cancel-edit">Cancel</button></div></form>'
        : (c.body ? '<p class="body">' + esc(c.body) + "</p>" : "");
      return '<li class="card kind-' + c.kind + " status-" + c.status + (c.id === state.activeId ? " active" : "") + (orphan ? " orphan" : "") + '" data-id="' + esc(c.id) + '" tabindex="0">' +
        '<div class="meta"><span class="badge">' + KIND_LABEL[c.kind] + "</span>" +
        (c.status !== "open" ? '<span class="badge st">' + esc(c.status) + "</span>" : "") +
        '<span class="where">' + esc(c.section_label || c.section_id || "") + "</span></div>" +
        (orphan ? '<p class="warn">Text not found on this screen. It may have changed or be on another screen.</p>' : "") +
        quote + bodyHtml +
        '<p class="byline">' + esc(c.author) + " · " + when(c.created_at) + "</p>" +
        (c.replies.length ? '<ul class="replies">' + c.replies.map(function (r) {
          return "<li><strong>" + esc(r.author) + "</strong> " + esc(r.body) + ' <span class="muted">' + when(r.created_at) + "</span></li>";
        }).join("") + "</ul>" : "") +
        (c.status === "open" ? '<form class="reply"><label class="sr">Reply</label><textarea rows="1" placeholder="Reply"></textarea><button type="submit">Reply</button></form>' : "") +
        '<div class="actions">' +
        (c.status === "open" ? '<button type="button" data-act="resolve">Resolve</button>' : '<button type="button" data-act="reopen">Reopen</button>') +
        (c.status === "open" ? '<button type="button" data-act="edit">Edit</button>' : "") +
        '<button type="button" data-act="delete" class="danger">Delete</button></div></li>';
    }).join("");
  }

  // ---------- selection -> toolbar -> composer ----------------------------------------------
  function selectionRange() {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
    var r = sel.getRangeAt(0);
    var anc = r.commonAncestorContainer;
    var el = anc.nodeType === 1 ? anc : anc.parentElement;
    if (!el || !document.body.contains(el) || el.closest(HOST_TAG)) return null;
    if (el.closest("input,textarea,select,[contenteditable=''],[contenteditable='true']")) return null;
    if (!norm(r.toString())) return null;
    return r.cloneRange();
  }
  function showToolbar() {
    var r = selectionRange();
    if (!r) { toolbar.hidden = true; return; }
    var rect = r.getBoundingClientRect();
    toolbar.hidden = false;
    var w = toolbar.offsetWidth || 260;
    var left = Math.min(Math.max(8, rect.left + rect.width / 2 - w / 2), window.innerWidth - w - 8);
    var top = rect.top - 44 < 8 ? rect.bottom + 8 : rect.top - 44;
    toolbar.style.left = left + "px";
    toolbar.style.top = top + "px";
    toolbar._range = r;
  }
  function sectionFor(node) {
    var el = node.nodeType === 1 ? node : node.parentElement;
    var sec = el && (el.closest("section[id],article[id],[data-section-id]") || el.closest("[id]:not(html):not(body)"));
    var label = "";
    var heading = sec && sec.querySelector("h1,h2,h3");
    if (heading) label = norm(heading.textContent);
    if (!label) { // nearest heading before the node
      var hs = Array.prototype.slice.call(document.body.querySelectorAll("h1,h2,h3"));
      for (var i = hs.length - 1; i >= 0; i--) {
        if (hs[i].compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) { label = norm(hs[i].textContent); break; }
      }
    }
    return { id: sec ? (sec.id || sec.getAttribute("data-section-id")) : null, label: label.slice(0, 300) };
  }
  function anchorData(r) {
    var idx = textIndex(document.body);
    var s = pointIndex(idx, r.startContainer, r.startOffset);
    var e = pointIndex(idx, r.endContainer, r.endOffset);
    var quote = idx.text.slice(s, e).trim();
    var lead = idx.text.slice(s, e).length - idx.text.slice(s, e).trimStart().length;
    s += lead;
    return {
      quote: quote,
      prefix: idx.text.slice(Math.max(0, s - CONTEXT), s),
      suffix: idx.text.slice(s + quote.length, s + quote.length + CONTEXT),
      text_offset: s,
      range: rangeFor(idx, s, s + quote.length) || r,
    };
  }
  function openComposer(kind, range) {
    var sec, a = null;
    if (range) {
      a = anchorData(range);
      sec = sectionFor(range.startContainer);
      state.pending = { range: a.range, kind: kind, anchor: a, section: sec };
    } else {
      var probe = document.elementFromPoint(Math.min(window.innerWidth * 0.35, 400), window.innerHeight * 0.3) || document.body;
      sec = sectionFor(probe.closest(HOST_TAG) ? document.body : probe);
      state.pending = { range: null, kind: "comment", anchor: null, section: sec };
      kind = "comment";
    }
    window.getSelection().removeAllRanges();
    toolbar.hidden = true;
    setPanel(true);
    composer.hidden = false;
    $(".composer-kind").textContent = (range ? KIND_LABEL[kind] : "Comment on section") + (sec.label ? " · " + sec.label : "");
    var q = $(".composer-quote");
    q.hidden = !a;
    q.textContent = a ? a.quote : "";
    q.classList.toggle("strike", kind === "suggestion");
    $(".replacement-label").hidden = kind !== "suggestion";
    $(".replacement").value = kind === "suggestion" && a ? a.quote : "";
    $(".body-label span").textContent = kind === "comment" ? "Comment" : "Comment (optional)";
    $(".body").value = "";
    queuePaint();
    setTimeout(function () { (kind === "suggestion" ? $(".replacement") : $(".body")).focus(); }, 0);
  }
  function closeComposer() {
    composer.hidden = true;
    state.pending = null;
    queuePaint();
  }
  function requireAuthor() {
    state.author = authorInput.value.trim();
    if (!state.author) { authorInput.focus(); toast("Add your name first.", true); return false; }
    localStorage.setItem(LS_AUTHOR, state.author);
    return true;
  }
  composer.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!state.pending || !requireAuthor()) return;
    var p = state.pending, a = p.anchor;
    var payload = {
      author: state.author, kind: p.kind, scope_type: CFG.scope_type, scope_id: CFG.scope_id, page: CFG.page,
      accreditations: CFG.accreditations || [], section_id: p.section.id, section_label: p.section.label,
      body: $(".body").value, build_ref: CFG.build,
      quote: a ? a.quote : "", prefix: a ? a.prefix : "", suffix: a ? a.suffix : "", text_offset: a ? a.text_offset : null,
    };
    if (p.kind === "suggestion") payload.replacement = $(".replacement").value;
    api("POST", "/comments", payload).then(function (j) {
      upsert(j.comment);
      state.activeId = j.comment.id;
      closeComposer();
      if (state.filter === "resolved") state.filter = "open";
      reanchor(true);
      toast("Saved.");
    }).catch(function (e) { toast(e.message, true); });
  });
  $(".cancel").addEventListener("click", closeComposer);

  // ---------- card actions ------------------------------------------------------------------
  function focusComment(id, scroll) {
    state.activeId = id;
    setPanel(true);
    renderCards();
    paint();
    var card = cards.querySelector('[data-id="' + CSS.escape(id) + '"]');
    if (card) card.scrollIntoView({ block: "nearest" });
    var r = state.anchors.get(id);
    var c = state.comments.find(function (x) { return x.id === id; });
    if (scroll !== false) {
      var target = r ? (r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement)
        : c && c.section_id && document.getElementById(c.section_id);
      if (target && target.scrollIntoView) target.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }
  cards.addEventListener("click", function (ev) {
    var card = ev.target.closest(".card");
    if (!card) return;
    var id = card.dataset.id, act = ev.target.closest("[data-act]");
    if (!act) { if (!ev.target.closest("form,textarea,button")) focusComment(id); return; }
    var a = act.dataset.act;
    if (a === "resolve" || a === "reopen") {
      if (!requireAuthor()) return;
      api("PATCH", "/comments/" + encodeURIComponent(id), { status: a === "resolve" ? "resolved" : "open", by: state.author })
        .then(function (j) { upsert(j.comment); reanchor(true); }).catch(function (e) { toast(e.message, true); });
    } else if (a === "edit") {
      state.editing = id; renderCards();
    } else if (a === "cancel-edit") {
      state.editing = null; renderCards();
    } else if (a === "delete") {
      if (!window.confirm("Delete this comment? This cannot be undone.")) return;
      api("DELETE", "/comments/" + encodeURIComponent(id)).then(function () {
        state.comments = state.comments.filter(function (c) { return c.id !== id; });
        state.anchors.delete(id);
        reanchor(true);
      }).catch(function (e) { toast(e.message, true); });
    }
  });
  cards.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var form = ev.target, card = form.closest(".card"), id = card.dataset.id;
    if (form.classList.contains("reply")) {
      var text = form.querySelector("textarea").value;
      if (!text.trim() || !requireAuthor()) return;
      api("POST", "/comments/" + encodeURIComponent(id) + "/replies", { author: state.author, body: text })
        .then(function (j) { upsert(j.comment); renderCards(); }).catch(function (e) { toast(e.message, true); });
    } else if (form.classList.contains("edit")) {
      var body = { body: form.querySelector(".e-body").value };
      var repl = form.querySelector(".e-repl");
      if (repl) body.replacement = repl.value;
      api("PATCH", "/comments/" + encodeURIComponent(id), body).then(function (j) {
        upsert(j.comment); state.editing = null; reanchor(true);
      }).catch(function (e) { toast(e.message, true); });
    }
  });
  cards.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" && ev.target.classList && ev.target.classList.contains("card")) focusComment(ev.target.dataset.id);
  });

  // ---------- wiring ------------------------------------------------------------------------
  toolbar.addEventListener("mousedown", function (ev) { ev.preventDefault(); }); // keep the page selection
  toolbar.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-act]");
    if (b && toolbar._range) openComposer(b.dataset.act, toolbar._range);
  });
  fab.addEventListener("click", function () { setPanel(!state.panelOpen); });
  $(".close").addEventListener("click", function () { setPanel(false); });
  $(".section-comment").addEventListener("click", function () { openComposer("comment", null); });
  authorInput.addEventListener("change", function () {
    state.author = authorInput.value.trim();
    localStorage.setItem(LS_AUTHOR, state.author);
  });
  root.querySelectorAll(".filters button").forEach(function (b) {
    b.addEventListener("click", function () { state.filter = b.dataset.filter; reanchor(true); });
  });
  function inOverlay(ev) { return ev.composedPath().indexOf(host) >= 0; }
  document.addEventListener("mouseup", function (ev) { if (!inOverlay(ev)) setTimeout(showToolbar, 0); });
  document.addEventListener("keyup", function (ev) { if (!inOverlay(ev) && ev.shiftKey) showToolbar(); });
  document.addEventListener("selectionchange", function () {
    if (!toolbar.hidden && !selectionRange()) toolbar.hidden = true;
  });
  document.addEventListener("keydown", function (ev) {
    if ((ev.ctrlKey || ev.metaKey) && ev.altKey && (ev.key === "m" || ev.key === "M" || ev.code === "KeyM")) {
      var r = selectionRange();
      ev.preventDefault();
      openComposer("comment", r);
    } else if (ev.key === "Escape" && !composer.hidden && inOverlay(ev)) {
      closeComposer();
    }
  });
  // Clicking highlighted text opens its comment. The click still reaches the page as normal.
  document.addEventListener("click", function (ev) {
    if (inOverlay(ev) || !HAS_HIGHLIGHTS) return;
    var sel = window.getSelection();
    if (sel && !sel.isCollapsed) return;
    var pos = document.caretPositionFromPoint ? document.caretPositionFromPoint(ev.clientX, ev.clientY) : null;
    var node = pos ? pos.offsetNode : null, off = pos ? pos.offset : 0;
    if (!pos && document.caretRangeFromPoint) {
      var cr = document.caretRangeFromPoint(ev.clientX, ev.clientY);
      if (cr) { node = cr.startContainer; off = cr.startOffset; }
    }
    if (!node) return;
    var hit = state.comments.find(function (c) {
      var r = state.anchors.get(c.id);
      try { return r && visible(c) && r.isPointInRange(node, off); } catch (e) { return false; }
    });
    if (hit) focusComment(hit.id, false);
  }, true);
  window.addEventListener("resize", queuePaint);
  window.addEventListener("scroll", function () { toolbar.hidden = true; queuePaint(); }, true);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) load(); });
  var moTimer = null;
  new MutationObserver(function () {
    clearTimeout(moTimer);
    moTimer = setTimeout(function () { reanchor(false); }, 250);
  }).observe(document.body, { subtree: true, childList: true, characterData: true });

  function start() {
    document.head.appendChild(pageStyle);
    document.documentElement.appendChild(host);
    setPanel(state.panelOpen);
    if (!HAS_HIGHLIGHTS) toast("This browser lacks the CSS Highlight API; comments list without inline highlights.");
    load();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
