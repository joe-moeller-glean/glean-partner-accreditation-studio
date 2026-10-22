import json, pathlib

BASE = pathlib.Path("learning/modules/AGT-101/assets")
alt = json.loads((BASE / "alt-text.json").read_text())["assets"]

CREATED = "2026-09-14"
LICENSE = "Glean internal - generated for this module, no third-party rights"

assets = []

assets.append({
    "asset_id": "AGT-101-A01",
    "path": "assets/hero-flow.svg",
    "type": "svg_render",
    "purpose": "Decorative ribbon behind the hero band in the brand indigo and sunset direction over an oatmeal corner wash. Carries no information.",
    "band_id": "BAND-01",
    "license": LICENSE,
    "created": CREATED,
    "decorative": True,
    "alt": "",
    "claim_ids": [],
})

assets.append({
    "asset_id": "AGT-101-A02",
    "path": "assets/agent-anatomy.svg",
    "type": "svg_diagram",
    "purpose": "The five building blocks of a Glean Agent. Goal and instructions governs from the top; knowledge and context feeds from the left; tools and actions from the right; execution runs in the centre in Auto or Workflow mode; output and memory returns results at the bottom.",
    "band_id": "BAND-04",
    "license": LICENSE,
    "created": CREATED,
    "decorative": False,
    "alt": alt["agent-anatomy.svg"]["alt"],
    "claim_ids": ["K-07", "K-08", "K-09", "K-10", "K-11", "K-16"],
})

assets.append({
    "asset_id": "AGT-101-A03",
    "path": "assets/badge.svg",
    "type": "svg_mark",
    "purpose": "Generic module completion mark. Deliberately not the Glean logo, which has no approved SVG in this repository.",
    "band_id": "BAND-12",
    "license": LICENSE,
    "created": CREATED,
    "decorative": False,
    "alt": alt["badge.svg"]["alt"],
    "claim_ids": [],
})

for i, p in enumerate(sorted((BASE / "icons").glob("*.svg")), start=1):
    assets.append({
        "asset_id": "AGT-101-I%02d" % i,
        "path": "assets/icons/" + p.name,
        "type": "svg_icon",
        "purpose": "Hairline line icon, 24px grid, 1.75 stroke. Always paired with a visible text label; never the sole carrier of meaning.",
        "band_id": "shared",
        "license": LICENSE,
        "created": CREATED,
        "decorative": True,
        "alt": "",
        "claim_ids": [],
    })

assets.append({
    "asset_id": "AGT-101-LOGO",
    "path": "assets/brand/glean-wordmark-electric-blue.svg",
    "type": "brand_logo",
    "purpose": "Approved Glean wordmark in the masthead. Placed unmodified.",
    "band_id": None,
    "license": "Glean trademark - use per brand guidelines",
    "created": "2026-09-25",
    "decorative": False,
    "alt": "Glean",
    "claim_ids": [],
})

manifest = {
    "module_id": "AGT-101",
    "design_system": "scroll-canvas-v1",
    "generation": "deterministic local SVG, no network, no third-party assets",
    "assets": assets,
}
(BASE / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
print("manifest assets:", len(assets))
missing = [a["path"] for a in assets if not (pathlib.Path("learning/modules/AGT-101") / a["path"]).is_file()]
print("missing files:", missing or "none")
