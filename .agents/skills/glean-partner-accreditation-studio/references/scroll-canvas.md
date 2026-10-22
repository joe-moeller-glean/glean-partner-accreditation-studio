# Scroll Canvas v1

Reusable design and runtime contract for a single-page scrolling accreditation module.
The first implementation is AGT-101 — Glean Agents Foundations. Use this system only when
`module.json.design_system` and `module.yaml.design_system` are `scroll-canvas-v1`.

## When to choose it

Choose Scroll Canvas when the topic benefits from a visual narrative, progressive disclosure,
short interactive beats, and native scrolling. Choose `paged-v1` when explicit screen boundaries,
previous/next navigation, or a short linear lesson provide better cognitive control. Do not create
a hybrid that uses pagination, scroll-jacking, or two competing progress models.

## Structure

- Build **8–14 bands** for a 30–60 minute module. One band = one idea = one scroll beat.
- Use the learning spine: hook → frame → model → practice → apply → prove → carry.
- Use at least four archetypes. Never use the same archetype more than twice in a row.
- Alternate text density. A text-forward band should be followed by a visual or interactive band.
- Alternate white and warm surfaces. Use exactly one near-black ink band as a tonal break.
- Place the ink band immediately before the assessment when possible. It signals the transition from
  teaching to proof and should not be the hero.
- Allocate exactly one T3 signature moment: a count-up, badge reveal, or simulation payoff. Do not
  combine multiple T3 moments in one module.

## Visual language

Use the shared tokens and local assets:

- `--surface: #FFFFFF`, `--surface-warm: #F6F3EB`, `--ink: #000000`.
- `--action: #343CED`, `--success: #D8FD49`, `--text-secondary: #3A3A3A`.
- Decorative hairlines use `--line: #C7C7AB`. Interactive control boundaries use a separate
  `--line-control` token that meets the 3:1 non-text contrast requirement. Never use the decorative
  hairline as the only boundary of an interactive control.
- Use two-tone display headlines, mono sentence-case eyebrows, light stat numerals, and generous
  whitespace only when the module declares this system. Keep the default brand radius at 8px.
  Pill CTAs follow the brand skill (`brand/references/LAYOUT.md`); shell nav buttons stay 8px.
- Use local PolySans/DM Sans/system stacks. Never load network fonts.
- Prefer inline or local SVG. Use the shared 24px, 2px-stroke icon family. Do not generate text,
  logos, or product UI inside raster artwork.

## Navigation and progress

- The page is one native vertical scroll. Do not intercept the wheel or use scroll-jacking,
  parallax, pinned sequences, or horizontal scroll hijacks.
- At ≥1024px, provide a fixed rail with one real in-page anchor per band and `aria-current` on the
  active band. Below 1024px, hide the rail and show a bottom progress bar or equivalent text status.
- The rail must remain a real `<nav>` list and work with JavaScript disabled.
- Progress means the deepest band actually reached, not the percentage of page pixels scrolled.
  Mark a band visited only after its observer threshold fires. If IntersectionObserver is unavailable,
  reveal all content and use a conservative fallback that does not trap the learner.
- `cmi.core.lesson_location` stores the current band ID. `cmi.suspend_data` restores visited bands,
  interaction state, quiz state, and the saved band.
- Completion requires every band visited **and** assessment mastery. Reaching the bottom alone never
  completes a module.

## Band contract

Every band must have:

- A stable `BAND-nn` ID and a `<section>` element.
- One labelled `<h2>` connected with `aria-labelledby`.
- An eyebrow or short context label, except when it would add noise.
- One primary learning purpose and an objective mapping.
- A responsive layout that works at 320px width and 200% zoom.
- No content that is visible only after animation or hover.

Recommended band sequence:

| Band | Purpose | Typical pattern |
|---|---|---|
| 01 | Hook | partner situation + visual render |
| 02 | Frame | outcome contract / path map |
| 03 | Model | definition or concept canvas |
| 04 | Anatomy | annotated diagram / hotspots |
| 05 | Compare | mode or construct comparison |
| 06 | Practice | low-stakes decisions or worked example |
| 07 | Apply | classify, sort, or scenario consequence |
| 08 | Govern | myth/fact, permissions, guardrails |
| 09 | Risk | checklist or scope selector |
| 10 | Lifecycle | stepper or guided process |
| 11 | Prove | ink band + assessment |
| 12 | Carry | job aid, next module, badge context |

The sequence can change, but the blueprint must explain the change.

## Interaction contract

Every interaction is keyboard-complete and stateful:

- Use semantic buttons, links, inputs, lists, and headings before adding ARIA.
- Roving tab patterns are appropriate for tabs and hotspots. Arrow keys must move focus and select
  the active item without requiring a pointer.
- Every pointer gesture has a non-drag keyboard equivalent. Dragging is optional, never required.
- Feedback announces why an answer is correct or incorrect through a polite live region. Never use
  color alone to signal state.
- Partial interaction state survives resume and never locks a learner out.
- If a score or tier is a studio heuristic rather than documented product guidance, show a visible
  disclosure in the module and record the inference in `qa/fact-report.json`.

Recommended library: primitive selector, compare tabs, decision branch, hotspot diagram, trigger
sorter, myth/fact cards, risk checklist, lifecycle stepper, quiz, and job-aid reveal. Do not add an
interaction only to create clicks.

## Motion and responsive behavior

- Reveal: opacity plus 8px upward movement, 300ms, once, only when the observer is available.
- Rail state transition: ≤150ms. One T3 signature moment: ≤600ms.
- Under `prefers-reduced-motion`, show final states immediately. Never hide or delay content.
- Stack grids below 700px; collapse complex diagrams below 900px; hide rail labels or switch to the
  bottom progress treatment below 1024px. Keep images fluid and remove column rules below 700px.
- Use at least 24px control targets and a larger clickable label or hit area where practical.
- Test 320px, 390px, 768px, 1024px, and a wide desktop viewport. Check for horizontal overflow.

## Build and QA sequence

1. Write the blueprint with band IDs, objective coverage, archetype, surface, and interaction IDs.
2. Research and tag every learner-facing claim, including diagram labels and feedback.
3. Compile the runtime from local content and assets. Keep `assessment/key.json` authoring-only.
4. Run structural lint and package checks before visual polish.
5. Run a module-specific harness for band rendering, progress honesty, keyboard behavior, resume,
   quiz mastery, corrupt suspend data, reduced motion, missing IntersectionObserver, and no LMS.
6. Run a responsive contract check and computed contrast check. Use `--line-control` for controls.
7. Serve the module from localhost and inspect it in a real browser. Verify page height, no broken
   images, no horizontal overflow, rail/progress behavior, and at least one path through every
   interaction. Headless failure is not a reason to skip visual QA.
8. Build twice. Require byte-identical ZIPs, a root manifest, one SCO, no external runtime calls,
   no authoring leaks, and a recorded SHA-256 checksum.

## Anti-patterns

Do not ship: page-like bands with hidden next gates, progress that equals raw scroll percentage,
multiple dark bands, repeated T3 animation, a rail that is decorative only, hover-only content,
20px controls, answer keys in the ZIP, undocumented heuristic scoring, network fonts, runtime fetches,
placeholder copy, or a browser-only interaction path.
