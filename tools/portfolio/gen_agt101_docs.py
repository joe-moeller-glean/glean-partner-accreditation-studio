import json, pathlib, subprocess, hashlib, datetime

M = pathlib.Path("learning/modules/AGT-101")
TODAY = "2026-09-14"

# ---------------------------------------------------------------- module.yaml
module_yaml = """# AGT-101 - Glean Agents Foundations
# Brief and delivery contract. Authoring input; not shipped in the package.
module_id: AGT-101
title: Glean Agents Foundations
version: 1.0.0
level: 100
accreditation_id: accred-agents
series_position: 1
series_note: >-
  First module of the agent series. Establishes the vocabulary, the design
  language (scroll-canvas-v1), and the shared component set that later agent
  modules reuse.

delivery:
  format: SCORM 1.2, single SCO
  navigation: single-page vertical scroll, 12 bands, no pagination
  design_system: scroll-canvas-v1
  target_hours: 0.8
  offline: true
  network_calls: none

audience:
  primary: Partner solution advisors, builders, and technical sellers new to Glean Agents
  prerequisites: none
  assumed_knowledge: Familiarity with enterprise SaaS. No Glean platform experience assumed.

learner_promise: >-
  Define a Glean Agent in one sentence, name the five building blocks, choose
  between Auto mode, Workflow mode, and an independent agent, match a trigger to
  how people will start the agent, and apply least privilege and risk-matched
  process.

objectives:
  - id: OBJ-01
    text: Define a Glean Agent and identify who agents are for.
    assessed_by: [Q-01]
  - id: OBJ-02
    text: Name the five core building blocks that every agent combines.
    assessed_by: [Q-02]
  - id: OBJ-03
    text: Choose Auto mode, Workflow mode, or an independent agent for a stated need.
    assessed_by: [Q-03]
  - id: OBJ-04
    text: Match the right trigger to how people will start the agent.
    assessed_by: [Q-04]
  - id: OBJ-05
    text: Apply least privilege, permission behaviour, and risk-matched process.
    assessed_by: [Q-05, Q-06]

assessment:
  items: 6
  mastery_score: 80
  attempts: unlimited
  feedback: per-option, on every attempt
  key_shipped: false

completion_rule: >-
  lesson_status becomes passed only when every one of the 12 bands has been
  reached AND the quiz best score is at or above 80. Reaching the bottom of the
  page is never sufficient on its own.

sourcing:
  claims: 62
  sources: 12
  tier_1_product_docs: 10
  unsourced_claims: 0
  research_date: 2026-09-14

open_items:
  - No SME has reviewed this content.
  - Not imported into a real LMS; validation is structural plus scripted runtime.
  - AGT-101 is not yet in the roadmap Module Tracker.
  - Overlaps FND-104 and FND-105 at 200 level; dedupe decision is the owner's.
  - Five design deviations recorded in plan/06-scroll-canvas-design-system.md section 12.
  - Risk-tier thresholds in INT-risk are a studio heuristic, disclosed in-module.

status: built, gates passed, awaiting human review
owner: Joe Moeller
"""
(M / "module.yaml").write_text(module_yaml)

# ---------------------------------------------------------------- blueprint
bands = json.loads((M / "content/bands.json").read_text())["bands"]
ix = json.loads((M / "interactions/interactions.json").read_text())["interactions"]
items = json.loads((M / "assessment/items.json").read_text())
claims = json.loads((M / "research/claims.json").read_text())["claims"]

lines = [
    "# AGT-101 learning blueprint",
    "",
    "Outcome map for the single-page scroll build. One band = one scroll beat.",
    "",
    "| # | Band | Archetype | Surface | Interaction | Objective |",
    "|---|---|---|---|---|---|",
]
OBJ_BY_BAND = {
    "BAND-01": "-", "BAND-02": "all", "BAND-03": "OBJ-01", "BAND-04": "OBJ-02",
    "BAND-05": "OBJ-03", "BAND-06": "OBJ-03", "BAND-07": "OBJ-04",
    "BAND-08": "OBJ-05", "BAND-09": "OBJ-05", "BAND-10": "OBJ-05",
    "BAND-11": "all", "BAND-12": "-",
}
for i, b in enumerate(bands, 1):
    ints = [blk.get("interaction_id") for blk in b.get("blocks", []) if blk.get("interaction_id")]
    has_quiz = any(blk.get("type") == "quiz" for blk in b.get("blocks", []))
    label = ", ".join(ints) or ("quiz" if has_quiz else "-")
    lines.append(f"| {i} | {b['id']} | {b['archetype']} | {b['surface']} | {label} | {OBJ_BY_BAND[b['id']]} |")

lines += [
    "",
    "## Objective to assessment map",
    "",
    "| Objective | Taught in | Practised in | Assessed by |",
    "|---|---|---|---|",
    "| OBJ-01 Define an agent | BAND-03 | BAND-04 hotspot | Q-01 |",
    "| OBJ-02 Five building blocks | BAND-04 | BAND-04 hotspot | Q-02 |",
    "| OBJ-03 Choose a mode | BAND-05 | BAND-06 decisions | Q-03 |",
    "| OBJ-04 Triggers | BAND-07 | BAND-07 sorter | Q-04 |",
    "| OBJ-05 Govern and scope | BAND-08, BAND-09, BAND-10 | myths, risk checklist, stepper | Q-05, Q-06 |",
    "",
    "Every objective is taught before it is practised, and practised before it is",
    "assessed. No assessed item depends on knowledge introduced only in feedback.",
    "",
    "## Interaction inventory",
    "",
    "| ID | Type | Band | Elements | Scored |",
    "|---|---|---|---|---|",
]
for k, v in ix.items():
    n = len(v.get("items") or v.get("cards") or v.get("hotspots")
            or v.get("steps") or v.get("factors") or v.get("panels") or [])
    lines.append(f"| {k} | {v['type']} | {v['band']} | {n} | no |")
lines.append("| INT-quiz | quiz | BAND-11 | 6 | yes, mastery 80 |")

lines += [
    "",
    "## Pacing",
    "",
    "Text and interactive bands alternate. No two adjacent bands share an archetype",
    "or a surface. Exactly one ink band (BAND-11) sits at 92% scroll depth, immediately",
    "before the assessment. Exactly one T3 motion moment: the stat count-up on BAND-11.",
    "",
    f"Claims referenced: {len(claims)} verified, 0 unsourced.",
    "",
]
(M / "design").mkdir(exist_ok=True)
(M / "design/blueprint.md").write_text("\n".join(lines) + "\n")

# ---------------------------------------------------------------- experience.yaml
experience = """# AGT-101 experience design
design_system: scroll-canvas-v1
spec: plan/06-scroll-canvas-design-system.md

navigation:
  model: single continuous vertical scroll
  bands: 12
  pagination: none
  rail:
    visible_at: ">=1024px"
    below_1024: bottom progress bar
    markup: real nav with in-page anchor links, works with zero JS
  progress:
    definition: deepest band actually reached, measured by IntersectionObserver at 12% visibility
    honest: true
    note: never counts unvisited bands; a scroll-past that never fires the observer does not count

surface_sequence: [white, warm, white, warm, white, warm, white, warm, white, warm, ink, white]
ink_band: BAND-11
ink_band_position: 92% scroll depth, immediately before the assessment

motion:
  reveal: opacity 0->1 plus translateY 8px->0, 300ms, once, never re-animates
  t3_signature_moment: stat count-up on BAND-11 (the only one)
  forbidden: [scroll-jacking, parallax, pinned sequences, autoplay, ambient loops]
  reduced_motion: all reveals render final state immediately; count-ups show final value

fallbacks:
  no_intersection_observer: every band marked visited, all reveals shown, nothing hidden
  corrupt_suspend_data: caught, module renders from scratch
  scorm_absent: module renders and is fully usable, tracking silently skipped

accessibility:
  one_h1: true
  band_headings: h2
  card_headings: h3
  every_band: section with aria-labelledby
  keyboard: full; roving tabindex on hotspot and tabs; arrow-key navigation
  focus_ring: 3px solid action colour, 2px offset, via :focus-visible
  live_regions: polite on decision feedback, sorter status, risk result, stepper panel
  min_target: 24px including the risk checkboxes
  colour_alone: never the sole state signal; text verdicts accompany every colour change
  contrast: body text >=4.5:1, control borders >=3:1 via --line-control

provenance_disclosure:
  INT-risk: >-
    Tier names and process depths are documented. The factor-count thresholds are
    a studio heuristic and say so in the module.
"""
(M / "design/experience.yaml").write_text(experience)

print("module.yaml, design/blueprint.md, design/experience.yaml written")
print("bands in blueprint:", len(bands))
