# CON-203 — Indexing API and the Glean Data Model

| Field | Value |
|---|---|
| Level · path | 200 · Custom Connector Competency |
| Time | 80 min learning · 60 min API lab · 15 min assessment = **2.6 h** |
| Prerequisites | CON-201, TEC-201; basic HTTP/JSON |
| Design system | `paged-v1`; reference panels + lab steps |
| Owns | Wire-level contract: datasources, documents, identities, permissions, properties, metadata, activity, limits, debugging |
| Does not own | SDK abstractions (CON-204); design choices (BLD-201) |
| Artifact | A request collection + verification log proving every lab step |

## Learner question

"If I had no SDK, what exact calls make a document exist, update, disappear, and be visible only to the right people — and how do I prove each one?"

**Why teach the API before the SDK:** the SDK is a client for the Indexing API, not a replacement; the API documentation stays the reference for the wire protocol. `C-150` Engineers who understand the wire contract debug SDK connectors faster, and some tasks (non-Python services, one-off pushes, custom metadata on existing documents) call for the API directly. `C-151`

## Outcomes

- `OBJ-203-1` Navigate the Indexing API surface and choose the right token for each call.
- `OBJ-203-2` Create and configure a datasource with category, object definitions, URL regex, identity mode, and test visibility.
- `OBJ-203-3` Index, update, and delete documents with correct additive vs replacement semantics and upload-session flags.
- `OBJ-203-4` Index users, groups, and memberships in the correct order and write document ACLs for five permission scenarios.
- `OBJ-203-5` Choose between custom properties and custom metadata, and push activity correctly.
- `OBJ-203-6` Diagnose problems with status, document, user, and access-check endpoints and reprocessing calls, within rate limits.

---

## Teaching sequence

### §1 The API surface and tokens (≈600 words; `OBJ-203-1`)

**Two REST APIs.** The Client API is for building client experiences on Glean; the Indexing API (also called the Push API) pushes documents, users, permissions, and metadata. `C-051` `C-050`

**Indexing API capability groups** (developer reference): authentication; custom metadata; datasources; documents (index individually or in bulk, update permissions, remove stale content); people; permissions (users, groups, memberships); shortcuts; troubleshooting. (S-11)

**The documented workflow:** create a datasource → index content → apply permissions → validate and troubleshoot. (S-11)

**Tokens.**

| Call family | Token | Notes |
|---|---|---|
| Datasources, documents, identities, permissions, debug | Indexing token (Glean-issued; no OAuth) | `C-052`; datasource-scoped or global `C-060` |
| Activity | Client API token, global, scoped to ACTIVITY, with `X-Glean-ActAs` | `C-133` `C-134` |
| Custom metadata | Separately scoped credentials per metadata group | (S-15) |
| Verification searches | Client API token (licensing may apply; verify) | `C-243` internal-only note |

**Base URL.** The customer's backend URL (`https://<instance>-be.glean.com`), shown to admins as the server instance on the About Glean page. (S-14, S-07)

### §2 Datasource setup (≈800 words; `OBJ-203-2`)

Key fields and why each matters:

| Field | Purpose | Failure if wrong | Claim |
|---|---|---|---|
| `name` | Unique identifier used in every call | Name mismatch → invalid datasource errors | `C-158` (SDK: ASCII letters and digits) |
| `displayName` | Name in results | Confusing UX | (S-18) |
| `datasourceCategory` | Affects ranking | Poor ranking | `C-121` |
| `objectDefinitions[].docCategory` | Per-object category when types differ | Tickets ranked as knowledge articles | `C-120` |
| `urlRegex` | Captures this datasource's view URLs | Too broad captures other sources; too narrow misses documents | `C-119` |
| `isUserReferencedByEmail` | ACLs by email vs datasource user ID | ACLs match nobody | `C-118` |
| `isTestDatasource` | Ranking signals off; visible to selected users | Test data pollutes production ranking | `C-123` |

Categories to teach with examples: `KNOWLEDGE_HUB` (continually updated sources of truth), `PUBLISHED_CONTENT` (point-in-time posts), `COLLABORATIVE_CONTENT`, `QUESTION_ANSWER`, `TICKETS`, `CODE_REPOSITORY`, `CHANGE_MANAGEMENT`, `EMAIL`, `MESSAGING`, `CRM`, `ATS`, `ENTITY`. Do **not** use `PEOPLE` — use the employee endpoints instead. `C-122` (S-40) Beacon → `KNOWLEDGE_HUB`.

**Test visibility.** `/betausers` grants visibility of a test datasource to named users; they still need document permissions. `C-124` The datasource must be enabled for search before anything appears. `C-103`

### §3 The document model (≈700 words; `OBJ-203-3`)

Basic fields: `datasource`, `id`, `objectType`, `title`, `body` (`mimeType` + `textContent`), `viewURL`, `permissions`, `customProperties`. (S-17, S-14) The `viewURL` must match the datasource `urlRegex`. `C-119`

Content rules:
- Supported MIME types include common office, PDF, HTML, Markdown, plain text, CSV; JSON and XML are **not** supported as content types. `C-094`
- Apply the content size limits (64 MB fetch; 16.875 MB indexable text) to custom connectors as well. `C-090` `C-091` `C-093`
- Some custom connectors can include image content, which Glean can caption and render in Assistant responses, subject to permissions. `C-043`
- Timestamps: the SDK requires epoch seconds. `C-153` **Open item** `U-203-1`: one developer example shows an ISO string for `updatedAt`; confirm the canonical wire type in the API reference before authoring learner copy.

### §4 Write semantics: single, batch, bulk (≈900 words; `OBJ-203-3`)

| Endpoint | Semantics | Use | Rate limit |
|---|---|---|---|
| `POST /api/index/v1/indexdocument` | Add or update one document | Event-driven single updates | 10 requests/s `C-137` |
| `POST /api/index/v1/indexdocuments` | Add or update many; others untouched | Incremental runs | 600 documents/min `C-137` `C-102` |
| `POST /api/index/v1/bulkindexdocuments` | Full replacement across pages with one `uploadId` | Full runs and reconciliation | Confirm with SME |
| Delete document (`/deletedocument`) | Remove one document | Tombstones | Confirm reference page |
| `POST /api/index/v1/updatepermissions` | Update a document's permissions | Permission-only changes | Confirm reference page |

**Bulk upload model** (the most important page in the API):
- Every page of one upload shares a unique `uploadId`; `isFirstPage` true only on the first; `isLastPage` true only on the last. `C-109`
- Concurrent uploads are not allowed. `C-105`
- After a failed or unfinished upload, a new one requires `forceRestartUpload`. `C-106`
- After success, documents not in the upload are deleted asynchronously. `C-101`
- Safeguard: stale deletion pauses for 7 days if more than 20% would be deleted; `disableStaleDocumentDeletionCheck` disables it for intended mass deletes; `/processalldocuments` makes deletions take effect immediately. `C-107` `C-108`
- The same bulk model applies to other objects (users, groups, employees, teams). (S-12) Deleting a user or group in a bulk identity upload also deletes its memberships. (S-11 bulk users/groups reference)

**Response codes** on `/indexdocument`: 200, 400, 401, 409, 429. `C-140` 413 means the request is too large — split it. `C-058`

### §5 Identities and permissions (≈1,200 words; `OBJ-203-4`)

**Order of operations** (hard rules):
1. Index **users** (`/indexuser`, `/bulkindexusers`) before referencing them anywhere. Indexing a user grants no access by itself. `C-111` `C-112`
2. Index **groups** (`/indexgroup`). Group names cannot contain whitespace, cannot be empty, and cannot start with `scio`. `C-113`
3. Index **memberships** (`/indexmembership`, `/bulkindexmemberships`) after the group exists. Use `memberGroupName` instead of `memberUserId` for a nested group. `C-114` `C-115`
4. Push documents with ACLs.
5. Allow for asynchronous processing of permissions and memberships. `C-116`

**Five permission scenarios** (developer guide pattern; build each in the lab):

| # | Scenario | Document `permissions` | Preconditions |
|---|---|---|---|
| 0 | Everyone in Glean | `allowAnonymousAccess: true` | None. **Security review required.** `C-117` |
| 1 | Named users | `allowedUsers: [{email}]` or `[{datasourceUserId}]` | Users indexed; reference mode matches `isUserReferencedByEmail` `C-118` |
| 2 | All users of this datasource | `allowAllDatasourceUsersAccess: true` | "Datasource users" indexed `C-071` |
| 3 | Groups | `allowedGroups: [name]` | Group + memberships indexed `C-114` |
| 4 | Intersection | `allowedGroupIntersections: [{requiredGroups:[A,B]}]` | User in every group of one entry `C-198` |

**Visibility check.** `POST /api/index/v1/checkdocumentaccess` returns whether a user can view a document. If false, inspect the debug document and debug user outputs. (S-07)

### §6 Custom properties vs custom metadata (≈700 words; `OBJ-203-5`)

**Custom properties** belong to a custom datasource and are set on each document. They power operators and facets, rendering, and searchability/ranking. (S-34)
- Define them under an object definition **before** uploading documents that use them. `C-125`
- `INT` properties are not faceted; `DATE` is faceted only with epoch-second values. `C-126` `C-127`
- Showing a property in the result card requires UI options and contacting Glean support. `C-128`
- A property named `country` is a location ranking signal. `C-129`
- Default facets exist for author, owner, tags, updatedAt, objectType when set. (S-34)
- Updating a property requires re-uploading the whole document. `C-130`
- Type errors return 400 naming the document, property, and value; validation stops at the first error. `C-077`

**Custom metadata** attaches metadata to any document already in Glean, including native-connector documents, without re-indexing. `C-100` Re-indexing does not change it. `C-131` It supports text-based types only; custom properties add INT, DATE, and USERID. `C-132`

**Decision rule:** same source and you already push the document and need UI control or numeric/date types → custom properties. Enrichment from a different system, on native documents, or high-frequency metadata changes → custom metadata. (S-35)

### §7 Activity (≈400 words; `OBJ-203-5`)

Activity (VIEW, EDIT, etc.) improves ranking. Push it server-to-server per user to `/rest/api/v1/activity` with a **Client API** token that is global and scoped to ACTIVITY, naming the user in `X-Glean-ActAs`. `C-133` `C-134` Without it, custom results have weaker signals and may be outranked. `C-135` `C-136`

### §8 Limits and error handling (≈500 words; `OBJ-203-6`)

- Endpoint limits: `/indexdocument` 10 rps; `/indexdocuments` 600 docs/min; `/processalldocuments` once every 3 hours per datasource. `C-137` `C-079`
- Deployment limits: 8,000 rpm across IPs; 100 rps from one IP. `C-138` `C-139`
- Glean uses token-bucket limiters; on 429, back off exponentially. (S-37)
- Common errors: 401 invalid/expired token; 403 IP not allowed; 400 invalid datasource; 413 too large; 429 rate; 500 retry with backoff. (S-15)

### §9 Debug toolkit (≈600 words; `OBJ-203-6`)

| Endpoint | Answers | Claim |
|---|---|---|
| `POST /api/index/v1/debug/{datasource}/status` | Upload and processing history; counts | `C-070` |
| `POST /api/index/v1/debug/{datasource}/document` | Is the document present; what are its permissions | (S-07) |
| `POST /api/index/v1/debug/{datasource}/user` | User upload status, active flag, groups | (S-07) |
| `POST /api/index/v1/checkdocumentaccess` | Can this user see this document | (S-07) |
| `POST /api/index/v1/processalldocuments` | Reprocess all uploaded documents | `C-075` `C-079` |
| `POST /api/index/v1/processallmemberships` | Re-derive memberships | `C-076` |

Support ticket contents: issue and error message, endpoint and request body schema, connector name, timestamp with time zone. `C-078`

---

## API lab — Beacon without the SDK (60 min)

Use the learner's disposable test datasource. Every step records request, response, and a verification.

1. Create `beaconlab<id>` test datasource with one object type `Page` (`KNOWLEDGE_HUB`), URL regex, `isUserReferencedByEmail: true`. Read back config.
2. Add self and two personas as beta users.
3. Index 4 users, 2 groups, memberships (one nested).
4. Index doc A public (scenario 0) — then **replace** with scenario 3 group ACL and justify why scenario 0 was removed.
5. Index doc B for `pharmacists ∩ clinic-014` (scenario 4). `checkdocumentaccess` for three personas; record true/false.
6. Update doc B's ACL only (no body change). Verify access changes after processing.
7. Delete doc A. Verify absent.
8. Bulk upload the 30 seeded lab documents C1–C30 (two pages, one `uploadId`, correct first/last flags). Then bulk upload C1–C28 only. Observe C29–C30 deleted as stale (2 of 30 ≈ 7%, under the 20% safeguard). Then predict — without running it — what would happen if the second upload held only C1–C20 (33%), and cite the rule. `C-101` `C-107`
9. Force a custom property type error and read the 400 message.
10. Status endpoint: compare `bulkUploadHistory` and `processingHistory`; record time to searchable.

## Assessment (12 items)

1. Which token pushes activity? → Client API, ACTIVITY scope (`C-133`).
2. OAuth for Indexing API? → Not supported (`C-052`).
3. Membership before group? → Fails; group first (`C-114`).
4. Nested groups field → `memberGroupName` (`C-115`).
5. `isUserReferencedByEmail` false; ACL uses email → no match (`C-118`).
6. Two bulk uploads started concurrently → not allowed (`C-105`).
7. Previous bulk failed; next request lacks `forceRestartUpload` → fails (`C-106`).
8. Intentional 40% cleanup not visible → safeguard; set flag or wait (`C-107`).
9. Add a facet to Google Drive docs → custom metadata (`C-100`).
10. `DATE` facet not appearing → value not epoch seconds (`C-127`).
11. `/processalldocuments` twice in an hour → 429 (`C-079`).
12. `viewURL` outside `urlRegex` → misconfiguration; fix regex or URL (`C-119`).

## Job aid

"Indexing API one-pager": token table; write-semantics table; bulk flags; identity order; five ACL scenarios; debug table; limits.

## Open items

- `U-203-1` Canonical wire type for `updatedAt`/`createdAt`.
- `U-203-2` Rate limits for bulk endpoints and delete/update-permissions reference pages.

## Claims used

`C-043` `C-050` `C-051` `C-052` `C-058` `C-060` `C-070` `C-071` `C-075` `C-076` `C-077` `C-078` `C-079` `C-090` `C-091` `C-093` `C-094` `C-100` `C-101` `C-102` `C-103` `C-105` `C-106` `C-107` `C-108` `C-109` `C-111` `C-112` `C-113` `C-114` `C-115` `C-116` `C-117` `C-118` `C-119` `C-120` `C-121` `C-122` `C-123` `C-124` `C-125` `C-126` `C-127` `C-128` `C-129` `C-130` `C-131` `C-132` `C-133` `C-134` `C-135` `C-136` `C-137` `C-138` `C-139` `C-140` `C-150` `C-151` `C-153` `C-158` `C-198` · internal-only note: `C-243`
