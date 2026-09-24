# Source ledger — verified assets, conflicts, and gaps

Retrieved via Glean enterprise search on 2026-09-01. Authority tiers per
`references/agents/03-researcher.md`: (1) product code/docs, (2) official Glean site/brand/policy,
(3) owner-maintained internal system-of-record, (4) meetings/Slack — corroboration only.

## 1. Verified sources with URLs

| source_id | Title | URL | Owner | Updated | Tier | Feeds |
|---|---|---|---|---|---|---|
| `SRC-LIB-001` | Partner Enablement Content Library (registry of record) | https://docs.google.com/spreadsheets/d/1lDz14hUsXJA93IpQcOd-TD2D48J4AUpBke2esP27Fwo | Joe Moeller | 2026-06-26 | 3 | All modules (asset resolution) |
| `SRC-PRG-001` | Channel Partner Program Overview Deck | https://docs.google.com/presentation/d/1800eQJl2E1xP29bhdXTQ08ke-WS2gMVUgQ9_Jx883cM | aaron.trockman | 2026-05-14 | 3 | FND-101, SAL-204 |
| `SRC-JRN-002` | Partner Enablement Journey — 2026 | https://docs.google.com/presentation/d/1DS-qtII_ERaaJ2eN_-lcItG_UxJt6keKvcHPdGG-V24 | katya.alfaro | 2026-06-25 | 3 | FND-102, FND-107 |
| `SRC-JRN-001` | [OLD] Partner Enablement Journey — 2025 — **superseded_by SRC-JRN-002** | https://docs.google.com/presentation/d/1r3YyK48rUt2BLnjGQwTNEuvnTXnXkhXmYAxsDWQcxqI | — | 2025-10-01 | 3 | reference only |
| `SRC-OVW-003` | Glean Overview Partner Enablement Master Deck v3 | https://docs.google.com/presentation/d/1ujKD_VG23okATsYNVyrMMic2pHMk_aoLQF28UXemzQc | Joe Moeller | 2026-08-28 | 3 | FND-103, FND-104 |
| `SRC-OVW-001` | Glean Overview Partner Enablement Master Deck (v1 lineage) | https://docs.google.com/presentation/d/1FbV6QkEuXbeIC0yfPUse2IlOJT9tRHPsvqSQiqlGRm0 | Sam Cugini | 2026-07-23 | 3 | FND-103 (diff only) |
| `SRC-SAL-001` | [MAKE A COPY] Glean Partner Sales Deep Dive Master Deck | https://docs.google.com/presentation/d/1jCxuHWhBOJuowbnXOzHDSwPOeCGe2LvD0KHRKmBIQjU | Sam Cugini | 2026-07-15 | 3 | SAL-101, SAL-203, SAL-201 |
| `SRC-TEC-003` | Glean Technical Enablement — Deep Dive v3 | https://docs.google.com/presentation/d/1xJ9WgExstI3iVq5Dk0C3r56fH2YEyRiT-8hWBcrRwdo | Joe Moeller | 2026-08-17 | 3 | TEC-101, TEC-102, FND-103 |
| `SRC-TEC-002` | [MASTER] Glean Technical Enablement — Deep Dive v2 | https://docs.google.com/presentation/d/1Qz03LtRrFAjnT8hOailR2OrLbhoCVP4XyM7Kput7MxY | Joe Moeller | 2026-04-16 | 3 | TEC-101 (architecture detail, diff only) |
| `SRC-AGT-001` | [MASTER] Glean Hands-On Building Agents Workshop v2 | https://docs.google.com/presentation/d/1LOt0q8Efq9PedHDDDYUs0WIp8jwNsXLljowrh8f61Xw | David Seeber | 2025-12 | 3 | BLD-101, BLD-104, BLD-103 |
| `SRC-CON-001` | Glean Partner Content \| Custom Connector Best Practices | https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg | Eugene Wiehahn | 2026-06-24 | 3 | BLD-201, BLD-202, TEC-201 |
| `SRC-DEP-001` | Departmental Outcomes — Master Deck [Internal] | https://docs.google.com/presentation/d/19e9CnppSQbJXYu8ChnMeL9sMsKp7EVtOJi6NoMuyQkw | — | 2026-01-29 | 3 | SOL-101, DEP-101…DEP-108 |
| `SRC-COE-001` | Partner Enablement — Glean Platform Governance CoE Framework | https://drive.google.com/file/d/17xqdSrPMXgIBOV-_6cQlAPKtPr0tCY7h | katya.alfaro | 2026-02-10 | 3 | SRV-202, OPS-106 |

Additional Katya Alfaro post-sales playbook PDFs named in the tracker (Delivery Methodology, Realized
Outcomes, Platform Deployment & Growth, Agent & Prompt Building, Training & Enablement, Support
Optimization, Advanced Agent Debugging, Delivery Certification) are all dated 2026-02-09/10 in the
roadmap's own source tab and resolve through `SRC-LIB-001`. Each needs its exact Drive URL captured
by the Researcher's first contract per consuming module.

## 2. Conflicts requiring a Fact Integrity ruling before FND-103/TEC-101 content

| Conflict | Values seen | Ruling needed |
|---|---|---|
| Connector count | "100+", "120+", "275+ apps connected out-of-box" | Newest tier-2/tier-1 wins. Must resolve to one number, or state as "275+ apps" only if the current site/product doc confirms. Blocks FND-103, TEC-101, BLD-101, SOL-101. |
| Sales cycle length | "3–5 month" (older overview) vs "5–8 month" (Sales Deep Dive v2026) | Blocks SAL-101, SAL-203. Prefer newest owner-maintained deck; needs David Seeber confirmation. |
| Partner discount | "10% / 25%" (program deck, © 2024 slide) vs "25%+ margin plus comp neutrality" | Program/policy claim, 180-day window, already stale-ish. Blocks FND-101, SAL-204. Needs program owner ruling. |
| Metrics ($250K ADS, 163% NRR, 99% renewal, 7x services drag) | Single-source, tier 3 | Any metric needs a tier-1/tier-2 anchor or it is cut. Applies to FND-101, SAL-101, SAL-201. |
| Deployment naming | "Glean-hosted / customer-hosted" vs "cloud-prem" | Standardize one term portfolio-wide in the path style card. |
| Control plane | Deep Dive v3 notes an AWS Glean Central migration; v2 says GCP | 90-day product window. Blocks TEC-101, TEC-104, TEC-106/108. Needs architecture SME. |

Prevention rule to seed into memory now: **PR-01 — no metric, count, percentage, or currency figure
ships without a tier-1 or tier-2 anchor recorded in `sources.json`.**

## 3. Existing SCORM folders to inspect before rebuilding

The tracker lists five existing SCORM course folders (dated 2026-06-29). Treat as prior art, not as
verified content: `AISM Operating Model` (FND-104), `Choosing the right construct/primitives`
(FND-105), `Glean Architecture/Security Module` (TEC-102), `Glean Technical Delivery Training`
(SRV-205), `Glean Support Operating Model` (OPS-103). First contract for each of those modules is an
inventory + gap read, not authoring.

## 4. Gap list — 21 modules with `Proposed expansion` + `No asset`

FND-107, SAL-201, SAL-202, SAL-204, SOL-102, SOL-201, SRV-104, SRV-105, BLD-207, BLD-208, OPS-104,
OPS-105, OPS-106, ACC-101, ACC-102, ACC-103, ACC-104, ACC-105, ACC-106, TEC-103*, TEC-104*
(*Content Request rows with no asset yet).

None may enter production until a research contract returns ≥2 authoritative sources or one
designated system-of-record with a named owner.
