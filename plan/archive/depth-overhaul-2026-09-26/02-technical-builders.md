# Module build contracts 02 — Technical & Architecture; Builders & Integrations

Use volume 00's source, claim, deep-explanation, diagram/capture, practice, and exact-ZIP QA rules for **each** module. Module status is the roadmap's classification, not proof of release. Architecture, API, hosting, security, limits and UI are especially volatile: current [Glean security/architecture docs](https://docs.glean.com/security/knowledge-graph), [connector docs](https://docs.glean.com/connectors/about), [Agent docs](https://docs.glean.com/agents/how-agents-work), and [Developer docs](https://developers.glean.com/) must control product claims. The R/T/V/P/X fields are research, ordered teaching, instructional visuals, proof of skill, and cross-update.

## Technical & Architecture — 11 modules

### TEC-101 — Technical Deep Dive · Refresh needed; local source absent; critical dependency
- **R:** Obtain current technical enablement deck and architecture/security documentation; verify ingestion vs query-time flows, Knowledge Graph content/people/activity, connectors and permissions, model/data flow, deployment variants and actual boundaries. Resolve older control-plane/migration language with an architecture owner; no universal topology claim based on a dated deck.
- **T:** 1. Follow a source record from authentication, crawling/processing, normalization, identity/ACL, and indexing. 2. Trace an authenticated query through relevance, permission filtering, retrieval and grounded answer. 3. Contrast indexed, live and hybrid paths and where each can fail. 4. Explain graph signals without treating the graph as the index. 5. Interpret a customer security/architecture diagram with caveats.
- **V:** Two separate sequence diagrams (ingestion and query), a trust-boundary/permissions overlay, and a failure-path panel for stale/denied/missing content; link to current source docs.
- **P/X:** Annotate a flawed architecture and diagnose three query/permission failures. FND-103 is the nontechnical overview; TEC-102–105 own the specialist depth; BLD-101 depends on this foundation.

### TEC-102 — Security Architecture & Protect+ · In development; mapped SCORM exists externally, not local
- **R:** Obtain actual external course and current Security & Architecture and Protect+ feature docs, deployment-specific data flow, encryption, model/subprocessor terms, admin settings, and security-review FAQ. Have security SME rule on anything confidential, SKU-dependent or future-facing.
- **T:** 1. Establish shared responsibility and data boundaries. 2. Explain source ACL mirroring and query access with positive/negative examples. 3. Trace sensitive-input/output risks, available controls, logging and approval paths only where verified. 4. Distinguish product capability, configuration choice and contractual guarantee. 5. Answer a skeptical security questionnaire with evidence links.
- **V:** Threat/mitigation matrix over ingestion/retrieval/model/tool flows, annotated admin captures with redacted settings, security questionnaire excerpt; avoid a decorative shield.
- **P/X:** Complete a scenario-based security review and identify three claims the partner cannot promise. TEC-103 owns identity mechanics; BLD-208 agent governance; OPS-106 recurring reviews. Decide whether the external draft is salvageable after audit.

### TEC-103 — Identity & Security Architecture · Planned; local absent
- **R:** Verify supported SSO/provisioning/people-source prerequisites, principal matching, group mapping, admin roles, connector auth patterns, permission refresh and known edge cases by current docs and test tenant. Separate app role from source-document ACL.
- **T:** 1. Explain subject identities, groups and app entitlements. 2. Trace source ACL → mapped principal → authorized retrieval. 3. Plan SSO/people onboarding and break-glass/admin boundaries. 4. Test guest, contractor, changed group, deleted user and missing mapping. 5. Define validation ownership.
- **V:** Permission-decision sequence and actor/group matrix with an explicit deny path; real redacted settings capture where procedure is taught; table equivalent for access edges.
- **P/X:** Build a test-user matrix and prove allowed/denied cases in a safe lab; critical fail for accidental exposure. TEC-102 covers broader security, TEC-201 connector preflight, OPS-104 incident triage.

### TEC-104 — Networking Guidance · Planned; local absent
- **R:** Collect current Glean networking guide, deployment-specific IP/DNS/proxy/private connectivity references, customer-side firewall and egress constraints, and approved troubleshooting logs. Confirm direction and ownership of every flow; no invented port/allowlist.
- **T:** 1. Draw source-to-Glean and user-to-Glean paths separately. 2. Explain DNS, TLS, proxy, NAT/egress and private path choices as relevant. 3. Work through allowlist and credential prerequisites. 4. Diagnose timeout versus auth versus name-resolution versus permissions symptoms. 5. Define escalation evidence.
- **V:** Region-aware topology with numbered paths, trust zones and failure injection points; actual redacted connection-test outputs, not fictitious cloud UI.
- **P/X:** Repair a broken network diagram and create a packet-path/evidence checklist. TEC-106/108 adapt cloud topology; OPS-102 translates to day-2 runbook; TEC-101 supplies general data flow.

### TEC-105 — Environment Strategy · Planned; local absent
- **R:** Verify current tenant/environment provisioning options, data isolation, connector credential and API key handling, promotion/export support, change approval and rollback behaviors; ask product SME where migration is not supported.
- **T:** 1. Choose dev/sandbox, pre-prod and production purposes. 2. Design synthetic data and permission test users. 3. Version configuration and secrets. 4. Define promotion gates for connectors, agents, and admin policies. 5. Compare rollback of source changes versus product configuration and document limits.
- **V:** Promotion swimlane with owners, data boundaries, gates, and fallback; capture current setup only where a supported UI path is documented.
- **P/X:** Produce an environment promotion plan with a denied-access test, sign-off, and rollback drill. BLD-202 lab must use disposable resources; OPS-105 uses these gates during releases.

### TEC-106 — AWS Reference Patterns · Planned; local absent
- **R:** Validate current AWS-hosted/customer-hosted applicability, network/account topology, secrets/KMS/logging responsibilities, region and DR promises, supported connector runtimes and approved reference designs with cloud SME. Never infer an AWS topology from a generic Glean architecture image.
- **T:** 1. Start with customer constraints and deployment option. 2. Map identity, data source, networking and administration to AWS components that the customer actually owns. 3. Explain traffic/permission boundary and secret rotation. 4. Trace a failed connector or network edge. 5. Define acceptance and handoff.
- **V:** AWS-specific responsibility and data-flow diagram with the Glean-managed boundary marked, plus annotated cloud console screenshots only from a sanctioned test account.
- **P/X:** Defend a reference design under a private-egress constraint; produce a responsibility matrix. TEC-104 handles generic network, TEC-108 GCP contrast, TEC-107 conditional Azure.

### TEC-107 — Azure Reference Patterns · Not Planned; **do not build without decision**
- **R (conditional):** Ask roadmap owner whether Azure deployments are in scope; check current deployment support and cloud alliance/field guidance. Search current architecture docs rather than copying AWS/GCP. Record explicit yes/no and versioned tracker decision.
- **If authorized, T/V/P:** Teach Azure tenant/subscription, identity, network, egress, key/secret and logging ownership and a real supportable deployment topology; produce a cloud-specific trust-boundary diagram and redacted test-account captures; architecture review a constrained scenario with failure/rollback. If not authorized, explain AWS/GCP coverage and place Azure-specific questions in an SME escalation guide, not a fictional course.
- **X:** Update badge/path maps and cloud comparisons in TEC-101, TEC-106/108, FND-103 and ACC-103 to match the decision. The tracker currently says Not Planned, so this is an explicit human gate.

### TEC-108 — GCP Reference Patterns · Planned; local absent
- **R:** Obtain current supported GCP topology, project/org and service account responsibilities, network/egress, secrets, logs, residency and recovery docs; verify references against actual deployment model and cloud owner.
- **T:** 1. Start from GCP org/project and customer operational constraints. 2. Map user/auth, data connectors, egress, logging, and admin ownership to explicit trust zones. 3. Explain configuration and governance of service identities. 4. Diagnose a permissions or network failure. 5. Handoff operational controls.
- **V:** GCP-specific topology and failure overlay paired with AWS equivalent labels; real sanitized console configuration capture only if a procedure is taught.
- **P/X:** Submit a design with data-flow proof and negative-access test. TEC-104 owns generic connectivity; TEC-106 comparison; do not include Azure as shipped unless TEC-107 authorized.

### TEC-201 — Connector Deployment Prerequisites · Planned; local absent
- **R:** Verify native, partner, custom and live-tool setup differences, app ownership, scopes/consent, identities, API quotas, inclusion/exclusion, freshness, test tenant and support ownership from current connector docs and source-specific setup.
- **T:** 1. Define business objects and retrieval/use needs. 2. Choose indexed/live/hybrid and connector type. 3. Capture credentials, consent, source ACL/identity, network and rate limits. 4. Set validation dataset (allowed, denied, updated, deleted). 5. Decide readiness/no-go and issue owners.
- **V:** Source-to-result flow with preflight checkpoints and an annotated real connector setup capture; checklist that distinguishes *access to source* from *correct document visibility*.
- **P/X:** Review a flawed preflight for a proprietary source and produce a signed readiness gate. BLD-201/202 build custom connectors; TEC-103 verifies identity; OPS-101 owns recurring credential checks.

### TEC-202 — Platform Observability, Logs & Event Telemetry · Planned; local absent
- **R:** Inventory current admin analytics, audit/event and connector/agent log surfaces, API/export capabilities, retention/privacy controls, field semantics and gaps. Test which failures have actual trace IDs and where data is not available; avoid implying universal telemetry.
- **T:** 1. Distinguish product health, connector coverage, permission correctness, query/agent outcomes and business adoption. 2. Correlate one synthetic incident across those layers. 3. Separate fact from inference, redact sensitive data, define thresholds/owner. 4. Build a safe escalation evidence bundle and missing-signal plan.
- **V:** Layered telemetry architecture and real redacted log/analytics screenshots with callouts; sample annotated event sequence showing timestamps and uncertain joins.
- **P/X:** Diagnose a missing-answer incident from sparse evidence and propose instrumentation; rubric credits justified uncertainty. OPS-101/104 consume runbook signals, BLD-207 evaluation consumes agent-quality signals, SOL-103 consumes outcome metrics.

### TEC-203 — Structured Data & Semantic Graph Best Practices · Planned; local absent
- **R:** Read current Knowledge Graph and structured-data/metadata docs; determine supported schemas, entity relationships, identity mapping, indexing modes, freshness and security behavior; verify how structured records actually surface in search/agent retrieval.
- **T:** 1. Model source records, document IDs and links. 2. Explain content/person/activity and graph relationships without claiming a magical inference layer. 3. Demonstrate normalization, metadata, ACL, updates/deletes, and ambiguous entities. 4. Compare a malformed record to a corrected one; test retrieval and explainability.
- **V:** Entity/relationship diagram tied to actual indexed record examples, before/after search evidence and a graph-versus-index separation panel.
- **P/X:** Repair a flawed schema for tickets/accounts/people and predict permitted results; evaluate against test users. TEC-101 owns conceptual architecture; BLD-201 owns connector implementation.

## Builders & Integrations — 12 modules

### BLD-101 — Building with Glean · Planned in tracker; local packaged draft
- **R:** Audit current seven-screen/five-question course against Developer docs and new AGT-101. Verify boundaries/availability for Agents, tools/actions, MCP, Search/Chat/Agents APIs, Web SDK, and Indexing SDK; distinguish builder surface from API.
- **T:** 1. Convert customer need to read, write, embed, index or orchestrate. 2. Show how authentication and identity attach to each. 3. Explain integration/data-flow choices and one failed design. 4. Define development, testing, permission and owner responsibilities. 5. Route to specialized lab.
- **V:** Extensibility map with separate data and control arrows and claim-linked examples, not a generic icon inventory; current UI/API examples marked by version.
- **P/X:** Produce a solution-option memo for two cases and identify a risky shortcut. FND-105 owns broad primitive choice, AGT-101 agent literacy, BLD-102 tool protocol, BLD-203 embedded options.

### BLD-102 — Actions & MCP Fundamentals · Refresh needed; local packaged draft
- **R:** Reverify current connector-based tool setup, native versus custom action, MCP protocol, user/admin authorization, authentication, per-run approval, read/write behavior and availability. The memory ledger specifically flags deck-based MCP claims for recheck.
- **T:** 1. Distinguish index retrieval, live tool read, and external write. 2. Define tool schema, caller identity, auth and permission scope. 3. Trace an agent invocation, approval, response and error. 4. Compare native tool, custom action and MCP connection with trade-offs; note when a connector does not index source content.
- **V:** Detailed call sequence crossing Glean/tool/external service boundaries, denied/timeout/write branches; annotated actual admin/user permission captures from test tenant.
- **P/X:** Choose an integration path for three mixed-source cases and threat-model the write; hard fail for unsafe authorization. FND-105 decides *whether* a tool is needed, BLD-103 teaches implementation.

### BLD-103 — Actions & MCP Workshop · Planned; local packaged draft
- **R:** Acquire latest SDK/tool manifest examples and test tenant; verify auth pattern, schemas, error contracts, timeouts, secrets, human approval and supported trigger/runtime behavior. Compare the local nine-screen quiz package to the tracker workshop promise.
- **T:** 1. Inspect a source API and define a narrow tool contract. 2. Implement/read a safe test operation. 3. Configure auth and a guarded write. 4. Connect/test tool with an agent, including approval and denied-user path. 5. Inject 401, 429, timeout and bad payload; log, retry or stop appropriately. 6. Package a safe handoff.
- **V:** Real labeled configuration captures plus HTTP request/response/trace sequence; semantic failure-state diagram and redacted code snippets.
- **P/X:** Submit runnable source/config, test logs, denied-write result, sanitized secret handling and review checklist. Replace five MCQs as the primary proof. BLD-102 remains theory; BLD-208 supplies governance criteria.

### BLD-104 — Advanced Agent Building Lab · Refresh needed; local packaged draft
- **R:** Compare older workshop material and local 10-screen/five-question draft to current Agent docs: mode, triggers, five building blocks, retrieval scope, steps, tools, memory, sharing/permissions, limits and ADLC. Verify beta/availability and get David Seeber or current agent SME review.
- **T:** 1. Gather task/persona and data-source requirements. 2. Choose Auto or Workflow as supported. 3. Design trigger/input and multi-step plan. 4. Set grounded retrieval and tool rights. 5. Add branching, fallback and human approval. 6. Run good/ambiguous/denied/timeout cases. 7. Evaluate, deploy safely and document version/owner.
- **V:** Agent execution sequence and real builder/trace screenshots; annotate the exact failure/approval points; no schematic implying an unsupported feature.
- **P/X:** Deliver functioning agent and architecture, test suite, permitted/denied evidence and sign-off; rubric includes safety blockers. AGT-101 handles foundations, BLD-207 test methodology, SRV-204 post-deployment debugging, BLD-208 governance.

### BLD-201 — Custom Connector Best Practices · Refresh needed; local absent
- **R:** Retrieve Eugene Wiehahn's best-practices deck, current Indexing API/SDK docs, connector deployment and permission guides, supported document/identity schema, quotas, cursor/rate limits and hosting choices. Reconcile with proposed `plan/custom-connector-accreditation-plan.md` and engineering owner.
- **T:** 1. Choose native vs custom vs live/MCP/hybrid. 2. Scope source records, stable IDs, change/delete semantics and freshness. 3. Map identities and per-document ACLs. 4. Design pagination, backoff, idempotency, observability and reconciliation. 5. Plan ownership, security and maintenance. 6. Review a design that silently skips pages.
- **V:** Complete source → transform → upload → index → permitted query diagram, failure and delete paths; real API/status responses with callouts.
- **P/X:** Produce connector architecture decision record and test matrix; hard fail on ACL/update/delete omissions. TEC-201 owns readiness; BLD-202 implements; the deeper CON-* branch fills API/SDK operations.

### BLD-202 — Custom Connector Implementation Lab · Planned; local absent
- **R:** Confirm current SDK or Indexing API contracts, available test instance, source fixture, auth, identity/ACL, error handling, search verification and deployment requirements. Use a safe fixture source with paginated records, group ACLs, updates, deletes and throttling.
- **T:** 1. Approve intake/readiness. 2. Set up disposable datasource. 3. Implement extraction and transform with stable IDs. 4. Upload document/identity/permission objects. 5. Test mocked, source replay and live phases. 6. Verify allowed/denied and update/delete behavior. 7. Handle retry/partial failure and audit record counts. 8. Document runbook/handoff and clean resources.
- **V:** Annotated code/data-flow and state-transition diagram; sanitized console/status captures and an example failure trace, not decorative connector spokes.
- **P/X:** Submit working connector, automated tests and negative-access evidence, reconciliation log and maintenance handoff; external reviewer checks actual behavior. BLD-201 teaches design, CON-203/204 (if approved) teach API/SDK details, TEC-105 controls environment.

### BLD-203 — Advanced Solutions & Integrations · Planned; local absent
- **R:** Compare current Client/Platform API, Web SDK, Agent API, actions, MCP and embedded patterns; verify OAuth/service auth, scopes, end-user consent, availability and version. Interview a solution architect about when not to embed.
- **T:** 1. Start from user journey and front-end/back-end boundaries. 2. Select retrieve/answer/agent/act/embed interface. 3. Model user delegation and permission check. 4. Handle tokens, errors, timeout, observability and rate limits. 5. Design deployment, upgrade and support.
- **V:** Architecture comparison of API-first, Web SDK embed and agent tool with arrows for identity, request and response; redacted running prototype capture.
- **P/X:** Architecture review two alternative builds for the same use case; reject insecure service-token shortcut. BLD-204 owns code-level Web SDK/Client API lab; BLD-102 tool integration; proposed Embedded Experiences path extends this.

### BLD-204 — Client API & Web SDK Patterns · Planned; local absent
- **R:** Read versioned SDK/API quickstarts and auth docs, sample repos, embed restrictions, accessibility/branding rules and data-scoping behavior. Check which APIs are preview and which example calls remain valid.
- **T:** 1. Authenticate a user appropriately. 2. Build a minimal search/chat embed or API call. 3. Preserve permission-aware identity. 4. Display sources/errors/loading safely. 5. Test denied content, revoked token, latency and accessibility. 6. Package a versioned integration for handoff.
- **V:** Real working application capture with numbered UI states and a request sequence from browser through backend/API; code callouts rather than abstract screenshots.
- **P/X:** Submit working local demo, test-user access results, error-state evidence and architecture note. BLD-203 decides pattern; TEC-103 identity; new embedded competency capstone tests production operation.

### BLD-205 — Snowflake Integration Workshop · Planned; local absent
- **R:** Establish supported Snowflake integration surface (indexed connector, live tool, API, data-sharing or custom path) from current documentation; verify auth role grants, row/column policy, data volume, freshness, governance and customer-hosting limits. Do not assume indexing SQL tables is available or appropriate.
- **T:** 1. Define the target Snowflake workload and access needs. 2. Choose access mode and trust boundary. 3. Set a least-privilege service/user identity. 4. Configure a disposable sample, test correct/denied records and freshness. 5. Handle schema drift, failure, cost/rate and support handoff.
- **V:** Snowflake-to-Glean data/control/permission flow and genuine redacted configuration/query evidence with policy overlay.
- **P/X:** Working proof with a row-access negative case and operational checklist; if the supported product path differs, revise lab rather than inventing it. BLD-201 covers common connector pattern; TEC-203 structured data.

### BLD-206 — Databricks Integration Workshop · Planned; local absent
- **R:** Validate current Databricks integration/support, workspace/catalog identity, auth, permissions, volumes/freshness, approved retrieval versus indexing path and deployment constraints; verify against product docs and a sanctioned test workspace.
- **T:** 1. Define business object and data entitlement. 2. Map workspace/catalog security to Glean retrieval/tool execution. 3. Configure narrow sample and record identity. 4. Verify results for allowed and denied users. 5. Test schema changes, stale data, rate/timeouts and handoff.
- **V:** Databricks workspace-to-experience trust-boundary diagram, actual redacted result and permissions captures; compare to Snowflake where semantics differ.
- **P/X:** Submit a repeatable lab log with permission and failure tests, plus trade-off memo. TEC-203 covers semantics; BLD-205 remains an independent product-specific lab, not a relabeled template.

### BLD-207 — Agent Evaluation, Testing & QA · Planned; local packaged draft
- **R:** Compare current five-MCQ/10-screen package to tracker *Lab* and current Agent development/testing docs, trace availability, safe fixture/test-data policy and human review expectations. Do not invent a native harness; an external evaluation process must be labeled as such.
- **T:** 1. Define acceptance criteria from a user task. 2. Design a balanced golden set: positive, negative, permission, ambiguity, tool failure, low confidence, changed source. 3. Choose reproducible scoring and reviewer judgment. 4. Run baseline and candidate versions; compare regression and false success. 5. Triage failures, assign ownership and retest.
- **V:** Annotated test-case matrix and agent-run/score-delta trace with a regression route; real trace capture if a verified product surface exists.
- **P/X:** Submit fixtures, versioned runs, regression report and ship/hold decision; assessor reproduces at least one fault. BLD-104 builds, SRV-204 diagnoses production incidents, OPS-105 schedules regression review. Quiz is supplemental only.

### BLD-208 — Agent Governance & Safety · Planned; local packaged draft
- **R:** Review current sharing/permissions, tool approvals, AI security, auditability, data handling, retention, ADLC and incident policies; compare the local nine-screen/five-question draft with implementation risk. Distinguish official tiering from any studio scoring heuristic.
- **T:** 1. Classify agent risk by audience, data and action. 2. Limit knowledge sources and tool rights. 3. Define human review, fallback and safe refusal. 4. Document change control, monitoring, owner and rollback. 5. Investigate prompt-injection, stale/denied data and unintended write scenarios.
- **V:** Threat model from trigger to retrieval/tool/action/output with control owner; real redacted sharing/tool-permission captures, risk decision record.
- **P/X:** Conduct a mock launch-governance review of an unsafe agent and produce a corrected control plan; hard fail on unauthorized write or access. TEC-102/103 own platform identity/security; BLD-207 evaluation, OPS-106 recurring compliance, ACC-104 integration.
