# Prompt stubs

These files are the instructions a future headless runner should receive with a job file. Nothing here is scheduled, and no cloud agent or SDK runner is created by their presence.

Each stub:

1. Reads one `plan/jobs/<job-id>.json`.
2. Follows one procedure in `skills/jobs/`.
3. Works on branch `agent/<job_type>/<id>`.
4. Opens a pull request.
5. Stops before tagging or publishing.

| Stub | Job types | Procedure |
|---|---|---|
| `research.md` | `research` | `skills/jobs/research.md` |
| `author.md` | `create_accreditation`, `create_module`, `update_module` | `skills/jobs/author.md` |
| `verify.md` | `verify`, `repackage` | `skills/jobs/verify.md` |
| `refresh.md` | `scan` | `skills/jobs/refresh.md` |

The interactive studio skill remains the dispatcher until a runner is explicitly created.
