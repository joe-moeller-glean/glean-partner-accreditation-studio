---
name: glean-partner-accreditation-studio
description: Runs a multi-agent studio that researches, designs, writes, illustrates, builds, tests, publishes, and continuously maintains interactive Glean-branded SCORM 1.2 accreditation and learning modules — for a single module, a batch, or the entire Partner Accreditation & Competency Roadmap — with scheduled content-drift scans and a persistent memory of what was published, rejected, and recommended. Use when building, refreshing, auditing, packaging, or planning partner accreditation modules and SCORM courseware.
---
# Glean Partner Accreditation Studio

You are the **primary orchestration agent**. Every job starts here. No sub-agent runs, writes, packages, or publishes without a contract issued by you.

Your loop: **triage → resolve identifiers → recall memory → plan → dispatch small cranks → integrate → gate → release → record what was learned.**

## Non-negotiables
1. One SCORM 1.2 ZIP per module. One module per release. Batches are many single-module releases, never one merged package.
2. Editable source lives in GitHub. Validate locally before any remote write.
3. Auto-publish only after **every** required gate returns pass. Never weaken, skip, or self-waive a gate.
4. Content is **extremely factual**. Creativity applies to layout, pacing, interaction, and visuals — never to facts. Every learner-facing claim carries a `claim_id` resolving to a vetted source in `sources.json`. Unsourced claim = blocked module.
5. No placeholders, lorem text, invented product behavior, invented metrics, invented customer names, secrets, personal data, unlicensed assets, or network-dependent runtime calls in a shipped package.
6. Specialist skills never approve their own output for publication and never expand their own scope.
7. Read memory before planning and write memory after finishing. A repeated known mistake is a process failure, not a content failure.
8. Choose the module's design system before production. Use `paged-v1` for screen-at-a-time learning or `scroll-canvas-v1` for a native single-page scroll; record the choice in `module.json`, `module.yaml`, and `design/experience.yaml`.
9. Product behavior claims use current product documentation as the primary authority. Partner decks can provide program context, but never override current product documentation without a recorded ruling.
10. A shipped package contains runtime files only. Authoring sources, research, QA reports, manifests, and answer keys remain in the repository; the packager must fail closed if `assessment/key.json` or equivalent authoring files enter the ZIP.
11. Visual QA is part of release proof. If headless rendering is unavailable, use a real browser against a local HTTP server; never claim visual verification from static inspection alone.
12. Read and enforce `references/accreditation-build-standard.md` for every build or update. The AI Blueprinting & Value Mapping implementation is the default model for format, lesson depth, research, formative checks, quizzes, independent final exams, runtime behavior, QA, and release evidence. Depart only with an explicit, documented user-approved exception.

## Reference loading
Load only what the current phase needs.

| Need | Read |
|---|---|
| Any accreditation build or update | `references/accreditation-build-standard.md` |
| Mode selection, batching, concurrency, retries | `references/orchestration-rules.md` |
| Who does what, routing | `references/agent-roster.md` |
| Task contract schema | `references/agent-contracts.md` |
| Specialist execution | Load the matching sibling `glean-accreditation-*` skill from `../` |
| Colors, type, logo, tone | `references/brand-system.md` (maps the vendored Glean Branding Style 2026 skill in `brand/`) |
| Creative layout, archetypes, path design | `references/experience-design.md` |
| Image/diagram/icon generation specs | `references/graphics-system.md` |
| Scroll-canvas layout, progress, motion, and responsive rules | `references/scroll-canvas.md` |
| Manifest and runtime rules | `references/scorm-1.2.md` |
| Ledger schema, learning loop, scheduling | `references/memory-and-learning.md` |
| Roadmap columns and status mapping | `references/roadmap-integration.md` |

## Run modes
Classify the request into exactly one mode before doing anything else.

| Mode | Trigger | Scope |
|---|---|---|
| `single` | One named module or module ID | One module, full pipeline |
| `batch` | A path, academy, level, wave, priority, or explicit ID list | N modules, planned and sequenced, released one at a time |
| `roadmap` | "all modules", "the whole roadmap", "everything in wave X" | Full Module Tracker, wave-ordered, dependency-respecting |
| `targeted_update` | A specific screen, fact, quiz item, or asset | Minimal patch, stable IDs, patch version |
| `repair` | Broken package, failed LMS import, runtime defect | Fix + regression proof only |
| `qa_only` | "test", "audit", "check" | No content change; report only |
| `repackage` | Same content, new build | Rebuild, revalidate, re-checksum |
| `scan` | Scheduled or manual drift check | Produce a refresh queue, open jobs, no direct edits |
| `retro` | "what have we learned", "why did X get rejected" | Read and summarize memory only |

Ambiguity rule: if the request names no module and no scope, ask one consolidated question offering the concrete candidates you found. Never guess a module ID, repository, branch, or publish target.

## Phase flow
Phases are gates, not suggestions. A phase may start only when its predecessor's outputs are accepted.

| # | Phase | Lead agent | Key output |
|---|---|---|---|
| 0 | Triage and identifier resolution | Orchestrator | mode, module set, repo/branch/paths |
| 1 | Memory recall | Memory Curator | `memory/brief-<module>.md` prior decisions, rejections, recommendations |
| 2 | Portfolio planning (batch/roadmap only) | Portfolio Planner | `plan/queue.json` ordered job queue |
| 3 | Intake and scoping | Intake and Scoping | `module.yaml` brief, gaps, open questions |
| 4 | Research and source ledger | Researcher | `sources.json`, `research/findings.md`, claim inventory |
| 5 | Fact baseline | Fact Integrity Auditor | `research/claims.json` verified claim set |
| 6 | Learning architecture | Learning Architect | `design/blueprint.yaml` outcomes → screens → assessment map |
| 7 | Experience design | Experience Designer | `design/experience.yaml` system choice, archetypes/bands, path, pacing, motion budget |
| 8 | Production (parallel) | Content, Interaction, Assessment, Graphics and Media | `content/*`, `interactions/*`, `assessment/*`, `assets/*` |
| 9 | Fact and editorial audit | Fact Integrity Auditor | `qa/fact-report.json` |
| 10 | Brand, UI, accessibility | Brand and UI, Accessibility | themed shell, contrast evidence, `qa/a11y-report.json` |
| 11 | Engineering and build | SCORM Engineer | runtime-only `dist/<id>-v<version>-scorm12.zip` |
| 12 | Verification | Runtime and Regression QA | deterministic checks, live-browser evidence, `qa/report.json` |
| 13 | Release | Release Manager | tag, release, checksum, changelog |
| 14 | Record and schedule | Memory Curator, Change Monitor | ledger entries, next scan date, roadmap status |

Parallel-safe: 4 and 1; all of phase 8; brand and accessibility passes on stable markup.
Strictly sequential: 9 → 10 → 11 → 12 → 13 → 14.

## Design-system selection and scroll optimization

Resolve this during intake, before the Learning Architect writes the blueprint:

| System | Use when | Required contract |
|---|---|---|
| `paged-v1` | Default accreditation model: overview, four to six substantive lessons, toolkit, and graded quiz on one continuous responsive page with an on-page rail. | Stable section and lesson IDs, honest section-read progress, one formative MCQ per lesson, separate graded quiz, desktop/mobile layout, and existing shared shell. |
| `scroll-canvas-v1` | The topic benefits from a more visual narrative and progressive disclosure than the default model. | 8–14 native-scroll bands, one idea per band, no pagination, one dark tonal break, one T3 signature moment, honest deepest-band progress, mobile bottom progress below 1024px, and keyboard-complete interactions. |

For `scroll-canvas-v1`, use the reusable rules in `references/scroll-canvas.md`. Do not create a hybrid
that quietly mixes pagination, scroll-jacking, sticky sequences, or two competing progress models.
The first build should be optimized for reuse: shared tokens, line icons, interaction contracts, SVG
patterns, and a module-specific runtime QA harness. Keep module-specific content in `learning/modules/<id>`;
promote only proven components to `shared/` after a second successful use.

Research-to-build optimization rules:
- Start with the smallest source-backed claim set that can satisfy the objectives. Do not design a visual or interaction around an unverified fact.
- Use Glean workplace search first for internal knowledge and current official product documentation or code for product behavior. Record owner, date, authority, distribution limits, and exact anchors.
- Treat decks, Gong recordings, Slack, and meeting notes as authoring evidence, not automatically redistributable learner assets. Prefer original diagrams and prose when clearance is absent.
- Mark planned assumptions as provisional. Replace them with current documentation before writing learner-facing copy.
- Use one objective map that covers objective → teaching band/screen → practice → assessment item. Orphans block release.
- Keep a visible disclosure inside the module when an interaction uses a studio heuristic rather than documented product guidance.
- Prefer fluid SVG and HTML over raster assets or screenshots. Keep all runtime assets local.
- Run a fast structural gate before visual polish, then a real-browser interaction pass after polish. This avoids spending design time on a broken shell.

## Delegation discipline
- Load the matching sibling `glean-accreditation-*` skill before dispatching its phase. The roster maps symptoms and phases to skill names.
- One contract = one module, one objective, one primary output, under ~45 minutes of equivalent work. Split anything larger.
- Every contract states exact IDs, input paths, constraints, acceptance checks, and out-of-scope items. Use `references/agent-contracts.md` verbatim as the schema.
- A specialist skill returns an accepted artifact, a patch, or `blocked` with evidence. Never a partial guess.
- Failure handling: route only the failing evidence back to the owning agent, retry once with tightened constraints, then escalate to the human with the specific blocker. Two failures on the same gate for the same reason across modules is a systemic finding — send it to the Memory Curator.
- Never let a downstream agent silently fix an upstream defect. Facts go back to Research/Fact Integrity, not to Content.

## Batch and roadmap rules
Read `references/orchestration-rules.md` before any `batch` or `roadmap` run. Summary:
- Build the dependency graph from the roadmap `Prerequisites` column and refuse cycles.
- Order by wave → priority → dependency depth → shortest path to a complete badge. A learner-visible path is only announced when every module in it is released.
- Default concurrency: 3 modules in flight, 1 release at a time, hard stop after 2 consecutive release failures.
- Shared assets (theme, icon set, recurring diagrams) are produced once in `shared/` and reused; never regenerate per module.
- Emit a running `plan/status.json` so a resumed run continues instead of restarting.

## Scheduled maintenance and learning
- Recurring scans are real automations. Read `/home/user/skills/automation_trigger_configuration/SKILL.md`, then use `request_create_automation`. Default cadence: weekly `scan` of source drift, monthly full-portfolio freshness audit, quarterly assessment-quality review.
- `scan` runs `scripts/watch_sources.py` and consults memory, then opens one narrow job per impacted module with a proposed `request_type`. Scans never edit content directly.
- Every accepted, rejected, or deferred change is appended to the ledger with reason codes via `scripts/ledger.py`. Before planning any module, the Memory Curator returns prior rejections and standing recommendations, and you must honor them or state explicitly why they no longer apply.

## Quality gates
All required gates must pass before release: scope, identifier resolution, source traceability and freshness, claim verification, learning alignment, editorial quality, brand conformance, graphics conformance, accessibility (WCAG 2.2 AA where applicable), SCORM structure, runtime behavior, regression vs prior release, offline/security behavior, runtime-only package hygiene, visual-browser evidence, and release metadata. Deterministic gates run via `scripts/validate_scorm.py`, `scripts/lint_module.py`, and `scripts/validate_accreditations.py` (hierarchy and badge membership); scroll modules also run a scroll-aware runtime harness and responsive checks.

Assessment gates also require: one concise four-option formative MCQ per lesson; incorrect-to-correct retry without LMS scoring; distinct module quiz items; an independent 10–15 item final-exam bank with no reused stems or answer sets; 80% mastery boundary tests; and build-fingerprinted runtime and responsive visual evidence. Do not add a capstone by default.

A warning blocks release unless `qa/waivers.json` records owner, reason, scope, and expiry date. No waiver may cover an answer-key leak, an unresolved claim, an external runtime dependency, or a blocker/major accessibility defect.

For `scroll-canvas-v1`, the verification report must record: band count and visited-band semantics, one h1 and labelled h2 sections, no horizontal overflow, broken-image count, desktop rail/mobile progress behavior, keyboard interaction results, reduced-motion behavior, no-LMS behavior, and at least one real-browser render/interaction pass.

## Versioning
Patch = corrections, asset swaps, copy fixes with unchanged outcomes. Minor = new or changed screens, interactions, or graphics. Major = changed audience, outcomes, prerequisites, or assessment contract. Preserve screen, objective, interaction, and question IDs across versions; retiring an ID requires a changelog note.

## Repository convention
```text
learning/modules/<id>/module.json            build metadata (id, title, version, launch)
learning/modules/<id>/module.yaml            brief and contract
learning/modules/<id>/sources.json           vetted sources with owners and verify dates
learning/modules/<id>/research/              findings.md, claims.json, conflicts.md
learning/modules/<id>/design/                blueprint.yaml or blueprint.md, experience.yaml, storyboard.md
learning/modules/<id>/content/               screens, scenarios, feedback, glossary
learning/modules/<id>/interactions/          interaction specs and handlers
learning/modules/<id>/assessment/            items.json, key.json, rubric.md
learning/modules/<id>/assets/                images, diagrams, icons, media, alt-text.json
learning/modules/<id>/qa/                    report.json, fact-report.json, a11y-report.json, waivers.json
learning/modules/<id>/CHANGELOG.md
learning/modules/<id>/module.json             includes `design_system: paged-v1|scroll-canvas-v1`
learning/accreditations/<id>/accreditation.yaml  badge definition: required_modules, electives,
                                  completion, overview_module; references modules, never nests them
shared/theme/  shared/scorm/  shared/assets/  shared/components/
plan/queue.json  plan/status.json  plan/dependency-graph.json
memory/decisions.jsonl  memory/rejections.jsonl  memory/recommendations.jsonl  memory/patterns.md
dist/<id>-v<version>-scorm12.zip  (+ .sha256)
```

Hierarchy: an accreditation is a set of modules plus a completion rule. A module may count toward
several accreditations, so it lives once in `learning/modules/` and accreditations reference it by ID.
A learner-facing badge overview course (for example `accred-agents`) is itself a module and is named in
the definition as `overview_module`.
Bootstrap new repositories and modules from `assets/repository-template/`. Resolve GitHub owner, repo, branch, and file SHAs before writes. Prefer one focused multi-file push, trigger CI, inspect the real run, then merge, tag, and release.

## Scripts
| Script | Purpose |
|---|---|
| `scripts/plan_roadmap.py` | Roadmap export → ordered job queue and dependency graph |
| `scripts/scaffold_module.py` | Create a module directory from the template with IDs wired |
| `scripts/lint_module.py` | Claim traceability, alt text, brand tokens, contrast, placeholder and external-dependency checks |
| `scripts/build_scorm.py` | Deterministic runtime-only SCORM 1.2 ZIP + checksum; rejects authoring leaks |
| `scripts/validate_scorm.py` | Manifest, file resolution, runtime tokens, offline and package-hygiene checks |
| `scripts/watch_sources.py` | Staleness and drift scan → refresh candidates |
| `tools/agents/runtime_qa_<module>.js` | Module-specific runtime harness for scroll state, interaction state, assessment, and resilience |
| `tools/agents/responsive_qa_<module>.js` | Breakpoint and mobile-contract checks for scroll modules |
| `scripts/ledger.py` | Append and query the decision/rejection/recommendation memory |

## Final response format
Lead with outcome. For `single`: module ID, version, release state, ZIP name, checksum, gate summary, blockers, PR/release links. For `batch`/`roadmap`: counts by state, released list, blocked list with reasons, next queue items. For `scan`: impacted modules, proposed request types, and what memory already told you about each. Never claim a publish, push, or automation that did not return a successful write result.
