---
name: accreditation-studio
description: Orchestrates Glean partner accreditation and SCORM 1.2 module work. Use when creating an accreditation, creating or updating a module, researching sources, testing a package, scanning for content drift, or deciding a release. Routes each request into one job file and one worker.
---
# Accreditation studio

You are the dispatcher. Research, authoring, verification, and source scans run as separate jobs. A worker loads one procedure from `skills/jobs/` and returns an artifact, a patch, or `blocked` with evidence.

Background runners are not wired up yet. Prompt stubs live in `.agents/prompts/`. Do not create a Cursor Automation, cloud agent, or SDK runner unless the user asks for that kickoff.

## Non-negotiables

1. One SCORM 1.2 ZIP per module. An accreditation references module IDs and never becomes one merged package.
2. Editable source lives in Git. Validate locally before any remote write. Workers open a branch and a pull request. They do not push to the default branch, tag, or publish.
3. Publish only after every required gate passes. Never weaken, skip, or self-waive a gate.
4. Learner-facing facts carry a `claim_id` that resolves to `sources.json`. An unsourced claim blocks the module.
5. No placeholders, invented product behavior, invented metrics, invented customer names, secrets, personal data, unlicensed assets, or runtime network calls in a shipped package.
6. The worker that writes learner content does not approve facts or release. Verification is a separate job.
7. Read the ledger before planning and append to it after a job finishes. Use `skills/scripts/ledger.py` only.
8. Read and follow `skills/references/accreditation-build-standard.md` for every create or update. Depart only with an explicit, documented, user-approved exception.
9. Product behavior uses current product documentation as the primary authority. Decks supply program context and do not override current documentation without a recorded ruling.
10. A shipped package contains runtime files only. Research, QA reports, and `assessment/key.json` stay in the repository.
11. Visual QA uses a real browser against a local HTTP server. A static file read is not visual verification.
12. A local build stays `restricted_preview` until content, clearance, runtime, visual, and LMS gates pass.

## Reference loading

Load only what the current job needs.

| Need | Read |
|---|---|
| Any create or update | `skills/references/accreditation-build-standard.md` |
| How to run one job | `skills/jobs/<research\|author\|verify\|refresh>.md` |
| Job file shape | `skills/references/job-contract.md` |
| Batching, retries, resume | `skills/references/orchestration-rules.md` |
| Roadmap columns | `skills/references/roadmap-integration.md` |
| Ledger | `skills/references/memory-and-learning.md` |
| Layout, scroll, graphics, brand, SCORM | the matching file in `skills/references/` or `skills/brand/` |

## Classify the request

| Request | Job type | Worker procedure |
|---|---|---|
| New accreditation definition | `create_accreditation` | `skills/jobs/author.md` |
| New module, or continue an unfinished module | `create_module` | research, then author, then verify |
| Changed source, fact, screen, quiz item, or asset | `update_module` | research for the affected claims, then author, then verify |
| Sources, claims, or coverage only | `research` | `skills/jobs/research.md` |
| Test, audit, or check, with no content change | `verify` | `skills/jobs/verify.md` |
| Same content, new package | `repackage` | `skills/jobs/verify.md` |
| Broken package, failed import, or runtime defect | `update_module`, then `verify` | reproduce first |
| Drift check or freshness audit | `scan` | `skills/jobs/refresh.md` |
| Update from review feedback | `update_module` | `.agents/skills/accreditation-feedback/SKILL.md` |
| What was rejected or recommended | `retro` | `skills/scripts/ledger.py` only |
| A path, wave, or the whole roadmap | queue of module jobs | `skills/scripts/plan_roadmap.py`, then the rows above |

If the request names no module and no accreditation, ask one question that lists the concrete candidates you found. Do not guess an ID, branch, or publish target.

## Dispatch

1. Resolve the module or accreditation ID, source path, and base branch.
2. Run `skills/scripts/ledger.py brief` for that module and honor prior rejections, or record why a prior rejection no longer applies.
3. Write `plan/jobs/<job-id>.json` using `skills/references/job-contract.md`.
4. Run the matching procedure. One job is one module or one accreditation definition, one objective, and one primary output.
5. On failure, send the failing evidence back to the same procedure once. Then stop and report the blocker.
6. After verify passes, record the ledger, checksum, and release state. Do not tag or announce a badge until every required module is released.

Concurrency stays at 3 modules in flight and one release at a time. Two consecutive release failures stop the queue.

Portfolio order comes from `skills/scripts/plan_roadmap.py`. Shared theme, icons, and diagrams are produced once in `shared/` and reused.

## Gates before release

Required passes: scope, source traceability and freshness, claim verification, learning alignment, brand, graphics, WCAG 2.2 AA where applicable, SCORM structure, runtime behavior, regression against the prior release, offline behavior, runtime-only package contents, and browser evidence.

Run `skills/scripts/lint_module.py`, `skills/scripts/validate_scorm.py`, and `skills/scripts/validate_accreditations.py`. Scroll modules also need the scroll runtime harness and responsive checks.

A warning blocks release unless `qa/waivers.json` records owner, reason, scope, and expiry. No waiver covers an answer-key leak, an unresolved claim, an external runtime dependency, or a blocker or major accessibility defect.

## Versioning

Patch = corrections and asset swaps with the same outcomes. Minor = new or changed screens, interactions, or graphics. Major = changed audience, outcomes, prerequisites, or assessment contract. Preserve screen, objective, interaction, and question IDs. Retiring an ID requires a changelog note.

## Repository

```text
learning/modules/<id>/                 module source and runtime
learning/accreditations/<id>/accreditation.yaml
plan/jobs/<job-id>.json                one job contract
plan/queue.json  plan/status.json
skills/jobs/                           worker procedures
skills/scripts/                        lint, package, ledger, scan
.agents/prompts/                       future headless prompts, not launched
tools/portfolio/                       catalog, connector, and AGT-101 generators
shared/                                theme, SCORM shell, approved media
memory/                                ledger
dist/                                  generated ZIPs, not source
```

## Scripts

| Script | Purpose |
|---|---|
| `skills/scripts/plan_roadmap.py` | Roadmap export to an ordered queue and dependency graph |
| `skills/scripts/scaffold_module.py` | Create a module directory; runtime shell comes from `shared/` |
| `skills/scripts/lint_module.py` | Claims, alt text, brand tokens, placeholders, external dependencies |
| `skills/scripts/build_scorm.py` | Runtime-only SCORM 1.2 ZIP and checksum |
| `skills/scripts/validate_scorm.py` | Manifest, offline behavior, package hygiene |
| `skills/scripts/validate_accreditations.py` | Hierarchy, membership, tracker alignment |
| `skills/scripts/watch_sources.py` | Staleness scan to a refresh queue |
| `skills/scripts/ledger.py` | Append and query decisions, rejections, and recommendations |

## Report

Lead with the outcome. For one module: ID, version, release state, ZIP name, checksum, gate summary, blockers, and pull request link. For a queue: counts by state, released list, blocked list with reasons, and the next jobs. For a scan: impacted modules, proposed job types, and the ledger context for each. Claim a push, tag, or publish only when that write succeeded.
