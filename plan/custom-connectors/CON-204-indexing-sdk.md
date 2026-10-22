# CON-204 — Glean Indexing SDK: Build, Test, Debug, Deploy

| Field | Value |
|---|---|
| Level · path | 200/300 · Custom Connector Competency |
| Time | 90 min learning · 120 min build lab · 20 min assessment = **3.8 h** |
| Prerequisites | CON-203; Python 3 (functions, classes, generators, environment variables) |
| Design system | `paged-v1` with code panels; lab runs outside the SCORM package |
| SDK version basis | `glean-indexing-sdk` v1.2.0 (changelog 7 Sep 2026) `C-220`. Re-verify every release. |
| Owns | SDK architecture, class choice, data clients, transform, identities, modes, uploads, testing, CLI, status, observability, deployment scaffolding, Connector Builder review |
| Does not own | Wire protocol (CON-203), design rationale (BLD-201), production operations (CON-301) |
| Artifact | Beacon connector repository passing mock and integration phases, with a live run against a disposable datasource |

## Learner question

"How do I use the SDK so that the parts I write are only the source-specific parts — and how do I avoid the handful of SDK mistakes that silently delete or expose data?"

## Outcomes

- `OBJ-204-1` Explain the SDK pipeline and lifecycle, and which stages the builder writes.
- `OBJ-204-2` Choose the correct connector base class and data client for a source.
- `OBJ-204-3` Implement a data client with pagination, rate limiting, retries, and completeness guards.
- `OBJ-204-4` Implement `transform()` with stable IDs, epoch timestamps, content, and ACLs; supply identities correctly.
- `OBJ-204-5` Configure full and incremental modes, checkpoints, and upload options safely.
- `OBJ-204-6` Test in three phases, use the CLI to verify and debug, and read observability metrics.
- `OBJ-204-7` Generate and review deployment scaffolding; review agent-generated code against the critical checklist.

## Misconceptions

| Misconception | Repair |
|---|---|
| "The SDK handles incremental for me." | The SDK does not persist checkpoints; the base timestamp method returns `None`, so incremental falls back to a full fetch unless overridden. `C-172` |
| "Streaming connectors push identities." | Streaming connectors do not run `get_identities()`; push identities separately first. `C-166` |
| "`--max-items` makes a live test safe." | It limits source consumption; on a full live run it produces a partial replacement that can stale-delete. `C-159` |
| "Smaller batches fix out-of-memory." | Batching happens after transform; switch to a streaming connector. `C-167` |
| "Agent-generated connectors are production-ready." | Review permissions, full-crawl completeness, timestamps, rate limits, incremental overrides; run the real tests. `C-152` `C-154` |

---

## Teaching sequence

### §1 Architecture: two methods, five stages (≈700 words; `OBJ-204-1`)

A connector is two classes: a **data client** that fetches records and a **connector** that turns them into Glean documents. `C-157` Pipeline: source → `get_source_data()` → `transform()` → `PushUploader` → Glean index. The builder writes the first two; the SDK owns batching, retries, upload sessions, and stale-document cleanup. (S-21)

**Lifecycle of `BaseDatasourceConnector.index_data()`** (S-21):
1. Start observability; assign a `run_id`.
2. Identity crawl — `get_identities()`; users are bulk-indexed first; groups without memberships raise `InconsistentDataError`. `C-201`
3. Resolve `since` — on incremental, `_get_last_crawl_timestamp()`; base returns `None`. `C-172`
4. Content crawl — `get_data()` delegates to `get_source_data()`.
5. `transform()`.
6. Upload — full calls `bulk_index_documents()` (replacement and stale cleanup); incremental calls additive `index_documents()`. `C-163`
7. End observability; on exception increment the error counter and re-raise so the scheduler sees a non-zero exit. `C-165`

**Configuration:** two environment variables — `GLEAN_SERVER_URL` and `GLEAN_INDEXING_API_TOKEN`; no configuration file; a missing variable fails at client construction, not mid-upload. `C-161` `C-162`

**Errors:** every SDK exception derives from `GleanError` and carries a fix suggestion (and docs URL where available). `C-164`

**When to use the API directly instead:** non-Python services, occasional one-off documents, custom metadata on existing documents. `C-151`

### §2 Choosing the base class (≈600 words; `OBJ-204-2`)

| Class | Data client | Produces | Peak memory | Use when | Claim |
|---|---|---|---|---|---|
| `BaseDatasourceConnector` | `BaseDataClient` | `DocumentDefinition` | Whole dataset | Fits in memory; needs built-in identity crawl | (S-22) |
| `BaseStreamingDatasourceConnector` | `BaseStreamingDataClient` (generator) | `DocumentDefinition` | One batch | Large/paginated; sync client | (S-22) |
| `BaseAsyncStreamingDatasourceConnector` | `BaseAsyncStreamingDataClient` | `DocumentDefinition` | One batch | Large; async client; drive with `index_data_async()` | (S-22) |
| `BasePeopleConnector` | `BaseDataClient` | `EmployeeInfoDefinition` | Whole dataset | Employee/identity records for the people directory | `C-169` |

Rules: start with the in-memory class if unsure; switching later changes the base class and return type of `get_source_data()`, not `transform()`. (S-22) At a few hundred thousand documents memory binds — switch to streaming. `C-167` Batch size defaults to 1000. `C-168` Employee data is distinct from datasource identities that back ACLs. `C-169`

**Beacon choice:** 38,400 pages with HTML bodies → `BaseStreamingDatasourceConnector` with an HTTP streaming client; identities pushed in a separate step before the content run (because streaming does not run `get_identities()`). `C-166`

### §3 The data client (≈900 words; `OBJ-204-3`)

**`PullHttpClient`** talks to the source (not to Glean): session reuse, retry with backoff, `Retry-After`, credential redaction. (S-25)
- Retry defaults: `max_attempts=2` (one retry) — deliberately conservative; raise to 4–5 for aggressive rate limiters. `C-186` Retryable: 429, 500, 502, 503, 504; connection errors; `Retry-After` honored; jitter added. (S-25)
- `json_dict()` / `json_list()` fail loudly on shape mismatches — prefer them over raw data. (S-25)
- `mask_params` redacts query parameters in logs; redaction covers logging only. `C-187` `C-188`
- `get_bytes(max_bytes=…)` bounds what you receive, not what is buffered. `C-189`

**Pagination** (`BasePullHttpStreamingDataClient`): `link` (default), `offset`, `cursor`, `none`. (S-26)
- Offset is unstable when the source is written during the crawl. `C-190`
- Cursor mode stops when the cursor is missing, empty, not a string, or identical to the previous one. `C-192`
- Non-standard paging: override `get_source_data()` and drive `self.http`; any loop must terminate on a misbehaving source. `C-191`

**Rate limiting:** `TokenBucketRateLimiter(rate_per_second, capacity)`; thread-safe; share one limiter across clients hitting the same quota; run below the documented quota. `C-193` Limiter is proactive; retries are reactive; both on. `C-194`

**Completeness guard (Beacon empty-200 fault).** The SDK's cursor guard stops on a missing cursor — which is exactly what Beacon's fault returns. The builder must therefore add a source-specific guard: treat `items == []` with no cursor *before* the expected total as an error and raise. On a full crawl, a loop that exits early deletes documents as stale. `C-191` `C-170`

### §4 `transform()`, identities, and permissions (≈900 words; `OBJ-204-4`)

`transform()` maps source records to `DocumentDefinition` objects. `CustomDatasourceConfig.name` may contain only ASCII letters and digits. `C-158`

Minimum mapping for Beacon `Page`:
- `id` = `str(page_id)` (immutable). 
- `title`, `view_url` (matches URL regex), `body=ContentDefinition(mime_type="text/html", text_content=…)`.
- `author=UserReferenceDefinition(email=…)`.
- `created_at`/`updated_at` as **epoch seconds** — ISO strings fail silently and sort wrong. `C-153`
- `permissions=DocumentPermissionsDefinition(allowed_groups=…, allowed_group_intersections=[PermissionsGroupIntersectionDefinition(required_groups=[…])])`. (S-20)

Permission rules the code must obey:
- Never index sensitive content with an allow-all ACL "for now." `C-195`
- Map groups directly; do not flatten to users. `C-197`
- An ACL naming an unknown group matches nobody. `C-196`
- If groups are returned, memberships must be too. `C-201`
- `is_user_referenced_by_email=True` when source and Glean share the identity provider. `C-118`
- `extract_permission_refs()` returns the user and group IDs the documents reference — use it to push only needed identities and to check for dangling references. (S-20)

**Illustrative skeleton** (shape only; verify imports against v1.2.0 — open item `U-204-1`):

```python
# connector.py — illustrative; names from SDK docs, imports to verify against the installed version
import os
from glean.indexing.connectors import BaseStreamingDatasourceConnector
from glean.indexing.models import CustomDatasourceConfig, DocumentDefinition, ContentDefinition
from glean.api_client.models import DocumentPermissionsDefinition, PermissionsGroupIntersectionDefinition

class BeaconConnector(BaseStreamingDatasourceConnector[dict]):
    configuration = CustomDatasourceConfig(
        name="beacon", display_name="Beacon",
        url_regex=r"https://beacon\.northbeam\.example/pages/.*",
        is_user_referenced_by_email=True,
    )
    def transform(self, data):
        return [to_document(p) for p in data]   # stable id, epoch seconds, ACLs

def create_connector() -> BeaconConnector:
    return BeaconConnector(name="beacon", data_client=BeaconPagesClient(
        base_url=os.environ["BEACON_BASE_URL"], token=os.environ["BEACON_API_TOKEN"]))
```

The zero-argument `create_connector()` factory gives the CLI and the generated deployment one construction path without hard-coded credentials. (S-33)

### §5 Modes, checkpoints, upload options (≈800 words; `OBJ-204-5`)

| | `IndexingMode.FULL` | `IndexingMode.INCREMENTAL` |
|---|---|---|
| Scope | Everything in scope | Records changed since `since` |
| Deletes stale documents | Yes | No |
| Safe to run partially | Never | Yes |
(S-19)

- A successful **empty** full crawl sends one complete empty bulk page and reconciles everything as stale. `C-177`
- The connector-builder skills generate full crawls only; incremental is developer-owned follow-up. (S-19)
- **Checkpoint:** override `_get_last_crawl_timestamp()`; record the start time before the run; write only after success. `C-172` `C-173`

`ConnectorOptions` (S-19): `force_restart` (only after a stuck upload) `C-178`; `disable_stale_deletion_check`; `upload_timeout_ms`; `upload_max_workers` (default 5); `document_batch_size_bytes` (default 5 MiB).

`PushUploader` details (S-23): first and last pages are sequential because the first opens the session and the last closes it and triggers stale deletion `C-180`; batches close at the count or byte cap, whichever first `C-182`; `index_documents()` is the right call for webhook-driven updates `C-181`; membership bulk uploads have no stale-deletion option `C-183`; `delete_document()` exists for targeted deletes.

Throughput (S-24): find the dominant stage first — tuning upload concurrency when fetch dominates does nothing `C-184`; smaller batches usually beat longer timeouts `C-185`.

Glean-side limits still apply (`/indexdocuments` 600 docs/min). `C-137`

### §6 Testing: three phases (≈800 words; `OBJ-204-6`)

Each phase swaps exactly one dependency from mocked to real, so a failure identifies the broken layer. `C-155`

| Phase | Source | Glean | Question answered |
|---|---|---|---|
| 1 Unit / mock | Mocked (or connector's own client with Glean mocked via CLI) | Mocked | Does `transform()` produce the expected documents? |
| 2 Integration | Real, recorded to NDJSON and replayed | Mocked | Does the data client parse what the source really returns? |
| 3 End-to-end / live | Real | Real | Does it work against a live instance? |
(S-32)

- `run_connector(...)` with `StaticDataClient` and `assert_documents_posted(...)` for unit tests. (S-33)
- Negative identities: list identities that must not have access; phase 2 rejects missing permissions, anonymous access, and allow-all-datasource-users because they prevent proving denial. (S-20)
- Counting documents proves nothing about permissions; search as a restricted user — the search result is the ground truth. `C-199` `C-200`
- Live phase requires `--allow-destructive-live`; use a disposable datasource. `C-206`

### §7 CLI and debugging (≈600 words; `OBJ-204-6`)

`glean-idx` commands (S-29): `doctor`; `validate`; `schema`; `run --mode full|incremental [--force-restart]`; `test --phase mock|integration|live|all`; `datasource status|process|configure|teardown`; `document status|access|events|delete`; `deploy init|build|secrets upload|apply|run|status|logs|destroy`.
- `datasource configure` reconciles an ambiguous transport failure by reading state back, never by repeating the write. `C-209`
- `teardown` cannot be undone; it uploads an empty full crawl. `C-207`
- Exit codes are stable (0 ok; 1 unexpected/connector raised; 2 bad invocation; 3 environment not ready; 4 Glean rejected/unreachable; 5 subject invalid). `C-208`
- JSON output envelope for scripting. (S-29)

**Why isn't my document in search** (S-28): (1) did the connector upload it (mock `documents_posted`)? (2) has it finished indexing (`document status --poll`)? (3) is the datasource healthy (uploaded vs indexed)? (4) can the user see it (`document access`)? `C-202` `C-205`

### §8 Observability (≈400 words; `OBJ-204-6`)

Built in: `data_fetch`, `data_transform`, `data_upload` timings; `items_fetched`, `documents_transformed`, `documents_indexed`, `indexing_errors`; structured JSON logs with `run_id`. `C-218` Optional AWS/GCP providers — tested only against mocks; validate in staging before relying on them for alerting. `C-219` Alert on `documents_indexed` dropping sharply run-over-run. `C-204`

### §9 Deployment scaffolding (≈600 words; `OBJ-204-7`)

A connector is a batch job. `glean-idx deploy` generates Docker and Terraform for a Kubernetes CronJob on GKE or EKS. `C-210` Canonical sequence: validate locally → `datasource configure` → `deploy build --push` → `deploy secrets upload` → `deploy apply` → `deploy run` and verify. (S-30) Edit `glean_deployment.yaml`, not generated Terraform. `C-212` Full and incremental schedules need separate deployment configurations. `C-213` A completed Job proves only that the process exited; document status proves indexing. `C-214` Kubernetes is optional; any scheduler that can invoke the factory works. `C-217` (Production depth: CON-301.)

### §10 Connector Builder (agent) and the review checklist (≈500 words; `OBJ-204-7`)

The Connector Builder plugin explores the source API, confirms a plan, generates the connector against the SDK, and runs mocked and recorded tests before anything is indexed; eight skills coordinate the build. `C-156` (S-32) Before trusting generated code, review the SDK's own list: permissions (real ACLs and identities; an allow-all default is the most consequential miss) `C-152`; full-crawl completeness (raise on a failed page) `C-154`; timestamps (epoch seconds) `C-153`; rate limiting against the real quota; incremental override present if claimed; run the real (phase 2) tests. (S-32)

---

## Build lab (120 min) — Beacon fixture

Environment: case packet §5 fixture with faults on; learner's disposable test datasource.

| Step | Task | Pass evidence |
|---|---|---|
| 1 | `glean-idx doctor --datasource <name>` | ok envelope |
| 2 | Data client with cursor paging, limiter at ≤80% of 300/min, retries 5 | Unit test for 429 path passes |
| 3 | Completeness guard for empty-200 | Unit test: fault → exception, no upload |
| 4 | `transform()` with stable IDs, epoch seconds, group + intersection ACLs | `assert_documents_posted` + permission refs check |
| 5 | Identity push step (users, groups, memberships, nested) before streaming content | Status shows identity counts |
| 6 | `test --phase mock`, then `--phase integration` (record/replay) | Both pass |
| 7 | Negative identities configured (`denied.contractor@`, `contractors`) | Phase 2 passes; deliberate allow-all fails it |
| 8 | Live full run on the disposable datasource with `--allow-destructive-live` | Document status indexed |
| 9 | `document access` for three personas | Expected true/false |
| 10 | Checkpoint override + incremental run after `MUTATE_ON_START` | Updated docs changed; deleted docs still present (explain why); tombstone delete step removes them |
| 11 | Read metrics summary; identify dominant stage | Written note |

## Assessment (12 items + lab rubric)

**Lab gates:** completeness guard; no allow-all; identities before streaming content; epoch timestamps; checkpoint written only on success.

Items (sample): streaming + identities (`C-166`); `since` is `None` (`C-172`); OOM fix (`C-167`); empty full crawl effect (`C-177`); `--max-items` on full live (`C-159`); `force_restart` use (`C-178`); first/last page sequencing (`C-180`); webhook updates method (`C-181`); default retries (`C-186`); completed Job meaning (`C-214`); exit code 3 (`C-208`); teardown (`C-207`).

## Job aid

"SDK cheat sheet": class chooser; lifecycle; mode table; options; CLI verbs; four-step debug; agent review list.

## Open items

- `U-204-1` Verify import paths for model classes (`glean.indexing.models` vs `glean.api_client.models`) against v1.2.0.
- `U3` Employee/people path for identity-rich sources.

## Claims used

`C-118` `C-137` `C-151` `C-152` `C-153` `C-154` `C-155` `C-156` `C-157` `C-158` `C-159` `C-161` `C-162` `C-163` `C-164` `C-165` `C-166` `C-167` `C-168` `C-169` `C-170` `C-172` `C-173` `C-177` `C-178` `C-180` `C-181` `C-182` `C-183` `C-184` `C-185` `C-186` `C-187` `C-188` `C-189` `C-190` `C-191` `C-192` `C-193` `C-194` `C-195` `C-196` `C-197` `C-199` `C-200` `C-201` `C-202` `C-204` `C-205` `C-206` `C-207` `C-208` `C-209` `C-210` `C-212` `C-213` `C-214` `C-217` `C-218` `C-219` `C-220`
