# Shared assets, automation, and memory seeding

## 1. Build-once assets (before Wave 1 module 1)

Nothing in this list may be regenerated per module. The Portfolio Planner's Asset Deduplicator owns it.

| Path | Contents | Blocks |
|---|---|---|
| `shared/theme/tokens.css` | Full token set from `plan/01-design-system.md` §1 | every module |
| `shared/theme/style-card-<path>.md` | 8 path style cards (§6 of design system) | every module in that path |
| `shared/scorm/scorm.js` | API discovery, init/finish, status, score, bookmark, suspend-data schema v1 | every module |
| `shared/scorm/state.js` | Versioned suspend-data serializer with truncation fallback | every module |
| `shared/components/*` | 13 components from design-system §4 | every module |
| `shared/assets/icons/*` | 48-icon set + usage sheet | every module |
| `shared/assets/badges/*` | 8 badge forms + Advanced/Expert ring variants | ACC-*, A14 screens |
| `shared/assets/diagrams/DGM-*.svg` | 13 recurring diagrams from graphics-system §3 | listed consumers |
| `shared/assets/personas/*` | Northwind persona cards (Priya, Marcus, Dana, Sam, Alex, Ravi, Nia) | scenario authoring |

## 2. Repository layout for the build

```
accreditations/<id>/            # 8 badge-level SCORM source trees (already scaffolded)
modules/<MODULE-ID>/            # per-module source, created by scaffold_module.py at dispatch time
shared/theme|scorm|assets|components/
plan/                           # this plan set + queue/status/dependency graph
memory/decisions.jsonl|rejections.jsonl|recommendations.jsonl|patterns.md|preferences.md
dist/<id>-v<version>-scorm12.zip + .sha256
```

Scaffold command per module at dispatch:
```bash
python3 skills/scripts/scaffold_module.py --repo-root . --module-id FND-103 \
  --title "Glean Platform Overview & Demo" --path "Program Foundations" --duration-hours 1.0
```

## 3. Automation cadence

Create as real automations (read the automation-trigger skill first, then
`request_create_automation`). Scans never edit content — they open jobs.

| Cadence | Mode | Scope | Output |
|---|---|---|---|
| Weekly Mon 08:00 PT | `scan` | Source drift + link integrity on released modules | `plan/refresh-queue.json`, `monitoring/scan-<date>.md` |
| Monthly 1st | `scan` | Full freshness audit vs 90/180/365-day windows | refresh candidates with impact scores |
| Quarterly | `scan` + `retro` | Assessment calibration, drop-off review, brand-drift sweep, memory retro | calibration notes + prevention-rule review |
| Event: product release | `scan` | Re-verify claims touching changed behavior | targeted_update jobs |
| Event: brand update | `scan` | Token/logo/type drift across all modules | shared-asset job (one, not N) |

Impact score = learner impact × claim centrality × audience size → critical/high/medium/low.
Critical live inaccuracy → propose unpublish or hotfix in the same run and notify the module owner.

## 4. Memory to seed before the first build

Write with `scripts/ledger.py` only.

**Prevention rules (`memory/patterns.md`):**
- `PR-01` No metric, count, percentage, or currency figure without a tier-1/tier-2 anchor.
- `PR-02` Connector/app counts are a single portfolio-wide claim; never restate per module without re-verification.
- `PR-03` Never blend the 2025 enablement journey deck with the 2026 one — 2025 is `superseded_by`.
- `PR-04` No generated product UI; real captures only, stamped and 90-day re-verified.
- `PR-05` Every drag interaction ships a keyboard path in the same component.
- `PR-06` Deployment terminology fixed by path style card ("cloud-prem" vs "customer-hosted" chosen once).
- `PR-07` Level 200+ modules open with a scenario, not a definition.

**Preferences (`memory/preferences.md`):** sentence case everywhere; explain-why feedback; no
gamified points; one signature moment per module; report in tranches not files; ask consolidated
questions only.

**Open recommendations (`memory/recommendations.jsonl`):** the six human decisions in
`00-master-build-plan.md` §9, each with status `open` and a review date.

## 5. Definition of "badge ready"

A badge is announced only when every required module in `plan/accreditations.json` is released, its
assessments are calibrated, and the path map shows a complete, unlocked route. Partial paths stay
unannounced even if individually released.
