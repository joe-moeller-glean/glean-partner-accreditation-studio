# Author job

Read `skills/references/accreditation-build-standard.md` before writing. This job creates or patches learner content from an accepted claim set. It does not grade its own facts and it does not publish.

`create_module` and `update_module` require a research claim set. If a required outcome has no tier-1 or tier-2 source, return `blocked` instead of drafting around it. `create_accreditation` writes only `learning/accreditations/<id>/accreditation.yaml` and one queued module job per missing module. It does not build those modules in the same job.

## Order

Skip a phase only when its artifact already exists and this job's objective does not change it.

1. **Intake.** Write `module.yaml` and `intake/gaps.md`. Outcomes are observable. Duration comes from the roadmap. Mastery defaults to 80. Record any departure from the build standard and its reason. No learner copy in this phase.
2. **Architecture.** Write `design/blueprint.yaml`. Default sequence: overview, four to six substantive lessons, toolkit when needed, graded module quiz. Each lesson teaches one decision or skill and includes the model, why and when, a worked application, a guardrail, and one formative check. Map objective to teaching to practice to formative check to module quiz to final coverage. Reject orphans. Choose `paged-v1` (one continuous page, semantic sections, on-page rail) or `scroll-canvas-v1` (8–14 bands, one idea per band) before sequencing.
3. **Experience.** Write `design/experience.yaml` and `design/storyboard.md` from `skills/references/experience-design.md` and `skills/references/scroll-canvas.md`. Use at least four archetypes and one T3 moment. Motion tiers are T0 none, T1 state feedback, T2 a purposeful transition, and T3 once per module. Scroll modules alternate surfaces, use exactly one ink band, and keep progress as the deepest band reached. Design the narrow and keyboard path first.
4. **Copy.** Write lessons, scenarios, feedback, glossary, and job aids. Sentence case, active voice, second person. Every factual sentence, diagram label, feedback line, and quiz rationale carries a `claim_id`. Use researched product terms and real menu paths. Do not name a real customer unless the source is public and cleared. Knowledge-check stems stay short.
5. **Interactions.** Implement accessible controls in `interactions/`. Formative checks use a native radio group and a submit button, show "Not correct. Try again.", clear stale feedback on reselection, lock only after the correct answer, and write no LMS score or interaction. Every pointer gesture has a keyboard path. Disclose studio heuristics in the module. Vanilla, offline, no positive tabindex.
6. **Assessment.** Write `assessment/items.json`, `assessment/key.json`, and `assessment/rubric.md` when a rubric is required. One four-option formative item per lesson. Module bank of eight, draw five, 4/5 passes. Final exam is a separate 10–15 item bank, default 15 with 12/15, and reuses no formative or module stem, answer set, or ID. Do not add a capstone unless the job explicitly requires an approved one. The key stays out of the package.
7. **Graphics and brand.** Original SVG diagrams whose labels come from `claims.json`. Read `skills/references/graphics-system.md`, `skills/references/brand-system.md`, and `skills/brand/SKILL.md`. Place the approved wordmark file. Do not generate a logo, a fake product screenshot, a human face, or a fact baked into pixels. Alt text goes in `assets/alt-text.json`. Package budget is under 20 MB, and a single raster is under 400 KB.
8. **Structural check.** Run `skills/scripts/lint_module.py` on the module. Fix lint failures that are in scope. Leave factual disputes and accessibility blockers for the verify job.

Modules that are generated from `tools/portfolio/` must be changed in the spec or authoring source and regenerated. `generate.py` builds the paged catalog, `build_connectors.py` builds Custom Connectors, `build_support.py` builds OPS-107 and OPS-108, and the `gen_agt101_*.py` scripts plus `package_agt101.py` own AGT-101. Do not hand-edit compiled runtime to sneak in a content change.

## Update rules

Preserve stable IDs. Change the smallest surface named in the job. Refresh research before changing product behavior, process, metrics, policy, or external claims. Record retired IDs in `CHANGELOG.md`.

## Acceptance

The objective's coverage map has no orphans. Changed facts resolve to the claim set. Formative and graded items are separate. `lint_module.py` exits 0, or the job returns `blocked` with the lint output. `status` is `ready_for_verify`, never `passed`.

## Stop

Return `blocked` when the time budget cannot hold the outcomes, an objective cannot be assessed in the allowed format, or a screen needs an unsupported claim. Do not invent product behavior, metrics, or customer outcomes. Do not lower mastery to force a pass. Do not tag or publish.
