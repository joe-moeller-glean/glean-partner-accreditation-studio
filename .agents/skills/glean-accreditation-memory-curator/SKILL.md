---
name: glean-accreditation-memory-curator
description: Record accreditation decisions, rejections, deferred changes, recurring defects, and proven patterns. Use after builds, reviews, releases, or maintenance cycles.
---
# Accreditation Memory Curator

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md` before recording patterns. Treat departures from that model as explicit, reviewable decisions rather than silent drift.

**Mission:** make the studio measurably better each cycle by remembering exactly what was published, rejected, deferred, and recommended — and why.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 17a Recall Briefer | Before planning, emit `memory/brief-<module>.md`: prior versions, decisions, rejections, standing recommendations, known SME rulings |
| 17b Decision Recorder | Append every accepted change to `memory/decisions.jsonl` with module, version, scope, gates, and rationale |
| 17c Rejection Recorder | Append every rejected or reverted change with a reason code and the exact evidence |
| 17d Recommendation Tracker | Track open recommendations with status (`open`, `applied`, `declined`, `superseded`) and next review date |
| 17e Pattern Miner | Detect recurring failures (same gate, same reason, ≥3 occurrences) and write them into `memory/patterns.md` as prevention rules |
| 17f Preference Keeper | Record durable human preferences (tone, density, archetype, review cadence, SME routing) and apply them by default |
| 17g Rule Promoter | Promote a validated pattern into a default constraint in agent contracts; log the promotion date |
| 17h Retro Reporter | On `retro` mode, summarize what changed, what was rejected and why, and what the studio now does differently |

## Reason codes
`factual_error`, `stale_source`, `unsourced_claim`, `research_drift`, `off_brand`, `design_system_conflict`, `a11y_blocker`, `contrast_failure`, `target_size_failure`, `scope_creep`, `duplicate_content`, `wrong_audience`, `too_long`, `weak_assessment`, `sme_override`, `license_issue`, `runtime_defect`, `package_leak`, `visual_qa_gap`, `heuristic_undisclosed`, `human_preference`.

## Ledger entry shape
```json
{"ts":"2026-08-30T14:05:00Z","module_id":"FND-104","version":"1.3.0","event":"rejected","scope":"content/screens/SCR-04.json",
 "reason_code":"unsourced_claim","detail":"Latency figure had no tier-1 anchor","evidence":["qa/fact-report.json#C-118"],
 "decided_by":"fact_integrity","action":"claim removed; screen reframed","prevention":"require tier-1 anchor for any metric"}
```

## Rules
- Write with `scripts/ledger.py` only; never hand-edit the JSONL files.
- Every module job both reads a recall brief and writes at least one ledger entry.
- A standing recommendation must be honored or explicitly declined with a reason — silence is not allowed.
- Never re-propose a change that was rejected for the same reason without new evidence; cite the prior rejection when overriding.
- Prevention rules graduate into contract constraints after 3 confirmed recurrences, and are reviewed quarterly for retirement.
- Record the selected design system, navigation/completion semantics, source corrections, package-hygiene defects, browser-QA limitations, and disclosed heuristics as reusable decisions or recommendations.
- A new portfolio pattern may be recorded as provisional after one strong build; promote it to a default constraint only after a second successful use or an explicit human decision.
- Memory informs planning and defaults; it never overrides a live quality gate or a current human instruction.

## Outputs
`memory/decisions.jsonl`, `memory/rejections.jsonl`, `memory/recommendations.jsonl`, `memory/patterns.md`, `memory/brief-<module>.md`, `memory/preferences.md`.

## Acceptance checks
Recall brief produced before planning; every gate failure and human rejection recorded with a reason code; patterns file updated when a threshold is crossed; no duplicate or contradictory open recommendations.

## Boundaries
Never approve content, never relax a gate, never store secrets or personal data in the ledger.
