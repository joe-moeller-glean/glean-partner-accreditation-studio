"""SQLite store for development review feedback, plus the Markdown history archive.

Lifecycle of a comment:
    open      created in the overlay (comment, suggested edit, or highlight)
    resolved  closed by a reviewer in the overlay without a source change
    applied   the change was made to the source (set by `cli.py apply`)
    rejected  deliberately not applied (set by `cli.py reject`)

`archive()` moves applied, rejected, and resolved comments out of the database into
plan/feedback-history/<scope>.md and deletes them from SQLite. The history file is written
before rows are deleted, and entries already present in a history file are skipped, so an
interrupted archive can be rerun safely.
"""
from __future__ import annotations

import json
import os
import secrets
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DB = ROOT / ".feedback" / "feedback.db"
DEFAULT_HISTORY = ROOT / "plan" / "feedback-history"

KINDS = ("comment", "suggestion", "highlight")
STATUSES = ("open", "resolved", "applied", "rejected")
SCOPE_TYPES = ("module", "accreditation")
ARCHIVE_STATUSES = ("applied", "rejected", "resolved")
LIMITS = {"body": 10000, "quote": 5000, "replacement": 5000, "author": 120, "prefix": 200, "suffix": 200,
          "section_label": 300, "section_id": 200, "page": 300, "scope_id": 120}

SCHEMA = """
CREATE TABLE IF NOT EXISTS comments (
  id              TEXT PRIMARY KEY,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  author          TEXT NOT NULL,
  scope_type      TEXT NOT NULL CHECK (scope_type IN ('module', 'accreditation')),
  scope_id        TEXT NOT NULL,
  accreditations  TEXT NOT NULL DEFAULT '[]',
  page            TEXT NOT NULL,
  section_id      TEXT,
  section_label   TEXT,
  kind            TEXT NOT NULL CHECK (kind IN ('comment', 'suggestion', 'highlight')),
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'applied', 'rejected')),
  body            TEXT NOT NULL DEFAULT '',
  quote           TEXT NOT NULL DEFAULT '',
  prefix          TEXT NOT NULL DEFAULT '',
  suffix          TEXT NOT NULL DEFAULT '',
  text_offset     INTEGER,
  replacement     TEXT,
  build_ref       TEXT,
  resolution_note TEXT,
  resolved_by     TEXT,
  resolved_at     TEXT,
  applied_commit  TEXT
);
CREATE INDEX IF NOT EXISTS comments_scope ON comments (scope_type, scope_id, page);
CREATE INDEX IF NOT EXISTS comments_status ON comments (status);
CREATE TABLE IF NOT EXISTS replies (
  id          TEXT PRIMARY KEY,
  comment_id  TEXT NOT NULL REFERENCES comments (id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL,
  author      TEXT NOT NULL,
  body        TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS replies_comment ON replies (comment_id);
"""


class FeedbackError(ValueError):
    """Invalid input; the message is safe to show to the reviewer."""


def now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def new_id(prefix="FB") -> str:
    return f"{prefix}-{datetime.now(timezone.utc):%y%m%d}-{secrets.token_hex(3)}"


def _clip(field, value):
    if value is None:
        return None
    if not isinstance(value, str):
        raise FeedbackError(f"{field} must be text")
    if len(value) > LIMITS.get(field, 10000):
        raise FeedbackError(f"{field} is too long (max {LIMITS[field]} characters)")
    return value


class Store:
    def __init__(self, path: Path | str | None = None):
        self.path = Path(path or os.environ.get("FEEDBACK_DB") or DEFAULT_DB)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.db = sqlite3.connect(self.path, check_same_thread=False, isolation_level=None)
        self.db.row_factory = sqlite3.Row
        self.db.execute("PRAGMA foreign_keys = ON")
        self.db.execute("PRAGMA journal_mode = WAL")
        self.db.executescript(SCHEMA)

    def close(self):
        self.db.close()

    # ---- reads -----------------------------------------------------------------------------
    def _with_replies(self, rows):
        out = []
        for r in rows:
            d = dict(r)
            d["accreditations"] = json.loads(d["accreditations"] or "[]")
            d["replies"] = [dict(x) for x in self.db.execute(
                "SELECT * FROM replies WHERE comment_id = ? ORDER BY created_at, id", (d["id"],))]
            out.append(d)
        return out

    def get(self, cid):
        rows = self._with_replies(self.db.execute("SELECT * FROM comments WHERE id = ?", (cid,)))
        if not rows:
            raise KeyError(cid)
        return rows[0]

    def list(self, scope_type=None, scope_id=None, page=None, statuses=None, accreditation=None, ids=None):
        sql, args = "SELECT * FROM comments WHERE 1 = 1", []
        for col, val in (("scope_type", scope_type), ("scope_id", scope_id), ("page", page)):
            if val:
                sql += f" AND {col} = ?"
                args.append(val)
        if statuses:
            sql += f" AND status IN ({','.join('?' * len(statuses))})"
            args += list(statuses)
        if ids:
            sql += f" AND id IN ({','.join('?' * len(ids))})"
            args += list(ids)
        rows = self._with_replies(self.db.execute(sql + " ORDER BY scope_id, page, created_at, id", args))
        if accreditation:
            rows = [r for r in rows if accreditation in r["accreditations"]
                    or (r["scope_type"] == "accreditation" and r["scope_id"] == accreditation)]
        return rows

    def counts(self, statuses=("open",)):
        q = (f"SELECT scope_type, scope_id, COUNT(*) n FROM comments WHERE status IN ({','.join('?' * len(statuses))})"
             " GROUP BY scope_type, scope_id")
        return {(r["scope_type"], r["scope_id"]): r["n"] for r in self.db.execute(q, list(statuses))}

    # ---- writes ----------------------------------------------------------------------------
    def create(self, data: dict) -> dict:
        kind = data.get("kind", "comment")
        if kind not in KINDS:
            raise FeedbackError(f"kind must be one of {', '.join(KINDS)}")
        scope_type = data.get("scope_type")
        if scope_type not in SCOPE_TYPES:
            raise FeedbackError("scope_type must be module or accreditation")
        fields = {f: _clip(f, data.get(f)) for f in
                  ("author", "scope_id", "page", "section_id", "section_label", "body", "quote", "prefix",
                   "suffix", "replacement")}
        if not (fields["author"] or "").strip():
            raise FeedbackError("Add your name before commenting")
        if not fields["scope_id"] or not fields["page"]:
            raise FeedbackError("scope_id and page are required")
        body, quote = (fields["body"] or "").strip(), fields["quote"] or ""
        if kind == "comment" and not body:
            raise FeedbackError("A comment needs text")
        if kind in ("suggestion", "highlight") and not quote.strip():
            raise FeedbackError(f"A {kind} needs selected text")
        if kind == "suggestion" and fields["replacement"] is None:
            raise FeedbackError("A suggested edit needs replacement text (it may be empty to delete)")
        accreditations = data.get("accreditations") or []
        if not isinstance(accreditations, list) or not all(isinstance(a, str) for a in accreditations):
            raise FeedbackError("accreditations must be a list of IDs")
        offset = data.get("text_offset")
        if offset is not None and not isinstance(offset, int):
            raise FeedbackError("text_offset must be an integer")
        cid, ts = new_id(), now()
        self.db.execute(
            "INSERT INTO comments (id, created_at, updated_at, author, scope_type, scope_id, accreditations, page,"
            " section_id, section_label, kind, status, body, quote, prefix, suffix, text_offset, replacement,"
            " build_ref) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, ?, ?)",
            (cid, ts, ts, fields["author"].strip(), scope_type, fields["scope_id"], json.dumps(accreditations),
             fields["page"], fields["section_id"], fields["section_label"], kind, body, quote,
             fields["prefix"] or "", fields["suffix"] or "", offset,
             fields["replacement"] if kind == "suggestion" else None, _clip("body", data.get("build_ref"))))
        return self.get(cid)

    def update(self, cid, data: dict) -> dict:
        current = self.get(cid)
        sets, args = [], []
        for f in ("body", "replacement"):
            if f in data:
                if f == "replacement" and current["kind"] != "suggestion":
                    raise FeedbackError("Only suggested edits have replacement text")
                sets.append(f"{f} = ?")
                args.append(_clip(f, data[f]) if f == "replacement" else (_clip(f, data[f]) or "").strip())
        if "status" in data:
            status = data["status"]
            if status not in ("open", "resolved"):
                raise FeedbackError("The overlay can only reopen or resolve; use cli.py apply or reject")
            sets += ["status = ?", "resolved_by = ?", "resolved_at = ?"]
            args += [status, _clip("author", data.get("by")) if status == "resolved" else None,
                     now() if status == "resolved" else None]
        if not sets:
            return current
        sets.append("updated_at = ?")
        args += [now(), cid]
        self.db.execute(f"UPDATE comments SET {', '.join(sets)} WHERE id = ?", args)
        return self.get(cid)

    def reply(self, cid, author, body) -> dict:
        self.get(cid)
        author, body = (_clip("author", author) or "").strip(), (_clip("body", body) or "").strip()
        if not author or not body:
            raise FeedbackError("A reply needs your name and text")
        self.db.execute("INSERT INTO replies (id, comment_id, created_at, author, body) VALUES (?, ?, ?, ?, ?)",
                        (new_id("RE"), cid, now(), author, body))
        self.db.execute("UPDATE comments SET updated_at = ? WHERE id = ?", (now(), cid))
        return self.get(cid)

    def delete(self, cid):
        self.get(cid)
        self.db.execute("DELETE FROM comments WHERE id = ?", (cid,))

    def close_out(self, ids, status, note, by, commit=None) -> list[dict]:
        """Mark comments applied or rejected with a resolution note."""
        if status not in ("applied", "rejected"):
            raise FeedbackError("status must be applied or rejected")
        if not (note or "").strip():
            raise FeedbackError("A resolution note is required")
        out = []
        for cid in ids:
            self.get(cid)
            self.db.execute(
                "UPDATE comments SET status = ?, resolution_note = ?, resolved_by = ?, resolved_at = ?,"
                " applied_commit = ?, updated_at = ? WHERE id = ?",
                (status, note.strip(), by, now(), commit, now(), cid))
            out.append(self.get(cid))
        return out

    # ---- archive ---------------------------------------------------------------------------
    def archive(self, history_dir: Path | None = None, ids=None, statuses=ARCHIVE_STATUSES, commit=None):
        """Move finished comments into Markdown history files, then delete them. Returns {file: [ids]}."""
        history_dir = Path(history_dir or os.environ.get("FEEDBACK_HISTORY") or DEFAULT_HISTORY)
        rows = self.list(statuses=statuses, ids=ids)
        if ids:
            missing = set(ids) - {r["id"] for r in rows}
            if missing:
                raise FeedbackError("Not archivable (unknown or still open): " + ", ".join(sorted(missing)))
        groups: dict[str, list[dict]] = {}
        for r in rows:
            groups.setdefault(r["scope_id"], []).append(r)
        done = {}
        for scope_id, items in groups.items():
            path = history_dir / f"{_safe_name(scope_id)}.md"
            existing = path.read_text() if path.exists() else ""
            fresh = [r for r in items if f"### {r['id']} " not in existing]
            if fresh:
                text = existing or _history_header(items[0])
                text = text.rstrip("\n") + "\n\n" + _history_batch(fresh, commit) + "\n"
                path.parent.mkdir(parents=True, exist_ok=True)
                tmp = path.with_suffix(".md.tmp")
                tmp.write_text(text)
                os.replace(tmp, path)
            self.db.execute("BEGIN")
            try:
                for r in items:
                    self.db.execute("DELETE FROM comments WHERE id = ?", (r["id"],))
                self.db.execute("COMMIT")
            except Exception:
                self.db.execute("ROLLBACK")
                raise
            done[str(path)] = [r["id"] for r in items]
        return done


def _safe_name(s):
    return "".join(c if c.isalnum() or c in "-_." else "_" for c in s)


def _history_header(r):
    label = "Accreditation" if r["scope_type"] == "accreditation" else "Module"
    return (f"# Feedback history: {r['scope_id']}\n\n"
            f"{label} review feedback archived from the local development feedback database "
            "(tools/feedback). Each entry records what a reviewer flagged and how it was resolved. "
            "Batches are appended oldest first.\n")


def _quote_md(text):
    return "\n".join("> " + line if line else ">" for line in text.splitlines()) or ">"


def _history_batch(rows, commit):
    head = f"## Archived {now()[:10]}" + (f" (commit {commit})" if commit else "")
    parts = [head]
    for r in rows:
        where = " › ".join(x for x in (r["page"], r["section_label"] or r["section_id"]) if x)
        lines = [f"### {r['id']} · {r['kind']} · {r['status']}", "",
                 f"- **Where:** {where or r['page']}"]
        if r["accreditations"]:
            lines.append(f"- **Accreditations:** {', '.join(r['accreditations'])}")
        lines.append(f"- **Reviewer:** {r['author']}, {r['created_at']}")
        if r["build_ref"]:
            lines.append(f"- **Build reviewed:** {r['build_ref']}")
        if r["kind"] == "suggestion":
            lines += ["- **Original:**", "", _quote_md(r["quote"]), "",
                      "- **Suggested:**", "", _quote_md(r["replacement"]) if r["replacement"] else "> (delete)", ""]
        elif r["quote"]:
            lines += ["- **Selected text:**", "", _quote_md(r["quote"]), ""]
        if r["body"]:
            lines += ["- **Comment:**", "", _quote_md(r["body"]), ""]
        for rep in r["replies"]:
            lines.append(f"- **Reply from {rep['author']}** ({rep['created_at']}): {rep['body']}")
        res = f"- **Resolution:** {r['status']}"
        if r["resolved_by"]:
            res += f" by {r['resolved_by']}"
        if r["resolved_at"]:
            res += f" on {r['resolved_at']}"
        if r["resolution_note"]:
            res += f". {r['resolution_note']}"
        if r["applied_commit"]:
            res += f" Commit {r['applied_commit']}."
        lines.append(res)
        parts.append("\n".join(lines).rstrip())
    return "\n\n".join(parts)
