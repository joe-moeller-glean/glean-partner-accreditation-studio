# Connectors and Custom Connectors in Glean — Research Baseline

> **Superseded 2026-09-26 by [`plan/custom-connectors/`](./custom-connectors/README.md) (v2).** v2 corrects four factual defects and two source-ledger defects found in this file (see [`00-review-and-change-log.md`](./custom-connectors/00-review-and-change-log.md)). Keep for history only.


**Research date:** 2026-09-26  
**Purpose:** Source-backed baseline for a partner learning path and Custom Connector Competency accreditation.  
**Authority rule:** Current Glean Developer and product documentation is authoritative for product behavior. Internal enablement material is authoritative for program process, partner motion, and context. Where they disagree, re-verify against current documentation and record the ruling.

## 1. Executive findings

1. A Glean connector is an integration with a source system. It brings source content and its access model into Glean so the platform can provide permission-aware experiences.
2. Connector data can be **indexed**, **live/federated**, or **hybrid**. Indexed data is crawled or pushed ahead of time. Live data is fetched at query time. Hybrid uses both.
3. MCP is primarily a live tool/query and action path. It does not replace an indexed corpus when the use case needs broad recall, historical search, low-latency retrieval, cross-document context, or the indexed permission-aware knowledge layer.
4. A native connector is built and maintained as a managed Glean integration for a supported source. A custom connector is a source-specific integration for a proprietary or unsupported source, using the Indexing API or an SDK built on it. The custom implementation owns source access, transformation, scheduling, and operational maintenance.
5. A complete indexing architecture must address content, identity, permissions, and activity. A connector that only proves that documents upload is not production-ready.
6. The current Glean Indexing SDK is the preferred build accelerator for Python custom connectors. It supplies connector base classes, source HTTP utilities, pagination, rate limiting, batching, uploads, permission/identity support, testing phases, observability, status/debugging, and deployment scaffolding. The partner still owns source-specific authentication, extraction, mapping, business rules, and operational decisions.
7. The accreditation must assess both engineering and delivery. A working connector without a scope/intake record, permission proof, test evidence, deployment plan, handoff runbook, maintenance plan, and customer evidence is incomplete.

## 2. Connector concepts

### 2.1 Indexed, live, and hybrid access

| Mode | What happens | Best fit | Main tradeoff |
|---|---|---|---|
| Indexed | Content, metadata, permissions, and often activity are crawled or pushed into the tenant index. Query-time retrieval starts from that corpus. | Large or historical corpora, cross-document questions, search, Assistant grounding, agents that need durable context. | Freshness depends on crawl, webhook, or push cadence; source changes need a reliable update and delete path. |
| Live / federated | Glean calls the source at query time, usually through a source integration or tool. | Fresh point lookup, source-native queries, actions, or data that should not be copied into the index. | Query latency, source availability, per-user authorization, API limits, and limited cross-document recall. |
| Hybrid | Indexed context provides recall and graph grounding; live access provides fresh details or actions. | Sources where users need both enterprise search and current records or write operations. | Two authentication and failure models; the implementation and UX must make the boundary clear. |

**Teaching point:** “Connector” is not synonymous with “crawler.” A connector may support indexed access, real-time retrieval, tools, or a combination. Always identify the user outcome before selecting a mechanism.

### 2.2 MCP

MCP exposes tools or live queries to an assistant or agent. It is appropriate when the primary requirement is real-time lookup or an action in the source system. It is not the right sole primitive when the requirement is organization-wide indexed search, historical recall, graph relationships, durable grounding, or common retrieval across many Glean surfaces.

Use **indexing + MCP** when the source needs both durable searchable context and live actions. The two paths must be evaluated separately for authentication, permissions, rate limits, auditability, error handling, and user expectations.

### 2.3 Native, partner, web, and custom connectors

- **Native connector:** Glean-developed and managed integration for a supported application and data model. Glean owns the integration lifecycle and standard product behavior.
- **Partner connector:** An integration supplied through the partner ecosystem or connector catalog. Ownership, support, publication, and maintenance terms must be explicit.
- **Web connector:** A crawler pattern for accessible web content when structured source APIs are not required or available.
- **Custom connector:** A customer-, partner-, or Glean-built integration for an unsupported or proprietary source. It pushes normalized content, metadata, permissions, and related entities into a distinct custom datasource through Glean’s Indexing API.

A custom connector is not a shortcut around permissions or operations. It creates more flexibility and more ownership.

## 3. End-to-end indexing architecture

The learner should be able to trace one record from the source to a permission-aware answer.

### Stage 0 — Outcome and fit

1. Identify the user jobs: search, Assistant grounding, agent context, live query, action, or a combination.
2. Check for a native connector, partner connector, web crawler, federated/live option, or MCP server.
3. Decide whether the source should be indexed, queried live, or integrated through both.
4. Define success measures: coverage, freshness, permission correctness, latency, source-link behavior, ranking/facets, and operational ownership.

### Stage 1 — Source and contract discovery

1. Identify the source system, tenant, environments, owners, API version, data types, and legal/compliance boundaries.
2. Document authentication, scopes, tokens, network path, pagination, quotas, rate limits, retries, and failure responses.
3. Identify stable source IDs, parent/child relationships, MIME/content formats, titles, timestamps, authors, owners, URLs, and custom fields.
4. Determine whether the source exposes full, incremental, activity, identity, permission, and webhook/change-event data.
5. Estimate corpus size, document size distribution, change rate, deletion rate, and expected update latency.

### Stage 2 — Identity and permission design

1. Map source users, groups, roles, aliases, and membership to the Glean identity model.
2. Decide how document ACLs are obtained and represented.
3. Verify that source identities match the customer’s SSO/people data identifiers.
4. Handle direct access, group access, inherited access, public/anonymous access, and permission removal.
5. Define negative tests: a permitted user sees the document; an unauthorized user does not; revoked access disappears after the expected update path.

### Stage 3 — Extraction or push

- A native connector usually pulls from the source through a managed crawler.
- A custom connector runs code outside the source and pushes records to the custom datasource through the Indexing API.
- The custom job may run in Glean-managed infrastructure or in the customer/partner cloud, depending on the chosen deployment model and contract.
- The source-specific code must handle authentication, pagination, rate limits, retries, backoff, checkpointing, and source errors.

### Stage 4 — Normalize and transform

Map source records into Glean document, user, group, membership, employee, permission, and metadata models. Preserve stable IDs and source URLs. Normalize dates, content types, language, authors, owners, and fields used for search filters. Make the transform deterministic and idempotent.

### Stage 5 — Upload and asynchronous processing

1. Create or configure the custom datasource.
2. Upload documents and related identity/permission entities using the Indexing API or SDK.
3. Batch and retry safely. Record request and document-level failures.
4. Treat upload completion as an ingestion milestone, not proof that content is searchable.
5. Track upload, processing, and indexed states separately. Processing is asynchronous.
6. Delete or tombstone removed source records. A full replacement or complete crawl must not accidentally omit records from a shared datasource.

### Stage 6 — Glean processing and storage

Glean stores raw connector data before downstream processing so ingestion is decoupled from processing and can be reprocessed. Content, identity, permissions, and activity are normalized into the tenant’s stores. The indexing and identity/permission structures support the Enterprise Graph and permission-aware retrieval.

### Stage 7 — Index and graph enrichment

The index creates searchable representations, including text and metadata. Identity and membership data support ACL evaluation. Activity and relationship signals support relevance and personalization. The Enterprise Graph connects people, documents, work items, and organizational context; it is not simply a list of uploaded files.

### Stage 8 — Retrieval and experience

At query time, Glean retrieves candidates from the indexed corpus and applies permission rules for the requesting user. Search, Chat, Assistant, agents, embedded experiences, and Glean’s MCP access path can reuse the resulting permission-aware context, subject to each surface’s behavior and configuration. Live or hybrid paths may call the source for current data or actions.

### Stage 9 — Verify and operate

Validate coverage, freshness, links, metadata, ranking, facets, ACLs, deletion, error recovery, rate-limit behavior, observability, cost, and support ownership. Monitor source API changes and Glean API/SDK changes. Maintain a runbook and a customer-approved maintenance plan.

## 4. Native versus custom connector

| Dimension | Native connector | Custom connector |
|---|---|---|
| Source fit | Supported application and model | Proprietary, unsupported, legacy, self-hosted, or uniquely shaped source |
| Build owner | Glean product/engineering | Customer, partner, or Glean custom connector team |
| Data movement | Usually managed pull/crawl; may include live or hybrid access | Usually partner/customer-managed push through Indexing API, or a managed custom runtime |
| Source-specific code | Abstracted from the customer | Required and owned by the builder |
| Permissions | Implemented in the managed connector | Must be designed, mapped, tested, and maintained by the builder |
| Freshness | Managed crawl/webhook strategy varies by connector | Builder chooses polling, incremental, event-driven, or full-replacement strategy |
| Maintenance | Glean tracks product/API changes | Partner/customer must monitor and update source integration code |
| Namespace | Built-in connector identity | Separate custom datasource identity and document IDs |
| Default recommendation | Prefer when it meets requirements | Use when native/partner/web/live options do not meet the use case or a deliberate custom design is justified |

**Do not use a custom connector by default.** Prefer a native connector when it covers the required data, permissions, freshness, and experience. Consider custom when the source is not supported, the native connector lacks essential data or controls, the source is proprietary/self-hosted, or a partner needs a specialized schema and has an owner for production maintenance.

**Migration warning:** Native and custom connectors use separate namespaces. A custom replacement requires parallel validation and migration of dependent artifacts such as app filters, saved searches, pinned results, and agent references before deactivating the native connector.

## 5. Custom connector structure

A production connector should include:

```text
connector-project/
├── connector.py              # construction seam and connector lifecycle
├── data_client.py            # source auth, requests, pagination, retries
├── models.py                 # typed source records and mapping types
├── transform.py              # source record → Glean document/identity models
├── permissions.py            # ACL and identity mapping logic
├── config.py                 # environment-backed configuration; no secrets in code
├── tests/
│   ├── unit/                 # mapping and failure behavior
│   ├── recorded/             # source record/replay tests
│   └── live/                 # disposable datasource end-to-end tests
├── deployment/               # generated Docker/Terraform or approved runtime config
├── docs/
│   ├── architecture.md
│   ├── intake.md
│   ├── test-plan.md
│   ├── runbook.md
│   ├── maintenance-plan.md
│   └── handoff.md
└── pyproject.toml
```

The exact layout may vary, but the responsibility boundaries must remain visible: fetch, transform, permission/identity, upload, test, deploy, and operate.

## 6. Indexing API and library map

### Core Glean APIs

- Datasource creation and configuration.
- Index document / update document.
- Delete document.
- Bulk indexing and upload-session workflows where supported.
- User, group, membership, and employee/people indexing as required by the source and current API contract.
- Custom metadata and custom properties.
- Datasource, upload, document, processing, and debug status.
- Authentication and token scope management.
- Client API for search/chat is separate from the Indexing API; it is useful for verification or an application experience, not a substitute for ingestion.
- Web SDK is an optional presentation layer for embedded search/chat, not a connector ingestion library.

Teach the endpoint names from the current Developer documentation at build time. Do not freeze a lesson to an old generated-client method without a versioned source check.

### Indexing SDK

The current SDK is Python-based and is installed as `glean-indexing-sdk`. The learner should understand:

- **Base connector types:** in-memory, synchronous streaming, asynchronous streaming, and people/identity.
- **Pull layer:** `BaseDataClient`, `PullHttpClient`, retries/backoff, link/offset/cursor pagination, token-bucket rate limiting.
- **Push layer:** `PushUploader` for documents and identity entities; batching and parallel upload behavior.
- **Models:** typed source data, document definitions, datasource configuration, indexing modes, identity definitions, and connector options.
- **Permissions:** per-document ACLs and datasource identity definitions.
- **Construction:** a module-level `create_connector()` seam supports dependency injection, test doubles, CLI execution, and cloud deployment.
- **Testing:** mocked, real-source record/replay, and live end-to-end phases.
- **Operations:** structured logs, stage timings, metrics, optional AWS and GCP observability plugins, status clients, and document-access debugging.
- **CLI:** `glean-idx doctor`, `validate`, `test`, `run`, datasource/document status, and `deploy`.
- **Deployment:** generated Docker and Terraform for supported AWS/GCP scheduled-job patterns; custom hosting remains possible if the Indexing API contract is honored.
- **Connector Builder:** an agent plugin can explore the source API, generate SDK-based code, and run tests. Generated code still requires human review of permissions, completeness, failure modes, security, and operational ownership.

## 7. Best-practice checklist

### Scope and fit

- Start with user outcomes and source-of-truth boundaries.
- Check native, partner, web, live/federated, and MCP options first.
- Choose indexed, live, or hybrid deliberately.
- Capture the decision and rejected alternatives in the intake.

### Data and permissions

- Use stable, deterministic document IDs.
- Index the fields users need for retrieval and filtering; avoid copying unnecessary sensitive data.
- Preserve source URLs and useful titles/authors/owners.
- Map identities before broad content ingestion.
- Test positive and negative access cases, including group and revoked access.
- Implement updates and deletes, not only creates.

### Reliability and scale

- Use incremental retrieval when the source supports it; define a full-reconciliation strategy.
- Respect source quotas and rate limits with bounded concurrency, backoff, and retry classification.
- Make writes idempotent and safe to replay.
- Handle partial failures without silently reporting success.
- Measure document counts, byte volume, processing latency, error rate, and freshness.
- Test large documents and source-specific content types against current limits.

### Security and operations

- Use secret managers or environment-backed credentials; never commit tokens.
- Minimize scopes and network access.
- Separate development/test/prod datasources and credentials.
- Pin and review dependencies; scan images and packages.
- Define ownership, alerting, support response, API-change monitoring, and maintenance windows.
- Provide architecture, test, deployment, rollback, runbook, and handoff documentation.

### Validation

- Verify a public sample and a permissioned sample before scale-up.
- Check upload, processing, and indexed counts separately.
- Search as allowed and denied users.
- Verify source links, metadata, facets, and expected content coverage.
- Test updates, deletes, retries, rate limits, restart/resume, and partial failure.
- Use a disposable datasource for live tests; never use a partial `--max-items` run as proof of a safe full replacement.

## 8. When not to use a custom connector

Do not use one when:

- A native or partner connector already meets the required content, permissions, freshness, and experience.
- The requirement is only a live lookup or action and the source does not need to be in the indexed knowledge layer; use MCP or an appropriate tool instead.
- The source is public web content that the supported web connector can reliably crawl.
- The team cannot provide a source owner, permission mapping, test environment, production runtime, or maintenance plan.
- The expected corpus or source API behavior is not understood well enough to design safe ingestion.
- A custom connector would duplicate a native connector without a documented gap and migration plan.
- The business case does not justify the long-term implementation and support cost.

## 9. Official competency evidence to map into learning

The internal Glean Partner Competency Program Guide defines the Custom Connector Competency as the ability to scope, build, deploy, and maintain custom data-source integrations using Glean Indexing APIs, a scoping framework, and deployment patterns. The evidence set includes:

- Partner Portal/program completion record.
- Glean-delivered custom connector workshop.
- Custom connector architecture review with a Glean technical resource.
- Completed customer connector intake form.
- Production-ready connector implementation and operational documentation.
- Customer confirmation or feedback, ideally with a recorded walkthrough.
- Customer-approved maintenance/support plan and deployment evidence where required by the current workbook.
- Renewal evidence every 18 months; current requirements must be rechecked before launch.

Course completion should produce a portfolio of artifacts. It should not automatically award the external competency badge. A Glean reviewer must validate the official evidence.

## 10. Source ledger

| ID | Source | Type | Use |
|---|---|---|---|
| `S-01` | [About connectors](https://docs.glean.com/connectors/about) | External Glean product docs | Connector definition; indexed/live/hybrid modes; high-level data flow; native/custom distinction |
| `S-02` | [How connectors power the Glean experience](https://docs.glean.com/connectors/connectors-power-glean) | External Glean product docs | Index, Enterprise Graph, indexed versus live use cases, retrieval surfaces |
| `S-03` | [Overview of custom data source](https://docs.glean.com/connectors/custom/about) | External Glean product docs | Custom connector purpose, Indexing API, deployment and permission responsibilities |
| `S-04` | [Choose a deployment model](https://docs.glean.com/connectors/custom/deployment) | External Glean product docs | Managed versus self-hosted deployment choices |
| `S-05` | [Set up a custom connector](https://docs.glean.com/connectors/custom/setup) | External Glean product docs | Admin setup and staged public/permissioned validation |
| `S-06` | [Glean REST APIs](https://docs.glean.com/connectors/custom/glean-apis) | External Glean product docs | Custom connector API entry point |
| `S-07` | [Migrate from a native connector to a custom connector](https://docs.glean.com/connectors/custom/migration-playbook) | External Glean product docs | Separate namespace and migration risks |
| `S-08` | [Indexing API Quickstart](https://developers.glean.com/api-info/indexing/getting-started/overview) | External Developer docs | Datasource, token, first document, asynchronous indexing, permission verification |
| `S-09` | [Index document](https://developers.glean.com/api/indexing-api/index-document) | External Developer docs | Document API contract |
| `S-10` | [Indexing SDK overview](https://developers.glean.com/libraries/indexing-sdk/) | External Developer docs | SDK architecture, base classes, pull/push, permissions, testing, observability, status, deployment |
| `S-11` | [Indexing SDK Quickstart](https://developers.glean.com/libraries/indexing-sdk/quickstart) | External Developer docs | `BaseDataClient`, connector/transform flow, CLI testing, safe full runs |
| `S-12` | [Indexing SDK CLI](https://developers.glean.com/libraries/indexing-sdk/cli) | External Developer docs | Current CLI and test phases |
| `S-13` | [Indexing SDK deployment](https://developers.glean.com/libraries/indexing-sdk/deployment/overview) | External Developer docs | Batch-job model and AWS/GCP deployment scaffolding |
| `S-14` | [Glean Indexing SDK repository](https://github.com/gleanwork/glean-indexing-sdk) | External GitHub | Open-source implementation, examples, versioned behavior |
| `S-15` | [Glean Custom Connector Content Package](https://docs.google.com/document/d/16wEo2ny-s7TIQsyiNAlYLvZc7aPAoQdmCymQkrPYKh4) | Internal GDrive | Scoping, API, permissions, volume/frequency, indexing pipeline, UI validation, handoff topics |
| `S-16` | [Custom Connector Best Practices](https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg) | Internal GDrive | Existing partner curriculum, when/when-not guidance, architecture and best-practice review |
| `S-17` | [Custom Connector Request Process](https://docs.google.com/presentation/d/18LbzkWqU5UZGiudNuYKMG025BpsZqOezBZbYB59QA8w) | Internal GDrive | Ownership, review, security, soak-test, handoff, and graduation context |
| `S-18` | [Glean Partner Competency Program Guide](https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w) | Internal GDrive | Official competency definition and evidence requirements |
| `S-19` | [Custom Connector Competency Submission Workbook](https://docs.google.com/spreadsheets/d/1Vh4WQq6zGW5BjUZRxy6dwYSggNuQJdsXeI1qU3Xyj8M) | Internal GDrive | Submission and renewal evidence structure |
| `S-20` | [Partner Accreditation & Competency Roadmap](https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q) | Internal GDrive | Existing module IDs, durations, dependencies, Custom Connector level 301 |
| `S-21` | [Slack: Indexing SDK launch](https://askscio.slack.com/archives/C06G01W0U1J/p1785992266047029?thread_ts=1785978506.868949&cid=C06G01W0U1J) | Internal Slack | Current SDK capabilities, connector builder, testing, permissions, deployment, partner relevance |
| `S-22` | [Slack: Indexing SDK documentation and CLI update](https://askscio.slack.com/archives/C0ARTKUFTK4/p1785725639900849) | Internal Slack | Current `glean-idx` CLI, docs structure, status/debugging, generated deployment details |
| `S-23` | [Slack: Connectors add flow](https://askscio.slack.com/archives/C0BJTGB7X2R/p1787678035631159) | Internal Slack | Current product direction that brings custom connectors, MCP servers, and tools into one admin entry point |
| `S-24` | [Slack: Custom connector scoping and support examples](https://askscio.slack.com/archives/C069S0E25JT/p1789474090990579?thread_ts=1789470101.750919&cid=C069S0E25JT) | Internal Slack | Applied use case for a source without a native connector |

## 11. Claims requiring live re-verification before authoring

- Current Indexing API endpoint names, request fields, and generated-client versions.
- Current SDK release, Python support, CLI flags, base classes, and cloud deployment output.
- Current employee/people indexing endpoint lifecycle and replacement path.
- Current supported managed deployment options and customer-specific hosting requirements.
- Current document-size, indexing, rate, and crawl limits.
- Current MCP setup flow and which native connectors offer both indexed and MCP access.
- Current official competency workbook requirements, reviewer, expiration, and renewal evidence.

These checks belong in the module source ledger and must be refreshed before each release and after a relevant product/API change.
