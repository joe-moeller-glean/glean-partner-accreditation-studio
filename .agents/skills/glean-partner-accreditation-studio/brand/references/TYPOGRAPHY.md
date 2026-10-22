# Typography

## Families

| Role | Family | Stack |
|---|---|---|
| Primary | **PolySans** | `'PolySans', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` |
| Workspace fallback | **DM Sans** | Use as the theme font in Google Slides/Docs, where PolySans is usually unavailable |
| Monospace accent | geometric mono | `'PolySans Mono', 'IBM Plex Mono', 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, monospace` |

PolySans is the brand typeface: a geometric sans with a low-contrast, slightly quirky
construction (note the flat-sided `g` and open apertures). DM Sans is the closest widely
available substitute and is the sanctioned fallback. If neither is present, any neutral
geometric sans is preferable to a humanist or grotesque with heavy contrast.

**Monospace matters.** The mono accessory is a defining trait of Glean layouts - it carries
eyebrow labels, URLs, stat units, and metadata. A layout with no mono element will not read
as Glean even if the colors are right. The exact brand mono is PolySans Mono; the fallbacks
above preserve the effect.

## Weights

| Weight | Use |
|---|---|
| 700 Bold | All headlines, slide headers, stat numbers, button labels |
| 500 Medium | Card titles, nav links, emphasis inside body copy |
| 400 Regular | Body copy, captions, list items |

Avoid weights below 400 and avoid italics - the brand does not use them.

## Headline treatment

- `line-height`: **1.0-1.05** for display sizes, 1.15 for card titles
- `letter-spacing`: **-0.02em** at 48px+, `-0.01em` at 28-48px, `0` below
- Sentence case, not Title Case. Periods are used inside headlines as rhythm
  (`Find what you need. Work faster.`)
- Two-tone: trailing clause in `#666666` (see `COLOR.md`)

## Body treatment

- `line-height`: **1.5-1.6**
- `max-width`: **62-68ch** - never let paragraphs run the full width of a wide layout
- Color `#7F7F7F` for support copy, `#000000` when the paragraph is the primary content

## Eyebrow / mono label

The small label above a section heading:

```css
font-family: var(--gl-font-mono);
font-size: 13px;
font-weight: 400;
letter-spacing: 0.04em;
color: #727272;
```

Written as a short declarative fragment, often two clipped sentences:
`One platform. Every team.`

## Slide type scale

Measured from the master layouts at **13.333 x 7.5in** (16:9). Sizes are points.

| Element | Size | Weight | Leading | Color |
|---|---|---|---|---|
| Cover title | **96pt** | 700 | 1.0 | `#FFFFFF` |
| Section-divider title | **88pt** | 700 | 1.0 | `#FFFFFF` |
| Closing / "Thank you" title | **72pt** | 700 | 1.0 | `#FFFFFF` |
| Content slide header | **36pt** | 700 | 1.05 | `#000000` |
| Cover subtitle | **20pt** | 700 | 1.2 | `#FFFFFF` |
| Section subtitle (mono) | **20pt** | 400 | 1.2 | `#FFFFFF` |
| Body / text area | **16pt** | 400 | 1.4 | `#000000` |
| Closing URL line (mono) | **16pt** | 400 | 1.2 | `#FFFFFF` |
| Footer | **8pt** | 400 | 1.0 | `#B0AEA2` |

Body text on a slide should not drop below 14pt; if it must, cut copy instead.

## Web type scale

Proportions measured from the marketing site, expressed as CSS pixels for a ~1440px
viewport. Scale fluidly with `clamp()` below that.

| Element | Size | Weight | Leading | Tracking |
|---|---|---|---|---|
| Hero `h1` | 64px | 700 | 1.05 | -0.02em |
| Section `h2` | 44px | 700 | 1.08 | -0.02em |
| Sub-section `h3` | 28px | 700 | 1.15 | -0.01em |
| Card title | 22px | 500 | 1.25 | 0 |
| Stat number | 56px | 700 | 1.0 | -0.02em |
| Body large | 19px | 400 | 1.55 | 0 |
| Body | 17px | 400 | 1.55 | 0 |
| Eyebrow (mono) | 13px | 400 | 1.3 | 0.04em |
| Button label | 15px | 500 | 1 | 0 |
| Legal / caption | 13px | 400 | 1.45 | 0 |

```css
h1 { font-size: clamp(2.25rem, 5.2vw, 4rem); }
h2 { font-size: clamp(1.75rem, 3.4vw, 2.75rem); }
```
