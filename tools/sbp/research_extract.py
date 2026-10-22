#!/usr/bin/env python3
"""Extract plain text from a saved glean_read_document output log into .research/sbp/<SID>.txt.

Usage: python3 tools/sbp/research_extract.py <log> [<log> ...]
Source IDs are resolved by URL against the workbook source register (15-sources.csv).
The output folder is git-ignored: internal full text is an authoring reference only.
"""
import csv
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / ".research" / "sbp"
REG = ROOT / "plan" / "sales-blueprinting" / "workbook" / "15-sources.csv"
# Sources added after the workbook import (training recordings, decks). Same columns.
SUPP = ROOT / "plan" / "sales-blueprinting" / "sources-supplement.csv"


def norm(u):
    return re.sub(r"[/?#].*$", "", re.sub(r"^https?://", "", u.strip()).split("/d/")[-1]) if "/d/" in u else u.strip().rstrip("/")


def html_text(s):
    s = re.sub(r"(?is)<(script|style|head)[^>]*>.*?</\1>", " ", s)
    s = re.sub(r"(?i)<br\s*/?>|</(p|div|li|h[1-6]|tr|table|section)>", "\n", s)
    s = re.sub(r"(?i)<li[^>]*>", "\n- ", s)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t\u00a0]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n\n", s)
    return s.strip()


def docs_from_log(text):
    """Yield (url, title, raw_content) from the YAML-like tool output."""
    blocks = re.split(r"\n\s+(?:- )?datasource:", text)
    for b in blocks:
        u = re.search(r'\n    url: "?([^"\n]+)"?', b)
        t = re.search(r"\n    title: (.+)", b)
        c = re.search(r'\n      content: (".*?")\n      mimeType', b, re.S)
        if u and c:
            yield u.group(1), (t.group(1).strip() if t else ""), json.loads(c.group(1))


def main(paths):
    reg = {}
    for f in (REG, SUPP):
        if f.exists():
            reg.update({norm(r["Source URL"]): r["Source ID"] for r in csv.DictReader(f.open()) if r["Source URL"]})
    OUT.mkdir(parents=True, exist_ok=True)
    for p in paths:
        for url, title, raw in docs_from_log(Path(p).read_text(errors="replace")):
            try:
                obj = json.loads(raw)
                body = obj.get("pageBody") if isinstance(obj, dict) else None
                if not body:
                    # Transcripts and other shapes: keep every string value in document order.
                    vals = []
                    def walk(x):
                        if isinstance(x, str):
                            vals.append(x)
                        elif isinstance(x, dict):
                            for v in x.values():
                                walk(v)
                        elif isinstance(x, list):
                            for v in x:
                                walk(v)
                    walk(obj)
                    body = "\n".join(vals)
            except (json.JSONDecodeError, AttributeError):
                body = raw
            body = re.sub(r"^[^<]{0,8}", "", body) if "<" in body[:12] else body
            txt = html_text(body)
            sid = reg.get(norm(url), "UNMAPPED")
            (OUT / f"{sid}.txt").write_text(f"# {sid} | {title}\n# {url}\n\n{txt}\n")
            print(f"{sid:9} {len(txt.split()):>6} words  {title[:70]}")


if __name__ == "__main__":
    main(sys.argv[1:])
