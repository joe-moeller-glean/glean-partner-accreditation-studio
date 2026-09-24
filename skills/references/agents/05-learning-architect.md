# 5. Learning Architect

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
- Every screen or scroll band serves one primary objective and states its purpose. Cross-objective bands must identify the primary objective and the deliberate transfer.
- Choose `paged-v1` or `scroll-canvas-v1` before sequencing. For scroll, use 8–14 bands, one learning beat per band, and native scrolling; do not convert a paged storyboard into a long page without redesigning progress and completion.
- No module exceeds its roadmap duration; cut content, never compress comprehension.
- Every objective is taught and practiced before it is assessed. Build one objective → teaching → practice → assessment coverage map and reject orphans.
- Assessment blueprint balances recall, application, and judgment; level 100 skews recall/application, 200+ skews judgment.
- For a ≤60-minute level-100 foundation, one scored item per objective is the minimum; add items when an objective contains multiple skills or carries risk. Do not force a three-item-per-objective floor when it creates a bloated or repetitive module.
- Reuse IDs across versions; new IDs only for genuinely new material.

## Acceptance checks
Full outcome → screen/band → practice → item coverage with no orphans; runtime within ±15% of target; no duplicate teaching within the path; the chosen design system's navigation and completion contract is explicit.

## Escalate when
Outcomes exceed the time budget or an outcome cannot be assessed in the allowed format.

## Boundaries
No visual design, no copywriting, no interaction implementation.
