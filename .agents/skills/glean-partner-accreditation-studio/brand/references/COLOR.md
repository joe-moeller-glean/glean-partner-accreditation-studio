# Color

Hex values are the official Glean brand palette. Values tagged **(measured)** were sampled
directly from the slide masters and marketing-site screenshots in `assets/reference/` and
describe how the palette is actually applied in product surfaces.

## Primary

| Name | Hex | RGB | Role |
|---|---|---|---|
| Electric Blue | `#343CED` | 52, 60, 237 | The brand accent. Logo, links, primary buttons, single emphasis per view. |
| Bright Green | `#D8FD49` | 216, 253, 73 | High-energy accent. Best on near-black or indigo; avoid on Oatmeal. |
| Oatmeal | `#F6F3EB` | 246, 243, 235 | The default canvas for slides, docs, dashboards, infographics. |
| Pure White | `#FFFFFF` | 255, 255, 255 | Cards and panels sitting on Oatmeal. Not a page background. |
| Pure Black | `#000000` | 0, 0, 0 | Headlines, body copy, line work, dark buttons. |

> Electric Blue renders as `#353BED` in the site screenshots (measured) - anti-aliasing, not
> a second blue. Always author `#343CED`.

## Secondary

Three tonal rows. Use them for data visualization, category coding, and illustration - not
for type or chrome.

| Saturated | | Mid | | Light | |
|---|---|---|---|---|---|
| Green | `#00B207` | Green | `#54D848` | Light Green | `#C3FF9E` |
| Orange | `#FF7E4C` | Mandarin | `#FFAC8C` | Peach | `#FFCFBC` |
| Magenta | `#9300B8` | Pink | `#E16BFF` | Light Pink | `#F1B7FF` |
| Dark Blue | `#1017B1` | Mid Blue | `#3FA3FF` | Light Blue | `#B2E5EF` |
| Dark Cement | `#777767` | Cement | `#C7C7AB` | Off White | `#F8F8F8` |

**Chart sequence** (maximum separation, brand-first):
`#343CED` -> `#FF7E4C` -> `#00B207` -> `#9300B8` -> `#3FA3FF` -> `#D8FD49` -> `#777767`

## Applied neutrals and surfaces (measured)

| Name | Hex | Where it appears |
|---|---|---|
| Site cream | `#FAF6F4` | Marketing-site page background - a hair warmer/lighter than Oatmeal |
| Near-black band | `#111314` | Full-width dark CTA / stats / resources sections |
| Deep navy banner | `#02065E` | Thin announcement bar pinned above the nav |
| Body gray | `#7F7F7F` | Paragraph and supporting copy |
| Muted headline gray | `#666666` | The de-emphasized half of a two-tone headline |
| Mono label gray | `#727272` | Monospace eyebrow labels above section headings |
| Placeholder gray | `#EDEDED` | Empty image frames on slides |
| Slide footer gray | `#B0AEA2` | The `Confidential | (c) Glean Technologies, Inc.` footer |
| Hairline border | `rgba(0,0,0,0.12)` | Card and card-grid dividers (samples ~`#C0C0C0` at 1px) |

### Two-tone headline

A signature device: set the first clause in `#000000` and the trailing clause in `#666666`
within one sentence. It creates hierarchy without changing size or weight.

> **Find what you need.** <span style="color:#666666">Work faster.</span>

## Gradient recipes

### Oatmeal corner wash - default light surface

Oatmeal base, a soft teal bleed from the **top-right**, an orchid bleed from the
**bottom-left**, and an optional faint peach lift along the bottom edge. The center of the
frame stays essentially flat Oatmeal so text always sits on a calm field.

```css
background:
  radial-gradient(60% 58% at 102% -8%,  #DEEEF0 0%, rgba(222,238,240,0) 70%),
  radial-gradient(34% 52% at -6% 106%,  #F0C2F2 0%, rgba(240,194,242,0) 72%),
  radial-gradient(55% 22% at 30% 114%,  rgba(255,207,188,.45) 0%, rgba(255,207,188,0) 70%),
  #F6F3EB;
```

Measured extremes: teal corner `#E2F0F0`, orchid corner `#F2C5F2`.

### Indigo - covers and heroes

Vertical indigo `#4035C0` -> `#2B228C`, a violet `#8E7CF0` rim tracing a large curved
horizon, and a warm coral `#E8632E` bloom filling the area below that arc.

```css
background:
  radial-gradient(120% 90% at 80% -8%, #6B5AE0 0%, rgba(107,90,224,0) 60%),
  linear-gradient(170deg, #4035C0 0%, #2B228C 100%);
```

For real coral-bloom texture, render `scripts/glean_backgrounds.py --style indigo` instead of
using flat CSS.

### Sunset - section dividers and closings

Diagonal, roughly 72% horizontal / 28% vertical:

```css
background: linear-gradient(75deg, #D082C5 0%, #F374AD 42%, #FA9183 78%, #FFAC8C 100%);
```

with a cool orchid `#A67FD8` lift in the lower-left so it never reads flat.

## Pairing rules

**Do**

- Oatmeal canvas + white cards + black type + one Electric Blue accent
- Near-black band + white type + Bright Green accent
- Indigo or sunset surface + white type only

**Don't**

- Bright Green on Oatmeal or white - it fails contrast and looks acidic
- Electric Blue as a large fill or as body-copy color
- Two saturated secondaries adjacent at full strength
- Pure white page backgrounds - always warm to Oatmeal or site cream
- Gradients behind paragraph text

## Contrast

| Pair | Ratio | Verdict |
|---|---|---|
| `#000000` on `#F6F3EB` | ~19:1 | Any size |
| `#7F7F7F` on `#F6F3EB` | ~4.0:1 | Body 16px+ only; not for small or bold-critical text |
| `#343CED` on `#FFFFFF` | ~6.9:1 | Text and UI |
| `#FFFFFF` on `#343CED` | ~6.9:1 | Buttons |
| `#FFFFFF` on `#111314` | ~19:1 | Any size |
| `#D8FD49` on `#111314` | ~15:1 | Any size |
| `#D8FD49` on `#FFFFFF` | ~1.4:1 | **Fails** - never use |
