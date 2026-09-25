# Glean Foundations — accreditation plan

| Field | Value |
|---|---|
| Definition | `learning/accreditations/accred-foundations/accreditation.yaml` |
| Module sources | `learning/modules/<id>/` |
| Primary audience | All partner personas |
| Core focus | A base understand of what the Glean platform is |
| Capstone / assessment | Quiz |
| Required modules (tracker) | FND-101, FND-102, FND-103, FND-107 |
| Mapped competency | No named competency in the roadmap's competency tab - this is the prerequisite layer beneath all of them. |

**Learner promise:** Every partner, regardless of role, can explain what the platform is and navigate their own path.

**Badge gate:** Closes first (all four modules are Wave 1). This badge gates learner confidence in every other path.

## Required modules

| Module | Title | Level | Hrs | Wave | Priority | Status → request | Asset state | Plan |
|---|---|---|---|---|---|---|---|---|
| `FND-101` | Partner Program Overview | 100 | 0.5 | Wave 1 | Critical | Ready for LMS → `qa_only` | Existing asset | [FND-101.md](../modules/FND-101.md) |
| `FND-102` | Partner Enablement Journey & LMS Orientation | 100 | 0.5 | Wave 1 | Critical | Refresh needed → `refresh` | Existing asset | [FND-102.md](../modules/FND-102.md) |
| `FND-103` | Glean Platform Overview & Demo | 100 | 1.0 | Wave 1 | Critical | Refresh needed → `refresh` | Existing asset | [FND-103.md](../modules/FND-103.md) |
| `FND-107` | Accreditation Orientation & Exam Prep | 100 | 0.5 | Wave 1 | Medium | Planned → `single` | No asset | [FND-107.md](../modules/FND-107.md) |

**Total authored runtime:** 2.5 h across 4 modules.

**Waves spanned:** Wave 1. The badge cannot be announced before the last module in Wave 1 is released.

## Sequence within this badge

1. `FND-101` (queue #1) — prerequisites: none
2. `FND-102` (queue #2) — prerequisites: FND-101
3. `FND-103` (queue #3) — prerequisites: FND-101
4. `FND-107` (queue #22) — prerequisites: FND-102

## Risks and open decisions

- FND-107 is `Proposed expansion` with no asset and Medium priority - it is the long pole for a Critical badge.
- FND-103 carries two unresolved source conflicts (connector count, control plane).
- FND-102 must reflect the 2026 journey, not the superseded 2025 deck.

## Badge-completion definition of done

- Every required module released with all gates passed (no open warnings, no expired waivers).
- Capstone assessment calibrated: no item with a live pass rate below 30% or above 95%.
- Path map shows a complete unlocked route with correct prerequisite edges.
- Badge artwork placed from `shared/assets/badges/` (never generated per module).
- Announcement drafted by the Release Manager only after the final module's release returns a successful write.
- Ledger entry recorded for the badge closure, including which modules and versions constitute it.

