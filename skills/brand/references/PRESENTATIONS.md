# Presentations

Exact geometry for the seven master layouts, measured from the template screenshots in
`assets/reference/slides/`. All values are inches on a **13.333 x 7.5in** (16:9) canvas.

Shared conventions:

- Content side margin **0.57in**; cover/section side inset **0.92in**
- Footer, on content slides only: `Confidential | (c) Glean Technologies, Inc.`
  8pt, `#B0AEA2`, right-aligned ending at 12.70in, baseline ~7.28in
- Avatar logo, content slides only: 0.58in from left, 0.18in from bottom, 0.21in tall
- Wordmark, cover/section/closing: top-right, ~1.32in wide, right edge at 12.70in, top 0.46in
- **Never** number slides
- Decks always open with an intro slide and close with a thank-you slide

---

## 1. Cover / title - `01-title-slide.png`

**Background:** indigo surface (`glean-bg-indigo.png`).

| Element | Position | Type |
|---|---|---|
| Title | left 0.92in, top 2.05in, width 10.2in | 96pt / 700 / 1.0 / white |
| Subtitle | left 0.92in, top ~5.24in | 20pt / 700 / white |
| Wordmark | top-right | white variant |

Title runs one or two lines. Keep it to six words or fewer.

---

## 2. Section divider - `02-section-divider.png`

**Background:** sunset surface (`glean-bg-sunset.png`).

| Element | Position | Type |
|---|---|---|
| Section title | left 0.88in, top 2.34in | 88pt / 700 / 1.0 / white |
| Section subtitle | left 0.88in, top ~5.10in | 20pt / 400 **mono** / white |

The mono subtitle is what distinguishes a divider from a cover. Use it for a one-line framing
statement, not a sentence of prose.

---

## 3. Content, three column - `03-content-three-column.png`

**Background:** oatmeal surface (`glean-bg-oatmeal.png`).

| Element | Position | Type |
|---|---|---|
| Slide header | left 0.57in, top 0.64in | 36pt / 700 / `#000` |
| Column 1 | left 0.57in, top 3.16in, width 3.87in | 16pt / 400 / `#000` |
| Column 2 | left 4.73in, same | 16pt / 400 |
| Column 3 | left 8.90in, same | 16pt / 400 |
| Footer + avatar logo | as shared | - |

Columns begin well below the header - roughly 42% down the slide - which is what gives the
layout its air. Do not pull them up to close the gap. Optionally top each column with a 44px
icon chip or a mono numeral.

---

## 4. Content, text + image - `04-content-text-plus-image.png`

| Element | Position |
|---|---|
| Slide header | left 0.57in, top 0.64in, 36pt / 700 |
| Body text | left 0.57in, top ~2.26in, width ~4.6in, 16pt |
| Image frame | left ~5.62in, top 1.96in, to right margin 12.76in, height ~5.12in |

Image frame: 8px radius, fill `#EDEDED` while empty. Images should be cropped to fill.

---

## 5. Content, two image - `05-content-two-image.png`

| Element | Position |
|---|---|
| Slide header | left 0.57in, top 0.64in |
| Left frame | left 0.47in, top 1.96in, width 6.12in, height 5.12in |
| Right frame | left 6.71in, same dimensions |

Gutter between frames ~0.12in. Use for before/after or paired comparisons.

---

## 6. Content, full-bleed image + caption - `06-content-full-bleed-image.png`

| Element | Position |
|---|---|
| Slide header | left 0.57in, top 0.64in |
| Image frame | left 0.47in, top 1.96in, width 12.42in, height 5.12in |
| Caption | inset inside the frame's lower edge, left 0.72in, ~16pt |

Best for a single architecture diagram or product screenshot.

---

## 7. Closing / thank you - `07-thank-you.png`

**Background:** indigo or sunset surface, full bleed, high-saturation.

| Element | Position | Type |
|---|---|---|
| Title | **centered**, top ~2.87in | 72pt / 700 / white |
| Subtitle | centered, top ~4.15in, 2 lines | 20pt / 400 / 1.15 / white |
| Link line | centered, top ~6.65in | 16pt / 400 **mono** / white |
| Wordmark | top-right | white variant |

This is the only layout that centers its type. The mono link line typically carries two
destinations separated by a pipe, e.g. `trust.glean.com | developers.glean.com`.

---

## Building PPTX

`scripts/glean_pptx_theme.py` is a helper library over `python-pptx`. It encodes every value
above so you never hand-place shapes.

```python
from glean_pptx_theme import GleanDeck

deck = GleanDeck()                                  # 13.333 x 7.5in, brand theme
deck.cover("Partner-Led Services", "Operating model review - Q4")
deck.section("Where we are today", "Three findings. One decision.")
deck.three_column(
    "What changed this quarter",
    [("Readiness", "Nine partners completed the technical track."),
     ("Packaging", "Two SKUs are live; a third is in review."),
     ("Delivery",  "First partner-led deployment closed in 6 weeks.")],
)
deck.text_and_image("How the motion works", "Partners own discovery and deployment...",
                    image="diagram.png")
deck.thank_you("Thank you", "Let's build the super intelligent enterprise - together",
               links="trust.glean.com | developers.glean.com")
deck.save("partner-services.pptx")
```

Run `python3 scripts/glean_pptx_theme.py --demo out.pptx` to produce a sample deck
exercising all seven layouts.

## Building Google Slides

Google Slides usually lacks PolySans, so:

1. Set the theme font to **DM Sans** (Slides > Theme > text style).
2. Set page setup to **Widescreen 16:9**.
3. Import `assets/backgrounds/glean-bg-{oatmeal,indigo,sunset}.png` as layout backgrounds
   (Slide > Change background > Image).
4. Recreate the seven masters in the theme editor using the inch values above - Slides
   accepts inches directly in the size/position panel.
5. Add the avatar logo to content masters and the wordmark to cover/section/closing masters.

## Building HTML decks

Use `assets/css/glean-brand.css` with fixed 1280x720 slide frames (a 96 DPI equivalent of
13.333 x 7.5in), which makes every inch value above translate at **96px per inch**:

```html
<section class="gl-slide gl-surface-oatmeal">
  <h2 class="gl-slide-header">Slide header</h2>
  <div class="gl-slide-cols">...</div>
  <footer class="gl-slide-footer">Confidential | &copy; Glean Technologies, Inc.</footer>
</section>
```

`.gl-slide` is 1280x720 with 55px (0.57in) side padding, matching the masters.
