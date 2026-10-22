"""Tests for the development review feedback framework (tools/feedback)."""
import http.client
import json
import sys
import tempfile
import threading
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools" / "feedback"))

import markers  # noqa: E402
import server  # noqa: E402
import sources  # noqa: E402
from store import FeedbackError, Store  # noqa: E402

BASE = {"author": "Reviewer", "scope_type": "module", "scope_id": "SBP-101", "page": "index.html",
        "accreditations": ["accred-ai-blueprinting"], "section_id": "s-SBP-101-L01",
        "section_label": "Purpose and customer promise"}


class StoreTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self.tmp.name)
        self.store = Store(self.dir / "fb.db")

    def tearDown(self):
        self.store.close()
        self.tmp.cleanup()

    def test_create_each_kind(self):
        c = self.store.create({**BASE, "kind": "comment", "body": "Clarify this"})
        s = self.store.create({**BASE, "kind": "suggestion", "quote": "old words", "replacement": "new words"})
        h = self.store.create({**BASE, "kind": "highlight", "quote": "keep this"})
        self.assertEqual([x["status"] for x in (c, s, h)], ["open"] * 3)
        self.assertEqual(s["replacement"], "new words")
        self.assertIsNone(h["replacement"])
        self.assertEqual(c["accreditations"], ["accred-ai-blueprinting"])

    def test_validation(self):
        bad = [{**BASE, "kind": "comment", "body": " "},
               {**BASE, "kind": "suggestion", "quote": "x"},
               {**BASE, "kind": "highlight", "quote": ""},
               {**BASE, "kind": "comment", "body": "x", "author": ""},
               {**BASE, "kind": "nope", "body": "x"},
               {**BASE, "kind": "comment", "body": "x", "scope_type": "other"},
               {**BASE, "kind": "comment", "body": "x" * 10001}]
        for data in bad:
            with self.assertRaises(FeedbackError, msg=data):
                self.store.create(data)

    def test_overlay_cannot_mark_applied(self):
        c = self.store.create({**BASE, "kind": "comment", "body": "x"})
        with self.assertRaises(FeedbackError):
            self.store.update(c["id"], {"status": "applied"})
        self.assertEqual(self.store.update(c["id"], {"status": "resolved", "by": "R"})["status"], "resolved")

    def test_replies_cascade_on_delete(self):
        c = self.store.create({**BASE, "kind": "comment", "body": "x"})
        self.store.reply(c["id"], "Other", "Agreed")
        self.assertEqual(len(self.store.get(c["id"])["replies"]), 1)
        self.store.delete(c["id"])
        self.assertEqual(self.store.db.execute("SELECT COUNT(*) FROM replies").fetchone()[0], 0)

    def test_apply_moves_comment_to_history_and_out_of_db(self):
        hist = self.dir / "history"
        s = self.store.create({**BASE, "kind": "suggestion", "quote": "old words", "replacement": "new words",
                               "body": "Tighter"})
        self.store.reply(s["id"], "Lead", "Yes")
        keep = self.store.create({**BASE, "kind": "comment", "body": "still open"})
        self.store.close_out([s["id"]], "applied", "Edited lesson L01", "Editor", "abc1234")
        done = self.store.archive(hist, ids=[s["id"]], statuses=("applied",), commit="abc1234")
        path = hist / "SBP-101.md"
        self.assertEqual(done, {str(path): [s["id"]]})
        text = path.read_text()
        for needle in (f"### {s['id']} · suggestion · applied", "> old words", "> new words", "Reply from Lead",
                       "Edited lesson L01", "abc1234", "accred-ai-blueprinting"):
            self.assertIn(needle, text)
        with self.assertRaises(KeyError):
            self.store.get(s["id"])
        self.assertEqual(self.store.get(keep["id"])["status"], "open")

    def test_archive_is_idempotent_and_appends(self):
        hist = self.dir / "history"
        a = self.store.create({**BASE, "kind": "comment", "body": "first"})
        self.store.update(a["id"], {"status": "resolved", "by": "R"})
        self.store.archive(hist)
        b = self.store.create({**BASE, "kind": "comment", "body": "second"})
        self.store.close_out([b["id"]], "rejected", "Out of scope", "R")
        self.store.archive(hist)
        text = (hist / "SBP-101.md").read_text()
        self.assertEqual(text.count("# Feedback history: SBP-101"), 1)
        self.assertEqual(text.count(f"### {a['id']} "), 1)
        self.assertIn(f"### {b['id']} · comment · rejected", text)
        self.assertEqual(self.store.list(), [])

    def test_archive_refuses_open_ids(self):
        c = self.store.create({**BASE, "kind": "comment", "body": "x"})
        with self.assertRaises(FeedbackError):
            self.store.archive(self.dir / "h", ids=[c["id"]])
        self.assertEqual(len(self.store.list()), 1)

    def test_resolution_note_required(self):
        c = self.store.create({**BASE, "kind": "comment", "body": "x"})
        with self.assertRaises(FeedbackError):
            self.store.close_out([c["id"]], "applied", " ", "R")


class SourceLocatorTests(unittest.TestCase):
    def test_finds_text_across_markdown_emphasis_and_whitespace(self):
        with tempfile.TemporaryDirectory() as t:
            root = Path(t)
            (root / "plan" / "lessons").mkdir(parents=True)
            (root / "plan" / "lessons" / "X-101.md").write_text("intro\n\nThe **Blueprint** helps teams\nslow down to speed up.\n")
            gen = root / "learning" / "modules" / "X-101"
            gen.mkdir(parents=True)
            (gen / "content.js").write_text('var M = {"t": "The Blueprint helps teams slow down to speed up."}')
            hits = sources.locate("The Blueprint helps teams slow down to speed up.", "module", "X-101", root)
            self.assertEqual([h["path"] for h in hits], ["plan/lessons/X-101.md", "learning/modules/X-101/content.js"])
            self.assertEqual(hits[0]["line"], 3)
            self.assertTrue(hits[1]["generated"])

    def test_short_quotes_are_not_located(self):
        self.assertEqual(sources.locate("the", "module", "X", ROOT), [])


class ServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.httpd, cls.store = server.make_server("127.0.0.1", 0, ROOT, Path(cls.tmp.name) / "fb.db")
        cls.port = cls.httpd.server_address[1]
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.module = next(d.name for d in sorted((ROOT / "learning" / "modules").iterdir())
                          if (d / "index.html").exists())

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.store.close()
        cls.tmp.cleanup()

    def req(self, method, path, body=None, headers=None):
        conn = http.client.HTTPConnection("127.0.0.1", self.port, timeout=10)
        h = {"Host": f"127.0.0.1:{self.port}"}
        if body is not None:
            h.update({"Content-Type": "application/json", "X-Feedback-Dev": "1"})
        h.update(headers or {})
        conn.request(method, path, json.dumps(body) if body is not None else None, h)
        r = conn.getresponse()
        data = r.read()
        conn.close()
        return r.status, data

    def test_module_html_gets_overlay_but_file_on_disk_does_not(self):
        status, data = self.req("GET", f"/m/{self.module}/")
        self.assertEqual(status, 200)
        page = data.decode()
        self.assertIn('<script src="/__feedback/overlay.js" data-feedback-dev', page)
        disk = (ROOT / "learning" / "modules" / self.module / "index.html").read_text()
        self.assertEqual(markers.scan_text(disk), [])

    def test_non_html_assets_are_served_unchanged(self):
        mod = ROOT / "learning" / "modules" / self.module
        asset = next(p for p in sorted(mod.rglob("*.js")) if p.is_file())
        status, data = self.req("GET", f"/m/{self.module}/{asset.relative_to(mod).as_posix()}")
        self.assertEqual(status, 200)
        self.assertEqual(data, asset.read_bytes())

    def test_accreditation_page_is_annotatable(self):
        acc = next(d.name for d in sorted((ROOT / "learning" / "accreditations").iterdir()) if d.is_dir())
        status, data = self.req("GET", f"/a/{acc}/")
        self.assertEqual(status, 200)
        self.assertIn('"scope_type":"accreditation"', data.decode().replace("&quot;", '"'))

    def test_path_traversal_is_refused(self):
        for p in (f"/m/{self.module}/../../../README.md", f"/m/{self.module}/..%2F..%2F..%2FREADME.md", "/m/../README.md"):
            self.assertIn(self.req("GET", p)[0], (301, 404), p)

    def test_unexpected_host_is_refused(self):
        self.assertEqual(self.req("GET", "/", headers={"Host": "attacker.invalid"})[0], 403)

    def test_writes_require_overlay_headers_and_same_origin(self):
        conn = http.client.HTTPConnection("127.0.0.1", self.port, timeout=10)
        conn.request("POST", "/__feedback/api/comments", "{}", {"Content-Type": "application/json"})
        self.assertEqual(conn.getresponse().status, 403)
        conn.close()
        status, _ = self.req("POST", "/__feedback/api/comments", {}, {"Origin": "http://attacker.invalid"})
        self.assertEqual(status, 403)

    def test_api_round_trip(self):
        status, data = self.req("POST", "/__feedback/api/comments",
                                {**BASE, "scope_id": self.module, "kind": "highlight", "quote": "something to keep"})
        self.assertEqual(status, 201)
        cid = json.loads(data)["comment"]["id"]
        status, data = self.req("POST", f"/__feedback/api/comments/{cid}/replies", {"author": "B", "body": "ok"})
        self.assertEqual(json.loads(data)["comment"]["replies"][0]["body"], "ok")
        status, data = self.req("GET", f"/__feedback/api/comments?scope_type=module&scope_id={self.module}&page=index.html")
        self.assertIn(cid, [c["id"] for c in json.loads(data)["comments"]])
        status, data = self.req("PATCH", f"/__feedback/api/comments/{cid}", {"status": "applied"})
        self.assertEqual(status, 400)
        self.assertEqual(self.req("DELETE", f"/__feedback/api/comments/{cid}", {})[0], 200)
        self.assertEqual(self.req("GET", f"/__feedback/api/comments/{cid}")[0], 404)

    def test_bad_input_returns_400(self):
        status, data = self.req("POST", "/__feedback/api/comments", {**BASE, "kind": "comment", "body": ""})
        self.assertEqual(status, 400)
        self.assertIn("error", json.loads(data))


if __name__ == "__main__":
    unittest.main()
