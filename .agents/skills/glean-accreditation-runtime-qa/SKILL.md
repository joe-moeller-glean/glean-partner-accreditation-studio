---
name: glean-accreditation-runtime-qa
description: Test accreditation runtime, SCORM behavior, question retries, scoring, resume, packages, and responsive rendering. Use before any release decision or after runtime, content, or assessment changes.
---
# Accreditation Runtime and Regression QA

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md` before testing. Record build-fingerprinted runtime and desktop/mobile visual evidence for every active SCO.

**Mission:** prove the package behaves correctly for a real learner, in a real LMS, and did not regress.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 14a Launch Tester | First launch with LMS, without LMS, from ZIP, and from extracted folder |
| 14b Tracking Tester | Status transitions, score write, commit timing, exit/re-entry, multiple sessions |
| 14c Resume Tester | Bookmark accuracy, interaction state restore, mid-assessment resume, suspend-data corruption fallback |
| 14d Assessment Path Tester | Pass, fail, retry, boundary score at mastery, all-wrong and all-right runs, feedback correctness |
| 14e Compatibility Tester | Chrome/Edge/Safari/Firefox current, narrow viewport, 200% zoom, reduced motion, high-contrast mode |
| 14f Regression Differ | Diff against the previous release: IDs, screens, items, scoring, size, load time |
| 14g Content Spot-Checker | Verify rendered claims match `claims.json` and that no placeholder shipped |
| 14h Report Writer | Emit `qa/report.json` with per-case status, evidence, and reproduction steps |

## Required cases
Launch (4), tracking (6), resume (4), assessment (6), compatibility (6), regression (4), content spot-check (3). Every case records expected vs actual.

Assessment cases must prove:
- every lesson renders exactly one four-option formative MCQ;
- an incorrect formative submission shows retry feedback and leaves all options enabled;
- reselection clears stale feedback, the correct answer can be submitted, and success locks the check;
- formative checks write no LMS score or interaction;
- module quiz bank/draw/mastery boundaries work, including 4/5 pass and 3/5 fail under the default model;
- final bank contains 10–15 exam-only items, has no reused formative/module stems or answer sets, covers all required modules, and meets its exact 80% boundary;
- package counts match the accreditation and no retired module remains in active outputs.

Additional required cases for `scroll-canvas-v1`:
- 12-band or module-defined band count; one h1; labelled h2 sections; rail anchors; one ink band; surface/archetype alternation.
- Observer-backed progress honesty: partial visitation reports only visited bands, never raw pixels; no-IntersectionObserver fallback keeps all content usable.
- Keyboard operation for tabs, hotspots, decisions, sorters, checklists, steppers, and quiz; no positive tabindex; focus order follows DOM/scroll order.
- Resume restores saved band, visited bands, interaction state, and quiz state; malformed suspend data starts safely.
- No-LMS preview, reduced motion, 320px/390px/narrow layout, no horizontal overflow, broken-image count, and desktop rail/mobile progress behavior.
- Live-browser render from a localhost server. Record page height, viewport, computed headline/type tokens, broken assets, and at least one successful path through each interaction family. Do not treat a static file read or failed headless launch as visual QA.

## Acceptance checks
All required cases pass for every active SCO; runtime and visual reports record the current build fingerprint; desktop and mobile visual results have zero unexplained issues; deterministic reproduction steps are recorded for any failure; regression diff is explained by the changelog; no untriaged console errors; answer-key, authoring-leak, remote-dependency, and development-marker scans are clean; accessibility residual risks are named rather than hidden.

## Escalate when
A failure reproduces after one engineering retry, or the LMS behaves inconsistently across imports.

## Boundaries
Never fix the defect itself, never approve release, never re-run only the passing subset.
