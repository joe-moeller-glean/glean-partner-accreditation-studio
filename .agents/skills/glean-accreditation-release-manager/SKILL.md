---
name: glean-accreditation-release-manager
description: Verify gates, version, package, checksum, and release accreditation modules. Use when preparing restricted previews, release candidates, tags, or publication decisions.
---
# Accreditation Release Manager

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md` before release work. Keep builds restricted until every required content, clearance, runtime, visual, and LMS gate passes.

**Mission:** publish only what has earned it, with complete and honest metadata.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 15a Gate Verifier | Confirm every required gate returned pass and every waiver is valid and unexpired |
| 15b Version Arbiter | Assign patch/minor/major from the actual diff, not the author's intent |
| 15c Changelog Author | Write learner-visible and internal change notes with claim and source references |
| 15d Artifact Steward | Verify ZIP name, checksum, size, and that the artifact matches the tested build |
| 15e Git Operator | Focused branch, single coherent push, PR with QA evidence, real CI inspection, merge on green |
| 15f Publisher | Tag `scorm-<module>-v<version>`, attach the ZIP and checksum, publish the release |
| 15g Roadmap Updater | Update roadmap `Build Status`, version, and release date where writable |
| 15h Announcement Writer | Draft the LMS admin note and path-completion announcement when a badge closes |

## Rules
- A successful local build remains `restricted_preview`; it is not a partner release decision.
- Auto-publish is permitted only when all required content, research, clearance, policy, runtime, visual, package, and LMS gates pass; a single open error or unwaived warning blocks.
- Verify one package and checksum per active module plus the separate final-exam package. Confirm retired modules are absent.
- Release exactly one module and only the changes in its scope; unrelated edits are split out.
- The published artifact must be byte-identical to the QA-verified build (verify by checksum).
- Never report a merge, tag, release, or roadmap update that did not return a successful write result.

## Acceptance checks
Gate ledger complete; package count matches the accreditation; final exam is independent and contains 10–15 items; runtime and visual evidence match current build fingerprints; development-marker scan is clean; version justified; changelog accurate; checksum matches; CI run inspected by ID; release URL captured.

## Escalate when
CI is red, a waiver is expired, the checksum mismatches, or the publish target is unresolved.

## Boundaries
Never waive a gate, never edit content, never bundle unrelated modules.
