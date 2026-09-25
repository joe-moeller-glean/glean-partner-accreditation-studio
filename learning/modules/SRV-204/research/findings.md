# SRV-204 Advanced Agent Debugging - research findings

Verified 2026-09-02. 18 claims drawn from 3 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-04` | [Advanced Agent Debugging for Glean Partners](https://drive.google.com/file/d/1C6NRtjfCa88F0SKeT04XJuloOr16ijih) | Katya Alfaro | 2026-02-11 | 1 |
| `S-05` | [Partner Accreditation & Competency Roadmap - Module Tracker](https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q) | Joe Moeller | 2026-08-13 | 1 |
| `S-06` | [Partner Enablement Content Library](https://docs.google.com/spreadsheets/d/1lDz14hUsXJA93IpQcOd-TD2D48J4AUpBke2esP27Fwo) | Joe Moeller | 2026-06-26 | 2 |

## Claims by source

### S-04 - Advanced Agent Debugging for Glean Partners

- `C-71` To enable debug mode, open the agent in Builder, toggle Debug mode in the preview pane, and run the agent; multi-turn chat is supported.
- `C-72` In the debug trace, green indicates success and red indicates error, and the trace persists across panel open and close.
- `C-73` The debug trace exposes inputs, including referenced memory and variables, and outputs, including raw tool and LLM responses.
- `C-74` The effective debugging workflow is to filter to only show errors, open the failing step, compare inputs against outputs, and iterate with Try Again or Reset Preview.
- `C-75` Failure category 1 is instruction-following failures: wrong tools planned, ignored instructions, and a sloppy final answer.
- `C-76` Failure category 2 is retrieval and context-selection failures: the right tool runs but returns wrong or missing results, such as document not found when it exists.
- `C-77` Failure category 3 is action and integration failures: HTTP errors, validation errors, partial writes, and timeouts.
- `C-78` Failure category 4 is trigger and scheduling failures: the agent never runs, runs at the wrong time, or runs on the wrong content.
- `C-79` Failure category 5 is UI and configuration issues: buttons not working, save failures, and permissions problems.
- `C-80` Too much memory leads to slower, more expensive runs with wandering answers, while too little memory creates brittle agents that forget constraints or prior results.
- `C-81` Memory options are all previous steps for short flows or complex reasoning, only the immediate previous step as the default for formatting and cleanup, and no memory for independent operations.
- `C-82` Model selection strategy is to use small and fast models for simple transforms and reserve larger models only where reasoning clearly benefits the outcome.
- `C-84` Partners should use the Glean Help Center 'Debug your agent' official guide and practice with live labs on a demo tenant to build hands-on debugging expertise.
- `C-85` The Advanced Agent Debugging training equips technical partner engineers and architects with tools, frameworks, and hands-on techniques to troubleshoot effectively and escalate intelligently.
- `C-86` The debugging journey covers the agent execution mental model, the debugging toolbox, the failure taxonomy, and escalation.
- `C-87` Debugging aims to find the root cause rather than just the symptoms.

### S-05 - Partner Accreditation & Competency Roadmap - Module Tracker

- `C-96` SRV-204 covers trace-driven debugging, issue isolation, and clean escalation packages.

### S-06 - Partner Enablement Content Library

- `C-102` The Advanced Agent Debugging playbook helps partners resolve customer issues faster, increase trust in production agents, and provide clear, actionable escalations back to Glean.

## Conflicts and gaps

No contradictions were found between sources for the claims used in this module.
Where a source reports a performance figure, the claim attributes the figure to that
source rather than stating it as an independent platform guarantee.
