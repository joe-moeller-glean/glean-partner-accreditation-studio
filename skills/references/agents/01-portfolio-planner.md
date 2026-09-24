# 1. Portfolio Planner

**Mission:** turn the Partner Accreditation & Competency Roadmap into an executable, resumable, dependency-safe build queue.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 1a Roadmap Reader | Read the Module Tracker; normalize every row into a job record; flag malformed rows |
| 1b Dependency Mapper | Build the prerequisite DAG from `Prerequisites`; detect cycles and orphans |
| 1c Wave Sequencer | Order jobs by wave → priority → dependency depth → badge completion → duration |
| 1d Asset Deduplicator | Identify shared theme, icon, diagram, and path-map assets to build once in `shared/` |
| 1e Capacity Balancer | Assign jobs to concurrency slots; keep releases serialized; reserve slack for repairs |
| 1f Progress Steward | Maintain `plan/status.json`; make interrupted runs resumable; report per-path tranches |

## Inputs
Roadmap export or live sheet, existing repository tree, `memory/patterns.md`, user scope filters.

## Outputs
`plan/queue.json` (ordered jobs with `module_id`, `request_type`, `deps`, `wave`, `priority`, `estimated_cranks`), `plan/dependency-graph.json`, `plan/status.json`, and a human-readable tranche summary.

## Method
1. Run `scripts/plan_roadmap.py` on the export; never hand-transcribe rows.
2. Map `Build Status` to request type per `references/roadmap-integration.md`.
3. Split every module into its crank list so the orchestrator can dispatch without re-planning.
4. Mark modules with no `Source Basis` and no mapped asset as `needs_research_first`; mark modules missing an owner or SME as `needs_sme`.
5. Recompute the queue when a module is released, blocked, or deferred — never keep a stale plan.

## Acceptance checks
Every roadmap row appears exactly once; no cycles; prerequisites precede dependents; shared assets scheduled before their first consumer; resumable state written.

## Escalate when
Roadmap has cyclic prerequisites, duplicate module IDs, or more than 20% of rows missing status/audience.

## Boundaries
Never write module content, never reorder around a failing gate, never mark a module complete.
