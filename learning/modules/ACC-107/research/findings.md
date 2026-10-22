# ACC-107 Custom Connector Competency Capstone - research findings

Verified 2026-09-27. 30 claims drawn from 14 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-01` | [About connectors](https://docs.glean.com/connectors/about) | Glean Docs | 2026-09-23 | 1 |
| `S-12` | [Bulk Indexing](https://developers.glean.com/api-info/indexing/documents/bulk-indexing) | Glean Developer | 2026-09-20 | 1 |
| `S-13` | [Bulk Upload Model](https://developers.glean.com/api-info/indexing/documents/bulk-upload-model) | Glean Developer | 2026-09-19 | 1 |
| `S-16` | [Permissions (Indexing API guide)](https://developers.glean.com/api-info/indexing/documents/permissions) | Glean Developer | 2026-09-20 | 1 |
| `S-19` | [Indexing SDK — Indexing modes](https://developers.glean.com/libraries/indexing-sdk/concepts/indexing-modes) | Glean Developer | 2026-09-18 | 1 |
| `S-20` | [Indexing SDK — Permissions](https://developers.glean.com/libraries/indexing-sdk/permissions) | Glean Developer | 2026-09-18 | 1 |
| `S-30` | [Indexing SDK — Deployment overview](https://developers.glean.com/libraries/indexing-sdk/deployment/overview) | Glean Developer | 2026-09 | 1 |
| `S-32` | [Indexing SDK — Overview](https://developers.glean.com/libraries/indexing-sdk/) | Glean Developer | 2026-09-18 | 1 |
| `S-37` | [Rate Limits and Retries](https://developers.glean.com/get-started/rate-limits) | Glean Developer | 2026-09-18 | 1 |
| `S-44` | [Glean Partner Content | Custom Connector Best Practices (deck, April 2026)](https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg) | Joe Moeller | 2026-09-08 | 2 |
| `S-45` | [[External] Glean Partner Content | Custom Connector Questionnaire](https://docs.google.com/spreadsheets/d/1jWeZyvGmpiChLEgjHNk52dioZPJ2dZJTw_cVDq4HsF8) | Eugene Wiehahn | 2025-05-16 | 2 |
| `S-47` | [Glean Partner Competency Program Guide (Feb 2026)](https://docs.google.com/document/d/1mADzsGI3LTRlEIBLXceoMzj0KbQ2N6sLNLojrkMZF7E) | Sam Cugini | 2026-06-26 | 2 |
| `S-48` | [Custom Connector Competency Submission Workbook](https://docs.google.com/spreadsheets/d/1Vh4WQq6zGW5BjUZRxy6dwYSggNuQJdsXeI1qU3Xyj8M) | Sam Cugini | 2026-02-06 | 2 |
| `S-49` | [[Template] Custom Connector Intake Form v2](https://docs.google.com/document/d/11TcVp1W61fZ7EuOSfztFHEIA3BsdO6jVGMzY9pcai9M) | Joe Moeller | 2026-07-10 | 2 |

## Claims by source

### S-01 - About connectors

- `C-006` Glean needs content, people, and activity data to build the Knowledge Graph.

### S-12 - Bulk Indexing

- `C-101` Bulk indexing replaces the datasource; omitted documents are deleted.

### S-13 - Bulk Upload Model

- `C-107` Stale deletion pauses 7 days above 20%.

### S-16 - Permissions (Indexing API guide)

- `C-116` Permissions and memberships process asynchronously.

### S-19 - Indexing SDK — Indexing modes

- `C-174` Incremental needs a checkpoint and a deletion signal.
- `C-170` Never let a partial fetch complete as a full crawl.

### S-20 - Indexing SDK — Permissions

- `C-198` Intersection semantics.
- `C-195` Never allow-all 'for now'.

### S-30 - Indexing SDK — Deployment overview

- `C-214` A completed Job is not proof of indexing.
- `C-215` The workload cannot enumerate secrets.

### S-32 - Indexing SDK — Overview

- `C-154` Full crawls must cover the entire scope.

### S-37 - Rate Limits and Retries

- `C-137` /indexdocument 10 rps; /indexdocuments 600 docs/min.

### S-44 - Glean Partner Content | Custom Connector Best Practices (deck, April 2026)

- `C-238` Automate token rotation.

### S-45 - [External] Glean Partner Content | Custom Connector Questionnaire

- `C-250` Scoping asks about native and web-crawler options first.

### S-47 - Glean Partner Competency Program Guide (Feb 2026)

- `C-260` Competency definition.
- `C-267` Competencies require an audit.
- `C-266` Renewal every 18 months.
- `C-264` Five technical accreditations required.
- `C-333` The competency requires a Glean-delivered custom connector workshop session.
- `C-269` Architecture review required.
- `C-261` Build must index users, permissions, documents.
- `C-262` Build must auto-update.
- `C-263` Build must handle errors with retry/backoff.
- `C-265` Customer-approved maintenance plan required.
- `C-334` Partners work with their Partner Manager to select and achieve a competency.
- `C-268` Submit a zip with the workbook.

### S-48 - Custom Connector Competency Submission Workbook

- `C-271` Technical specification required.
- `C-270` Renewal feedback within 3 months.

### S-49 - [Template] Custom Connector Intake Form v2

- `C-272` Intake form v2 supports publishing.
- `C-274` Get written permission/security confirmation.

## Conflicts and gaps

See `conflicts.md`. Every claim in this module is learner-facing and verified verbatim against the source text. Internal engineering, reviewer, and field evidence from the authoring ledger is excluded from this module.
