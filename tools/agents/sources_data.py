#!/usr/bin/env python3
"""Vetted source ledger and claim library for the Agents accreditation.

Every learner-facing fact in the 11 agent modules resolves to a claim_id here,
and every claim resolves to one or more source_ids. Sources are internal Glean
partner-enablement documents retrieved via Glean enterprise search on 2026-09-02.
"""

VERIFIED_ON = "2026-09-02"
CHECKED_BY = "Fact Integrity Auditor (studio)"

# ---------------------------------------------------------------------------
# Sources
# ---------------------------------------------------------------------------
SOURCES = [
    {
        "source_id": "S-01",
        "title": "Glean Partner Competency Program Guide",
        "url": "https://docs.google.com/document/d/1Dy5ZFo2lyT6jDGoYMU7UlGrqp6IklLc-kIH7PbIWt9w",
        "owner": "Joe Moeller",
        "datasource": "gdrive",
        "doc_updated": "2026-08-05",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "program_definition",
        "notes": "Primary definition of the Agent Building Competency, its requirements, and benefits.",
        "reverify_by": "2026-12-01",
    },
    {
        "source_id": "S-02",
        "title": "Partner Enablement: Glean Agent Building - plan, launch, deploy, measure",
        "url": "https://drive.google.com/file/d/1oVhmo3s6sEFQ9b2DEl25poStQY6j7iHR",
        "owner": "Katya Alfaro",
        "datasource": "gdrive",
        "doc_updated": "2026-02-09",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "methodology_playbook",
        "notes": "Five-phase agent lifecycle methodology used as the spine of the delivery modules.",
        "reverify_by": "2026-12-01",
    },
    {
        "source_id": "S-03",
        "title": "Partner Enablement Deck: MCP, Custom Actions, and Skills",
        "url": "https://docs.google.com/document/d/1ZguIOERISj653MsmeHZzrqMIpmoMGAegGKkgNteIDeA",
        "owner": "Joe Moeller",
        "datasource": "gdrive",
        "doc_updated": "2026-04-13",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "product_positioning",
        "notes": "Authoritative internal positioning for skills, actions, MCP, and agents, including Agent Builder constraints.",
        "reverify_by": "2026-11-01",
    },
    {
        "source_id": "S-04",
        "title": "Advanced Agent Debugging for Glean Partners",
        "url": "https://drive.google.com/file/d/1C6NRtjfCa88F0SKeT04XJuloOr16ijih",
        "owner": "Katya Alfaro",
        "datasource": "gdrive",
        "doc_updated": "2026-02-11",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "technical_training",
        "notes": "Debug mode mechanics, five-category failure taxonomy, memory and model guidance.",
        "reverify_by": "2026-12-01",
    },
    {
        "source_id": "S-05",
        "title": "Partner Accreditation & Competency Roadmap - Module Tracker",
        "url": "https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q",
        "owner": "Joe Moeller",
        "datasource": "gdrive",
        "doc_updated": "2026-08-13",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "program_structure",
        "notes": "Module IDs, scope statements, levels, prerequisites, waves, and badge composition.",
        "reverify_by": "2026-10-01",
    },
    {
        "source_id": "S-06",
        "title": "Partner Enablement Content Library",
        "url": "https://docs.google.com/spreadsheets/d/1lDz14hUsXJA93IpQcOd-TD2D48J4AUpBke2esP27Fwo",
        "owner": "Joe Moeller",
        "datasource": "gdrive",
        "doc_updated": "2026-06-26",
        "verified_on": VERIFIED_ON,
        "authority_tier": 2,
        "status": "current",
        "type": "asset_inventory",
        "notes": "Existing asset inventory, owners, durations, and partner impact statements.",
        "reverify_by": "2026-11-01",
    },
    {
        "source_id": "S-07",
        "title": "Partner Enablement Journey - 2026",
        "url": "https://docs.google.com/presentation/d/1DS-qtII_ERaaJ2eN_-lcItG_UxJt6keKvcHPdGG-V24",
        "owner": "Katya Alfaro",
        "datasource": "gdrive",
        "doc_updated": "2026-06-25",
        "verified_on": VERIFIED_ON,
        "authority_tier": 2,
        "status": "current",
        "type": "curriculum",
        "notes": "Course agendas, durations, levels, and prerequisites for the Agents and Actions courses.",
        "reverify_by": "2026-11-01",
    },
    {
        "source_id": "S-08",
        "title": "[EXT] Glean Partner Program Guide 2026",
        "url": "https://docs.google.com/presentation/d/1EYNjy-_BHPG6SgmwsBdriK2BF_KW7wzCKm0JR3y2OFk",
        "owner": "Matt Schenck",
        "datasource": "gdrive",
        "doc_updated": "2026-08-12",
        "verified_on": VERIFIED_ON,
        "authority_tier": 2,
        "status": "current",
        "type": "program_positioning",
        "notes": "External-facing platform and partner-motion positioning.",
        "reverify_by": "2026-11-01",
    },
]

# ---------------------------------------------------------------------------
# Claims: (claim_id, text, [source_ids])
# ---------------------------------------------------------------------------
_CLAIMS = [
    # --- S-01 Agent Building Competency ---------------------------------
    ("C-01", "The Glean Agent Building Competency certifies partner teams to design, build, govern, and operationalize production-grade Glean Agents that automate workflows and deliver measurable business outcomes.", ["S-01"]),
    ("C-02", "The Agent Building Competency focuses on persona-aligned agent design, prompt engineering, tool use, governance, and operational best practices across the agent lifecycle.", ["S-01"]),
    ("C-03", "One competency requirement is completing 5 technical accreditations within the Glean Partner Portal, validated by a Glean Partner Manager.", ["S-01"]),
    ("C-04", "One competency requirement is completing a Glean-delivered agent building workshop session with your Glean technical team, validated by a Glean Partner Solutions Engineer.", ["S-01"]),
    ("C-05", "The competency requires building 5 functioning, production-ready agents.", ["S-01"]),
    ("C-06", "Each of the 5 competency agents must implement at least 3 discrete steps beyond simple retrieval, including at least one thinking or transformation step.", ["S-01"]),
    ("C-07", "Each of the 5 competency agents must configure retrieval guardrails so the agent uses a well-defined set of content sources and has clear instructions for what it can and cannot answer.", ["S-01"]),
    ("C-08", "Each of the 5 competency agents must contain explicit error-handling with a defined fallback behavior for low-confidence or out-of-scope questions.", ["S-01"]),
    ("C-09", "At least 1 of the 5 competency agents must invoke actions or tools that write to other systems.", ["S-01"]),
    ("C-10", "At least 1 of the 5 competency agents must call more than one tool or system in a single run.", ["S-01"]),
    ("C-11", "At least 1 of the 5 competency agents must use conditional branching.", ["S-01"]),
    ("C-12", "At least 1 of the 5 competency agents must use loops to process a collection.", ["S-01"]),
    ("C-13", "At least 1 of the 5 competency agents must use a schedule-based trigger.", ["S-01"]),
    ("C-14", "At least 1 of the 5 competency agents must use an event or content-based trigger.", ["S-01"]),
    ("C-15", "For each competency agent, partners must gather business and technical requirements with the end user, evidenced by a document outlining those requirements.", ["S-01"]),
    ("C-16", "Competency validation includes a call with a Glean Partner Solutions Engineer to review the finalized agents; partners should expect to walk through and run each agent on the call, and ideally provide a recorded walkthrough beforehand.", ["S-01"]),
    ("C-17", "For each competency agent, partners must complete an agent architecture review with a Glean technical resource, outlining best practices followed and agent structure.", ["S-01"]),
    ("C-18", "For each competency agent, partners must provide a written outline of the agent's business impact and why a Glean Agent was the best solution, reviewed by a Glean Partner Solutions Engineer.", ["S-01"]),
    ("C-19", "Competency graduates can design and implement persona-aligned agents, define intents, configure retrieval and guardrails, and construct multi-step agents with clear handoffs and fallbacks.", ["S-01"]),
    ("C-20", "Advanced agent capabilities include schedule-based triggers, event-driven runs on content changes, and conditional branching and looping to orchestrate robust workflows.", ["S-01"]),
    ("C-21", "Agent design best practices are to pick the right primitive for the job, structure steps, load and filter context effectively, and tune for reliability, cost, and performance.", ["S-01"]),
    ("C-22", "Competency benefits include market visibility as a trusted Glean Partner, a Glean Partner Competency Badge, access to Glean services opportunities, being surfaced to Glean sellers as a preferred services partner, and a searchable directory listing.", ["S-01"]),
    ("C-23", "Agent Building Competency benefits include priority consideration for agent-focused services opportunities and co-marketing opportunities that highlight agent outcomes and ROI.", ["S-01"]),
    ("C-24", "The Competency Program is open to all registered Glean Partners, including resell, services, and ISV or product partners, and the organization must already be a registered Glean Partner.", ["S-01"]),
    ("C-25", "Glean competencies require thorough experience and successful completion of an audit process.", ["S-01"]),
    ("C-26", "The Agent Building Competency Submission Workbook is available in the Glean Partner Portal Asset Library.", ["S-01"]),
    ("C-27", "Competency graduates understand best practices for testing and validation of Glean agents.", ["S-01"]),
    ("C-28", "The Competency Program formalizes how partners are accredited to deliver Glean services from deployment through transformation engagements.", ["S-01"]),
    ("C-29", "Glean competencies are integrated with co-selling motions so qualified partners can deliver scoped outcomes.", ["S-01"]),
    ("C-30", "Competency graduates can deliver enablement and advisory on agents and AI actions.", ["S-01"]),

    # --- S-02 Agent lifecycle playbook ----------------------------------
    ("C-31", "The Agent and Prompt Building playbook defines a five-phase methodology covering plan, build, launch, adopt, and measure.", ["S-02"]),
    ("C-32", "The playbook is designed for product managers, automation leads, and technical owners responsible for scaling agent capabilities in enterprise environments.", ["S-02"]),
    ("C-33", "A well-established agent library serves as the organization's automation hub: a central repository where proven agents are cataloged, documented, and made accessible across teams.", ["S-02"]),
    ("C-34", "Combining an agent library with user empowerment initiatives that let end users build and run their own agents creates a multiplier effect where innovation happens at every level.", ["S-02"]),
    ("C-35", "Planning begins with a review of the organization's use case repository and facilitated discovery workshops that surface pain points, inefficiencies, and opportunities.", ["S-02"]),
    ("C-36", "An Effort/Impact matrix helps teams rank candidate agents by business value and implementation complexity so resources go to the highest-return agents.", ["S-02"]),
    ("C-37", "For each priority agent, assign a project lead and supporting experts, document the current process including baseline performance numbers, design the future-state process with expected improvements, and build an implementation plan covering scope, key dates, success measures, and security and data compliance checks.", ["S-02"]),
    ("C-38", "Infrastructure preparation is the first build block: configure data source connectors and establish indexing protocols for any new data sources the agent will access.", ["S-02"]),
    ("C-39", "The build phase translates the approved design into an agent architecture map, implements the agent in the Glean platform following best practices, executes comprehensive testing and refinement cycles, and secures formal owner sign-off before launch.", ["S-02"]),
    ("C-40", "Launch requires enablement collateral: announcement communications, business case documentation, usage instructions, and example inputs and outputs.", ["S-02"]),
    ("C-41", "Strategic piloting with power users and champions creates momentum before broader rollout, and those early adopters become advocates who influence peers.", ["S-02"]),
    ("C-42", "Without proper promotion and enablement, even the most powerful agents remain underutilized.", ["S-02"]),
    ("C-43", "The launch sequence is create enablement materials, pilot with champions, publish broadly, then monitor adoption.", ["S-02"]),
    ("C-44", "The adopt phase extends usage by evangelizing success, incentivizing usage, and expanding applications to new use cases.", ["S-02"]),
    ("C-45", "Measurement compares actual outcomes against the KPIs and success criteria defined during planning, using both quantitative data and qualitative feedback.", ["S-02"]),
    ("C-46", "Usage analytics should track the number of agent runs, count of distinct users, frequency of use, and patterns of engagement over time.", ["S-02"]),
    ("C-47", "High abandonment rates or declining usage can indicate user friction or changing needs.", ["S-02"]),
    ("C-48", "Measurement insights feed directly back into planning to create a continuous improvement cycle, and successful agents become templates for future development.", ["S-02"]),

    # --- S-03 Primitives, actions, MCP, skills --------------------------
    ("C-49", "The mental model is: skills are reusable instructions, templates, and domain expertise; actions are tool calls that read from or write to systems; MCP is an open protocol for exposing tools and data to AI apps and agents; and agents are the governed workflow wrapper that packages skills, tools, and knowledge together.", ["S-03"]),
    ("C-50", "Use skills when you need repeatable methodology, domain expertise, or consistent reasoning.", ["S-03"]),
    ("C-51", "Use custom actions when you need deterministic execution against an internal API, legacy system, or proprietary workflow.", ["S-03"]),
    ("C-52", "Use MCP when you want open-standard interoperability and reusable tool access across ecosystems.", ["S-03"]),
    ("C-53", "Use agents when you need scheduled, event-driven, or governed end-to-end workflows.", ["S-03"]),
    ("C-54", "MCP is an open standard for connecting AI assistants to external data sources and tools.", ["S-03"]),
    ("C-55", "Glean can act as both an MCP server and an MCP host.", ["S-03"]),
    ("C-56", "For partners, MCP means faster integrations, less lock-in, and easier reuse across hosts such as Cursor, Claude, ChatGPT, and VS Code.", ["S-03"]),
    ("C-57", "Remote MCP servers are fully supported for Assistant.", ["S-03"]),
    ("C-58", "In Agents, MCP-backed tools are available in Plan and Execute mode and in auto mode.", ["S-03"]),
    ("C-59", "MCP tools are not available as individual single-step selections in Agent Builder.", ["S-03"]),
    ("C-60", "Custom actions are org-defined automations for cases where built-in actions and action packs are not enough.", ["S-03"]),
    ("C-61", "Custom actions fit internal APIs or services Glean does not support out of the box, legacy or in-house systems, and approvals, validation, or custom business logic before writing to a system.", ["S-03"]),
    ("C-62", "Builders add a custom action as a step in Agent Builder, and its inputs can be fixed values, user inputs, or AI-predicted values.", ["S-03"]),
    ("C-63", "Custom actions can be combined with By Glean and By datasource actions in the same workflow.", ["S-03"]),
    ("C-64", "Skills are reusable packages of instructions, templates, and tools that teach Assistant how to execute specific tasks with domain expertise, and they are loaded only when relevant.", ["S-03"]),
    ("C-65", "Native and custom examples pair as follows: a verified GitHub, Notion, Asana, Canva, HubSpot, or PagerDuty MCP server against a customer-hosted internal MCP server; a built-in Gmail or Jira creation template against an internal onboarding, approval, or ticketing workflow action; and a Glean platform skill against a partner-authored methodology.", ["S-03"]),
    ("C-66", "Recommended partner positioning is to start with the job to be done, prefer native options first, and go custom when the customer needs proprietary workflow logic, internal systems, or differentiated partner IP.", ["S-03"]),
    ("C-67", "Skills standardize reasoning, actions standardize execution, MCP standardizes interoperability, and agents operationalize all three into production workflows.", ["S-03"]),
    ("C-68", "An example custom action is an internal IT onboarding action that creates a request and returns a request ID plus a link.", ["S-03"]),
    ("C-69", "Use MCP when an agent needs dynamic tool choice across a connected toolset and broad interoperability.", ["S-03"]),
    ("C-70", "Partner scenarios for these primitives include an engineering copilot in the IDE using the Glean MCP server, internal workflow automation using a custom action, and standardized consulting delivery using a skill.", ["S-03"]),

    # --- S-04 Debugging --------------------------------------------------
    ("C-71", "To enable debug mode, open the agent in Builder, toggle Debug mode in the preview pane, and run the agent; multi-turn chat is supported.", ["S-04"]),
    ("C-72", "In the debug trace, green indicates success and red indicates error, and the trace persists across panel open and close.", ["S-04"]),
    ("C-73", "The debug trace exposes inputs, including referenced memory and variables, and outputs, including raw tool and LLM responses.", ["S-04"]),
    ("C-74", "The effective debugging workflow is to filter to only show errors, open the failing step, compare inputs against outputs, and iterate with Try Again or Reset Preview.", ["S-04"]),
    ("C-75", "Failure category 1 is instruction-following failures: wrong tools planned, ignored instructions, and a sloppy final answer.", ["S-04"]),
    ("C-76", "Failure category 2 is retrieval and context-selection failures: the right tool runs but returns wrong or missing results, such as document not found when it exists.", ["S-04"]),
    ("C-77", "Failure category 3 is action and integration failures: HTTP errors, validation errors, partial writes, and timeouts.", ["S-04"]),
    ("C-78", "Failure category 4 is trigger and scheduling failures: the agent never runs, runs at the wrong time, or runs on the wrong content.", ["S-04"]),
    ("C-79", "Failure category 5 is UI and configuration issues: buttons not working, save failures, and permissions problems.", ["S-04"]),
    ("C-80", "Too much memory leads to slower, more expensive runs with wandering answers, while too little memory creates brittle agents that forget constraints or prior results.", ["S-04"]),
    ("C-81", "Memory options are all previous steps for short flows or complex reasoning, only the immediate previous step as the default for formatting and cleanup, and no memory for independent operations.", ["S-04"]),
    ("C-82", "Model selection strategy is to use small and fast models for simple transforms and reserve larger models only where reasoning clearly benefits the outcome.", ["S-04"]),
    ("C-83", "The debugging training reports a 3x speed improvement from optimized memory settings and a 60% cost reduction from using right-sized models.", ["S-04"]),
    ("C-84", "Partners should use the Glean Help Center 'Debug your agent' official guide and practice with live labs on a demo tenant to build hands-on debugging expertise.", ["S-04"]),
    ("C-85", "The Advanced Agent Debugging training equips technical partner engineers and architects with tools, frameworks, and hands-on techniques to troubleshoot effectively and escalate intelligently.", ["S-04"]),
    ("C-86", "The debugging journey covers the agent execution mental model, the debugging toolbox, the failure taxonomy, and escalation.", ["S-04"]),
    ("C-87", "Debugging aims to find the root cause rather than just the symptoms.", ["S-04"]),

    # --- S-05 Roadmap module scope --------------------------------------
    ("C-88", "FND-104 explains the Glean operating model for search, assistants, and agents, and where each construct fits for customer outcomes.", ["S-05"]),
    ("C-89", "FND-105 provides a decision framework for when to use search, assistant, prompt, agent, action, connector, or integration pattern.", ["S-05"]),
    ("C-90", "BLD-101 introduces what can be built with agents, actions, APIs, and integration points.", ["S-05"]),
    ("C-91", "BLD-102 explains actions, MCP, architecture choices, and when to use each approach.", ["S-05"]),
    ("C-92", "BLD-103 is a hands-on workshop building actions and MCP-backed flows.", ["S-05"]),
    ("C-93", "BLD-104 is a deeper workshop on agent composition, memory, tool selection, and reusable patterns.", ["S-05"]),
    ("C-94", "BLD-207 covers how to evaluate prompts and agents, measure quality, and prevent regressions.", ["S-05"]),
    ("C-95", "BLD-208 covers safety patterns, approval design, escalation boundaries, and production governance for partner-built agents.", ["S-05"]),
    ("C-96", "SRV-204 covers trace-driven debugging, issue isolation, and clean escalation packages.", ["S-05"]),
    ("C-97", "SOL-203 designs industry-specific agents that map to common workflows, data sources, and governance requirements.", ["S-05"]),
    ("C-98", "ACC-104 is the badge for builders who can implement actions, agents, and connectors, assessed by a capstone lab.", ["S-05"]),
    ("C-99", "IND-201 is a factory-style module for turning vertical workflows into reusable agent accelerators.", ["S-05"]),

    # --- S-06 / S-07 / S-08 curriculum and platform ---------------------
    ("C-100", "The Advanced Agent Building enablement teaches how to build agents and best practices for when to use different agent steps, and is delivered as an agent hackathon exercise lasting 1.5 to 4 hours.", ["S-06"]),
    ("C-101", "The Agent and Prompt Building Playbook is a factory-style framework for discovering high-value use cases, then designing, building, and iterating agents and prompts that deliver measurable impact.", ["S-06"]),
    ("C-102", "The Advanced Agent Debugging playbook helps partners resolve customer issues faster, increase trust in production agents, and provide clear, actionable escalations back to Glean.", ["S-06"]),
    ("C-103", "The Glean Agents course covers agent best practices and terminology, what makes an effective agentic use case, common departmental use cases, and co-building agents in a hackathon-style format.", ["S-07"]),
    ("C-104", "The Glean Agents course is intermediate level, runs 2 to 4 hours in person for technical and services roles, and expects prompt engineering experience plus end-user access to a Glean environment.", ["S-07"]),
    ("C-105", "The Glean Actions and Integrations course covers departmental use cases, actions and MCP including building custom actions and connecting a remote MCP server, integrations such as the Client API and ServiceNow ticket resolution, and a hands-on build workshop.", ["S-07"]),
    ("C-106", "The Glean Actions and Integrations course is advanced level, runs 2 to 4 hours, and expects experience with RESTful APIs.", ["S-07"]),
    ("C-107", "The technical enablement journey builds hands-on skills creating custom agents and actions.", ["S-07"]),
    ("C-108", "Glean provides a trusted AI layer over company knowledge, powering enterprise search, assistants, agents, and workflow automation.", ["S-08"]),
    ("C-109", "Partners differentiate their business with custom agents, connectors, and embedded experiences that create reusable IP and higher-margin offerings.", ["S-08"]),
    ("C-110", "Technology partners build on Glean's open, extensible platform using APIs, MCP-based tools, embedded experiences, agent extensions, and the connector framework.", ["S-08"]),
    ("C-111", "The Glean platform spans Search, Assistant, and Agents.", ["S-08"]),
    ("C-112", "Partner value-creation motions are source, deploy, build, and scale.", ["S-08"]),
]

CLAIMS = {
    cid: {
        "claim_id": cid,
        "text": text,
        "source_ids": sids,
        "verdict": "verified",
        "verified_on": VERIFIED_ON,
        "checked_by": CHECKED_BY,
    }
    for cid, text, sids in _CLAIMS
}

SOURCES_BY_ID = {s["source_id"]: s for s in SOURCES}


def claims_for(claim_ids):
    """Return claim records for the given ids, raising on any unknown id."""
    missing = [c for c in claim_ids if c not in CLAIMS]
    if missing:
        raise KeyError(f"undefined claims referenced: {missing}")
    return [CLAIMS[c] for c in claim_ids]


def sources_for(claim_ids):
    """Return the source records needed to support the given claims."""
    sids = []
    for cid in claim_ids:
        for s in CLAIMS[cid]["source_ids"]:
            if s not in sids:
                sids.append(s)
    return [SOURCES_BY_ID[s] for s in sorted(sids)]
