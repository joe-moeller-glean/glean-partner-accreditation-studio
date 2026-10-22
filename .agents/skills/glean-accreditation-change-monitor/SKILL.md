---
name: glean-accreditation-change-monitor
description: Monitor accreditation sources and product behavior for drift and open bounded refresh work. Use for scheduled scans, freshness audits, and maintenance queues.
---
# Accreditation Change Monitor and Scheduler

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md` before proposing updates. Refresh evidence first and preserve the standard's stable IDs, assessment separation, and QA gates.

**Mission:** keep the whole portfolio true over time by watching for drift and opening the smallest job that fixes it.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 16a Schedule Operator | Create and maintain recurring runs via `request_create_automation` (read `/home/user/skills/automation_trigger_configuration/SKILL.md` first) |
| 16b Source Watcher | Re-check every `sources.json` entry: updated date, moved/broken link, ownership change, deprecation |
| 16c Product Change Watcher | Watch product docs, release notes, and code for behavior changes affecting verified claims |
| 16d Program Change Watcher | Watch program, pricing, packaging, badge, and policy changes affecting module framing |
| 16e Link and Asset Integrity Checker | Broken links, missing assets, dead job aids, stale screenshots past their capture window |
| 16f Signal Analyst | Learner feedback, completion and drop-off points, item-level pass rates, support tickets, `data_analysis` for LMS metrics |
| 16g Impact Scorer | Score each drift by learner impact × claim centrality × audience size → `critical/high/medium/low` |
| 16h Job Proposer | Open one narrow job per impacted module with proposed `request_type`, affected IDs, and evidence |
| 16i Memory Consulter | Check prior rejections and recommendations before proposing; never re-propose a rejected change without new evidence |

## Cadence defaults
| Cadence | Scan |
|---|---|
| Weekly | Source drift and link integrity across released modules |
| Monthly | Full freshness audit; anything past its window becomes a refresh candidate |
| Quarterly | Assessment calibration, engagement/drop-off review, brand-drift sweep across paths, design-system conformance check |
| Event-driven | Product release, program change, brand update, or a failed LMS import |

## Outputs
`plan/refresh-queue.json`, `monitoring/scan-<date>.md` (per module: drift found, impact, proposal, memory context), automation records.

## Rules
- Scans never edit modules or publish. They produce proposals only.
- Re-check product-behavior claims against current product documentation, not only the source URL's modified date. A changed trigger, mode, limit, permission, beta flag, or lifecycle term is a content-drift signal even when the old deck is unchanged.
- Prefer the smallest viable request type: `targeted_update` before `refresh`, `refresh` before rebuild.
- Suppress noise: no proposal for cosmetic source edits that do not change a claim.
- Batch related drift across modules into one shared-asset or terminology job when the fix is shared.
- For scroll modules, also scan the declared band count, rail/progress contract, breakpoint rules, and package allowlist when the shared theme or builder changes.

## Escalate when
A `critical` inaccuracy is live — propose immediate unpublish or hotfix and notify the module owner in the same run.

## Boundaries
Never modify content, never bypass gates, never auto-approve its own proposals.
