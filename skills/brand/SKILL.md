---
description: Apply Glean's visual identity - Electric Blue / Oatmeal palette, PolySans typography, corner-wash gradients, logo rules, and the line-icon set - to images and infographics, websites and interactive dashboards, and presentations (PPTX, Google Slides, HTML decks). Use whenever a deliverable needs to look on-brand for Glean.
name: Glean Branding Style 2026
---
# Glean Brand Style

Reapply Glean's visual system to any deliverable. Every value in this skill was measured
from Glean's own slide masters and marketing site, then reconciled against the official
brand palette and logo rules.

## When to use

Load this skill whenever you are producing or restyling:

- **Images and infographics** - diagrams, architecture views, process flows, social cards
- **Websites and interactive dashboards** - landing pages, HTML widgets, metric dashboards
- **Presentations** - `.pptx`, Google Slides, and HTML decks

If the user says "make it on-brand", "Glean-branded", "use our template", or names Glean
colors/fonts, this skill applies.

## Non-negotiables

These eight rules carry most of the brand. Apply them before reaching for anything else.

1. **One warm canvas, not white.** Default background is **Oatmeal `#F6F3EB`**, not `#FFFFFF`.
   Pure white is reserved for cards and panels that sit *on* Oatmeal.
2. **Electric Blue `#343CED` is an accent, never a wash.** Use it for the logo, links,
   primary buttons, and a single point of emphasis per view. Never fill a slide or hero with it.
3. **Black type, gray support.** Headlines are `#000000`. Secondary copy is `#7F7F7F`.
   Never use blue for body text.
4. **Corner washes, never center gradients.** Light surfaces get a soft teal bleed from the
   **top-right** and an orchid bleed from the **bottom-left** corner. The middle stays calm.
5. **Type is PolySans** (fallback DM Sans). Headlines are tight: `line-height` 1.0-1.05 and
   slightly negative tracking. See `references/TYPOGRAPHY.md`.
6. **Monospace is a deliberate accessory.** Eyebrow labels, URLs, stats, and metadata use a
   geometric mono. It is what makes the layouts read as Glean rather than generic SaaS.
7. **Generous margins, few elements.** Slides use a 0.57in side margin and rarely exceed
   three content blocks. Prefer whitespace over filling the frame.
8. **Logo is bottom-left on content, top-right on covers.** Respect clear space and never
   recolor it. See `references/LOGO.md`.

## Pick the surface first

| Surface | Use for | Background |
|---|---|---|
| **Oatmeal** | Content slides, docs, dashboards, infographics (the default) | `#F6F3EB` + teal TR / orchid BL corner washes |
| **Indigo** | Cover and title slides, hero images | Indigo `#4035C0` -> `#2B228C` with a coral bloom under a curved horizon |
| **Sunset** | Section dividers, closing/"thank you" slides | Diagonal orchid `#D082C5` -> magenta `#F374AD` -> salmon `#FA9183` |
| **Near-black** | One high-contrast band per page (CTA, stats, resources) | `#111314` with white type and Bright Green `#D8FD49` accents |

Generate any of these as a real image:

```bash
python3 scripts/glean_backgrounds.py --style oatmeal --width 1920 --height 1080 --out bg.png
python3 scripts/glean_backgrounds.py --all --outdir ./out --width 3840 --height 2160
```

Pre-rendered 1920x1080 versions already exist in `assets/backgrounds/`.

## Workflow by deliverable

### Websites, dashboards, and HTML decks

1. Link or inline `assets/css/glean-brand.css`. It defines every brand token as a CSS custom
   property plus ready-made `.gl-*` component classes (buttons, cards, eyebrow, stat, pill,
   dark band, corner washes).
2. Build with the tokens (`var(--gl-oatmeal)`, `var(--gl-blue)`), never raw hex.
3. Follow the page rhythm in `references/WEB.md`: alternating Oatmeal and white sections,
   one near-black band, cards with 16px radius and hairline `rgba(0,0,0,0.12)` borders.
4. Use icons from `assets/icons/glean-icons.svg` via `<use href="...#gl-search">`.

### Presentations

Read `references/PRESENTATIONS.md` - it contains exact geometry for all seven master
layouts (cover, section, three-column, text+image, two-image, full-bleed image, thank you)
in inches, so decks match the real template.

- **PPTX**: use `scripts/glean_pptx_theme.py` as a helper library. It applies the palette,
  fonts, margins, footer, and logo placement, and exposes one function per layout.
- **Google Slides**: same geometry; set the theme font to **DM Sans** (PolySans is usually
  unavailable in Workspace) and import `assets/backgrounds/*.png` as layout backgrounds.
- **HTML decks**: use the brand CSS with `1280x720` slide frames and the same margins.

Per Joe's standing preference, every generated deck includes an **intro slide** and a
**thank-you slide**.

### Images and infographics

Read `references/IMAGERY.md`. Core rules: Oatmeal canvas, black line work at 2px, one
Electric Blue accent, mono labels, generous padding, and no drop shadows deeper than
`0 1px 2px rgba(0,0,0,0.06)`. For photographic or abstract hero art, use the indigo/sunset
3D fluid-and-particle direction rather than stock photography.

## Asset inventory

```
assets/
  backgrounds/   glean-bg-oatmeal.png, -indigo.png, -sunset.png   (1920x1080)
  css/           glean-brand.css        tokens + components
  icons/         glean-icons.svg        24x24 line-icon sprite (28 icons)
  logo/          glean-wordmark-{electric-blue,white,black}.png
                 glean-icon-{electric-blue,white,black}.png
  reference/
    slides/      01-title .. 07-thank-you        the seven master layouts
    web/         01-homepage-hero .. 06-dark-band  marketing-site patterns
```

`assets/reference/` holds the source screenshots this system was derived from. Consult them
whenever a judgment call is ambiguous - they are the ground truth.

## References

| File | Contents |
|---|---|
| `references/COLOR.md` | Full palette with hex/RGB, semantic roles, pairings, contrast, gradient recipes |
| `references/TYPOGRAPHY.md` | PolySans/DM Sans stacks, weights, measured type scales for slides and web |
| `references/LAYOUT.md` | Grids, margins, spacing scale, radii, borders, elevation, component anatomy |
| `references/LOGO.md` | Logo variants, clear space, minimum sizes, placement, misuse |
| `references/PRESENTATIONS.md` | Exact per-layout slide geometry in inches for all seven masters |
| `references/WEB.md` | Site and dashboard section patterns, nav, cards, buttons, dark bands |
| `references/IMAGERY.md` | Infographic construction rules and 3D/gradient art direction |

## QA checklist

Before delivering, verify:

- [ ] Background is Oatmeal (or a deliberate indigo/sunset/near-black surface), not white
- [ ] Electric Blue appears as an accent only, and at most once per view as emphasis
- [ ] Headlines use PolySans/DM Sans, tight leading, negative tracking
- [ ] At least one monospace element (eyebrow, stat, or URL) is present
- [ ] Corner washes bleed from top-right and bottom-left, leaving the center calm
- [ ] Logo is correctly placed, unrecolored, with clear space respected
- [ ] Body text contrast is sufficient (`#7F7F7F` only at 16px+; use `#000` when smaller)
- [ ] Slides: 0.57in side margins, footer line present, no more than three content blocks
- [ ] Decks include an intro slide and a thank-you slide