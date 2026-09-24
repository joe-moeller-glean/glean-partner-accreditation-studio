# AGT-101 — Glean Agents Foundations

## 1.0.0 — 2026-09-14

First release. First module of the agent series, and the first module built on the
`scroll-canvas-v1` design system.

### Added
- Single-page scrolling module, 12 bands, no pagination.
- 7 interactions: 5-part anatomy hotspot, Auto/Workflow mode compare, 3 mode-choice
  scenarios, 6-card trigger sorter, 4 permission myth cards, 5-factor risk checklist,
  6-stage lifecycle stepper.
- 6-item assessment, mastery 80, per-option feedback on every attempt, unlimited retakes.
- 21 local SVG assets: 18-icon hairline set, hero render, anatomy diagram, completion mark.
- 62 claims, all traceable, across 12 sources (10 tier-1 product documentation pages).
- Reusable design system at `shared/theme/scroll-canvas.css` and
  `plan/06-scroll-canvas-design-system.md`.

### Content decisions traceable to research
- Trigger taxonomy is the documented set: chat message, input form, content, schedule.
  An earlier plan assumed "schedule vs event vs user", which does not exist in the product.
- The central decision is Auto mode vs Workflow mode, not the older "skill vs action vs
  MCP vs agent" framing from partner decks.
- Anatomy is the five documented building blocks, not an invented six-part model.
- Lifecycle is the six-stage ADLC with its five named principles and risk tiers.
- Independent agents are labelled beta wherever they appear.

### Completion contract
`lesson_status` becomes `passed` only when all 12 bands have been reached **and** the quiz
best score is at or above 80. Reaching the bottom of the page is never sufficient.
Progress reports the deepest band actually reached, never bands merely scrolled past.

### Fixed during build
- Non-text contrast: cement hairlines (1.72:1) were serving as interactive control
  borders. Added `--line-control` at 11.37:1 for control boundaries.
- Target size: risk checkboxes raised from 20px to 24px.
- Lifecycle stepper exposed stage names only to assistive technology; stage names are now
  visible text, so the lifecycle shape is readable without clicking through six stages.
- Risk-tier thresholds are a studio heuristic rather than product guidance, and now say so
  in the module itself.

### Known limitations
- No SME review.
- No real LMS import; validation is structural plus scripted runtime plus live Chrome.
- No screen reader walkthrough.
- Five design deviations await owner confirmation
  (`plan/06-scroll-canvas-design-system.md` §12).
- Not present in the roadmap Module Tracker.
- Overlaps FND-104 and FND-105 at 200 level; dedupe is an owner decision.
