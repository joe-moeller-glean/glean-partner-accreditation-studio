# CON-204 Glean Indexing SDK: Build, Test, Debug, Deploy - research findings

Verified 2026-09-27. 75 claims drawn from 16 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-12` | [Bulk Indexing](https://developers.glean.com/api-info/indexing/documents/bulk-indexing) | Glean Developer | 2026-09-20 | 1 |
| `S-19` | [Indexing SDK — Indexing modes](https://developers.glean.com/libraries/indexing-sdk/concepts/indexing-modes) | Glean Developer | 2026-09-18 | 1 |
| `S-20` | [Indexing SDK — Permissions](https://developers.glean.com/libraries/indexing-sdk/permissions) | Glean Developer | 2026-09-18 | 1 |
| `S-21` | [Indexing SDK — Architecture](https://developers.glean.com/libraries/indexing-sdk/concepts/architecture) | Glean Developer | 2026-09-18 | 1 |
| `S-22` | [Indexing SDK — Connector types](https://developers.glean.com/libraries/indexing-sdk/concepts/connector-types) | Glean Developer | 2026-09-20 | 1 |
| `S-23` | [Indexing SDK — PushUploader](https://developers.glean.com/libraries/indexing-sdk/push/uploader) | Glean Developer | 2026-09-19 | 1 |
| `S-24` | [Indexing SDK — Batching and throughput](https://developers.glean.com/libraries/indexing-sdk/push/batching) | Glean Developer | 2026-09-20 | 1 |
| `S-25` | [Indexing SDK — HTTP client](https://developers.glean.com/libraries/indexing-sdk/pull/http-client) | Glean Developer | 2026-09-19 | 1 |
| `S-26` | [Indexing SDK — Pagination](https://developers.glean.com/libraries/indexing-sdk/pull/pagination) | Glean Developer | 2026-09 | 1 |
| `S-27` | [Indexing SDK — Rate limiting](https://developers.glean.com/libraries/indexing-sdk/pull/rate-limiting) | Glean Developer | 2026-09 | 1 |
| `S-28` | [Indexing SDK — Status and debugging](https://developers.glean.com/libraries/indexing-sdk/status-and-debugging) | Glean Developer | 2026-09 | 1 |
| `S-29` | [Indexing SDK — CLI](https://developers.glean.com/libraries/indexing-sdk/cli) | Glean Developer | 2026-09-18 | 1 |
| `S-30` | [Indexing SDK — Deployment overview](https://developers.glean.com/libraries/indexing-sdk/deployment/overview) | Glean Developer | 2026-09 | 1 |
| `S-31` | [Indexing SDK — Observability](https://developers.glean.com/libraries/indexing-sdk/observability) | Glean Developer | 2026-09-18 | 1 |
| `S-32` | [Indexing SDK — Overview](https://developers.glean.com/libraries/indexing-sdk/) | Glean Developer | 2026-09-18 | 1 |
| `S-33` | [Indexing SDK — Quickstart](https://developers.glean.com/libraries/indexing-sdk/quickstart) | Glean Developer | 2026-09-19 | 1 |

## Claims by source

### S-12 - Bulk Indexing

- `C-101` Bulk indexing replaces the datasource; omitted documents are deleted.

### S-19 - Indexing SDK — Indexing modes

- `C-170` Never let a partial fetch complete as a full crawl.
- `C-172` The SDK does not persist checkpoints.
- `C-325` Without an override, since is None and the data client falls back to a full fetch.
- `C-177` An empty full crawl clears the datasource.
- `C-173` Checkpoint: start time, written only on success.
- `C-178` force_restart only after a stuck upload.
- `C-174` Incremental needs a checkpoint and a deletion signal.

### S-20 - Indexing SDK — Permissions

- `C-196` Unknown groups match nobody.
- `C-198` Intersection semantics.
- `C-201` Groups require memberships.
- `C-320` extract_permission_refs() returns the user and group IDs the documents reference.
- `C-319` Phase 2 rejects missing permissions, anonymous access, and all-datasource-users access because they prevent proving denial.
- `C-199` Counts prove nothing about permissions.
- `C-200` Search as the user is ground truth.
- `C-195` Never allow-all 'for now'.

### S-21 - Indexing SDK — Architecture

- `C-166` Streaming connectors do not run get_identities().
- `C-311` The SDK owns batching, retries, upload sessions, and stale-document cleanup.
- `C-161` SDK config: two env vars.
- `C-312` GLEAN_SERVER_URL is the Glean backend URL.
- `C-313` GLEAN_INDEXING_API_TOKEN is a datasource-scoped Indexing API token.
- `C-162` Missing env vars fail at construction.
- `C-164` SDK errors derive from GleanError.
- `C-310` In the SDK identity crawl, users are bulk-indexed first; groups without memberships raise InconsistentDataError.
- `C-324` On an incremental crawl the SDK calls _get_last_crawl_timestamp(); the base implementation returns None.
- `C-163` Full = replacement; incremental = additive.
- `C-165` Failures exit non-zero.

### S-22 - Indexing SDK — Connector types

- `C-315` Use the streaming connector when the dataset is large or paginated and the source client is synchronous.
- `C-316` The async streaming connector uses async generators and is driven with index_data_async().
- `C-169` Employee data is separate from ACL identities.
- `C-314` Start with BaseDatasourceConnector if unsure; switching to streaming changes the base class and get_source_data() return type, not transform().
- `C-167` Memory limits need streaming, not smaller batches.
- `C-168` batch_size defaults to 1000.

### S-23 - Indexing SDK — PushUploader

- `C-180` First and last pages are sequential.
- `C-181` index_documents() suits webhook updates.

### S-24 - Indexing SDK — Batching and throughput

- `C-184` Tune the dominant stage only.
- `C-185` Prefer smaller batches over longer timeouts.

### S-25 - Indexing SDK — HTTP client

- `C-318` The SDK HTTP client retries 429, 500, 502, 503, 504; everything else fails immediately.
- `C-186` Default retries: one retry.
- `C-317` Production connectors should raise max_attempts to 4 or 5 against aggressive rate limiters.
- `C-187` Query params are redacted in logs.
- `C-188` Redaction covers logs only.

### S-26 - Indexing SDK — Pagination

- `C-323` SDK cursor paging stops when the cursor is missing, empty, not a string, or repeated.
- `C-190` Offset pagination is unstable under writes.
- `C-191` Paging loops must terminate.

### S-27 - Indexing SDK — Rate limiting

- `C-194` Rate limiting is proactive; retries are reactive.
- `C-193` Run below the source quota.

### S-28 - Indexing SDK — Status and debugging

- `C-202` Four-step missing-document diagnosis.
- `C-205` ACLs fail without pushed identities.
- `C-204` Alert on sharp drops in documents_indexed.

### S-29 - Indexing SDK — CLI

- `C-206` Live tests need --allow-destructive-live.
- `C-322` glean-idx datasource status shows uploaded and indexed counts, identity counts, visibility, and recent runs.
- `C-321` glean-idx document access checks whether a given user can see a document.
- `C-207` teardown is irreversible.
- `C-208` CLI exit codes are stable.
- `C-209` Ambiguous writes are read back, not retried.

### S-30 - Indexing SDK — Deployment overview

- `C-210` A connector is a batch job.
- `C-332` glean-idx deploy generates a Docker image and Terraform for a Kubernetes CronJob on GKE or EKS.
- `C-217` Connectors can run on many schedulers.
- `C-213` Full and incremental need separate configs.
- `C-214` A completed Job is not proof of indexing.

### S-31 - Indexing SDK — Observability

- `C-218` Observability is built in.
- `C-219` Cloud telemetry plugins are mock-tested only.

### S-32 - Indexing SDK — Overview

- `C-150` The SDK is a client for the Indexing API.
- `C-154` Full crawls must cover the entire scope.
- `C-153` Timestamps are epoch seconds.
- `C-152` Allow-all ACL defaults are the top review risk.
- `C-155` Each test phase swaps one dependency.
- `C-329` The Connector Builder explores the source API, plans with you, generates the connector against the SDK, and tests it before anything is indexed.
- `C-330` The Connector Builder runs mocked and recorded test phases before offering to index anything.

### S-33 - Indexing SDK — Quickstart

- `C-157` A connector is a data client plus a connector class.
- `C-158` Datasource name: ASCII letters and digits only.
- `C-326` max_items limits source consumption; it is not a Glean-side upload cap or a blast-radius guarantee.
- `C-159` --max-items is not a safety control.
- `C-160` Accepted is not searchable.

## Conflicts and gaps

See `conflicts.md`. Every claim in this module is learner-facing and verified verbatim against the source text. Internal engineering, reviewer, and field evidence from the authoring ledger is excluded from this module.
