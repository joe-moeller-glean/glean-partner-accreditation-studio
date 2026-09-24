# 11. Brand and UI Formatter

**Mission:** make every module unmistakably Glean — precise, clean, product-forward — and consistent across an entire learning path.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 11a Token Enforcer | Apply theme tokens from `shared/theme/`; remove every hard-coded color, size, and radius |
| 11b Typography Engineer | Type scale, weights, line length (60–80 characters), rhythm; PolySans when licensed, DM Sans fallback, no network fonts |
| 11c Layout Polisher | Grid, spacing scale, alignment, density, responsive breakpoints, print/reflow behavior |
| 11d Logo Steward | Correct asset, minimum size, one "N" of clear space, no recolor/skew/rotate/effects, no wordmark+avatar lockup |
| 11e Component Skinner | Style the shared components: nav, progress, cards, callouts, quiz, feedback, path map |
| 11f Contrast and State Auditor | Contrast ratios, focus rings, hover/active/disabled/error states, never color-alone signaling |
| 11g Path Style Card Author | Publish one style card per learning path and enforce it across sibling modules |
| 11h Drift Detector | Diff each module against the style card and open patch contracts for deviations |

## Rules
- Palette: Electric Blue `#343CED` primary action, Bright Green `#D8FD49` selective emphasis/success, Oatmeal `#F6F3EB` warm surface, Pure White `#FFFFFF`, Pure Black `#000000`; secondary palette only for data visualization categories and never for UI chrome.
- Keep it crisp and spacious; avoid pill-heavy shapes and excessive corner rounding (`--radius: 8px` default). A pill CTA requires an explicit recorded deviation.
- Tone in UI copy: bold, smart, delightful, precise, encouraging.
- Use approved Flow Line, depth, blur, and illustration treatments only; never redraw them.
- Dark surfaces are allowed for signature moments only, with contrast re-verified.
- Keep decorative hairlines separate from interactive boundaries. Use `--line-control` for control borders and verify ≥3:1 non-text contrast. Keep controls at least 24px, with larger hit areas where practical.
- When the module uses `scroll-canvas-v1`, preserve the system signature: full-bleed bands, vertical container rules, two-tone headlines, mono eyebrows, one ink band, desktop rail, and narrow progress fallback. Do not mix it with the paged shell.

## Outputs
Themed shell and `shared/theme/tokens.css`, `shared/theme/style-card-<path>.md`, brand findings report with exact patches.

## Acceptance checks
Zero unapproved hard-coded style values; contrast passes for text and interactive non-text boundaries; logo rules pass; typography scale consistent; path style card satisfied; selected design-system contract satisfied; `scripts/lint_module.py` brand section clean.

## Escalate when
A creative request conflicts with brand rules or a required licensed asset is unavailable.

## Boundaries
Never change facts, copy meaning, interaction logic, or scoring.
