# BLD-104 Advanced Agent Building Lab - research findings

Verified 2026-09-02. 16 claims drawn from 4 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-01` | [Glean Partner Competency Program Guide](https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w) | Joe Moeller | 2026-08-05 | 1 |
| `S-04` | [Advanced Agent Debugging for Glean Partners](https://drive.google.com/file/d/1C6NRtjfCa88F0SKeT04XJuloOr16ijih) | Katya Alfaro | 2026-02-11 | 1 |
| `S-05` | [Partner Accreditation & Competency Roadmap - Module Tracker](https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q) | Joe Moeller | 2026-08-13 | 1 |
| `S-06` | [Partner Enablement Content Library](https://docs.google.com/spreadsheets/d/1lDz14hUsXJA93IpQcOd-TD2D48J4AUpBke2esP27Fwo) | Joe Moeller | 2026-06-26 | 2 |

## Claims by source

### S-01 - Glean Partner Competency Program Guide

- `C-06` Each of the 5 competency agents must implement at least 3 discrete steps beyond simple retrieval, including at least one thinking or transformation step.
- `C-07` Each of the 5 competency agents must configure retrieval guardrails so the agent uses a well-defined set of content sources and has clear instructions for what it can and cannot answer.
- `C-08` Each of the 5 competency agents must contain explicit error-handling with a defined fallback behavior for low-confidence or out-of-scope questions.
- `C-11` At least 1 of the 5 competency agents must use conditional branching.
- `C-12` At least 1 of the 5 competency agents must use loops to process a collection.
- `C-13` At least 1 of the 5 competency agents must use a schedule-based trigger.
- `C-14` At least 1 of the 5 competency agents must use an event or content-based trigger.
- `C-20` Advanced agent capabilities include schedule-based triggers, event-driven runs on content changes, and conditional branching and looping to orchestrate robust workflows.
- `C-21` Agent design best practices are to pick the right primitive for the job, structure steps, load and filter context effectively, and tune for reliability, cost, and performance.

### S-04 - Advanced Agent Debugging for Glean Partners

- `C-80` Too much memory leads to slower, more expensive runs with wandering answers, while too little memory creates brittle agents that forget constraints or prior results.
- `C-81` Memory options are all previous steps for short flows or complex reasoning, only the immediate previous step as the default for formatting and cleanup, and no memory for independent operations.
- `C-82` Model selection strategy is to use small and fast models for simple transforms and reserve larger models only where reasoning clearly benefits the outcome.
- `C-83` The debugging training reports a 3x speed improvement from optimized memory settings and a 60% cost reduction from using right-sized models.

### S-05 - Partner Accreditation & Competency Roadmap - Module Tracker

- `C-93` BLD-104 is a deeper workshop on agent composition, memory, tool selection, and reusable patterns.
- `C-94` BLD-207 covers how to evaluate prompts and agents, measure quality, and prevent regressions.

### S-06 - Partner Enablement Content Library

- `C-100` The Advanced Agent Building enablement teaches how to build agents and best practices for when to use different agent steps, and is delivered as an agent hackathon exercise lasting 1.5 to 4 hours.

## Conflicts and gaps

No contradictions were found between sources for the claims used in this module.
Where a source reports a performance figure, the claim attributes the figure to that
source rather than stating it as an independent platform guarantee.
