# Partner Accreditation Studio — build plan index

Authored by the orchestrator (`glean-partner-accreditation-studio`) in `roadmap` mode against the
live Partner Accreditation & Competency Roadmap. Every sub-agent reads this index first.

| Doc | Read when |
|---|---|
| [00-master-build-plan.md](00-master-build-plan.md) | Sequencing, waves, concurrency, gates, tranches, automation |
| [01-design-system.md](01-design-system.md) | Tokens, type scale, grid, components, motion, path style cards |
| [02-graphics-icon-system.md](02-graphics-icon-system.md) | Image prompts, icon inventory, diagram catalog, badge art, alt text |
| [03-interaction-assessment-architecture.md](03-interaction-assessment-architecture.md) | Interaction library, assessment blueprints per format, rubrics |
| [04-source-ledger.md](04-source-ledger.md) | Verified sources, authority tiers, conflicts needing rulings, freshness |
| [05-shared-assets-and-automation.md](05-shared-assets-and-automation.md) | What is built once in `shared/`, scan cadence, memory seeding |
| [accreditations/](accreditations/) | 8 badge-level plans (required modules, capstone, release gate) |
| [modules/](modules/) | 83 per-module development plans (one file per tracker row) |

## Generated data
| File | Contents |
|---|---|
| `queue.json` | 83 ordered jobs with request_type, deps, flags, sequence |
| `dependency-graph.json` | Prerequisite DAG (acyclic, verified) |
| `status.json` | Resumable per-module state |
| `accreditations.json` | Badge → required-module mapping from the tracker |
| `roadmap-export/` | CSV + JSON extraction of all six roadmap tabs + raw payload |

## Regenerate
```bash
python3 tools/extract_tracker.py --payload plan/roadmap-export/roadmap-payload.raw.txt --out plan/roadmap-export
python3 skills/scripts/plan_roadmap.py --csv plan/roadmap-export/tab-02-module-id.csv --out plan
python3 tools/gen_module_plans.py
```

## Hard rules that override creative latitude
1. One SCORM 1.2 ZIP per module; one release at a time.
2. Every learner-facing factual sentence carries a `claim_id` resolving to `sources.json`.
3. No placeholders, no invented metrics, no generated Glean logo, no generated product UI, no runtime network calls.
4. Warnings block release unless `qa/waivers.json` records owner, reason, scope, expiry.
5. A badge is announced only when every required module is released.
