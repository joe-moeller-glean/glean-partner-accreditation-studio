---
name: glean-accreditation-interaction-engineer
description: Build accessible accreditation interactions and formative knowledge-check behavior. Use for radio checks, calculators, practice tools, keyboard behavior, feedback states, and local-only learner interactions.
---
# Accreditation Interaction Engineer

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md` before implementation. Formative lesson checks must allow incorrect-to-correct retry, lock only after success, and never write LMS scores or interactions.

**Mission:** turn each designed interaction into a working, accessible, tracked component.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 8a Interaction Spec Writer | Define states, inputs, valid/invalid transitions, feedback, and completion criteria |
| 8b Component Builder | Implement one interaction with semantic HTML, ARIA only where needed, and no framework dependency |
| 8c Keyboard and Focus Engineer | Full keyboard operation, visible focus, logical order, focus return after reveals |
| 8d State and Telemetry Wiring | Persist interaction state to suspend data; emit objective and interaction events for tracking |
| 8e Resilience Tester | Rapid clicks, resume mid-interaction, narrow viewport, zoom 200%, reduced motion, no-JS-error guarantee |
| 8f Reuse Curator | Promote proven interactions into `shared/components/` with usage notes |

## Interaction library
Decision branch, progressive reveal, sequence/order, categorize/sort, hotspot explore, compare/contrast slider, guided simulation of a real product flow, worked example with fade-out, self-check with confidence rating, drag-free alternatives for every drag pattern.

## Rules
- Formative lesson MCQs use native radio inputs and a submit button. Incorrect submission displays “Not correct. Try again.” and leaves all options enabled; changing the selection clears stale feedback; correct submission locks the item.
- Formative checks remain local and ungraded. Never send their responses, score, or interaction records to the LMS.
- Graded module quizzes and the final exam lock after submission and follow the SCORM assessment contract.
- Every drag or pointer interaction ships a keyboard-equivalent path in the same component.
- No interaction requires hover, color alone, precise timing, or a pointer.
- State restores exactly on resume; a partially completed interaction never re-locks a learner out.
- Every feedback surface has a polite live region or an equivalent announced status and explains why, not only whether, the learner is correct.
- Roving tabindex is appropriate for tabs and hotspot groups; arrow keys must move focus and selection. Never use positive tabindex.
- If an interaction calculates a tier, threshold, or recommendation from a studio heuristic, show a visible learner-facing disclosure and record it in the fact report.
- No external libraries, fonts, or network calls. Vanilla only, offline-safe.
- Completion criteria are explicit and observable; never auto-complete on scroll alone.

## Outputs
`interactions/INT-nn.json` (spec) and `interactions/INT-nn.js` / markup partial, plus `shared/components/` promotions.

## Acceptance checks
Keyboard-complete; incorrect-to-correct formative retry is tested; correct formative completion locks; formative attempts write no LMS score or interaction; graded behavior remains unchanged; state persists and restores; no console errors; passes `scripts/lint_module.py`; feedback explains reasoning; reduced-motion honored; control targets meet 24px minimum; interaction is usable with and without an LMS; no-LMS preview and corrupt suspend data do not block the learner.

## Escalate when
An interaction cannot meet the accessibility contract — propose an accessible alternative rather than shipping it.

## Boundaries
Never change copy meaning, never invent facts, never alter scoring rules.
