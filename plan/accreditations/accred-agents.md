# Agents — accreditation plan

| Field | Value |
|---|---|
| Source directory | `accreditations/accred-agents/` |
| Module sources | `modules/<id>/` for all 11 required modules |
| Primary audience | Builders; Solution advisors; Architects; Technical consultants |
| Core focus | Design, build, govern, evaluate, and debug production Glean Agents |
| Capstone / assessment | ACC-104 Builder Accreditation (capstone lab) |
| Required modules | FND-104, FND-105, BLD-101, BLD-102, BLD-103, BLD-104, SRV-204, BLD-207, BLD-208, SOL-203, ACC-104 |
| Mapped competency | Agent Building Competency (201) |
| Authored runtime | 12.7 h across 11 modules |
| Build state | All 11 modules + badge container built at v1.0.0, gates green, held for human review |

**Learner promise:** A partner team can place agents in the Glean operating model, choose the right primitive, build multi-step agents with guardrails and fallbacks, evaluate and govern them, debug them under load, design vertical use cases, and assemble a competency submission that passes review.

**Badge gate:** Requires ACC-104. The badge cannot be announced until every module in Wave 3 is released.

**Provenance note:** This badge is **not** in the tracker's accreditation table. It was composed on 2026-09-02 from the tracker's agent-scoped modules and aligned to the Agent Building Competency defined in the [Glean Partner Competency Program Guide](https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w). Adding it to the tracker is a human decision that has not been made.

## Required modules

| # | Module | Title | Level | Hrs | Wave | Prereq | Screens | Items | Claims | Package |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `FND-104` | AI Search, Assistants & Agents Operating Model | 200 | 0.8 | Wave 1 | FND-103 | 9 | 5 | 13 | `FND-104-v1.0.0-scorm12.zip` |
| 2 | `FND-105` | Choosing the Right Construct / Primitive | 200 | 0.8 | Wave 1 | FND-104 | 9 | 5 | 13 | `FND-105-v1.0.0-scorm12.zip` |
| 3 | `BLD-101` | Building with Glean | 100 | 0.5 | Wave 1 | TEC-101 | 7 | 5 | 7 | `BLD-101-v1.0.0-scorm12.zip` |
| 4 | `BLD-102` | Actions & MCP Fundamentals | 100 | 1.0 | Wave 1 | BLD-101 | 10 | 5 | 15 | `BLD-102-v1.0.0-scorm12.zip` |
| 5 | `BLD-103` | Actions & MCP Workshop | 100 | 1.5 | Wave 1 | BLD-102 | 9 | 5 | 9 | `BLD-103-v1.0.0-scorm12.zip` |
| 6 | `BLD-104` | Advanced Agent Building Lab | 200 | 2.0 | Wave 1 | BLD-101 | 10 | 5 | 16 | `BLD-104-v1.0.0-scorm12.zip` |
| 7 | `SRV-204` | Advanced Agent Debugging | 300 | 1.0 | Wave 2 | BLD-104 | 9 | 5 | 18 | `SRV-204-v1.0.0-scorm12.zip` |
| 8 | `BLD-207` | Agent Evaluation, Testing & QA | 300 | 1.3 | Wave 3 | BLD-104 | 10 | 5 | 12 | `BLD-207-v1.0.0-scorm12.zip` |
| 9 | `BLD-208` | Agent Governance & Safety | 300 | 1.0 | Wave 3 | BLD-104 | 9 | 5 | 13 | `BLD-208-v1.0.0-scorm12.zip` |
| 10 | `SOL-203` | Vertical Agent Use Case Design | 200 | 1.3 | Wave 3 | SOL-202 | 9 | 5 | 9 | `SOL-203-v1.0.0-scorm12.zip` |
| 11 | `ACC-104` | Builder Accreditation | 300 | 1.5 | Wave 3 | BLD-208 | 10 | 5 | 24 | `ACC-104-v1.0.0-scorm12.zip` |

## Sequence and rationale

1. `FND-104` — Places search, assistant, and agents in one operating model before any build vocabulary is introduced.
2. `FND-105` — Turns that model into a defensible native-first decision rule.
3. `BLD-101` — Inventories the full partner build surface so scope conversations stop defaulting to agents.
4. `BLD-102` — Fixes precise definitions of actions, MCP, and skills, including the real Agent Builder constraints.
5. `BLD-103` — Hands-on: build a custom action and connect a remote MCP server.
6. `BLD-104` — Composition, memory scope, model right-sizing, branching, loops, and triggers.
7. `SRV-204` — Trace-driven debugging and the five-category failure taxonomy. Wave 2, so it lands before the Wave 3 modules.
8. `BLD-207` — Makes agent quality measurable and prevents regressions.
9. `BLD-208` — Approval boundaries, escalation design, and the evidence a review expects.
10. `SOL-203` — Vertical discovery, prioritisation, and a buildable design specification.
11. `ACC-104` — Capstone: audit the portfolio against every competency requirement and assemble the submission.

## Waves spanned

Wave 1 (six modules), Wave 2 (SRV-204), Wave 3 (BLD-207, BLD-208, SOL-203, ACC-104). The learner-visible path is announced only when ACC-104 is released.

## Source ledger

| ID | Source | Owner | Updated | Tier | Re-verify by |
|---|---|---|---|---|---|
| `S-01` | [Glean Partner Competency Program Guide](https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w) | Joe Moeller | 2026-08-05 | 1 | 2026-12-01 |
| `S-02` | [Partner Enablement: Glean Agent Building - plan, launch, deploy, measure](https://drive.google.com/file/d/1oVhmo3s6sEFQ9b2DEl25poStQY6j7iHR) | Katya Alfaro | 2026-02-09 | 1 | 2026-12-01 |
| `S-03` | [Partner Enablement Deck: MCP, Custom Actions, and Skills](https://docs.google.com/document/d/1ZguIOERISj653MsmeHZzrqMIpmoMGAegGKkgNteIDeA) | Joe Moeller | 2026-04-13 | 1 | 2026-11-01 |
| `S-04` | [Advanced Agent Debugging for Glean Partners](https://drive.google.com/file/d/1C6NRtjfCa88F0SKeT04XJuloOr16ijih) | Katya Alfaro | 2026-02-11 | 1 | 2026-12-01 |
| `S-05` | [Partner Accreditation & Competency Roadmap - Module Tracker](https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q) | Joe Moeller | 2026-08-13 | 1 | 2026-10-01 |
| `S-06` | [Partner Enablement Content Library](https://docs.google.com/spreadsheets/d/1lDz14hUsXJA93IpQcOd-TD2D48J4AUpBke2esP27Fwo) | Joe Moeller | 2026-06-26 | 2 | 2026-11-01 |
| `S-07` | [Partner Enablement Journey - 2026](https://docs.google.com/presentation/d/1DS-qtII_ERaaJ2eN_-lcItG_UxJt6keKvcHPdGG-V24) | Katya Alfaro | 2026-06-25 | 2 | 2026-11-01 |
| `S-08` | [[EXT] Glean Partner Program Guide 2026](https://docs.google.com/presentation/d/1EYNjy-_BHPG6SgmwsBdriK2BF_KW7wzCKm0JR3y2OFk) | Matt Schenck | 2026-08-12 | 2 | 2026-11-01 |

112 claims are defined in the shared claim library; every learner-facing fact in all 12 packages resolves to one.

## Gate results

| Module | Lint | SCORM validate | Runtime QA | Bytes | SHA-256 (first 12) |
|---|---|---|---|---|---|
| `FND-104` | pass | pass | pass | 13533 | `efb500531b3f` |
| `FND-105` | pass | pass | pass | 14168 | `f55ee26bfbb3` |
| `BLD-101` | pass | pass | pass | 11761 | `9944442bce93` |
| `BLD-102` | pass | pass | pass | 13349 | `5757be40bc68` |
| `BLD-103` | pass | pass | pass | 13231 | `20a51499a00c` |
| `BLD-104` | pass | pass | pass | 13848 | `f80991a2819f` |
| `SRV-204` | pass | pass | pass | 14011 | `50a8c5e0e4af` |
| `BLD-207` | pass | pass | pass | 13752 | `85521767c1d3` |
| `BLD-208` | pass | pass | pass | 13433 | `7078c420a33f` |
| `SOL-203` | pass | pass | pass | 13490 | `c8f31cf5ea1e` |
| `ACC-104` | pass | pass | pass | 13473 | `d2d529e633f6` |
| `accred-agents` | pass | pass | pass | 13078 | `d42351eed8b5` |

## Reproducibility

Two full regenerate-and-repackage cycles produce byte-identical archives with matching SHA-256 values. This required a fix: the studio build script embeds filesystem mtimes and a fresh manifest timestamp, so `tools/agents/package.py` pins staged mtimes and rewrites each archive with one fixed stamp.

## Open items before publication

- **Glean wordmark asset not placed.** The brand system forbids generating the logo, and no approved file exists in `shared/assets/`. The header currently renders a text wordmark. Drop the approved SVG into `shared/assets/` and swap the header before release.
- **No SME sign-off.** BLD-104 is owned by David Seeber and SRV-204 by Katya Alfaro in the tracker; neither has reviewed this content.
- **No LMS import test.** Packages validate structurally and the runtime was exercised against a DOM shim, but no real LMS import has been performed.
- **Badge not in the tracker.** Adding `Agents` to the roadmap's accreditation table is a human decision.
- **Assessment calibration pending.** Items need live pass-rate review after 30 completions; flag anything below 30% or above 95%.

## Badge-completion definition of done

- Every required module released with all gates passed and no expired waivers.
- Capstone calibrated against live pass rates.
- Path map shows a complete unlocked route with correct prerequisite edges.
- Badge artwork placed from `shared/assets/badges/`.
- Ledger entry recorded for badge closure, naming the modules and versions that constitute it.
