# CON-203 Indexing API and the Glean Data Model - research findings

Verified 2026-09-27. 65 claims drawn from 25 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-05` | [Set up a custom connector](https://docs.glean.com/connectors/custom/setup) | Glean Docs | 2026-09-21 | 1 |
| `S-06` | [Glean REST APIs](https://docs.glean.com/connectors/custom/glean-apis) | Glean Docs | 2026-06-29 | 1 |
| `S-07` | [Troubleshooting (custom connectors)](https://docs.glean.com/connectors/custom/troubleshooting) | Glean Docs | 2026-08-18 | 1 |
| `S-08` | [Migrate from a native connector to a custom connector](https://docs.glean.com/connectors/custom/migration-playbook) | Glean Docs | 2026-08-18 | 1 |
| `S-10` | [Crawl and index limits](https://docs.glean.com/connectors/crawler-and-indexing-limits) | Glean Docs | 2026-06-30 | 1 |
| `S-11` | [Indexing API overview](https://developers.glean.com/api/indexing-api) | Glean Developer | 2026-09-19 | 1 |
| `S-12` | [Bulk Indexing](https://developers.glean.com/api-info/indexing/documents/bulk-indexing) | Glean Developer | 2026-09-20 | 1 |
| `S-13` | [Bulk Upload Model](https://developers.glean.com/api-info/indexing/documents/bulk-upload-model) | Glean Developer | 2026-09-19 | 1 |
| `S-15` | [Indexing API Authentication](https://developers.glean.com/api-info/indexing/authentication/overview) | Glean Developer | 2026-09-18 | 1 |
| `S-16` | [Permissions (Indexing API guide)](https://developers.glean.com/api-info/indexing/documents/permissions) | Glean Developer | 2026-09-20 | 1 |
| `S-17` | [Document Model](https://developers.glean.com/api-info/indexing/documents/document-model) | Glean Developer | 2026-09-20 | 1 |
| `S-18` | [Setup Datasource](https://developers.glean.com/api-info/indexing/getting-started/setup-datasource) | Glean Developer | 2026-09-18 | 1 |
| `S-20` | [Indexing SDK — Permissions](https://developers.glean.com/libraries/indexing-sdk/permissions) | Glean Developer | 2026-09-18 | 1 |
| `S-32` | [Indexing SDK — Overview](https://developers.glean.com/libraries/indexing-sdk/) | Glean Developer | 2026-09-18 | 1 |
| `S-33` | [Indexing SDK — Quickstart](https://developers.glean.com/libraries/indexing-sdk/quickstart) | Glean Developer | 2026-09-19 | 1 |
| `S-34` | [Custom Properties](https://developers.glean.com/api-info/indexing/datasource/custom-properties) | Glean Developer | 2026-09-19 | 1 |
| `S-35` | [Custom Properties vs Custom Metadata](https://developers.glean.com/api-info/indexing/custom-metadata/custom-properties-vs-custom-metadata) | Glean Developer | 2026-09-19 | 1 |
| `S-36` | [Activity](https://developers.glean.com/api-info/indexing/documents/activity) | Glean Developer | 2026-09-18 | 1 |
| `S-37` | [Rate Limits and Retries](https://developers.glean.com/get-started/rate-limits) | Glean Developer | 2026-09-18 | 1 |
| `S-38` | [Test Datasource](https://developers.glean.com/api-info/indexing/datasource/test-datasource) | Glean Developer | 2026-09-18 | 1 |
| `S-39` | [Supported MIME Types](https://developers.glean.com/api-info/indexing/documents/supported-mimetypes) | Glean Developer | 2026-09-18 | 1 |
| `S-40` | [Datasource Category](https://developers.glean.com/api-info/indexing/datasource/category) | Glean Developer | 2026-09-20 | 1 |
| `S-42` | [Index document (API reference)](https://developers.glean.com/api/indexing-api/index-document) | Glean Developer | 2026-09-20 | 1 |
| `S-44` | [Glean Partner Content | Custom Connector Best Practices (deck, April 2026)](https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg) | Joe Moeller | 2026-09-08 | 2 |
| `S-46` | [Glean Custom Connector Content Package](https://docs.google.com/document/d/16wEo2ny-s7TIQsyiNAlYLvZc7aPAoQdmCymQkrPYKh4) | Eugene Wiehahn | 2026-05-25 | 2 |

## Claims by source

### S-05 - Set up a custom connector

- `C-049` First-run: one public, then one permissioned document, then scale.

### S-06 - Glean REST APIs

- `C-050` The Indexing (Push) API pushes documents, users, permissions, metadata.
- `C-051` The Client API is for custom client interfaces.

### S-07 - Troubleshooting (custom connectors)

- `C-075` /processalldocuments reprocesses without a new upload.
- `C-076` Use /processallmemberships for identity problems.
- `C-071` allowAllDatasourceUsersAccess requires the user to be indexed as a datasource user.
- `C-077` Custom property validation fails fast on the first error.
- `C-070` Documents are searchable after processingHistory passes bulkUploadHistory.
- `C-072` UPLOAD COMPLETED is acceptance, not searchability.
- `C-074` Wrong pagination flags can make a partial upload look complete.
- `C-078` Support tickets need issue, endpoint/body, connector name, timestamp/timezone.

### S-08 - Migrate from a native connector to a custom connector

- `C-080` Native and custom connectors use separate namespaces.

### S-10 - Crawl and index limits

- `C-090` Items over 64 MB index metadata and permissions only.
- `C-091` Indexable text is truncated at 16.875 MB.
- `C-092` Spreadsheets index about 250,000 characters.

### S-11 - Indexing API overview

- `C-100` Custom Metadata works on any datasource without re-indexing.

### S-12 - Bulk Indexing

- `C-102` /indexdocuments is for incremental updates.
- `C-101` Bulk indexing replaces the datasource; omitted documents are deleted.
- `C-103` The datasource must be enabled for search.

### S-13 - Bulk Upload Model

- `C-109` One unique uploadId per upload session.
- `C-105` No concurrent bulk uploads.
- `C-106` After a failed upload, forceRestartUpload is required.
- `C-108` Use /processalldocuments for immediate deletions.
- `C-107` Stale deletion pauses 7 days above 20%.

### S-15 - Indexing API Authentication

- `C-052` Indexing API accepts only Glean-issued tokens.
- `C-058` 413 means the request is too large; split it.

### S-16 - Permissions (Indexing API guide)

- `C-111` Index users before referencing them.
- `C-114` Index a group before its memberships.
- `C-112` Indexing a user grants no document access.
- `C-115` Nested groups use memberGroupName.
- `C-113` Group names: no whitespace, not empty, no 'scio' prefix.
- `C-116` Permissions and memberships process asynchronously.

### S-17 - Document Model

- `C-117` allowAnonymousAccess exposes the document to every signed-in user.

### S-18 - Setup Datasource

- `C-119` urlRegex must be neither too broad nor too narrow.
- `C-118` isUserReferencedByEmail decides email vs ID references.

### S-20 - Indexing SDK — Permissions

- `C-198` Intersection semantics.
- `C-197` Do not flatten groups into users.

### S-32 - Indexing SDK — Overview

- `C-150` The SDK is a client for the Indexing API.
- `C-153` Timestamps are epoch seconds.

### S-33 - Indexing SDK — Quickstart

- `C-158` Datasource name: ASCII letters and digits only.

### S-34 - Custom Properties

- `C-125` Define custom properties before uploading.
- `C-126` INT properties are not faceted.
- `C-127` DATE facets need epoch seconds.
- `C-128` Rendering properties in results needs Glean support.
- `C-129` The 'country' property is a location ranking signal.

### S-35 - Custom Properties vs Custom Metadata

- `C-130` Custom property updates need a full re-upload.
- `C-132` Only Custom Properties support INT, DATE, USERID.
- `C-131` Re-indexing does not change Custom Metadata.

### S-36 - Activity

- `C-133` Activity uses a Client API token.
- `C-134` Activity needs a global Client token scoped to ACTIVITY.

### S-37 - Rate Limits and Retries

- `C-137` /indexdocument 10 rps; /indexdocuments 600 docs/min.
- `C-079` /processalldocuments: once every 3 hours per datasource.
- `C-138` Deployment limit: 8,000 rpm across IPs.
- `C-139` Deployment limit: 100 rps from one IP.

### S-38 - Test Datasource

- `C-123` Test datasources have ranking signals off.
- `C-124` Beta users still need document permissions.

### S-39 - Supported MIME Types

- `C-094` JSON and XML MIME types are not supported for content.

### S-40 - Datasource Category

- `C-121` Datasource category affects ranking.
- `C-120` Set per-object category with docCategory.
- `C-122` Do not use the PEOPLE category.

### S-42 - Index document (API reference)

- `C-140` /indexdocument can return 400, 401, 409, 429.

### S-44 - Glean Partner Content | Custom Connector Best Practices (deck, April 2026)

- `C-035` Use an existing connector before building a new one.
- `C-135` No activity means weaker ranking.
- `C-136` Custom results can be outranked without signals.

### S-46 - Glean Custom Connector Content Package

- `C-093` Apply the size limits to custom connectors too.

## Conflicts and gaps

See `conflicts.md`. Every claim in this module is learner-facing and verified verbatim against the source text. Internal engineering, reviewer, and field evidence from the authoring ledger is excluded from this module.
