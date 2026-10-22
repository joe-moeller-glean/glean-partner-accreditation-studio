---
name: glean-accreditation-graphics-media
description: Create original, accessible, source-grounded diagrams and media for accreditation modules. Use when lessons need workflow visuals, comparisons, responsive SVGs, icons, screenshots, or approved audio/video.
---
# Accreditation Graphics and Media Studio

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md` before creating assets. Prefer original diagrams over copied internal media and ship only cleared, local, accessible assets.

**Mission:** produce every visual and media asset the module needs — generated illustrations, diagrams, icons, screenshots, and audio — on brand, accessible, and factually accurate.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 10a Asset Brief Writer | Convert each asset slot in `design/experience.yaml` into a concrete spec: purpose, message, size, format, aspect, placement, alt-text intent |
| 10b Image Generator | Generate illustrations, concept art, headers, and scene visuals with the `image_generation` tool using brand-locked prompts from `references/graphics-system.md` |
| 10c Diagram Author | Build architecture, flow, decision, and comparison diagrams as inline SVG with real labels from `claims.json` |
| 10d Icon Set Curator | Assemble one consistent stroke-weight icon set per path; store in `shared/assets/icons/` |
| 10e Screenshot Curator | Source or capture product UI, crop, annotate with brand callouts, and stamp a capture date |
| 10f Brand Conformance Pre-check | Verify palette, type, spacing, logo rules, and corner radius before handoff |
| 10g Accessibility Packager | Write alt text, long descriptions for complex diagrams, and text equivalents into `assets/alt-text.json` |
| 10h Media Producer | Narration script, audio, captions/VTT, transcripts, and any embedded video — all offline-packaged |
| 10i Optimizer | Compress, size-budget, and de-duplicate; promote reusable assets to `shared/assets/` |

## Rules
- A generated image may never assert a fact. All labels, numbers, product names, and flows come from `claims.json` and are rendered as real text or SVG, not baked into generated pixels.
- Prefer SVG for anything with text, structure, or data. Use raster generation for atmosphere, metaphor, headers, and character-free scenes.
- Never generate the Glean logo, wordmark, or avatar — only place approved asset files, unmodified, with correct clear space.
- Never generate fake UI screenshots of Glean or partner products. Use real captures or a clearly stylized abstraction that cannot be mistaken for the product.
- Avoid generated human faces and text-in-image; both fail brand and accessibility review.
- Every asset ships alt text; every complex diagram ships a long description and a keyboard-reachable text equivalent.
- Budget: total package under 20 MB; single raster asset under 400 KB; no asset loaded from the network at runtime.

## Outputs
`assets/img/*`, `assets/svg/*`, `assets/media/*`, `assets/alt-text.json`, `assets/manifest.json` (source, license, generator, prompt, date, claim links), plus `shared/assets/` promotions.

## Acceptance checks
On-brand palette and type; no logo misuse; every asset has alt text and a manifest entry with license/provenance; all diagram labels trace to claims; total size within budget; renders correctly offline at 200% zoom.

## Escalate when
An asset requires a licensed font/illustration not supplied, a real customer's brand, or a claim that is not verified.

## Boundaries
Never invent data for a chart, never restyle the brand system, never replace a factual diagram with a decorative one.
