# CON-201 — Glean Indexing Architecture and Data Flow

| Field | Value |
|---|---|
| Level · path | 200 · Custom Connector Competency |
| Time | 80 min learning · 30 min practice (trace lab) · 15 min assessment = **2.1 h** |
| Prerequisites | CON-101 |
| Design system | `scroll-canvas-v1`; the signature moment is one Beacon page travelling the full pipeline |
| Owns | How the platform ingests, processes, secures, and retrieves connector data; states; freshness and deletion mechanics; permission evaluation |
| Does not own | Design choices (BLD-201), endpoint payloads (CON-203), SDK internals (CON-204), incident runbooks (CON-301) |
| Case | Northbeam: "we published pages this morning; the upload returned 200; they are not in Glean" |

## Learner question

"Between 'the connector pushed it' and 'Assistant cited it', what happens, what can go wrong at each step, and how do I prove which step failed?"

## Outcomes

- `OBJ-201-1` Trace one record through every stage of the native pull path and the custom push path, naming the owner of each stage.
- `OBJ-201-2` Distinguish **upload accepted**, **processing**, and **indexed**, and name the evidence for each.
- `OBJ-201-3` Explain how content, identity, permissions, and activity move through one shared pipeline, and why one backlog can delay another.
- `OBJ-201-4` Explain replacement (bulk) versus additive (incremental) updates, stale-document deletion, and the deletion safeguard.
- `OBJ-201-5` Predict whether a given user can see a given document from its permission fields, identity uploads, and datasource visibility.
- `OBJ-201-6` Explain what happens at query time: path choice, permission filtering, grounding, and click-through.

## Misconceptions

| Misconception | Repair |
|---|---|
| "HTTP 200 means it is searchable." | Upload acceptance, processing, and indexing are separate stages. `C-072` `C-160` |
| "Documents stay until I delete them." | A bulk upload replaces the datasource; anything omitted is deleted as stale. `C-101` |
| "Incremental runs clean up deletions." | Incremental uploads are additive; only a full replacement reconciles deletions, unless explicit deletes are sent. `C-163` |
| "If the ACL is on the document, it works." | ACLs evaluate only against identities Glean knows. An unknown group matches nobody. `C-196` `C-205` |
| "Latency is fixed." | Timing varies with queue load, source limits, and identity lag; worst case can exceed 24 hours. `C-232` `C-233` |

---

## Teaching sequence

### §1 Two ingestion paths, one platform (≈500 words; `OBJ-201-1`)

**Pull (native).** Glean's connector calls the source APIs, fetches content and the permission map, parses them, and keeps them current through webhooks and incremental crawling. `C-003` `C-017` The Best Practices deck describes a three-tier freshness system for native connectors: webhook notifications, a daily incremental fetch, and a full re-crawl every 4 weeks as a default catch-all. `C-230` `C-231`

**Push (custom).** There is no Glean crawler. The builder's code fetches from the source, transforms records, and pushes documents, users, permissions, and metadata through the Indexing (Push) API. `C-041` `C-050` Scheduling like a native connector applies only when the connector is deployed in the Glean cloud instance. `C-042` Otherwise the builder owns detection, schedule, and reconciliation.

**Key sentence for the learner:** in the push path, *every* freshness and deletion behavior that a native connector gives you for free is now your code's job.

### §2 The pipeline, stage by stage (≈1,200 words; `OBJ-201-1`, `OBJ-201-3`)

Present as nine stages. For each: *what happens · who owns it · evidence it worked · what fails*.

| # | Stage | What happens | Owner (push path) | Evidence | Typical failure |
|---|---|---|---|---|---|
| 1 | Change in source | A page is created, edited, shared, deleted; a user joins a group | Source | Source audit/`updated_at` | Change not exposed by API |
| 2 | Detection | Connector notices the change (webhook, event, or scheduled run) | Builder | Run log with fetched count | `updated_since` precision gap; missed webhook |
| 3 | Fetch | Connector reads content, identities, ACLs | Builder | `items_fetched` metric | 429s, empty-200 pages, expired token |
| 4 | Transform | Map to Glean document, identity, permission models | Builder | `documents_transformed` metric | ISO timestamps, unstable IDs, empty body |
| 5 | Upload | API accepts the payload | Builder → Glean API | HTTP 200 / upload history | 400 validation, 409 conflict, 413 size, 429 rate |
| 6 | Queue and prioritize | Changes enter a shared queue | Glean | Status shows upload but not processing | Backlog from any data family |
| 7 | Identity and permission dependency checks | Glean verifies identities and access data and waits for dependencies | Glean | Identity counts; debug user | Groups without memberships; users never indexed |
| 8 | Parse, chunk, extract signals | Content is parsed and chunked; ranking signals extracted | Glean | Processing history timestamp | Unsupported MIME; content over limits |
| 9 | Index and graph update | Search index and Knowledge Graph updated; the item becomes visible to permitted users | Glean | Document status indexed; search as user | Datasource not enabled; ACL excludes user |

Sources: the deck's "How new data gets indexed into Glean" flow (`C-232` `C-234`), troubleshooting stages (`C-070` `C-072` `C-073`), SDK status guidance (`C-160`), and the API response codes (`C-140` `C-058`).

**One shared queue.** Documents, permissions, people data, and activity flow through the same backend queueing and indexing system at a high level, so one type of backlog can affect another. `C-232` Teach the practical consequence: a large identity reload can delay document visibility.

**Architecture view (for architects).** The deck shows the push path entering a handler for identity, content, and activity; documents flowing to an indexer and an embedding service; users and groups flowing to an identity store; and a query path that combines keyword and semantic matches before ranking and the LLM handler. Teach at that abstraction. **Do not** use internal component names in learner copy until an SME confirms they are approved for partners (open item `U-201-1`).

**Enterprise Graph.** Connectors populate the index plus identity and permission structures; the graph layers relationships and signals on top. `C-018` Identity resolution aligns identities across systems. `C-019` This is why email alignment (CON-202) matters beyond ACLs.

### §3 Upload, processing, indexed — the three states (≈600 words; `OBJ-201-2`)

The single most important operational distinction in the path.

- **Upload.** The API accepted the payload and queued it. For users, `bulkUploadHistory` shows `UPLOAD COMPLETED`. That only means the API accepted the upload. `C-072`
- **Processing.** Glean expands derived groups and memberships and processes documents. `C-073` Documents become searchable when the `processingHistory` timestamp is after the `bulkUploadHistory` timestamp. `C-070`
- **Indexed.** The item is in the index, and permissions are applied. Indexing is asynchronous. `C-110`

**Timing.** Teach a range, never an SLA. Developer docs describe "a few minutes" and, for bulk uploads, "around 15–20 minutes"; the deck describes a fast path of minutes, an average of minutes to about an hour, and a worst case of several hours to 24+ hours during initial sync, heavy backlog, strict API limits, or identity lag. `C-110` `C-104` `C-233`

**Rule for the learner:** "Accepted is not searchable. Prove indexed with status, then prove visible by searching as the user." `C-160` `C-200`

### §4 Replacement, increments, and deletion (≈900 words; `OBJ-201-4`)

**Two write semantics.**
- **Bulk (replacement).** A series of `/bulkindexdocuments` requests with one `uploadId` fully replaces the datasource's documents. After a successful bulk upload, every document not in that upload is deleted asynchronously. `C-101` `C-109` (Internal field confirmation for reviewers: `C-304`.)
- **Additive (incremental).** `/indexdocuments` adds or updates documents without affecting others. `C-102` It never deletes.

**How deletions reach Glean.** Two ways only: (1) explicit delete calls for known removed items; (2) a full replacement that omits them (stale-document deletion). The SDK states this directly: stale-document deletion is what makes source deletions propagate — and what makes a partial full crawl dangerous. `C-163` `C-170`

**The failure that defines this path.** If a full run fetches only part of the source (an empty page returned early, an expired token, a leftover test limit) and still completes, the omitted documents are deleted as stale. A failed crawl is recoverable; a "successful" crawl that deleted most of the index is not. `C-170` `C-171`

**The platform safeguard.** The bulk upload model pauses stale-document deletion for 7 days if the deletion would exceed 20% of documents. The flag `disableStaleDocumentDeletionCheck = true` disables the check when a large deletion is intended. Deletions are asynchronous; `/processalldocuments` makes them take effect immediately. `C-107` `C-108`

**Teach the second-order effect.** The safeguard protects against mass deletion, but it also means an *intended* large clean-up will not appear for up to 7 days unless the flag is set. Field escalations show exactly this: deleted documents still visible because of the stale deletion check. `C-305` (internal evidence; use as an anonymized case, not as a product claim.)

**Concurrency.** A new bulk upload cannot start before the previous one finishes; after a failed upload, the next must set `forceRestartUpload`. `C-105` `C-106`

**Native contrast (one paragraph).** Native connectors have their own deletion handling tied to webhooks and full crawls; learners do not configure it. Keep internal deletion thresholds out of learner copy (`U6`).

### §5 Permission evaluation (≈900 words; `OBJ-201-5`)

**The visibility rule.** A user can view a custom document if any one of these is true: `C-071` (source: troubleshooting)
1. `allowAnonymousAccess` is true — anyone signed in to Glean can view search results for it. `C-117`
2. `allowAllDatasourceUsersAccess` is true **and** the user has been indexed as a user of that datasource. `C-071`
3. The user is in `allowedUsers`, **or** a member of one of `allowedGroups`, **or** satisfies one of the `allowedGroupIntersections` (member of every group in one entry). `C-198`

**Preconditions that learners forget.**
- Users must be indexed before they are referenced; indexing a user grants no access by itself. `C-111` `C-112`
- An ACL naming a group Glean has never seen matches nobody. `C-196`
- Groups without memberships produce ACLs that can never match. `C-201`
- `isUserReferencedByEmail` decides whether ACLs reference email or a datasource user ID. `C-118`
- Permissions and memberships are processed asynchronously. `C-116`

**Datasource visibility gate.** Even a correctly permitted document is hidden if the datasource is not enabled for search; the admin enables it for a test group or for all teammates. `C-103` (Internal debugging playbook, for reviewers: enabled-for-all, enabled-for-test-group, and not-enabled states `C-303`.)

**Click-through.** Opening a result usually sends the user to the source, which may enforce access again. `C-025` A Glean-visible result that the source then blocks is a symptom of an ACL mapping that is *broader* than the source — a security defect, not a UX quirk.

**Interactive: "Who sees this page?"** Present five Beacon pages and five personas (case packet §6). Learner predicts visibility, then reveals the rule that decided it. Include: a nested group; a pharmacist+clinic intersection; `allowAllDatasourceUsersAccess` with an un-indexed user; a group with no memberships; a legacy contractor with no Okta identity.

### §6 Query time (≈500 words; `OBJ-201-6`)

- Glean parses intent, chooses index, live, or hybrid paths per connector capability, retrieves context while enforcing source permissions, and passes permission-filtered context to the model. `C-023` `C-026`
- Validate a connector in **Search first** — coverage and permissions — before relying on Chat, Assistant, or Agents. `C-024`
- Ranking uses metadata and activity signals; a custom datasource without activity has weaker signals. `C-016` `C-135`

### §7 Diagnosis walk-through (signature moment; ≈600 words)

Solve the Northbeam complaint live, stage by stage. Each step rules out one layer (SDK status guidance `C-202`):

1. **Was it uploaded?** Check the connector run's posted documents (mock or logs). If absent → fetch/transform bug. Stop.
2. **Has it finished indexing?** Document status; compare processing time to upload time. `C-070`
3. **Is the datasource healthy?** Uploaded vs indexed counts; a gap points at rejected documents. `C-202`
4. **Is the datasource visible?** Enabled for all or only a test group? `C-103`
5. **Can this user see it?** Check document access for the user; if false, inspect the document's ACL and the user's groups. A correct-looking ACL is wrong if the identities were never pushed. `C-205`
6. **Did it appear and then vanish?** A later full run omitted it → stale deletion. `C-203`

Result in the case: pages were uploaded and indexed; the datasource was enabled only for a test group during UAT. Second finding: 14 pages use a new `clinic-031` group that the identity run never pushed.

---

## Diagrams

### `DGM-CC-201-A` — Source-to-answer pipeline (signature)
- **Type:** horizontal flow with 9 stage cards, a swimlane split "Builder-owned" vs "Glean-owned", and a branch showing native pull vs custom push entering at stage 2 vs stage 5.
- **Overlays (toggle):** evidence per stage; failure per stage; which data family (content/identity/permission/activity).
- **Claims:** `C-003` `C-017` `C-041` `C-050` `C-070` `C-072` `C-073` `C-110` `C-232` `C-234`.
- **Text equivalent:** the §2 table.

### `DGM-CC-201-B` — Replacement vs additive
- Two timelines. Replacement: set A → upload set B → A∖B deleted (with 20%/7-day gate). Additive: set A + set C → A∪C, nothing deleted. `C-101` `C-102` `C-107`.

### `DGM-CC-201-C` — Visibility decision tree
- Diamonds: datasource enabled? → anonymous? → all-datasource-users and user indexed? → in allowedUsers / allowedGroups (after membership expansion) / an intersection? → visible. `C-071` `C-117` `C-198` `C-103`.

## Worked example

Full trace of Beacon page `48213` "Insulin cold-chain storage" from edit to cited answer, including the timestamp at each stage and the evidence the partner collects. Then the same page when the editor removes the `contractors` group: show that the text is unchanged but the ACL must still be pushed, and that the visible change waits on processing. `C-116` `C-205`

## Guided practice — "Trace lab"

Six short tickets. For each, the learner picks the stage and the evidence to request first:
1. "Upload 200, not in search after 5 minutes." → stage 6–9; wait and check status; not a defect yet. `C-110`
2. "Uploaded 38,400; indexed 36,900." → rejected documents; check datasource status. `C-202`
3. "Visible to me, not to a nurse." → permissions/identity. `C-205`
4. "Yesterday 38,400 pages; today 9,000." → partial full crawl; safeguard likely paused deletion. `C-107` `C-170`
5. "We deleted 30% on purpose a week ago; still visible." → safeguard; flag needed. `C-107`
6. "Snippets empty; title only." → body/MIME or size; CON-203 limits. `C-090` `C-091`

## Transfer task

A different source (CourseForge) with enrollment-based ACLs and an offset-paginated API. Learner writes the nine-stage trace for "a newly enrolled learner cannot see a course" and names the evidence per stage.

## Assessment (12 items; mastery 80%)

| # | Stem | Key | Distractor logic | Obj |
|---|---|---|---|---|
| 1 | Order the stages from upload to searchable. | Upload → processing → indexed | "Indexed before processing" | 2 |
| 2 | `UPLOAD COMPLETED` for users, indexed users far lower. First action? | Compare uploaded vs indexed; check processing; reprocess memberships if stuck | "Re-upload everything" wastes and may not fix (`C-072` `C-076`) | 2 |
| 3 | Incremental run pushes 40 updates; 12 pages were deleted in the source. What happens in Glean? | Deleted pages remain until explicit delete or full replacement | "Incremental deletes them" (`C-163`) | 4 |
| 4 | Full run fetched 30% of pages due to a swallowed error and succeeded. Immediate platform behavior? | Stale deletion is paused up to 7 days because >20% | "Deleted immediately" (`C-107`) | 4 |
| 5 | Document has `allowAllDatasourceUsersAccess: true`; user not indexed as datasource user. Visible? | No | (`C-071`) | 5 |
| 6 | ACL lists group `clinic-031`; no group upload exists. Visible to members? | No — unknown group matches nobody | (`C-196`) | 5 |
| 7 | Intersection entry `[pharmacists, clinic-014]`; user in pharmacists only. | Not visible via that entry | (`C-198`) | 5 |
| 8 | Why can an identity reload delay new documents? | Shared queue | (`C-232`) | 3 |
| 9 | Where should connector validation start? | Search, coverage and permissions | (`C-024`) | 6 |
| 10 | Result visible in Glean; source denies on click. What does this indicate? | Glean ACL broader than source — security defect | (`C-025` `C-020`) | 5 |
| 11 | Which statement about custom scheduling is true? | Native-like scheduling only when deployed in Glean cloud | (`C-042`) | 1 |
| 12 | What makes source deletions propagate in a replacement design? | Stale-document deletion of omitted documents | (`C-163` `C-101`) | 4 |

## Job aid — "Where is my document?" card

The six-step diagnosis (§7) with the evidence to capture at each step, and the visibility decision tree.

## Open items

- `U-201-1` Confirm whether internal component names from the deck's architecture slide may appear in partner courseware.
- `U2` Latency is taught as a range.

## Claims used

`C-003` `C-016` `C-017` `C-018` `C-019` `C-020` `C-023` `C-024` `C-025` `C-026` `C-041` `C-042` `C-050` `C-058` `C-070` `C-071` `C-072` `C-073` `C-076` `C-090` `C-091` `C-101` `C-102` `C-103` `C-104` `C-105` `C-106` `C-107` `C-108` `C-109` `C-110` `C-111` `C-112` `C-116` `C-117` `C-118` `C-135` `C-140` `C-160` `C-163` `C-170` `C-171` `C-196` `C-198` `C-200` `C-201` `C-202` `C-203` `C-205` `C-230` `C-231` `C-232` `C-233` `C-234` · internal/field: `C-303` `C-304` `C-305`
