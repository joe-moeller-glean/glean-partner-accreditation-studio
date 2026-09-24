#!/usr/bin/env python3
"""Extract the Partner Accreditation & Competency Roadmap tabs into CSV + JSON.

Input: raw text payload saved from a glean_read_document call on the roadmap
spreadsheet (Tika HTML inside a JSON envelope).
Output: one CSV + JSON per detected table.
"""
import argparse, csv, html, io, json, re
from pathlib import Path


def load_page_body(path):
    raw = path.read_text(encoding="utf-8", errors="ignore")
    line = next(l for l in raw.splitlines() if l.strip().startswith("content:"))
    obj = json.loads(line.strip()[len("content:"):].strip())
    if isinstance(obj, str):
        obj = json.loads(obj)
    return html.unescape(obj["pageBody"])


def table_rows(table_html):
    """Each <td> holds one already comma-delimited sheet row; parse it as CSV."""
    rows = []
    for tr in re.findall(r"<tr>(.*?)</tr>", table_html, re.S | re.I):
        for td in re.findall(r"<td[^>]*>(.*?)</td>", tr, re.S | re.I):
            text = re.sub(r"<[^>]+>", "", td).strip()
            if not text:
                continue
            parsed = next(csv.reader(io.StringIO(text)), [])
            rows.append([c.strip() for c in parsed])
    return rows


def trim_trailing_blanks(rows):
    width = max((len(r) for r in rows), default=0)
    while width and all(len(r) < width or not r[width - 1] for r in rows):
        width -= 1
    return [r[:width] + [""] * (width - len(r)) for r in rows]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--payload", type=Path, required=True)
    ap.add_argument("--out", type=Path, required=True)
    a = ap.parse_args()

    body = load_page_body(a.payload)
    tables = re.findall(r"<table>(.*?)</table>", body, re.S | re.I)
    a.out.mkdir(parents=True, exist_ok=True)

    summary = {}
    for idx, table in enumerate(tables, 1):
        rows = trim_trailing_blanks(table_rows(table))
        if not rows:
            continue
        name = re.sub(r"[^a-z0-9]+", "-", rows[0][0].lower()).strip("-") or ("table-%d" % idx)
        base = "tab-%02d-%s" % (idx, name)
        with (a.out / (base + ".csv")).open("w", newline="", encoding="utf-8") as fh:
            csv.writer(fh).writerows(rows)
        header = rows[0]
        records = [dict(zip(header, r)) for r in rows[1:]]
        (a.out / (base + ".json")).write_text(
            json.dumps({"columns": header, "records": records}, indent=2) + "\n")
        summary[base] = {"columns": header, "row_count": len(records)}
        print("%s: %d rows x %d cols" % (base, len(records), len(header)))

    (a.out / "extract-summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
