#!/usr/bin/env python3
"""Original, brand-compliant SVG figures for the Sales Blueprinting lessons.

Authored in lesson Markdown (see tools/sbp/lessons.py):

    Figure: flow | Title drawn in the figure | Full-sentence alt text for screen readers
    - Step label :: optional detail
    - *Emphasised step :: detail         (leading * = the single Electric Blue emphasis)
    Caption: optional visible caption

Kinds and item grammar:
    flow     - label :: detail                      ordered steps with arrows
    cycle    - label :: detail                      ordered phases that loop back
    cards    - label :: detail                      grid of numbered cards
    stack    - label :: detail                      stacked layers, top to bottom
    compare  - Left header || Right header           first item = column headers
             - left cell || right cell              then one item per row
    matrix   - x: axis label / - y: axis label / - tl|tr|bl|br: label :: detail
    bars     - label :: number :: unit or note       horizontal bars to one scale

Every figure renders twice: a wide layout (880 units) for desktop and a narrow,
single-column layout (400 units) served below 640px through <picture>, so text
stays at least ~11px on a 320px screen. Brand rules follow tools/agents/svg_lib.py:
oatmeal canvas with teal/orchid corner washes, white hairline nodes, 2px ink
strokes, exactly one Electric Blue emphasis, mono sequence numerals, <title> and
<desc> on every SVG, no raster, no network references, no logos.
"""
import re
from xml.sax.saxutils import escape

BLUE, OATMEAL, WHITE, INK = "#343CED", "#F6F3EB", "#FFFFFF", "#000000"
OFF_WHITE, GREY = "#F8F8F8", "#5C5C5C"
HAIRLINE, WASH_TEAL, WASH_ORCHID = "rgba(0,0,0,0.14)", "#DEEEF0", "#F0C2F2"
FONT = "PolySans, DM Sans, Helvetica, Arial, sans-serif"
MONO = "PolySans Mono, IBM Plex Mono, Menlo, monospace"
KINDS = {"flow", "cycle", "cards", "stack", "compare", "matrix", "bars"}

# Layout constants per variant: canvas width, title/label/detail sizes, char width factor.
V = {
    "wide": {"w": 880, "pad": 32, "t": 22, "l": 18, "d": 16, "m": 15},
    "narrow": {"w": 400, "pad": 20, "t": 20, "l": 17, "d": 15, "m": 14},
}
CHAR = 0.54  # average glyph advance as a fraction of font size (sans, mixed case)


def _wrap(text, px, size):
    """Greedy wrap to a pixel width using an average glyph advance."""
    limit = max(8, int(px / (size * CHAR)))
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if len(trial) <= limit or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def _lh(size):
    return round(size * 1.3)


def _text(x, y, lines, size, weight="400", fill=INK, anchor="start", family=FONT):
    lh = _lh(size)
    return "".join(
        f'<text x="{x}" y="{y + n * lh}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
        f'fill="{fill}" text-anchor="{anchor}">{escape(ln)}</text>' for n, ln in enumerate(lines))


def _mono(x, y, s, size, fill=GREY, anchor="start"):
    return (f'<text x="{x}" y="{y}" font-family="{MONO}" font-size="{size}" letter-spacing="0.04em" '
            f'fill="{fill}" text-anchor="{anchor}">{escape(s)}</text>')


def _node(x, y, w, h, emphasis=False, fill=WHITE):
    stroke, sw = (BLUE, 2.5) if emphasis else (HAIRLINE, 1)
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'


def _arrow(x1, y1, x2, y2):
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{INK}" stroke-width="2" '
            'stroke-linecap="round" marker-end="url(#ah)"/>')


def _svg(w, h, title, desc, body):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">'
        f"<title>{escape(title)}</title><desc>{escape(desc)}</desc>"
        '<defs><radialGradient id="wt" cx="1.02" cy="-0.08" r="0.62">'
        f'<stop offset="0" stop-color="{WASH_TEAL}"/><stop offset="0.7" stop-color="{WASH_TEAL}" stop-opacity="0"/>'
        '</radialGradient><radialGradient id="wo" cx="-0.06" cy="1.06" r="0.45">'
        f'<stop offset="0" stop-color="{WASH_ORCHID}"/><stop offset="0.72" stop-color="{WASH_ORCHID}" stop-opacity="0"/>'
        '</radialGradient><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" '
        f'orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="{INK}" stroke-width="1.6" '
        'stroke-linecap="round" stroke-linejoin="round"/></marker></defs>'
        f'<rect width="{w}" height="{h}" fill="{OATMEAL}"/><rect width="{w}" height="{h}" fill="url(#wt)"/>'
        f'<rect width="{w}" height="{h}" fill="url(#wo)"/>{body}</svg>')


def _title(v, title):
    lines = _wrap(title, v["w"] - 2 * v["pad"], v["t"])
    y = v["pad"] + v["t"]
    return _text(v["pad"], y, lines, v["t"], "700"), y + (len(lines) - 1) * _lh(v["t"]) + 24


# ---------------------------------------------------------------- item parsing
def parse_items(kind, raw_items, where):
    """Turn '- ' item strings into structured items; raise on grammar errors."""
    if kind not in KINDS:
        raise ValueError(f"{where}: unknown figure kind '{kind}' (use {', '.join(sorted(KINDS))})")
    items, axes, quads = [], {}, {}
    for s in raw_items:
        emph = s.startswith("*")
        s = s.lstrip("*").strip()
        if kind == "compare":
            if "||" not in s:
                raise ValueError(f"{where}: compare items need 'left || right'")
            a, b = (p.strip() for p in s.split("||", 1))
            items.append({"a": a, "b": b, "emph": emph})
            continue
        if kind == "matrix":
            m = re.match(r"^(x|y|tl|tr|bl|br):\s*(.+)$", s)
            if not m:
                raise ValueError(f"{where}: matrix items start with x:, y:, tl:, tr:, bl: or br:")
            k, rest = m.groups()
            if k in ("x", "y"):
                axes[k] = rest.strip()
            else:
                label, _, detail = rest.partition("::")
                quads[k] = {"label": label.strip(), "detail": detail.strip()}
            continue
        parts = [p.strip() for p in s.split("::")]
        if kind == "bars":
            if len(parts) < 2 or not re.fullmatch(r"\d+(\.\d+)?", parts[1]):
                raise ValueError(f"{where}: bars items need 'label :: number :: note'")
            items.append({"label": parts[0], "value": float(parts[1]),
                          "note": parts[2] if len(parts) > 2 else "", "emph": emph})
            continue
        items.append({"label": parts[0], "detail": parts[1] if len(parts) > 1 else "", "emph": emph})
    if kind == "matrix":
        if set(quads) != {"tl", "tr", "bl", "br"} or set(axes) != {"x", "y"}:
            raise ValueError(f"{where}: matrix needs x, y and all four quadrants")
        return {"axes": axes, "quads": quads}
    if kind == "compare" and len(items) < 2:
        raise ValueError(f"{where}: compare needs a header item and at least one row")
    if not items:
        raise ValueError(f"{where}: figure has no items")
    if sum(1 for i in items if i.get("emph")) > 1:
        raise ValueError(f"{where}: only one emphasised (*) item is allowed")
    return {"items": items}


def _focus(items, default_last=False):
    marks = [n for n, i in enumerate(items) if i.get("emph")]
    return marks[0] if marks else (len(items) - 1 if default_last else -1)


# ---------------------------------------------------------------- renderers
def _boxes_vertical(v, items, y, numbered=True, arrows=True, focus=-1, loop=False):
    """Single column of nodes. Returns (svg, bottom_y)."""
    pad, out = v["pad"], []
    x0 = pad + (14 if loop else 0)
    w = v["w"] - x0 - pad
    tx = x0 + (56 if numbered else 20)
    gap = 40 if arrows else 14
    tops = []
    for n, it in enumerate(items):
        lab = _wrap(it["label"], w - (tx - x0) - 18, v["l"])
        det = _wrap(it["detail"], w - (tx - x0) - 18, v["d"]) if it.get("detail") else []
        h = 22 + len(lab) * _lh(v["l"]) + (8 + len(det) * _lh(v["d"]) if det else 0) + 14
        out.append(_node(x0, y, w, h, emphasis=(n == focus)))
        if numbered:
            out.append(_mono(x0 + 28, y + 22 + v["l"] - 2, f"{n + 1:02d}", v["m"], anchor="middle"))
        out.append(_text(tx, y + 18 + v["l"], lab, v["l"], "500"))
        if det:
            out.append(_text(tx, y + 18 + v["l"] + len(lab) * _lh(v["l"]) + 6, det, v["d"], fill=GREY))
        tops.append((y, h))
        if arrows and n < len(items) - 1:
            cx = x0 + 28 if numbered else x0 + w // 2
            out.append(_arrow(cx, y + h + 6, cx, y + h + gap - 8))
        y += h + gap
    bottom = y - gap
    if loop and len(tops) > 1:
        # return path on the left edge from the last node back to the first
        (fy, fh), (ly, lh) = tops[0], tops[-1]
        lx = pad + 2
        out.append(f'<path d="M {x0} {ly + lh / 2} H {lx} V {fy + fh / 2} H {x0 - 6}" fill="none" stroke="{INK}" '
                   'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#ah)"/>')
    return "".join(out), bottom


def _boxes_row(v, items, y, focus=-1, loop=False):
    """Horizontal row of equal-height nodes with arrows (wide only, 2-5 items)."""
    pad, n = v["pad"], len(items)
    gap = 40
    w = (v["w"] - 2 * pad - gap * (n - 1)) // n
    inner = w - 28
    labs = [_wrap(i["label"], inner, v["l"]) for i in items]
    dets = [_wrap(i["detail"], inner, v["d"]) if i.get("detail") else [] for i in items]
    h = 24 + v["m"] + 14 + max(len(l) for l in labs) * _lh(v["l"]) + \
        (8 + max(len(d) for d in dets) * _lh(v["d"]) if any(dets) else 0) + 16
    out = []
    for k, it in enumerate(items):
        x = pad + k * (w + gap)
        out.append(_node(x, y, w, h, emphasis=(k == focus)))
        out.append(_mono(x + 14, y + 20 + v["m"], f"{k + 1:02d}", v["m"]))
        ty = y + 20 + v["m"] + 14 + v["l"]
        out.append(_text(x + 14, ty, labs[k], v["l"], "500"))
        if dets[k]:
            out.append(_text(x + 14, ty + len(labs[k]) * _lh(v["l"]) + 6, dets[k], v["d"], fill=GREY))
        if k < n - 1:
            out.append(_arrow(x + w + 6, y + h / 2, x + w + gap - 8, y + h / 2))
    bottom = y + h
    if loop:
        lx0, lx1 = pad + w / 2, pad + (n - 1) * (w + gap) + w / 2
        out.append(f'<path d="M {lx1} {bottom + 4} V {bottom + 30} H {lx0} V {bottom + 10}" fill="none" '
                   f'stroke="{INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#ah)"/>')
        bottom += 34
    return "".join(out), bottom


def _cards(v, items, y, cols, focus=-1):
    pad, gap = v["pad"], 16
    w = (v["w"] - 2 * pad - gap * (cols - 1)) // cols
    inner = w - 32
    out = []
    rows = [items[i:i + cols] for i in range(0, len(items), cols)]
    n = 0
    for row in rows:
        labs = [_wrap(i["label"], inner, v["l"]) for i in row]
        dets = [_wrap(i["detail"], inner, v["d"]) if i.get("detail") else [] for i in row]
        h = 20 + v["m"] + 18 + max(len(l) for l in labs) * _lh(v["l"]) + \
            (8 + max(len(d) for d in dets) * _lh(v["d"]) if any(dets) else 0) + 16
        for c, it in enumerate(row):
            x = pad + c * (w + gap)
            out.append(_node(x, y, w, h, emphasis=(n == focus)))
            out.append(_mono(x + 16, y + 18 + v["m"], f"{n + 1:02d}", v["m"]))
            out.append(f'<line x1="{x + 16}" y1="{y + 28 + v["m"]}" x2="{x + w - 16}" y2="{y + 28 + v["m"]}" '
                       f'stroke="{HAIRLINE}" stroke-width="1"/>')
            ty = y + 28 + v["m"] + 10 + v["l"]
            out.append(_text(x + 16, ty, labs[c], v["l"], "500"))
            if dets[c]:
                out.append(_text(x + 16, ty + len(labs[c]) * _lh(v["l"]) + 6, dets[c], v["d"], fill=GREY))
            n += 1
        y += h + gap
    return "".join(out), y - gap


def _stack(v, items, y, focus=-1):
    pad, out = v["pad"], []
    w = v["w"] - 2 * pad
    for n, it in enumerate(items):
        lab = _wrap(it["label"], w - 44, v["l"])
        det = _wrap(it["detail"], w - 44, v["d"]) if it.get("detail") else []
        h = 20 + len(lab) * _lh(v["l"]) + (6 + len(det) * _lh(v["d"]) if det else 0) + 16
        out.append(_node(pad, y, w, h, fill=WHITE if n % 2 == 0 else OFF_WHITE))
        if n == focus:
            out.append(f'<rect x="{pad}" y="{y}" width="6" height="{h}" rx="3" fill="{BLUE}"/>')
        out.append(_text(pad + 24, y + 16 + v["l"], lab, v["l"], "500"))
        if det:
            out.append(_text(pad + 24, y + 16 + v["l"] + len(lab) * _lh(v["l"]) + 4, det, v["d"], fill=GREY))
        y += h + 10
    return "".join(out), y - 10


def _compare(v, items, y, narrow):
    pad, out = v["pad"], []
    head, rows = items[0], items[1:]
    if narrow:
        # one card per row: left value above right value, labelled by the headers
        w = v["w"] - 2 * pad
        for n, r in enumerate(rows):
            a = _wrap(r["a"], w - 32, v["d"])
            b = _wrap(r["b"], w - 32, v["d"])
            h = 16 + v["m"] + 6 + len(a) * _lh(v["d"]) + 14 + v["m"] + 6 + len(b) * _lh(v["d"]) + 16
            out.append(_node(pad, y, w, h, emphasis=r.get("emph")))
            yy = y + 14 + v["m"]
            out.append(_mono(pad + 16, yy, head["a"].upper(), v["m"] - 1))
            out.append(_text(pad + 16, yy + 6 + v["d"], a, v["d"]))
            yy += 6 + len(a) * _lh(v["d"]) + 14 + v["m"]
            out.append(_mono(pad + 16, yy, head["b"].upper(), v["m"] - 1, fill=INK))
            out.append(_text(pad + 16, yy + 6 + v["d"], b, v["d"]))
            y += h + 12
        return "".join(out), y - 12
    colw = (v["w"] - 2 * pad - 16) // 2
    hh = 20 + v["l"] + 12
    out.append(_node(pad, y, colw, hh, fill=OFF_WHITE))
    out.append(_node(pad + colw + 16, y, colw, hh, emphasis=True))
    out.append(_text(pad + 18, y + 14 + v["l"], _wrap(head["a"], colw - 36, v["l"])[:1], v["l"], "700"))
    out.append(_text(pad + colw + 34, y + 14 + v["l"], _wrap(head["b"], colw - 36, v["l"])[:1], v["l"], "700", fill=BLUE))
    y += hh + 10
    for r in rows:
        a = _wrap(r["a"], colw - 36, v["d"])
        b = _wrap(r["b"], colw - 36, v["d"])
        h = 18 + max(len(a), len(b)) * _lh(v["d"]) + 10
        out.append(_node(pad, y, colw, h))
        out.append(_node(pad + colw + 16, y, colw, h))
        out.append(_text(pad + 18, y + 12 + v["d"], a, v["d"]))
        out.append(_text(pad + colw + 34, y + 12 + v["d"], b, v["d"]))
        out.append(_arrow(pad + colw + 2, y + h / 2, pad + colw + 14, y + h / 2))
        y += h + 8
    return "".join(out), y - 8


def _matrix(v, spec, y, narrow):
    pad, out = v["pad"], []
    ax = 34
    size = (v["w"] - 2 * pad - ax) // 2
    order = [("tl", 0, 0), ("tr", 1, 0), ("bl", 0, 1), ("br", 1, 1)]
    q = spec["quads"]
    cell_h = 0
    wrapped = {}
    for k, _, _ in order:
        lab = _wrap(q[k]["label"], size - 34, v["l"])
        det = _wrap(q[k]["detail"], size - 34, v["d"]) if q[k]["detail"] else []
        wrapped[k] = (lab, det)
        cell_h = max(cell_h, 20 + len(lab) * _lh(v["l"]) + (6 + len(det) * _lh(v["d"]) if det else 0) + 18)
    cell_h = max(cell_h, int(size * (0.55 if narrow else 0.5)))
    ox = pad + ax
    for k, cx, cy in order:
        x, yy = ox + cx * (size + 6), y + cy * (cell_h + 6)
        out.append(_node(x, yy, size, cell_h, emphasis=(k == "tr"), fill=WHITE if cy == 0 else OFF_WHITE))
        lab, det = wrapped[k]
        out.append(_text(x + 16, yy + 16 + v["l"], lab, v["l"], "500"))
        if det:
            out.append(_text(x + 16, yy + 16 + v["l"] + len(lab) * _lh(v["l"]) + 4, det, v["d"], fill=GREY))
    total_h = cell_h * 2 + 6
    out.append(_arrow(ox, y + total_h + 16, ox + size * 2 + 6, y + total_h + 16))
    out.append(_mono(ox + size, y + total_h + 18 + v["m"] + 8, spec["axes"]["x"], v["m"], anchor="middle"))
    yx = pad + 12
    out.append(_arrow(yx, y + total_h, yx, y))
    out.append(f'<text x="{yx + 20}" y="{y + total_h / 2}" font-family="{MONO}" font-size="{v["m"]}" fill="{GREY}" '
               f'letter-spacing="0.04em" text-anchor="middle" transform="rotate(-90 {yx + 20} {y + total_h / 2})">'
               f'{escape(spec["axes"]["y"])}</text>')
    return "".join(out), y + total_h + 18 + v["m"] + 12


def _bars(v, items, y, narrow, focus=-1):
    pad, out = v["pad"], []
    mx = max(i["value"] for i in items) or 1
    labw = 0 if narrow else int((v["w"] - 2 * pad) * 0.36)
    barx = pad + labw
    barw = v["w"] - pad - barx - (110 if not narrow else 0)
    for n, it in enumerate(items):
        lab = _wrap(it["label"], (v["w"] - 2 * pad) if narrow else labw - 16, v["d"])
        val = f'{it["value"]:g}' + (f' {it["note"]}' if it["note"] else "")
        if narrow:
            out.append(_text(pad, y + v["d"], lab, v["d"], "500"))
            y += len(lab) * _lh(v["d"]) + 6
            bw = max(6, barw * it["value"] / mx * 0.72)
            out.append(f'<rect x="{pad}" y="{y}" width="{bw:.1f}" height="22" rx="6" '
                       f'fill="{BLUE if n == focus else INK}"/>')
            out.append(_mono(pad + bw + 8, y + 16, val, v["m"]))
            y += 22 + 16
        else:
            h = max(len(lab) * _lh(v["d"]), 26)
            out.append(_text(pad, y + v["d"], lab, v["d"], "500"))
            bw = max(6, barw * it["value"] / mx)
            out.append(f'<rect x="{barx}" y="{y}" width="{bw:.1f}" height="26" rx="6" '
                       f'fill="{BLUE if n == focus else INK}"/>')
            out.append(_mono(barx + bw + 10, y + 18, val, v["m"]))
            y += h + 14
    return "".join(out), y - 14


def render(fig, variant):
    """Render one parsed figure dict to an SVG string for 'wide' or 'narrow'."""
    v = V[variant]
    narrow = variant == "narrow"
    kind = fig["kind"]
    head, y = _title(v, fig["title"])
    items = fig.get("items", [])
    if kind in ("flow", "cycle"):
        focus = _focus(items, default_last=(kind == "flow"))
        if not narrow and 2 <= len(items) <= 5:
            body, bottom = _boxes_row(v, items, y, focus=focus, loop=(kind == "cycle"))
        else:
            body, bottom = _boxes_vertical(v, items, y, focus=focus, loop=(kind == "cycle"))
    elif kind == "cards":
        cols = 1 if narrow else (3 if len(items) in (3, 5, 6, 9) else 2)
        body, bottom = _cards(v, items, y, cols, focus=_focus(items))
    elif kind == "stack":
        body, bottom = _stack(v, items, y, focus=_focus(items))
    elif kind == "compare":
        body, bottom = _compare(v, items, y, narrow)
    elif kind == "matrix":
        body, bottom = _matrix(v, fig, y, narrow)
    elif kind == "bars":
        body, bottom = _bars(v, items, y, narrow, focus=_focus(items))
    else:
        raise ValueError(kind)
    h = int(bottom + v["pad"])
    return _svg(v["w"], h, fig["title"], fig["alt"], head + body)


def text_of(fig):
    """All learner-visible strings in a figure (for leak and placeholder scans)."""
    out = [fig["title"], fig["alt"], fig.get("caption", "")]
    for i in fig.get("items", []):
        out += [str(x) for k, x in i.items() if k in ("label", "detail", "note", "a", "b")]
    for q in fig.get("quads", {}).values():
        out += [q["label"], q["detail"]]
    out += list(fig.get("axes", {}).values())
    return [s for s in out if s]
