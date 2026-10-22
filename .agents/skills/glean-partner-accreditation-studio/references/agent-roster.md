# Specialist skill roster and routing

The studio orchestrates 17 sibling repository skills. Load the matching skill before dispatching work. Each specialist must also follow `glean-partner-accreditation-studio/references/accreditation-build-standard.md`.

| # | Specialist skill | Owns | Never |
|---|---|---|---|
| 1 | `glean-accreditation-portfolio-planner` | Roadmap queue, dependencies, waves, capacity | Author content |
| 2 | `glean-accreditation-intake-scoping` | Brief, audience, outcomes, constraints, gaps | Draft learner copy |
| 3 | `glean-accreditation-researcher` | Source discovery, extraction, provenance, coverage | Write module screens |
| 4 | `glean-accreditation-fact-integrity` | Claim verification, conflict rulings, freshness | Invent replacements |
| 5 | `glean-accreditation-learning-architect` | Outcome map, lesson sequence, practice, assessment blueprint | Visual styling |
| 6 | `glean-accreditation-experience-designer` | Layout archetypes, path narrative, pacing, motion budget | Change facts |
| 7 | `glean-accreditation-content-writer` | Lesson copy, scenarios, feedback, glossary | Add unsourced claims |
| 8 | `glean-accreditation-interaction-engineer` | Accessible interactions and formative retry behavior | Decorative gimmicks |
| 9 | `glean-accreditation-assessment-builder` | Lesson checks, module quizzes, independent finals, keys | Reveal answers in copy |
| 10 | `glean-accreditation-graphics-media` | Original diagrams, icons, cleared media, captions | Ship restricted source media |
| 11 | `glean-accreditation-brand-ui` | Tokens, typography, logo use, layout polish | Alter approved brand assets |
| 12 | `glean-accreditation-accessibility` | WCAG 2.2 AA findings and evidence | Silently rewrite content |
| 13 | `glean-accreditation-scorm-engineer` | Runtime, SCORM state, packaging, package hygiene | Change instructional design |
| 14 | `glean-accreditation-runtime-qa` | Runtime, retry, scoring, resume, browser and regression QA | Approve its own fixes |
| 15 | `glean-accreditation-release-manager` | Gates, versioning, checksums, release and publication | Waive a gate |
| 16 | `glean-accreditation-change-monitor` | Drift scans, freshness audits, refresh queue | Edit modules directly |
| 17 | `glean-accreditation-memory-curator` | Decisions, rejections, recommendations, recurring patterns | Overrule a live gate |

## Routing matrix

| Symptom or task | Skill |
|---|---|
| Missing, stale, restricted, or weak source | `glean-accreditation-researcher` |
| Product behavior differs across current docs and decks | Researcher → `glean-accreditation-fact-integrity` |
| Conflicting claims or unclear evidence class | `glean-accreditation-fact-integrity` |
| Bloated, shallow, repetitive, or poorly sequenced module | `glean-accreditation-learning-architect` |
| Flat or visually monotonous experience | `glean-accreditation-experience-designer` |
| Wordy, vague, or off-voice lesson copy | `glean-accreditation-content-writer` |
| Formative check does not retry or is not keyboard usable | `glean-accreditation-interaction-engineer` |
| Weak distractor, long stem, repeated question, or bad final coverage | `glean-accreditation-assessment-builder` |
| Copied, uncleared, misleading, or inaccessible visual | `glean-accreditation-graphics-media` |
| Brand, type, spacing, or layout defect | `glean-accreditation-brand-ui` |
| Contrast, focus, alt text, captions, target size, mobile access | `glean-accreditation-accessibility` |
| Manifest, tracking, score, resume, interaction, or suspend-data defect | `glean-accreditation-scorm-engineer` |
| Runtime passes locally but fails package/browser/LMS QA | `glean-accreditation-runtime-qa` |
| Version, checksum, changelog, package count, or release problem | `glean-accreditation-release-manager` |
| Source or product drift | `glean-accreditation-change-monitor` |
| Repeated defect or prior decision needs recall | `glean-accreditation-memory-curator` |

## Dispatch rule

Use the contract schema in `agent-contracts.md`. Put the specialist skill name in `agent`, retain the internal crank in `sub_agent`, and include the shared build standard as a required input. A specialist returns an artifact, patch, or `blocked` evidence; it never self-approves release.
