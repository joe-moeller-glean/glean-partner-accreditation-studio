# Custom Connector Competency — curriculum source package (v2)

**Status (2026-09-27):** all 10 modules built as SCORM 1.2 v1.0.0 in `learning/modules/`, packaged in `dist/`, and registered as `learning/accreditations/accred-custom-connectors/`. State: `built_pending_human_review` — not released. Build: `python3 tools/agents/build_connectors.py validate|generate|package`, then `node tools/agents/runtime_qa.js ...` and `python3 tools/agents/finalize_connectors.py`. Release blockers per module are in `learning/modules/<id>/qa/report.json`.

Authoring-source status (2026-09-26): Supersedes `plan/custom-connector-accreditation-plan.md` (v1) and `plan/connectors-custom-connectors-research.md` (v1) for module content.

## What is in this folder

| File | Purpose |
|---|---|
| `00-review-and-change-log.md` | Review of v1: factual defects, ledger defects, coverage gaps, open verification items |
| `sources.json` | 62 sources with authority tier, owner, audience, review cadence |
| `claims.json` | 246 claims; each excerpt verified **verbatim** against the source text on 2026-09-26 |
| `tools/build_ledger.py` | Regenerates and re-verifies the ledger from saved source text |
| `10-case-packet-northbeam.md` | Shared fictional case, persona accounts, and the Beacon lab-fixture specification |
| `CON-101` … `ACC-107` | One build contract per module (outcomes, full teaching sequence, diagrams, worked example, practice, transfer, assessment, job aid, claim IDs) |
| `accreditation.yaml` | Proposed badge definition (kept here until modules exist in `learning/modules/`) |

## Path and time

| Order | Module | Level | Learn | Practice/lab | Assess | Total h | Status |
|---:|---|---|---:|---:|---:|---:|---|
| 1 | CON-101 Connector Fundamentals | 100 | 60 | 20 | 15 | 1.6 | New |
| 2 | CON-201 Indexing Architecture & Data Flow | 200 | 80 | 30 | 15 | 2.1 | New |
| 3 | CON-202 Scoping & Intake | 200 | 70 | 45 | 15 | 2.2 | New |
| 4 | TEC-201 Connector Prerequisites (+custom delta) | 200 | 30* | 20* | — | 0.8 + 0.8 | Existing + delta |
| 5 | BLD-201 Best Practices | 200 | 90 | 45 | 20 | 2.6 | Refresh |
| 6 | CON-203 Indexing API & Data Model | 200 | 80 | 60 | 15 | 2.6 | New |
| 7 | CON-204 Indexing SDK | 200/300 | 90 | 120 | 20 | 3.8 | New |
| 8 | BLD-202 Implementation Lab | 300 | — | 240 | 60 | 5.0 | Refresh |
| 9 | CON-301 Operations, Security, Handoff | 300 | 75 | 45 | 15 | 2.3 | New |
| 10 | ACC-107 Capstone | 300 | 90 | 120 | 90 | 5.0 | New |
| | **Total** | | | | | **≈28.8 h** | v1 estimate was 16.8 h |

\* delta added to the existing TEC-201 duration.

Dependency order: CON-101 → CON-201 → CON-202 → TEC-201 → BLD-201 → CON-203 → CON-204 → BLD-202 → CON-301 → ACC-107. CON-201 and CON-202 may run in parallel after CON-101.

## Topic coverage (requested topics → where taught)

| Topic | Primary | Depth |
|---|---|---|
| Connector basics; what a connector does | CON-101 §1 | Two functions; three data families |
| Connector types (native, web history, push, partner) | CON-101 §2 | Comparison + support ownership |
| Indexed vs live vs hybrid | CON-101 §3, CON-201 §6 | Freshness, permissions, runtime choice |
| MCP and tools | CON-101 §4 | Boundary, setup location, hybrid example |
| Full indexing architecture, every step | CON-201 §2–5 | 9-stage pipeline, states, shared queue, permission evaluation |
| Native vs custom | CON-101 §2, §5; CON-301 §6 | Ownership, namespace, migration |
| When to use / not to use custom | CON-101 §5–6; CON-202 §3 | Five-question sequence; four "do not build" cases; gap costs |
| Scoping and intake | CON-202 | Questionnaire A–H, capacity math, identity, hosting, risk |
| Custom connector structure | BLD-201 §1; CON-204 §1, §4 | Reference architecture; two classes + factory |
| APIs (Indexing, Client, activity, metadata) | CON-203 | Surface, tokens, semantics, identities, ACLs, limits, debug |
| Libraries (Indexing SDK, API clients, Web SDK boundary) | CON-204; CON-203 §1 | SDK internals; when to use API directly |
| Indexing SDK | CON-204 | Classes, data client, transform, modes, uploader, tests, CLI, observability, deploy, Connector Builder |
| Best practices | BLD-201 | IDs, ACLs, freshness, deletion, completeness, reliability, state, security |
| Production operations and security | CON-301 | Hosting, deploy, secrets, monitoring, incidents, migration, docs, maintenance |
| Official competency and renewal | ACC-107 | Mapping to workbook; review; renewal |

## Authority and audience rules

1. Product and API behavior: T1 product and developer docs only. `sources.json.authority_order`.
2. Program rules: T2 program-policy documents.
3. Internal engineering, reviewer, Slack, and meeting-note sources (T3/T4) shape rubrics, misconceptions, and anonymized cases. They are **never** learner-facing product claims. `claims.json[].learner_facing` marks this.
4. `S-51` (internal Connector Request Process) is internal-only: no effort estimates, pricing constructs, or internal routing in partner courseware.
5. Every factual sentence in learner copy carries a `claim_id`. Sections marked `(S-xx)` without a claim ID must get claim IDs during authoring (phase 4–5 of the studio flow).

## Open decisions (need owners before production)

| ID | Decision | Owner |
|---|---|---|
| OD-1 | Which Competency Program Guide copy is the system of record | Partner program |
| OD-2 | Approve `accred-custom-connectors` as a separate badge (vs folding into Builder) | Roadmap owner |
| OD-3 | Approve ≈28.8 h path and BLD-201/BLD-202 duration and level changes | Roadmap owner |
| OD-4 | SMEs: Indexing API, Indexing SDK, connectors engineering, TEC-201, BLD-202 | Partner SE lead |
| OD-5 | Build and host the Beacon fixture; provision disposable test datasources and persona accounts | Studio + sandbox owner |
| OD-6 | Confirm the internal-material boundary (§ rule 4) | Partner program + Connector PM |
| OD-7 | Offer a partner self-review kit (rubric ± automated review skill) | Partner SE lead |
| OD-8 | Unverified items `U1`–`U7`, `U-201-1`, `U-203-1/2`, `U-204-1` resolved | Named in `00-review-and-change-log.md` |

## Next studio phases (build done; release gates open)

Per module: memory recall → intake (`module.yaml`) → move claims into `learning/modules/<id>/sources.json` and `research/claims.json` → blueprint → experience → production → fact audit → brand/a11y → build → QA → release. Wave order: (1) CON-101, CON-201; (2) CON-202, TEC-201 delta, BLD-201; (3) CON-203, CON-204, BLD-202; (4) CON-301, ACC-107.
