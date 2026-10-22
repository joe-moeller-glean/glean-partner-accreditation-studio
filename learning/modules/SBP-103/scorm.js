/* SCORM 1.2 adapter for the Sales Blueprinting modules (build spec B06, B07, B10).
   - Bounded window/parent/opener search for window.API; cross-origin access errors are caught.
   - LMSInitialize("") once; LMSFinish("") once.
   - Without an LMS the module runs as an untracked preview. State is kept in
     localStorage under per-module keys so two modules served from one origin
     never share position, status, or score. Nothing is reported as tracked. */
(function (w) {
  var api = null, live = false, finished = false, lastError = "";

  function probe(win) {
    try { return win && win.API ? win.API : null; } catch (e) { return null; }
  }

  function climb(win) {
    var n = 0;
    while (win && n++ < 10) {
      var a = probe(win);
      if (a) return a;
      var parent = null;
      try { parent = win.parent; } catch (e) { parent = null; }
      if (!parent || parent === win) break;
      win = parent;
    }
    return null;
  }

  function call(name, a, b) {
    try {
      if (!api) return null;
      return arguments.length > 2 ? api[name](a, b) : api[name](a);
    } catch (e) { return null; }
  }

  function diagnose(op) {
    var code = call("LMSGetLastError", "");
    if (code && String(code) !== "0") {
      lastError = op + " error " + code + ": " + (call("LMSGetErrorString", String(code)) || "");
    }
  }

  function init() {
    var opener = null;
    try { opener = w.opener; } catch (e) { opener = null; }
    api = climb(w) || climb(opener);
    if (api) {
      var r = call("LMSInitialize", "");
      live = r === true || r === "true";
      if (!live) diagnose("LMSInitialize");
    }
    return live;
  }

  function key(k) {
    var id = (w.MODULE && w.MODULE.id) || "module";
    return "scorm:" + id + ":" + k;
  }

  function get(k) {
    if (live) return call("LMSGetValue", k) || "";
    try { return w.localStorage.getItem(key(k)) || ""; } catch (e) { return ""; }
  }

  function set(k, v) {
    if (live) {
      var r = call("LMSSetValue", k, String(v));
      if (r !== true && r !== "true") diagnose("LMSSetValue " + k);
      return r;
    }
    try { w.localStorage.setItem(key(k), String(v)); } catch (e) { return "false"; }
    return "true";
  }

  function commit() {
    if (!live) return "true";
    var r = call("LMSCommit", "");
    if (r !== true && r !== "true") diagnose("LMSCommit");
    return r;
  }

  function finish() {
    if (finished) return;
    finished = true;
    if (live) { commit(); call("LMSFinish", ""); live = false; }
  }

  w.SCORM = {
    init: init, get: get, set: set, commit: commit, finish: finish,
    isLive: function () { return live; },
    isFinished: function () { return finished; },
    lastError: function () { return lastError; }
  };
})(window);
