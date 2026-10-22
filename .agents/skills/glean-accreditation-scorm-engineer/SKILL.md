---
name: glean-accreditation-scorm-engineer
description: Build offline-safe, resumable SCORM 1.2 accreditation packages. Use for API discovery, scoring, suspend data, interactions, manifests, runtime-only packaging, and one-ZIP-per-module output.
---
# Accreditation SCORM Engineer

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md` before engineering. Enforce separate formative versus graded tracking, production feedback-marker guards, and independent final-exam packaging.

**Mission:** assemble the module into a correct, offline-safe, resumable SCORM 1.2 package.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 13a Shell Integrator | Merge screens, interactions, assessment, and assets into the template shell |
| 13b Runtime API Engineer | Discover `window.API` via parents/opener; `LMSInitialize("")` once, `LMSFinish("")` once; handle no-LMS preview |
| 13c State Engineer | `cmi.core.lesson_location` bookmarks, `cmi.suspend_data` (size-guarded, versioned schema), commit after material progress |
| 13d Scoring Engineer | `cmi.core.score.raw/min/max`, mastery comparison, `incomplete` → `passed`/`failed` transitions, retry semantics |
| 13e Objective Reporter | Map blueprint objectives to `cmi.objectives.n` where the LMS supports it |
| 13f Packager | Run `scripts/build_scorm.py`; verify manifest, file list, checksum, and ZIP naming |
| 13g Offline Hardener | Remove external references, inline critical CSS, confirm relative paths, verify `file://` launch |
| 13h Source Hygienist | Keep editable source out of the package and in the repo; keep the build deterministic |

## Rules
- One SCO per module and one separate SCO for the independent final exam. Never merge an accreditation into one ZIP.
- `imsmanifest.xml` is at ZIP root. Every `identifierref` and file path resolves.
- Formative lesson checks never write `cmi.core.score` or `cmi.interactions`; only graded module quizzes and the independent final do.
- Default assessment runtime supports eight-item module banks drawing five and an independent 10–15 item final bank.
- Never commit `LMSFinish` before final commit of status and score.
- Suspend data must survive truncation gracefully: version the schema, stay within the SCORM 1.2 4096-character limit, and degrade to the last-known-good screen/band.
- For `scroll-canvas-v1`, persist the current band, visited band IDs, interaction state, and quiz state; progress is observer-backed, not raw scroll percentage. Completion requires all bands plus mastery.
- No-LMS preview must be fully usable and must not throw when the API is absent.
- Deterministic builds: same input, same ZIP contents and file order.
- Runtime package hygiene is mandatory: exclude research, sources, design, QA, asset manifests, module metadata, and `assessment/key.json`; fail closed if an authoring file is staged.
- Scan every package for development feedback-overlay markers and fail closed if any are present.
- Zero network dependencies at runtime, including fonts and analytics.

## Outputs
`dist/<id>-v<version>-scorm12.zip`, `.sha256`, build log, updated `module.json`.

## Acceptance checks
`scripts/validate_scorm.py` clean; one package and checksum per active SCO; loads with and without an LMS; formative incorrect-to-correct retry writes no LMS data; graded bookmark/resume, pass/fail/retry, interactions, and persistence verified; final draw is 10–15 independent items; corrupt suspend data is recoverable; no console errors; package contains runtime files only and no development markers; two consecutive builds are byte-identical; checksum recorded. Every build provides live-browser desktop/mobile evidence.

## Escalate when
An LMS-specific quirk requires deviating from SCORM 1.2, or suspend data cannot fit the required state.

## Boundaries
Never alter instructional design, copy, items, or brand decisions to make the build pass.
