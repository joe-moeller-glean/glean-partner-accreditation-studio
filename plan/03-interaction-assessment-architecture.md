# Interaction and assessment architecture

## 1. Interaction library

Vanilla JS only. No frameworks, no external fonts, no network calls. Every pointer interaction ships
a keyboard-equivalent path *in the same component*. State persists to `cmi.suspend_data` and restores
exactly on resume. Completion criteria are explicit — never "scrolled to bottom".

| ID | Interaction | Keyboard path | Persisted state | Use in |
|---|---|---|---|---|
| `INT-REVEAL` | Progressive reveal / accordion | Enter/Space toggles, focus stays on trigger | opened set | All paths |
| `INT-HOTSPOT` | Annotated diagram hotspots | Tab through numbered buttons, Enter opens panel | visited set, last opened | Architecture, networking, agent anatomy |
| `INT-BRANCH` | Decision branch with consequences | Radio group + Enter to commit | chosen branch, seen consequences | Seller, Solutions, Ops, Delivery |
| `INT-SORT` | Categorize into buckets | Select item → arrow to bucket → Enter | item→bucket map | Use cases, partner types, risks, constructs |
| `INT-SEQ` | Order the steps | Select + Alt+Arrow to move | ordering | Delivery, connector lifecycle, incident triage |
| `INT-COMPARE` | Compare two constructs | Both columns always readable; slider is enhancement | viewed side | Search vs assistant vs agent, hosted vs cloud-prem |
| `INT-SIM` | Guided simulation over real captures | Prev/Next buttons, step announced via live region | current step | Agent build, connector config, admin runbook |
| `INT-FADE` | Worked example with fade-out | Text inputs / selects per blank | stage, learner answers | ROI model, discovery, blueprint, pricing |
| `INT-CHECK` | Self-check + confidence | Radio + confidence radio | answer, confidence | Every module (Practice stage) |
| `INT-MATRIX` | Score/prioritize on a 2-axis grid | Per-item numeric selects (no drag required) | scores | SOL-102, SAL-202, IND-201 |
| `INT-TRACE` | Read an agent/log trace and isolate a fault | Table navigation + selection | selected fault | BLD-207, SRV-204, OPS-104, TEC-202 |
| `INT-CHECKLIST` | Build/validate a prerequisite checklist | Checkbox group with validation summary | checked set | TEC-105, TEC-201, SRV-104, OPS-105 |

Resilience cases every interaction must survive: rapid repeat clicks, resume mid-interaction, 320px
width, 200% zoom, reduced motion, suspend-data truncation (degrade to last-known-good screen), and a
no-LMS preview launch. Zero console errors.

## 2. Assessment architecture by tracker format

The tracker specifies 28 distinct assessment strings. They collapse to six machine-scoreable patterns
plus rubric-scored artifacts. Accreditation modules require ≥3 items per objective; knowledge checks
require ≥2. Mastery default 80%, retries reshuffled, explanatory feedback on the final attempt.

| Tracker value | Modules | Pattern |
|---|---|---|
| `Quiz` (13) | FND-101, FND-102, FND-104, SAL-101, TEC-101, TEC-103, TEC-104, BLD-101, BLD-102, BLD-201, SRV-102, OPS-101, OPS-102 | 8–12 items, mixed recall/application, one item per objective minimum |
| `Knowledge check` (13) | FND-103, SAL-204, SOL-202, TEC-102, TEC-106/107/108, TEC-203, SRV-101, SRV-201, OPS-103, OPS-106 | 4–6 items, ungated formative, still scored to `cmi` |
| `Scenario quiz` (15) | SAL-203, IND-101…IND-107, DEP-101…DEP-108 | Every stem is a partner situation; distractors are real misconceptions |
| `Lab` (10) | BLD-103, BLD-104, BLD-202, BLD-204, BLD-205, BLD-206, BLD-207, TEC-202, SRV-204, SRV-205 | Task list + verifiable end state + rubric; SCORM records completion + rubric score |
| `Checklist review` (4) | TEC-105, TEC-201, SRV-104, OPS-105 | Learner-built checklist scored against a required-elements rubric |
| `Exam*` (5) | SAL-103, ACC-101, ACC-103, ACC-105, ACC-106 | 20–30 items, blueprinted across all path objectives, 80% mastery |
| Artifact/rubric (18) | SOL-101/102/103/201/204, SAL-201/202/205, SRV-105/202/203, FND-106, BLD-203, IND-201, ACC-102, ACC-104, FND-105, OPS-104 | Rubric in `assessment/rubric.md`; module records submission + self-assessment, human scores externally |
| `None` (1) | FND-107 | Orientation only — no scored assessment; still tracks completion |

### Item quality rules
- One defensible best answer. Distractors come from misconceptions found in research, never filler.
- Never test wording, trivia, or anything not taught in the module.
- Balance answer positions; vary stem length; no "all of the above".
- Every keyed answer and every distractor rationale carries a `claim_id` and is audited by Fact Integrity.
- `key.json` stays separate from `items.json`; the linter fails if a correctness flag leaks into items.
- Retire an item only with a `CHANGELOG.md` note. Calibrate when live pass rate is <30% or >95%.

## 3. Rubric skeleton (artifact and lab assessments)

```
Criterion            | Exemplary (3)                    | Adequate (2)              | Insufficient (1)
Completeness         | All required elements present     | One missing, non-critical | Multiple missing
Factual accuracy     | Every claim traceable             | Minor imprecision         | Contains an error
Fit to situation     | Tailored to the given constraints | Generic but valid         | Ignores constraints
Risk handling        | Names risks + mitigations         | Names risks only          | None identified
Communicability      | Ready to show a customer          | Needs light editing       | Not presentable
Pass = 80% of available points, with no criterion at Insufficient.
```

## 4. SCORM tracking contract

`cmi.core.lesson_status`: `incomplete` while working → `passed` when completion *and* mastery met →
`failed` after a completed attempt below mastery. `cmi.core.score.raw/min/max` written before
`LMSFinish`. `cmi.core.lesson_location` bookmarks the screen ID. `cmi.suspend_data` holds a versioned
JSON state blob (schema version first, so truncation degrades gracefully). Objectives map to
`cmi.objectives.n` where supported. Commit after material progress, `LMSInitialize("")` once,
`LMSFinish("")` once and only after the final status/score commit.
