---
name: glean-accreditation-assessment-builder
description: Create accreditation lesson checks, graded module quizzes, and independent final exams. Use when authoring or revising questions, distractors, feedback, keys, mastery rules, and duplicate checks.
---
# Accreditation Assessment Builder

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md`, especially the knowledge-check, module-quiz, and independent-final sections. Keep questions short, options relevant, and final items separate from formative and module banks.

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
- Mastery defaults to 80%.
- Write one formative lesson check per lesson: four options, one best answer, a short stem, concise content-specific distractors, and immediate explanatory feedback.
- A formative check stays selectable after an incorrect answer, shows “Not correct. Try again.”, clears stale feedback on reselection, and locks only after a correct submission. It never writes LMS score or interaction data.
- Do not make a check harder by adding framing such as “A trainee selects” or a long rationale prompt. Make it harder through a meaningful content distinction and plausible nearby options.
- Default module quiz: eight source-grounded items, draw five without replacement, shuffle by stable option ID, 4/5 passes, 3/5 fails, and two proposed graded attempts.
- Build a separate exam-only final bank of 10–15 items; default to 15 with 12/15 required. Cover every module and favor integrative scenarios.
- Do not reuse formative or module-quiz stems, answer sets, or IDs in the final. Validate exact duplication programmatically and review semantic similarity; rewrite near-duplicates.
- Scenario-first for level 200+; recall items only where recall genuinely matters.
- Never test trivia, wording, or anything not taught in the module.
- Distractors must be relevant to the same content and defensible enough that a partially prepared learner would consider them. Avoid jokes, impossible choices, and generic reusable failure phrases.
- Every keyed answer and every distractor rationale is source-anchored and audited by the Fact Integrity Auditor.
- Item-count floor: for a ≤60-minute level-100 foundation, one scored item per objective is the minimum; add a second item for multi-skill or high-risk objectives. Use 2+ per objective for deeper 200+ accreditation where the outcome requires judgment. Do not inflate item counts to satisfy a generic quota.
- Do not add a capstone by default. Add one only when explicitly required and supported by approved rubric, governance, reviewer, and LMS handling.
- Keep `assessment/key.json` authoring-only. The package build must explicitly prove that the key and equivalent answer data are not shipped.

## Outputs
`assessment/items.json`, `assessment/key.json`, `assessment/rubric.md`, `assessment/calibration.md`, formative-check bank, module-quiz bank, independent final-exam bank, and duplicate/similarity report.

## Acceptance checks
Every objective is covered at the required depth; every lesson has one concise retryable formative MCQ; module quiz and final items are separate; final bank contains 10–15 items and covers all required modules; no exact stem or answer-set overlap and no unreviewed near-duplicate; no ambiguity, cueing, or answer-position pattern; feedback explains; keys stay outside learner packages; 4/5 module and 12/15 final boundaries are tested; the module cannot mark complete from quiz mastery alone when its navigation contract requires all sections.

## Escalate when
An objective cannot be validly assessed in the permitted format, or live data shows an item is broken (pass rate <30% or >95%).

## Boundaries
Never reveal answers in module copy, never lower mastery to force a pass, never delete an item without a changelog entry.
