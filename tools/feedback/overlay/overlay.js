/* Glean accreditation review overlay. DEVELOPMENT ONLY.
 *
 * Injected by tools/feedback/server.py into pages it serves. It is never written into a module
 * folder or a SCORM package; tools/feedback/markers.py fails any package containing it.
 *
 * Hold Shift and the pointer becomes a comment bubble; Shift+click starts a comment on the
 * selection under the pointer, or on the word there. Select text without Shift for the normal
 * cursor, then use the toolbar to suggest an edit or highlight. Comments are anchored by the
 * selected text plus its surrounding context, so they re-attach after reloads and screen changes.
 * Highlights use the CSS Custom Highlight API, so the page DOM, its text, and its event handlers
 * are never modified.
 */
(function () {
  "use strict";
  if (window.__GLEAN_FEEDBACK__) return;
  var script = document.currentScript;
  var CFG = JSON.parse(script.getAttribute("data-config") || "{}");
  window.__GLEAN_FEEDBACK__ = { version: 1, config: CFG, ready: false };

  var HOST_TAG = "glean-feedback-overlay";
  var CONTEXT = 48;
  var LS_OPEN = "glean-feedback:panel-open";
  var AGENT_AUTHOR = "reviewer";
  var HAS_HIGHLIGHTS = typeof CSS !== "undefined" && CSS.highlights && typeof Highlight === "function";

  var state = {
    comments: [],
    anchors: new Map(),       // id -> Range | null
    activeId: null,
    pending: null,            // { range, kind } while composing
    panelOpen: localStorage.getItem(LS_OPEN) === "1",
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

  // Collapse whitespace but keep the characters next to the quote. Trimming them makes every
  // copy of a repeated phrase score the same, and the first copy on the page then wins.
  function contextText(s) { return (s || "").replace(/\s+/g, " "); }
  function contextScore(c, text, at, quote) {
    return commonSuffix(contextText(c.prefix), text.slice(Math.max(0, at - CONTEXT), at)) +
      commonPrefix(contextText(c.suffix), text.slice(at + quote.length, at + quote.length + CONTEXT));
  }
  function locate(c, bodyIdx) {
    var quote = norm(c.quote);
    if (!quote) return null;
    var offset = typeof c.text_offset === "number" ? c.text_offset : -1;
    if (offset >= 0 && bodyIdx.text.slice(offset, offset + quote.length) === quote) {
      return rangeFor(bodyIdx, offset, offset + quote.length);
    }
    var best = null, bestRank = -Infinity, from = 0, guard = 0;
    while (guard++ < 2000) {
      var at = bodyIdx.text.indexOf(quote, from);
      if (at < 0) break;
      var dist = offset < 0 ? 0 : Math.abs(at - offset);
      var rank = contextScore(c, bodyIdx.text, at, quote) * 1000 - dist;
      if (rank > bestRank) { bestRank = rank; best = at; }
      from = at + 1;
    }
    return best === null ? null : rangeFor(bodyIdx, best, best + quote.length);
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
  function visible() { return true; }
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
    el.title = "Suggested edit";
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
    '<div class="cursor-bubble" hidden aria-hidden="true"><svg width="28" height="32" viewBox="0 0 28 32" aria-hidden="true">' +
    '<path fill="#3333ff" d="M6 2h16a4 4 0 0 1 4 4v11a4 4 0 0 1-4 4H11l-7 9 1.2-9H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"/></svg></div>' +
    '<div class="toolbar" role="toolbar" aria-label="Review selection" hidden>' +
    '<button type="button" data-act="comment" title="Comment (Shift+click, or Ctrl+Alt+M)">Comment</button>' +
    '<button type="button" data-act="suggestion" title="Suggest an edit">Suggest edit</button>' +
    '<button type="button" data-act="highlight" title="Highlight">Highlight</button></div>' +
    '<form class="composer" role="dialog" aria-modal="false" aria-label="Comment" hidden>' +
    '<p class="composer-kind"></p><blockquote class="composer-quote"></blockquote>' +
    '<label class="replacement-label" hidden>Replace with<textarea class="replacement" rows="2"></textarea></label>' +
    '<label class="body-label"><span>Comment</span><textarea class="body" rows="3"></textarea></label>' +
    '<div class="row"><button type="submit" class="primary">Save</button><button type="button" class="cancel">Cancel</button></div></form>' +
    '<div class="toast" role="status" aria-live="polite"></div>' +
    '<button type="button" class="fab" aria-expanded="false" aria-controls="fb-panel">Review <span class="count">0</span></button>' +
    '<aside class="panel" id="fb-panel" aria-label="Review comments" hidden>' +
    '<header><div class="title"><strong>Review</strong><span class="scope"></span>' +
    '<button type="button" class="close" aria-label="Close review panel">×</button></div>' +
    '<button type="button" class="section-comment">Comment on this section</button></header>' +
    '<ol class="cards"></ol>' +
    '<footer>Open comments are for a coding agent to apply or reject. Not included in SCORM packages.</footer></aside>';
  var $ = function (s) { return root.querySelector(s); };
  var layer = $(".layer"), toolbar = $(".toolbar"), fab = $(".fab"), panel = $(".panel"), cards = $(".cards");
  var composer = $(".composer");
  root.querySelector(".scope").textContent = " · " + CFG.scope_id + (CFG.page && CFG.page !== "index.html" && CFG.page !== "accreditation" ? " / " + CFG.page : "");

  var pageStyle = document.createElement("style");
  pageStyle.setAttribute("data-feedback-dev", "");
  pageStyle.textContent =
    "::highlight(fb-comment){background-color:rgba(255,200,40,.42)}" +
    "::highlight(fb-mark){background-color:rgba(120,230,140,.45)}" +
    "::highlight(fb-suggest){background-color:rgba(229,57,53,.10);color:#b3261e;text-decoration:line-through;text-decoration-color:#d93025;text-decoration-thickness:2px}" +
    "::highlight(fb-resolved){background-color:rgba(140,140,150,.18)}" +
    "::highlight(fb-active){background-color:rgba(51,51,255,.28)}" +
    "html[data-fb-shift] body,html[data-fb-shift] body *{cursor:none!important}";

  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function when(ts) { try { return new Date(ts).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return ts; } }
  function toast(msg, isError) {
    var t = $(".toast");
    t.textContent = msg;
    t.className = "toast show" + (isError ? " error" : "");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.className = "toast"; }, isError ? 6000 : 2500);
  }
  function setPanel(open) {
    state.panelOpen = open;
    localStorage.setItem(LS_OPEN, open ? "1" : "0");
    panel.hidden = !open;
    fab.hidden = open;
    fab.setAttribute("aria-expanded", String(open));
    placeFab();
    if (!composer.hidden) placeComposer();
    queuePaint();
  }
  function placeFab() {
    if (fab.hidden) return;
    var foot = document.querySelector("footer.foot, footer.bar");
    var bottom = 16;
    if (foot) {
      var rect = foot.getBoundingClientRect();
      if (rect.height > 0 && rect.bottom >= window.innerHeight - 8) {
        bottom = Math.round(window.innerHeight - rect.top + 12);
      }
    }
    fab.style.bottom = bottom + "px";
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
  var STATUS_LABEL = { open: "Open", resolved: "Resolved", applied: "Applied", rejected: "Rejected" };
  function renderCards() {
    updateCount();
    var list = sorted();
    if (!list.length) {
      cards.innerHTML = '<li class="empty">No comments on this page. Hold Shift and click text to add one.</li>';
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
        '<span class="badge st st-' + esc(c.status) + '">' + esc(STATUS_LABEL[c.status] || c.status) + "</span>" +
        '<span class="where">' + esc(c.section_label || c.section_id || "") + "</span></div>" +
        (orphan ? '<p class="warn">Text not found on this screen. It may have changed or be on another screen.</p>' : "") +
        quote + bodyHtml +
        '<p class="byline"><code>' + esc(c.id) + "</code> · " + when(c.created_at) + "</p>" +
        (c.replies.length ? '<ul class="replies">' + c.replies.map(function (r) {
          return "<li>" + esc(r.body) + ' <span class="muted">' + when(r.created_at) + "</span></li>";
        }).join("") + "</ul>" : "") +
        '<div class="actions">' +
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
    placeComposer();
    queuePaint();
    setTimeout(function () { (kind === "suggestion" ? $(".replacement") : $(".body")).focus(); }, 0);
  }
  function placeComposer() {
    if (composer.hidden) return;
    var rect = null;
    var range = state.pending && state.pending.range;
    if (range) {
      var rects = range.getClientRects();
      rect = rects.length ? rects[rects.length - 1] : null;
    }
    var w = composer.offsetWidth || 280;
    var h = composer.offsetHeight || 160;
    var panelW = state.panelOpen ? (panel.offsetWidth || 320) : 0;
    var maxRight = window.innerWidth - panelW - 8;
    var left = rect ? rect.left : 16;
    var top = rect ? rect.bottom + 8 : 72;
    if (left + w > maxRight) left = maxRight - w;
    if (left < 8) left = 8;
    if (top + h > window.innerHeight - 8) top = rect ? rect.top - h - 8 : 8;
    if (top < 8) top = 8;
    composer.style.left = left + "px";
    composer.style.top = top + "px";
  }
  function closeComposer() {
    composer.hidden = true;
    state.pending = null;
    queuePaint();
  }
  composer.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!state.pending) return;
    var p = state.pending, a = p.anchor;
    var payload = {
      author: AGENT_AUTHOR, kind: p.kind, scope_type: CFG.scope_type, scope_id: CFG.scope_id, page: CFG.page,
      accreditations: CFG.accreditations || [], section_id: p.section.id, section_label: p.section.label,
      body: $(".body").value, build_ref: CFG.build,
      quote: a ? a.quote : "", prefix: a ? a.prefix : "", suffix: a ? a.suffix : "", text_offset: a ? a.text_offset : null,
    };
    if (p.kind === "suggestion") payload.replacement = $(".replacement").value;
    api("POST", "/comments", payload).then(function (j) {
      upsert(j.comment);
      state.activeId = j.comment.id;
      closeComposer();
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
    if (a === "edit") {
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
    if (form.classList.contains("edit")) {
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
  function inOverlay(ev) { return ev.composedPath().indexOf(host) >= 0; }
  function editableTarget(node) {
    var el = node && (node.nodeType === 1 ? node : node.parentElement);
    return !!(el && el.closest("input,textarea,select,[contenteditable=''],[contenteditable='true']"));
  }
  function caretAt(x, y) {
    if (document.caretPositionFromPoint) {
      var pos = document.caretPositionFromPoint(x, y);
      if (pos && pos.offsetNode) return { node: pos.offsetNode, offset: pos.offset };
    }
    if (document.caretRangeFromPoint) {
      var cr = document.caretRangeFromPoint(x, y);
      if (cr) return { node: cr.startContainer, offset: cr.startOffset };
    }
    return null;
  }
  function rangeContainsPoint(r, x, y) {
    var p = caretAt(x, y);
    if (!p) return false;
    var off = p.offset;
    if (p.node.nodeType === 3) off = Math.min(off, p.node.length);
    try { return r.isPointInRange(p.node, off) || (p.node.nodeType === 3 && off > 0 && r.isPointInRange(p.node, off - 1)); }
    catch (e) { return false; }
  }
  function wordRangeAt(x, y) {
    var p = caretAt(x, y);
    if (!p) return null;
    var node = p.node, off = p.offset;
    if (node.nodeType !== 3) {
      var at = node.childNodes && node.childNodes[off];
      var before = off > 0 && node.childNodes && node.childNodes[off - 1];
      var child = at && at.nodeType === 3 ? at : before;
      if (!child || child.nodeType !== 3) return null;
      off = child === at ? 0 : child.data.length;
      node = child;
    }
    if (skip(node) || !norm(node.data)) return null;
    var data = node.data;
    var i = Math.max(0, Math.min(off, data.length - 1));
    if (/\s/.test(data[i])) {
      var left = i;
      while (left > 0 && /\s/.test(data[left - 1])) left--;
      if (left > 0 && !/\s/.test(data[left - 1])) i = left - 1;
      else {
        var right = i;
        while (right < data.length && /\s/.test(data[right])) right++;
        if (right >= data.length) return null;
        i = right;
      }
    }
    var s = i, e = i + 1;
    while (s > 0 && !/\s/.test(data[s - 1])) s--;
    while (e < data.length && !/\s/.test(data[e])) e++;
    var r = document.createRange();
    r.setStart(node, s);
    r.setEnd(node, e);
    return norm(r.toString()) ? r : null;
  }
  function commentRangeAt(x, y, saved) {
    if (saved && rangeContainsPoint(saved, x, y)) return saved;
    var sel = selectionRange();
    if (sel && rangeContainsPoint(sel, x, y)) return sel;
    return wordRangeAt(x, y);
  }

  // Shift turns the pointer into a comment bubble. A click then starts a comment. Without Shift
  // the page keeps its own cursor, selection, and clicks.
  var pointer = null;
  var shiftAnchor = null;
  var cursorBubble = $(".cursor-bubble");
  function syncCommentCursor(shift) {
    var on = !!(shift && pointer && !pointer.overlay && !pointer.editable);
    if (!on) {
      document.documentElement.removeAttribute("data-fb-shift");
      cursorBubble.hidden = true;
      return;
    }
    document.documentElement.setAttribute("data-fb-shift", "");
    cursorBubble.hidden = false;
    cursorBubble.style.left = pointer.x + "px";
    cursorBubble.style.top = pointer.y + "px";
  }
  function rememberPointer(ev) {
    pointer = { x: ev.clientX, y: ev.clientY, overlay: inOverlay(ev), editable: editableTarget(ev.target) };
  }
  document.addEventListener("mousemove", function (ev) {
    rememberPointer(ev);
    syncCommentCursor(ev.shiftKey);
  });
  document.addEventListener("mouseout", function (ev) {
    if (!ev.relatedTarget) syncCommentCursor(false);
  });
  window.addEventListener("blur", function () { syncCommentCursor(false); });
  document.addEventListener("mousedown", function (ev) {
    shiftAnchor = null;
    if (!ev.shiftKey || ev.button !== 0) return;
    rememberPointer(ev);
    syncCommentCursor(true);
    if (pointer.overlay || pointer.editable) return;
    ev.preventDefault();
    ev.stopPropagation();
    shiftAnchor = { x: ev.clientX, y: ev.clientY, range: selectionRange() };
  }, true);
  document.addEventListener("mouseup", function (ev) {
    if (shiftAnchor && ev.shiftKey && ev.button === 0) {
      var start = shiftAnchor;
      shiftAnchor = null;
      if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) <= 8 && !inOverlay(ev) && !editableTarget(ev.target)) {
        ev.preventDefault();
        ev.stopPropagation();
        openComposer("comment", commentRangeAt(ev.clientX, ev.clientY, start.range));
      }
      return;
    }
    shiftAnchor = null;
    if (!inOverlay(ev) && !ev.shiftKey) setTimeout(showToolbar, 0);
  }, true);
  document.addEventListener("selectionchange", function () {
    if (!toolbar.hidden && !selectionRange()) toolbar.hidden = true;
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Shift") {
      syncCommentCursor(true);
      return;
    }
    if ((ev.ctrlKey || ev.metaKey) && ev.altKey && (ev.key === "m" || ev.key === "M" || ev.code === "KeyM")) {
      var r = selectionRange();
      ev.preventDefault();
      openComposer("comment", r);
    } else if (ev.key === "Escape" && !composer.hidden && inOverlay(ev)) {
      closeComposer();
    }
  });
  document.addEventListener("keyup", function (ev) {
    if (ev.key === "Shift") syncCommentCursor(false);
  });
  // Clicking highlighted text opens its comment. Shift+click is handled on mouseup, and the
  // click still reaches the page when Shift is not held.
  document.addEventListener("click", function (ev) {
    if (ev.shiftKey) {
      if (!inOverlay(ev) && !editableTarget(ev.target)) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      return;
    }
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
  window.addEventListener("resize", function () { placeFab(); if (!composer.hidden) placeComposer(); queuePaint(); });
  window.addEventListener("scroll", function () { toolbar.hidden = true; placeFab(); if (!composer.hidden) placeComposer(); queuePaint(); }, true);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) load(); });
  var moTimer = null;
  new MutationObserver(function () {
    clearTimeout(moTimer);
    moTimer = setTimeout(function () { reanchor(false); placeFab(); }, 250);
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
