# Module build contracts 05 — six ACC modules and nine accreditation paths

**Critical distinction:** `learning/accreditations/<id>/accreditation.yaml` defines an LMS learning badge. It does **not** award the official organization-level Glean Partner Competency. The [Competency Program Guide](https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w) requires separate validated technical accreditations, workshops and portfolio/customer or production evidence depending on competency; a Glean Partner Manager/Partner Solutions Engineer validates the requirements. Never suggest a five-question SCORM pass equals an external competency. [cite: Glean Partner Competency Program Guide | "Glean competencies require thorough experience and successful completion of an audit process."](https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w)

**Common badge contract:** a path overview states audience, readiness, prerequisites, evidence, estimated learning/practice/review time, rubric, appeal/accommodation and maintenance; core modules each teach a distinct competency; capstone tests transfer across modules on unseen cases; assessor is independent of author; safety/accuracy and denied-access gates are noncompensatory; attempts and 80% threshold are proposed pending policy owner approval; no timer-based passage. For an LMS-only SCORM package, capture formative progress and quiz score; assessor-graded evidence uses an authorized external submission process, with privacy/retention and reviewer identity explicitly approved. Each badge release cites the exact module versions and cannot precede any required release. Badge artwork is not evidence.

## The six tracker capstone modules

### ACC-101 — Seller Accreditation 201 · Planned; no local source
- **R:** Align latest seller/partner policy, legal-approved differentiators, demo certification rubric, current commercial terms, and all required SAL modules. Resolve tracker prerequisite `SAL-103` versus actual integrative scope spanning SAL-201/202/203/204/205; do not examine content learners were never required to take.
- **T:** Short readiness diagnostic; then a progressive opportunity dossier: ambiguous buyer request, discovery, executive story, competitive objection, proof/demo, co-sell handoff and commercial boundary. Explain decision rationale after each phase and provide a model answer *after* attempt.
- **V/P:** Annotated opportunity timeline, real approved demo evidence and a buyer/partner/Glean role map. Submit recorded 10–12-minute discovery/pitch, evidence-backed demo outline, account plan and objection response. Two unseen buyer variants; human rubric for curiosity, factuality, proof, commercial honesty and handoff. A separate item bank probes prerequisites. Seller 101 (SAL-103) remains a distinct earlier gate.

### ACC-102 — Solution Advisor Accreditation · Planned; no local source
- **R:** Map SOL-101/102/103/201/204 objectives to current partner solution artifacts and architecture/security assumptions; confirm capstone pass criteria and whether TEC-101/FND-105 are formal prerequisites.
- **T:** Integrated case with conflicting department requests, imperfect data readiness and an executive goal. Learner conducts interview, ranks use cases, writes outcome hypothesis, chooses construct, architects permissions/data path, models value with assumptions, and plans adoption. Provide worked exemplar and risk/uncertainty decision logic only after submission.
- **V/P:** Two-view solution blueprint, sensitivity sheet, stakeholder/outcome map and 60-day adoption path. Panel defense on a changed constraint; rubric hard-gates unsourced ROI, unaddressed denied access and undefined owner. Do not use the same five recognition items as other badges.

### ACC-103 — Technical Architect Accreditation · Planned; no local source
- **R:** Confirm TEC-101–105/201 requirement mapping and tracker prerequisite TEC-203, which is *not* listed as a required badge module; decide if TEC-203 is added or capstone scope narrowed. Verify security/network/deployment/cloud variants with current SMEs.
- **T:** Customer architecture packet with source inventory, SSO/group edge cases, network restriction, connector prerequisites and a risky agent. Learner designs ingress/egress, identity/ACL, environment promotion, verification, observability and incident recovery; then responds to a mid-review source-permission change.
- **V/P:** Annotated trust-boundary diagrams, permission test matrix, promotion plan and architecture decision record. Independent architect review and safe/denied tests; critical fail for unprotected data, invented product limits, or no rollback. Cloud provider-specific design is elective only if taught and supported.

### ACC-104 — Builder Accreditation · Planned in tracker; local packaged draft **mis-scoped**
- **R:** Inspect current local five-question course: it asks about official Agent Building Competency submission, while the tracker Builder badge says implement **actions, agents and connectors**. Decide with owner whether to (a) redesign ACC-104 as cross-builder capstone and create a separate Agents competency-prep course, or (b) use separate independently graded tracks with a common ID only if LMS supports distinct attempts/evidence. Preferred: (a). Verify official competency wording separately.
- **T:** Advanced integrated build: intake and construct choice → narrow data source/connector design → tool with explicit read/write boundary → agent orchestration → safe test/eval → deployment and handoff. Explain data, auth, ACL, failures and integration alternatives in full.
- **V/P:** Working diagram and genuine run/test evidence; submit functioning small connector or verified fixture, action/tool and agent, denied-access/failed-write cases, source/config, test suite and runbook. Reviewer reruns tests; noncompensatory ACL/secret/unsafe-write gates. Five current MCQs can remain as a small policy diagnostic, not the capstone. Resolve `BLD-208` tracker prerequisite and `BLD-201/202` required-module mismatch before release.

### ACC-105 — Delivery Lead Accreditation · Planned; no local source
- **R:** Map SRV-101/102/103/104/201/202 to latest service methodology; explain why tracker lists prerequisite `SRV-205` but not as a required badge module. Validate partner/Glean delivery responsibility and customer acceptance rules.
- **T:** A 90-day customer program with missing source ownership, a late security dependency and weak adoption. Learner builds scope/RACI, kickoff, rollout gates, training/champions, CoE, measure plan and recovery strategy; submit a decision log as case conditions change.
- **V/P:** Critical-path rollout and role swimlane, customer status pack and acceptance checklist. Human reviewer role-plays customer steering committee; rubric tests risk anticipation, ownership accuracy, adoption metric integrity and safe escalation. Technical execution is assessed only if SRV-205 is made a formal requirement.

### ACC-106 — Support & Adoption Accreditation · Planned; no local source
- **R:** Confirm OPS-101–105 and tracker prerequisite OPS-106 (not in badge requirements); verify Glean Support rights, current product runbooks, analytics/privacy and customer-specific support commitments. Decide whether OPS-107/108 join as electives.
- **T:** Simulated operating week: connector auth failure, misleading answer report, employee access incident, release change and falling adoption. Learner prioritizes, reproduces, routes, communicates, restores, documents, and proposes improvement, explicitly separating partner and Glean support.
- **V/P:** Incident timelines, redacted evidence package, controlled change plan and adoption dashboard. Table-top exercise with independent support lead; hard gates for denied-data leak, false SLA promise and missing escalation. Formative items can diagnose knowledge gaps but cannot replace operations proof.

## Nine local badge definitions: exact work per accreditation

### 1. Glean Foundations (`accred-foundations`) — FND-101/102/103/107
- **Current:** YAML planned, zero required modules locally sourced; first three tracker labels refer to external assets, fourth is new. No live badge evidence in repo.
- **Research and sequence:** Resolve current partner routes and LMS navigation, then rebuild platform breadth on source-backed demos. FND-101 → 102 → 103; FND-107 verifies path/evidence literacy after 102 and revisits 103. Add a short **foundation transfer case**: choose a valid partner route, distinguish search/assistant/agent, find prerequisite learning and explain a permission-safe next step. This is not an advanced technical exam.
- **Visual/evidence:** One coherent path map, partner responsibility swimlane, platform/data-flow diagram and genuine product/portal captures; each image teaches a different decision. Assessor checks no unsupported economic or security promise. Completion rule must wait for all four module releases and a valid transfer case.

### 2. Seller / Seller Advanced (`accred-seller-seller-advanced`) — SAL-101/102/103/203/ACC-101
- **Current:** zero required local modules; combined 101/201 label obscures level. ACC-101 only requires SAL-103 in tracker despite advanced scope.
- **Research and sequence:** Define **Seller** milestone after SAL-101/102/103, and **Seller Advanced** only after discovery, executive narrative, objection/competitive skill, commercial and joint account planning (SAL-201–205 as approved) plus ACC-101. Make this a policy decision, not a silent YAML edit.
- **Visual/evidence:** A coherent opportunity case threaded across call, demo, deal and partner handoff; separate introductory certification from advanced role-play. Badge gate requires recorded sales performance, independent rubric, evidence-backed competitive claims and approved commercial boundaries; no copied five-question quiz.

### 3. Technical Advisor (`accred-technical-advisor`) — SOL-101/102/103/201/204/ACC-102
- **Current:** zero required local modules. Scope spans value, discovery, blueprint and adoption; no single thin knowledge check can establish it.
- **Research and sequence:** Teach personas → prioritized use cases → value model → solution blueprint → adoption; require FND-105 or an equivalent entry diagnostic for construct choice. Use one case whose stakeholder and access constraints evolve, but vary practice cases so memorization fails.
- **Visual/evidence:** Outcome/architecture twin-view, evidence/assumption ledger, ROI sensitivity and rollout plan. ACC-102 accepts a defensible blueprint and review, not a generic pitch. Gate on accurate permissions and no invented ROI.

### 4. Builder (`accred-builder`) — BLD-101/102/103/104/201/202/ACC-104
- **Current:** five of seven required source directories exist locally; BLD-201 and BLD-202 absent. Existing ACC-104 is Agent Building Competency prep, not a full Builder capstone.
- **Research and sequence:** Intro/extensibility → tool/MCP foundation → safe implementation lab → agent design lab → connector architecture/lab → cross-primitive build proof. Resolve BLD-208 prerequisite and whether evaluation/safety (BLD-207/208) must be required rather than optional.
- **Visual/evidence:** API/tool call, agent trace and connector indexed-permission flow as separate diagrams; real builder/status captures. ACC-104 demands runnable evidence with denied-permission and failure tests. Badge not complete merely because all five pre-existing ZIPs exist.

### 5. Solution Architect (`accred-solution-architect`) — TEC-101/102/103/104/105/201/ACC-103
- **Current:** no required local course. ACC-103 tracker prerequisite TEC-203 is not in badge YAML.
- **Research and sequence:** Architecture flow → security → identity → networking → environments → connector readiness → holistic review; decide whether structured-data TEC-203 is an explicit requirement, elective or prior knowledge. Cloud patterns are context-specific electives, not universal requirements.
- **Visual/evidence:** Versioned common source-to-query diagram with distinct security/network/deployment overlays; realistic architecture packet and assessed negative ACL test. Final review checks source rights, network path, rollback and ownership, not trivia.

### 6. Delivery Lead (`accred-delivery-lead`) — SRV-101/102/103/104/201/202/ACC-105
- **Current:** no required local modules. Several tracker Ready-for-LMS assets need acquisition and depth audit. ACC-105 requires SRV-205 but badge does not.
- **Research and sequence:** Certification boundaries → delivery methodology → technical rollout → kickoff → training → CoE → integrated program capstone. Decide whether technical delivery SRV-205 is prerequisite or a role-specific elective; different lead and engineer skills need different evidence.
- **Visual/evidence:** Full lifecycle/RACI, project decision gates, customer status and adoption evidence; independent customer steering role-play. Zero unsupported partner/Glean SLA or deployment-authority claims.

### 7. Support & Adoption (`accred-support-adoption`) — OPS-101/102/103/104/105/ACC-106
- **Current:** zero required local modules. OPS-107/108 local packages are unrelated standalone courses in current YAML; OPS-106 is capstone prerequisite but not required.
- **Research and sequence:** Admin routine → cloud ops → support model → incident simulation → release readiness → integrated operations/adoption capstone. Decide if governance OPS-106 becomes required and if support portal/community courses become electives; map support rights explicitly.
- **Visual/evidence:** Layered incident/evidence timeline, real support UI, handoff RACI and monitoring dashboard; a live table-top, not six near-identical runbook quizzes.

### 8. Industry Specialist (`accred-industry-specialist`) — SOL-202/203 plus any 2+ IND modules
- **Current:** SOL-203 local draft only; SOL-202 and IND modules absent. YAML uses elective pattern `IND-*` minimum two without specifying which roles or whether IND-201 counts.
- **Research and sequence:** Pattern design → agent-use-case design → two *distinct* industry plays → proposed vertical transfer capstone. Define whether any two can include IND-201 or must be two IND-101–107, and require reviewers with appropriate vertical expertise.
- **Visual/evidence:** Show how the same platform pattern changes in data rights, workflows and outcome metrics across two sectors; capstone must adapt to an unseen third context or a materially changed constraint. No regulatory promise without counsel. Do not announce the badge without an assessed synthesis task.

### 9. Agents (`accred-agents`) — composed path, 11 required IDs and overview `accred-agents`
- **Current:** all 11 required sources and overview exist locally, with ZIPs; status is locally `built_pending_human_review`, not an LMS/official competency release. `AGT-101` is not a required member despite being the best current agent foundation; `ACC-104` is shared with Builder but locally teaches official Agent Building Competency submission.
- **Research and sequence:** Decide whether AGT-101 replaces/bridges FND-104/105; repoint Agents path through agent anatomy → construct choice → safe tools → advanced build → evaluation → governance → vertical use case → debugging → separate **agent portfolio assessment** (proposed ACC-109; specified in volume 06), keeping ACC-104 for Builder. Avoid requiring all Builder connector topics for an Agent-only badge unless the audience needs them.
- **Visual/evidence:** An end-to-end agent run/permission/approval trace, builder and actual runtime captures, negative/fallback cases and repeatable evaluation record. Official competency prep must explicitly walk portfolio criteria and independent Glean validation (the guide describes five production-ready agents, workshop, per-agent evidence and customer feedback for at least two). The local overview cannot award that official competency. [cite: Glean Partner Competency Program Guide | "Build 5 functioning, production-ready agents"](https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w)

## Policy and hierarchy defects to resolve before badge release

1. **Prerequisites ≠ badge membership:** ACC-101 requires SAL-103 but appears to assess optional advanced modules; ACC-103 requires TEC-203 not in its badge; ACC-104 requires BLD-208 not in Builder badge; ACC-105 requires SRV-205 not in Delivery Lead; ACC-106 requires OPS-106 not in Support & Adoption. Align actual examination scope, prerequisite graph and YAML, then run hierarchy validation. Do not make a learner prove an untaught elective.
2. **Separate scopes:** ACC-104/Builder versus Agents/official competency must not be one five-question exam reused across three promises. Give each distinct outcomes, cases and evidence. Reuse a foundational module by reference, never clone its learner copy for a different badge.
3. **No accidental automatic publication:** currently planned badge definitions mention `automatic_after_green`. This plan makes SME, independent assessor, exact-ZIP QA, real LMS and authorized release explicit; revise release policy only with owner approval, not as part of this plan.
4. **Path reporting:** display badge, competency and external validation state separately (`module built`, `package QA passed`, `LMS imported`, `individual badge complete`, `organization competency validated`). Count versions and effective dates, not a single `status: built` flag.
