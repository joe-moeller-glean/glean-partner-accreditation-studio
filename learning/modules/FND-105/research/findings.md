# FND-105 Choosing the Right Construct / Primitive - research findings

Verified 2026-09-02. 13 claims drawn from 2 vetted sources.

## Sources

| ID | Source | Owner | Updated | Tier |
|---|---|---|---|---|
| `S-03` | [Partner Enablement Deck: MCP, Custom Actions, and Skills](https://docs.google.com/document/d/1ZguIOERISj653MsmeHZzrqMIpmoMGAegGKkgNteIDeA) | Joe Moeller | 2026-04-13 | 1 |
| `S-05` | [Partner Accreditation & Competency Roadmap - Module Tracker](https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q) | Joe Moeller | 2026-08-13 | 1 |

## Claims by source

### S-03 - Partner Enablement Deck: MCP, Custom Actions, and Skills

- `C-51` Use custom actions when you need deterministic execution against an internal API, legacy system, or proprietary workflow.
- `C-53` Use agents when you need scheduled, event-driven, or governed end-to-end workflows.
- `C-57` Remote MCP servers are fully supported for Assistant.
- `C-58` In Agents, MCP-backed tools are available in Plan and Execute mode and in auto mode.
- `C-59` MCP tools are not available as individual single-step selections in Agent Builder.
- `C-61` Custom actions fit internal APIs or services Glean does not support out of the box, legacy or in-house systems, and approvals, validation, or custom business logic before writing to a system.
- `C-65` Native and custom examples pair as follows: a verified GitHub, Notion, Asana, Canva, HubSpot, or PagerDuty MCP server against a customer-hosted internal MCP server; a built-in Gmail or Jira creation template against an internal onboarding, approval, or ticketing workflow action; and a Glean platform skill against a partner-authored methodology.
- `C-66` Recommended partner positioning is to start with the job to be done, prefer native options first, and go custom when the customer needs proprietary workflow logic, internal systems, or differentiated partner IP.
- `C-67` Skills standardize reasoning, actions standardize execution, MCP standardizes interoperability, and agents operationalize all three into production workflows.
- `C-68` An example custom action is an internal IT onboarding action that creates a request and returns a request ID plus a link.
- `C-69` Use MCP when an agent needs dynamic tool choice across a connected toolset and broad interoperability.
- `C-70` Partner scenarios for these primitives include an engineering copilot in the IDE using the Glean MCP server, internal workflow automation using a custom action, and standardized consulting delivery using a skill.

### S-05 - Partner Accreditation & Competency Roadmap - Module Tracker

- `C-89` FND-105 provides a decision framework for when to use search, assistant, prompt, agent, action, connector, or integration pattern.

## Conflicts and gaps

No contradictions were found between sources for the claims used in this module.
Where a source reports a performance figure, the claim attributes the figure to that
source rather than stating it as an independent platform guarantee.
