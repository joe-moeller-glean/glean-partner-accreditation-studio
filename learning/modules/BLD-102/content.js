/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "BLD-102",
  "title": "Actions & MCP Fundamentals",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Define actions, MCP, and skills precisely enough to defend a design choice."
    },
    {
      "id": "OBJ-02",
      "text": "Apply the documented Agent Builder and Assistant support constraints for MCP and custom actions."
    },
    {
      "id": "OBJ-03",
      "text": "Choose between a custom action and an MCP-backed tool for a stated requirement."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Cold open",
      "title": "The design review stalls on one word: tool",
      "body": "Three engineers use tool to mean three different things. One means an action. One means an MCP server. One means a skill. The review cannot finish until the vocabulary does.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Precision first, then architecture",
      "bullets": [
        "Define actions, MCP, and skills without hand-waving.",
        "Apply the real platform support constraints.",
        "Pick between a custom action and MCP for a written requirement."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Definitions",
      "title": "Four words, four meanings",
      "body": "Skills are reusable instructions, templates, and domain expertise. Actions are tool calls that read from or write to systems. MCP is an open protocol for exposing tools and data to AI apps and agents. Agents are the governed workflow wrapper.",
      "asset": {
        "src": "assets/svg/bld-102-a01.svg",
        "alt": "Four definition cards for skills, actions, MCP, and agents.",
        "caption": "Blur these and you will design the wrong thing."
      },
      "claims": [
        "C-49"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "MCP deep dive",
      "title": "MCP is a standard, not a Glean feature",
      "bullets": [
        "MCP is an open standard for connecting AI assistants to external data sources and tools.",
        "Glean can act as both an MCP server and an MCP host.",
        "For partners, MCP means faster integrations, less lock-in, and easier reuse across hosts such as Cursor, Claude, ChatGPT, and VS Code."
      ],
      "claims": [
        "C-54",
        "C-55",
        "C-56"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A4",
      "objective": "OBJ-02",
      "eyebrow": "Constraints",
      "title": "Know exactly where MCP works",
      "body": "These three statements decide more designs than any preference argument will.",
      "asset": {
        "src": "assets/svg/bld-102-a02.svg",
        "alt": "Numbered diagram of three MCP support and constraint statements across Assistant and Agents.",
        "caption": "Design constraints, verified against internal positioning."
      },
      "claims": [
        "C-57",
        "C-58",
        "C-59"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Custom actions deep dive",
      "title": "Custom actions are for the systems nobody else supports",
      "bullets": [
        "Custom actions are org-defined automations for cases where built-in actions and action packs are not enough.",
        "They fit internal APIs Glean does not support out of the box, legacy or in-house systems, and approvals, validation, or custom business logic before writing to a system.",
        "Builders add a custom action as a step in Agent Builder, and inputs can be fixed values, user inputs, or AI-predicted values.",
        "Custom actions can be combined with By Glean and By datasource actions in the same workflow."
      ],
      "claims": [
        "C-60",
        "C-61",
        "C-62",
        "C-63"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A8",
      "objective": "OBJ-03",
      "eyebrow": "Worked example",
      "title": "An onboarding action, end to end",
      "steps": [
        {
          "title": "The operation",
          "body": "An internal IT onboarding action creates a request and returns a request ID plus link."
        },
        {
          "title": "Why custom",
          "body": "The target is an internal system with validation before the write, which built-in actions do not cover."
        },
        {
          "title": "Where it runs",
          "body": "Added as a step in Agent Builder, with inputs supplied as fixed values, user inputs, or AI-predicted values."
        },
        {
          "title": "What it composes with",
          "body": "It can sit in the same workflow as By Glean and By datasource actions."
        }
      ],
      "claims": [
        "C-68",
        "C-61",
        "C-62",
        "C-63"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A6",
      "objective": "OBJ-03",
      "eyebrow": "Decision branch",
      "title": "One agent step must always hit the same endpoint",
      "type": "choice",
      "prompt": "The design needs a single fixed, deterministic call inside Agent Builder. What do you specify?",
      "options": [
        {
          "id": "o1",
          "text": "A custom action as the step.",
          "correct": true,
          "feedback": "Correct. MCP tools are not available as individual single-step selections in Agent Builder, and this requirement is deterministic execution."
        },
        {
          "id": "o2",
          "text": "An MCP tool selected as that single step.",
          "feedback": "Not possible. MCP tools are not available as individual single-step selections in Agent Builder."
        },
        {
          "id": "o3",
          "text": "A skill that describes the call.",
          "feedback": "No. Skills teach approach and reasoning; they do not perform the deterministic call."
        }
      ],
      "takeaway": "Use custom actions when you want precise, governed execution for a known operation.",
      "claims": [
        "C-59",
        "C-51"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "quiz",
      "objective": "OBJ-02",
      "eyebrow": "Prove it",
      "title": "Actions and MCP check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "What is MCP?",
          "options": [
            {
              "id": "a",
              "text": "An open standard for connecting AI assistants to external data sources and tools.",
              "correct": true,
              "feedback": "Correct, and Glean can act as both an MCP server and an MCP host."
            },
            {
              "id": "b",
              "text": "A Glean-proprietary connector format.",
              "feedback": "No. It is an open standard, which is exactly why it reduces lock-in."
            },
            {
              "id": "c",
              "text": "A prompt template library.",
              "feedback": "No. That is closer to skills."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "In Agents, where are MCP-backed tools available?",
          "options": [
            {
              "id": "a",
              "text": "In Plan and Execute mode and in auto mode.",
              "correct": true,
              "feedback": "Correct. That is where dynamic tool choice belongs."
            },
            {
              "id": "b",
              "text": "As any individual single-step selection in Agent Builder.",
              "feedback": "No. That is explicitly not supported."
            },
            {
              "id": "c",
              "text": "Nowhere in Agents.",
              "feedback": "No. They are available in Plan and Execute and auto mode."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-03",
          "stem": "Which is a documented best-fit use case for a custom action?",
          "options": [
            {
              "id": "a",
              "text": "Approvals, validation, or custom business logic before writing to a system.",
              "correct": true,
              "feedback": "Correct, alongside internal APIs and legacy or in-house systems."
            },
            {
              "id": "b",
              "text": "Letting the agent choose dynamically among many connected tools.",
              "feedback": "No. Dynamic tool choice across a toolset is the MCP signal."
            },
            {
              "id": "c",
              "text": "Standardizing a consulting methodology.",
              "feedback": "No. That is a skill."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "How can a custom action's inputs be supplied?",
          "options": [
            {
              "id": "a",
              "text": "As fixed values, user inputs, or AI-predicted values.",
              "correct": true,
              "feedback": "Correct. That flexibility is what lets one action serve several flows."
            },
            {
              "id": "b",
              "text": "Only as hard-coded fixed values.",
              "feedback": "No. User inputs and AI-predicted values are also supported."
            },
            {
              "id": "c",
              "text": "Only from a connected MCP server.",
              "feedback": "No. Custom action inputs are independent of MCP."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-01",
          "stem": "Which composition statement is accurate?",
          "options": [
            {
              "id": "a",
              "text": "Custom actions can be combined with By Glean and By datasource actions in the same workflow.",
              "correct": true,
              "feedback": "Correct. Mixed-source workflows are normal, not exceptional."
            },
            {
              "id": "b",
              "text": "A workflow may contain only one category of action.",
              "feedback": "No. They combine freely in one workflow."
            },
            {
              "id": "c",
              "text": "Custom actions replace all built-in actions once enabled.",
              "feedback": "No. Custom actions supplement built-in actions and action packs."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A14",
      "objective": "OBJ-03",
      "eyebrow": "Next step",
      "title": "Definitions done. Time to build one.",
      "body": "BLD-103 is the hands-on workshop: build actions and MCP-backed flows against real requirements.",
      "badge": "Actions and MCP fundamentals: complete",
      "signature": true,
      "claims": [
        "C-92"
      ]
    }
  ]
};
