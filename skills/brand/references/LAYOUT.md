# Layout, spacing, and components

## Spacing scale

A 4px base with an 8px rhythm. Use these steps only.

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

| Token | px | Use |
|---|---|---|
| `--gl-space-1` | 4 | Icon-to-label, tight inline gaps |
| `--gl-space-2` | 8 | Chip padding, list item gaps |
| `--gl-space-3` | 12 | Compact card padding |
| `--gl-space-4` | 16 | Default card padding, grid gutters |
| `--gl-space-5` | 24 | Card padding (comfortable), inter-card gap |
| `--gl-space-6` | 32 | Sub-section spacing |
| `--gl-space-7` | 48 | Heading-to-content |
| `--gl-space-8` | 64 | Between content blocks |
| `--gl-space-9` | 96 | Section padding (vertical) |
| `--gl-space-10` | 128 | Hero padding, major section breaks |

## Radii

| Token | Value | Applies to |
|---|---|---|
| `--gl-radius-sm` | 8px | Buttons in nav, chips, small inputs |
| `--gl-radius-md` | 12px | Icon tiles, inner panels, image placeholders on slides |
| `--gl-radius-lg` | 16px | Cards, bento tiles, dashboard panels |
| `--gl-radius-xl` | 24px | Large feature panels, media frames |
| `--gl-radius-pill` | 999px | In-page CTAs, filter pills, tags |

Slide-side note: measured card/placeholder radius on the masters is ~8px at 1435px wide,
i.e. **0.08in / ~6pt** at 13.333in. Keep slide radii subtle.

## Borders and elevation

The system is **flat and hairline-driven**, not shadow-driven.

```css
--gl-border: 1px solid rgba(0, 0, 0, 0.12);
--gl-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
--gl-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);   /* hover / floating only */
```

- Cards on Oatmeal: white fill + hairline border, **no shadow**
- Cards on white: Oatmeal or `#F8F8F8` fill + hairline border
- Never stack a border and a heavy shadow on the same element
- Card grids often share single hairline dividers rather than giving each card its own box

## Grid

### Web

- Max content width **1280px**, centered, with 24px gutters (32px at >=1440px)
- 12-column grid; common splits are 6/6, 8/4, 4/4/4, and 3/3/3/3
- Section vertical padding: 96px desktop, 64px tablet, 48px mobile
- Bento grids mix tile spans (2x1, 1x1, 1x2) inside the same 12-column frame

### Slides (13.333 x 7.5in)

| Measure | Value |
|---|---|
| Side margin (content slides) | **0.57in** |
| Side inset (cover / section slides) | **0.92in** |
| Usable content width | 12.20in |
| Header baseline zone | top 0.64in |
| Three-column pitch | 4.16in (col width 3.87in, gutter 0.29in) |
| Column left edges | 0.57in / 4.73in / 8.90in |
| Footer text | right-aligned, ends at 12.70in, 8pt |
| Avatar logo | 0.58in from left, 0.18in from bottom, 0.21in tall |

## Component anatomy

### Button

| Variant | Fill | Text | Radius | Height | Padding |
|---|---|---|---|---|---|
| Primary (nav) | `#343CED` | `#FFFFFF` | 8px | 44px | 0 20px |
| Primary (in-page) | `#000000` | `#FFFFFF` | pill | 48px | 0 28px |
| Secondary | transparent, hairline border | `#000000` | pill | 48px | 0 28px |
| On dark | `#FFFFFF` | `#000000` | pill | 48px | 0 28px |
| Accent | `#D8FD49` | `#000000` | pill | 48px | 0 28px |

Label 15px / weight 500. Hover: darken fill ~8% or, for secondary, fill with
`rgba(0,0,0,0.04)`. No transform, no shadow bloom.

### Card

```
16px radius · white fill · 1px rgba(0,0,0,.12) border · 24px padding
  [optional 44px icon chip or 40px near-black icon tile]
  22px/500 title
  17px/400 #7F7F7F body, max 62ch
  [optional text link in #343CED with a trailing arrow]
```

### Stat block

```
13px mono eyebrow #727272
56px/700 number in #000 (or #D8FD49 on near-black)
17px/400 #7F7F7F label
```

Stats sit in 3- or 4-up rows separated by hairline vertical dividers.

### Numbered card

Used for sequenced content (steps, pillars). A large mono numeral `01` / `02` / `03` in
`#727272` above the title, hairline divider beneath, generous 32px padding.

### Icon chip

- On Oatmeal: 44px white circle, hairline border, 20px line icon in `#000` or `#343CED`
- Emphasis: 40px near-black rounded square (12px radius), 20px white line icon

## Responsive behavior

| Breakpoint | Behavior |
|---|---|
| >= 1440px | Full 12-col, 32px gutters, 1280px cap |
| 1024-1439px | 12-col, 24px gutters |
| 768-1023px | 4/4/4 collapses to 6/6; bento becomes 2-up |
| < 768px | Single column, 48px section padding, hero `h1` ~36px |

Corner washes should be reduced, not removed, on mobile - scale the radial sizes down so the
center of the viewport stays calm.
