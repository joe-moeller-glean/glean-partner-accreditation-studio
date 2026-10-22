# BLD-201 Custom Connector Best Practices - research findings

Verified 2026-09-27. 50 claims drawn from 19 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-02` | [How connectors power the Glean experience](https://docs.glean.com/connectors/connectors-power-glean) | Glean Docs | 2026-08-04 | 1 |
| `S-12` | [Bulk Indexing](https://developers.glean.com/api-info/indexing/documents/bulk-indexing) | Glean Developer | 2026-09-20 | 1 |
| `S-13` | [Bulk Upload Model](https://developers.glean.com/api-info/indexing/documents/bulk-upload-model) | Glean Developer | 2026-09-19 | 1 |
| `S-15` | [Indexing API Authentication](https://developers.glean.com/api-info/indexing/authentication/overview) | Glean Developer | 2026-09-18 | 1 |
| `S-16` | [Permissions (Indexing API guide)](https://developers.glean.com/api-info/indexing/documents/permissions) | Glean Developer | 2026-09-20 | 1 |
| `S-18` | [Setup Datasource](https://developers.glean.com/api-info/indexing/getting-started/setup-datasource) | Glean Developer | 2026-09-18 | 1 |
| `S-19` | [Indexing SDK — Indexing modes](https://developers.glean.com/libraries/indexing-sdk/concepts/indexing-modes) | Glean Developer | 2026-09-18 | 1 |
| `S-20` | [Indexing SDK — Permissions](https://developers.glean.com/libraries/indexing-sdk/permissions) | Glean Developer | 2026-09-18 | 1 |
| `S-21` | [Indexing SDK — Architecture](https://developers.glean.com/libraries/indexing-sdk/concepts/architecture) | Glean Developer | 2026-09-18 | 1 |
| `S-25` | [Indexing SDK — HTTP client](https://developers.glean.com/libraries/indexing-sdk/pull/http-client) | Glean Developer | 2026-09-19 | 1 |
| `S-26` | [Indexing SDK — Pagination](https://developers.glean.com/libraries/indexing-sdk/pull/pagination) | Glean Developer | 2026-09 | 1 |
| `S-27` | [Indexing SDK — Rate limiting](https://developers.glean.com/libraries/indexing-sdk/pull/rate-limiting) | Glean Developer | 2026-09 | 1 |
| `S-28` | [Indexing SDK — Status and debugging](https://developers.glean.com/libraries/indexing-sdk/status-and-debugging) | Glean Developer | 2026-09 | 1 |
| `S-29` | [Indexing SDK — CLI](https://developers.glean.com/libraries/indexing-sdk/cli) | Glean Developer | 2026-09-18 | 1 |
| `S-30` | [Indexing SDK — Deployment overview](https://developers.glean.com/libraries/indexing-sdk/deployment/overview) | Glean Developer | 2026-09 | 1 |
| `S-32` | [Indexing SDK — Overview](https://developers.glean.com/libraries/indexing-sdk/) | Glean Developer | 2026-09-18 | 1 |
| `S-44` | [Glean Partner Content | Custom Connector Best Practices (deck, April 2026)](https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg) | Joe Moeller | 2026-09-08 | 2 |
| `S-45` | [[External] Glean Partner Content | Custom Connector Questionnaire](https://docs.google.com/spreadsheets/d/1jWeZyvGmpiChLEgjHNk52dioZPJ2dZJTw_cVDq4HsF8) | Eugene Wiehahn | 2025-05-16 | 2 |
| `S-49` | [[Template] Custom Connector Intake Form v2](https://docs.google.com/document/d/11TcVp1W61fZ7EuOSfztFHEIA3BsdO6jVGMzY9pcai9M) | Joe Moeller | 2026-07-10 | 2 |

## Claims by source

### S-02 - How connectors power the Glean experience

- `C-026` RAG passes retrieved, permission-filtered snippets to the model.
- `C-025` The source may enforce access again at click time.

### S-12 - Bulk Indexing

- `C-101` Bulk indexing replaces the datasource; omitted documents are deleted.

### S-13 - Bulk Upload Model

- `C-107` Stale deletion pauses 7 days above 20%.

### S-15 - Indexing API Authentication

- `C-057` Use separate tokens per environment.
- `C-059` IP restrictions limit tokens to known infrastructure.

### S-16 - Permissions (Indexing API guide)

- `C-114` Index a group before its memberships.
- `C-115` Nested groups use memberGroupName.
- `C-116` Permissions and memberships process asynchronously.
- `C-111` Index users before referencing them.

### S-18 - Setup Datasource

- `C-119` urlRegex must be neither too broad nor too narrow.

### S-19 - Indexing SDK — Indexing modes

- `C-170` Never let a partial fetch complete as a full crawl.
- `C-175` Common schedule: incremental 15–60 min.
- `C-174` Incremental needs a checkpoint and a deletion signal.
- `C-176` Common schedule: full nightly or weekly.
- `C-173` Checkpoint: start time, written only on success.
- `C-179` Overlap incremental windows slightly.
- `C-172` The SDK does not persist checkpoints.
- `C-171` A bad successful crawl is not recoverable.
- `C-178` force_restart only after a stuck upload.

### S-20 - Indexing SDK — Permissions

- `C-197` Do not flatten groups into users.
- `C-198` Intersection semantics.
- `C-196` Unknown groups match nobody.
- `C-195` Never allow-all 'for now'.

### S-21 - Indexing SDK — Architecture

- `C-165` Failures exit non-zero.

### S-25 - Indexing SDK — HTTP client

- `C-186` Default retries: one retry.
- `C-317` Production connectors should raise max_attempts to 4 or 5 against aggressive rate limiters.
- `C-187` Query params are redacted in logs.
- `C-188` Redaction covers logs only.
- `C-318` The SDK HTTP client retries 429, 500, 502, 503, 504; everything else fails immediately.

### S-26 - Indexing SDK — Pagination

- `C-323` SDK cursor paging stops when the cursor is missing, empty, not a string, or repeated.
- `C-190` Offset pagination is unstable under writes.
- `C-191` Paging loops must terminate.

### S-27 - Indexing SDK — Rate limiting

- `C-193` Run below the source quota.
- `C-194` Rate limiting is proactive; retries are reactive.

### S-28 - Indexing SDK — Status and debugging

- `C-204` Alert on sharp drops in documents_indexed.

### S-29 - Indexing SDK — CLI

- `C-209` Ambiguous writes are read back, not retried.

### S-30 - Indexing SDK — Deployment overview

- `C-215` The workload cannot enumerate secrets.
- `C-216` No API to delete a datasource registration.

### S-32 - Indexing SDK — Overview

- `C-153` Timestamps are epoch seconds.
- `C-154` Full crawls must cover the entire scope.

### S-44 - Glean Partner Content | Custom Connector Best Practices (deck, April 2026)

- `C-236` Combine relational data into one document.
- `C-237` Keep document state in a simple database.
- `C-242` Architecture includes retries, backoff, DLQ.
- `C-238` Automate token rotation.
- `C-235` Model roles as groups.
- `C-239` Deck guidance: incremental plus monthly full.

### S-45 - [External] Glean Partner Content | Custom Connector Questionnaire

- `C-251` Prefer read-only keys.
- `C-257` Ask permission change frequency.

### S-49 - [Template] Custom Connector Intake Form v2

- `C-275` Docs must explain permission propagation.

## Conflicts and gaps

See `conflicts.md`. Every claim in this module is learner-facing and verified verbatim against the source text. Internal engineering, reviewer, and field evidence from the authoring ledger is excluded from this module.
