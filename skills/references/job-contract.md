# Job contract

Every worker starts from one JSON file at `plan/jobs/<job-id>.json`. The file is the whole assignment. Chat history is not required.

```json
{
  "job_id": "AGT-101-update-2026-10-22",
  "job_type": "update_module",
  "module_id": "AGT-101",
  "accreditation_id": null,
  "status": "queued",
  "branch": "agent/update_module/AGT-101",
  "base": "main",
  "objective": "Replace the trigger claim with the current product documentation and keep BAND-04's ID.",
  "inputs": [
    "skills/references/accreditation-build-standard.md",
    "learning/modules/AGT-101/research/claims.json",
    "memory/brief-AGT-101.md"
  ],
  "acceptance": [
    "every changed factual sentence resolves to a current source",
    "BAND-04 ID is unchanged",
    "skills/scripts/lint_module.py exits 0"
  ],
  "out_of_scope": ["other modules", "tagging", "publishing"],
  "resume_from": null
}
```

## Fields

| Field | Rule |
|---|---|
| `job_id` | Stable. `<module-or-accreditation>-<job_type>-<date>`, plus a suffix when two jobs share that key. |
| `job_type` | `create_accreditation`, `create_module`, `update_module`, `research`, `verify`, `repackage`, or `scan`. |
| `module_id` / `accreditation_id` | Set the one this job changes. Use null for the other. |
| `status` | `queued`, `running`, `blocked`, `ready_for_verify`, `passed`, or `failed`. |
| `branch` | `agent/<job_type>/<id>`. |
| `inputs` | Exact repo paths. Never "the relevant screen". |
| `acceptance` | Checks another worker or a script can judge. |
| `out_of_scope` | Paths and decisions this job must leave alone. |
| `resume_from` | Artifact path to continue, or null. Also update `plan/status.json`. |

## Rules

- One module or one accreditation definition, one objective, one primary output.
- Include the build standard in `inputs` for every create or update.
- Copy applicable prevention rules from the ledger into `acceptance`.
- Valid returns are the artifact, a patch, or `blocked` with the missing source, ruling, or command output. Never a guess and never a wider scope.
- Preserve `SCR-`, `BAND-`, `OBJ-`, `INT-`, `Q-`, `C-`, `SRC-`, and `asset_id` values. Retiring an ID requires a changelog note.
- The author job does not set `status` to `passed`. Only the verify job can.
- A scan job writes proposals. It does not set module content.
- Do not invent a worker, a sub-agent, or a crank ID. The procedure file is the checklist.
