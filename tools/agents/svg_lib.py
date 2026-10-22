#!/usr/bin/env python3
"""Brand-compliant SVG diagram generators - Glean Branding Style 2026.

Rules enforced here (see skills/brand/references/IMAGERY.md and
skills/references/graphics-system.md):
  - Oatmeal canvas with soft teal (top-right) and orchid (bottom-left) corner washes
  - white nodes, 12px radius, 1px hairline border, no drop shadows
  - 2px black primary strokes, 1.5px grey connectors, round caps and joins
  - exactly one Electric Blue emphasis per diagram; Bright Green never on light surfaces
  - mono labels and mono sequence numerals (01, 02, 03), never circled digits
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
OFF_WHITE = "#F8F8F8"
GREY = "#666666"          # supporting and mono text; 5.2:1 on oatmeal, 5.7:1 on white
HAIRLINE = "rgba(0,0,0,0.12)"
CONNECTOR = "rgba(0,0,0,0.35)"
WASH_TEAL = "#DEEEF0"
WASH_ORCHID = "#F0C2F2"
FONT = "PolySans, DM Sans, Arial, sans-serif"
MONO = "PolySans Mono, IBM Plex Mono, Roboto Mono, Menlo, monospace"
RADIUS = 12


def _node(x, y, w, h, fill=WHITE, emphasis=False, rx=RADIUS):
    """White node with a hairline border, or the single blue-emphasis node."""
    stroke, sw = (BLUE, 2) if emphasis else (HAIRLINE, 1)
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="{sw}"/>')


def _mono(x, y, text, size=12, fill=GREY, anchor="start", extra=""):
    return (f'<text x="{x}" y="{y}" font-family="{MONO}" font-size="{size}" '
            f'letter-spacing="0.04em" fill="{fill}" text-anchor="{anchor}"{extra}>{escape(text)}</text>')


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
        '<defs>'
        '<radialGradient id="wt" cx="1.02" cy="-0.08" r="0.62" gradientUnits="objectBoundingBox">'
        f'<stop offset="0" stop-color="{WASH_TEAL}"/><stop offset="0.7" stop-color="{WASH_TEAL}" stop-opacity="0"/>'
        '</radialGradient>'
        '<radialGradient id="wo" cx="-0.06" cy="1.06" r="0.45" gradientUnits="objectBoundingBox">'
        f'<stop offset="0" stop-color="{WASH_ORCHID}"/><stop offset="0.72" stop-color="{WASH_ORCHID}" stop-opacity="0"/>'
        '</radialGradient></defs>\n'
        f'<rect x="0" y="0" width="{w}" height="{h}" fill="{OATMEAL}"/>'
        f'<rect x="0" y="0" width="{w}" height="{h}" fill="url(#wt)"/>'
        f'<rect x="0" y="0" width="{w}" height="{h}" fill="url(#wo)"/>'
    )


def _arrow_defs():
    return (
        '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" '
        f'markerHeight="6" orient="auto-start-reverse">'
        f'<path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="{INK}" stroke-width="1.5" '
        'stroke-linecap="round" stroke-linejoin="round"/></marker></defs>'
    )


def stack(title, desc, layers, width=560):
    """Vertical stacked layers: list of (label, detail, accent) top to bottom."""
    pad, gap, bh = 24, 12, 76
    h = pad * 2 + len(layers) * bh + (len(layers) - 1) * gap + 40
    parts = [_head(width, h, title, desc)]
    parts.append(_text_block(pad, pad + 16, _wrap(title, 46), size=15, weight="700"))
    y = pad + 40
    # Layer bands alternate white and off-white; the one "blue" layer (or, failing
    # that, the first "green" layer) gets the single Electric Blue left rule.
    marks = [a for _, _, a in layers]
    focus = marks.index("blue") if "blue" in marks else (marks.index("green") if "green" in marks else -1)
    for n, (label, detail, accent) in enumerate(layers):
        fill = WHITE if n % 2 == 0 else OFF_WHITE
        parts.append(_node(pad, y, width - pad * 2, bh, fill=fill))
        if n == focus:
            parts.append(f'<rect x="{pad}" y="{y}" width="4" height="{bh}" rx="2" fill="{BLUE}"/>')
        parts.append(_text_block(pad + 20, y + 28, _wrap(label, 40), size=14, weight="500"))
        parts.append(_text_block(pad + 20, y + 50, _wrap(detail, 54), size=12, fill=GREY))
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
        # the final step is the outcome, so it carries the single blue emphasis
        parts.append(_node(pad, y, width - pad * 2, bh, emphasis=(n == len(steps) - 1)))
        parts.append(_mono(pad + 26, y + bh // 2 + 4, f"{n + 1:02d}", size=13, anchor="middle"))
        parts.append(_text_block(pad + 52, y + 28, _wrap(label, 38), size=14, weight="500"))
        parts.append(_text_block(pad + 52, y + 48, _wrap(detail, 56), size=12, fill=GREY))
        if n < len(steps) - 1:
            cx = pad + 26
            parts.append(
                f'<line x1="{cx}" y1="{y + bh + 4}" x2="{cx}" y2="{y + bh + gap - 4}" '
                f'stroke="{INK}" stroke-width="1.5" stroke-linecap="round" marker-end="url(#ah)"/>'
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
    # top-right is the target quadrant: it carries the single blue emphasis
    order = [("tl", 0, 0, WHITE), ("tr", 1, 0, WHITE), ("bl", 0, 1, OFF_WHITE), ("br", 1, 1, OFF_WHITE)]
    g = 6
    for key, cx, cy, fill in order:
        x, y = ox + cx * size + (g // 2 if cx else 0), oy + cy * size + (g // 2 if cy else 0)
        label, detail = quadrants[key]
        parts.append(_node(x, y, size - g // 2, size - g // 2, fill=fill, emphasis=(key == "tr")))
        parts.append(_text_block(x + 16, y + 32, _wrap(label, 22), size=13, weight="500"))
        parts.append(_text_block(x + 16, y + 32 + 20 * len(_wrap(label, 22)), _wrap(detail, 26), size=11, fill=GREY))
    parts.append(_mono(ox + size, oy + size * 2 + 30, x_axis, anchor="middle"))
    parts.append(_mono(ox - 12, oy + size, y_axis, anchor="middle",
                       extra=f' transform="rotate(-90 {ox - 12} {oy + size})"'))
    parts.append("</svg>")
    return "\n".join(parts)


def cards(title, desc, items, cols=2, width=620):
    """Grid of labelled cards: list of (label, detail)."""
    pad, gap = 24, 12
    cw = (width - pad * 2 - gap * (cols - 1)) // cols
    ch = 124
    rows = (len(items) + cols - 1) // cols
    h = pad * 2 + rows * ch + (rows - 1) * gap + 40
    parts = [_head(width, h, title, desc)]
    parts.append(_text_block(pad, pad + 16, _wrap(title, 50), size=15, weight="700"))
    for n, (label, detail) in enumerate(items):
        r, c = divmod(n, cols)
        x = pad + c * (cw + gap)
        y = pad + 40 + r * (ch + gap)
        parts.append(_node(x, y, cw, ch))
        parts.append(_mono(x + 16, y + 24, f"{n + 1:02d}", size=11))
        parts.append(f'<line x1="{x + 16}" y1="{y + 33}" x2="{x + cw - 16}" y2="{y + 33}" '
                     f'stroke="{HAIRLINE}" stroke-width="1"/>')
        parts.append(_text_block(x + 16, y + 52, _wrap(label, 26), size=13, weight="500"))
        off = 52 + 17 * len(_wrap(label, 26))
        parts.append(_text_block(x + 16, y + off, _wrap(detail, 32), size=11, lh=14, fill=GREY))
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
    body_h = 36 + len(rows) * rh
    for n, hdr in enumerate([left, right]):
        x = pad + n * colw + (4 if n else 0)
        # the left column is the Glean path, so it carries the single blue emphasis
        parts.append(_node(x, y, colw - 4, body_h, emphasis=(n == 0)))
        parts.append(_text_block(x + 14, y + 24, _wrap(hdr, 28), size=13, weight="700"))
    y += 36
    for i, (a, b) in enumerate(rows):
        for n, cell in enumerate([a, b]):
            x = pad + n * colw + (4 if n else 0)
            parts.append(f'<line x1="{x + 14}" y1="{y}" x2="{x + colw - 18}" y2="{y}" '
                         f'stroke="{HAIRLINE}" stroke-width="1"/>')
            parts.append(_text_block(x + 14, y + 24, _wrap(cell, 34), size=11, lh=15))
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
        parts.append(_node(x, y, cw, ch))
        parts.append(_mono(x + 16, y + 26, f"{n + 1:02d}", size=12))
        parts.append(_text_block(x + 48, y + 26, _wrap(label, 28), size=12, weight="500", lh=15))
        off = 26 + 15 * len(_wrap(label, 28)) + 4
        parts.append(_text_block(x + 48, y + off, _wrap(detail, 34), size=11, lh=14, fill=GREY))
    parts.append("</svg>")
    return "\n".join(parts)
