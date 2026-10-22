# Glean module brand system

**Source of truth:** the vendored **Glean Branding Style 2026** skill in `skills/brand/`
(`SKILL.md`, `references/*.md`, `assets/css/glean-brand.css`). Read it before any brand, UI, or
graphics work. This file maps that skill onto SCORM modules and records the overrides that
courseware accessibility needs. Where this file and the brand skill disagree, this file wins
**only** for the overrides listed below. See `skills/brand/VENDOR.md` for provenance and missing assets.

## Non-negotiables (from the brand skill)
1. Oatmeal canvas, not white. White is for panels and cards that sit on Oatmeal.
2. Electric Blue is an accent, never a wash: logo, links, the primary nav button, the progress
   fill, and one point of emphasis per view.
3. Black headlines. Gray support copy. Never blue body text.
4. Corner washes: teal from the top-right, orchid from the bottom-left. The center stays calm.
5. PolySans (DM Sans fallback). Headlines 700, `line-height` 1.0-1.08, tracking -0.02em.
6. A geometric mono carries eyebrows, step numerals, stats, IDs, and metadata.
7. Generous margins, few elements.
8. Approved logo only, never recolored or retyped.

## Tokens (`shared/theme/tokens.css`)
```css
--blue:#343CED; --green:#D8FD49; --oatmeal:#F6F3EB; --white:#FFFFFF; --ink:#000000;
--near-black:#111314; --off-white:#F8F8F8;
--wash-teal:#DEEEF0; --wash-orchid:#F0C2F2; --wash-peach:#FFCFBC;
--muted:#666666; --text-2:#666666;              /* support copy and mono labels */
--hairline:rgba(0,0,0,.12);                       /* decorative borders only */
--line-control:#777767;                           /* control boundaries, 4.55:1 on white */
--font:"PolySans","DM Sans",...; --font-mono:"PolySans Mono","IBM Plex Mono",...;
--radius:8px; --radius-md:12px; --radius-lg:16px; --radius-pill:999px;
--maxw:1280px; --line:66ch; --target:44px;
```
`scroll-canvas-v1` defines the same values in its own `:root` block (`--surface-ink` is
`--near-black`, `--radius-card` is 16px). Secondary colors are for charts, diagrams, and
category coding only, never UI chrome.

## Accessibility overrides (module-specific)
| Brand skill value | Module value | Reason |
|---|---|---|
| Body gray `#7F7F7F`, mono gray `#727272` | `#666666` for all gray text | `#7F7F7F` is 3.6:1 and `#727272` is 4.3:1 on Oatmeal. Module text must meet 4.5:1 at every size. `#666666` is 5.2:1 on Oatmeal and 5.7:1 on white. |
| Card hairline `rgba(0,0,0,.12)` on controls | `--line-control` `#777767` | Controls need 3:1 non-text contrast. The hairline is decorative only. |
| Focus ring `0 0 0 3px rgba(52,60,237,.35)` | `3px solid` Electric Blue outline, white on near-black | The translucent ring is under 3:1 on Oatmeal. Blue is 2.7:1 on `#111314`. |
| Bright Green as a fill on light UI | Bright Green only on near-black (badge chip, stats, quiz score) | Green is 1.4:1 on white. |

## Components
- **Shell (paged-v1):** white header and footer bars with hairline borders. Wordmark at top left,
  24px tall. Mono progress readout and objective. Blue 8px-radius **Continue**; hairline **Back**.
- **Screen:** white panel, 16px radius, on the corner-washed Oatmeal page.
- **Cards and steps:** Off-White fill, hairline border, 16px or 12px radius, mono tag or `01` numeral
  above a hairline divider, 500-weight title, gray body.
- **In-page CTAs:** pill radius. Black primary (**Submit**), hairline secondary (**Retry**).
- **Choices and hotspots:** white, `--line-control` border, 12px radius, 44px minimum height. The
  verdict uses a 4px inset rule plus a text label, never color alone.
- **Tables:** mono header row, horizontal hairlines only.
- **Badge / signature moment:** near-black pill with a Bright Green mono label.
- **scroll-canvas-v1:** full-bleed bands, 12% hairline container rules, a corner wash on the first
  band, one near-black band with Bright Green stats and score, 16px cards, and pill CTAs.

## Logo
Use `shared/assets/brand/glean-wordmark-electric-blue.svg`. Copy it to `assets/brand/` in each
module, register it in `assets/manifest.json` as `type: brand_logo`, and place it with
`<img alt="Glean" height="24">`. Minimum 20px tall. Clear space equals the width of the `n`.
Never recolor, retype, stretch, add effects, enclose it in a box, or put the wordmark and avatar
together. The white wordmark and avatar marks are not yet available (see `VENDOR.md`), so do not
put the logo on a dark surface.

## Voice
Bold, smart, delightful, precise, encouraging. Sentence case. Periods may set rhythm in headlines
(`Five outcomes. Each one is assessed.`). Explain, never lecture. Feedback always explains why.

## Accessibility floor
4.5:1 text contrast and 3:1 non-text contrast. Visible keyboard focus. Never state by color alone.
Honor `prefers-reduced-motion`. Keyboard-complete. Legible at 200% zoom and 320px width. 44px
control targets (24px absolute minimum). Test keyboard focus itself; programmatic focus does not
necessarily match `:focus-visible`.

## Related
Brand detail: `skills/brand/references/` (COLOR, TYPOGRAPHY, LAYOUT, LOGO, WEB, IMAGERY).
Creative layout, archetypes, and motion budget: `experience-design.md`. Image, diagram, icon,
and media specs: `graphics-system.md`.
