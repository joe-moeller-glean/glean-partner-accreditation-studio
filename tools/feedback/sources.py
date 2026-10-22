"""Locate the authoring source behind a piece of reviewed text.

Reviewers comment on rendered pages; edits belong in the sources that generate them (lesson
Markdown, workbook CSVs, module specs, accreditation YAML). `locate()` searches those files for
the selected text, ignoring whitespace and Markdown emphasis, and returns file:line hints with
authored sources ranked ahead of generated runtime files.
"""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEXT_SUFFIXES = {".md", ".csv", ".json", ".yaml", ".yml", ".py", ".js", ".html", ".txt"}
SKIP_DIRS = {".git", "node_modules", "dist", ".research", ".feedback", "__pycache__", "feedback-history", "tests"}
SKIP_FILES = {"runtime-qa-results.json", "visual-qa-results.json", "build-summary.json"}
IGNORED_CHARS = set("*_`")
GENERATED = ("content.js", "index.html", "module.json", "sources.json")
MAX_BYTES = 3_000_000


def _normalize(text):
    """Collapse whitespace and drop Markdown emphasis characters. Returns (normalized, index map)."""
    out, idx, space = [], [], False
    for i, ch in enumerate(text):
        if ch in IGNORED_CHARS:
            continue
        if ch.isspace():
            if not space and out:
                out.append(" ")
                idx.append(i)
            space = True
            continue
        space = False
        out.append(ch.lower())
        idx.append(i)
    return "".join(out).strip(), idx


def candidate_files(root: Path, scope_type: str, scope_id: str):
    roots = [root / "plan"]
    if scope_type == "module":
        roots.append(root / "learning" / "modules" / scope_id)
    else:
        roots.append(root / "learning" / "accreditations" / scope_id)
    roots.append(root / "tools")
    seen = set()
    for base in roots:
        if not base.exists():
            continue
        for p in sorted(base.rglob("*")):
            if p in seen or not p.is_file() or p.suffix.lower() not in TEXT_SUFFIXES:
                continue
            if set(p.relative_to(root).parts) & SKIP_DIRS or p.name in SKIP_FILES:
                continue
            if p.stat().st_size > MAX_BYTES or "feedback" in p.relative_to(root).parts[:2]:
                continue
            seen.add(p)
            yield p


def _rank(rel: str, scope_id: str):
    generated = rel.startswith("learning/modules/") and rel.rsplit("/", 1)[-1] in GENERATED
    return (generated, 0 if scope_id in rel else 1, rel)


def locate(quote: str, scope_type: str, scope_id: str, root: Path = ROOT, limit: int = 6):
    """Return [{'path', 'line', 'generated'}] for files that contain the quote."""
    needle, _ = _normalize(quote or "")
    if len(needle) < 8:
        return []
    needle = needle[:240]
    hits = []
    for p in candidate_files(root, scope_type, scope_id):
        try:
            raw = p.read_text(errors="ignore")
        except OSError:
            continue
        norm, idx = _normalize(raw)
        pos = norm.find(needle)
        if pos < 0:
            continue
        line = raw.count("\n", 0, idx[pos]) + 1
        rel = p.relative_to(root).as_posix()
        hits.append({"path": rel, "line": line,
                     "generated": rel.startswith("learning/modules/") and p.name in GENERATED})
    hits.sort(key=lambda h: _rank(h["path"], scope_id))
    return hits[:limit]
