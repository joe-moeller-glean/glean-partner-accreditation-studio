# Custom Connector curriculum — review of v1 and change log to v2

**Date:** 2026-09-26 · **Scope:** `plan/connectors-custom-connectors-research.md` (v1 research), `plan/custom-connector-accreditation-plan.md` (v1 plan), and the connector rows of `plan/depth-overhaul-2026-09-26/02-technical-builders.md`.
**Result:** v1 was directionally correct but too thin for expert learning, and it contained four factual defects and two source-ledger defects. v2 (this folder) replaces the v1 module descriptions with full build contracts. v1 files remain for history; they now point here.

## 1. How the review was done

1. Every v1 claim was compared against the current primary text of the Glean product docs, Glean Developer docs, SDK docs, and the internal program documents. The text of each source was read in full, not from search snippets.
2. Additional research covered: SDK architecture, connector types, indexing modes, `PushUploader`, batching, HTTP client, pagination, rate limiting, permissions, status/debugging, CLI, deployment, observability; Indexing API permissions, document model, datasource setup, categories, custom properties, custom metadata, activity, authentication, rate limits, bulk upload model, test datasources, MIME types, troubleshooting; crawl limits; MCP/tools setup from Connectors; the Custom Connector Best Practices deck; the Scoping Questionnaire; the Intake Form v2; the Competency Program Guide and Submission Workbook; the Partner-led Development Process; the internal Connector Request Process; three partner competency reviews; the Custom Connector Code Review skill; the internal Custom Datasource Debugging Playbook and Document Deletion design; Slack threads in help-developer-platform, help-connector-escalations, and launches.
3. Each module was then checked against the depth standard in `plan/depth-overhaul-2026-09-26/00-portfolio-audit-and-standard.md` (explanation depth, diagram specification, worked example, guided practice, transfer task, job aid, aligned assessment).

## 2. Factual defects in v1 (fixed in v2)

| # | v1 statement | Problem | v2 correction | Evidence |
|---|---|---|---|---|
| F1 | "Web connector: a crawler pattern for accessible web content." | The docs do not define this type. The product docs list **native**, **web history**, **push API**, and **partner** connectors. Web history connectors make page *titles* from a user's browser history searchable, private to that user. The Scoping Questionnaire separately asks whether the "native Glean Web Crawler datasource" can crawl the source. | Teach the four documented types. Treat a web-crawler datasource as a native option to check during scoping, not as a separate connector type. | `S-01`, `S-31` |
| F2 | "Glean stores raw connector data before downstream processing so ingestion is decoupled from processing and can be reprocessed." | No reviewed source states this. | Removed. v2 teaches the documented three stages for push data: **upload → processing → indexing**, plus the documented reprocess endpoints. | `S-07` |
| F3 | "Delete or tombstone removed source records. A full replacement … must not accidentally omit records." | Correct in spirit but incomplete. v1 did not teach the mechanism that makes deletion work (**stale-document deletion on bulk replacement**), the platform safeguard (**deletion pauses for 7 days when more than 20% would be deleted**), or that incremental uploads **never** delete. | CON-201, CON-203, CON-204 teach replacement semantics, the safeguard, and explicit deletes as a core concept. | `S-12`, `S-13`, `S-19` |
| F4 | Identity: "Map users, groups, … memberships." | Omits hard ordering rules: users must be indexed **before** they are referenced; groups require memberships; streaming SDK connectors do **not** run the identity crawl. | CON-203 and CON-204 teach these as hard rules with negative tests. | `S-16`, `S-20`, `S-21` |

## 3. Source-ledger defects in v1 (fixed in v2)

| # | Defect | Correction |
|---|---|---|
| L1 | The Best Practices deck URL was mistyped (`...15HvWzUvLYZlXzoHX...`). The mistyped link failed to load, so v1 did not use the deck's content. | Correct URL `https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg`. The deck was read in full for v2. |
| L2 | Two copies of the Competency Program Guide exist (Sam Cugini, `1mADzsGI…`; and a Joe Moeller copy, `1Dy5ZFo2…`). v1 cited one without stating which copy is the system of record. | v2 cites the text read in full (`1mADzsGI…`, "LAST UPDATED: February 2026"). **Open decision OD-1:** program owner names the system-of-record copy. |

## 4. Coverage gaps in v1 (filled in v2)

| Gap | Why it matters for an expert | Where v2 teaches it |
|---|---|---|
| Stale-document deletion and the 20% / 7-day safeguard | The most damaging custom-connector failure is a partial full crawl that deletes most of the index. | CON-201 §4, CON-203 §5, CON-204 §6, BLD-202 lab stage 9 |
| Upload vs processing vs indexed states | "UPLOAD COMPLETED" does not mean searchable. Most support escalations start from this confusion. | CON-201 §5, CON-301 §4 |
| Permission evaluation rules | Learners must predict visibility from `allowAnonymousAccess`, `allowAllDatasourceUsersAccess`, `allowedUsers`, `allowedGroups`, `allowedGroupIntersections`. | CON-203 §6 |
| `isUserReferencedByEmail` | Decides whether ACLs reference email or datasource user ID. A wrong choice makes every ACL match nobody. | CON-202 §5, CON-203 §6 |
| Activity via Client API | Activity is pushed with a **Client API** token scoped to ACTIVITY and `X-Glean-ActAs`, not with the Indexing token. Without activity, custom results rank lower. | CON-201 §3, CON-203 §9 |
| Custom properties vs custom metadata | Two different mechanisms with different scopes, types, update costs, and UI controls. | CON-203 §8 |
| Datasource category, object definitions, URL regex, test datasource, beta users | These decide ranking, facets, rendering, and safe testing. | CON-203 §3–4 |
| Content limits | 64 MB fetch limit and 16.875 MB indexable text limit; unsupported MIME types. | CON-202 §7, CON-203 §7 |
| Glean API rate limits | `/indexdocument` 10 rps; `/indexdocuments` 600 docs/min; `/processalldocuments` once every 3 hours per datasource. | CON-203 §10, CON-204 §5 |
| Token model | Indexing tokens: Glean-issued only (no OAuth), required expiry, optional IP allow-list, optional rotation (min 1440 min), datasource-scoped or global. | TEC-201, CON-301 §3 |
| SDK internals | Four base classes, identity-crawl behaviour, checkpoint ownership, batching caps (1000 docs / 5 MiB), `upload_max_workers`, first/last page sequencing, error hierarchy, observability metrics, three test phases, CLI exit codes. | CON-204 |
| MCP placement in Connectors | New deployments (created on or after 22 Sep 2026) set up catalog MCP integrations from Connectors; one app can have separate indexing and tools entries. | CON-101 §4 |
| "When not to use" criteria from the deck | Native exists; real-time/live; large structured data lake; time-series/sensor data. | CON-101 §6 |
| Reviewer rubric | The Code Review skill scores 16 categories and prioritises fixes Required/High/Medium/Low. Partner reviews repeatedly flagged stable IDs, secrets, anonymous access, state management, and production deployment. | ACC-107, BLD-201 §7 |
| Partner-built connector publishing | Intake Form v2 defines listing fields and a customer-facing documentation structure. | CON-301 §7 |
| Internal-only material boundary | The internal Request Process deck contains effort estimates, pricing constructs, and internal support routing. | Do **not** place in partner-facing courseware. Use only to brief Glean reviewers (CON-301 §9, OD-6). |

## 5. Design defects in v1 (fixed in v2)

1. **Modules were outlines, not lessons.** v1 gave 4–6 outcome bullets per module. v2 gives, per module: learner question, outcomes, prerequisite knowledge, a full teaching sequence with the explanation content, misconceptions, diagram specifications, worked example, guided practice, transfer task, assessment items with rationale, job aid, and claim IDs.
2. **No shared case.** v2 adds one fictional case organization used across all modules, with constraints that change per module (`10-case-packet-northbeam.md`).
3. **Assessment was recognition-level.** v2 uses scenario items with explained distractors, artifact rubrics, and hard gates.
4. **Time estimates were copied from the tracker.** v2 separates active learning, lab, and assessment time. Totals increase; roadmap owner approval is required (OD-3).
5. **BLD-201 overlapped CON-201.** v2 assigns ownership: CON-201 owns *how the platform works*; BLD-201 owns *design choices and failure-mode engineering*.

## 6. Items that remain unverified (do not teach until resolved)

| ID | Item | Why unresolved | Owner route |
|---|---|---|---|
| U1 | Retention deletion for custom datasources | A 2024 Slack answer says a 90-day retention deletion applies to every datasource. The internal deletion design says the retention clause is set on each **non-custom** datasource instance. The two conflict. | Connectors engineering (help-developer-platform) |
| U2 | Typical processing latency for push uploads | Bulk-indexing doc says "around 15–20 minutes"; auth doc says "Wait 5–10 minutes"; quickstart says "a few minutes"; the deck gives fast/average/worst ranges. | Teach as a *range that varies*; never as an SLA. |
| U3 | Employee/people indexing lifecycle | SDK v1.1.0 notes "preserve employee replacement compatibility"; the Indexing API lists People endpoints. Current recommended path for people data is not confirmed for this curriculum. | Developer platform owner |
| U4 | Glean-hosted custom connector availability to partners | Product docs describe a Glean-hosted Docker option. The internal process states selection criteria for Glean hosting. Partner access to that option is not confirmed. | Connector PM |
| U5 | Which Competency Guide copy is authoritative | See L2. | Partner program owner |
| U6 | Platform-side 20% safeguard vs internal dynamic threshold | Public doc: 20% pause for 7 days. Internal design describes dynamic thresholds and different pause durations for native crawls. Teach only the public rule. | Connectors engineering |
| U7 | Scope of the 20% / 7-day pause | The public doc states the pause for stale documents of an upload. Whether a later successful bulk upload overrides or inherits the pause is not documented. CON-301 scenario is written to avoid depending on it. | Developer platform owner |
