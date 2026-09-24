# BLD-208 Agent Governance & Safety - research findings

Verified 2026-09-02. 13 claims drawn from 4 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-01` | [Glean Partner Competency Program Guide](https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w) | Joe Moeller | 2026-08-05 | 1 |
| `S-02` | [Partner Enablement: Glean Agent Building - plan, launch, deploy, measure](https://drive.google.com/file/d/1oVhmo3s6sEFQ9b2DEl25poStQY6j7iHR) | Katya Alfaro | 2026-02-09 | 1 |
| `S-03` | [Partner Enablement Deck: MCP, Custom Actions, and Skills](https://docs.google.com/document/d/1ZguIOERISj653MsmeHZzrqMIpmoMGAegGKkgNteIDeA) | Joe Moeller | 2026-04-13 | 1 |
| `S-05` | [Partner Accreditation & Competency Roadmap - Module Tracker](https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q) | Joe Moeller | 2026-08-13 | 1 |

## Claims by source

### S-01 - Glean Partner Competency Program Guide

- `C-07` Each of the 5 competency agents must configure retrieval guardrails so the agent uses a well-defined set of content sources and has clear instructions for what it can and cannot answer.
- `C-08` Each of the 5 competency agents must contain explicit error-handling with a defined fallback behavior for low-confidence or out-of-scope questions.
- `C-09` At least 1 of the 5 competency agents must invoke actions or tools that write to other systems.
- `C-11` At least 1 of the 5 competency agents must use conditional branching.
- `C-13` At least 1 of the 5 competency agents must use a schedule-based trigger.
- `C-15` For each competency agent, partners must gather business and technical requirements with the end user, evidenced by a document outlining those requirements.
- `C-16` Competency validation includes a call with a Glean Partner Solutions Engineer to review the finalized agents; partners should expect to walk through and run each agent on the call, and ideally provide a recorded walkthrough beforehand.
- `C-17` For each competency agent, partners must complete an agent architecture review with a Glean technical resource, outlining best practices followed and agent structure.
- `C-18` For each competency agent, partners must provide a written outline of the agent's business impact and why a Glean Agent was the best solution, reviewed by a Glean Partner Solutions Engineer.

### S-02 - Partner Enablement: Glean Agent Building - plan, launch, deploy, measure

- `C-37` For each priority agent, assign a project lead and supporting experts, document the current process including baseline performance numbers, design the future-state process with expected improvements, and build an implementation plan covering scope, key dates, success measures, and security and data compliance checks.

### S-03 - Partner Enablement Deck: MCP, Custom Actions, and Skills

- `C-61` Custom actions fit internal APIs or services Glean does not support out of the box, legacy or in-house systems, and approvals, validation, or custom business logic before writing to a system.

### S-05 - Partner Accreditation & Competency Roadmap - Module Tracker

- `C-95` BLD-208 covers safety patterns, approval design, escalation boundaries, and production governance for partner-built agents.
- `C-96` SRV-204 covers trace-driven debugging, issue isolation, and clean escalation packages.

## Conflicts and gaps

No contradictions were found between sources for the claims used in this module.
Where a source reports a performance figure, the claim attributes the figure to that
source rather than stating it as an independent platform guarantee.
