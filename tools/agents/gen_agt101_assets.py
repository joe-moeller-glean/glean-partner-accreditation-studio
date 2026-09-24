import json, pathlib, re

BASE = pathlib.Path("modules/AGT-101/assets")
(BASE / "icons").mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------- line icons
# 24x24 grid, 1.5 stroke, currentColor, no fill. Hairline visual language.
ICONS = {
 "define":  '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
 "layers":  '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
 "branch":  '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="6" cy="18" r="2"/><path d="M6 8v8M8 18h8M6 8a10 10 0 0 0 10 8"/>',
 "bolt":    '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>',
 "shield":  '<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
 "target":  '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
 "book":    '<path d="M4 5v14h16V5"/><path d="M4 5a3 3 0 0 1 3-3h13v17H7a3 3 0 0 0-3 3"/>',
 "tool":    '<path d="M14 7a4 4 0 1 0 4 4l3 3-3 3-3-3a4 4 0 0 1-4-4"/><path d="M11 13L4 20"/>',
 "play":    '<circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4V8z"/>',
 "memory":  '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
 "clock":   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
 "chat":    '<path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1-5a8 8 0 1 1 17-6z"/>',
 "form":    '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
 "doc":     '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/>',
 "check":   '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
 "cycle":   '<path d="M4 12a8 8 0 0 1 13-6l2 2"/><path d="M20 12a8 8 0 0 1-13 6l-2-2"/><path d="M19 3v5h-5M5 21v-5h5"/>',
 "flag":    '<path d="M5 21V4h9l-1 3h6l-2 5 2 5h-8l1-3H5"/>',
 "scale":   '<path d="M12 4v16M6 8h12"/><path d="M6 8l-3 6h6l-3-6zM18 8l-3 6h6l-3-6z"/><path d="M8 20h8"/>',
}

for name, body in ICONS.items():
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" '
        f'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
        f'stroke-linejoin="round" role="img" aria-hidden="true">'
        f'<title>{name} icon</title>{body}</svg>'
    )
    (BASE / "icons" / f"{name}.svg").write_text(svg + "\n")

# ---------------------------------------------------------------- hero render
# Fluid gradient band, brand blues only, decorative.
hero = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 380" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
  <title>Decorative gradient ribbon</title>
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1017B1"/>
      <stop offset=".45" stop-color="#343CED"/>
      <stop offset="1" stop-color="#F6F3EB"/>
    </linearGradient>
    <linearGradient id="g2" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#343CED" stop-opacity=".85"/>
      <stop offset="1" stop-color="#F6F3EB" stop-opacity=".2"/>
    </linearGradient>
    <linearGradient id="g3" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#F6F3EB" stop-opacity=".65"/>
      <stop offset="1" stop-color="#343CED" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1120" height="380" fill="#F6F3EB"/>
  <path d="M-40 250 C 200 90, 380 330, 620 190 S 940 40, 1160 150 L 1160 380 L -40 380 Z" fill="url(#g1)"/>
  <path d="M-40 300 C 240 170, 420 360, 660 250 S 980 130, 1160 220 L 1160 380 L -40 380 Z" fill="url(#g2)"/>
  <path d="M-40 210 C 180 120, 400 260, 600 170" fill="none" stroke="url(#g3)" stroke-width="2"/>
  <path d="M-40 235 C 190 145, 410 285, 610 195" fill="none" stroke="url(#g3)" stroke-width="1"/>
</svg>
'''
(BASE / "hero-flow.svg").write_text(hero)

# ---------------------------------------------------------------- anatomy diagram
# Meaning-bearing: gets full alt text + on-page text equivalent.
anatomy = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 460" role="img" aria-labelledby="anatomy-title anatomy-desc">
  <title id="anatomy-title">The five building blocks of a Glean Agent</title>
  <desc id="anatomy-desc">A stacked diagram. Goal and instructions sits at the top and governs the agent. Knowledge and context feeds in from the left. Tools and actions feed in from the right. Execution sits in the centre and runs the work in either Auto mode or Workflow mode. Output and memory sits at the bottom and returns results while retaining context during the run.</desc>
  <g fill="none" stroke="#C7C7AB" stroke-width="1">
    <rect x="140" y="20" width="240" height="64" rx="8"/>
    <rect x="20" y="150" width="170" height="64" rx="8"/>
    <rect x="330" y="150" width="170" height="64" rx="8"/>
    <rect x="140" y="196" width="240" height="84" rx="8" stroke="#000000"/>
    <rect x="140" y="370" width="240" height="64" rx="8"/>
  </g>
  <g stroke="#C7C7AB" stroke-width="1" fill="none" stroke-dasharray="3 3">
    <path d="M260 84 L260 196"/>
    <path d="M190 182 L260 182"/>
    <path d="M330 182 L260 182"/>
    <path d="M260 280 L260 370"/>
  </g>
  <g fill="#000000" font-family="SFMono-Regular,Menlo,Consolas,monospace" font-size="11">
    <text x="156" y="42">01</text>
    <text x="36" y="172">02</text>
    <text x="346" y="172">03</text>
    <text x="156" y="222">04</text>
    <text x="156" y="392">05</text>
  </g>
  <g fill="#000000" font-family="DM Sans,Arial,sans-serif" font-size="14" font-weight="500">
    <text x="156" y="64">Goal and instructions</text>
    <text x="36" y="194">Knowledge and context</text>
    <text x="346" y="194">Tools and actions</text>
    <text x="156" y="244">Execution</text>
    <text x="156" y="414">Output and memory</text>
  </g>
  <g fill="#3A3A3A" font-family="DM Sans,Arial,sans-serif" font-size="11">
    <text x="156" y="264">Auto mode or Workflow mode</text>
  </g>
</svg>
'''
(BASE / "agent-anatomy.svg").write_text(anatomy)

# ---------------------------------------------------------------- badge
badge = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-labelledby="badge-title">
  <title id="badge-title">Glean Agents Foundations completion mark</title>
  <circle cx="60" cy="60" r="52" fill="none" stroke="#C7C7AB"/>
  <circle cx="60" cy="60" r="44" fill="none" stroke="#343CED" stroke-width="2"/>
  <path d="M46 61l10 10 20-22" fill="none" stroke="#343CED" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="60" y="96" text-anchor="middle" fill="#3A3A3A" font-family="SFMono-Regular,Menlo,monospace" font-size="9">AGT-101</text>
</svg>
'''
(BASE / "badge.svg").write_text(badge)

# ---------------------------------------------------------------- alt text map
alt = {
    "module_id": "AGT-101",
    "assets": {
        "hero-flow.svg": {
            "role": "decorative", "alt": "",
            "note": "Purely aesthetic gradient ribbon. aria-hidden, conveys no information."
        },
        "agent-anatomy.svg": {
            "role": "informative",
            "alt": "Diagram of the five building blocks of a Glean Agent: goal and instructions at the top, knowledge and context on the left, tools and actions on the right, execution in the centre running in Auto mode or Workflow mode, and output and memory at the bottom.",
            "note": "Meaning-bearing. Also duplicated as an interactive text list, so the diagram is never the only route to the content."
        },
        "badge.svg": {
            "role": "informative",
            "alt": "Glean Agents Foundations completion mark for module AGT-101.",
            "note": "Not the Glean logo. Generic completion mark pending an approved brand asset."
        },
        "icons/*.svg": {
            "role": "decorative", "alt": "",
            "note": "All line icons are aria-hidden and always paired with a visible text label."
        }
    }
}
(BASE / "alt-text.json").write_text(json.dumps(alt, indent=2) + "\n")

manifest = {
    "module_id": "AGT-101",
    "generated": "deterministic, no network",
    "assets": sorted(str(p.relative_to(BASE)) for p in BASE.rglob("*.svg")),
}
(BASE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")

print("icons:", len(ICONS))
print("svg assets:", len(manifest["assets"]))
for f in BASE.rglob("*.svg"):
    t = f.read_text()
    assert "<title" in t, f"missing title: {f}"
    assert "http://www.w3.org/2000/svg" in t, f"missing ns: {f}"
    for bad in ("http://", "https://"):
        for m in re.finditer(bad, t):
            seg = t[m.start():m.start()+40]
            assert "w3.org/2000/svg" in seg, f"external ref in {f}: {seg}"
print("all SVGs have titles, correct namespace, and no external references")
