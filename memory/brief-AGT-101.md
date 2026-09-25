# Memory brief — AGT-101 (Glean Agents Foundations)

Built 2026-09-14. v1.0.0. First module of the agent series and first use of `scroll-canvas-v1`.

## What this module established for the portfolio

1. **A second design system.** `scroll-canvas-v1` (single-page scroll) now sits alongside the
   original paged system. Both are valid. Choose per module and record the choice in
   `module.json` under `design_system`.
2. **Honest progress for scroll runtimes.** Progress is the deepest band actually reached.
   Completion needs every band visited *and* quiz mastery. Reaching the bottom is not mastery.
3. **Documentation beats decks.** For product-behaviour claims, docs.glean.com wins. Decks are
   for programme facts (competency requirements, badge rules).

## Research findings that affect other modules

Four places where the older deck-sourced claim library disagrees with current product docs:

| Topic | Deck-derived (older modules) | Product documentation |
|---|---|---|
| Triggers | schedule / event / user | chat message, input form, content, schedule |
| Core build decision | skill vs action vs MCP vs agent | Auto mode vs Workflow mode |
| Agent anatomy | six invented parts | five building blocks |
| Lifecycle | plan / build / measure | six-stage ADLC, five principles, risk tiers |

**The 11 previously built agent modules were sourced from those decks and are likely to carry the
same drift.** They are all still held for review, so nothing incorrect has shipped. Re-verify
before publishing any of them.

## Reusable assets produced

- `shared/theme/scroll-canvas.css` — the whole design system, tokenised.
- `plan/06-scroll-canvas-design-system.md` — the spec, with a reapply recipe in §11.
- `learning/modules/AGT-101/assets/icons/` — 18-icon hairline set, 24px grid, reusable across the series.
- `tools/agents/runtime_qa_agt101.js` — scroll-runtime harness. Template for later scroll modules.
- `tools/agents/package_agt101.py` — packager for the `assets/*.svg` layout with an answer-key guard.

## Traps found the hard way

- **jsdom reports `readyState: "loading"`** for externally evaluated scripts, so a correct
  `DOMContentLoaded` guard makes the module look completely broken in a harness. Dispatch the
  event in the harness; do not "fix" the app.
- **The linter's asset manifest wants objects**, not path strings, and treats empty `alt` as
  missing. Decorative assets need an explicit rationale string keyed by `asset_id`.
- **Claim IDs must match `C-\d{2,}`** or the traceability check silently finds nothing.
- **Chrome will not launch headless in this environment** (SIGABRT). Browser Operator against a
  localhost server works, and gives a real rendering engine.
- **`--cement` hairlines are 1.72:1.** Fine as decoration, not as a control boundary. Use
  `--line-control`.

## Open items carried forward

- Five design deviations await owner confirmation (`plan/06-scroll-canvas-design-system.md` §12).
  D-1 (pill CTAs) contradicts `brand-system.md` and is the one that matters.
- No SME review, no LMS import, no screen reader walkthrough.
- AGT-101 is absent from the roadmap Module Tracker.
- Overlap with FND-104 / FND-105 needs a dedupe decision.
