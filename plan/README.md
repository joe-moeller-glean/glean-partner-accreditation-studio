# Partner accreditation plans

The studio procedure is `skills/SKILL.md`. Job files for a run go in `plan/jobs/`. Superseded drafts are in `plan/archive/` and are not the current procedure.

| Doc | Read when |
|---|---|
| `skills/SKILL.md` | Any create, update, research, test, or scan |
| `skills/references/accreditation-build-standard.md` | Learner content, assessment, packaging, and release evidence |
| [accreditations/](accreditations/) | Badge-level plans (required modules, capstone, release gate) |
| [modules/](modules/) | Per-module development plans (one file per tracker row) |

## Generated data
| File | Contents |
|---|---|
| `queue.json` | Ordered jobs with job type, dependencies, and sequence |
| `dependency-graph.json` | Prerequisite DAG |
| `status.json` | Resumable per-module state |
| `jobs/` | One contract per worker run |
| `accreditations.json` | Tracker snapshot of badge to required modules. Canonical definitions are `learning/accreditations/<id>/accreditation.yaml`. `validate_accreditations.py` fails on drift |
| `roadmap-export/` | CSV and JSON extraction of the roadmap tabs |

## Regenerate
```bash
python3 tools/extract_tracker.py --payload plan/roadmap-export/roadmap-payload.raw.txt --out plan/roadmap-export
python3 skills/scripts/plan_roadmap.py --csv plan/roadmap-export/tab-02-module-id.csv --out plan
python3 tools/render_module_plans.py
python3 tools/render_accreditation_plans.py
```

## Rules
1. One SCORM 1.2 ZIP per module, and one release at a time.
2. Every learner-facing factual sentence carries a `claim_id` that resolves to `sources.json`.
3. No placeholders, invented metrics, generated Glean logo, generated product UI, or runtime network calls.
4. Warnings block release unless `qa/waivers.json` records owner, reason, scope, and expiry.
5. A badge is announced only when every required module is released.
