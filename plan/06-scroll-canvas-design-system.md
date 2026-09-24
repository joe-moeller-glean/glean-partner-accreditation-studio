# Glean Scroll Canvas v1 — repeatable design system for scrolling enablements

A reusable design language for **single-page, scroll-driven** enablement modules. Derived from the
current glean.com marketing site (captured 2026-09-14). Reapply this document verbatim to any other
enablement to get a sibling that looks intentional next to the first one.

This system is **additive** to `01-design-system.md`. Where the two disagree, the differences are
listed in §12 and each one is a recorded, human-owned deviation — not a silent override.

Applies to: `AGT-101` (first implementation), and every later module whose `design.system` field
reads `scroll-canvas-v1`.

---

## 1. The idea in one paragraph

A warm, quiet, editorial canvas cut by **hairlines**. Content sits in a single column of stacked
full-bleed bands. Nothing is boxed in shadow; structure comes from 1px rules, generous negative
space, and disciplined type contrast. Colour is rationed: near-monochrome by default, electric blue
only for action and the live path, one dark textured band as a tonal break, and gradient renders as
the only "imagery". Motion is a whisper — content rises 8px as it enters, once.

Feel: **product-forward, precise, spacious, confident.** Not playful, not corporate-glossy.

---

## 2. Structural signature — the band

The page is a vertical stack of **bands**. One band = one idea = one scroll beat.

```
┌─ full-bleed hairline ────────────────────────────────────────────┐
│  │                    │                              │          │  ← vertical hairline rules
│  │   eyebrow (mono)   │                              │          │
│  │   Display headline │        content / visual      │          │
│  │                    │                              │          │
└─ full-bleed hairline ────────────────────────────────────────────┘
```

Rules:
- Every band is separated by a **full-bleed 1px `--line` horizontal rule** that runs edge to edge,
  past the content container. This is the system's strongest visual tell.
- Two **vertical 1px `--line` rules** mark the content container's left and right edges and run the
  full height of the band. They create the "engineering drawing" grid from the screenshots.
- Content is capped at `--maxw` (1120px) and centred. Vertical padding `--s7` (96px), tightening to
  `--s5` (48px) below 768px.
- Bands alternate surface: `--surface` (white) → `--surface-warm` (oatmeal) → white → oatmeal, with
  **exactly one** `--ink` dark band per module as a tonal break (see §7).
- Never two adjacent bands with the same layout archetype.

---

## 3. Colour

Only approved brand tokens. No new hues.

| Role | Token | Use |
|---|---|---|
| Page surface (default) | `--surface` `#FFFFFF` | Most bands |
| Page surface (warm) | `--surface-warm` `#F6F3EB` | Alternating bands, bento sections, stat cards |
| Dark band | `--ink` `#000000` | Exactly one band per module + textured |
| Text | `--text` `#000000` | Headlines, lead copy |
| Secondary text | `--text-secondary` `#3A3A3A` | Second clause of a two-tone headline, all captions |
| Action / live path | `--action` `#343CED` | Pill CTAs, links, active rail node, progress fill |
| Action depth | `--action-hover` `#1017B1` | Hover/pressed, dark signature surfaces |
| Hairline | `--line` `#C7C7AB` | Every rule, divider, cell border |
| Emphasis rule | `--line-strong` `#000000` | Rule directly under a numbered card title |
| Success / earned | `--success` `#D8FD49` | Correct feedback, badge moment only |

Gradient renders may use the data-viz secondary palette (`--cat-*`) **inside SVG artwork only** —
never as UI chrome, background, or text colour.

**Two-tone headline** is the signature type treatment: first clause `--text`, continuation
`--text-secondary`, same size and weight, inside one sentence.
> **AI adoption is accelerating.** *AI costs are accelerating faster.*

---

## 4. Type

Same family and scale as `01-design-system.md` §2 (PolySans → DM Sans → system). Additions:

| Role | Spec | Notes |
|---|---|---|
| Band display headline | `clamp(1.75rem, 4vw, 3rem)` / 1.08 / weight 500 | Max ~12 words. Two-tone. |
| Mono eyebrow | `0.8125rem` / 1.4 / weight 400, `--font-mono`, `letter-spacing .02em` | Sentence case, `--text-secondary`. Sits above the headline with `--s2` gap. |
| Stat numeral | `clamp(2.25rem, 5vw, 3.5rem)` / 1 / weight **300** | Light weight is deliberate — the screenshots' big numbers are thin. |
| Stat caption | `0.8125rem` mono, `--text-secondary` | Below the numeral, wraps to 2 lines. |
| Card lead-in | `1rem` / 1.5 / weight 500 `--text`, followed inline by weight 400 `--text-secondary` | The "**Intelligence.** The right model for every task." pattern. |
| Numbered card index | `0.8125rem` mono `--text-secondary` | Rendered `01`, `02`, `03` — always zero-padded. |

`--font-mono:"SFMono-Regular",Menlo,Consolas,"Liberation Mono",monospace` — a **local** stack. Never
load a network font.

Sentence case everywhere including buttons. One 0.75rem all-caps eyebrow is permitted at
`0.08em` tracking, but the mono eyebrow above is preferred and used by default.

---

## 5. Line style — the hairline vocabulary

The single most reusable part of this system.

| Line | Spec | Where |
|---|---|---|
| Band divider | `1px solid var(--line)`, full-bleed | Between every band |
| Column rule | `1px solid var(--line)`, full band height | Container left/right edge; between bento columns |
| Card divider | `1px solid var(--line)` | Between a card's icon row and its text |
| Title rule | `1px solid var(--line-strong)` | Directly under a numbered card's heading |
| Cell border | `1px solid var(--line)` | Stat grid cells, share edges — never doubled |
| Row rule | `1px solid var(--line)`, 24px inset | Hairline-separated list rows (dark band uses 1px white at 20% via `--line-invert`) |

Never use a shadow to separate content. Never use a border thicker than 2px. `--border:2px` is
reserved for the active/selected state of an interactive element.

---

## 6. Component inventory (`shared/components/scroll-canvas/`)

Each is keyboard-complete, has a visible focus ring (3px `--focus`, 2px offset), and never signals
state by colour alone.

| Component | Spec |
|---|---|
| `band` | Section wrapper. Props: `surface` (white/warm/ink), `archetype`, `id`. Emits the full-bleed dividers and column rules. Has an `<h2>` slot. |
| `eyebrow` | Mono label. Optional 1px rule beneath. |
| `display-head` | Two-tone headline. Takes `lead` + `trail` strings so the tone split is data, not markup. |
| `pill-button` | Fully rounded CTA. `primary` = `--ink` fill / white text. `accent` = `--action` fill / white text. `invert` = white fill / `--ink` text (dark band only). Min height 44px, padding `0 var(--s3)`. |
| `arrow-link` | Blue text link preceded by a 20px circled arrow glyph. Underline on hover **and** focus. |
| `numbered-card` | `01` mono index · `--line-strong` rule · bold lead + muted trail. Grid of 2–3. |
| `icon-row-list` | Rows of: 20px line icon · hairline · "**Lead.** trail". The screenshots' 4-up feature strip. |
| `stat-grid` | 2×3 or 3×2 bordered cells, shared 1px edges. Light numeral + mono caption. Optional count-up (one per module, T3). |
| `bento` | Asymmetric 2-col grid on `--surface-warm`; cards carry gradient SVG fills and a card lead-in label. |
| `dark-band` | `--ink` surface + dot-grid texture, white text, `--line-invert` row rules, `invert` pills. |
| `rail` | Fixed left icon rail (≥1024px). One node per band. Active node = `--ink` fill, white icon, plus `aria-current="true"`. Collapses to a bottom progress bar below 1024px. Ships a text-equivalent `<nav>` list. |
| `reveal` | Wraps any child; fades + rises 8px on entry, once. No-ops under reduced motion. |
| `gradient-render` | Inline SVG fluid gradient band or card fill. Decorative → `aria-hidden`, or captioned when it carries meaning. |

Interactive learning components (`primitive-selector`, `decision-branch`, `hotspot-diagram`,
`sorter`, `stepper`, `myth-fact`, `checklist`, `quiz`, `badge-moment`) keep their behaviour contracts
from `01-design-system.md` §4 and are **restyled** into this system — hairlines instead of boxes,
mono labels, pill actions.

---

## 7. The one dark band

Exactly one `--ink` band per module, placed at roughly 70–80% scroll depth, immediately before the
assessment. It carries a dot-grid texture (2px dots, 12px pitch, white at 6% opacity), white type,
hairline-separated rows, and `invert` pills. Purpose: a tonal breath that signals "the teaching is
done, now you prove it." Never two dark bands. Never a dark band as the hero.

---

## 8. Motion

Inherits the T0–T3 budget from `01-design-system.md` §5. Scroll-specific rules:

- **Reveal**: opacity 0→1 + `translateY(8px)→0`, 300ms (T2), `--ease`, triggered by
  `IntersectionObserver` at 12% visibility, **once**. Never re-animates on scroll-up.
- **Rail**: active node transition ≤150ms (T1).
- **One T3 signature moment** per module — the stat count-up or the badge reveal, not both.
- **Forbidden**: scroll-jacking, parallax, pinned/sticky scroll sequences, horizontal scroll
  hijack, autoplay media, looping ambient animation, anything that moves without user scroll.
- Under `prefers-reduced-motion`, every reveal renders in final state immediately and count-ups show
  their final value. Nothing is lost.

Scroll behaviour must be **native**. The rail scrolls to a band with `scrollIntoView`; it never
takes over the wheel.

---

## 9. Progress, completion, and SCORM in a scroll module

A scroll page has no "pages", so completion must be defined explicitly and honestly.

- **Progress = deepest band actually reached**, measured by the observer, expressed as
  `visited / total` bands. It never counts bands the learner scrolled past faster than the observer
  fired, and it never counts unvisited bands. A progress indicator that lies is a release blocker.
- `cmi.core.lesson_location` = current band id (e.g. `BAND-07`).
- `cmi.suspend_data` = compact JSON: visited band ids, every interaction's state, quiz attempt state.
  On resume, the page restores interaction state **and** scrolls to the saved band.
- `cmi.core.score.raw` = quiz percentage. `cmi.core.lesson_status` = `completed`/`passed` only when
  every band is visited **and** mastery is met. Reaching the bottom alone is never mastery.

---

## 10. Accessibility

Everything in `01-design-system.md` §8 still applies, plus:

- The rail is a real `<nav>` with a list of in-page links — usable with zero JS.
- Every band is a `<section>` with `aria-labelledby` pointing at its `<h2>`.
- One `<h1>` (hero) per page; bands use `<h2>`; cards `<h3>`.
- Reveal animations must never leave content invisible if the observer never fires — default state
  is visible, and the "hidden" class is added by script only when the observer is available.
- Focus order follows DOM order, which follows scroll order. No positive `tabindex`.
- Live region announces band changes politely, not on every scroll tick.

---

## 11. Reapplying this to another enablement

1. Copy `shared/theme/scroll-canvas.css` and `shared/components/scroll-canvas/` unchanged.
2. Set `design.system: scroll-canvas-v1` in the module blueprint.
3. Choose 10–14 bands. Assign each an archetype and a surface, honouring: alternating surface,
   never two adjacent identical archetypes, exactly one dark band, exactly one T3 moment.
4. Pull the path's accent pairing, persona, and situation from `01-design-system.md` §6.
5. Write every headline as a two-tone sentence and every eyebrow as mono sentence case.
6. Replace only the gradient renders and diagram SVGs. Icons come from the shared line set.
7. Run `lint_module.py`, `validate_scorm.py`, and the scroll runtime QA harness.

Band budget by runtime: ≤30 min → 8–10 bands; 30–60 min → 10–14; >60 min → split the module.

---

## 12. Recorded deviations from `01-design-system.md` / `brand-system.md`

These are **open, human-owned** decisions. They are not self-approved.

| # | Deviation | Rationale | Status |
|---|---|---|---|
| D-1 | **Fully rounded pill CTAs.** `brand-system.md` says "avoid pill-heavy and heavily rounded shapes" and sets an 8px default radius. | Current glean.com uses fully-pill CTAs throughout; the screenshots are the newer brand expression. Implemented as `--radius-pill`. | **Needs human confirmation.** If rejected, set `--radius-pill:8px` — one token change, no markup edits. |
| D-2 | **Monospace eyebrow labels.** Not in the current type spec. | Used pervasively on the live site for eyebrows, captions, and stat labels. Local font stack only. | Needs human confirmation. |
| D-3 | **Light (300) weight stat numerals.** The scale specifies 500–600 weights. | Matches the thin large numerals in the screenshots. | Needs human confirmation. |
| D-4 | **Single-page scroll replaces paged navigation.** `01-design-system.md` assumes a screen-at-a-time shell with a step counter. | Explicit product request. Completion semantics redefined in §9 to stay honest. | Accepted for this module by request. |
| D-5 | **Dark `--ink` band with dot texture.** The existing system uses `--dark-blue` for signature dark surfaces. | The screenshots' dark section is near-black with a dot texture. | Needs human confirmation. |

No deviation touches the accessibility floor, the claim-traceability rule, or the offline/no-network
rule. Those are not negotiable and are unchanged.
