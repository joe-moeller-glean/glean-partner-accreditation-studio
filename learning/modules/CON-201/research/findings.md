# CON-201 Indexing Architecture and Data Flow - research findings

Verified 2026-09-27. 53 claims drawn from 21 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-01` | [About connectors](https://docs.glean.com/connectors/about) | Glean Docs | 2026-09-23 | 1 |
| `S-02` | [How connectors power the Glean experience](https://docs.glean.com/connectors/connectors-power-glean) | Glean Docs | 2026-08-04 | 1 |
| `S-03` | [Overview of custom data source](https://docs.glean.com/connectors/custom/about) | Glean Docs | 2026-08-19 | 1 |
| `S-04` | [Choose a deployment model](https://docs.glean.com/connectors/custom/deployment) | Glean Docs | 2026-06-29 | 1 |
| `S-05` | [Set up a custom connector](https://docs.glean.com/connectors/custom/setup) | Glean Docs | 2026-09-21 | 1 |
| `S-07` | [Troubleshooting (custom connectors)](https://docs.glean.com/connectors/custom/troubleshooting) | Glean Docs | 2026-08-18 | 1 |
| `S-10` | [Crawl and index limits](https://docs.glean.com/connectors/crawler-and-indexing-limits) | Glean Docs | 2026-06-30 | 1 |
| `S-12` | [Bulk Indexing](https://developers.glean.com/api-info/indexing/documents/bulk-indexing) | Glean Developer | 2026-09-20 | 1 |
| `S-13` | [Bulk Upload Model](https://developers.glean.com/api-info/indexing/documents/bulk-upload-model) | Glean Developer | 2026-09-19 | 1 |
| `S-14` | [Indexing API Quickstart](https://developers.glean.com/api-info/indexing/getting-started/overview) | Glean Developer | 2026-09-18 | 1 |
| `S-16` | [Permissions (Indexing API guide)](https://developers.glean.com/api-info/indexing/documents/permissions) | Glean Developer | 2026-09-20 | 1 |
| `S-17` | [Document Model](https://developers.glean.com/api-info/indexing/documents/document-model) | Glean Developer | 2026-09-20 | 1 |
| `S-19` | [Indexing SDK — Indexing modes](https://developers.glean.com/libraries/indexing-sdk/concepts/indexing-modes) | Glean Developer | 2026-09-18 | 1 |
| `S-20` | [Indexing SDK — Permissions](https://developers.glean.com/libraries/indexing-sdk/permissions) | Glean Developer | 2026-09-18 | 1 |
| `S-21` | [Indexing SDK — Architecture](https://developers.glean.com/libraries/indexing-sdk/concepts/architecture) | Glean Developer | 2026-09-18 | 1 |
| `S-28` | [Indexing SDK — Status and debugging](https://developers.glean.com/libraries/indexing-sdk/status-and-debugging) | Glean Developer | 2026-09 | 1 |
| `S-33` | [Indexing SDK — Quickstart](https://developers.glean.com/libraries/indexing-sdk/quickstart) | Glean Developer | 2026-09-19 | 1 |
| `S-37` | [Rate Limits and Retries](https://developers.glean.com/get-started/rate-limits) | Glean Developer | 2026-09-18 | 1 |
| `S-38` | [Test Datasource](https://developers.glean.com/api-info/indexing/datasource/test-datasource) | Glean Developer | 2026-09-18 | 1 |
| `S-44` | [Glean Partner Content | Custom Connector Best Practices (deck, April 2026)](https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg) | Joe Moeller | 2026-09-08 | 2 |
| `S-46` | [Glean Custom Connector Content Package](https://docs.google.com/document/d/16wEo2ny-s7TIQsyiNAlYLvZc7aPAoQdmCymQkrPYKh4) | Eugene Wiehahn | 2026-05-25 | 2 |

## Claims by source

### S-01 - About connectors

- `C-005` Native connectors are purpose-built per application and call source APIs directly.
- `C-003` Connector function 1: data fetching, including the permissions map.
- `C-004` Connector function 2: content and permission parsing.

### S-02 - How connectors power the Glean experience

- `C-018` The Enterprise Graph is layered on the index and identity/permission structures.
- `C-023` The runtime chooses index, live, or hybrid paths per request.
- `C-026` RAG passes retrieved, permission-filtered snippets to the model.
- `C-025` The source may enforce access again at click time.
- `C-024` Validate coverage and permissions in Search first.

### S-03 - Overview of custom data source

- `C-041` Custom connectors push documents, metadata, and permissions via the Indexing API.

### S-04 - Choose a deployment model

- `C-044` No runtime or hosting constraints.

### S-05 - Set up a custom connector

- `C-048` Choose the permissions model at setup.

### S-07 - Troubleshooting (custom connectors)

- `C-073` Processing expands derived groups and memberships.
- `C-072` UPLOAD COMPLETED is acceptance, not searchability.
- `C-070` Documents are searchable after processingHistory passes bulkUploadHistory.
- `C-071` allowAllDatasourceUsersAccess requires the user to be indexed as a datasource user.
- `C-075` /processalldocuments reprocesses without a new upload.

### S-10 - Crawl and index limits

- `C-090` Items over 64 MB index metadata and permissions only.
- `C-091` Indexable text is truncated at 16.875 MB.

### S-12 - Bulk Indexing

- `C-104` Indexing can take around 15–20 minutes (varies).
- `C-103` The datasource must be enabled for search.
- `C-101` Bulk indexing replaces the datasource; omitted documents are deleted.
- `C-102` /indexdocuments is for incremental updates.

### S-13 - Bulk Upload Model

- `C-109` One unique uploadId per upload session.
- `C-105` No concurrent bulk uploads.
- `C-106` After a failed upload, forceRestartUpload is required.
- `C-107` Stale deletion pauses 7 days above 20%.
- `C-108` Use /processalldocuments for immediate deletions.

### S-14 - Indexing API Quickstart

- `C-110` Indexing is asynchronous.

### S-16 - Permissions (Indexing API guide)

- `C-111` Index users before referencing them.
- `C-114` Index a group before its memberships.
- `C-116` Permissions and memberships process asynchronously.
- `C-112` Indexing a user grants no document access.

### S-17 - Document Model

- `C-117` allowAnonymousAccess exposes the document to every signed-in user.

### S-19 - Indexing SDK — Indexing modes

- `C-170` Never let a partial fetch complete as a full crawl.
- `C-177` An empty full crawl clears the datasource.

### S-20 - Indexing SDK — Permissions

- `C-200` Search as the user is ground truth.
- `C-196` Unknown groups match nobody.
- `C-195` Never allow-all 'for now'.
- `C-199` Counts prove nothing about permissions.

### S-21 - Indexing SDK — Architecture

- `C-163` Full = replacement; incremental = additive.

### S-28 - Indexing SDK — Status and debugging

- `C-205` ACLs fail without pushed identities.
- `C-202` Four-step missing-document diagnosis.
- `C-203` 'Appears then disappears' means stale deletion.

### S-33 - Indexing SDK — Quickstart

- `C-160` Accepted is not searchable.

### S-37 - Rate Limits and Retries

- `C-079` /processalldocuments: once every 3 hours per datasource.

### S-38 - Test Datasource

- `C-124` Beta users still need document permissions.
- `C-123` Test datasources have ranking signals off.

### S-44 - Glean Partner Content | Custom Connector Best Practices (deck, April 2026)

- `C-232` One shared queue: one backlog can delay another.
- `C-234` Processing checks identity and permission dependencies before results show.
- `C-233` Worst case latency can exceed 24 hours.
- `C-241` Metadata-only results cannot ground Assistant.
- `C-231` Native full re-crawl every 4 weeks as a catch-all.

### S-46 - Glean Custom Connector Content Package

- `C-093` Apply the size limits to custom connectors too.

## Conflicts and gaps

See `conflicts.md`. Every claim in this module is learner-facing and verified verbatim against the source text. Internal engineering, reviewer, and field evidence from the authoring ledger is excluded from this module.
