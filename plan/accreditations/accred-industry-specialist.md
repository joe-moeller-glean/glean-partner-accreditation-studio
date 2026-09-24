# Industry Specialist — accreditation plan

| Field | Value |
|---|---|
| Source directory | `accreditations/accred-industry-specialist/` |
| Primary audience | Industry Principals |
| Core focus | — |
| Capstone / assessment | Quiz |
| Required modules (tracker) | SOL-202, SOL-203 plus 2+ IND modules |
| Mapped competency | AI Strategy & Use Case Discovery (201) |

**Learner promise:** An industry principal can position Glean against a vertical's real workflows, stakeholders, and constraints.

**Badge gate:** Tracker states 'SOL-202, SOL-203 plus 2+ IND modules' - the flexible requirement needs a human ruling before the badge can be evaluated programmatically.

## Required modules

| Module | Title | Level | Hrs | Wave | Priority | Status → request | Asset state | Plan |
|---|---|---|---|---|---|---|---|---|
| `SOL-202` | Industry Solution Design Patterns | 200 | 1.0 | Wave 3 | High | Planned → `single` | Partial asset | [SOL-202.md](../modules/SOL-202.md) |
| `SOL-203` | Vertical Agent Use Case Design | 200 | 1.3 | Wave 3 | High | Planned → `single` | Partial asset | [SOL-203.md](../modules/SOL-203.md) |
| _2+ IND modules_ | (flexible requirement stated in the tracker) | — | — | — | — | — | — | — |

**Total authored runtime:** 2.3 h across 2 modules plus the flexible requirement.

**Waves spanned:** Wave 3. The badge cannot be announced before the last module in Wave 3 is released.

## Sequence within this badge

1. `SOL-202` (queue #64) — prerequisites: SOL-101
2. `SOL-203` (queue #69) — prerequisites: SOL-202

## Risks and open decisions

- **Open decision: does the badge require named IND modules or any 2+?** This blocks badge-completion logic.
- SOL-202 unblocks all seven IND modules - it is the single point of failure for this path.
- Every IND module's source is the 'Glean for [VERTICALS]' placeholder with no asset detail.
- Regulatory overclaim is the dominant risk: IND-102 (healthcare) and IND-106 (public sector) need named compliance SMEs.
- IND-201 is a 300-level capstone lab requiring a live environment.

## Badge-completion definition of done

- Every required module released with all gates passed (no open warnings, no expired waivers).
- Capstone assessment calibrated: no item with a live pass rate below 30% or above 95%.
- Path map shows a complete unlocked route with correct prerequisite edges.
- Badge artwork placed from `shared/assets/badges/` (never generated per module).
- Announcement drafted by the Release Manager only after the final module's release returns a successful write.
- Ledger entry recorded for the badge closure, including which modules and versions constitute it.

