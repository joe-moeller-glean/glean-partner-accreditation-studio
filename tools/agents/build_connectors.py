#!/usr/bin/env python3
"""Build the Custom Connector accreditation modules.

Modules: CON-101 CON-201 CON-202 TEC-201 BLD-201 CON-203 CON-204 BLD-202 CON-301 ACC-107
Accreditation: accred-custom-connectors

Reuses the shared builders in generate.py and the shared paged-v1 runtime, bound
to the verified connector ledger (sources_connectors.py). Adds:
- spec validation that fails closed (claims, objectives, archetypes, answer
  positions, option prefixes, SVG text fit)
- deterministic rotation of the correct option so position carries no signal
- an auto-built References screen that maps each on-screen claim id to its source
- per-item claim ids in assessment/items.json
- connector-specific metadata, conflicts, and design path

Usage:
  python3 tools/agents/build_connectors.py validate
  python3 tools/agents/build_connectors.py generate
  python3 tools/agents/build_connectors.py package
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE))

import generate as G  # noqa: E402
import sources_connectors as SD  # noqa: E402
import specs_connectors_a  # noqa: E402
import specs_connectors_b  # noqa: E402
import specs_connectors_c  # noqa: E402

VERSION = "1.0.0"
TODAY = "2026-09-27"
DESIGN_SYSTEM = "paged-v1"
ACCRED_ID = "accred-custom-connectors"
MODULES = ROOT / "learning" / "modules"
ORDER = ["CON-101", "CON-201", "CON-202", "TEC-201", "BLD-201",
         "CON-203", "CON-204", "BLD-202", "CON-301", "ACC-107"]

RAW_SPECS = specs_connectors_a.SPECS + specs_connectors_b.SPECS + specs_connectors_c.SPECS
BY_ID = {s["id"]: s for s in RAW_SPECS}

G.SD = SD
G.TODAY = TODAY

# Tracker modules that also count toward other accreditations.
ALSO_COUNTS = {
    "TEC-201": ["accred-solution-architect"],
    "BLD-201": ["accred-builder"],
    "BLD-202": ["accred-builder"],
}

# SVG text-fit limits derived from tools/agents/svg_lib.py geometry:
# (label_chars_per_line, label_max_lines, detail_chars_per_line, detail_max_lines)
FIT = {
    "flow": (38, 1, 56, 1),
    "stack": (40, 1, 54, 1),
    "cards": (26, 2, 32, 4),
    "taxonomy": (28, 2, 34, 3),
}
COMPARE_CELL = (34, 3)
TITLE_CHARS = 50


# ---------------------------------------------------------------------------
def wrap_len(text, width):
    return len(G.svg_lib._wrap(text, width)) if text else 0


def spec_claims(spec):
    ids = []
    for s in spec["screens"]:
        ids += s.get("claims", [])
    for q in spec["quiz"]:
        ids += q.get("claims", [])
    for a in spec.get("assets", []):
        ids += a.get("claim_ids", [])
    out = []
    for c in ids:
        if c not in out:
            out.append(c)
    return out


def validate(spec):
    """Return a list of blocking findings for one spec."""
    E = []
    sid = spec["id"]
    objs = {o["id"] for o in spec["objectives"]}
    screens = spec["screens"]
    quiz = spec["quiz"]

    # claims resolve and are learner-facing
    try:
        SD.claims_for(spec_claims(spec))
        SD.sources_for(spec_claims(spec))
    except (KeyError, ValueError) as e:
        E.append(f"{sid}: {e}")

    # objectives map to screens and items
    for o in objs:
        if not any(s.get("objective") == o for s in screens):
            E.append(f"{sid}: objective {o} has no screen")
        if not any(q["objective_id"] == o for q in quiz):
            E.append(f"{sid}: objective {o} has no assessment item")
    for s in screens:
        if s.get("objective") not in objs:
            E.append(f"{sid}: screen {s['id']} objective {s.get('objective')} undefined")
    for q in quiz:
        if q["objective_id"] not in objs:
            E.append(f"{sid}: item {q['id']} objective undefined")
        if not q.get("claims"):
            E.append(f"{sid}: item {q['id']} carries no claim ids")

    # screen ids unique; one quiz; archetype variety and no triple runs
    ids = [s["id"] for s in screens]
    if len(ids) != len(set(ids)):
        E.append(f"{sid}: duplicate screen ids")
    if sum(1 for s in screens if s.get("type") == "quiz") != 1:
        E.append(f"{sid}: needs exactly one quiz screen")
    arche = [s["archetype"] for s in screens]
    if len(set(arche)) < 4:
        E.append(f"{sid}: fewer than 4 archetypes")
    for i in range(2, len(arche)):
        if arche[i] == arche[i - 1] == arche[i - 2]:
            E.append(f"{sid}: three consecutive {arche[i]} screens at {ids[i]}")

    # every choice/quiz option set has exactly one correct option, and feedback
    sets = [(s["id"], s["options"]) for s in screens if s.get("type") == "choice"]
    sets += [(q["id"], q["options"]) for q in quiz]
    for key, opts in sets:
        if sum(1 for o in opts if o.get("correct")) != 1:
            E.append(f"{sid}: {key} must have exactly one correct option")
        for o in opts:
            if not o.get("feedback"):
                E.append(f"{sid}: {key}:{o['id']} has no feedback")
            if re.search(r"\b(first|second|third|fourth|last) option\b|\boption [1-4]\b",
                         o.get("feedback", "") + o["text"], re.I):
                E.append(f"{sid}: {key}:{o['id']} refers to option position")

    # quiz size and 25-character prefix uniqueness (runtime harness selects by prefix)
    if len(quiz) < 8:
        E.append(f"{sid}: quiz has {len(quiz)} items (min 8)")
    all_opts = [o["text"] for q in quiz for o in q["options"]]
    for n, t in enumerate(all_opts):
        pre = t[:25]
        clash = [u for m, u in enumerate(all_opts) if m != n and pre in u]
        if clash:
            E.append(f"{sid}: option prefix {pre!r} also matches {clash[0][:40]!r}")

    # sort screens: every category used, every item has a why
    for s in screens:
        if s.get("type") == "sort":
            cats = set(s["categories"])
            used = {p["category"] for p in s["pairs"]}
            if used - cats:
                E.append(f"{sid}: {s['id']} uses undefined categories {used - cats}")
            for p in s["pairs"]:
                if not p.get("why"):
                    E.append(f"{sid}: {s['id']} pair without why")

    # svg fit
    for a in spec.get("assets", []):
        aid = a["asset_id"]
        if len(a["title"]) > TITLE_CHARS:
            E.append(f"{sid}: {aid} title over {TITLE_CHARS} chars")
        k = a["kind"]
        if k in FIT:
            lw, ll, dw, dl = FIT[k]
            key = "steps" if k == "flow" else ("layers" if k == "stack" else
                                               ("items" if k == "cards" else "groups"))
            for row in a["args"][key]:
                label, detail = row[0], row[1]
                if wrap_len(label, lw) > ll:
                    E.append(f"{sid}: {aid} label too long: {label!r}")
                if wrap_len(detail, dw) > dl:
                    E.append(f"{sid}: {aid} detail too long: {detail!r}")
        elif k == "compare":
            for row in a["args"]["rows"]:
                for cell in row:
                    if wrap_len(cell, COMPARE_CELL[0]) > COMPARE_CELL[1]:
                        E.append(f"{sid}: {aid} compare cell too long: {cell!r}")
        else:
            E.append(f"{sid}: {aid} uses unsupported kind {k}")
        if not any(s.get("asset") == aid for s in screens):
            E.append(f"{sid}: {aid} is not placed on any screen")

    # word budget (warning-level, reported as a finding to keep bodies tight)
    for s in screens:
        words = len((s.get("body") or "").split())
        if words > 130:
            E.append(f"{sid}: {s['id']} body is {words} words (max 130)")
    return E


# ---------------------------------------------------------------------------
def rotate(options, target):
    """Move the correct option to index `target`, keeping the others in order."""
    right = [o for o in options if o.get("correct")][0]
    rest = [o for o in options if not o.get("correct")]
    target = target % len(options)
    return rest[:target] + [right] + rest[target:]


def references_screen(spec, claim_ids):
    by_src = {}
    for cid in claim_ids:
        for s in SD.CLAIMS[cid]["source_ids"]:
            by_src.setdefault(s, []).append(cid)
    rows = []
    for s in sorted(by_src):
        src = SD.SOURCES_BY_ID[s]
        rows.append([src["title"], src["public_label"], ", ".join(sorted(by_src[s]))])
    return {
        "id": "SCR-REF", "archetype": "A11", "objective": spec["objectives"][0]["id"],
        "eyebrow": "Sources",
        "title": "Where every fact on these screens comes from",
        "body": ("Each screen lists claim ids such as " + sorted(claim_ids)[0] + ". This table maps each id to the "
                 "document it was verified against on " + SD.VERIFIED_ON + ". Current Glean "
                 "product and developer documentation is the authority for product behavior."),
        "table": {"caption": "Claim ids by source", "head": ["Source", "Where to find it", "Claim ids"],
                  "rows": rows},
        "claims": [],
    }


def prepare(raw):
    """Return a build-ready copy of a spec: rotated options, references, claims."""
    spec = json.loads(json.dumps(raw))
    for n, q in enumerate(spec["quiz"]):
        q["options"] = rotate(q["options"], (n * 3 + 1) % len(q["options"]))
    k = 0
    for s in spec["screens"]:
        if s.get("type") == "choice":
            s["options"] = rotate(s["options"], (k * 2 + 2) % len(s["options"]))
            k += 1
    spec["claims"] = spec_claims(spec)
    ref = references_screen(spec, spec["claims"])
    spec["screens"].insert(len(spec["screens"]) - 1, ref)
    return spec


def position_report(spec):
    pos = [next(i for i, o in enumerate(q["options"]) if o.get("correct")) for q in spec["quiz"]]
    pos += [next(i for i, o in enumerate(s["options"]) if o.get("correct"))
            for s in spec["screens"] if s.get("type") == "choice"]
    dist = {i: pos.count(i) for i in sorted(set(pos))}
    worst = max(dist.values()) / len(pos)
    return dist, worst


# ---------------------------------------------------------------------------
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
        "accreditation_id": ACCRED_ID,
        "also_counts_toward": ALSO_COUNTS.get(spec["id"], []),
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
        f"request_type: {spec.get('request_type', 'single')}",
        f"audience: {ylist(spec['audience'])}",
        f"level: {spec['level']}",
        "learning_outcomes:",
    ]
    for o in spec["objectives"]:
        y.append(f"  - {json.dumps(o['text'])}")
    y += [
        f"prerequisites: {ylist(spec['prereqs'])}",
        f"target_hours: {spec['hours']}",
        f"tracker_hours: {spec.get('tracker_hours', spec['hours'])}",
        f"mastery_score: {G.MASTERY}",
        f"assessment_type: {json.dumps(spec['assessment_type'])}",
        f"wave: {spec['wave']}",
        f"accreditation: {ACCRED_ID}",
        f"also_counts_toward: {ylist(ALSO_COUNTS.get(spec['id'], []))}",
        f"authoring_contract: {json.dumps(spec['contract'])}",
        "source_ledger: plan/custom-connectors/claims.json (verified verbatim; learner-facing claims only)",
        f"sme: {json.dumps(spec.get('sme', 'unassigned - needs_sme'))}",
        "publish_mode: manual_review",
        "open_questions:",
    ]
    for q in spec.get("open_questions", []):
        y.append(f"  - {json.dumps(q)}")
    if not spec.get("open_questions"):
        y[-1] = "open_questions: []"
    (dest / "module.yaml").write_text("\n".join(y) + "\n")

    G.jdump(dest / "qa" / "waivers.json", {"waivers": []})
    (dest / "CHANGELOG.md").write_text(
        f"# {spec['id']} {spec['title']}\n\n## {VERSION} - {TODAY}\n\n"
        f"- First SCORM build for `{ACCRED_ID}` from `{spec['contract']}`.\n"
        f"- Design system: `{DESIGN_SYSTEM}`.\n"
        f"- {len(spec['screens'])} screens across "
        f"{len(set(s['archetype'] for s in spec['screens']))} distinct archetypes.\n"
        f"- {len(spec['claims'])} learner-facing claims traced to "
        f"{len(SD.sources_for(spec['claims']))} vetted sources; internal and field evidence excluded.\n"
        f"- {len(spec['quiz'])} assessment items; keys in `assessment/key.json`; correct-option "
        f"positions rotated at build time.\n"
        f"- {len(spec.get('assets', []))} authored SVG diagrams with alt text and claim mapping.\n"
        "- Case uses an anonymized composite organization and generic system labels; no customer "
        "or partner names.\n")


def build_research(spec, dest):
    G.build_research(spec, dest)
    # Replace the generic conflicts note with the real open items for this module.
    p = dest / "research" / "findings.md"
    t = p.read_text()
    t = t.split("## Conflicts and gaps")[0]
    t += ("## Conflicts and gaps\n\nSee `conflicts.md`. Every claim in this module is learner-facing "
          "and verified verbatim against the source text. Internal engineering, reviewer, and field "
          "evidence from the authoring ledger is excluded from this module.\n")
    p.write_text(t)
    lines = [f"# {spec['id']} - conflicts, exclusions, and open questions", "",
             "## Authority ruling", "",
             "Current Glean product and developer documentation (tier 1) is authoritative for product "
             "behavior. Partner enablement and program documents (tier 2) supply program rules and "
             "practice guidance that tier 1 does not contradict. Tier 3 and 4 material is excluded.", "",
             "## Open questions carried by this module", ""]
    for q in spec.get("open_questions", []) or ["None."]:
        lines.append(f"- {q}")
    lines += ["", "## Studio guidance disclosed in the module", ""]
    for s in spec["screens"]:
        if "studio" in (s.get("footnote") or "").lower():
            lines.append(f"- `{s['id']}`: {s['footnote']}")
    (dest / "research" / "conflicts.md").write_text("\n".join(lines) + "\n")


def build_design(spec, dest):
    G.build_design(spec, dest)
    p = dest / "design" / "experience.yaml"
    t = p.read_text().replace("accreditation: accred-agents", f"accreditation: {ACCRED_ID}")
    lines = t.splitlines()
    lines.insert(1, f"design_system: {DESIGN_SYSTEM}")
    p.write_text("\n".join(lines) + "\n")


def build_assessment(spec, dest):
    G.build_assessment(spec, dest)
    p = dest / "assessment" / "items.json"
    doc = json.loads(p.read_text())
    by_id = {q["id"]: q for q in spec["quiz"]}
    for it in doc["items"]:
        it["claims"] = by_id[it["id"]]["claims"]
    G.jdump(p, doc)
    if spec.get("rubric_extra"):
        r = dest / "assessment" / "rubric.md"
        r.write_text(r.read_text() + "\n" + spec["rubric_extra"] + "\n")


def generate_one(raw):
    spec = prepare(raw)
    dest = MODULES / spec["id"]
    if dest.exists():
        shutil.rmtree(dest)
    for d in G.DIRS:
        (dest / d).mkdir(parents=True, exist_ok=True)
    build_meta(spec, dest)
    build_research(spec, dest)
    build_design(spec, dest)
    assets_by_id = G.build_assets(spec, dest)
    G.build_content(spec, dest)
    build_assessment(spec, dest)
    G.build_runtime(spec, dest, assets_by_id)
    return dest, spec


def cmd_validate():
    missing = [m for m in ORDER if m not in BY_ID]
    findings = [f"missing spec {m}" for m in missing]
    for m in ORDER:
        if m in BY_ID:
            findings += validate(BY_ID[m])
    for f in findings:
        print("ERROR", f)
    for m in ORDER:
        if m in BY_ID and not any(f.startswith(m) for f in findings):
            spec = prepare(BY_ID[m])
            dist, worst = position_report(spec)
            flag = "" if worst <= 0.5 and len(dist) >= 3 else "  <- position skew"
            if flag:
                findings.append(f"{m}: correct-position skew {dist}")
            print(f"{m:<8} screens={len(spec['screens']):<3} items={len(spec['quiz']):<3} "
                  f"claims={len(spec['claims']):<3} positions={dist}{flag}")
    print("PASS" if not findings else "FAIL")
    return 1 if findings else 0


def cmd_generate():
    if cmd_validate():
        raise SystemExit("spec validation failed; nothing generated")
    for m in ORDER:
        dest, _ = generate_one(BY_ID[m])
        print("generated", dest.relative_to(ROOT))


def cmd_package():
    import package as P
    rc = 0
    for m in ORDER:
        zpath, digest = P.package(MODULES / m)
        v = subprocess.run([sys.executable, str(P.VALIDATE), str(zpath)], capture_output=True, text=True)
        state = v.stdout.strip().splitlines()[-1] if v.stdout.strip() else "NO OUTPUT"
        print(f"{m:<8} {state:<6} {digest[:16]}  {zpath.name}")
        if state != "PASS":
            rc = 1
            print(v.stdout, v.stderr)
    return rc


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "validate"
    fn = {"validate": cmd_validate, "generate": cmd_generate, "package": cmd_package}.get(cmd)
    if not fn:
        raise SystemExit(__doc__)
    sys.exit(fn() or 0)
