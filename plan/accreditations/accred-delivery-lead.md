# Delivery Lead — accreditation plan

| Field | Value |
|---|---|
| Definition | `learning/accreditations/accred-delivery-lead/accreditation.yaml` |
| Module sources | `learning/modules/<id>/` |
| Primary audience | PMO, Project Manager, Technical Account Manager |
| Core focus | — |
| Capstone / assessment | Quiz |
| Required modules (tracker) | SRV-101, SRV-102, SRV-103, SRV-104, SRV-201, SRV-202, ACC-105 |
| Mapped competency | Delivery Excellence (101), Platform Deployment & Governance (201) |

**Learner promise:** A delivery lead can run an implementation end to end, from kickoff through adoption, governance, and run state.

**Badge gate:** Requires ACC-105 (exam + delivery plan). Tracker prerequisite SRV-205 is `In development` in Wave 2.

## Required modules

| Module | Title | Level | Hrs | Wave | Priority | Status → request | Asset state | Plan |
|---|---|---|---|---|---|---|---|---|
| `SRV-101` | Partner Delivery Certification Process | 100 | 0.5 | Wave 1 | Critical | Ready for LMS → `qa_only` | Existing asset | [SRV-101.md](../modules/SRV-101.md) |
| `SRV-102` | Delivery Methodology | 100 | 1.0 | Wave 1 | Critical | Ready for LMS → `qa_only` | Existing asset | [SRV-102.md](../modules/SRV-102.md) |
| `SRV-103` | Platform Deployment & Growth Playbook | 100 | 0.8 | Wave 1 | Critical | Ready for LMS → `qa_only` | Existing asset | [SRV-103.md](../modules/SRV-103.md) |
| `SRV-104` | Delivery Readiness & Kickoff | 100 | 1.0 | Wave 1 | High | Planned → `single` | No asset | [SRV-104.md](../modules/SRV-104.md) |
| `SRV-201` | Training & Enablement Playbook | 200 | 0.8 | Wave 2 | High | Ready for LMS → `qa_only` | Existing asset | [SRV-201.md](../modules/SRV-201.md) |
| `SRV-202` | Platform Governance & Center of Excellence | 200 | 0.8 | Wave 2 | High | Ready for LMS → `qa_only` | Existing asset | [SRV-202.md](../modules/SRV-202.md) |
| `ACC-105` | Delivery Lead Accreditation | 200 | 1.0 | Wave 2 | High | Planned → `single` | No asset | [ACC-105.md](../modules/ACC-105.md) |

**Total authored runtime:** 5.9 h across 7 modules.

**Waves spanned:** Wave 1, Wave 2. The badge cannot be announced before the last module in Wave 2 is released.

## Sequence within this badge

1. `SRV-101` (queue #5) — prerequisites: FND-102
2. `SRV-102` (queue #9) — prerequisites: SRV-101
3. `SRV-103` (queue #11) — prerequisites: SRV-102
4. `SRV-104` (queue #21) — prerequisites: SRV-102
5. `SRV-201` (queue #35) — prerequisites: SRV-102
6. `SRV-202` (queue #36) — prerequisites: SRV-102
7. `ACC-105` (queue #42) — prerequisites: SRV-205

## Risks and open decisions

- Four of seven required modules are `qa_only` - the fastest badge to close if the existing assets hold up.
- SRV-104 is the only net-new required module.
- Katya Alfaro owns five of the seven sources - single-SME dependency risk.
- SRV-203 and OPS-103 must never present partner service commitments as Glean SLAs.

## Badge-completion definition of done

- Every required module released with all gates passed (no open warnings, no expired waivers).
- Capstone assessment calibrated: no item with a live pass rate below 30% or above 95%.
- Path map shows a complete unlocked route with correct prerequisite edges.
- Badge artwork placed from `shared/assets/badges/` (never generated per module).
- Announcement drafted by the Release Manager only after the final module's release returns a successful write.
- Ledger entry recorded for the badge closure, including which modules and versions constitute it.

