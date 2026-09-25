/* SCORM 1.2 runtime adapter. Finds the LMS API, degrades to localStorage when launched standalone. */
(function (w) {
  var api = null, live = false;

  function find(x) {
    var n = 0;
    while (x && n++ < 20) {
      if (x.API) return x.API;
      if (x.parent === x) break;
      x = x.parent;
    }
    return null;
  }

  function call(name, a, b) {
    try {
      if (!api) return null;
      return arguments.length > 2 ? api[name](a, b) : api[name](a);
    } catch (e) { return null; }
  }

  function init() {
    api = find(w) || find(w.opener);
    if (api) {
      var r = call("LMSInitialize", "");
      live = r === true || r === "true";
    }
    return live;
  }

  // Namespace the standalone fallback per module. Every module in a package set is
  // served from one origin, so unscoped cmi.* keys let one module inherit another's
  // saved position and score. Real LMS keys are never rewritten.
  function key(k) {
    var id = (window.MODULE && window.MODULE.id) || "module";
    return "scorm:" + id + ":" + k;
  }

  function get(k) {
    if (live) return call("LMSGetValue", k) || "";
    try { return localStorage.getItem(key(k)) || ""; } catch (e) { return ""; }
  }

  function set(k, v) {
    if (live) return call("LMSSetValue", k, String(v));
    try { localStorage.setItem(key(k), String(v)); } catch (e) { return "false"; }
    return "true";
  }

  function commit() { return live ? call("LMSCommit", "") : "true"; }

  function finish() {
    if (live) { commit(); call("LMSFinish", ""); live = false; }
  }

  w.SCORM = { init: init, get: get, set: set, commit: commit, finish: finish,
    isLive: function () { return live; } };
})(window);
