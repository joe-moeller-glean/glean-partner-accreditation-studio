# Local extras, curriculum gaps and proposed new modules

**All IDs in this volume beyond AGT-101/MEM-101/OPS-107/OPS-108/accred-agents are proposals, not rows in the roadmap.** Reserve IDs, source owners, durations, badge membership and budget only after roadmap-owner approval. Proposed accreditations are *LMS learning paths* unless the official organization-level competency process separately validates them. For each proposal, apply volume 00's full source/claim, explanations, worked case, diagram, real capture, applied performance and QA contract. The existing custom-connector plan (`plan/custom-connector-accreditation-plan.md`) is a substantial draft; integrate it, do not create a parallel contradictory path.

## Five local sources outside the tracker: audit and placement

### AGT-101 — Glean Agents Foundations · local packaged, no tracker row
- **Keep:** The 12-band module has a stronger documented agent taxonomy, 62 claim references, seven interactive forms and a dedicated browser QA report than the older nine-screen agent courses. Its package sidecar matches ZIP, but recorded reproducibility SHA differs from current package; the report also lists pending SME/LMS/screen-reader and five design deviations. It is **not** verified released.
- **Deepen:** Explain each of five agent building blocks with an input/output, causal role, permission boundary, example and failure; add one complete current trigger → Auto/Workflow choice → retrieval/tool → human approval → output trace; provide a worked no-agent alternative and two divergent cases. Convert the current six-question recognition quiz into decisions about mode, triggers, risks and limitations. Add real sanitized builder/trace captures and a 90-day recapture protocol.
- **Place:** Make AGT-101 an Agents badge entry prerequisite after owner approval. Trim FND-104 to platform experiences and FND-105 to construct choice. Do not clone AGT-101's five-block explanation into BLD-101/104. Re-run exact-SHA QA and obtain SME/LMS validation.

### MEM-101 — Memory in Glean: From Personalization to Cross-Surface Context · local packaged, no tracker row
- **Keep/research:** Local `module.yaml` says 12 scroll bands, six questions, five sources and gates pending. Revalidate current availability, settings, retention, user control, short- versus long-term semantics, procedural/semantic/episodic categories and cross-surface promises; have product/security owner resolve anything in a technical PowerUP not in current docs.
- **Teach/build:** Use a state-transition example showing what is remembered, what is not, retrieval/context selection, correction/deletion where supported, and user/admin boundary. Compare a task improved by memory with a privacy-sensitive task that must not persist; include memory failure and stale-context cases. Create a sourced diagram and genuine settings/experience captures, never a speculative UI.
- **Place/prove:** Optional foundation for proposed MEM-201 and advanced AGT work; not automatic Foundations badge membership. Scenario design explaining when memory is useful/unsafe, plus a guarded lab if current product supports it. Complete missing release gates and align current ZIP with QA proof.

### OPS-107 — Glean Support Center & Escalations · local packaged, no tracker row
- **Keep/research:** Existing 14-screen package includes source-backed support paths, but local QA contains only `waivers.json`; ticket entitlement/partner-on-behalf-of-customer and post-ticket escalation remain open questions. Confirm current Support Center, DSC rules, ticket priority, safe evidence and SLA language with support owner.
- **Deepen:** Work through how-to vs incident vs product feedback, ticket construction with reproduction/log redaction, handoff/priority change and follow-up. Add dated real Support Center captures of sign-in, conversation, ticket and status—not just stylized flow cards. Run a support table-top with partner versus customer permissions.
- **Place/prove:** Candidate Support & Adoption elective, prerequisite for OPS-108, reference in OPS-103/104. Do not release or teach partner entitlement as fact before owner ruling and full QA tied to ZIP SHA.

### OPS-108 — Using Gleaniverse Community · local packaged, no tracker row
- **Keep/research:** Existing 11-screen package also lacks final QA report; verify current community taxonomy, moderation, privacy/guideline policy and exact boundaries between forum, support conversation, ticket and feedback board.
- **Deepen:** Walk a safe search → cited answer → community post with no confidential data → support escalation if needed; show two real redacted community/UI flows and accessibility text alternatives. Include a bad post and remediation.
- **Place/prove:** Optional short operations resource, not a substitute for support-model or incident modules. Scenario assessment must distinguish public community sharing from private customer/support evidence. Full QA, SME and LMS review required.

### `accred-agents` — local overview ZIP, not tracker row
- **Repair:** Its seven-screen/five-question course largely tells learners badge/official competency facts; separate overview/route map from actual capstone and from official competency submission guidance. Update requirements after AGT-101 and ACC-104 scope decisions; add an annotated evidence-portfolio template for each official requirement, validator and missing proof. Existing QA/status checksums are stale relative to current ZIP. Rebuild, re-review, do not call status `built` a credential award.

## Proposed high-priority platform, selling and services gap fillers

### PLT-201 — Retrieval, Relevance & Answer Quality Lab · proposed, 2–3h; after TEC-101, FND-103
- **Gap/research:** Existing course list names architecture and structured data, but lacks a focused query-side lab that explains recall, freshness, ranking, citations, permission filters and why an answer can be poor even when indexing succeeded. Verify current diagnostics and documented controls.
- **Teach/visual:** Trace three queries across indexed/live candidates, identity filter, ranking, grounded answer and citation; compare no-result, wrong-result and correct-but-uncited states. Use a two-path query sequence, labeled real search/answer captures and a source-coverage matrix.
- **Proof/updates:** Learner diagnoses failed retrieval from test users and fixes source/query/permission or escalates; rubric requires no ACL shortcut. TEC-101 links to this for depth, TEC-202 logging, SOL-201 design and OPS-104 triage consume the diagnostic model.

### SEC-201 — Permission & Identity Failure Lab · proposed, 2–3h; after TEC-103, TEC-201
- **Gap/research:** TEC-103's one-hour overview cannot prove end-to-end ACL competence. Build safe source/user/group fixtures; verify actual connector identity and query semantics with current docs.
- **Teach/visual:** Source ACL → identity map → update/delete → query-time test, with nested groups, departed employee, external collaborator and source permission change. Diagram allowed/denied call sequence, test matrix and redacted result evidence.
- **Proof/updates:** Learner runs positive and negative tests, locates a mapping fault, documents recovery; zero tolerance for leakage. Make this a proposed Solution Architect/Builder advanced gate after badge policy decision; cross-link BLD-202 and OPS-104.

### TEC-204 — AI Model, Grounding & Guardrails Architecture · proposed, 1.5–2.5h; after TEC-101/102
- **Gap/research:** Current roadmap references LLM/RAG inside TEC-101 but has no advanced module on actual model/request boundaries, citations, groundedness, prompt injection and model-policy variance. Consult current security/product docs; avoid claiming unverified provider or retention behavior.
- **Teach/visual:** Query → retrieval → context selection → model → output → citation/approval, separating retrieved authority from generation; show adversarial document and injection rejection, non-answer when evidence absent, and trade-offs of latency/cost/quality where documented.
- **Proof/updates:** Threat-model two cases and write control/validation plan; negative tests required. Feeds BLD-208, ACC-103, FND-103 simplified model; product/security SME gate.

### SAL-206 — Value Proof, Pilot & Procurement Negotiation · proposed, 1.5–2h; after SAL-202, SOL-103
- **Gap/research:** Seller path has pitch, objection and pricing, but no complete proof-to-commercial transition. Gather current POV criteria, deal-desk approval, partner roles, success measurement and proof packaging.
- **Teach/visual:** Qualify baseline → agree pilot hypothesis/test set → run evidence-based demo/POV → inspect mixed results → choose scale, revise or stop → prepare procurement handoff. Visualize hypothesis-to-decision ladder and a redacted pilot scorecard.
- **Proof/updates:** Learner defends a no-go despite attractive anecdotes and drafts joint next step without unauthorized discount. Candidate Seller Advanced requirement; update ACC-101 and SAL-205 if approved.

### SRV-206 — Realized Outcomes & Customer Value Review Lab · proposed, 2–3h; after SOL-103, SRV-201/202
- **Gap/research:** SOL-103 models value before launch and SRV-201 measures adoption, but no substantial post-launch value realization/renewal evidence lab. Review current realized-outcomes playbook, analytics definitions, baseline and customer sign-off.
- **Teach/visual:** Baseline → deployment/engagement → task-level behavior → attributable outcome → variance and confounder → executive review/action plan. Show a causal impact tree and honest dashboard with missing-data annotations.
- **Proof/updates:** Produce a QBR with an underperforming use case and a defended optimization or retirement choice; reviewer penalizes cherry-picked adoption. Candidate Delivery Lead advanced requirement and ACC-105 extension.

### OPS-109 — Production Agent Operations & Change Control · proposed, 2–3h; after BLD-207/208, OPS-103
- **Gap/research:** Evaluation and governance are build-time; operating live agents across versions, permissions and source drift lacks a clear owner. Verify current versioning/telemetry/approval and support policy.
- **Teach/visual:** Inventory owner, baseline tests and permissions; detect anomalous run/failed tool; triage safely; stage and approve change; regression and rollback or disable; user communication and postmortem. Visualize agent life cycle plus incident/change swimlane with real trace/admin capture.
- **Proof/updates:** Run a release-and-incident simulation with denied-write case. Add to Agents/Support & Adoption as elective or prerequisite by policy; cross-link SRV-204 and OPS-105.

### MEM-201 — Memory Design, Privacy & Evaluation Lab · proposed, 2h; after MEM-101, BLD-104
- **Gap/research:** MEM-101 introduces vocabulary but does not test whether persistent context improves a task without leaking or misapplying prior context. Confirm actual controls/availability/retention with current docs and product SME.
- **Teach/visual:** Define allowed memory scope, seed and retrieve context, detect stale/contradictory memory, correct or disable where supported, and compare evaluations with/without memory. Visualize write/consolidate/retrieve/use path and control boundary; capture approved UI states.
- **Proof/updates:** Produce a memory risk test suite with a privacy negative case and changed-persona outcome. Advanced Agents elective; update BLD-104 to link rather than duplicate.

### ACC-109 — Agents Learning Portfolio Capstone · proposed, 3–5h + independent review; after AGT-101, BLD-104/207/208, SRV-204
- **Gap/research:** ACC-104 is presently a five-question Agent Building Competency orientation but must become Builder-wide if the owner approves. Verify current Agent Development Lifecycle, official competency requirements and workshop/portfolio evidence; agree which lab activities an individual can safely perform in a test tenant without falsely claiming production customer outcomes.
- **Teach/visual:** Explain how requirements, construct choice, architecture, retrieval guardrails, multi-step logic, tools/approval, tests, impact and operations form a complete portfolio. Show five *sample evidence slots* and an annotated run trace with a failure and rollback; do not require every learner to possess five real customer agents for an LMS badge.
- **Proof/updates:** Independently review one production-shaped agent artifact plus a portfolio plan covering five differentiated agents, permission/guardrail/fallback and at-least-one advanced capabilities; test an unseen failure and require a truthful evidence-gap register. The official organization competency still requires its own workshops, actual five production-ready agents, customer confirmation and Glean validation. Replace Agents badge's ACC-104 requirement with ACC-109 only after owner sign-off and preserve ACC-104 for Builder.

## Custom Connector Competency — reconcile existing proposal, do not silently add badge

The [Indexing SDK](https://developers.glean.com/libraries/indexing-sdk/) describes source extraction, transformation, upload, permissions and three testing phases; the [Competency Program Guide](https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w) separately defines the organization audit. The existing `plan/custom-connector-accreditation-plan.md` already specifies a 10-module course path with TEC-201, BLD-201/202 plus the following proposed modules. Research current API/SDK behavior again before authoring. [cite: Indexing SDK | Glean Developer | "Three test phases, one added dependency at a time"](https://developers.glean.com/libraries/indexing-sdk/)

### CON-101 — Connector Fundamentals · proposed, 1–1.5h
- **R/T:** Verify native, partner, indexed custom, live tool/MCP and hybrid behavior, source auth and searchability; teach decisioning through supported SaaS, proprietary source, write-only operation and sensitive live lookup. **V/P:** Access-mode decision tree with content/permission arrows; learner defends four choices and one no-go. **X:** FND-105 remains general, TEC-201 preflight.

### CON-201 — Indexing Architecture & Data Flow · proposed, 1.5–2h
- **R/T:** Verify record discover/extract → transform → user/group/ACL → upload → async processing/index → query verification and freshness/delete status. Work through “upload succeeded but user cannot find result.” **V/P:** Detailed ingestion/query split diagram, actual status/debug responses, failure matrix; learner locates the exact broken stage. **X:** TEC-101 links to this for connector depth.

### CON-202 — Connector Scoping & Intake · proposed, 1.5–2h
- **R/T:** Gather source API auth, pagination, schema, update/delete semantics, volume/quotas, source owner, hosting, data rights and support; build an explicit go/no-go decision and customer intake. **V/P:** Completed intake and source-to-Glean RACI; learner scopes a cursor-paginated, ACL-restricted source and flags unknowns. **X:** TEC-201 prerequisite may be concurrent; BLD-201 design follows.

### CON-203 — Indexing API & Data Model · proposed, 2–3h
- **R/T:** Verify current datasource and document/identity/group/permission contracts, upload/processing status, update/delete and API auth; show actual request/response, status and denied-result paths with versioned docs. **V/P:** Field-by-field payload annotation and sequence; lab indexes public/allowed/denied fixtures, updates/deletes, proves visibility. **X:** BLD-201 design, BLD-202 implementation.

### CON-204 — Indexing SDK Build & Test · proposed, 3–4h
- **R/T:** Verify current Python SDK classes, data client, transform, push, test harness, CLI, rate handling and supported deploy scaffolds; treat agent-generated code as untrusted. Build from fixture API; test mocked, source replay and live disposable tenant, then rate limit/partial failure. **V/P:** Annotated class/data flow, genuine test outputs, reviewed source and negative ACL evidence. **X:** BLD-202 integrates the full customer handoff.

### CON-301 — Production Connector Operations & Handoff · proposed, 2–3h
- **R/T:** Confirm hosting, secrets, schedules, freshness/reconciliation, health/status, incident response, schema migration and owner transfer; compare Glean-hosted versus customer-run assumptions. **V/P:** Lifecycle/runbook and observed failure trace; learner handles source schema change and stale ACL then writes maintenance SLO proposal without inventing a Glean SLA. **X:** OPS-101/102 day-2 operations, TEC-202 observability.

### ACC-107 — Custom Connector Learning Capstone · proposed, 3–5h + independent review
- **R/T/V/P:** Using a source packet not seen in CON labs, deliver intake, architecture, fixture connector, identity/ACL, update/delete, retry, reproducible tests, status/observability and customer handoff; Glean technical reviewer replays a denied-access case and failure. Map proof to the **official** competency workbook but do not award official badge automatically. Proposed `accred-custom-connectors` learning badge requires CON-101/201/202/203/204/301, TEC-201, BLD-201/202 and ACC-107; coordinate workload and prerequisites with existing detailed plan.

## Embedded Experiences Competency — missing structured curriculum

The official guide includes production solution evidence and review for Embedded Experiences; current roadmap has BLD-203/204 but no complete production embed/API/tool lifecycle or capstone. [cite: Glean Partner Competency Program Guide | "The Glean Embedded Experiences Competency recognizes Partners that can design, build, and operate production-grade solutions"](https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w)

### EMB-101 — Embedded Experience Strategy & API Choice · proposed, 1.5h; after FND-105/BLD-101
- **R/T/V/P:** Verify Client/Platform APIs, Web SDK, Agents API and MCP availability/auth; map user journey → API/embed/tool choice → permission/branding/accessibility boundary. Diagram alternative end-user request flows; learner writes a decision record comparing two designs and rejects an unsafe token pattern. **X:** BLD-203 becomes prerequisite, not duplicate intro.

### EMB-201 — Authentication, Delegation & Secure Tool Design · proposed, 2–3h; after TEC-103/BLD-102
- **R/T/V/P:** Check current OAuth/user delegation, service tokens, scopes, secret rotation, webhook/callback and admin/user approval, runtime error/rate limits. Draw consent and external-write sequence, demonstrate safe/denied path in sanctioned fixture. Learner implements a least-privilege tool and proves no cross-user data. **X:** BLD-103 supplies general tool build; TEC-103 identity.

### EMB-202 — Web SDK & API Integration Lab · proposed, 3–4h; after BLD-204/EMB-201
- **R/T/V/P:** Revalidate current SDK version, API contracts, CORS, citations, streaming/error semantics and accessibility; build permission-aware search/chat or agent experience inside a fixture app; test load, denied content, expired credential, timeout, keyboard/screen reader. Diagram browser/backend/API call chain and capture real running states. **X:** BLD-204 teaches simple pattern; this is production-shaped implementation.

### EMB-301 — Production Operations for Embedded Solutions · proposed, 2–3h; after EMB-202
- **R/T/V/P:** Verify deployment/configuration, logging/metrics, quotas, retries, release compatibility, accessibility and incident ownership; stage a token revocation and partial failure. Learner produces observability map, runbook, upgrade/rollback plan, and safe end-user error message. **X:** TEC-202 logs, OPS-104 incident, OPS-105 changes.

### ACC-108 — Embedded Experiences Learning Capstone · proposed, 3–5h + independent review
- **R/T/V/P:** Unseen customer app case requiring two supported integration capabilities, per-user auth, timeout/rate handling, source permissions, accessibility, metrics, deployment and handoff. Assessor reviews working demo, architecture, tests, negative case and runbook; document how evidence maps to separate official workbook and production review. Proposed `accred-embedded-experiences` badge includes BLD-203/204, EMB-101/201/202/301 and ACC-108; do not claim official competency without its external validation.

## Missing specialization capstones and badges

### IND-202 — Cross-Industry Design Transfer · proposed, 2h; after SOL-202/203 and two IND-101–107
- **R/T/V/P:** Confirm vertical badge policy, safe synthetic cases and SME pool; learner adapts a sector pattern to an unseen sector with changed regulation, source permissions and KPIs, showing what *cannot* transfer. Visual is a side-by-side original/changed architecture and risk register. Independent two-sector review. **X:** Add only after Industry Specialist badge decision; IND-201 is optional production accelerator, not automatically one of the two vertical plays.

### ACC-110 — Department Solutions Applied Capstone · proposed, 2–3h; after SOL-101 and two DEP modules
- **R/T/V/P:** Decide if a Department Specialist badge exists (old master plan mentions it, no YAML/tracker accreditation definition). An unseen multi-department case must compare two workflows, shared data, different access, outcomes and ownership; learner produces a blueprint and secure rollout, not recites a catalog. Visual is two swimlanes and one permission boundary; independent rubric. **X:** Create `accred-department-specialist` only with roadmap-owner approval and explicit required/elective membership.
