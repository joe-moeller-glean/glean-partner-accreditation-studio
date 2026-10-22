---
name: glean-accreditation-brand-ui
description: Apply Glean brand, typography, spacing, layout, and component consistency to accreditation modules. Use after content and interaction structure are stable.
---
# Accreditation Brand and UI Formatter

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md` before formatting. Preserve its responsive, local-asset, and learner-readability contracts.

**Mission:** make every module unmistakably Glean — precise, clean, product-forward — and consistent across an entire learning path.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 11a Token Enforcer | Apply theme tokens from `shared/theme/` (mapped from `skills/brand/assets/css/glean-brand.css`); remove every hard-coded color, size, and radius |
| 11b Typography Engineer | Type scale, weights, line length (62–68 characters), rhythm; PolySans when licensed, DM Sans fallback, mono accessory for eyebrows and numerals, no network fonts |
| 11c Layout Polisher | Grid, spacing scale, alignment, density, responsive breakpoints, print/reflow behavior |
| 11d Logo Steward | Approved file from `shared/assets/brand/`, never retyped as text; minimum 20px, clear space of one "n", no recolor/skew/rotate/effects, no wordmark+avatar lockup |
| 11e Component Skinner | Style the shared components: nav, progress, cards, callouts, quiz, feedback, path map |
| 11f Contrast and State Auditor | Contrast ratios, focus rings, hover/active/disabled/error states, never color-alone signaling |
| 11g Path Style Card Author | Publish one style card per learning path and enforce it across sibling modules |
| 11h Drift Detector | Diff each module against the style card and open patch contracts for deviations |

## Rules
- Source of truth: `skills/brand/` (Glean Branding Style 2026). Module overrides: `references/brand-system.md`.
- Palette: Oatmeal `#F6F3EB` canvas with teal/orchid corner washes; white panels and cards on it; black type; `#666666` support text; Electric Blue `#343CED` as a single accent per view; Bright Green `#D8FD49` only on near-black `#111314`. Secondary palette only for data and diagram categories, never UI chrome.
- Radii: 8px for shell buttons and inputs, 12px for inner panels and choices, 16px for cards and panels, pill for in-page CTAs, tags, and filter chips. Flat and hairline-driven; shadows only on hover or floating layers.
- Headlines 700 with tight leading and -0.02em tracking. Every view carries at least one mono element.
- Tone in UI copy: bold, smart, delightful, precise, encouraging.
- Use approved gradient and hero art directions only (`skills/brand/references/IMAGERY.md`); never redraw the logo.
- One near-black band per page for the signature moment, with contrast re-verified.
- Keep decorative hairlines separate from interactive boundaries. Use `--line-control` for control borders and verify ≥3:1 non-text contrast. Keep controls at least 24px, with larger hit areas where practical.
- When the module uses `scroll-canvas-v1`, preserve the system signature: full-bleed bands, vertical container rules, corner-washed first band, two-tone headlines, mono eyebrows, one near-black band, desktop rail, and narrow progress fallback. Do not mix it with the paged shell.

## Outputs
Themed shell and `shared/theme/tokens.css`, `shared/theme/style-card-<path>.md`, brand findings report with exact patches.

## Acceptance checks
Zero unapproved hard-coded style values; contrast passes for text and interactive non-text boundaries; logo rules pass; typography scale consistent; path style card satisfied; selected design-system contract satisfied; `scripts/lint_module.py` brand section clean.

## Escalate when
A creative request conflicts with brand rules or a required licensed asset is unavailable.

## Boundaries
Never change facts, copy meaning, interaction logic, or scoring.
