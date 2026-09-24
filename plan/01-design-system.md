# Design system — the look, feel, and rhythm of every module

Brand source of truth: current Glean Brand Resources + Brand Guide. This document is the *applied*
system: what the Brand and UI Formatter enforces and what the Experience Designer composes with.
Nothing here may override `references/brand-system.md`.

## 1. Token set (`shared/theme/tokens.css`)

```css
:root{
  /* brand core — never add a color outside this block for UI chrome */
  --blue:#343CED;        /* primary action, Glean path, active state */
  --dark-blue:#1017B1;   /* pressed/hover depth, dark signature surfaces */
  --green:#D8FD49;       /* success, badge earned, selective emphasis ONLY */
  --oatmeal:#F6F3EB;     /* warm page surface */
  --white:#FFFFFF;       /* content surface */
  --ink:#000000;         /* structure + text */
  --muted:#3A3A3A;       /* secondary text, min 4.5:1 on white/oatmeal */
  --cement:#C7C7AB;      /* hairlines, disabled, inactive path edges */

  /* semantic aliases — components reference these, never raw brand names */
  --surface:#FFFFFF; --surface-warm:#F6F3EB; --surface-invert:#1017B1;
  --text:#000000; --text-secondary:#3A3A3A; --text-invert:#FFFFFF;
  --action:#343CED; --action-hover:#1017B1; --focus:#343CED;
  --success:#D8FD49; --line:#C7C7AB; --line-strong:#000000;

  /* data-viz only — never UI chrome (diagram categories, charts) */
  --cat-1:#3FA3FF; --cat-2:#FF7E4C; --cat-3:#9300B8; --cat-4:#00B207;
  --cat-5:#54D848; --cat-6:#E16BFF; --cat-7:#FFAC8C; --cat-8:#777767;

  /* type */
  --font:"PolySans","DM Sans",-apple-system,"Segoe UI",Arial,sans-serif;
  --fs-display:2.5rem; --fs-h1:2rem; --fs-h2:1.5rem; --fs-h3:1.25rem;
  --fs-body:1rem; --fs-small:0.875rem; --fs-micro:0.75rem;
  --lh-tight:1.2; --lh-body:1.6; --measure:66ch;

  /* space + shape (8px scale) */
  --s1:8px; --s2:16px; --s3:24px; --s4:32px; --s5:48px; --s6:64px; --s7:96px;
  --radius:8px; --radius-sm:4px; --maxw:1120px; --border:2px;

  /* motion */
  --t1:150ms; --t2:300ms; --t3:600ms; --ease:cubic-bezier(.2,.7,.3,1);
}
@media (prefers-reduced-motion:reduce){
  :root{ --t1:0ms; --t2:0ms; --t3:0ms; }
}
```

Rules the linter enforces: zero hard-coded hex outside `:root`, no `border-radius` above 16px, every
`:hover` paired with `:focus-visible`, `--ink` on `--surface` ≥ 4.5:1, `prefers-reduced-motion` present.

## 2. Type scale in use

| Role | Size / line-height | Weight | Notes |
|---|---|---|---|
| Screen display (A1 cold open, A14 badge) | 2.5rem / 1.2 | 600 | Max 8 words. Sentence case. |
| Screen H1 | 2rem / 1.2 | 600 | One per screen. |
| Section H2 | 1.5rem / 1.3 | 600 | |
| Card/step H3 | 1.25rem / 1.4 | 500 | |
| Body | 1rem / 1.6 | 400 | Measure capped at 66ch. |
| Label / caption / capture-date stamp | 0.875rem / 1.5 | 500 | |
| Legal / claim ref | 0.75rem / 1.5 | 400 | `--text-secondary` |

Sentence case everywhere, including buttons. No all-caps except a single 0.75rem eyebrow label with
0.08em tracking. Never italicize product names.

## 3. Layout

12-column fluid grid, gutter `--s3`, max width `--maxw`, page padding `--s3` (mobile) → `--s5` (≥1024px).

Persistent chrome:
- **Header (64px):** Glean wordmark (approved file, 24px tall, one "N" clear space) · module title ·
  step counter "4 / 11" · segmented progress rail. Progress reflects *completed* screens only — a
  progress bar that lies is a release blocker.
- **Footer (72px):** Back · current objective (truncated, full text on focus) · single primary Next.
- **Objective chip:** persistent top-left of the content area, shows the active `OBJ-nn` in plain words.

Breakpoints: 320 (single column, chrome collapses to icon + sheet), 768 (2-col), 1024 (full 12-col +
side rail for path map). Everything must survive 200% zoom and 400% reflow.

## 4. Component inventory (`shared/components/`)

| Component | Spec |
|---|---|
| `path-map` | Nodes = modules, edges = prerequisites, milestone diamonds = badges. Current node: `--blue` fill, white label, 2px `--ink` ring. Completed: `--green` dot + check glyph. Locked: `--cement` outline, `aria-disabled`. Keyboard: arrow keys traverse, Enter opens summary. Ships a `<table>` text equivalent. |
| `screen-shell` | Grid wrapper, H1 slot, media slot, body slot, action slot. Enforces `--measure`. |
| `callout` | 4px left border. Info `--blue`, success `--green` + `--ink` text, caution `--cat-2`. Always leads with a word, never color alone. |
| `hotspot-diagram` | SVG + absolutely positioned buttons. Each hotspot: 44px min target, numbered blue pill, `aria-expanded`, focus ring 3px `--focus` offset 2px. Panel opens below on narrow. |
| `decision-branch` | Radio-group semantics, per-branch consequence panel, "reconsider" affordance that never erases the first answer's feedback. |
| `sorter` | Two-list categorize. Drag optional; keyboard path is primary (select item → choose bucket → Enter). Live region announces "Moved X to Y". |
| `compare-slider` | Two labeled columns; the slider is progressive enhancement only — both columns readable at once on narrow/keyboard. |
| `sim-stepper` | Numbered steps over a real annotated capture. Prev/Next, step state persisted to suspend data. |
| `fade-out-example` | 3 stages: full worked example → partial with blanks → learner completes. Stage state persisted. |
| `self-check` | Question + 2-point confidence ("sure" / "not sure"); confidence is recorded to suspend data and drives the Carry screen's review list. Never scored. |
| `quiz` | One item per view, no timer, reshuffled retries, per-option explanatory feedback on final attempt, keyboard-complete, `role="status"` result announcement. |
| `job-aid` | On-screen summary + local download (no network). |
| `badge-moment` | The one T3 reveal. Static fallback under reduced motion. |

## 5. Motion budget

| Tier | Duration | Allowed use |
|---|---|---|
| T0 | 0 | Dense text, tables, diagrams at rest |
| T1 | ≤150ms | Hover, focus, selection, correctness tick |
| T2 | ≤300ms | Screen advance, panel/hotspot reveal, step change, path-map traversal |
| T3 | ≤600ms | Exactly one signature moment per module |

All tiers → T0 under `prefers-reduced-motion`. Motion never carries meaning alone. No parallax, no
scroll-jacking, no autoplay, no looping ambient animation.

## 6. Path style cards (one per learning path, authored once)

Each card fixes: accent pairing, icon subset, recurring persona, recurring customer situation,
signature-moment convention, and terminology list. Sibling modules are diffed against the card by
Brand-UI sub-agent 11h.

| Path | Accent + surface | Recurring persona | Recurring customer situation | Signature moment |
|---|---|---|---|---|
| Program Foundations | `--blue` on `--oatmeal` | Priya, new partner practice lead | "Northwind" mid-market manufacturer starting AI program | Path map lights up all five paths |
| Seller Path | `--blue` + `--green` accents on white | Marcus, partner AE | Northwind CIO evaluating Glean vs bundled AI | Value pitch scorecard assembles |
| Solution Advisor Path | `--blue` on `--oatmeal`, `--cat-1` for data categories | Dana, solution advisor | Northwind's 6 candidate use cases needing prioritization | Use-case matrix resolves into a sequenced roadmap |
| Technical Architect Path | `--ink` structure, `--blue` data path, `--dark-blue` signature surface | Sam, partner architect | Northwind's security review + network constraints | Architecture diagram assembles layer by layer |
| Builder Path | `--blue` with `--cat-4` success states | Alex, partner builder | Northwind's ticket-triage agent request | Agent run trace completes end to end |
| Delivery Lead Path | `--oatmeal` surfaces, `--blue` milestones | Ravi, delivery lead | Northwind 90-day rollout | Delivery timeline snaps into phases |
| Admin & Support Path | `--cement` structure, `--blue` action | Nia, platform admin | Northwind week-2 access incident | Runbook resolves the incident |
| Industry / Department | `--blue` + one `--cat-*` per vertical/function | Reuses the path persona above | Vertical-specific Northwind analogue | Pattern card flips to a scoped play |

One persona family ("Northwind" + named humans) runs the whole portfolio so learners build
continuity. No real customer names unless the source is public and cleared.

## 7. Screen archetype assignment discipline

Minimum 4 distinct archetypes per module; 6 if runtime >45 min. Never 3 of the same in a row (rule
allows 2). Alternate density: text-forward screen → visual/interactive screen. Exactly one T3
signature moment. Standard spine: A1 Hook → A2 Contract → A3/A4 Model → A8/A9/A12 Practice →
A6/A7 Apply → quiz Prove → A13 + A14 Carry.

Level tuning: 100-level uses shorter chunks, more scaffolding, more A3/A12; 200+ front-loads A1/A6/A7
and cuts explanation; 300-level is lab-dominant with A7 + rubric-scored artifacts.

## 8. Accessibility floor (non-negotiable)

4.5:1 text / 3:1 non-text contrast · visible 3px focus ring at 2px offset · never state by color
alone (always pair with icon or text) · full keyboard path including the assessment · 44px min
targets · legible at 200% zoom and 320px width · captions + transcript for any media · no timeouts ·
`prefers-reduced-motion` honored · every interaction restores exactly on resume.
