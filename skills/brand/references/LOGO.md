# Logo and icon set

## Variants in `assets/logo/`

| File | Use on |
|---|---|
| `glean-wordmark-electric-blue.png` | White and Oatmeal backgrounds - the default |
| `glean-wordmark-white.png` | Indigo, sunset, near-black, and photographic backgrounds |
| `glean-wordmark-black.png` | Single-color, print, or fax/monochrome contexts only |
| `glean-icon-electric-blue.png` | The `g` avatar mark on light backgrounds |
| `glean-icon-white.png` | The `g` avatar on dark or gradient backgrounds |
| `glean-icon-black.png` | Monochrome contexts |

The wordmark is lowercase **glean** with a detached crescent beneath the `g`. The avatar mark
is the `g` bowl plus that crescent, used where the full wordmark would be illegible
(favicons, social avatars, slide footers).

> **Provenance.** These PNGs were reconstructed from the supplied screenshots at moderate
> resolution and carry transparent alpha. They are correct in color and proportion and are
> fine for slides, web use, and mockups. For large-format print, or any use above roughly
> 600px wide, pull the official vector (SVG/EPS) files from Glean's brand resources rather
> than upscaling these.

## Clear space

- **Wordmark**: minimum clear space on all sides equals the width of the `n`. Nothing -
  type, rules, image edges, or other logos - enters that zone.
- **Avatar mark**: minimum clear space equals the inner counter (the enclosed hole) of the `g`.

## Minimum size

| Context | Minimum |
|---|---|
| Digital | **20px** tall |
| Print | **3mm** tall |

## Placement

| Surface | Position |
|---|---|
| Cover / title slide | Wordmark, **top-right** |
| Section divider | Wordmark, top-right (or omit if the divider follows a branded cover) |
| Content slide | Avatar mark, **bottom-left** - 0.58in from the left edge, 0.18in from the bottom, ~0.21in tall |
| Closing slide | Wordmark, top-right |
| Website | Wordmark, top-left of the nav |
| Favicon / avatar | Avatar mark, centered |

Never place both the wordmark and the avatar mark on the same slide.

## Misuse - never do these

- Recolor the logo to anything outside the approved variants
- Apply gradients, strokes, shadows, glows, or bevels
- Stretch, condense, rotate, skew, or otherwise distort it
- Rebuild or retype the wordmark in another typeface
- Alter the spacing between letterforms or detach/move the crescent
- Place it on a busy area of an image where contrast is insufficient
- Enclose it in a box or add a tagline as part of the lockup
- Use it as a repeating pattern or as a bullet glyph

## Trademark

Use **Glean(TM)** on first prominent mention in external marketing material. Legal entity name
is **Glean Technologies, Inc.** The standard slide footer reads:

```
Confidential | (c) Glean Technologies, Inc.
```

## Icon set

`assets/icons/glean-icons.svg` is a 28-icon SVG sprite matching the site's icon style.

**Style spec** - match this if you draw new icons:

| Property | Value |
|---|---|
| Grid | 24 x 24, ~1px optical padding |
| Stroke width | **1.75** |
| Caps / joins | `round` / `round` |
| Fill | `none` - stroke only |
| Color | `currentColor`, so CSS `color` drives it |
| Corner radius | 2-3 units on rectangles; geometric, not organic |

Icons are line-only and geometric, echoing PolySans construction. Do not mix in filled or
duotone icon families.

**Usage - sprite reference:**

```html
<svg class="gl-icon" width="24" height="24" aria-hidden="true">
  <use href="assets/icons/glean-icons.svg#gl-search"></use>
</svg>
```

```css
.gl-icon { color: #343CED; }   /* accent */
.gl-icon { color: #000000; }   /* default */
```

**Available ids:** `gl-search`, `gl-sparkle`, `gl-assistant`, `gl-agent`, `gl-chat`,
`gl-document`, `gl-connectors`, `gl-shield-lock`, `gl-key`, `gl-bolt`, `gl-chart-line`,
`gl-chart-bar`, `gl-users`, `gl-building`, `gl-workflow`, `gl-database`, `gl-check-badge`,
`gl-arrow-right`, `gl-arrow-up-right`, `gl-expand`, `gl-globe`, `gl-clock`, `gl-alert`,
`gl-layers`, `gl-code`, `gl-plug`, `gl-lightbulb`, `gl-lock`.

**On slides**, place icons in a 44px circular white chip on Oatmeal, or a near-black rounded
square (radius 12px) when you need emphasis.
