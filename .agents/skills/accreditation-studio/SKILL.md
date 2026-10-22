---
name: accreditation-studio
description: Orchestrates Glean partner accreditation and SCORM 1.2 module work. Use when creating an accreditation, creating or updating a module, researching sources, testing a package, scanning for content drift, or deciding a release. Routes each request into one job file and one worker.
---
# Accreditation studio

Read and follow `skills/SKILL.md` before any create, update, research, test, scan, or release step. Also read `skills/references/accreditation-build-standard.md` for learner content.

Classify the request into one job type and write `plan/jobs/<job-id>.json` using `skills/references/job-contract.md`.

| Request | Procedure |
|---|---|
| Research or claims | `skills/jobs/research.md` |
| Create or update a module, or write an accreditation definition | `skills/jobs/author.md` |
| Test, audit, or repackage | `skills/jobs/verify.md` |
| Source drift | `skills/jobs/refresh.md` |

The author of learner content does not verify or publish that content. Prompt stubs in `.agents/prompts/` are for a future headless runner. Do not create that runner unless the user asks.
