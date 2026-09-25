# Seller / Seller Advanced — accreditation plan

| Field | Value |
|---|---|
| Definition | `learning/accreditations/accred-seller-seller-advanced/accreditation.yaml` |
| Module sources | `learning/modules/<id>/` |
| Primary audience | Partner sellers |
| Core focus | — |
| Capstone / assessment | Quiz |
| Required modules (tracker) | SAL-101, SAL-102, SAL-103, SAL-203, ACC-101 |
| Mapped competency | AI Value Selling (101) |

**Learner promise:** A partner seller can position, qualify, co-sell, and defend Glean in a competitive deal.

**Badge gate:** Requires ACC-101, which blueprints across SAL-201/202/204 - modules the tracker does not list as its prerequisites.

## Required modules

| Module | Title | Level | Hrs | Wave | Priority | Status → request | Asset state | Plan |
|---|---|---|---|---|---|---|---|---|
| `SAL-101` | Co-Selling Fundamentals | 100 | 1.0 | Wave 1 | Critical | Refresh needed → `refresh` | Existing asset | [SAL-101.md](../modules/SAL-101.md) |
| `SAL-102` | Demo Excellence for Partners | 100 | 1.0 | Wave 1 | High | Refresh needed → `refresh` | Existing asset | [SAL-102.md](../modules/SAL-102.md) |
| `SAL-103` | Seller Accreditation 101 | 100 | 0.5 | Wave 1 | Critical | Ready for LMS → `qa_only` | Existing asset | [SAL-103.md](../modules/SAL-103.md) |
| `SAL-203` | Competitive Positioning & Objection Handling | 200 | 1.0 | Wave 1 | Critical | Planned → `single` | Partial asset | [SAL-203.md](../modules/SAL-203.md) |
| `ACC-101` | Seller Accreditation 201 | 200 | 1.0 | Wave 2 | High | Planned → `single` | No asset | [ACC-101.md](../modules/ACC-101.md) |

**Total authored runtime:** 4.5 h across 5 modules.

**Waves spanned:** Wave 1, Wave 2. The badge cannot be announced before the last module in Wave 2 is released.

## Sequence within this badge

1. `SAL-101` (queue #4) — prerequisites: FND-103
2. `SAL-103` (queue #7) — prerequisites: SAL-101
3. `SAL-203` (queue #8) — prerequisites: SAL-101
4. `SAL-102` (queue #16) — prerequisites: SAL-101
5. `ACC-101` (queue #30) — prerequisites: SAL-103

## Risks and open decisions

- Tracker prerequisite for ACC-101 is SAL-103 only; the exam needs SAL-201/202/203/204 content. Confirm intended gating.
- SAL-101/203/204 all depend on unresolved discount and sales-cycle rulings.
- ACC-101 requires a human observer for the role play.

## Badge-completion definition of done

- Every required module released with all gates passed (no open warnings, no expired waivers).
- Capstone assessment calibrated: no item with a live pass rate below 30% or above 95%.
- Path map shows a complete unlocked route with correct prerequisite edges.
- Badge artwork placed from `shared/assets/badges/` (never generated per module).
- Announcement drafted by the Release Manager only after the final module's release returns a successful write.
- Ledger entry recorded for the badge closure, including which modules and versions constitute it.

