# Websites and dashboards

Patterns derived from `assets/reference/web/`. Import `assets/css/glean-brand.css` and build
from the tokens.

## Page rhythm

Glean pages alternate calm and loud bands. A typical marketing page runs:

1. **Navy announcement bar** - `#02065E`, ~40px, centered 13px white text, one inline link
2. **Nav** - white or transparent, wordmark left, links center, CTA right
3. **Hero** - site cream `#FAF6F4`, mono eyebrow, 64px two-tone headline, body, two CTAs
4. **Logo strip** - customer marks in a single muted row
5. **Stat grid** - 3- or 4-up, hairline dividers, 56px numerals
6. **Feature bento** - mixed-span tiles on Oatmeal, white cards
7. **Split panel** - 6/6 text + numbered cards, or media + copy
8. **Near-black band** - `#111314`, white type, Bright Green accents, one strong CTA
9. **Resource columns** - 3-up links with mono category labels
10. **Footer** - near-black or Oatmeal, multi-column link lists, small legal line

Use **exactly one** near-black band per page. Two makes the page feel striped.

## Navigation

```
height 72px · background #FFFFFF (or transparent over hero) · hairline bottom border
left:   wordmark, 28px tall
center: links 15px/500 #000, 32px gaps, hover -> #343CED
right:  ghost "Sign in" link + primary button "Get a demo"
        (#343CED fill, white label, 8px radius, 44px tall)
```

Dropdown menus are white panels with 16px radius, hairline border, and `--gl-shadow-md`.

## Hero

```
mono eyebrow 13px #727272
h1 64px/700/1.05, tracking -0.02em, two-tone (#000 + #666666)
body 19px/400/1.55 #7F7F7F, max 58ch
CTA row: black pill primary + hairline-bordered secondary, 12px gap
```

Background is site cream with the standard corner washes. Hero art, when present, sits right
of a 7/5 split and uses the indigo or sunset 3D direction - not stock photography.

## Cards and bento

- Tile fill `#FFFFFF` on Oatmeal sections; `#F8F8F8` on white sections
- 16px radius, hairline border, 24-32px padding, **no shadow** at rest
- Hover: border darkens to `rgba(0,0,0,0.2)` and `--gl-shadow-md` appears
- Each tile: icon chip -> 22px title -> 17px gray body -> optional blue text link with arrow
- Bento mixes spans (`2x1`, `1x1`, `1x2`); keep one tile visually dominant per grid

## Near-black band

```css
background: #111314;
color: #FFFFFF;
padding: 96px 0;
```

- Headline white, 44px/700
- Body `rgba(255,255,255,0.72)`
- Accent numerals or highlights in Bright Green `#D8FD49`
- CTA: white pill with black label
- Inner panels: `rgba(255,255,255,0.06)` fill with `rgba(255,255,255,0.12)` border

## Dashboards

Dashboards keep the same tokens but tighten the rhythm.

| Element | Spec |
|---|---|
| Page background | Oatmeal `#F6F3EB` |
| Panel | White, 16px radius, hairline border, 20px padding |
| Panel title | 15px/500 `#000`, with a 13px mono unit label in `#727272` |
| KPI number | 40px/700 `#000`; delta in `#00B207` (up) or `#FF7E4C` (down) |
| Table header | 13px mono `#727272`, uppercase off, hairline bottom border |
| Table row | 15px, 44px row height, hairline dividers, hover `rgba(0,0,0,0.03)` |
| Filter pills | Pill radius, hairline border; active state `#343CED` fill + white label |
| Grid | 12-col, 16px gutters, 16px page padding |

**Charts**

- Series in the `COLOR.md` chart sequence, starting `#343CED`
- Gridlines `rgba(0,0,0,0.08)`, 1px, horizontal only
- Axis labels 13px mono `#727272`
- No 3D, no gradient fills under lines beyond a 12% opacity tint of the series color
- Bars: 8px top radius; lines: 2px stroke, round caps, no point markers unless interactive

## Accessibility

- Focus ring: `0 0 0 3px rgba(52,60,237,0.35)` - never remove focus styles
- Hit targets >= 44x44px
- Do not use color alone to signal state; pair with an icon or label
- Body gray `#7F7F7F` only at 16px+; use `#000` for smaller text
- Respect `prefers-reduced-motion` - the brand's animation is subtle by default
