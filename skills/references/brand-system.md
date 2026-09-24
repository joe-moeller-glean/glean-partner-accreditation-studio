# Glean module brand system

Source of truth: the current [Brand Resources](https://www.glean.com/brand-resources) page and the current Glean Brand Guide. Older brand decks are reference only and never override the current resource.

## Tokens
```css
--blue:#343CED;   /* Electric Blue - primary action, Glean path */
--green:#D8FD49;  /* Bright Green - selective emphasis, success, badge */
--oatmeal:#F6F3EB;/* Oatmeal - warm page surface */
--white:#FFFFFF;  /* content surface */
--ink:#000000;    /* structure and text */
--dark-blue:#1017B1; --cement:#C7C7AB; --muted:#3A3A3A;
--line-control:#777767; /* interactive boundary; must meet 3:1 non-text contrast */
--font:"PolySans","DM Sans",-apple-system,Segoe UI,Arial,sans-serif;
--radius:8px; --radius-pill:999px; --space:8px; --maxw:1120px; --line:60ch;
```
Secondary palette (`#00B207`, `#FF7E4C`, `#9300B8`, `#1017B1`, `#777767`, `#54D848`, `#FFAC8C`, `#E16BFF`, `#3FA3FF`, `#C7C7AB`) is permitted only to distinguish data categories in charts and diagrams — never for UI chrome, buttons, or backgrounds.

## Type
PolySans when licensed files are supplied; otherwise DM Sans with a local system fallback. Never load a network font. Sentence case for headings and UI. Body line length 60–80 characters. One clear type scale per module, reused across the path.

## Logo
Use the approved wordmark when space permits, the avatar when it does not, never both in one lockup. Minimum 20px digital / 3mm print. Clear space equals the width of the "N" in the wordmark (the inner counter of the "g" for the avatar). Never recolor, set in black, skew, stretch, rotate, resize characters, add gradients or effects, or add a ™. Never generate the logo — place the approved file.

## Layout and feel
Clean, spacious, product-forward, crisp edges. Default 8px radius; avoid pill-heavy and heavily rounded shapes. Generous negative space. Approved Flow Line, depth, blur, and illustration treatments only, unmodified.

For `scroll-canvas-v1`, use full-bleed bands, 1px decorative hairlines, vertical container rules, and
one dark tonal band. A fully rounded CTA is a human-owned deviation, not a global default. Keep
`--line` for decorative structure and `--line-control` for interactive boundaries; the cement hairline
measures about 1.72:1 against white and is not sufficient as a control boundary.

## Voice
Bold, smart, delightful, precise, encouraging. Explain, never lecture. Feedback always explains why. Praise is specific, never generic.

## Accessibility floor
4.5:1 text contrast and 3:1 non-text contrast, visible keyboard focus states, never state by color alone, `prefers-reduced-motion` honored, keyboard-complete, legible at 200% zoom and 320px width, and at least 24px control targets. Test keyboard focus itself; programmatic focus does not necessarily match `:focus-visible`.

## Related
Creative layout, archetypes, and motion budget: `experience-design.md`. Image, diagram, icon, and media specs: `graphics-system.md`.
