#!/usr/bin/env python3
"""Generate OPS-107 and OPS-108 from specs_support.py and sources_support.py.

Reuses the builders in generate.py, but binds them to the support source ledger
and writes support-specific metadata. Does not touch any other module.

Usage:
  python3 tools/agents/build_support.py generate
  python3 tools/agents/build_support.py package
"""
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE))

import generate as G  # noqa: E402
import sources_support as SD  # noqa: E402
import specs_support  # noqa: E402

VERSION = "1.0.0"
TODAY = "2026-09-26"
DESIGN_SYSTEM = "paged-v1"
SPECS = specs_support.SPECS
MODULES = ROOT / "learning" / "modules"

# Bind the shared builders to this module family's ledger and date.
G.SD = SD
G.TODAY = TODAY


def ylist(items):
    return "[" + ", ".join(json.dumps(i) for i in items) + "]"


def build_meta(spec, dest):
    meta = {
        "module_id": spec["id"],
        "title": spec["title"],
        "version": VERSION,
        "launch": "index.html",
        "mastery_score": G.MASTERY,
        "scorm_version": "1.2",
        "design_system": DESIGN_SYSTEM,
        "accreditation_id": None,
        "level": spec["level"],
        "target_hours": spec["hours"],
        "assessment_type": spec["assessment_type"],
    }
    G.jdump(dest / "module.json", meta)

    y = [
        f"module_id: {spec['id']}",
        f"title: {json.dumps(spec['title'])}",
        f"design_system: {DESIGN_SYSTEM}",
        f"learning_path: {json.dumps(spec['path'])}",
        "request_type: single",
        f"audience: {ylist(spec['audience'])}",
        f"level: {spec['level']}",
        "learning_outcomes:",
    ]
    for o in spec["objectives"]:
        y.append(f"  - {json.dumps(o['text'])}")
    y += [
        f"prerequisites: {ylist(spec['prereqs'])}",
        f"target_hours: {spec['hours']}",
        f"mastery_score: {G.MASTERY}",
        f"assessment_type: {spec['assessment_type']}",
        f"wave: {spec['wave']}",
        "accreditation: null  # standalone; candidate elective for accred-support-adoption",
        "related_modules: [OPS-103, OPS-104]",
        "source_owners: [Glean Support, Glean Community team]",
        "roadmap_status: new - not yet in the Module Tracker",
        "publish_mode: manual_review",
        "open_questions:",
    ]
    for q in SD.OPEN_QUESTIONS:
        y.append(f"  - id: {q['id']}")
        y.append(f"    question: {json.dumps(q['question'])}")
        y.append(f"    handling: {json.dumps(q['handling'])}")
    (dest / "module.yaml").write_text("\n".join(y) + "\n")

    G.jdump(dest / "qa" / "waivers.json", {"waivers": []})
    (dest / "CHANGELOG.md").write_text(
        f"# {spec['id']} {spec['title']}\n\n## {VERSION} - {TODAY}\n\n"
        f"- First build from Glean Support Center and Gleaniverse research.\n"
        f"- Design system: `{DESIGN_SYSTEM}`.\n"
        f"- {len(spec['screens'])} screens across "
        f"{len(set(s['archetype'] for s in spec['screens']))} distinct archetypes.\n"
        f"- {len(spec['claims'])} claims traced to {len(SD.sources_for(spec['claims']))} vetted sources.\n"
        f"- {len(spec['quiz'])} assessment items; keys separated into `assessment/key.json`.\n"
        f"- {len(spec.get('assets', []))} authored SVG diagrams with alt text and claim mapping.\n")


def build_conflicts(spec, dest):
    lines = [f"# {spec['id']} - conflicts, exclusions, and open questions", "",
             "## Excluded sources", "",
             "- `[External] Glean Support for Customers` (2024-10-25): predates the 2026 support "
             "migration to Gleaniverse. Named escalation contacts are volatile. Not used.",
             "- `Discuss Intercom Escalation Path for Partners` meeting notes (2026-09-25): working "
             "notes, not published policy. Not used for learner-facing claims.", "",
             "## Authority ruling", "",
             "Current Glean Docs and the Customer Support SLA are tier 1 and win any conflict. "
             "Internal field FAQs (tier 2) are used only where they add detail that tier 1 does not contradict.", "",
             "## Open SME questions", ""]
    for q in SD.OPEN_QUESTIONS:
        lines += [f"### {q['id']}", "", f"- Question: {q['question']}",
                  f"- Evidence: {q['evidence']}", f"- Handling: {q['handling']}", ""]
    (dest / "research" / "conflicts.md").write_text("\n".join(lines))


def add_design_system(dest):
    p = dest / "design" / "experience.yaml"
    t = p.read_text()
    if "design_system:" not in t:
        lines = t.splitlines()
        lines.insert(1, f"design_system: {DESIGN_SYSTEM}")
        p.write_text("\n".join(lines) + "\n")


def generate_one(spec):
    dest = MODULES / spec["id"]
    if dest.exists():
        import shutil
        shutil.rmtree(dest)
    for d in G.DIRS:
        (dest / d).mkdir(parents=True, exist_ok=True)
    build_meta(spec, dest)
    G.build_research(spec, dest)
    build_conflicts(spec, dest)
    G.build_design(spec, dest)
    add_design_system(dest)
    assets_by_id = G.build_assets(spec, dest)
    G.build_content(spec, dest)
    G.build_assessment(spec, dest)
    G.build_runtime(spec, dest, assets_by_id)
    return dest


def package_all():
    import package as P
    for spec in SPECS:
        mdir = MODULES / spec["id"]
        zpath, digest = P.package(mdir)
        v = subprocess.run([sys.executable, str(P.VALIDATE), str(zpath)], capture_output=True, text=True)
        state = v.stdout.strip().splitlines()[-1] if v.stdout.strip() else "NO OUTPUT"
        print(f"{spec['id']}  {state}  {digest}  {zpath.name}")
        if state != "PASS":
            print(v.stdout, v.stderr)


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "generate"
    if cmd == "generate":
        for spec in SPECS:
            print("generated", generate_one(spec).relative_to(ROOT))
    elif cmd == "package":
        package_all()
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
