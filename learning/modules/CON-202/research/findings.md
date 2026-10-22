# CON-202 Custom Connector Scoping and Intake - research findings

Verified 2026-09-27. 39 claims drawn from 15 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-01` | [About connectors](https://docs.glean.com/connectors/about) | Glean Docs | 2026-09-23 | 1 |
| `S-02` | [How connectors power the Glean experience](https://docs.glean.com/connectors/connectors-power-glean) | Glean Docs | 2026-08-04 | 1 |
| `S-03` | [Overview of custom data source](https://docs.glean.com/connectors/custom/about) | Glean Docs | 2026-08-19 | 1 |
| `S-04` | [Choose a deployment model](https://docs.glean.com/connectors/custom/deployment) | Glean Docs | 2026-06-29 | 1 |
| `S-10` | [Crawl and index limits](https://docs.glean.com/connectors/crawler-and-indexing-limits) | Glean Docs | 2026-06-30 | 1 |
| `S-16` | [Permissions (Indexing API guide)](https://developers.glean.com/api-info/indexing/documents/permissions) | Glean Developer | 2026-09-20 | 1 |
| `S-18` | [Setup Datasource](https://developers.glean.com/api-info/indexing/getting-started/setup-datasource) | Glean Developer | 2026-09-18 | 1 |
| `S-19` | [Indexing SDK — Indexing modes](https://developers.glean.com/libraries/indexing-sdk/concepts/indexing-modes) | Glean Developer | 2026-09-18 | 1 |
| `S-20` | [Indexing SDK — Permissions](https://developers.glean.com/libraries/indexing-sdk/permissions) | Glean Developer | 2026-09-18 | 1 |
| `S-22` | [Indexing SDK — Connector types](https://developers.glean.com/libraries/indexing-sdk/concepts/connector-types) | Glean Developer | 2026-09-20 | 1 |
| `S-27` | [Indexing SDK — Rate limiting](https://developers.glean.com/libraries/indexing-sdk/pull/rate-limiting) | Glean Developer | 2026-09 | 1 |
| `S-32` | [Indexing SDK — Overview](https://developers.glean.com/libraries/indexing-sdk/) | Glean Developer | 2026-09-18 | 1 |
| `S-37` | [Rate Limits and Retries](https://developers.glean.com/get-started/rate-limits) | Glean Developer | 2026-09-18 | 1 |
| `S-44` | [Glean Partner Content | Custom Connector Best Practices (deck, April 2026)](https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg) | Joe Moeller | 2026-09-08 | 2 |
| `S-45` | [[External] Glean Partner Content | Custom Connector Questionnaire](https://docs.google.com/spreadsheets/d/1jWeZyvGmpiChLEgjHNk52dioZPJ2dZJTw_cVDq4HsF8) | Eugene Wiehahn | 2025-05-16 | 2 |

## Claims by source

### S-01 - About connectors

- `C-006` Glean needs content, people, and activity data to build the Knowledge Graph.

### S-02 - How connectors power the Glean experience

- `C-021` Indexed mode suits bulk corpora and historical or cross-document questions.

### S-03 - Overview of custom data source

- `C-042` Scheduling like native connectors applies to Glean-hosted deployments.
- `C-040` Custom connectors ingest data from sources without native support.

### S-04 - Choose a deployment model

- `C-045` Choose hosting before building.
- `C-044` No runtime or hosting constraints.
- `C-046` Self-hosted networking must allow pushes to Glean indexing endpoints.
- `C-047` Self-host when residency, isolation, or policy requires it.

### S-10 - Crawl and index limits

- `C-090` Items over 64 MB index metadata and permissions only.

### S-16 - Permissions (Indexing API guide)

- `C-111` Index users before referencing them.
- `C-116` Permissions and memberships process asynchronously.

### S-18 - Setup Datasource

- `C-118` isUserReferencedByEmail decides email vs ID references.

### S-19 - Indexing SDK — Indexing modes

- `C-176` Common schedule: full nightly or weekly.
- `C-170` Never let a partial fetch complete as a full crawl.
- `C-175` Common schedule: incremental 15–60 min.

### S-20 - Indexing SDK — Permissions

- `C-195` Never allow-all 'for now'.
- `C-197` Do not flatten groups into users.
- `C-198` Intersection semantics.

### S-22 - Indexing SDK — Connector types

- `C-169` Employee data is separate from ACL identities.

### S-27 - Indexing SDK — Rate limiting

- `C-193` Run below the source quota.
- `C-194` Rate limiting is proactive; retries are reactive.

### S-32 - Indexing SDK — Overview

- `C-154` Full crawls must cover the entire scope.

### S-37 - Rate Limits and Retries

- `C-137` /indexdocument 10 rps; /indexdocuments 600 docs/min.
- `C-138` Deployment limit: 8,000 rpm across IPs.
- `C-139` Deployment limit: 100 rps from one IP.

### S-44 - Glean Partner Content | Custom Connector Best Practices (deck, April 2026)

- `C-035` Use an existing connector before building a new one.
- `C-241` Metadata-only results cannot ground Assistant.
- `C-240` Without identity data, a manual user map is needed.
- `C-135` No activity means weaker ranking.
- `C-136` Custom results can be outranked without signals.
- `C-238` Automate token rotation.

### S-45 - [External] Glean Partner Content | Custom Connector Questionnaire

- `C-250` Scoping asks about native and web-crawler options first.
- `C-251` Prefer read-only keys.
- `C-252` Check source users match SSO users.
- `C-254` Ask for a sandbox.
- `C-255` Define the viewURL target.
- `C-256` Ask whether the API URL is static.
- `C-257` Ask permission change frequency.
- `C-253` Fallback when no API: export to storage.

## Conflicts and gaps

See `conflicts.md`. Every claim in this module is learner-facing and verified verbatim against the source text. Internal engineering, reviewer, and field evidence from the authoring ledger is excluded from this module.
