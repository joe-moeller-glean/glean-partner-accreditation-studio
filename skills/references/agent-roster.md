# Agent roster and routing

17 specialist agents. Each has its own internal sub-agent structure defined in its reference file. The orchestrator owns sequencing; agents own craft.

| # | Agent | File | Owns | Never |
|---|---|---|---|---|
| 1 | Portfolio Planner | `agents/01-portfolio-planner.md` | Roadmap-wide queue, dependencies, waves, capacity | Author content |
| 2 | Intake and Scoping | `agents/02-intake-scoping.md` | Brief, audience, outcomes, constraints, gaps | Draft learner copy |
| 3 | Researcher | `agents/03-researcher.md` | Finding, vetting, extracting, and ledgering all source material | Write module screens |
| 4 | Fact Integrity Auditor | `agents/04-fact-integrity.md` | Claim verification, conflict rulings, freshness | Invent replacements |
| 5 | Learning Architect | `agents/05-learning-architect.md` | Outcome map, chunking, sequence, assessment blueprint | Visual styling |
| 6 | Experience Designer | `agents/06-experience-designer.md` | Creative layout archetypes, path narrative, pacing, motion budget | Change facts |
| 7 | Content Writer | `agents/07-content-writer.md` | Screen copy, scenarios, feedback, glossary | Add unsourced claims |
| 8 | Interaction Engineer | `agents/08-interaction-engineer.md` | Interaction specs and accessible implementations | Decorative gimmicks |
| 9 | Assessment Builder | `agents/09-assessment-builder.md` | Items, distractors, feedback, keys, calibration | Reveal answers in copy |
| 10 | Graphics and Media Studio | `agents/10-graphics-media.md` | Generated images, diagrams, icons, motion, audio, captions | Ship unsourced visual claims |
| 11 | Brand and UI Formatter | `agents/11-brand-ui.md` | Tokens, typography, logo use, layout polish, style cards | Alter the logo or palette |
| 12 | Accessibility Reviewer | `agents/12-accessibility.md` | WCAG 2.2 AA conformance findings | Rewrite content |
| 13 | SCORM Engineer | `agents/13-scorm-engineer.md` | Shell integration, runtime API, state, packaging | Change instructional design |
| 14 | Runtime and Regression QA | `agents/14-runtime-qa.md` | Launch, resume, scoring, regression, browser matrix | Approve its own fixes |
| 15 | Release Manager | `agents/15-release-manager.md` | Gate verification, versioning, tag, release, publish | Waive a gate |
| 16 | Change Monitor and Scheduler | `agents/16-change-monitor.md` | Drift detection, scheduled scans, refresh queue | Edit modules directly |
| 17 | Memory Curator | `agents/17-memory-curator.md` | Decision ledger, rejection reasons, recommendations, pattern learning | Overrule a live gate |

## Routing matrix
| Symptom | Owner |
|---|---|
| Missing or stale source | Researcher |
| Product behavior drift between a deck and current documentation | Researcher → Fact Integrity Auditor |
| Conflicting facts between sources | Fact Integrity Auditor |
| Learner confusion, wrong sequence, bloated module | Learning Architect |
| Module feels flat, generic, or monotonous | Experience Designer |
| Wordy, vague, or off-voice copy | Content Writer |
| Interaction not keyboard-usable or pointless | Interaction Engineer |
| Ambiguous item, cued answer, weak distractor | Assessment Builder |
| Missing, off-brand, or misleading visual | Graphics and Media Studio |
| Wrong color, type, spacing, logo misuse | Brand and UI Formatter |
| Contrast, focus, alt text, captions | Accessibility Reviewer |
| Manifest, tracking, bookmark, score, or scroll-completion bug | SCORM Engineer |
| Authoring file or answer key appears in the ZIP | SCORM Engineer → Release Manager |
| Passes locally, fails in LMS, or visual evidence is missing | Runtime and Regression QA |
| Version, checksum, changelog, tag problem | Release Manager |
| Content silently went out of date | Change Monitor and Scheduler |
| Same mistake recurring across modules | Memory Curator |

## Standard agent file structure
Every agent reference defines: mission, internal sub-agents (with the crank each performs), inputs, outputs, method, acceptance checks, escalation triggers, and hard boundaries.
