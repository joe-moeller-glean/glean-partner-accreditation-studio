# BLD-202 Custom Connector Implementation Lab - research findings

Verified 2026-09-27. 40 claims drawn from 18 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-02` | [How connectors power the Glean experience](https://docs.glean.com/connectors/connectors-power-glean) | Glean Docs | 2026-08-04 | 1 |
| `S-05` | [Set up a custom connector](https://docs.glean.com/connectors/custom/setup) | Glean Docs | 2026-09-21 | 1 |
| `S-12` | [Bulk Indexing](https://developers.glean.com/api-info/indexing/documents/bulk-indexing) | Glean Developer | 2026-09-20 | 1 |
| `S-13` | [Bulk Upload Model](https://developers.glean.com/api-info/indexing/documents/bulk-upload-model) | Glean Developer | 2026-09-19 | 1 |
| `S-16` | [Permissions (Indexing API guide)](https://developers.glean.com/api-info/indexing/documents/permissions) | Glean Developer | 2026-09-20 | 1 |
| `S-19` | [Indexing SDK — Indexing modes](https://developers.glean.com/libraries/indexing-sdk/concepts/indexing-modes) | Glean Developer | 2026-09-18 | 1 |
| `S-20` | [Indexing SDK — Permissions](https://developers.glean.com/libraries/indexing-sdk/permissions) | Glean Developer | 2026-09-18 | 1 |
| `S-21` | [Indexing SDK — Architecture](https://developers.glean.com/libraries/indexing-sdk/concepts/architecture) | Glean Developer | 2026-09-18 | 1 |
| `S-25` | [Indexing SDK — HTTP client](https://developers.glean.com/libraries/indexing-sdk/pull/http-client) | Glean Developer | 2026-09-19 | 1 |
| `S-27` | [Indexing SDK — Rate limiting](https://developers.glean.com/libraries/indexing-sdk/pull/rate-limiting) | Glean Developer | 2026-09 | 1 |
| `S-28` | [Indexing SDK — Status and debugging](https://developers.glean.com/libraries/indexing-sdk/status-and-debugging) | Glean Developer | 2026-09 | 1 |
| `S-29` | [Indexing SDK — CLI](https://developers.glean.com/libraries/indexing-sdk/cli) | Glean Developer | 2026-09-18 | 1 |
| `S-30` | [Indexing SDK — Deployment overview](https://developers.glean.com/libraries/indexing-sdk/deployment/overview) | Glean Developer | 2026-09 | 1 |
| `S-31` | [Indexing SDK — Observability](https://developers.glean.com/libraries/indexing-sdk/observability) | Glean Developer | 2026-09-18 | 1 |
| `S-32` | [Indexing SDK — Overview](https://developers.glean.com/libraries/indexing-sdk/) | Glean Developer | 2026-09-18 | 1 |
| `S-33` | [Indexing SDK — Quickstart](https://developers.glean.com/libraries/indexing-sdk/quickstart) | Glean Developer | 2026-09-19 | 1 |
| `S-45` | [[External] Glean Partner Content | Custom Connector Questionnaire](https://docs.google.com/spreadsheets/d/1jWeZyvGmpiChLEgjHNk52dioZPJ2dZJTw_cVDq4HsF8) | Eugene Wiehahn | 2025-05-16 | 2 |
| `S-47` | [Glean Partner Competency Program Guide (Feb 2026)](https://docs.google.com/document/d/1mADzsGI3LTRlEIBLXceoMzj0KbQ2N6sLNLojrkMZF7E) | Sam Cugini | 2026-06-26 | 2 |

## Claims by source

### S-02 - How connectors power the Glean experience

- `C-025` The source may enforce access again at click time.
- `C-026` RAG passes retrieved, permission-filtered snippets to the model.

### S-05 - Set up a custom connector

- `C-049` First-run: one public, then one permissioned document, then scale.

### S-12 - Bulk Indexing

- `C-101` Bulk indexing replaces the datasource; omitted documents are deleted.

### S-13 - Bulk Upload Model

- `C-107` Stale deletion pauses 7 days above 20%.
- `C-108` Use /processalldocuments for immediate deletions.

### S-16 - Permissions (Indexing API guide)

- `C-111` Index users before referencing them.
- `C-114` Index a group before its memberships.
- `C-115` Nested groups use memberGroupName.
- `C-116` Permissions and memberships process asynchronously.

### S-19 - Indexing SDK — Indexing modes

- `C-170` Never let a partial fetch complete as a full crawl.
- `C-174` Incremental needs a checkpoint and a deletion signal.
- `C-171` A bad successful crawl is not recoverable.
- `C-173` Checkpoint: start time, written only on success.
- `C-176` Common schedule: full nightly or weekly.

### S-20 - Indexing SDK — Permissions

- `C-198` Intersection semantics.
- `C-199` Counts prove nothing about permissions.
- `C-200` Search as the user is ground truth.
- `C-195` Never allow-all 'for now'.

### S-21 - Indexing SDK — Architecture

- `C-165` Failures exit non-zero.

### S-25 - Indexing SDK — HTTP client

- `C-188` Redaction covers logs only.

### S-27 - Indexing SDK — Rate limiting

- `C-193` Run below the source quota.
- `C-194` Rate limiting is proactive; retries are reactive.

### S-28 - Indexing SDK — Status and debugging

- `C-204` Alert on sharp drops in documents_indexed.
- `C-202` Four-step missing-document diagnosis.

### S-29 - Indexing SDK — CLI

- `C-209` Ambiguous writes are read back, not retried.
- `C-322` glean-idx datasource status shows uploaded and indexed counts, identity counts, visibility, and recent runs.
- `C-321` glean-idx document access checks whether a given user can see a document.
- `C-207` teardown is irreversible.

### S-30 - Indexing SDK — Deployment overview

- `C-214` A completed Job is not proof of indexing.
- `C-215` The workload cannot enumerate secrets.

### S-31 - Indexing SDK — Observability

- `C-218` Observability is built in.

### S-32 - Indexing SDK — Overview

- `C-153` Timestamps are epoch seconds.
- `C-154` Full crawls must cover the entire scope.

### S-33 - Indexing SDK — Quickstart

- `C-160` Accepted is not searchable.

### S-45 - [External] Glean Partner Content | Custom Connector Questionnaire

- `C-257` Ask permission change frequency.

### S-47 - Glean Partner Competency Program Guide (Feb 2026)

- `C-261` Build must index users, permissions, documents.
- `C-262` Build must auto-update.
- `C-263` Build must handle errors with retry/backoff.
- `C-265` Customer-approved maintenance plan required.

## Conflicts and gaps

See `conflicts.md`. Every claim in this module is learner-facing and verified verbatim against the source text. Internal engineering, reviewer, and field evidence from the authoring ledger is excluded from this module.
