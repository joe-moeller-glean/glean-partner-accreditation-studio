# Experience design system

Creative range lives here. Facts never do.

## Module spine
Every module follows a recognizable arc, staged differently each time:
`Hook` (a real partner situation) → `Frame` (why it matters, what you will be able to do) → `Model` (the concept, shown not told) → `Practice` (low-stakes retrieval and worked examples) → `Apply` (scenario decisions with consequences) → `Prove` (assessment) → `Carry` (job aid, next module, badge moment).

## Screen archetypes
| ID | Archetype | Use for | Copy budget |
|---|---|---|---|
| A1 | Cold-open scenario | Hook with a real situation and a question the learner cannot yet answer | ≤60 words |
| A2 | Objective contract | "By the end you will…" with the path map visible | ≤50 words |
| A3 | Concept canvas | One idea, one strong visual, minimal text | ≤90 words |
| A4 | Annotated diagram | Architecture, data flow, or decision logic with progressive hotspots | ≤40 words + labels |
| A5 | Compare and contrast | Two constructs side by side with a decision rule | ≤80 words |
| A6 | Decision branch | Learner chooses; each branch explains consequences | ≤70 words per branch |
| A7 | Guided simulation | Stepwise walkthrough of a real product or delivery flow | ≤35 words per step |
| A8 | Worked example with fade-out | Full example → partial → learner completes it | ≤80 words |
| A9 | Sort or categorize | Classify use cases, constructs, partner types, risks | ≤50 words |
| A10 | Myth vs reality | Correct known misconceptions surfaced in research | ≤70 words |
| A11 | Field note from an expert | A short sourced quote or SME insight card | ≤60 words |
| A12 | Checkpoint self-check | Retrieval practice with confidence rating | ≤40 words |
| A13 | Job aid reveal | The takeaway artifact, downloadable and summarized | ≤60 words |
| A14 | Badge moment | Signature reveal, path progress, and next step | ≤40 words |

## Variety rules
- At least 4 distinct archetypes per module; at least 6 for modules over 45 minutes.
- Never more than 2 consecutive screens of the same archetype.
- Exactly one signature moment per module (a T3 motion reveal, a full-bleed visual, or a simulation payoff).
- Alternate density: a text-forward screen is always followed by a visual or interactive screen.

## Learning path design (batch/roadmap)
- Each path gets a visual map: modules as nodes, prerequisites as edges, badges as milestones, current position always marked.
- Level 100 modules use more scaffolding and shorter chunks; 200+ modules front-load scenarios and reduce explanation.
- Repeat one recurring partner persona and one recurring customer situation across a path so learners build continuity.
- Handoff screens explicitly name the prior and next module so the path feels authored, not assembled.
- Progressive difficulty: each module's Apply stage should require a skill from an earlier module in the path.

## Layout grid
12-column responsive grid, 8px spacing scale, max content width 1120px, body line length 60–80 characters, single primary action per screen. `paged-v1` uses a persistent header and footer (back, objective, next). `scroll-canvas-v1` uses native document scrolling, a real in-page rail at desktop width, and a bottom progress treatment on narrow screens; it does not use previous/next pagination.

## Motion budget
| Tier | Allowance |
|---|---|
| T0 | Static content, tables, dense text |
| T1 | State feedback: hover, focus, selection, correctness (≤150ms) |
| T2 | Purposeful transitions: reveals, step advances, panel changes (≤300ms) |
| T3 | One signature reveal per module (≤600ms) |
All tiers collapse to T0 under `prefers-reduced-motion`. Motion never conveys meaning on its own.

## Fun without noise
Do: learner agency, curiosity gaps, realistic stakes, visible momentum, specific praise, optional deep dives, satisfying reveals, unlockable expert tips.
Don't: points for clicking, cartoon mascots, spinning logos, countdown pressure, cheesy sound effects, streak shaming, or humor that trivializes the subject.

## Scroll-canvas-v1 pattern
Choose this system during intake, before the blueprint. It is a single-page vertical narrative, not a stack of screens disguised as a page.

- Use 8–14 stable `BAND-nn` sections for a 30–60 minute module. One band carries one learning beat.
- Use at least four archetypes, alternate text density, alternate white/warm surfaces, and reserve exactly one ink/dark band for the transition into proof.
- Place the assessment immediately after the ink band when possible. Use exactly one T3 signature moment.
- Track honest progress by the deepest band whose observer threshold fired. Do not use raw scroll percentage as learning progress.
- The desktop rail is a real `<nav>` with anchor links. Below 1024px, replace it with a bottom progress bar or text status.
- Every band has one labelled `<h2>`, objective coverage, responsive behavior, and a no-JavaScript-visible fallback.
- Every interaction must support keyboard, reduced motion, resume, and no-LMS preview. A studio heuristic must be disclosed in the learner experience.
- Preferred interaction sequence: explore → compare → choose → sort/check → lifecycle → prove. Do not add clicks without a learning purpose.

See `references/scroll-canvas.md` for the complete runtime, accessibility, asset, and QA contract.

## Anti-patterns
Wall-of-text screens, click-next-to-continue chains, quizzes that test wording, hidden navigation, decorative stock imagery, scroll-jacking, interactions that cannot be completed by keyboard, progress bars that lie, and a paged shell copied into a scroll module without adapting completion semantics.
