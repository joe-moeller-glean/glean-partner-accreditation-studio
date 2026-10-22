# Imagery, infographics, and art direction

## Infographics and diagrams

**Canvas.** Oatmeal `#F6F3EB` with the standard corner washes. Pad generously - at least 6%
of the shorter edge on every side.

**Line work.**

| Property | Value |
|---|---|
| Primary stroke | 2px, `#000000` |
| Secondary / connector | 1.5px, `rgba(0,0,0,0.35)` |
| Emphasis stroke | 2px, `#343CED` |
| Caps / joins | round |
| Arrowheads | simple open chevrons, ~8px, matching stroke |
| Dashed | `6 4` dash array, for planned/optional paths only |

**Nodes.** White fill, 12px radius, hairline `rgba(0,0,0,0.12)` border, 16px padding. Node
titles 15px/500 `#000`; supporting text 13px/400 `#7F7F7F`. Never shadow a node more than
`0 1px 2px rgba(0,0,0,0.06)`.

**Emphasis discipline.** Exactly one element per diagram may carry Electric Blue. If two
things are important, the diagram is doing too much - split it.

**Labels.** Category and step labels use the mono stack at 13px, `#727272`. Numerals for
sequences are mono (`01`, `02`, `03`), never circled digits.

**Layer / tier diagrams.** Stack horizontal bands with 8px gaps. Bands alternate white and
`#F8F8F8`; the band you are drawing attention to gets a 2px `#343CED` left border.

**Do not**

- Use gradients inside functional diagram shapes - gradients belong to backgrounds only
- Use drop shadows for depth; use hairlines and spacing
- Fill more than ~55% of the canvas
- Mix icon families or introduce filled icons alongside the line set
- Use more than three secondary colors in one graphic

## Data visualization in images

Follow the chart rules in `WEB.md`. For static export: 2x resolution, transparent or Oatmeal
background, and mono axis labels at a minimum of 13px at final display size.

## Abstract and hero art direction

Glean's photographic language is **rendered 3D, not stock photography**. The recurring motif:

- A **massive smooth form** - a sphere, torus, or sweeping band - occupying most of the frame
- A **dense field of fine particles or filaments** clinging to that form, reading almost
  like velvet or coral
- **Extreme color contrast** between the smooth surface and the particle field: deep
  indigo/violet surfaces against hot coral and magenta particles
- Shallow depth of field, with the particle field falling out of focus toward the edges
- A single strong curved edge - the "horizon" - dividing the composition asymmetrically,
  roughly along a diagonal

**Palette for hero art:** indigo `#4035C0`, deep indigo `#2B228C`, violet `#6B5AE0`, coral
`#E8632E`, hot magenta `#F374AD`, salmon `#FA9183`.

**Type over art.** Always white, always with enough space that the type sits over the smooth
region rather than the busy particle field. If it cannot, reposition the type - do not add a
scrim or lower the art's contrast.

### Generating brand backgrounds

```bash
python3 scripts/glean_backgrounds.py --style indigo  --width 3840 --height 2160 --out hero.png
python3 scripts/glean_backgrounds.py --style sunset  --width 1920 --height 1080 --out divider.png
python3 scripts/glean_backgrounds.py --style oatmeal --width 1920 --height 1080 --out canvas.png
```

### Prompting an image model for Glean-style art

When generating rather than rendering, anchor on the motif and the palette:

> Abstract 3D render, macro photograph of a colossal smooth indigo torus sweeping diagonally
> across the frame, its surface densely covered in fine hot-coral and magenta filaments like
> velvet coral, deep violet shadows, shallow depth of field, soft studio lighting, no text,
> no logos, high detail, 16:9

Vary the form (sphere / band / ripple) and the particle color (coral, magenta, chartreuse)
but keep the indigo-versus-warm contrast and the single curved dividing edge.

**Avoid** in generated imagery: literal robots, glowing brains, circuit-board motifs, blue
network-node clichés, humans at laptops, and any embedded text.

## Social and share cards

| Property | Value |
|---|---|
| Size | 1200 x 630 |
| Background | Oatmeal with corner washes, or indigo for announcements |
| Padding | 64px |
| Headline | 52px/700, max 3 lines, `#000` on Oatmeal / white on indigo |
| Eyebrow | 15px mono, `#727272` on Oatmeal / `rgba(255,255,255,.7)` on indigo |
| Logo | Wordmark, bottom-left, 120px wide |

Keep share-card copy under twelve words.
