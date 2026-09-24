# Support & Adoption — accreditation plan

| Field | Value |
|---|---|
| Source directory | `accreditations/accred-support-adoption/` |
| Primary audience | Admins; support leads |
| Core focus | — |
| Capstone / assessment | Quiz |
| Required modules (tracker) | OPS-101, OPS-102, OPS-103, OPS-104, OPS-105, ACC-106 |
| Mapped competency | Managed Services (201) |

**Learner promise:** A partner can run admin operations, support tiers, incident triage, release readiness, and governance evidence.

**Badge gate:** Requires ACC-106. Tracker prerequisite OPS-106 is Wave 3 - this is the last badge in the portfolio to close.

## Required modules

| Module | Title | Level | Hrs | Wave | Priority | Status → request | Asset state | Plan |
|---|---|---|---|---|---|---|---|---|
| `OPS-101` | Admin & Platform Operations Runbooks | 100 | 0.8 | Wave 2 | High | Planned → `single` | No asset | [OPS-101.md](../modules/OPS-101.md) |
| `OPS-102` | Cloud Operational Runbooks | 100 | 0.8 | Wave 2 | High | Planned → `single` | No asset | [OPS-102.md](../modules/OPS-102.md) |
| `OPS-103` | Support Operating Model | 100 | 1.0 | Wave 2 | Critical | In development → `single` | Partial asset | [OPS-103.md](../modules/OPS-103.md) |
| `OPS-104` | Incident Triage & Escalation | 200 | 1.0 | Wave 3 | High | Planned → `single` | No asset | [OPS-104.md](../modules/OPS-104.md) |
| `OPS-105` | Quarterly Release Readiness | 200 | 0.8 | Wave 3 | Medium | Planned → `single` | No asset | [OPS-105.md](../modules/OPS-105.md) |
| `ACC-106` | Support & Adoption Accreditation | 200 | 1.0 | Wave 3 | Medium | Planned → `single` | No asset | [ACC-106.md](../modules/ACC-106.md) |

**Total authored runtime:** 5.4 h across 6 modules.

**Waves spanned:** Wave 2, Wave 3. The badge cannot be announced before the last module in Wave 3 is released.

## Sequence within this badge

1. `OPS-101` (queue #38) — prerequisites: SRV-103
2. `OPS-102` (queue #39) — prerequisites: SRV-103
3. `ACC-106` (queue #49) — prerequisites: OPS-106
4. `OPS-105` (queue #50) — prerequisites: OPS-101
5. `OPS-103` (queue #56) — prerequisites: SRV-203
6. `OPS-104` (queue #72) — prerequisites: OPS-103

## Risks and open decisions

- Five of six required modules have no asset (Content Requests or Proposed expansion).
- OPS-103 is Critical and `In development` with two sources to reconcile.
- OPS-106 overstating audit capability is the single highest trust risk in this badge.
- Diagnostic and log captures across OPS-102/104 and ACC-106 carry PII risk; redaction is a release gate.

## Badge-completion definition of done

- Every required module released with all gates passed (no open warnings, no expired waivers).
- Capstone assessment calibrated: no item with a live pass rate below 30% or above 95%.
- Path map shows a complete unlocked route with correct prerequisite edges.
- Badge artwork placed from `shared/assets/badges/` (never generated per module).
- Announcement drafted by the Release Manager only after the final module's release returns a successful write.
- Ledger entry recorded for the badge closure, including which modules and versions constitute it.

