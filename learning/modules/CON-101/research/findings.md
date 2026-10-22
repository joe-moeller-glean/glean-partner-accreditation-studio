# CON-101 Connector Fundamentals: Indexed, Live, Hybrid, and MCP - research findings

Verified 2026-09-27. 45 claims drawn from 12 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-01` | [About connectors](https://docs.glean.com/connectors/about) | Glean Docs | 2026-09-23 | 1 |
| `S-02` | [How connectors power the Glean experience](https://docs.glean.com/connectors/connectors-power-glean) | Glean Docs | 2026-08-04 | 1 |
| `S-03` | [Overview of custom data source](https://docs.glean.com/connectors/custom/about) | Glean Docs | 2026-08-19 | 1 |
| `S-04` | [Choose a deployment model](https://docs.glean.com/connectors/custom/deployment) | Glean Docs | 2026-06-29 | 1 |
| `S-08` | [Migrate from a native connector to a custom connector](https://docs.glean.com/connectors/custom/migration-playbook) | Glean Docs | 2026-08-18 | 1 |
| `S-09` | [Set up tools and MCP integrations from Connectors](https://docs.glean.com/connectors/configure-tools-in-connector/config-tools-mcp-from-connector) | Glean Docs | 2026-09-23 | 1 |
| `S-11` | [Indexing API overview](https://developers.glean.com/api/indexing-api) | Glean Developer | 2026-09-19 | 1 |
| `S-26` | [Indexing SDK — Pagination](https://developers.glean.com/libraries/indexing-sdk/pull/pagination) | Glean Developer | 2026-09 | 1 |
| `S-43` | [NetSuite MCP](https://docs.glean.com/connectors/native/netsuite/mcp) | Glean Docs | 2026-09-25 | 1 |
| `S-44` | [Glean Partner Content | Custom Connector Best Practices (deck, April 2026)](https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg) | Joe Moeller | 2026-09-08 | 2 |
| `S-45` | [[External] Glean Partner Content | Custom Connector Questionnaire](https://docs.google.com/spreadsheets/d/1jWeZyvGmpiChLEgjHNk52dioZPJ2dZJTw_cVDq4HsF8) | Eugene Wiehahn | 2025-05-16 | 2 |
| `S-49` | [[Template] Custom Connector Intake Form v2](https://docs.google.com/document/d/11TcVp1W61fZ7EuOSfztFHEIA3BsdO6jVGMzY9pcai9M) | Joe Moeller | 2026-07-10 | 2 |

## Claims by source

### S-01 - About connectors

- `C-001` A connector integrates Glean with a system where content lives.
- `C-002` Indexing connectors index content, mirror source permissions, and keep data current in the tenant.
- `C-003` Connector function 1: data fetching, including the permissions map.
- `C-004` Connector function 2: content and permission parsing.
- `C-015` Connector data is encrypted in transit and written to disk only in the tenant.
- `C-006` Glean needs content, people, and activity data to build the Knowledge Graph.
- `C-016` Activity signals drive relevance ranking.
- `C-017` Native freshness uses webhooks or incremental crawling.
- `C-005` Native connectors are purpose-built per application and call source APIs directly.
- `C-007` Web history connectors surface page titles from a user's browsing history, private to that user.
- `C-008` Push API connectors push data through the Indexing API for custom, self-hosted, or firewalled systems.
- `C-009` Shared push connector code may have limited support.
- `C-010` Partner connectors use the Indexing API and are built and supported by the partner.
- `C-011` Tools (including MCP) act at request time and do not make content searchable.
- `C-013` Indexed access uses the mirrored permission snapshot.
- `C-012` Three access modes: indexed, live, hybrid.
- `C-014` Live access can require per-user authentication.

### S-02 - How connectors power the Glean experience

- `C-019` Identity resolution aligns identities across systems.
- `C-018` The Enterprise Graph is layered on the index and identity/permission structures.
- `C-025` The source may enforce access again at click time.
- `C-023` The runtime chooses index, live, or hybrid paths per request.
- `C-021` Indexed mode suits bulk corpora and historical or cross-document questions.
- `C-022` Live retrieval suits freshness-dominant data or data impractical to index.
- `C-020` Permission mirroring depends on correct connector configuration.

### S-03 - Overview of custom data source

- `C-040` Custom connectors ingest data from sources without native support.

### S-04 - Choose a deployment model

- `C-045` Choose hosting before building.

### S-08 - Migrate from a native connector to a custom connector

- `C-080` Native and custom connectors use separate namespaces.
- `C-081` Artifacts scoped to a native connector do not carry over.

### S-09 - Set up tools and MCP integrations from Connectors

- `C-027` New deployments set up catalog MCP integrations from Connectors.
- `C-029` Custom or unlisted MCP servers use a separate setup path.
- `C-028` One app can have separate indexing and tools entries.

### S-11 - Indexing API overview

- `C-100` Custom Metadata works on any datasource without re-indexing.

### S-26 - Indexing SDK — Pagination

- `C-190` Offset pagination is unstable under writes.

### S-43 - NetSuite MCP

- `C-030` Example: NetSuite MCP uses each user's own credentials and role at request time.
- `C-031` Example of a hybrid design: the MCP entry depends on the indexing connector.

### S-44 - Glean Partner Content | Custom Connector Best Practices (deck, April 2026)

- `C-241` Metadata-only results cannot ground Assistant.
- `C-032` For live data, consider custom actions or MCP.
- `C-033` For large structured data lakes, query with an action or MCP server.
- `C-035` Use an existing connector before building a new one.
- `C-034` Glean is not a time-series or sensor analytics platform.
- `C-135` No activity means weaker ranking.
- `C-136` Custom results can be outranked without signals.

### S-45 - [External] Glean Partner Content | Custom Connector Questionnaire

- `C-253` Fallback when no API: export to storage.
- `C-250` Scoping asks about native and web-crawler options first.

### S-49 - [Template] Custom Connector Intake Form v2

- `C-273` Partner maintains published connectors.

## Conflicts and gaps

See `conflicts.md`. Every claim in this module is learner-facing and verified verbatim against the source text. Internal engineering, reviewer, and field evidence from the authoring ledger is excluded from this module.
