"""Development review server: serves every module and accreditation with the feedback overlay.

    python3 tools/feedback/cli.py serve            # http://127.0.0.1:8790/

Routes
    /                         index of accreditations and modules with open-comment counts
    /a/<accreditation-id>/    accreditation page rendered from accreditation.yaml (annotatable)
    /m/<module-id>/<path>     module files from learning/modules/<id>/ (HTML gets the overlay)
    /__feedback/overlay.js    overlay script and styles (tools/feedback/overlay/)
    /__feedback/api/...       JSON API backed by the SQLite store

The overlay is injected into HTML responses in memory. Module folders on disk and the SCORM
packages built from them never contain it; tools/feedback/markers.py enforces that.
"""
from __future__ import annotations

import html
import json
import mimetypes
import re
import subprocess
import sys
import threading
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(ROOT / "skills" / "scripts"))

import markers as MK  # noqa: E402
import sources  # noqa: E402
from store import FeedbackError, Store  # noqa: E402

OVERLAY_DIR = HERE / "overlay"
SAFE_ID = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,119}$")
LOCAL_HOSTS = {"127.0.0.1", "localhost", "[::1]"}
MAX_BODY = 256 * 1024


class Catalog:
    """Accreditations and modules on disk, reloaded at most every few seconds."""

    def __init__(self, root: Path):
        self.root = root
        self._at, self._data = 0.0, None
        self._lock = threading.Lock()

    def data(self):
        with self._lock:
            if self._data is None or time.time() - self._at > 3:
                self._data, self._at = self._load(), time.time()
            return self._data

    def _load(self):
        import learning_layout as L

        accs = []
        for a in L.load_accreditations(self.root):
            accs.append({**a, "modules": L.module_ids(a)})
        modules = {}
        for d in L.module_dirs(self.root):
            meta = {}
            for name in ("module.json",):
                try:
                    meta = json.loads((d / name).read_text())
                except (OSError, ValueError):
                    pass
            modules[d.name] = {"id": d.name, "title": meta.get("title") or d.name,
                               "accreditations": [a["id"] for a in accs if d.name in a["modules"]
                                                  or a.get("overview_module") == d.name]}
        return {"accreditations": accs, "modules": modules}

    def module(self, mid):
        return self.data()["modules"].get(mid)

    def accreditation(self, aid):
        return next((a for a in self.data()["accreditations"] if a["id"] == aid), None)


_build_cache: dict[str, tuple[float, str]] = {}


def build_ref(root: Path, rel: str) -> str:
    """Short git commit plus '+dirty' when the reviewed source has uncommitted changes."""
    hit = _build_cache.get(rel)
    if hit and time.time() - hit[0] < 10:
        return hit[1]
    try:
        sha = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=root, capture_output=True,
                             text=True, timeout=5).stdout.strip() or "no-git"
        dirty = subprocess.run(["git", "status", "--porcelain", "--", rel], cwd=root, capture_output=True,
                               text=True, timeout=5).stdout.strip()
        ref = sha + ("+dirty" if dirty else "")
    except (OSError, subprocess.SubprocessError):
        ref = "no-git"
    _build_cache[rel] = (time.time(), ref)
    return ref


def inject(markup: str, config: dict) -> str:
    """Add the overlay script tag to an HTML document. Pure string transform; nothing touches disk."""
    attr = html.escape(json.dumps(config, separators=(",", ":")), quote=True)
    tag = (f'<script src="{MK.ROUTE_PREFIX}overlay.js" {MK.ATTRIBUTE} '
           f'data-config="{attr}"></script>')
    idx = markup.lower().rfind("</body>")
    return markup[:idx] + tag + markup[idx:] if idx >= 0 else markup + tag


def _esc(x):
    return html.escape(str(x if x is not None else ""))


def _page(title, body, extra_head=""):
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>{_esc(title)}</title>
<style>
body{{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#1d1d26;max-width:880px;margin:0 auto;padding:32px 24px 96px;line-height:1.55}}
h1{{font-size:1.75rem;margin:.2em 0 .4em}} h2{{font-size:1.2rem;margin-top:2em}} a{{color:#3333ff}}
.dev{{background:#fff4d6;border:1px solid #f0c75e;border-radius:6px;padding:10px 14px;font-size:.92rem}}
table{{border-collapse:collapse;width:100%}} td,th{{text-align:left;padding:6px 8px;border-bottom:1px solid #e6e6ee;vertical-align:top}}
.n{{display:inline-block;min-width:1.6em;padding:0 .4em;border-radius:9px;background:#3333ff;color:#fff;font-size:.8rem;text-align:center}}
.muted{{color:#5f5f6e}} code{{background:#f2f2f7;padding:1px 4px;border-radius:4px}}
section{{margin:0 0 8px}}
</style>{extra_head}</head><body>{body}</body></html>"""


def render_index(cat: Catalog, store: Store):
    counts = store.counts()
    d = cat.data()
    out = ['<h1>Accreditation review</h1>',
           '<p class="dev"><strong>Development only.</strong> Pages served here carry the review overlay: '
           'select text to comment, suggest an edit, or highlight. Feedback is stored in '
           '<code>.feedback/feedback.db</code>. SCORM packages never include the overlay.</p>']
    used = set()
    for a in d["accreditations"]:
        n = counts.get(("accreditation", a["id"]), 0)
        out.append(f'<h2><a href="/a/{_esc(a["id"])}/">{_esc(a.get("name") or a["id"])}</a> '
                   f'{f"<span class=n>{n}</span>" if n else ""}</h2>')
        out.append(f'<p class="muted">{_esc(a["id"])} · {_esc(a.get("status", ""))}'
                   f'{" · " + _esc(a["release_state"]) if a.get("release_state") else ""}</p><table>')
        mods = ([a["overview_module"]] if a.get("overview_module") else []) + a["modules"]
        for mid in mods:
            used.add(mid)
            m = d["modules"].get(mid)
            c = counts.get(("module", mid), 0)
            link = f'<a href="/m/{_esc(mid)}/">{_esc(mid)}</a>' if m else f'{_esc(mid)} <span class="muted">(not built)</span>'
            out.append(f'<tr><td>{link}</td><td>{_esc(m["title"] if m else "")}</td>'
                       f'<td>{f"<span class=n>{c}</span>" if c else ""}</td></tr>')
        out.append("</table>")
    rest = [m for k, m in sorted(d["modules"].items()) if k not in used]
    if rest:
        out.append("<h2>Modules not in an accreditation</h2><table>")
        for m in rest:
            c = counts.get(("module", m["id"]), 0)
            out.append(f'<tr><td><a href="/m/{_esc(m["id"])}/">{_esc(m["id"])}</a></td><td>{_esc(m["title"])}</td>'
                       f'<td>{f"<span class=n>{c}</span>" if c else ""}</td></tr>')
        out.append("</table>")
    return _page("Accreditation review", "\n".join(out))


def render_accreditation(a: dict, cat: Catalog):
    d = cat.data()
    comp = a.get("completion") or {}
    rows = []
    for mid in a["modules"]:
        m = d["modules"].get(mid)
        rows.append(f'<tr><td><a href="/m/{_esc(mid)}/">{_esc(mid)}</a></td><td>{_esc(m["title"] if m else "not built")}</td></tr>')
    electives = a.get("electives") or []
    el = "".join(f"<li>{_esc(e.get('description') or e.get('pattern') or e)} "
                 f"{'(min ' + _esc(e.get('min')) + ')' if isinstance(e, dict) and e.get('min') else ''}</li>"
                 for e in electives)
    gates = "".join(f"<li>{_esc(g)}</li>" for g in comp.get("hard_gates") or [])
    practical = comp.get("practical") or {}
    body = f"""<p><a href="/">All accreditations</a></p>
<p class="dev"><strong>Development review page</strong> rendered from
<code>learning/accreditations/{_esc(a['id'])}/accreditation.yaml</code>. Comment on the definition here; module
content is reviewed on each module page.</p>
<section id="acc-summary"><h1>{_esc(a.get('name') or a['id'])}</h1>
<p>{_esc(a['id'])} · status {_esc(a.get('status'))}{' · release ' + _esc(a['release_state']) if a.get('release_state') else ''}
· publish mode {_esc(a.get('publish_mode'))}</p>
<p><strong>Audience:</strong> {_esc(', '.join(a.get('audience') or []) if isinstance(a.get('audience'), list) else a.get('audience'))}</p></section>
<section id="acc-modules"><h2>Required modules</h2><table>{''.join(rows)}</table></section>
{'<section id="acc-electives"><h2>Electives</h2><ul>' + el + '</ul></section>' if el else ''}
<section id="acc-completion"><h2>Completion</h2>
<p><strong>Assessment module:</strong> {_esc(comp.get('assessment_module'))}</p>
<p><strong>Assessment:</strong> {_esc(comp.get('assessment_type'))}</p>
<p><strong>Mastery score:</strong> {_esc(comp.get('mastery_score'))}</p>
{f"<p><strong>Practical:</strong> {_esc(practical.get('module'))}: {_esc(practical.get('pass_rule'))}</p>" if practical else ''}
{f'<p><strong>Hard gates:</strong></p><ul>{gates}</ul>' if gates else ''}
{f"<p><strong>Note:</strong> {_esc(comp.get('note'))}</p>" if comp.get('note') else ''}</section>
{f'<section id="acc-overview"><h2>Overview module</h2><p><a href="/m/{_esc(a["overview_module"])}/">{_esc(a["overview_module"])}</a></p></section>' if a.get('overview_module') else ''}
"""
    return _page(a.get("name") or a["id"], body)


class Handler(BaseHTTPRequestHandler):
    server_version = "GleanFeedbackDev/1"
    root: Path = ROOT
    store: Store = None  # type: ignore[assignment]
    catalog: Catalog = None  # type: ignore[assignment]
    lock = threading.RLock()

    def log_message(self, fmt, *args):  # quieter, still useful
        if "--verbose" in sys.argv:
            super().log_message(fmt, *args)

    # ---- helpers ---------------------------------------------------------------------------
    def _send(self, status, body: bytes, ctype="text/html; charset=utf-8"):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _json(self, status, obj):
        self._send(status, json.dumps(obj).encode(), "application/json; charset=utf-8")

    def _error(self, status, message):
        if self.path.startswith(MK.ROUTE_PREFIX + "api/"):
            self._json(status, {"error": message})
        else:
            self._send(status, _page("Error", f"<h1>{status}</h1><p>{_esc(message)}</p>").encode())

    def _host_ok(self):
        host = (self.headers.get("Host") or "").rsplit(":", 1)[0]
        return host in LOCAL_HOSTS or host == self.server.server_address[0]

    def _write_ok(self):
        """Mutations must come from the overlay: custom header, JSON, and a same-host origin."""
        if self.headers.get("X-Feedback-Dev") != "1":
            return False
        if "application/json" not in (self.headers.get("Content-Type") or ""):
            return False
        origin = self.headers.get("Origin")
        if origin and urlsplit(origin).netloc != (self.headers.get("Host") or ""):
            return False
        return True

    def _body(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n > MAX_BODY:
            raise FeedbackError("Request too large")
        try:
            data = json.loads(self.rfile.read(n) or b"{}")
        except ValueError as exc:
            raise FeedbackError("Invalid JSON") from exc
        if not isinstance(data, dict):
            raise FeedbackError("Expected a JSON object")
        return data

    # ---- routing ---------------------------------------------------------------------------
    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        if not self._host_ok():
            return self._error(HTTPStatus.FORBIDDEN, "Unexpected Host header")
        url = urlsplit(self.path)
        path = unquote(url.path)
        if path == "/":
            with self.lock:
                return self._send(200, render_index(self.catalog, self.store).encode())
        if path.startswith(MK.ROUTE_PREFIX + "api/"):
            return self._api("GET", path, parse_qs(url.query))
        if path.startswith(MK.ROUTE_PREFIX):
            return self._overlay_asset(path[len(MK.ROUTE_PREFIX):])
        m = re.match(r"^/a/([^/]+)/?$", path)
        if m:
            a = self.catalog.accreditation(m.group(1))
            if not a:
                return self._error(404, "Unknown accreditation")
            if not path.endswith("/"):
                return self._redirect(path + "/")
            page = render_accreditation(a, self.catalog)
            cfg = {"scope_type": "accreditation", "scope_id": a["id"], "page": "accreditation",
                   "accreditations": [a["id"]], "api": MK.ROUTE_PREFIX + "api",
                   "build": build_ref(self.root, f"learning/accreditations/{a['id']}")}
            return self._send(200, inject(page, cfg).encode())
        m = re.match(r"^/m/([^/]+)(/.*)?$", path)
        if m:
            return self._module(m.group(1), m.group(2))
        return self._error(404, "Not found")

    def do_POST(self):
        self._mutation("POST")

    def do_PATCH(self):
        self._mutation("PATCH")

    def do_DELETE(self):
        self._mutation("DELETE")

    def _mutation(self, method):
        if not self._host_ok():
            return self._error(HTTPStatus.FORBIDDEN, "Unexpected Host header")
        path = unquote(urlsplit(self.path).path)
        if not path.startswith(MK.ROUTE_PREFIX + "api/"):
            return self._error(405, "Method not allowed")
        if not self._write_ok():
            return self._error(HTTPStatus.FORBIDDEN, "Writes must come from the review overlay")
        self._api(method, path, {})

    def _redirect(self, to):
        self.send_response(HTTPStatus.MOVED_PERMANENTLY)
        self.send_header("Location", to)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _overlay_asset(self, name):
        if name not in {"overlay.js", "overlay.css"}:
            return self._error(404, "Not found")
        ctype = "text/javascript; charset=utf-8" if name.endswith(".js") else "text/css; charset=utf-8"
        return self._send(200, (OVERLAY_DIR / name).read_bytes(), ctype)

    def _module(self, mid, rest):
        if not SAFE_ID.match(mid):
            return self._error(404, "Unknown module")
        mod = self.catalog.module(mid)
        base = (self.root / "learning" / "modules" / mid).resolve()
        if not mod or not base.is_dir():
            return self._error(404, "Unknown module")
        if not rest:
            return self._redirect(f"/m/{mid}/")
        rel = rest.lstrip("/") or "index.html"
        target = (base / rel).resolve()
        if base not in target.parents and target != base:
            return self._error(404, "Not found")
        if target.is_dir():
            target = target / "index.html"
        if not target.is_file():
            return self._error(404, "Not found")
        ctype = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        data = target.read_bytes()
        if target.suffix.lower() in {".html", ".htm"}:
            cfg = {"scope_type": "module", "scope_id": mid, "page": target.relative_to(base).as_posix(),
                   "accreditations": mod["accreditations"], "api": MK.ROUTE_PREFIX + "api",
                   "build": build_ref(self.root, f"learning/modules/{mid}")}
            data = inject(data.decode("utf-8", errors="replace"), cfg).encode()
            ctype = "text/html; charset=utf-8"
        elif ctype.startswith("text/") or ctype in {"application/javascript", "image/svg+xml"}:
            ctype += "; charset=utf-8"
        return self._send(200, data, ctype)

    # ---- API -------------------------------------------------------------------------------
    def _api(self, method, path, query):
        parts = [p for p in path[len(MK.ROUTE_PREFIX + "api/"):].split("/") if p]
        try:
            with self.lock:
                if parts == ["health"] and method == "GET":
                    return self._json(200, {"ok": True, "db": str(self.store.path)})
                if parts == ["comments"]:
                    if method == "GET":
                        q = {k: v[0] for k, v in query.items()}
                        statuses = q["status"].split(",") if q.get("status") not in (None, "", "all") else None
                        rows = self.store.list(q.get("scope_type"), q.get("scope_id"), q.get("page"), statuses,
                                               q.get("accreditation"))
                        return self._json(200, {"comments": rows})
                    if method == "POST":
                        data = self._body()
                        return self._json(201, {"comment": self.store.create(data)})
                if len(parts) == 2 and parts[0] == "comments":
                    cid = parts[1]
                    if method == "GET":
                        c = self.store.get(cid)
                        c["sources"] = sources.locate(c["quote"], c["scope_type"], c["scope_id"], self.root)
                        return self._json(200, {"comment": c})
                    if method == "PATCH":
                        return self._json(200, {"comment": self.store.update(cid, self._body())})
                    if method == "DELETE":
                        self.store.delete(cid)
                        return self._json(200, {"deleted": cid})
                if len(parts) == 3 and parts[0] == "comments" and parts[2] == "replies" and method == "POST":
                    data = self._body()
                    return self._json(201, {"comment": self.store.reply(parts[1], data.get("author"), data.get("body"))})
        except FeedbackError as exc:
            return self._json(400, {"error": str(exc)})
        except KeyError:
            return self._json(404, {"error": "Comment not found"})
        return self._json(404, {"error": "Unknown API route"})


def make_server(host="127.0.0.1", port=8790, root: Path = ROOT, db=None):
    store = Store(db)
    handler = type("BoundHandler", (Handler,), {"root": root, "store": store, "catalog": Catalog(root),
                                                "lock": threading.RLock()})
    httpd = ThreadingHTTPServer((host, port), handler)
    httpd.daemon_threads = True
    return httpd, store


def serve(host="127.0.0.1", port=8790, db=None):
    httpd, store = make_server(host, port, ROOT, db)
    print(f"Review server: http://{host}:{httpd.server_address[1]}/  (database {store.path})")
    print("Development only. Press Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
        store.close()
