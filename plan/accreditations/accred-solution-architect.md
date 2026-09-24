# Solution Architect — accreditation plan

| Field | Value |
|---|---|
| Source directory | `accreditations/accred-solution-architect/` |
| Primary audience | Architects, Developers |
| Core focus | — |
| Capstone / assessment | Quiz |
| Required modules (tracker) | TEC-101, TEC-102, TEC-103, TEC-104, TEC-105, TEC-201, ACC-103 |
| Mapped competency | Advanced Networking & Configuration (301), Platform Deployment & Governance (201), AI Gateway (201) |

**Learner promise:** An architect can scope, design, secure, and de-risk a deployment, and defend the design under review.

**Badge gate:** Requires ACC-103 (exam + design review). Tracker prerequisite TEC-203 is Wave 2, so the badge cannot close in Wave 1.

## Required modules

| Module | Title | Level | Hrs | Wave | Priority | Status → request | Asset state | Plan |
|---|---|---|---|---|---|---|---|---|
| `TEC-101` | Technical Deep Dive | 100 | 1.5 | Wave 1 | Critical | Refresh needed → `refresh` | Existing asset | [TEC-101.md](../modules/TEC-101.md) |
| `TEC-102` | Security Architecture & Protect+ | 100 | 1.0 | Wave 1 | Critical | In development → `single` | Partial asset | [TEC-102.md](../modules/TEC-102.md) |
| `TEC-103` | Identity & Security Architecture | 100 | 1.0 | Wave 1 | High | Planned → `single` | No asset | [TEC-103.md](../modules/TEC-103.md) |
| `TEC-104` | Networking Guidance | 100 | 1.0 | Wave 1 | High | Planned → `single` | No asset | [TEC-104.md](../modules/TEC-104.md) |
| `TEC-105` | Environment Strategy | 100 | 0.8 | Wave 1 | High | Planned → `single` | No asset | [TEC-105.md](../modules/TEC-105.md) |
| `TEC-201` | Connector Deployment Prerequisites | 200 | 0.8 | Wave 2 | High | Planned → `single` | No asset | [TEC-201.md](../modules/TEC-201.md) |
| `ACC-103` | Technical Architect Accreditation | 200 | 1.0 | Wave 2 | High | Planned → `single` | No asset | [ACC-103.md](../modules/ACC-103.md) |

**Total authored runtime:** 7.1 h across 7 modules.

**Waves spanned:** Wave 1, Wave 2. The badge cannot be announced before the last module in Wave 2 is released.

## Sequence within this badge

1. `TEC-101` (queue #6) — prerequisites: FND-103
2. `TEC-102` (queue #10) — prerequisites: TEC-101
3. `TEC-103` (queue #17) — prerequisites: TEC-101
4. `TEC-104` (queue #18) — prerequisites: TEC-101
5. `TEC-105` (queue #19) — prerequisites: TEC-101
6. `TEC-201` (queue #27) — prerequisites: TEC-101
7. `ACC-103` (queue #31) — prerequisites: TEC-203

## Risks and open decisions

- TEC-101's control-plane and connector-count conflicts block ACC-103 item writing.
- TEC-102 is the highest-consequence factual module in the portfolio (security posture, 90-day window).
- TEC-103/104/105/201 are all `Content Requests` with no asset - four net-new builds from product docs.
- TEC-101 and TEC-102 sources are NDA-marked; confirm what may ship in a partner-facing package.

## Badge-completion definition of done

- Every required module released with all gates passed (no open warnings, no expired waivers).
- Capstone assessment calibrated: no item with a live pass rate below 30% or above 95%.
- Path map shows a complete unlocked route with correct prerequisite edges.
- Badge artwork placed from `shared/assets/badges/` (never generated per module).
- Announcement drafted by the Release Manager only after the final module's release returns a successful write.
- Ledger entry recorded for the badge closure, including which modules and versions constitute it.

