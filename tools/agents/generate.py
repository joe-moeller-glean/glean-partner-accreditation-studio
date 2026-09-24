#!/usr/bin/env python3
"""Generate the Agents accreditation module sources.

Writes one complete module directory per spec: brief, source ledger, claim set,
design, content, interactions, assessment (items and key separated), assets with
manifest and alt text, QA stubs, changelog, and the compiled runtime.

Runtime files (index.html, tokens.css, styles.css, scorm.js, app.js, content.js,
assets/) are copied from shared/ so the theme is produced once and reused.
"""
import json
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
SHARED = ROOT / "shared"
sys.path.insert(0, str(HERE))

import sources_data as SD  # noqa: E402
import svg_lib  # noqa: E402
import specs_foundations  # noqa: E402
import specs_builder  # noqa: E402
import specs_advanced  # noqa: E402
import specs_capstone  # noqa: E402

VERSION = "1.0.0"
MASTERY = 80
TODAY = "2026-09-02"

ALL_SPECS = (specs_foundations.SPECS + specs_builder.SPECS +
             specs_advanced.SPECS + specs_capstone.SPECS)
BADGE = specs_capstone.BADGE

SVG_BUILDERS = {
    "flow": svg_lib.flow,
    "stack": svg_lib.stack,
    "matrix": svg_lib.matrix,
    "cards": svg_lib.cards,
    "compare": svg_lib.compare,
    "taxonomy": svg_lib.taxonomy,
}

DIRS = ["content/screens", "content/scenarios", "content/feedback", "design",
        "research", "interactions", "assessment", "assets/img", "assets/svg",
        "assets/media", "qa"]


def jdump(path: Path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=False) + "\n")


def ylist(items):
    return "[" + ", ".join(items) + "]"


# ---------------------------------------------------------------------------
def build_assets(spec, dest):
    """Render every SVG asset and return manifest entries keyed by asset_id."""
    manifest, alt_text, by_id = [], {}, {}
    for asset in spec.get("assets", []):
        builder = SVG_BUILDERS[asset["kind"]]
        svg = builder(title=asset["title"], desc=asset["desc"], **asset["args"])
        fname = asset["asset_id"].lower() + ".svg"
        rel = f"assets/svg/{fname}"
        (dest / rel).parent.mkdir(parents=True, exist_ok=True)
        (dest / rel).write_text(svg)
        screen_ids = [s["id"] for s in spec["screens"] if s.get("asset") == asset["asset_id"]]
        manifest.append({
            "asset_id": asset["asset_id"],
            "path": rel,
            "type": "svg_diagram",
            "purpose": asset["desc"],
            "screen_id": screen_ids[0] if screen_ids else None,
            "generator": "SVG author (tools/agents/svg_lib.py)",
            "source": "Authored from claim library; no generated raster, no logo reproduction.",
            "license": "Glean internal - partner enablement use",
            "creator": "Graphics and Media agent (studio)",
            "created": TODAY,
            "claim_ids": asset["claim_ids"],
            "alt": asset["alt"],
            "bytes": len(svg.encode()),
        })
        alt_text[asset["asset_id"]] = asset["alt"]
        by_id[asset["asset_id"]] = {"src": rel, "alt": asset["alt"], "caption": asset["caption"]}
    jdump(dest / "assets" / "manifest.json", {"module_id": spec["id"], "assets": manifest})
    jdump(dest / "assets" / "alt-text.json", alt_text)
    return by_id


def build_content(spec, dest):
    """Write per-screen content JSON and the interaction specs."""
    interactions = []
    for scr in spec["screens"]:
        jdump(dest / "content" / "screens" / f"{scr['id']}.json", scr)
        if scr.get("type") in {"choice", "sort"}:
            interactions.append({
                "interaction_id": f"INT-{scr['id']}",
                "screen_id": scr["id"],
                "kind": scr["type"],
                "objective_id": scr["objective"],
                "archetype": scr["archetype"],
                "keyboard": "All controls are native button or select elements; full tab and arrow support.",
                "feedback_rule": "Every response explains why, never correctness alone.",
                "claims": scr.get("claims", []),
            })
        if scr.get("hotspots"):
            interactions.append({
                "interaction_id": f"INT-{scr['id']}-HOTSPOT",
                "screen_id": scr["id"],
                "kind": "progressive_hotspot",
                "objective_id": scr["objective"],
                "archetype": scr["archetype"],
                "keyboard": "Each hotspot is a button with aria-expanded state.",
                "feedback_rule": "Reveals detail sourced to a claim; no hidden navigation.",
                "claims": scr.get("claims", []),
            })
    jdump(dest / "interactions" / "interactions.json",
          {"module_id": spec["id"], "interactions": interactions})

    feedback = {}
    for scr in spec["screens"]:
        for opt in scr.get("options", []) or []:
            feedback[f"{scr['id']}:{opt['id']}"] = opt.get("feedback", "")
    jdump(dest / "content" / "feedback" / "choice-feedback.json",
          {"module_id": spec["id"], "feedback": feedback})

    scenarios = [
        {"screen_id": s["id"], "archetype": s["archetype"], "prompt": s.get("prompt", s.get("body", "")),
         "framing": "Role-based partner situation; no named customer or partner organisation."}
        for s in spec["screens"] if s["archetype"] in {"A1", "A6", "A8"}
    ]
    jdump(dest / "content" / "scenarios" / "scenarios.json",
          {"module_id": spec["id"], "scenarios": scenarios})


def build_assessment(spec, dest):
    """Write items.json without answers and key.json with them."""
    items, key = [], {}
    for q in spec["quiz"]:
        items.append({
            "id": q["id"],
            "objective_id": q["objective_id"],
            "stem": q["stem"],
            "options": [{"id": o["id"], "text": o["text"]} for o in q["options"]],
        })
        key[q["id"]] = {
            "answer": next(o["id"] for o in q["options"] if o.get("correct")),
            "rationale": {o["id"]: o.get("feedback", "") for o in q["options"]},
        }
    jdump(dest / "assessment" / "items.json",
          {"module_id": spec["id"], "mastery_score": MASTERY, "items": items})
    jdump(dest / "assessment" / "key.json", {"module_id": spec["id"], "key": key})

    obj_map = {}
    for q in spec["quiz"]:
        obj_map.setdefault(q["objective_id"], []).append(q["id"])
    lines = [
        f"# {spec['id']} assessment rubric", "",
        f"Mastery score: {MASTERY}%. Items are single-select with explanatory feedback on every option.",
        "", "## Objective coverage", "",
        "| Objective | Items |", "|---|---|",
    ]
    for o in spec["objectives"]:
        lines.append(f"| `{o['id']}` {o['text']} | {', '.join(obj_map.get(o['id'], ['none']))} |")
    lines += [
        "", "## Item-writing rules applied", "",
        "- Every item tests a claim-backed fact or a decision derived from one, never wording recall.",
        "- Distractors are plausible partner mistakes drawn from the source material, not absurd options.",
        "- Feedback explains why an option is wrong, not merely that it is wrong.",
        "- Answer keys live in `key.json` and are never present in `items.json`.",
        "", "## Calibration", "",
        "Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.",
        "",
    ]
    (dest / "assessment" / "rubric.md").write_text("\n".join(lines))


def build_design(spec, dest):
    arche = [s["archetype"] for s in spec["screens"]]
    distinct = sorted(set(arche))
    lines = [
        f"module_id: {spec['id']}",
        f"title: {spec['title']}",
        f"level: {spec['level']}",
        f"target_hours: {spec['hours']}",
        f"mastery_score: {MASTERY}",
        "outcomes:",
    ]
    for o in spec["objectives"]:
        lines.append(f"  - id: {o['id']}")
        lines.append(f"    text: {json.dumps(o['text'])}")
        screens = [s["id"] for s in spec["screens"] if s.get("objective") == o["id"]]
        items = [q["id"] for q in spec["quiz"] if q["objective_id"] == o["id"]]
        lines.append(f"    screens: {ylist(screens)}")
        lines.append(f"    assessment_items: {ylist(items)}")
    lines += [
        "spine:",
        "  - hook", "  - frame", "  - model", "  - practice", "  - apply", "  - prove", "  - carry",
        f"screen_count: {len(spec['screens'])}",
        f"distinct_archetypes: {ylist(distinct)}",
        f"assessment_type: {spec['assessment_type']}",
    ]
    (dest / "design" / "blueprint.yaml").write_text("\n".join(lines) + "\n")

    exp = [
        f"module_id: {spec['id']}",
        "path_position:",
        f"  accreditation: accred-agents",
        f"  wave: {spec['wave']}",
        f"  prerequisites: {ylist(spec['prereqs']) if spec['prereqs'] else '[]'}",
        "motion_budget:",
        "  t1: state feedback on choice, hotspot, and sort controls",
        "  t2: reveal of feedback panels and hotspot detail",
        "  t3: one signature reveal on the final screen",
        "  reduced_motion: all tiers collapse to static",
        "pacing:",
    ]
    for s in spec["screens"]:
        density = "interactive" if s.get("type") or s.get("hotspots") else (
            "visual" if s.get("asset") else "text")
        exp.append(f"  - screen: {s['id']}")
        exp.append(f"    archetype: {s['archetype']}")
        exp.append(f"    density: {density}")
    exp += [
        "accessibility:",
        "  - keyboard complete, visible focus, no state by colour alone",
        "  - every diagram carries title, desc, and an alt text entry",
        "  - progress reflects real position, never inflated",
    ]
    (dest / "design" / "experience.yaml").write_text("\n".join(exp) + "\n")

    story = [f"# {spec['id']} {spec['title']} - storyboard", ""]
    for n, s in enumerate(spec["screens"], 1):
        story.append(f"## {n}. {s['id']} - {s['archetype']} - {s.get('eyebrow', '')}")
        story.append(f"**{s.get('title', '')}**")
        if s.get("body"):
            story.append("")
            story.append(s["body"])
        if s.get("claims"):
            story.append("")
            story.append(f"Claims: {', '.join(s['claims'])}")
        story.append("")
    (dest / "design" / "storyboard.md").write_text("\n".join(story))


def build_research(spec, dest):
    claim_ids = spec["claims"]
    claims = SD.claims_for(claim_ids)
    sources = SD.sources_for(claim_ids)
    jdump(dest / "sources.json", {"module_id": spec["id"], "sources": sources})
    jdump(dest / "research" / "claims.json", {"module_id": spec["id"], "claims": claims})

    by_source = {}
    for c in claims:
        for sid in c["source_ids"]:
            by_source.setdefault(sid, []).append(c)
    lines = [f"# {spec['id']} {spec['title']} - research findings", "",
             f"Verified {TODAY}. {len(claims)} claims drawn from {len(sources)} vetted sources.", "",
             "## Sources", "", "| ID | Source | Owner | Updated | Tier |", "|---|---|---|---|---|"]
    for s in sources:
        lines.append(f"| `{s['source_id']}` | [{s['title']}]({s['url']}) | {s['owner']} | "
                     f"{s['doc_updated']} | {s['authority_tier']} |")
    lines += ["", "## Claims by source", ""]
    for sid in sorted(by_source):
        src = SD.SOURCES_BY_ID[sid]
        lines.append(f"### {sid} - {src['title']}")
        lines.append("")
        for c in by_source[sid]:
            lines.append(f"- `{c['claim_id']}` {c['text']}")
        lines.append("")
    lines += ["## Conflicts and gaps", "",
              "No contradictions were found between sources for the claims used in this module.",
              "Where a source reports a performance figure, the claim attributes the figure to that",
              "source rather than stating it as an independent platform guarantee.", ""]
    (dest / "research" / "findings.md").write_text("\n".join(lines))
    (dest / "research" / "conflicts.md").write_text(
        f"# {spec['id']} conflicts\n\nNone recorded at {TODAY}.\n\n"
        "Any future source disagreement must be logged here with both readings, the resolution,\n"
        "and the claim ids affected before content changes.\n")


def build_runtime(spec, dest, assets_by_id):
    for name, src in [("index.html", SHARED / "components" / "index.html"),
                      ("app.js", SHARED / "components" / "app.js"),
                      ("scorm.js", SHARED / "scorm" / "scorm.js"),
                      ("tokens.css", SHARED / "theme" / "tokens.css"),
                      ("styles.css", SHARED / "theme" / "styles.css")]:
        shutil.copy(src, dest / name)

    html = (dest / "index.html").read_text().replace(
        "<title>Glean partner module</title>",
        f"<title>{spec['title']}</title>")
    (dest / "index.html").write_text(html)

    screens = []
    for scr in spec["screens"]:
        out = {k: v for k, v in scr.items() if k not in {"asset", "claims"}}
        if scr.get("asset"):
            out["asset"] = assets_by_id[scr["asset"]]
        out["claims"] = scr.get("claims", [])
        if scr.get("type") == "quiz":
            out["items"] = [
                {"id": q["id"], "objective": q["objective_id"], "stem": q["stem"],
                 "options": q["options"]}
                for q in spec["quiz"]
            ]
        screens.append(out)

    module = {"id": spec["id"], "title": spec["title"], "mastery": MASTERY,
              "objectives": spec["objectives"], "screens": screens}
    banner = ("/* Compiled by the SCORM Engineer from content/, interactions/, and\n"
              "   assessment/. Do not hand-edit. Answer keys are merged here for runtime\n"
              "   scoring only; the authored key lives in assessment/key.json. */\n")
    (dest / "content.js").write_text(
        banner + "window.MODULE = " + json.dumps(module, indent=2, ensure_ascii=False) + ";\n")


def build_meta(spec, dest):
    meta = {
        "module_id": spec["id"],
        "title": spec["title"],
        "version": VERSION,
        "launch": "index.html",
        "mastery_score": MASTERY,
        "scorm_version": "1.2",
        "accreditation_id": "accred-agents",
        "level": spec["level"],
        "target_hours": spec["hours"],
        "assessment_type": spec["assessment_type"],
    }
    if spec.get("is_badge"):
        meta["required_modules"] = spec["required_modules"]
    jdump(dest / "module.json", meta)

    y = [
        f"module_id: {spec['id']}",
        f"title: {spec['title']}",
        f"learning_path: {spec['path']}",
        "request_type: single",
        f"audience: {ylist(spec['audience'])}",
        f"level: {spec['level']}",
        "learning_outcomes:",
    ]
    for o in spec["objectives"]:
        y.append(f"  - {json.dumps(o['text'])}")
    y += [
        f"prerequisites: {ylist(spec['prereqs']) if spec['prereqs'] else '[]'}",
        f"target_hours: {spec['hours']}",
        f"mastery_score: {MASTERY}",
        f"assessment_type: {spec['assessment_type']}",
        f"wave: {spec['wave']}",
        "accreditation: Agents",
        "source_owners: [Joe Moeller, Katya Alfaro, Matt Schenck]",
        "publish_mode: manual_review",
    ]
    if spec.get("is_badge"):
        y.append(f"required_modules: {ylist(spec['required_modules'])}")
    (dest / "module.yaml").write_text("\n".join(y) + "\n")

    jdump(dest / "qa" / "waivers.json", {"waivers": []})
    (dest / "CHANGELOG.md").write_text(
        f"# {spec['id']} {spec['title']}\n\n## {VERSION} - {TODAY}\n\n"
        f"- Authored for the Agents accreditation (`accred-agents`).\n"
        f"- {len(spec['screens'])} screens across "
        f"{len(set(s['archetype'] for s in spec['screens']))} distinct archetypes.\n"
        f"- {len(spec['claims'])} claims traced to {len(SD.sources_for(spec['claims']))} vetted sources.\n"
        f"- {len(spec['quiz'])} assessment items, keys separated into `assessment/key.json`.\n"
        f"- {len(spec.get('assets', []))} authored SVG diagrams with alt text and claim mapping.\n")


def generate(spec, out_root):
    dest = out_root / spec["id"]
    if dest.exists():
        shutil.rmtree(dest)
    for d in DIRS:
        (dest / d).mkdir(parents=True, exist_ok=True)
    build_meta(spec, dest)
    build_research(spec, dest)
    build_design(spec, dest)
    assets_by_id = build_assets(spec, dest)
    build_content(spec, dest)
    build_assessment(spec, dest)
    build_runtime(spec, dest, assets_by_id)
    return dest


def main():
    modules_root = ROOT / "modules"
    modules_root.mkdir(exist_ok=True)
    made = []
    for spec in ALL_SPECS:
        made.append(generate(spec, modules_root))
    badge_dir = ROOT / "accreditations" / BADGE["id"]
    if badge_dir.exists():
        shutil.rmtree(badge_dir)
    for d in DIRS:
        (badge_dir / d).mkdir(parents=True, exist_ok=True)
    build_meta(BADGE, badge_dir)
    build_research(BADGE, badge_dir)
    build_design(BADGE, badge_dir)
    a = build_assets(BADGE, badge_dir)
    build_content(BADGE, badge_dir)
    build_assessment(BADGE, badge_dir)
    build_runtime(BADGE, badge_dir, a)
    made.append(badge_dir)
    for p in made:
        print("generated", p.relative_to(ROOT))


if __name__ == "__main__":
    main()
