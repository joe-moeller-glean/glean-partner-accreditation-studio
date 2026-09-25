import json, pathlib, shutil, re

M = pathlib.Path("learning/modules/AGT-101")

bands = json.loads((M / "content/bands.json").read_text())["bands"]
ix = json.loads((M / "interactions/interactions.json").read_text())["interactions"]
items = json.loads((M / "assessment/items.json").read_text())
key = json.loads((M / "assessment/key.json").read_text())["key"]
sources = json.loads((M / "sources.json").read_text())["sources"]
claims = json.loads((M / "research/claims.json").read_text())["claims"]
alt = json.loads((M / "assets/alt-text.json").read_text())["assets"]

# inline the icon set so no extra HTTP requests and no missing-file risk
icons = {}
for p in sorted((M / "assets/icons").glob("*.svg")):
    svg = p.read_text().strip()
    svg = re.sub(r'<title>.*?</title>', '', svg)
    icons[p.stem] = svg

# strip claim ids from learner-facing payload: they are provenance, not content
def clean(o):
    if isinstance(o, dict):
        return {k: clean(v) for k, v in o.items() if k != "claims"}
    if isinstance(o, list):
        return [clean(v) for v in o]
    return o

payload = {
    "moduleId": "AGT-101",
    "bands": clean(bands),
    "interactions": clean(ix),
    "quiz": {
        "mastery": items["mastery_score"],
        "items": clean(items["items"]),
        "key": key,
    },
    "icons": icons,
    "anatomyAlt": alt["agent-anatomy.svg"]["alt"],
    "sourceCount": len(sources),
    "claimCount": len(claims),
}

out = "/* Generated from content/, interactions/, assessment/. Do not edit by hand. */\n"
out += "window.AGT101 = " + json.dumps(payload, indent=1, ensure_ascii=False) + ";\n"
(M / "content.js").write_text(out)

# reuse the proven SCORM adapter unchanged
shutil.copy("learning/modules/FND-104/scorm.js", M / "scorm.js")

# theme: shared tokens + shared scroll-canvas system, module-local copies
shutil.copy("shared/theme/scroll-canvas.css", M / "styles.css")

tokens = """/* AGT-101 uses the token block defined in styles.css (scroll-canvas-v1).
   This file exists for pipeline parity with earlier modules and pins the
   module-level overrides only. */
:root{
  --module-id:"AGT-101";
}

/* hero render + diagram sizing (module-specific, not part of the design system) */
.hero-render{
  margin-top:var(--s5);
  border:var(--hair) solid var(--line);
  border-radius:var(--radius);
  overflow:hidden;
  line-height:0;
}
.hero-render__img{width:100%;height:auto;display:block}

.hotspot__img{
  width:100%;height:auto;display:block;
  border:var(--hair) solid var(--line);
  border-radius:var(--radius);
  background:var(--white);
  margin-bottom:var(--s3);
  padding:var(--s2);
}

.sorter__fs{border:none;margin:0;padding:0;min-width:0}
.rail__list{display:flex;flex-direction:column;gap:4px}
.num-card__h{margin:0;font-size:1rem;font-weight:500}
.quiz__review{
  margin-top:var(--s4);padding-top:var(--s4);
  border-top:var(--hair) solid var(--line-invert);
  text-align:left;
}
"""
(M / "tokens.css").write_text(tokens)

print("content.js:", (M / "content.js").stat().st_size, "bytes")
print("icons inlined:", len(icons))
print("quiz items:", len(payload["quiz"]["items"]), "| key entries:", len(key))
print("claim ids leaked into content.js:", '"claims"' in (M / "content.js").read_text())
print("files:", sorted(p.name for p in M.iterdir() if p.is_file()))
