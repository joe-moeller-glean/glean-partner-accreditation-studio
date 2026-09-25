/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "BLD-101",
  "title": "Building with Glean",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Inventory what partners can build with agents, actions, APIs, and integration points."
    },
    {
      "id": "OBJ-02",
      "text": "Describe how the build motion converts into reusable partner IP."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Cold open",
      "title": "Your team can build on Glean. Do you know the full surface?",
      "body": "Most partner teams start and stop at agents. The platform is wider than that, and the parts you do not know about are usually where the margin is.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "By the end of this module",
      "bullets": [
        "Name every surface a partner can build on.",
        "Explain how build work becomes reusable IP rather than one-off effort."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "The surface",
      "title": "Four places partners build",
      "body": "This path introduces what can be built with agents, actions, APIs, and integration points. Technology partners build using APIs, MCP-based tools, embedded experiences, agent extensions, and the connector framework.",
      "asset": {
        "src": "assets/svg/bld-101-a01.svg",
        "alt": "Four cards showing the partner build surface across agents, actions and MCP, APIs, and connectors.",
        "caption": "Four build surfaces, one extensible platform."
      },
      "claims": [
        "C-90",
        "C-110"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A11",
      "objective": "OBJ-02",
      "eyebrow": "Why it matters",
      "title": "Build work is the margin conversation",
      "body": "Partners differentiate their business with custom agents, connectors, and embedded experiences that create reusable IP and higher-margin offerings.",
      "footnote": "That is the difference between selling hours and selling an asset you own.",
      "claims": [
        "C-109"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A12",
      "objective": "OBJ-01",
      "eyebrow": "Checkpoint",
      "title": "Where do agents sit?",
      "type": "choice",
      "prompt": "Pick the accurate description of an agent.",
      "options": [
        {
          "id": "o1",
          "text": "The governed workflow wrapper that packages skills, tools, and knowledge together.",
          "correct": true,
          "feedback": "Correct. Agents operationalize skills, actions, and MCP into production workflows."
        },
        {
          "id": "o2",
          "text": "A connector that indexes a proprietary data source.",
          "feedback": "No. That is the connector framework, a different build surface."
        },
        {
          "id": "o3",
          "text": "An SDK for embedding search into a web application.",
          "feedback": "No. That is the embedded experience and Client API surface."
        }
      ],
      "claims": [
        "C-49",
        "C-67"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "quiz",
      "objective": "OBJ-01",
      "eyebrow": "Prove it",
      "title": "Build surface check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "Which set describes what partners can build with on Glean?",
          "options": [
            {
              "id": "a",
              "text": "APIs, MCP-based tools, embedded experiences, agent extensions, and the connector framework.",
              "correct": true,
              "feedback": "Correct. That is the documented technology-partner build surface."
            },
            {
              "id": "b",
              "text": "Only prompts inside the assistant.",
              "feedback": "No. Prompts are one small part of a much wider surface."
            },
            {
              "id": "c",
              "text": "Only pre-built connectors, with no custom option.",
              "feedback": "No. The connector framework exists specifically for custom sources."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "Why is build work described as higher margin for partners?",
          "options": [
            {
              "id": "a",
              "text": "Custom agents, connectors, and embedded experiences create reusable IP.",
              "correct": true,
              "feedback": "Correct. Reusable IP is resold across engagements instead of rebuilt each time."
            },
            {
              "id": "b",
              "text": "Because build work is always billed at a premium day rate.",
              "feedback": "No. The margin comes from reuse, not from rate."
            },
            {
              "id": "c",
              "text": "Because it removes the need for delivery staff.",
              "feedback": "No. Build work does not eliminate delivery."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-01",
          "stem": "An agent, in one sentence, is:",
          "options": [
            {
              "id": "a",
              "text": "The governed workflow wrapper that packages skills, tools, and knowledge together.",
              "correct": true,
              "feedback": "Correct, and that framing keeps agents distinct from actions and MCP."
            },
            {
              "id": "b",
              "text": "An open protocol for exposing tools to AI applications.",
              "feedback": "No. That is MCP."
            },
            {
              "id": "c",
              "text": "A single tool call that writes to one system.",
              "feedback": "No. That is an action."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-01",
          "stem": "Which build surface brings a proprietary internal source into the knowledge layer?",
          "options": [
            {
              "id": "a",
              "text": "The connector framework.",
              "correct": true,
              "feedback": "Correct. Connectors are how non-standard sources become searchable knowledge."
            },
            {
              "id": "b",
              "text": "An agent schedule trigger.",
              "feedback": "No. Triggers control when an agent runs, not what is indexed."
            },
            {
              "id": "c",
              "text": "A platform skill.",
              "feedback": "No. Skills carry methodology, not indexing."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-02",
          "stem": "Which platform description is correct?",
          "options": [
            {
              "id": "a",
              "text": "The Glean platform spans Search, Assistant, and Agents.",
              "correct": true,
              "feedback": "Correct, and all three sit over the same company knowledge."
            },
            {
              "id": "b",
              "text": "Search and Agents are separate products with separate indexes.",
              "feedback": "No. They share the platform's knowledge layer."
            },
            {
              "id": "c",
              "text": "Assistant is available only to partners.",
              "feedback": "No. That is not how the platform is positioned."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A14",
      "objective": "OBJ-02",
      "eyebrow": "Next step",
      "title": "You know the surface. Next you learn the tools.",
      "body": "BLD-102 goes deep on actions and MCP: what each one is, and when to use which.",
      "badge": "Building with Glean: complete",
      "signature": true,
      "claims": [
        "C-91"
      ]
    }
  ]
};
