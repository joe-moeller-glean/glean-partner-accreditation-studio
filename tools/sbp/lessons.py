"""Authored, expanded lesson content for the Sales Blueprinting modules.

Each module has plan/sales-blueprinting/lessons/<MODULE>.md:

    # SBP-101 Blueprint Fundamentals
    ## SBP-101-L01 Purpose and customer promise
    @src S02 S04                 lesson default sources (author trace, never rendered)
    Opening paragraph(s).
    ### A subsection heading
    @src S05                     optional override for this subsection
    @quote S05 | exact excerpt   verified word for word by `build_sbp.py verify-quotes`
    Paragraph with **bold**.
    - bullet
    1. numbered step
    > **Label:** callout text
    Table: caption
    | Head | Head |
    |---|---|
    | cell | cell |
    Figure: flow | Title | Full-sentence alt text   original SVG diagram (tools/sbp/figures.py)
    - Step :: detail
    Caption: optional visible caption
    ### Practice
    Prompt blocks.
    ### Worked response
    Blocks revealed after the learner drafts.

Source IDs and quotes feed the claim ledger only. Learners never see them.
"""
import re
from pathlib import Path

import figures

ROOT = Path(__file__).resolve().parents[2]
LESSON_DIR = ROOT / "plan" / "sales-blueprinting" / "lessons"
SPECIAL = {"practice": "practice", "worked response": "worked"}


def plain(blocks):
    out = []
    for b in blocks:
        if b["t"] in {"p", "h3"}:
            out.append(b["x"])
        elif b["t"] in {"ul", "ol"}:
            out += b["items"]
        elif b["t"] == "callout":
            out.append(f"{b['label']} {b['x']}")
        elif b["t"] == "table":
            out += [" | ".join(r) for r in b["rows"]]
        elif b["t"] == "figure":
            out += figures.text_of(b)[2:]
    return re.sub(r"\*\*", "", " ".join(out))


def words(blocks):
    return len(plain(blocks).split())


def _blocks(lines, where):
    """Convert body lines (no @ lines, no headings) to render blocks."""
    blocks, para, i = [], [], 0

    def flush():
        if para:
            blocks.append({"t": "p", "x": " ".join(para)})
            para.clear()

    caption = None
    while i < len(lines):
        ln = lines[i].rstrip()
        s = ln.strip()
        if not s:
            flush()
            i += 1
            continue
        if s.startswith("Figure:"):
            flush()
            head = [p.strip() for p in s[7:].split("|")]
            if len(head) != 3 or not all(head):
                raise ValueError(f"{where}: Figure needs 'kind | title | alt text'")
            kind, title, alt = head
            if len(alt) < 40 or not alt.endswith("."):
                raise ValueError(f"{where}: figure alt text must be a full descriptive sentence")
            i += 1
            raw, cap = [], ""
            while i < len(lines):
                t = lines[i].strip()
                if t.startswith("- "):
                    raw.append(t[2:].strip())
                elif t.startswith("Caption:"):
                    cap = t[8:].strip()
                    i += 1
                    break
                else:
                    break
                i += 1
            fig = {"t": "figure", "kind": kind, "title": title, "alt": alt, "caption": cap}
            fig.update(figures.parse_items(kind, raw, where))
            blocks.append(fig)
            continue
        if s.startswith("Table:"):
            flush()
            caption = s[6:].strip()
            i += 1
            continue
        if s.startswith("|"):
            flush()
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-{3,}:?", c) for c in cells):
                    rows.append(cells)
                i += 1
            if len(rows) < 2:
                raise ValueError(f"{where}: table needs a header and at least one row")
            if any(len(r) != len(rows[0]) for r in rows):
                raise ValueError(f"{where}: table rows have different column counts")
            blocks.append({"t": "table", "caption": caption or "Table", "head": rows[0], "rows": rows[1:]})
            caption = None
            continue
        m = re.match(r"^- (.*)", s)
        n = re.match(r"^\d+\. (.*)", s)
        if m or n:
            flush()
            kind = "ul" if m else "ol"
            items = []
            while i < len(lines):
                t = lines[i].strip()
                mm = re.match(r"^- (.*)", t) if kind == "ul" else re.match(r"^\d+\. (.*)", t)
                if mm:
                    items.append(mm.group(1).strip())
                elif t and not re.match(r"^(- |\d+\. |>|\||Table:)", t) and items and lines[i].startswith("  "):
                    items[-1] += " " + t
                else:
                    break
                i += 1
            blocks.append({"t": kind, "items": items})
            continue
        if s.startswith(">"):
            flush()
            body = s.lstrip("> ").strip()
            i += 1
            while i < len(lines) and lines[i].strip().startswith(">"):
                body += " " + lines[i].strip().lstrip("> ").strip()
                i += 1
            mm = re.match(r"^\*\*(.+?):\*\*\s*(.*)", body)
            blocks.append({"t": "callout", "label": mm.group(1) if mm else "Note",
                           "x": mm.group(2) if mm else body})
            continue
        para.append(s)
        i += 1
    flush()
    return blocks


def parse(path):
    """Return {lesson_id: lesson} from one module file."""
    text = path.read_text()
    lessons, cur, sub = {}, None, None

    def new_sub(title):
        return {"title": title, "src": None, "quotes": [], "lines": []}

    for raw in text.splitlines():
        if raw.startswith("# "):
            continue
        m = re.match(r"^## (SBP-\d{3}-L\d{2}) (.+)$", raw)
        if m:
            cur = {"id": m.group(1), "title": m.group(2).strip(), "src": [], "subs": []}
            lessons[cur["id"]] = cur
            sub = new_sub("")
            cur["subs"].append(sub)
            continue
        if cur is None:
            continue
        m = re.match(r"^### (.+)$", raw)
        if m:
            sub = new_sub(m.group(1).strip())
            cur["subs"].append(sub)
            continue
        if raw.startswith("@src "):
            ids = raw[5:].split()
            if sub["title"] == "" and not sub["lines"] and not cur["src"]:
                cur["src"] = ids
            else:
                sub["src"] = ids
            continue
        if raw.startswith("@quote "):
            sid, _, q = raw[7:].partition("|")
            sub["quotes"].append({"source": sid.strip(), "text": q.strip()})
            continue
        sub["lines"].append(raw)

    out = {}
    for lid, l in lessons.items():
        if not l["src"]:
            raise ValueError(f"{lid}: missing lesson @src line")
        body, practice, worked, sections = [], None, None, []
        for n, s in enumerate(l["subs"]):
            where = f"{lid} / {s['title'] or 'opening'}"
            blocks = _blocks(s["lines"], where)
            if not blocks and not s["title"]:
                continue
            if not blocks:
                raise ValueError(f"{where}: empty subsection")
            kind = SPECIAL.get(s["title"].lower())
            sec = {"n": n, "title": s["title"], "kind": kind or "body", "blocks": blocks,
                   "src": s["src"] or l["src"], "quotes": s["quotes"]}
            sections.append(sec)
            if kind == "practice":
                practice = blocks
            elif kind == "worked":
                worked = blocks
            else:
                if s["title"]:
                    body.append({"t": "h3", "x": s["title"]})
                body += blocks
        if practice is None or worked is None:
            raise ValueError(f"{lid}: needs ### Practice and ### Worked response")
        out[lid] = {"id": lid, "title": l["title"], "src": l["src"], "blocks": body,
                    "practice": practice, "worked": worked, "sections": sections,
                    "words": words(body) + words(practice) + words(worked)}
    return out


def load_all():
    data = {}
    if LESSON_DIR.exists():
        for p in sorted(LESSON_DIR.glob("SBP-*.md")):
            data.update(parse(p))
    return data
