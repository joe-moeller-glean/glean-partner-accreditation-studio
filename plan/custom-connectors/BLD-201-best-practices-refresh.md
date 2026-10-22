# BLD-201 — Custom Connector Best Practices (refresh, v2 contract)

| Field | Value |
|---|---|
| Level · path | 200 · Builder Advanced + Custom Connector Competency |
| Tracker state | Refresh needed · Owner/SME Eugene Wiehahn (confirm current engineering reviewer) |
| Time | 90 min learning · 45 min design practice · 20 min assessment = **2.6 h** (tracker says 1.5 h; approval needed, OD-3) |
| Prerequisites | CON-201, CON-202, TEC-201 |
| Design system | `paged-v1` with one T3 signature: failure-mode matrix resolves over the architecture |
| Owns | Design choices and failure-mode engineering for a production connector |
| Does not own | Platform mechanics (CON-201), payloads (CON-203), SDK code (CON-204) |
| Stable IDs to keep | `OBJ-01..04`, `SCR-01..11`, `INT-SORT/FADE/BRANCH/HOTSPOT` from `plan/modules/BLD-201.md`; new material is added as `SCR-12+`, `OBJ-05..07` |
| Artifacts | Architecture decision record (ADR); failure-mode matrix; test matrix |

## Learner question

"My design works on a happy day. What will it do on the day the API lies, the token expires, a group changes, or 3,000 pages are deleted — and how do I prove it?"

## Outcomes

- `OBJ-01` (kept) Choose a connector architecture for a source and its API characteristics.
- `OBJ-02` (kept, expanded) Design identity, schema mapping, and **permission propagation including permission-only changes**.
- `OBJ-03` (kept, expanded) Handle rate limits, pagination, partial failure, and **full-crawl completeness**.
- `OBJ-04` (kept) Define governance and handoff for production.
- `OBJ-05` (new) Design a freshness and deletion strategy per object family.
- `OBJ-06` (new) Design state, idempotency, and recovery.
- `OBJ-07` (new) Self-review a design against the reviewer rubric.

## Misconceptions (with field evidence)

| Misconception | Repair | Evidence |
|---|---|---|
| "Use titles or URLs as IDs; they're unique." | IDs must be derived from immutable source identifiers; renames otherwise create duplicates and orphans. | Course rule; internal reviewer rule `C-292`; field review flagged stable IDs `C-298` |
| "Bulk index every run; it's simpler." | Bulk is a replacement strategy with wipe risk, not a convenience default. | `C-101` `C-170`; internal reviewer rule `C-291` |
| "Allow anonymous access until ACLs are ready." | Never allow-all "for now"; retrofitting means re-indexing everything. | `C-195` `C-152`; field review flagged anonymous access `C-301` |
| "A JSON file is enough state." | Keep document state in a simple database; file state breaks under concurrency and restarts. | `C-237`; field review `C-300` |
| "Retries handle rate limits." | Pace proactively with a limiter; retries are reactive. | `C-194` |
| "Default retry settings are fine." | SDK default is one retry — deliberately conservative; raise it. | `C-186` |
| "Flatten groups to users for simplicity." | Flattened ACLs go stale when membership changes. | `C-197` |

---

## Teaching sequence

### §1 Reference architecture (≈600 words; `OBJ-01`)

The Best Practices deck's four-step architecture: **(1) fetch content and identities → (2) prepare data for indexing (business logic) → (3) push to Glean → (4) wait for changes**, with three index paths (bulk, incremental, real-time via webhooks), a retry and error-handling layer (retries, backoff, dead-letter queue), and flexible hosting. `C-242` (S-44)

Map to the SDK pipeline so learners see one model: `get_source_data()` (fetch) → `transform()` (prepare) → `PushUploader` (push) → index. `C-157` (S-32)

Two reference deployments from the deck to discuss, not copy: a simple AWS pipeline (secret store, raw data store, indexing function, retry queue and retry function, monitoring), and an "art of the possible" pipeline with sync-state store, scheduler, message router, bulk/index/delete paths, OCR, DLQ, and manual retry. Ask learners which components Northbeam actually needs and why. (S-44)

### §2 Content model and stable IDs (≈700 words; `OBJ-02`)

- **Stable IDs** from immutable source identifiers (`page_id`), never from mutable titles, slugs, or URLs. (Course rule; internal reviewer rubric `C-292`. Public basis: an ID is the document's identity in the datasource — a changed ID is a different document, and bulk replacement deletes the old one `C-101`.)
- **Object types** per entity; set category per object with `docCategory` when entities differ. `C-120`
- **Denormalize when it helps retrieval:** combining relational data into one document object can be better than indexing each row. `C-236` Beacon: comments stay out of phase 1; attachments become their own documents with a parent reference.
- **Timestamps** as epoch seconds; ISO strings fail silently and sort wrong. `C-153`
- **viewURL** must match the datasource `urlRegex` and link back to the source. `C-119` `C-255`
- **Custom properties** for facets decided up front; configure them before uploading. `C-125`

### §3 Identity and permission design (≈900 words; `OBJ-02`)

1. **Mirror the source model, do not simplify it.** Groups stay groups; roles become groups. `C-197` `C-235`
2. **Intersections** for "must be in A and B" rules (pharmacist + clinic). `C-198`
3. **No broad fallbacks** (`allowAnonymousAccess`, allow-all-datasource-users) unless explicitly justified and signed; reviewers reject over-broad permissions adopted because mapping is hard. `C-297` `C-117`
4. **Admin bypasses** are not mirrored as allow-all.
5. **Identity before content.** Users indexed before referenced; groups with memberships; nested groups via member groups. `C-111` `C-114` `C-115` `C-201`
6. **Email identities** when the source supports them. `C-118` (internal reviewer preference `C-296`)
7. **Permission-only changes.** An ACL can change while the body does not. Detection must not depend on content `updated_at` alone; design a permission refresh path with its own cadence. `C-257`
8. **Deletion of access.** Removing a user from a group must remove access in Glean; memberships and groups need their own refresh and deletion story (course rule; internal reviewer rubric `C-293`). Public basis: memberships and permissions are processed as their own objects `C-116`.

### §4 Freshness and deletion strategy (≈900 words; `OBJ-05`)

**Per object family** (documents, users, groups, memberships, permissions), decide: full cadence, incremental cadence, event path, deletion mechanism.

| Pattern | When | Deletion handled by | Risk |
|---|---|---|---|
| Full replacement only | Small corpus, no change feed | Stale deletion on each full run `C-101` | Partial run wipes index `C-170` |
| Incremental + periodic full | Change feed exists | Explicit deletes (tombstones) + periodic full reconciliation | Checkpoint errors create gaps `C-173` |
| Event-driven (webhook) + incremental + full | Webhooks available | Event deletes + full reconciliation | Missed events; ordering |

- Common schedule from the SDK docs: incremental every 15–60 minutes; full nightly or weekly. `C-175` `C-176` The deck recommends incremental plus monthly indexing and webhooks for faster updates. `C-239` Teach both as starting points and let the freshness requirement decide.
- Incremental correctness needs a **durable checkpoint** and a **reliable source-side deletion signal**. `C-174`
- **Checkpoint rule:** record the time *before* the crawl started; write it only after success. `C-173`
- **Overlap windows** when the source's modified-since filter is coarse (Beacon: minute precision). `C-179`
- Beacon design: webhooks unavailable → hourly incremental on pages + tombstone feed; hourly group/membership refresh; nightly full replacement with completeness guard.

### §5 Completeness guards — the signature lesson (≈800 words; `OBJ-03`)

The cold open from the existing blueprint ("200 OK, empty body") becomes the central engineering problem.

- A full crawl must cover the entire confirmed scope before completing. `C-154`
- Never let a partial or failed fetch finish as a successful full crawl; raise instead of returning short. `C-170`
- A paging loop must terminate on a misbehaving source (bounded pages, repeated-cursor check). `C-191` `C-192`
- Offset pagination is unstable when the source is being written during the crawl; prefer cursor or link. `C-190`
- **Guards to design:** (a) compare fetched count against a source total or the previous run; abort above a threshold; (b) treat an empty page without end-of-list proof as an error; (c) alert on a sharp drop in indexed documents run-over-run `C-204`; (d) know the platform safeguard (20% / 7 days) but never rely on it `C-107`.
- Bulk-upload pagination flags must be correct; wrong flags can make a partial upload look complete. `C-074`
- One upload at a time; `forceRestartUpload` only after a failure. `C-105` `C-106`

### §6 Reliability, state, and recovery (≈700 words; `OBJ-06`)

- **Pace, then retry.** Token-bucket limiter set below quota; retries with backoff honoring `Retry-After`; 429 and 5xx retryable; other errors fail fast. `C-193` `C-194` `C-186`
- **Error handling:** check for failed requests and 429s and implement retry logic. (S-44)
- **Dead-letter** for records that fail transform or validation; alert on DLQ growth. `C-242`
- **Idempotency:** re-sending an unchanged document is harmless; design so every step can be re-run.
- **State store:** a simple database of document IDs, source versions, last-pushed hashes, and checkpoints. `C-237`
- **Token hygiene:** automated rotation. `C-238`

### §7 Security, operations, governance (≈500 words; `OBJ-04`)

- Secrets in a managed secret store; never hard-coded. Field reviews repeatedly flag this. `C-299`
- Log redaction for credentials. `C-187`
- Documentation of what is indexed and setup requirements is crucial. (S-44)
- Test with customers early to validate permissions. (S-44)
- Troubleshooting and observability through the datasource debug APIs. (S-44)
- Named maintenance owner and customer-approved maintenance plan (program requirement). `C-265`

### §8 Self-review against the reviewer rubric (≈500 words; `OBJ-07`)

The Glean reviewer scores categories including solution fit, datasource configuration and schema, document indexing and content mapping, user/identity handling, group and membership handling, permissions model and refresh, bulk indexing strategy, incremental refresh strategy, deletion handling, retry/backoff/reliability, security and secrets, hosting and operational readiness, observability, testing, documentation and handoff, and packet completeness, each rated Meets / Partially Meets / Does Not Meet / Not Enough Evidence. `C-295` (Internal reviewer source; learner copy may state the categories as the course's own rubric.)

Two rules to internalize: strong document indexing does not compensate for missing identity, group, or permission coverage `C-290`; every indexed object family needs a deletion story. `C-293`

---

## Diagrams

- `DGM-CONN-01` (shared, reused) — connector lifecycle; add the four-step architecture overlay from §1.
- `DGM-PERM-01` (shared, reused) — permission propagation; add intersection and nested-group examples.
- `DGM-CC-B201-A` (new) — **failure-mode matrix over the pipeline**: stages × failures (empty-200, 429 storm, token expiry, schema drift, permission-only change, group removal, rename, mass delete) with the guard and the evidence for each. This is the T3 signature.

## Worked example (fade-out, existing `SCR-08`)

Beacon ADR, fully worked for pages; learner completes memberships and attachments.

ADR headings: context; decision (hybrid schedule); IDs; object model; identity mode; ACL mapping; freshness per family; deletion per family; completeness guard; rate plan; state store; secrets; observability; risks accepted.

## Guided practice — "Repair the design"

A flawed design document: uses slug as ID; bulk every 15 minutes; offset pagination; group ACLs flattened to users; `allowAnonymousAccess` for "general" pages; state in `state.json`; token in `config.py`; no tombstone handling; incremental uses end-of-run time. Learner finds every defect, assigns priority (Required/High/Medium/Low), and cites the rule.

## Transfer

Design CourseForge: offset-only API, enrollment ACLs, 12,000 courses, daily enrollment churn of 2,000. Learner must decide whether offset instability requires a full reconciliation strategy and how enrollment removals propagate.

## Assessment (10 items + ADR artifact)

**ADR rubric gates:** stable IDs; no broad fallback ACL; deletion story for every object family; completeness guard on full runs; permission-only change path.

**Items (sample):** slug-based IDs after rename (course rule; internal reviewer basis `C-292`); bulk every run (`C-101`); allow-all "for now" (`C-195`); checkpoint write timing (`C-173`); offset pagination during writes (`C-190`); default retries (`C-186`); roles as groups (`C-235`); limiter vs retries (`C-194`); empty page before end (`C-170`); alert signal for partial crawl (`C-204`).

## Job aid (existing `SCR-11`, expanded)

Connector design and handoff checklist + failure-mode matrix + ADR template.

## Claims used

`C-074` `C-101` `C-105` `C-106` `C-107` `C-111` `C-114` `C-115` `C-116` `C-117` `C-118` `C-119` `C-120` `C-125` `C-152` `C-153` `C-154` `C-157` `C-170` `C-173` `C-174` `C-175` `C-176` `C-179` `C-186` `C-187` `C-190` `C-191` `C-192` `C-193` `C-194` `C-195` `C-197` `C-198` `C-201` `C-204` `C-235` `C-236` `C-237` `C-238` `C-239` `C-242` `C-255` `C-257` `C-265` · internal/reviewer: `C-290` `C-291` `C-292` `C-293` `C-295` `C-296` `C-297` `C-298` `C-299` `C-300` `C-301`
