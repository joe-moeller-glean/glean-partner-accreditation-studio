# BLD-102 Actions & MCP Fundamentals - research findings

Verified 2026-09-02. 15 claims drawn from 2 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-03` | [Partner Enablement Deck: MCP, Custom Actions, and Skills](https://docs.google.com/document/d/1ZguIOERISj653MsmeHZzrqMIpmoMGAegGKkgNteIDeA) | Joe Moeller | 2026-04-13 | 1 |
| `S-05` | [Partner Accreditation & Competency Roadmap - Module Tracker](https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q) | Joe Moeller | 2026-08-13 | 1 |

## Claims by source

### S-03 - Partner Enablement Deck: MCP, Custom Actions, and Skills

- `C-49` The mental model is: skills are reusable instructions, templates, and domain expertise; actions are tool calls that read from or write to systems; MCP is an open protocol for exposing tools and data to AI apps and agents; and agents are the governed workflow wrapper that packages skills, tools, and knowledge together.
- `C-51` Use custom actions when you need deterministic execution against an internal API, legacy system, or proprietary workflow.
- `C-54` MCP is an open standard for connecting AI assistants to external data sources and tools.
- `C-55` Glean can act as both an MCP server and an MCP host.
- `C-56` For partners, MCP means faster integrations, less lock-in, and easier reuse across hosts such as Cursor, Claude, ChatGPT, and VS Code.
- `C-57` Remote MCP servers are fully supported for Assistant.
- `C-58` In Agents, MCP-backed tools are available in Plan and Execute mode and in auto mode.
- `C-59` MCP tools are not available as individual single-step selections in Agent Builder.
- `C-60` Custom actions are org-defined automations for cases where built-in actions and action packs are not enough.
- `C-61` Custom actions fit internal APIs or services Glean does not support out of the box, legacy or in-house systems, and approvals, validation, or custom business logic before writing to a system.
- `C-62` Builders add a custom action as a step in Agent Builder, and its inputs can be fixed values, user inputs, or AI-predicted values.
- `C-63` Custom actions can be combined with By Glean and By datasource actions in the same workflow.
- `C-68` An example custom action is an internal IT onboarding action that creates a request and returns a request ID plus a link.

### S-05 - Partner Accreditation & Competency Roadmap - Module Tracker

- `C-91` BLD-102 explains actions, MCP, architecture choices, and when to use each approach.
- `C-92` BLD-103 is a hands-on workshop building actions and MCP-backed flows.

## Conflicts and gaps

No contradictions were found between sources for the claims used in this module.
Where a source reports a performance figure, the claim attributes the figure to that
source rather than stating it as an independent platform guarantee.
