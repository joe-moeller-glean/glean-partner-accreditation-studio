# Graphics and media system

## Prompt frame for generated imagery
Every `image_generation` call composes: subject + composition + brand palette + finish + exclusions.

```
[subject/metaphor], clean modern editorial illustration, generous negative space,
flat geometric shapes with subtle depth, restrained palette of electric blue #343CED,
oatmeal #F6F3EB background with soft teal and orchid corner washes, black and white
structure, crisp precise edges, slight rounding (12px feel), no text, no words, no letters,
no logos, no faces, no UI screenshots, no gradients-heavy 3D, no stock-photo realism,
16:9, high detail, professional enablement course visual
```

Variants: `header` (16:9 atmospheric), `concept` (1:1 metaphor), `spot` (square icon-scale motif), `divider` (wide abstract Flow-Line-inspired band), `celebration` (badge moment, abstract, energetic).

## Hard rules
- No text, numbers, or labels inside generated raster images. All wording is real HTML/SVG text so it is selectable, translatable, and screen-reader accessible.
- Never generate the Glean logo, wordmark, or avatar. Place approved files only, unmodified, with one "N" of clear space, minimum 20px digital.
- Never generate imitation product UI. Use real captures (annotated, capture-dated) or an obviously abstract schematic.
- Avoid human faces and hands; use abstract figures or objects instead.
- No competitor marks, no real customer brands, no licensed characters, no unlicensed fonts.

Hero and celebration art follow the brand 3D direction in `skills/brand/references/IMAGERY.md`:
indigo `#4035C0`/`#2B228C` forms against coral, magenta, and salmon particles. Avoid robots,
glowing brains, circuit boards, and network-node clichés.

## Diagram standards (SVG)
- Built by `tools/portfolio/svg_lib.py`, per `skills/brand/references/IMAGERY.md`.
- Oatmeal canvas with corner washes. White nodes, 12px radius, 1px `rgba(0,0,0,.12)` hairline, no shadows. Connectors 1.5px `rgba(0,0,0,.35)`, round caps, open chevron arrowheads.
- Exactly one Electric Blue emphasis per diagram (2px node border or 4px left rule). Bright Green never on a light diagram.
- Labels: 500-weight titles in black, `#666666` support text, mono sequence numerals `01`, `02`, `03`. Never circled digits. 8px spacing grid, sentence case.
- Secondary palette only to separate data categories; at most three in one graphic.
- Every node label, arrow label, and figure comes from `claims.json` with a `claim_id` recorded in `assets/manifest.json`.
- Include `<title>` and `<desc>` in every SVG; complex diagrams also ship a text-equivalent panel that is keyboard reachable.
- Prefer self-contained local SVG for hero renders, anatomy diagrams, lifecycle visuals, and iconography in `scroll-canvas-v1`; do not recreate the same icon family per module.
- Keep artwork fluid (`width:100%; height:auto`) and test it at 320px width, 200% zoom, and high-contrast mode. A decorative SVG must be `aria-hidden="true"` with empty alt; a meaningful SVG must have an accessible name plus the text-equivalent path.

## Icon set
Use the brand line-icon sprite `shared/assets/brand/glean-icons.svg` (28 icons, `gl-*` ids). Style: 24px grid, 1.75 stroke, round caps and joins, `currentColor`, stroke only. Draw new icons to the same spec; never mix filled or duotone families. Icons are decorative unless they carry the only meaning — then they get accessible names.

## Screenshots
Real captures only. Crop to the relevant region, annotate with numbered blue callouts, stamp `Captured YYYY-MM` in the caption, and register a re-verify date (default 90 days) in `sources.json`.

## Media
Narration is optional and never the sole carrier of meaning. Every audio or video asset ships a caption file (`.vtt`) and a transcript, is packaged locally, and is under the size budget. Autoplay is prohibited.

## Manifest
`assets/manifest.json` records for every asset: `asset_id`, path, type, purpose, `screen_id`, generator (`image_generation` / SVG author / capture), prompt or source, license, creator, created date, `claim_ids`, alt text, and byte size.

## Budgets
Package ≤20 MB. Single raster ≤400 KB. Hero image ≤250 KB. SVG preferred wherever text or structure appears. No runtime network fetches — ever. For a scroll module, default to one hero render, one concept/anatomy visual, one lifecycle or process visual, and a reusable icon set; more assets need an objective-level rationale.
