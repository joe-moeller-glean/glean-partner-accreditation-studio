# Builder — accreditation plan

| Field | Value |
|---|---|
| Source directory | `accreditations/accred-builder/` |
| Primary audience | Builders, Developers |
| Core focus | — |
| Capstone / assessment | Quiz |
| Required modules (tracker) | BLD-101, BLD-102, BLD-103, BLD-104, BLD-201, BLD-202, ACC-104 |
| Mapped competency | Agent Building (201), Custom Connector (301), Embedded Experiences (301) |

**Learner promise:** A builder can implement agents, actions, and connectors that work, are tested, and are governed.

**Badge gate:** Requires ACC-104, a capstone lab with a verifiable end state. Needs a live lab environment.

## Required modules

| Module | Title | Level | Hrs | Wave | Priority | Status → request | Asset state | Plan |
|---|---|---|---|---|---|---|---|---|
| `BLD-101` | Building with Glean | 100 | 0.5 | Wave 1 | High | Planned → `single` | Existing asset | [BLD-101.md](../modules/BLD-101.md) |
| `BLD-102` | Actions & MCP Fundamentals | 100 | 1.0 | Wave 1 | High | Refresh needed → `refresh` | Existing asset | [BLD-102.md](../modules/BLD-102.md) |
| `BLD-103` | Actions & MCP Workshop | 100 | 1.5 | Wave 1 | Critical | Planned → `single` | No asset | [BLD-103.md](../modules/BLD-103.md) |
| `BLD-104` | Advanced Agent Building Lab | 200 | 2.0 | Wave 1 | Critical | Refresh needed → `refresh` | Existing asset | [BLD-104.md](../modules/BLD-104.md) |
| `BLD-201` | Custom Connector Best Practices | 200 | 1.5 | Wave 2 | High | Refresh needed → `refresh` | Existing asset | [BLD-201.md](../modules/BLD-201.md) |
| `BLD-202` | Custom Connector Implementation Lab | 200 | 2.5 | Wave 2 | Critical | Planned → `single` | No asset | [BLD-202.md](../modules/BLD-202.md) |
| `ACC-104` | Builder Accreditation | 300 | 1.5 | Wave 3 | High | Planned → `single` | No asset | [ACC-104.md](../modules/ACC-104.md) |

**Total authored runtime:** 10.5 h across 7 modules.

**Waves spanned:** Wave 1, Wave 2, Wave 3. The badge cannot be announced before the last module in Wave 3 is released.

## Sequence within this badge

1. `BLD-101` (queue #14) — prerequisites: TEC-101
2. `BLD-102` (queue #20) — prerequisites: BLD-101
3. `BLD-201` (queue #32) — prerequisites: TEC-201
4. `BLD-104` (queue #52) — prerequisites: BLD-101
5. `BLD-103` (queue #54) — prerequisites: BLD-102
6. `BLD-202` (queue #55) — prerequisites: BLD-201
7. `ACC-104` (queue #70) — prerequisites: BLD-208

## Risks and open decisions

- Every required module needs a working lab environment - confirm availability before scheduling any of them.
- BLD-101's source is listed as TBD despite `Existing asset` status.
- BLD-102 sits in the fastest-moving product area; expect the most frequent refreshes.
- BLD-202 is the longest module in the portfolio (2.5h).

## Badge-completion definition of done

- Every required module released with all gates passed (no open warnings, no expired waivers).
- Capstone assessment calibrated: no item with a live pass rate below 30% or above 95%.
- Path map shows a complete unlocked route with correct prerequisite edges.
- Badge artwork placed from `shared/assets/badges/` (never generated per module).
- Announcement drafted by the Release Manager only after the final module's release returns a successful write.
- Ledger entry recorded for the badge closure, including which modules and versions constitute it.

