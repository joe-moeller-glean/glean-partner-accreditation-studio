# CON-301 Production Operations, Security, Migration, and Handoff - research findings

Verified 2026-09-27. 56 claims drawn from 24 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-01` | [About connectors](https://docs.glean.com/connectors/about) | Glean Docs | 2026-09-23 | 1 |
| `S-03` | [Overview of custom data source](https://docs.glean.com/connectors/custom/about) | Glean Docs | 2026-08-19 | 1 |
| `S-04` | [Choose a deployment model](https://docs.glean.com/connectors/custom/deployment) | Glean Docs | 2026-06-29 | 1 |
| `S-07` | [Troubleshooting (custom connectors)](https://docs.glean.com/connectors/custom/troubleshooting) | Glean Docs | 2026-08-18 | 1 |
| `S-08` | [Migrate from a native connector to a custom connector](https://docs.glean.com/connectors/custom/migration-playbook) | Glean Docs | 2026-08-18 | 1 |
| `S-12` | [Bulk Indexing](https://developers.glean.com/api-info/indexing/documents/bulk-indexing) | Glean Developer | 2026-09-20 | 1 |
| `S-13` | [Bulk Upload Model](https://developers.glean.com/api-info/indexing/documents/bulk-upload-model) | Glean Developer | 2026-09-19 | 1 |
| `S-15` | [Indexing API Authentication](https://developers.glean.com/api-info/indexing/authentication/overview) | Glean Developer | 2026-09-18 | 1 |
| `S-19` | [Indexing SDK — Indexing modes](https://developers.glean.com/libraries/indexing-sdk/concepts/indexing-modes) | Glean Developer | 2026-09-18 | 1 |
| `S-20` | [Indexing SDK — Permissions](https://developers.glean.com/libraries/indexing-sdk/permissions) | Glean Developer | 2026-09-18 | 1 |
| `S-21` | [Indexing SDK — Architecture](https://developers.glean.com/libraries/indexing-sdk/concepts/architecture) | Glean Developer | 2026-09-18 | 1 |
| `S-25` | [Indexing SDK — HTTP client](https://developers.glean.com/libraries/indexing-sdk/pull/http-client) | Glean Developer | 2026-09-19 | 1 |
| `S-28` | [Indexing SDK — Status and debugging](https://developers.glean.com/libraries/indexing-sdk/status-and-debugging) | Glean Developer | 2026-09 | 1 |
| `S-29` | [Indexing SDK — CLI](https://developers.glean.com/libraries/indexing-sdk/cli) | Glean Developer | 2026-09-18 | 1 |
| `S-30` | [Indexing SDK — Deployment overview](https://developers.glean.com/libraries/indexing-sdk/deployment/overview) | Glean Developer | 2026-09 | 1 |
| `S-31` | [Indexing SDK — Observability](https://developers.glean.com/libraries/indexing-sdk/observability) | Glean Developer | 2026-09-18 | 1 |
| `S-32` | [Indexing SDK — Overview](https://developers.glean.com/libraries/indexing-sdk/) | Glean Developer | 2026-09-18 | 1 |
| `S-33` | [Indexing SDK — Quickstart](https://developers.glean.com/libraries/indexing-sdk/quickstart) | Glean Developer | 2026-09-19 | 1 |
| `S-37` | [Rate Limits and Retries](https://developers.glean.com/get-started/rate-limits) | Glean Developer | 2026-09-18 | 1 |
| `S-41` | [Developer Changelog (glean-indexing-sdk releases)](https://developers.glean.com/changelog/) | Glean Developer | 2026-09-19 | 1 |
| `S-44` | [Glean Partner Content | Custom Connector Best Practices (deck, April 2026)](https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg) | Joe Moeller | 2026-09-08 | 2 |
| `S-45` | [[External] Glean Partner Content | Custom Connector Questionnaire](https://docs.google.com/spreadsheets/d/1jWeZyvGmpiChLEgjHNk52dioZPJ2dZJTw_cVDq4HsF8) | Eugene Wiehahn | 2025-05-16 | 2 |
| `S-47` | [Glean Partner Competency Program Guide (Feb 2026)](https://docs.google.com/document/d/1mADzsGI3LTRlEIBLXceoMzj0KbQ2N6sLNLojrkMZF7E) | Sam Cugini | 2026-06-26 | 2 |
| `S-49` | [[Template] Custom Connector Intake Form v2](https://docs.google.com/document/d/11TcVp1W61fZ7EuOSfztFHEIA3BsdO6jVGMzY9pcai9M) | Joe Moeller | 2026-07-10 | 2 |

## Claims by source

### S-01 - About connectors

- `C-009` Shared push connector code may have limited support.

### S-03 - Overview of custom data source

- `C-042` Scheduling like native connectors applies to Glean-hosted deployments.

### S-04 - Choose a deployment model

- `C-046` Self-hosted networking must allow pushes to Glean indexing endpoints.
- `C-047` Self-host when residency, isolation, or policy requires it.
- `C-045` Choose hosting before building.

### S-07 - Troubleshooting (custom connectors)

- `C-072` UPLOAD COMPLETED is acceptance, not searchability.
- `C-074` Wrong pagination flags can make a partial upload look complete.
- `C-070` Documents are searchable after processingHistory passes bulkUploadHistory.
- `C-075` /processalldocuments reprocesses without a new upload.
- `C-076` Use /processallmemberships for identity problems.
- `C-078` Support tickets need issue, endpoint/body, connector name, timestamp/timezone.

### S-08 - Migrate from a native connector to a custom connector

- `C-080` Native and custom connectors use separate namespaces.
- `C-083` Run native and custom in parallel during migration.
- `C-081` Artifacts scoped to a native connector do not carry over.
- `C-082` Deactivating a native connector removes its content.

### S-12 - Bulk Indexing

- `C-101` Bulk indexing replaces the datasource; omitted documents are deleted.

### S-13 - Bulk Upload Model

- `C-107` Stale deletion pauses 7 days above 20%.
- `C-108` Use /processalldocuments for immediate deletions.

### S-15 - Indexing API Authentication

- `C-057` Use separate tokens per environment.
- `C-054` Indexing tokens require an expiry date.
- `C-059` IP restrictions limit tokens to known infrastructure.
- `C-053` Minimum token rotation period is 1440 minutes.

### S-19 - Indexing SDK — Indexing modes

- `C-170` Never let a partial fetch complete as a full crawl.

### S-20 - Indexing SDK — Permissions

- `C-199` Counts prove nothing about permissions.

### S-21 - Indexing SDK — Architecture

- `C-165` Failures exit non-zero.

### S-25 - Indexing SDK — HTTP client

- `C-187` Query params are redacted in logs.
- `C-188` Redaction covers logs only.

### S-28 - Indexing SDK — Status and debugging

- `C-204` Alert on sharp drops in documents_indexed.
- `C-202` Four-step missing-document diagnosis.
- `C-205` ACLs fail without pushed identities.
- `C-203` 'Appears then disappears' means stale deletion.
- `C-331` A source error swallowed inside a paging loop is a named cause of partial full crawls.
- `C-328` An auth token expiring mid-crawl is a named cause of partial full crawls.
- `C-327` A max_items cap left set from local testing is a named cause of partial full crawls.

### S-29 - Indexing SDK — CLI

- `C-207` teardown is irreversible.
- `C-322` glean-idx datasource status shows uploaded and indexed counts, identity counts, visibility, and recent runs.

### S-30 - Indexing SDK — Deployment overview

- `C-217` Connectors can run on many schedulers.
- `C-332` glean-idx deploy generates a Docker image and Terraform for a Kubernetes CronJob on GKE or EKS.
- `C-211` Terraform does not create the foundation.
- `C-212` Edit glean_deployment.yaml, not Terraform.
- `C-213` Full and incremental need separate configs.
- `C-215` The workload cannot enumerate secrets.
- `C-214` A completed Job is not proof of indexing.
- `C-216` No API to delete a datasource registration.

### S-31 - Indexing SDK — Observability

- `C-219` Cloud telemetry plugins are mock-tested only.

### S-32 - Indexing SDK — Overview

- `C-153` Timestamps are epoch seconds.

### S-33 - Indexing SDK — Quickstart

- `C-326` max_items limits source consumption; it is not a Glean-side upload cap or a blast-radius guarantee.

### S-37 - Rate Limits and Retries

- `C-079` /processalldocuments: once every 3 hours per datasource.

### S-41 - Developer Changelog (glean-indexing-sdk releases)

- `C-220` Current SDK release reviewed: v1.2.0.

### S-44 - Glean Partner Content | Custom Connector Best Practices (deck, April 2026)

- `C-238` Automate token rotation.

### S-45 - [External] Glean Partner Content | Custom Connector Questionnaire

- `C-251` Prefer read-only keys.

### S-47 - Glean Partner Competency Program Guide (Feb 2026)

- `C-265` Customer-approved maintenance plan required.

### S-49 - [Template] Custom Connector Intake Form v2

- `C-272` Intake form v2 supports publishing.
- `C-275` Docs must explain permission propagation.
- `C-273` Partner maintains published connectors.
- `C-274` Get written permission/security confirmation.

## Conflicts and gaps

See `conflicts.md`. Every claim in this module is learner-facing and verified verbatim against the source text. Internal engineering, reviewer, and field evidence from the authoring ledger is excluded from this module.
