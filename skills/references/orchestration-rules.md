# Orchestration rules

Deterministic behavior for the primary agent. When a rule and a user instruction conflict, the user wins and the deviation is recorded in the ledger.

## 1. Triage decision table
| Signal in request | Mode | First action |
|---|---|---|
| Module ID present (`FND-104`) | `single` | Resolve repo path and memory brief |
| Path, academy, level, wave, or priority named | `batch` | Filter roadmap, then plan |
| "all modules", "entire roadmap", "everything" | `roadmap` | Full tracker plan, wave-ordered |
| A single fact, screen, asset, or item named | `targeted_update` | Locate exact node, patch only it |
| Import error, blank launch, broken tracking | `repair` | Reproduce first, then fix |
| "audit", "review", "test" with no change intent | `qa_only` | Report only, no writes to content |
| Scheduled trigger fired | `scan` | Freshness diff, then open jobs |
| "what did we learn/reject/recommend" | `retro` | Query ledger only |

## 2. Identifier resolution (hard gate)
Never proceed past triage without: module ID, module title, GitHub `owner/repo`, base branch, module source path, dist path, publish target, and roadmap row reference. Missing and non-inferable → ask once, in one consolidated question, with concrete candidates.

## 3. Information sufficiency check
Before any learner content is drafted, all must be true:
- Audience, level, and prerequisites are known.
- Learning outcomes are written as observable behaviors.
- The design system is selected (`paged-v1` or `scroll-canvas-v1`) and the navigation/completion contract is explicit.
- At least two independent authoritative sources exist, or one is explicitly designated system-of-record.
- Current product documentation has been checked for every product-behavior claim; older decks are hypotheses until confirmed.
- Every source has an owner and a verified-on date within the freshness window (default 180 days; 90 days for product behavior, pricing, packaging, security posture).
- Prior rejections and standing recommendations for this module have been retrieved.
If any is false, the only permitted next action is a Research or Intake contract — not content.

## 4. Concurrency and budgets
- Modules in flight: 3 default, 5 maximum, 1 for `repair`.
- Contracts in flight per module: 4 default.
- Releases: strictly serialized, one at a time.
- Retries: 1 per contract, 2 per gate per module, then escalate.
- Circuit breaker: 2 consecutive release failures or 3 identical gate failures across modules halts the run and reports a systemic finding.
- Token/time discipline: research and design phases are capped per module; if a module needs more than 2 research extensions, mark it `needs_sme` and move on rather than blocking the queue.
- Build optimization: run the structural lint, package-hygiene check, and runtime harness before expensive visual polish; run the real-browser pass only after the shell and interactions are stable.

## 5. Batch and roadmap planning
1. Export or read the roadmap Module Tracker.
2. Run `scripts/plan_roadmap.py` to produce `plan/queue.json` and `plan/dependency-graph.json`.
3. Map roadmap `Build Status` to a request type: `Ready for LMS` → `repackage` or `qa_only`; `Refresh needed` → `refresh`; `In development` → `single` (continue build); `Planned` → `single` (net-new); blank → `needs_triage`.
4. Order by: wave → priority (Critical, High, Medium, Low) → dependency depth (prerequisites first) → fewest remaining modules to complete a badge → shortest duration.
5. Refuse cycles in the prerequisite graph; report them as a roadmap data defect.
6. Produce shared assets before module 1 of any wave: theme tokens, icon set, recurring diagrams, path map graphics. For `scroll-canvas-v1`, promote the band shell, rail/progress treatment, line icon family, and interaction patterns only after the first module proves them; do not regenerate recurring assets per module.
7. Write `plan/status.json` after every module transition so an interrupted run resumes at the next unfinished job.
8. Report progress in tranches (per path or per wave), not per file.

## 6. Path-level coherence (batch/roadmap)
- Terminology, personas, iconography, and screen archetypes must be consistent within a learning path; a per-path style card is produced once and enforced by the Brand and UI agent.
- Avoid duplicate teaching: the Learning Architect checks sibling modules' blueprints and cross-references instead of re-teaching.
- A badge or accreditation path is only announced complete when every constituent module is released and its assessments are calibrated.

## 7. Escalation ladder
1. Retry with tightened constraints and only the failing evidence.
2. Reassign to the correct owning agent if misrouted.
3. Downgrade scope (e.g., drop an unverifiable claim, replace a generated graphic with an approved existing asset) if learning outcomes survive.
4. Mark `needs_sme` with the exact question and named SME (resolve via `employee_search` or Knowledge Graph) and continue the queue.
5. Halt the run only for security, legal, brand-integrity, or data-privacy findings.

## 8. Human interaction rules
Ask the user only for: missing repository/publish targets, unresolvable factual conflicts, audience or accreditation-policy decisions, license-restricted assets, and mastery-score changes. Everything else is inferred, defaulted, or escalated to `needs_sme` without blocking.

## 9. Never
Never merge unrelated edits into a release, never publish with an open error, never let a generated graphic assert a fact not present in `claims.json`, never bypass the ledger, never restate a claim from an older module version without re-verification, never fabricate a CI, PR, or release result.
