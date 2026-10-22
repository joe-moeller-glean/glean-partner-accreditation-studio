# TEC-201 Connector Deployment Prerequisites - research findings

Verified 2026-09-27. 24 claims drawn from 11 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-04` | [Choose a deployment model](https://docs.glean.com/connectors/custom/deployment) | Glean Docs | 2026-06-29 | 1 |
| `S-05` | [Set up a custom connector](https://docs.glean.com/connectors/custom/setup) | Glean Docs | 2026-09-21 | 1 |
| `S-06` | [Glean REST APIs](https://docs.glean.com/connectors/custom/glean-apis) | Glean Docs | 2026-06-29 | 1 |
| `S-12` | [Bulk Indexing](https://developers.glean.com/api-info/indexing/documents/bulk-indexing) | Glean Developer | 2026-09-20 | 1 |
| `S-15` | [Indexing API Authentication](https://developers.glean.com/api-info/indexing/authentication/overview) | Glean Developer | 2026-09-18 | 1 |
| `S-18` | [Setup Datasource](https://developers.glean.com/api-info/indexing/getting-started/setup-datasource) | Glean Developer | 2026-09-18 | 1 |
| `S-20` | [Indexing SDK — Permissions](https://developers.glean.com/libraries/indexing-sdk/permissions) | Glean Developer | 2026-09-18 | 1 |
| `S-38` | [Test Datasource](https://developers.glean.com/api-info/indexing/datasource/test-datasource) | Glean Developer | 2026-09-18 | 1 |
| `S-40` | [Datasource Category](https://developers.glean.com/api-info/indexing/datasource/category) | Glean Developer | 2026-09-20 | 1 |
| `S-44` | [Glean Partner Content | Custom Connector Best Practices (deck, April 2026)](https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg) | Joe Moeller | 2026-09-08 | 2 |
| `S-45` | [[External] Glean Partner Content | Custom Connector Questionnaire](https://docs.google.com/spreadsheets/d/1jWeZyvGmpiChLEgjHNk52dioZPJ2dZJTw_cVDq4HsF8) | Eugene Wiehahn | 2025-05-16 | 2 |

## Claims by source

### S-04 - Choose a deployment model

- `C-046` Self-hosted networking must allow pushes to Glean indexing endpoints.
- `C-045` Choose hosting before building.
- `C-047` Self-host when residency, isolation, or policy requires it.

### S-05 - Set up a custom connector

- `C-049` First-run: one public, then one permissioned document, then scale.
- `C-048` Choose the permissions model at setup.

### S-06 - Glean REST APIs

- `C-060` Indexing tokens support IP range restrictions.

### S-12 - Bulk Indexing

- `C-103` The datasource must be enabled for search.

### S-15 - Indexing API Authentication

- `C-054` Indexing tokens require an expiry date.
- `C-052` Indexing API accepts only Glean-issued tokens.
- `C-053` Minimum token rotation period is 1440 minutes.
- `C-056` Only Super Admins can grant global indexing scope.
- `C-059` IP restrictions limit tokens to known infrastructure.
- `C-055` The token value is shown once.
- `C-057` Use separate tokens per environment.

### S-18 - Setup Datasource

- `C-119` urlRegex must be neither too broad nor too narrow.
- `C-118` isUserReferencedByEmail decides email vs ID references.

### S-20 - Indexing SDK — Permissions

- `C-199` Counts prove nothing about permissions.

### S-38 - Test Datasource

- `C-124` Beta users still need document permissions.
- `C-123` Test datasources have ranking signals off.

### S-40 - Datasource Category

- `C-121` Datasource category affects ranking.

### S-44 - Glean Partner Content | Custom Connector Best Practices (deck, April 2026)

- `C-238` Automate token rotation.

### S-45 - [External] Glean Partner Content | Custom Connector Questionnaire

- `C-251` Prefer read-only keys.
- `C-254` Ask for a sandbox.
- `C-256` Ask whether the API URL is static.

## Conflicts and gaps

See `conflicts.md`. Every claim in this module is learner-facing and verified verbatim against the source text. Internal engineering, reviewer, and field evidence from the authoring ledger is excluded from this module.
