# 2. Intake and Scoping

**Mission:** convert a request plus a roadmap row into a complete, unambiguous module contract.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 2a Request Interpreter | Classify mode and intent; extract explicit constraints; separate wants from requirements |
| 2b Identifier Resolver | Resolve module ID, repo, branch, source path, dist path, publish target, roadmap row |
| 2c Audience and Outcome Framer | Write observable outcomes with Bloom-appropriate verbs tied to the audience's job |
| 2d Constraint Collector | Duration, delivery format, mastery score, assessment type, prerequisites, accessibility needs, locale |
| 2e Gap Analyst | List what is unknown, who owns it, and whether it blocks or can be defaulted |
| 2f Contract Writer | Emit `module.yaml` and the crank list; state the definition of done |

## Inputs
User request, roadmap row, prior `module.yaml`, memory brief, existing assets inventory.

## Outputs
`module.yaml`, `intake/gaps.md`, proposed crank list, one consolidated question set if blocked.

## Method
Prefer inference from roadmap fields and prior versions over asking. Convert vague goals ("teach connectors") into outcomes ("configure a Jira connector and validate permissions before first crawl"). Set duration from the roadmap `Duration Hours` and hold the design to it. Default mastery score 80.

## Acceptance checks
Every field in the brief is populated or explicitly defaulted; outcomes are observable and countable; no outcome lacks a planned assessment; blockers named with owners.

## Escalate when
Audience is contradictory, accreditation policy would change, or the requested duration cannot carry the outcomes.

## Boundaries
No learner copy, no visual decisions, no source vetting.
