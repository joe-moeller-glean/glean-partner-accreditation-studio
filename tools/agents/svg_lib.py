#!/usr/bin/env python3
"""Brand-compliant SVG diagram generators.

Rules enforced here (see references/graphics-system.md):
  - 2px strokes, 8px corner radius, 8px spacing grid, sentence-case labels
  - semantic colour: blue = Glean/primary path, green = success/outcome,
    oatmeal = context surface, black = structure
  - every SVG carries <title> and <desc>
  - all wording is real SVG text so it stays selectable and translatable
  - no embedded raster, no network references, no generated logos
"""
from xml.sax.saxutils import escape

BLUE = "#343CED"
GREEN = "#D8FD49"
OATMEAL = "#F6F3EB"
WHITE = "#FFFFFF"
INK = "#000000"
CEMENT = "#C7C7AB"
FONT = "PolySans, DM Sans, Arial, sans-serif"


def _wrap(text, width):
    """Greedy wrap into lines of at most `width` characters."""
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if len(trial) <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def _text_block(x, y, lines, size=13, weight="400", fill=INK, anchor="start", lh=17):
    out = []
    for n, ln in enumerate(lines):
        out.append(
            f'<text x="{x}" y="{y + n * lh}" font-family="{FONT}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{escape(ln)}</text>'
        )
    return "\n".join(out)


def _head(w, h, title, desc):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" '
        f'preserveAspectRatio="xMidYMid meet">\n'
        f"<title>{escape(title)}</title>\n<desc>{escape(desc)}</desc>\n"
        f'<rect x="0" y="0" width="{w}" height="{h}" fill="{OATMEAL}"/>'
    )


def _arrow_defs():
    return (
        '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" '
        f'markerHeight="6" orient="auto-start-reverse">'
        f'<path d="M 0 0 L 10 5 L 0 10 z" fill="{INK}"/></marker></defs>'
    )


def stack(title, desc, layers, width=560):
    """Vertical stacked layers: list of (label, detail, accent) top to bottom."""
    pad, gap, bh = 24, 12, 76
    h = pad * 2 + len(layers) * bh + (len(layers) - 1) * gap + 40
    parts = [_head(width, h, title, desc)]
    parts.append(_text_block(pad, pad + 16, _wrap(title, 46), size=15, weight="700"))
    y = pad + 40
    for label, detail, accent in layers:
        fill = {"blue": BLUE, "green": GREEN, "white": WHITE}.get(accent, WHITE)
        tcol = WHITE if accent == "blue" else INK
        parts.append(
            f'<rect x="{pad}" y="{y}" width="{width - pad * 2}" height="{bh}" rx="8" '
            f'fill="{fill}" stroke="{INK}" stroke-width="2"/>'
        )
        parts.append(_text_block(pad + 16, y + 26, _wrap(label, 40), size=14, weight="700", fill=tcol))
        parts.append(_text_block(pad + 16, y + 48, _wrap(detail, 54), size=12, fill=tcol))
        y += bh + gap
    parts.append("</svg>")
    return "\n".join(parts)


def flow(title, desc, steps, width=620):
    """Vertical flow of steps with connecting arrows: list of (label, detail)."""
    pad, gap, bh = 24, 34, 68
    h = pad * 2 + len(steps) * bh + (len(steps) - 1) * gap + 40
    parts = [_head(width, h, title, desc), _arrow_defs()]
    parts.append(_text_block(pad, pad + 16, _wrap(title, 50), size=15, weight="700"))
    y = pad + 40
    for n, (label, detail) in enumerate(steps):
        parts.append(
            f'<rect x="{pad}" y="{y}" width="{width - pad * 2}" height="{bh}" rx="8" '
            f'fill="{WHITE}" stroke="{INK}" stroke-width="2"/>'
        )
        parts.append(
            f'<circle cx="{pad + 26}" cy="{y + bh // 2}" r="15" fill="{BLUE}" '
            f'stroke="{INK}" stroke-width="2"/>'
        )
        parts.append(
            f'<text x="{pad + 26}" y="{y + bh // 2 + 5}" font-family="{FONT}" font-size="13" '
            f'font-weight="700" fill="{WHITE}" text-anchor="middle">{n + 1}</text>'
        )
        parts.append(_text_block(pad + 52, y + 26, _wrap(label, 38), size=14, weight="700"))
        parts.append(_text_block(pad + 52, y + 46, _wrap(detail, 56), size=12))
        if n < len(steps) - 1:
            cx = pad + 26
            parts.append(
                f'<line x1="{cx}" y1="{y + bh}" x2="{cx}" y2="{y + bh + gap}" '
                f'stroke="{INK}" stroke-width="2" marker-end="url(#ah)"/>'
            )
        y += bh + gap
    parts.append("</svg>")
    return "\n".join(parts)


def matrix(title, desc, x_axis, y_axis, quadrants, width=560):
    """2x2 matrix. quadrants = dict with keys tl, tr, bl, br -> (label, detail)."""
    pad, size = 30, 210
    h = pad * 2 + size * 2 + 76
    parts = [_head(width, h, title, desc)]
    parts.append(_text_block(pad, pad + 4, _wrap(title, 46), size=15, weight="700"))
    ox, oy = pad + 34, pad + 24
    order = [("tl", 0, 0, WHITE), ("tr", 1, 0, GREEN), ("bl", 0, 1, WHITE), ("br", 1, 1, OATMEAL)]
    for key, cx, cy, fill in order:
        x, y = ox + cx * size, oy + cy * size
        label, detail = quadrants[key]
        parts.append(
            f'<rect x="{x}" y="{y}" width="{size}" height="{size}" rx="8" fill="{fill}" '
            f'stroke="{INK}" stroke-width="2"/>'
        )
        parts.append(_text_block(x + 14, y + 30, _wrap(label, 22), size=13, weight="700"))
        parts.append(_text_block(x + 14, y + 30 + 20 * len(_wrap(label, 22)), _wrap(detail, 26), size=11))
    parts.append(
        f'<text x="{ox + size}" y="{oy + size * 2 + 30}" font-family="{FONT}" font-size="12" '
        f'font-weight="700" fill="{INK}" text-anchor="middle">{escape(x_axis)}</text>'
    )
    parts.append(
        f'<text x="{ox - 12}" y="{oy + size}" font-family="{FONT}" font-size="12" '
        f'font-weight="700" fill="{INK}" text-anchor="middle" '
        f'transform="rotate(-90 {ox - 12} {oy + size})">{escape(y_axis)}</text>'
    )
    parts.append("</svg>")
    return "\n".join(parts)


def cards(title, desc, items, cols=2, width=620):
    """Grid of labelled cards: list of (label, detail)."""
    pad, gap = 24, 12
    cw = (width - pad * 2 - gap * (cols - 1)) // cols
    ch = 104
    rows = (len(items) + cols - 1) // cols
    h = pad * 2 + rows * ch + (rows - 1) * gap + 40
    parts = [_head(width, h, title, desc)]
    parts.append(_text_block(pad, pad + 16, _wrap(title, 50), size=15, weight="700"))
    for n, (label, detail) in enumerate(items):
        r, c = divmod(n, cols)
        x = pad + c * (cw + gap)
        y = pad + 40 + r * (ch + gap)
        parts.append(
            f'<rect x="{x}" y="{y}" width="{cw}" height="{ch}" rx="8" fill="{WHITE}" '
            f'stroke="{INK}" stroke-width="2"/>'
        )
        parts.append(f'<rect x="{x}" y="{y}" width="{cw}" height="6" rx="3" fill="{BLUE}"/>')
        parts.append(_text_block(x + 14, y + 30, _wrap(label, 26), size=13, weight="700"))
        off = 30 + 18 * len(_wrap(label, 26))
        parts.append(_text_block(x + 14, y + off, _wrap(detail, 32), size=11, lh=14))
    parts.append("</svg>")
    return "\n".join(parts)


def compare(title, desc, left, right, rows, width=620):
    """Two-column comparison. left/right are column headers; rows = list of (a, b)."""
    pad = 24
    rh = 62
    h = pad * 2 + 40 + 36 + len(rows) * rh
    colw = (width - pad * 2) // 2
    parts = [_head(width, h, title, desc)]
    parts.append(_text_block(pad, pad + 16, _wrap(title, 50), size=15, weight="700"))
    y = pad + 40
    for n, (hdr, fill, tcol) in enumerate([(left, BLUE, WHITE), (right, WHITE, INK)]):
        x = pad + n * colw
        parts.append(
            f'<rect x="{x}" y="{y}" width="{colw}" height="36" rx="8" fill="{fill}" '
            f'stroke="{INK}" stroke-width="2"/>'
        )
        parts.append(_text_block(x + 12, y + 23, _wrap(hdr, 28), size=13, weight="700", fill=tcol))
    y += 36
    for a, b in rows:
        for n, cell in enumerate([a, b]):
            x = pad + n * colw
            parts.append(
                f'<rect x="{x}" y="{y}" width="{colw}" height="{rh}" fill="{WHITE}" '
                f'stroke="{INK}" stroke-width="2"/>'
            )
            parts.append(_text_block(x + 12, y + 24, _wrap(cell, 34), size=11, lh=15))
        y += rh
    parts.append("</svg>")
    return "\n".join(parts)


def taxonomy(title, desc, groups, width=620):
    """Numbered taxonomy grid: list of (number_label, detail)."""
    pad, gap = 24, 10
    cols = 2
    cw = (width - pad * 2 - gap) // cols
    ch = 92
    rows = (len(groups) + cols - 1) // cols
    h = pad * 2 + 40 + rows * ch + (rows - 1) * gap
    parts = [_head(width, h, title, desc)]
    parts.append(_text_block(pad, pad + 16, _wrap(title, 50), size=15, weight="700"))
    for n, (label, detail) in enumerate(groups):
        r, c = divmod(n, cols)
        x = pad + c * (cw + gap)
        y = pad + 40 + r * (ch + gap)
        parts.append(
            f'<rect x="{x}" y="{y}" width="{cw}" height="{ch}" rx="8" fill="{WHITE}" '
            f'stroke="{INK}" stroke-width="2"/>'
        )
        parts.append(
            f'<rect x="{x}" y="{y}" width="34" height="{ch}" rx="8" fill="{OATMEAL}" '
            f'stroke="{INK}" stroke-width="2"/>'
        )
        parts.append(
            f'<text x="{x + 17}" y="{y + 30}" font-family="{FONT}" font-size="15" '
            f'font-weight="700" fill="{INK}" text-anchor="middle">{n + 1}</text>'
        )
        parts.append(_text_block(x + 44, y + 24, _wrap(label, 28), size=12, weight="700", lh=15))
        off = 24 + 15 * len(_wrap(label, 28)) + 4
        parts.append(_text_block(x + 44, y + off, _wrap(detail, 34), size=11, lh=14))
    parts.append("</svg>")
    return "\n".join(parts)
