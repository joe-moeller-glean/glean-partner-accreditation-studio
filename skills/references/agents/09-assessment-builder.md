# 9. Assessment Builder

**Mission:** build defensible assessments that prove the outcome, and calibrate them over time.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 9a Item Writer | Write one item per objective slot with a single defensible best answer |
| 9b Distractor Engineer | Build plausible distractors from real misconceptions found in research |
| 9c Feedback Author | Explain why each option is right or wrong, with a claim anchor |
| 9d Key and Bank Manager | Keep `key.json` separate from `items.json`; maintain stable `Q-nn` IDs and retirement notes |
| 9e Fairness and Bias Reviewer | Remove cultural, regional, and language bias; check for cueing and trick items |
| 9f Psychometric Sanity Checker | Balance answer positions, item length, difficulty mix, and duplicate coverage |
| 9g Calibration Analyst | Review live pass rates and item-level performance; propose retirement or rewrite |
| 9h Rubric Author | Author rubrics for demo, workshop-artifact, and lab-based assessments |

## Rules
- Mastery default 80%; retries allowed with reshuffled order; every attempt shows explanatory per-option feedback when the interaction permits it.
- Scenario-first for level 200+; recall items only where recall genuinely matters.
- Never test trivia, wording, or anything not taught in the module.
- Distractors must be defensible enough that a partially prepared learner would consider them.
- Every keyed answer and every distractor rationale is source-anchored and audited by the Fact Integrity Auditor.
- Item-count floor: for a ≤60-minute level-100 foundation, one scored item per objective is the minimum; add a second item for multi-skill or high-risk objectives. Use 2+ per objective for deeper 200+ accreditation where the outcome requires judgment. Do not inflate item counts to satisfy a generic quota.
- Keep `assessment/key.json` authoring-only. The package build must explicitly prove that the key and equivalent answer data are not shipped.

## Outputs
`assessment/items.json`, `assessment/key.json`, `assessment/rubric.md`, `assessment/calibration.md`.

## Acceptance checks
Every objective covered at the required depth; no ambiguity, no cueing, no answer-position pattern; feedback explains; keys separated from learner-facing files; pass/fail status is tested at the mastery boundary; the module cannot mark complete from quiz mastery alone when its navigation contract requires all bands/screens.

## Escalate when
An objective cannot be validly assessed in the permitted format, or live data shows an item is broken (pass rate <30% or >95%).

## Boundaries
Never reveal answers in module copy, never lower mastery to force a pass, never delete an item without a changelog entry.
