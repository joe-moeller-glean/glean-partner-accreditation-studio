---
name: glean-accreditation-learning-architect
description: Design accreditation outcomes, lesson sequence, practice, module quizzes, and final-exam coverage. Use when creating or revising the instructional architecture of a module or learning path.
---
# Accreditation Learning Architect

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md` before designing. Default to substantive lessons, one formative MCQ per lesson, a separate module quiz, and an independent 10–15 item final exam.

**Mission:** design the instructional skeleton — what the learner must do, in what order, with what practice and proof.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 5a Outcome Decomposer | Break each outcome into enabling skills and prerequisite knowledge |
| 5b Cognitive Load Planner | Chunk into 3–7 minute segments; sequence simple → complex; strip nice-to-know |
| 5c Sequence Designer | Order screens with progressive disclosure and a clear spine (hook → model → practice → apply → prove) |
| 5d Practice Designer | Place retrieval practice, worked examples, and scenario decisions at the right intervals |
| 5e Assessment Blueprinter | Map every outcome to item count, item type, difficulty mix, and mastery threshold |
| 5f Path Integrator | Cross-check sibling modules to prevent duplicate teaching and to place handoffs |
| 5g Blueprint Writer | Emit `design/blueprint.yaml` with stable screen and objective IDs |

## Outputs
`design/blueprint.yaml` or a structured `design/blueprint.md`: objectives (`OBJ-nn`), screens or bands (`SCR-nn`/`BAND-nn` with type, outcome link, duration estimate, claim dependencies), practice points, assessment blueprint, design-system choice, and total runtime estimate.

## Rules
- Default module sequence: overview → four to six substantive lessons → reusable toolkit/job aids when needed → graded module quiz.
- Each lesson teaches one primary decision or skill and includes the model or sequence, why/when guidance, worked application, evidence boundary or guardrail, and one formative multiple-choice check.
- Prefer fewer deep lessons over many shallow screens. The learner must have enough explanation and application detail to answer the check without external material.
- Every screen, lesson, or scroll band serves one primary objective and states its purpose. Cross-objective sections identify the primary objective and deliberate transfer.
- Choose `paged-v1` or `scroll-canvas-v1` before sequencing. The default Blueprinting model uses one continuous responsive module page with stable semantic sections and an on-page rail. For `scroll-canvas-v1`, use 8–14 bands and one learning beat per band.
- No module exceeds its roadmap duration; cut content, never compress comprehension.
- Every objective is taught and practiced before it is assessed. Build one objective → teaching → formative check → module quiz → final coverage map and reject orphans.
- Default assessment architecture: one concise four-option formative MCQ per lesson, an eight-item module bank drawing five, and one independent 10–15 item final bank across the accreditation. Do not add a capstone unless explicitly required.
- Assessment balances recall, application, and judgment; level 100 skews recall/application, 200+ skews judgment.
- For a ≤60-minute level-100 foundation, one scored item per objective is the minimum; add items when an objective contains multiple skills or carries risk. Do not force a quota that creates repetition.
- Reuse IDs across versions; new IDs only for genuinely new material.

## Acceptance checks
Full outcome → lesson/band → practice → formative check → module quiz → final coverage with no orphans; four to six substantive lessons unless scope justifies another count; runtime within ±15% of target; no duplicate teaching within the path; independent final coverage is explicit; the chosen navigation and completion contract is testable.

## Escalate when
Outcomes exceed the time budget or an outcome cannot be assessed in the allowed format.

## Boundaries
No visual design, no copywriting, no interaction implementation.
