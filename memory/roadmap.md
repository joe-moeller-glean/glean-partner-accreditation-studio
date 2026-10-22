# Partner Accreditation & Competency Roadmap — project memory

## Source of record

- **Workbook:** [Partner Accreditation & Competency Roadmap](https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q/edit?usp=sharing)
- **Retrieved:** 2026-09-03
- **Workbook update time reported by Glean:** 2026-08-13T16:09:53Z
- **Snapshot in this workspace:** `plan/roadmap-export/`
- **Snapshot summary:** 6 tabs; 83 Module Tracker rows; 8 badge/accreditation rows; 55 source rows; 10 competency rows; 7 lifecycle/path rows.

Re-read the source workbook before making new portfolio or release decisions if its update time has changed. The exported row-level data is the working snapshot, not a substitute for freshness verification.

## Program shape

| Lifecycle phase | Accreditation path | Initial module count | Launch wave focus |
|---|---|---:|---|
| Architect | Foundations | 7 | Wave 1 |
| Sales & GTM | Sales & GTM | 8 | Wave 1–2 |
| Solutions & Value | Solutions & Value | 7 | Wave 1–2 |
| Deploy | Technical & Architecture | 11 | Wave 1–2 |
| Activate | Builders & Integrations | 12 | Wave 1–3 |
| Deploy | Service Delivery | 0 | Wave 1–2 |
| Activate | Operations & Support | 6 | Wave 2–3 |

The roadmap’s competency themes are: **AI Value Selling**, **AI Strategy & Use Case Discovery**, **Advanced Networking & Configuration**, **AI Gateway**, **Delivery Excellence**, **Platform Deployment & Governance**, **Agent Building**, **Custom Connector**, **Embedded Experiences**, and **Managed Services**. Levels span 101, 201, and 301; statuses are New or Existing.

## Badge / accreditation map

- **Glean Foundations:** FND-101, FND-102, FND-103, FND-107
- **Seller / Seller Advanced:** SAL-101, SAL-102, SAL-103, SAL-203, ACC-101
- **Technical Advisor:** SOL-101, SOL-102, SOL-103, SOL-201, SOL-204, ACC-102
- **Builder:** BLD-101, BLD-102, BLD-103, BLD-104, BLD-201, BLD-202, ACC-104
- **Solution Architect:** TEC-101, TEC-102, TEC-103, TEC-104, TEC-105, TEC-201, ACC-103
- **Delivery Lead:** SRV-101, SRV-102, SRV-103, SRV-104, SRV-201, SRV-202, ACC-105
- **Support & Adoption:** OPS-101, OPS-102, OPS-103, OPS-104, OPS-105, ACC-106
- **Industry Specialist:** SOL-202, SOL-203, plus 2 or more IND modules

The project also contains an **Agents** accreditation composition in `plan/accreditations.json`. It was added on 2026-09-02 from agent-scoped tracker modules and a separate competency guide; it is not present in the roadmap’s native badge table. Treat it as a project composition, not as a roadmap-native badge, unless explicitly confirmed.

## Planning and writeback rules

- `Module ID` is the canonical module identifier and repository key.
- `Academy`, `Learning Path`, and `Badge / Path` define grouping and path design.
- `Prerequisites` and `Dependency` define the dependency DAG; refuse cycles.
- `Priority` and `Program Wave` drive queue ordering after dependencies are respected.
- `Build Status` maps to work: `Ready for LMS` → `verify`; `Refresh needed` → `update_module`; `In development` → continue the existing module (`create_module`); `Planned` → net-new `create_module`; blank/unknown → triage.
- `Primary Audience`, `Partner Types`, `Delivery Format`, `Duration Hours`, and `Assessment` are hard intake and architecture constraints.
- `Mapped Existing Assets`, `Source Basis`, and `Existing Asset Status` determine reuse versus rebuild and the initial research set.
- `Current Owner`, `Recommended SME`, and `Notes` are escalation and scope signals.
- Never mark a module released in the workbook until a successful publish result exists. If the sheet is not writable, report the exact writeback values instead.

## Workspace pointers

- Full extracted tabs: `plan/roadmap-export/`
- Ordered module queue: `plan/queue.json` (83 jobs)
- Dependency graph: `plan/dependency-graph.json`
- Badge mappings: `learning/accreditations/<id>/accreditation.yaml` (tracker snapshot: `plan/accreditations.json`)
- Module sources: `learning/modules/<id>/`
- Per-module plans: `plan/modules/`
- Existing portfolio/build status: `plan/status.json`

## Recall instruction

Before any roadmap, batch, or module-planning run, load this note plus the applicable module brief and current ledger entries. Use the live workbook for freshness and the workspace exports for deterministic row-level planning.
