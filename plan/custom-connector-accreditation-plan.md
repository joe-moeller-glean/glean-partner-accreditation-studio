# Custom Connector Competency — Accreditation and Module Plan

> **Superseded 2026-09-26 by [`plan/custom-connectors/`](./custom-connectors/README.md) (v2).** v2 corrects four factual defects and two source-ledger defects found in this file (see [`00-review-and-change-log.md`](./custom-connectors/00-review-and-change-log.md)). Keep for history only.


**Status:** Proposed plan for review  
**Research baseline:** [`connectors-custom-connectors-research.md`](./connectors-custom-connectors-research.md)  
**Roadmap alignment:** Builders & Integrations; Custom Connector competency, level 301  
**Recommended accreditation ID:** `accred-custom-connectors`

## 1. Outcome

Accredit a partner practitioner who can decide whether Glean needs indexed, live/MCP, or hybrid access; scope a source; design content, identity, permissions, and freshness; build a custom connector against the Indexing API or Indexing SDK; test it; deploy it; operate it; and hand it over with customer-ready evidence.

This learning accreditation should prepare the partner for the official Glean Custom Connector Competency. It must not automatically award the external competency badge. A Glean technical reviewer still validates the official submission and customer evidence.

## 2. Proposed accreditation definition

```yaml
id: accred-custom-connectors
name: Custom Connector Competency
status: proposed
source: Partner Accreditation & Competency Roadmap + Glean Partner Competency Program Guide
audience:
  - Builders
  - Solution architects
  - Delivery engineers
  - Technical partner leads
partner_types:
  - Boutique
  - GSI
  - SI
  - Technology
mapped_competency: Custom Connector (301)
required_modules:
  - CON-101
  - CON-201
  - CON-202
  - TEC-201
  - BLD-201
  - CON-203
  - CON-204
  - BLD-202
  - CON-301
  - ACC-107
electives:
  - CON-205  # advanced custom metadata and search experience, future
  - CON-302  # migration from native to custom, future
completion:
  completion_rule: all_required_modules_and_capstone
  assessment_module: ACC-107
  assessment_type: architecture_review_and_implementation_portfolio
  mastery_score: 80
  hard_gates:
    - permission_correctness
    - update_and_delete_correctness
    - failure_and_rate_limit_handling
    - operational_handoff
    - no_secrets_in_submission
overview_module: null
publish_mode: automatic_after_green
```

**Estimated learner time:** 16.8 hours, including a 2.0-hour capstone.  
**Recommended delivery:** 7 self-paced/interactive modules, 2 practical labs, and 1 capstone review.  
**Design system:** Use `scroll-canvas-v1` for CON-101 and CON-201; use `paged-v1` for API/SDK reference and lab modules. Record the choice in each module contract.

## 3. Module sequence

### CON-101 — Connector Fundamentals: Indexed, Live, Hybrid, and MCP

- **Level / time:** 100 / 1.0 hour
- **Prerequisites:** None
- **Purpose:** Establish the vocabulary and decision framework before technical design.
- **Outcomes:**
  - Explain what a Glean connector does.
  - Distinguish indexed, live/federated, and hybrid access.
  - Explain what MCP contributes and what it does not replace.
  - Choose native, partner, web, custom, MCP, or a combination for a use case.
- **Learning arc:** Customer asks for “a connector”; learner identifies whether the need is search, live lookup, action, durable grounding, or all four.
- **Practice:** Decision matrix for five scenarios: supported SaaS, proprietary database, public legacy site, write action, and indexed-plus-action source.
- **Assessment:** 10-item scenario quiz, 80% mastery; at least four application items.
- **Job aid:** Indexed/live/MCP decision tree.
- **Build note:** Current product setup is consolidating new MCP connections into the Connectors experience; date-sensitive UI claims require re-verification.

### CON-201 — Glean Indexing Architecture and Data Flow

- **Level / time:** 200 / 1.5 hours
- **Prerequisites:** CON-101
- **Purpose:** Teach the complete path from source record to permission-aware retrieval.
- **Outcomes:**
  - Trace source discovery, authentication, extraction, normalization, upload, asynchronous processing, indexing, graph enrichment, retrieval, and verification.
  - Explain the roles of content, identity, permissions, and activity.
  - Separate ingestion success from processing and searchability.
  - Identify failure points and observability signals at every stage.
- **Practice:** Annotate a lifecycle diagram and diagnose a “200 OK but no search result” incident.
- **Assessment:** Architecture trace plus 8-item checkpoint quiz.
- **Job aid:** Source-to-answer lifecycle and failure matrix.
- **Hard gate:** Learner must identify where ACLs are created/evaluated and where deletes are handled.

### CON-202 — Custom Connector Scoping and Intake

- **Level / time:** 200 / 1.5 hours
- **Prerequisites:** CON-101
- **Purpose:** Convert a customer request into a feasible, reviewable connector plan.
- **Outcomes:**
  - Run source and use-case discovery.
  - Capture API, auth, permissions, identity, volume, document size, freshness, webhook, hosting, and support requirements.
  - Decide full, incremental, event-driven, or hybrid update strategy.
  - Produce a go/no-go recommendation and risk register.
- **Practice:** Complete a customer connector intake for a source with cursor pagination, group ACLs, and a low API quota.
- **Assessment:** Rubric-scored intake and architecture decision record.
- **Job aid:** Customer intake questionnaire, scoping checklist, and assumptions log.
- **Official evidence:** Directly supports the official completed customer connector intake requirement.

### TEC-201 — Connector Deployment Prerequisites (existing roadmap module)

- **Level / time:** 200 / 0.8 hours
- **Prerequisites:** CON-201 or existing TEC-101 path
- **Purpose:** Prepare the environment before implementation.
- **Refresh required:** Replace generic connector readiness examples with custom connector-specific requirements: datasource, indexing token, source credentials, identity mapping, test users, network path, runtime, secret manager, alerting, and rollback.
- **Assessment:** Checklist review.
- **Output:** Approved environment readiness checklist.
- **Owner action:** Resolve the existing `needs_sme` flag before production planning.

### BLD-201 — Custom Connector Best Practices (existing roadmap module, refresh)

- **Level / time:** 200 / 1.5 hours
- **Prerequisites:** CON-201, CON-202, TEC-201
- **Purpose:** Teach design patterns that make a connector secure, reliable, supportable, and maintainable.
- **Refresh required:** Preserve stable IDs where possible, but add:
  - Indexed versus MCP/hybrid decisioning.
  - Stable IDs, idempotency, update/delete semantics, and reconciliation.
  - Identity and ACL mapping, including negative tests.
  - Pagination, rate limits, retries, bounded concurrency, and partial failure.
  - Metadata, source links, content types, and search experience.
  - Secrets, dependency/image scanning, ownership, and handoff.
- **Practice:** Repair a design that reports success while dropping pages and permissions under rate limiting.
- **Assessment:** 8-item application quiz plus design review checkpoint.
- **Output:** Connector design checklist and failure-mode matrix.
- **SME:** Eugene Wiehahn is the current mapped owner; route product/API claims to a current engineering SME.

### CON-203 — Indexing API and Glean Data Model

- **Level / time:** 200 / 1.5 hours
- **Prerequisites:** CON-201, TEC-201
- **Purpose:** Build API fluency before introducing the SDK abstraction.
- **Outcomes:**
  - Create/configure a custom datasource.
  - Index, update, and delete documents.
  - Explain batch/upload-session behavior and asynchronous status.
  - Index or map users, groups, memberships, and permissions when required.
  - Distinguish document fields, custom metadata, custom properties, and source links.
  - Use status/debug endpoints to diagnose missing content.
  - Use the Client API or Web SDK only for verification or an application experience, not as ingestion substitutes.
- **Practice:** Index one public document, one permissioned document, update it, delete it, and verify allowed/denied access.
- **Assessment:** API exercise with an automated request/response checker plus 8-item quiz.
- **Output:** API request collection and verification log.
- **Currency rule:** Endpoint names, payloads, generated clients, and employee/people API lifecycle must be checked against current Developer docs at authoring time.

### CON-204 — Indexing SDK: Build, Test, Debug, and Deploy

- **Level / time:** 200/300 / 2.0 hours
- **Prerequisites:** CON-203 and basic Python
- **Purpose:** Make the current SDK the default implementation path while preserving raw API understanding.
- **Outcomes:**
  - Select the appropriate SDK connector type.
  - Implement a `BaseDataClient` and source-specific fetch logic.
  - Implement `transform()` into Glean document and identity models.
  - Configure `PushUploader`, permissions, indexing mode, and observability.
  - Use dependency injection and `create_connector()` for tests and deployment.
  - Run mocked, record/replay, and live phases with `glean-idx`.
  - Use datasource and document status/debugging.
  - Generate and review AWS/GCP deployment scaffolding.
- **Practice:** Build a connector for a small fixture API with cursor pagination, per-record ACLs, transient 429s, and a deleted record.
- **Assessment:** Code review plus test evidence; all hard gates must pass.
- **Output:** SDK connector skeleton, tests, run log, and deployment plan.
- **Agent use:** The Connector Builder plugin may be demonstrated as an accelerator. Learners must review generated code and prove that permissions, completeness, and failure handling are correct.

### BLD-202 — Custom Connector Implementation Lab (existing roadmap module, refresh)

- **Level / time:** 200 / 2.5 hours
- **Prerequisites:** BLD-201, CON-203, CON-204, TEC-201
- **Purpose:** Take a real or realistic source from requirements to validated handoff.
- **Lab stages:**
  1. Confirm intake, source contract, and environment.
  2. Configure a disposable datasource and credentials.
  3. Implement source client and pagination.
  4. Transform documents and metadata.
  5. Map users/groups and document ACLs.
  6. Run mocked and record/replay tests.
  7. Run a live test against a disposable datasource.
  8. Validate public, allowed, denied, updated, and deleted records.
  9. Inject rate limits and partial failures.
  10. Produce logs, counts, freshness evidence, and handoff documentation.
- **Assessment:** Rubric-scored lab. A passing upload alone is insufficient.
- **Output:** Working connector repository, test evidence, architecture diagram, runbook, maintenance plan, and handoff package.
- **SME action:** Propose Eugene Wiehahn or a current Indexing SDK/connector engineering owner; resolve the current unassigned flag.

### CON-301 — Production Operations, Security, Migration, and Handoff

- **Level / time:** 300 / 1.5 hours
- **Prerequisites:** BLD-202
- **Purpose:** Make the connector operable after the build team leaves.
- **Outcomes:**
  - Choose and document a managed or partner/customer-hosted runtime.
  - Implement secret handling, least privilege, network controls, dependency/image review, and rollback.
  - Define monitoring for freshness, counts, errors, latency, rate limits, and permission drift.
  - Plan API/version changes and scheduled revalidation.
  - Explain native-to-custom migration risks, namespace separation, parallel run, and dependent artifact migration.
  - Write a customer-facing support and maintenance plan.
- **Practice:** Create a day-2 runbook for a connector that has stale data and a source API change.
- **Assessment:** Operations scenario and runbook review.
- **Output:** Production runbook, RACI, support tiers, maintenance calendar, rollback plan, and migration checklist.

### ACC-107 — Custom Connector Competency Capstone

- **Level / time:** 300 / 2.0 hours review time plus partner project time
- **Prerequisites:** All required modules
- **Purpose:** Validate integrated capability and produce the official evidence package.
- **Submission:**
  - Completed intake and use-case decision.
  - Architecture diagram covering source, runtime, Indexing API/SDK, identity, permissions, processing, index, retrieval, and monitoring.
  - Source/API/auth/data model specification.
  - Working connector code or an approved redacted implementation.
  - Test plan and evidence for content, identity, permissions, updates, deletes, rate limits, retries, partial failure, and restart/resume.
  - Deployment configuration and security review.
  - Operations/runbook and customer-approved maintenance plan.
  - Search and permission validation evidence.
  - Customer confirmation or recorded walkthrough when available.
- **Assessment:** Glean technical architecture review plus rubric-scored portfolio review.
- **Hard gates:** No secret leakage; permission correctness; update/delete correctness; failure recovery; operational ownership; evidence is reproducible.
- **Output:** Submission bundle ready for official Glean review. The external badge remains pending until the official program validates it.

## 4. Coverage matrix

| Required topic | Primary module(s) | Evidence |
|---|---|---|
| Connector basics | CON-101 | Scenario decisions and quiz |
| Indexed connector | CON-101, CON-201 | Mode choice and lifecycle trace |
| MCP / live tools | CON-101, CON-301 | Fit decision and boundary design |
| Native versus custom | CON-101, BLD-201 | Decision record and tradeoff analysis |
| Full indexing architecture | CON-201 | Annotated source-to-answer architecture |
| All indexing steps | CON-201, CON-203 | Trace and API verification |
| Source/API/auth scoping | CON-202, TEC-201 | Intake and readiness checklist |
| Custom connector structure | CON-204 | Repository skeleton and code review |
| Indexing APIs | CON-203 | API exercise and request collection |
| Supporting libraries | CON-204 | SDK implementation and review |
| Indexing SDK | CON-204, BLD-202 | Tests, CLI, status, deployment evidence |
| Permissions/identity | CON-201, CON-203, BLD-202 | Positive/negative access tests |
| Freshness/incremental/deletes | BLD-201, BLD-202, CON-301 | Failure matrix and test evidence |
| Best practices | BLD-201, CON-301 | Design and operations reviews |
| When not to use custom | CON-101, CON-202 | Go/no-go record |
| Deployment/hosting | TEC-201, CON-204, CON-301 | Environment and deployment plan |
| Debugging/operations | CON-204, CON-301 | Status evidence and runbook |
| Customer delivery/handoff | CON-202, CON-301, ACC-107 | Intake, maintenance plan, customer proof |
| Accreditation evidence | ACC-107 | Complete submission bundle |

## 5. Assessment architecture

### Knowledge checks

- 80% mastery for module quizzes.
- At least 60% of items must require application, diagnosis, or design judgment.
- Do not test memorized endpoint names without a versioned reference.

### Practical gates

1. **Fit gate:** Learner selects the correct mechanism and documents why alternatives were rejected.
2. **Architecture gate:** Content, identity, permissions, activity/freshness, processing, index, retrieval, and operations are all represented.
3. **Permission gate:** Allowed and denied users produce the expected results; group and revoked access are tested.
4. **Reliability gate:** Pagination, rate limits, retries, partial failures, idempotency, updates, deletes, and restart behavior are demonstrated.
5. **Operational gate:** Secrets, deployment, monitoring, alerting, rollback, ownership, and maintenance are documented.
6. **Customer gate:** Intake and customer-facing handoff are complete; confirmation/feedback is collected when the official program requires it.

### Capstone scoring rubric

| Area | Weight | Pass condition |
|---|---:|---|
| Solution fit and scope | 10% | Clear indexed/live/hybrid decision and bounded requirements |
| Architecture and data model | 15% | Complete source-to-answer flow with stable IDs and mappings |
| API/SDK implementation | 20% | Correct fetch, transform, upload, and configuration boundaries |
| Permissions and identity | 20% | Positive and negative evidence; no unauthorized exposure |
| Reliability and freshness | 15% | Updates, deletes, retries, throttling, partial failure, reconciliation |
| Security and deployment | 10% | Safe credentials, least privilege, runtime and rollback plan |
| Operations and handoff | 10% | Runbook, support, maintenance, owner, and customer evidence |

**Passing score:** 80% and every hard gate passes. A failed hard gate blocks the submission even when the numeric score is high.

## 6. Delivery and build sequence

### Wave 1 — Foundation and decisioning

1. Validate sources and claims for CON-101 and CON-201.
2. Build CON-101 first; use it to stabilize indexed/live/MCP terminology.
3. Build CON-201 with one shared `DGM-CONN-01` lifecycle diagram and one shared permissions diagram.
4. SME review by Product/Connectors and Indexing SDK engineering.

### Wave 2 — Scoping and design

1. Build CON-202 from the current intake form and scoping package.
2. Refresh TEC-201 around custom datasource readiness.
3. Refresh BLD-201. Do not duplicate CON-201; focus BLD-201 on design choices, reliability, and governance.
4. Confirm BLD-201 owner and current API/SDK reviewer.

### Wave 3 — Build and lab

1. Build CON-203 against current Developer docs and generated API clients.
2. Build CON-204 against the current SDK release and `glean-idx` CLI.
3. Refresh BLD-202 to use SDK-first implementation, with raw API comparison as an optional advanced path.
4. Require a disposable datasource and controlled test source before lab production.

### Wave 4 — Production and accreditation

1. Build CON-301 from deployment, support, migration, and security evidence.
2. Build ACC-107 after the rubric and reviewer workflow are approved.
3. Run one pilot partner through all artifacts.
4. Calibrate the capstone rubric with at least two reviewers.
5. Publish the learning accreditation only after all content, fact, accessibility, SCORM, runtime, and visual gates pass.

## 7. Official competency mapping

| Official requirement | Learning preparation | Official proof owner |
|---|---|---|
| Program/portal completion | Accreditation completion | Partner Manager |
| Glean-delivered workshop | CON-101 through BLD-202; live workshop companion | Glean technical team |
| Architecture review | CON-201, CON-202, BLD-201, ACC-107 | Glean Partner Solutions Engineer |
| Customer connector intake | CON-202 and ACC-107 | Glean reviewer / partner |
| Production-ready build and deployment | CON-204, BLD-202, CON-301 | Partner + technical reviewer |
| Customer confirmation/feedback | ACC-107 evidence package | Partner / customer |
| Maintenance and support plan | CON-301 and ACC-107 | Partner + reviewer |
| Renewal | Quarterly drift checks; 18-month evidence refresh | Partner Manager + reviewer |

## 8. Governance and maintenance

- Store learner-facing claims in each module’s `sources.json` and `research/claims.json`.
- Use current Developer docs as the primary authority for product behavior.
- Re-verify SDK version, CLI commands, API schemas, limits, deployment output, MCP setup, and official competency requirements before each release.
- Run weekly source/link drift scans for released modules and a full quarterly accreditation review.
- Trigger a targeted update after Indexing API, Indexing SDK, connector setup, or MCP workflow changes.
- Review capstone scoring after the first 10 completions and again after 30 completions.
- Keep raw API examples versioned and mark them as illustrative when they are not guaranteed stable.
- Do not package answer keys, source ledgers, or internal reviewer materials into SCORM runtime ZIPs.

## 9. Open decisions before intake

1. Approve `accred-custom-connectors` as a new accreditation or fold its modules into Builder Advanced.
2. Confirm whether the official badge remains named **Custom Connector Competency** and whether the external program requires a production customer for every partner.
3. Assign SMEs for TEC-201, BLD-202, Indexing API, and Indexing SDK.
4. Choose the standard lab source and provide a disposable Glean datasource, test identities, and safe fixture data.
5. Confirm the supported SDK release and current employee/people indexing contract before API/SDK authoring.
6. Confirm the official reviewer workflow and the accepted evidence format for redacted code, customer confirmation, and maintenance plans.
7. Decide whether CON-205 and CON-302 are later electives or required advanced modules.

## 10. Definition of done for the plan

- Research file is accepted as the source baseline.
- Every proposed module has outcomes, prerequisites, practice, assessment, artifact, and source requirements.
- Existing modules have explicit refresh scope rather than silent duplication.
- Accreditation has a dependency order, completion rule, hard gates, rubric, and official competency mapping.
- A lab source, SMEs, reviewer, and evidence workflow are assigned before production begins.
