# Built and in-progress courseware: file-by-file review and repair queue

**Audit method:** read the live 83-row [tracker](https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q), local `learning/modules/*` metadata/content/items/sources/QA, `learning/accreditations/*`, `plan/status.json`, 16 ZIP inventories and SHA-256 sidecars. This is a **structural/content audit**, not a new real-browser, assistive-technology, LMS or product-SME certification of the present packages. Metrics below are observations of files at audit time; pre-existing uncommitted changes can change them. SVG counts include local brand/icon/diagram files, so they do not measure the number of meaningful instructional diagrams. No local module has PNG/JPEG/WebP in `assets/`. A ZIP existing is not proof of publication.

## A. Eleven locally packaged tracker modules: what to preserve and what to replace

| ID / tracker status | Present file-level evidence | Content and build action before release |
|---|---|---|
| **FND-104** / In development | 9 screens, 5 quiz items, 3 SVGs; local 1.0.0 ZIP; held in `plan/status.json`. | Keep platform framing; replace simple stack with same-question search/assistant/agent execution traces; verify agent taxonomy, add real UI/failure states and unseen construct choice; separate AGT-101 depth. |
| **FND-105** / In development | 9 screens, 5 items, 3 SVGs; local ZIP, held. | Keep choice objective; expand to multi-constraint decision record with source access/identity/write/embedding trade-offs; audit MCP and connector claims; add real configuration evidence. |
| **BLD-101** / Planned | 7 screens, 5 items, 2 SVGs; local ZIP despite tracker Planned. | Replace extensibility catalog with architecture/mechanism and identity-boundary examples, scoped option memo and current API availability check. |
| **BLD-102** / Refresh needed | 10 screens, 5 items, 3 SVGs; local ZIP, held. | Source audit for fast-moving MCP/tool support; depict native/live/indexed distinctions and approval/denied execution; stronger case choice and actual UI captures. |
| **BLD-103** / Planned | 9 screens, 5 items, 3 SVGs; local ZIP. | Tracker calls this a 1.5-hour workshop; ship runnable action/MCP fixtures, auth, negative tests, safe write and handoff, with MCQ only formative. |
| **BLD-104** / Refresh needed | 10 screens, 5 items, 3 SVGs; 2.0-hour *Lab* tracker target. | Replace recognition quiz with advanced build, mixed trigger/mode/permissions/branch/failure test and SME sign-off; rectify old-deck vs current Agent docs. |
| **BLD-207** / Planned | 10 screens, 5 items, 3 SVGs; local blueprint says `assessment_type: Lab`, but authored assessment is five single-select items. | Add reproducible evaluation fixtures, golden set, regression evidence, reviewer rubric and honest tooling claims; current state is not a completed lab. |
| **BLD-208** / Planned | 9 screens, 5 items, 3 SVGs; local ZIP. | Add threat-model and launch approval practical, permissions/tool/action boundaries, real settings and unsafe case; core governance proof cannot be recall-only. |
| **SOL-203** / Planned | 9 screens, 5 items, 3 SVGs; local ZIP built before its local prerequisite SOL-202 exists. | Verify vertical patterns/sector rights and Agent behaviors; replace generic use-case cards with a field-ready blueprint, negative access test and vertical SME review; reconcile dependency. |
| **SRV-204** / Ready for LMS | 9 screens, 5 items, 3 SVGs; local ZIP held, tracker Ready for LMS; local SME recommendation names Katya Alfaro. | Tracker describes advanced debugging lab: add real trace diagnosis, fault injection, repair verification and escalation packet; obtain current product trace and support guidance. |
| **ACC-104** / Planned | 10 screens, 5 items, 3 SVGs; authored rubric explicitly calls items *single-select*. Local lesson focuses on official Agent Building Competency requirements. | Redesign as Builder-wide implementation capstone **or** relabel/retire this scope by owner decision; current content cannot demonstrate actions, agents and connectors. Separate official competency prep and Agents capstone. |

**Package provenance:** for these 11, current ZIP sidecar SHA matches ZIP, but both `plan/status.json` and the corresponding `qa/report.json` package SHA disagree with the present bytes. That may reflect later package regeneration; it does **not** establish corruption. It does invalidate using the older QA record as evidence for the current ZIP. Re-run and bind all gates to the exact package SHA after source/visual refresh.

## B. Five locally packaged courses not in the tracker

| Local ID | File-level evidence | Decision and repair |
|---|---|---|
| **AGT-101** | 12 scroll bands, 6 items, 22 local SVGs (mostly icons), 12 sources in ledger; real-browser QA reported, but recorded reproducibility SHA differs from current ZIP. | Candidate agent foundation. Get owner approval for roadmap/badge placement, reconcile FND-104/105 overlap, deepen real UI and applied task, re-run QA against current SHA, finish SME/LMS/screen-reader checks. |
| **MEM-101** | 12-band target in module YAML, 6 items, 3 SVGs, 5 sources; status says built with gates pending; not in tracker or badge. | Confirm current product availability/privacy, update capture/claim ledger, complete QA and decide elective placement. Do not imply universal or cross-surface behavior from a slide alone. |
| **OPS-107** | 14 screens, 6 items, 4 SVGs; package exists but `qa/report.json` absent. | Confirm support entitlement/escalation with owner, add real redacted portal captures and table-top practice, create independent QA report and decide badge elective. |
| **OPS-108** | 11 screens, 5 items, 3 SVGs; package exists but `qa/report.json` absent. | Verify community guidelines and support/community boundary, add real community captures and privacy-safe posting task, QA and decide optional placement. |
| **accred-agents** | 7 screens, 5 items, 3 SVGs; composed badge overview ZIP and a YAML definition, not a tracker row. | Separate navigation/official competency readiness from actual capstone; revise after membership/ACC-104 decision. Status and QA package SHA do not match current ZIP. No external competency award from overview. |

## C. Six tracker In-development rows, including inaccessible local source

| ID | Local source? | First required contract before authoring |
|---|---|---|
| FND-104, FND-105 | Yes, packaged drafts. | Claim-by-claim content audit against current docs and AGT-101, then deep refresh. |
| TEC-102 | No. | Retrieve the tracker-mapped architecture/security SCORM and associated source, capture QA/rights/version; compare to Protect+ and current security docs. |
| SRV-203 | No. | Retrieve current managed-support model assets and any in-progress source; validate contractual support scope and owner. |
| SRV-205 | No. | Retrieve technical delivery SCORM, source and test environment; compare customer-hosted variants and current delivery method. |
| OPS-103 | No. | Retrieve support operating model source; resolve the exact relationship to local OPS-107/108 and published Support Center policy. |

## D. Mapped existing assets that must be acquired, not guessed

- **Ready for LMS but no local course source (seven):** FND-101, SAL-103, SRV-101, SRV-102, SRV-103, SRV-201, SRV-202. Fetch their real LMS/SCORM/deck/transcript, source author, version and last update. Run the depth rubric before any `qa_only`/`repackage` job. If the content remains superficial, change request type to `deep_refresh` with stable-ID mapping and explicit reapproval.
- **Refresh needed but no local course source (eight):** FND-102, FND-103, FND-106, SAL-101, SAL-102, TEC-101, BLD-201, SOL-101. Retrieve old assets for coverage/gap analysis; current docs and SMEs govern new behavior. Do not count deck availability as completed SCORM.
- **Planned and no local source (52)** plus **TEC-107 Not Planned:** per-ID build tasks are in volumes 01–05; owner decides Azure before any TEC-107 build. Six other Planned IDs already have local drafts; do not build duplicate paths.

## E. Accreditation audit in one glance

| Badge definition | Local required modules present | Blocking interpretation |
|---|---:|---|
| Foundations | 0/4 | All mapped assets must be obtained/audited; FND-107 new. |
| Seller / Seller Advanced | 0/5 | Separate 101 from 201; ACC-101 scope vs prerequisites. |
| Technical Advisor | 0/6 | Integrated solution performance and SOL-204 prior learning. |
| Builder | 5/7 | BLD-201/202 absent; ACC-104 wrongly agent-only. |
| Solution Architect | 0/7 | TEC-203 prerequisite vs badge membership; full architecture case. |
| Delivery Lead | 0/7 | SRV-205 prerequisite vs badge membership; many external ready assets unverified. |
| Support & Adoption | 0/6 | OPS-106 prerequisite vs badge membership; OPS-107/108 outside tracker. |
| Industry Specialist | 1/2 fixed + 0/2 electives | SOL-203 local only; define elective rule and transfer capstone. |
| Agents (composed) | 11/11 | All local sources present does not equal release or validated competency; AGT-101 missing from path, ACC-104 scope conflict. |

**Release proof not found here:** no live LMS import/learner completion, independent assessment or official competency validation was verified in this audit. This is a limit of the examined repository and Glean source results, not a claim that none exists in other systems.
