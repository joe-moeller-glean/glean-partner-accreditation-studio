/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "FND-104",
  "title": "AI Search, Assistants & Agents Operating Model",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Describe the Glean operating model across search, assistant, and agents."
    },
    {
      "id": "OBJ-02",
      "text": "Match each construct to the customer outcome it is built to serve."
    },
    {
      "id": "OBJ-03",
      "text": "Explain where partner-built extensions create differentiated value."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Cold open",
      "title": "The customer asks for an agent. Should you say yes?",
      "body": "A prospect opens with a request for a workflow agent. Nothing in the ask tells you whether the real answer is search, an assistant surface, an action, or a full agent. Choose wrong and you sell work that will not stick.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "By the end of this module",
      "bullets": [
        "Place search, assistant, and agents inside one operating model.",
        "Name the job each primitive is built to do.",
        "Say where partner-built work creates durable differentiation."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "The model",
      "title": "One platform over company knowledge",
      "body": "Glean provides a trusted AI layer over company knowledge, powering enterprise search, assistants, agents, and workflow automation. The platform spans Search, Assistant, and Agents.",
      "asset": {
        "src": "assets/svg/fnd-104-a01.svg",
        "alt": "Stacked diagram of the Glean operating model with agents on top, assistant in the middle, and search over company knowledge at the base.",
        "caption": "Search, Assistant, and Agents are one platform, not three products."
      },
      "claims": [
        "C-108",
        "C-111"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-02",
      "eyebrow": "Annotated model",
      "title": "Open each layer to see the job it does",
      "prompt": "Select a layer to reveal what it is responsible for.",
      "hotspots": [
        {
          "label": "Skills tell the model how to work",
          "detail": "Skills are reusable packages of instructions, templates, and tools that teach Assistant how to execute specific tasks with domain expertise, and they load only when relevant."
        },
        {
          "label": "Actions and MCP give it things to do",
          "detail": "Actions are tool calls that read from or write to systems. MCP is an open protocol for exposing tools and data to AI apps and agents."
        },
        {
          "label": "Agents package it into repeatable workflows",
          "detail": "Agents are the governed workflow wrapper that packages skills, tools, and knowledge together."
        }
      ],
      "claims": [
        "C-49",
        "C-64"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "Four primitives",
      "title": "Say the job out loud before you pick the tool",
      "body": "Skills standardize reasoning. Actions standardize execution. MCP standardizes interoperability. Agents operationalize all three into production workflows.",
      "asset": {
        "src": "assets/svg/fnd-104-a02.svg",
        "alt": "Four cards describing skills, actions, MCP, and agents and the job each one does.",
        "caption": "Each primitive answers a different question about the work."
      },
      "claims": [
        "C-67",
        "C-49"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A9",
      "objective": "OBJ-02",
      "eyebrow": "Sort it",
      "title": "Which construct fits the need?",
      "prompt": "Place each customer need with the construct built to serve it.",
      "type": "sort",
      "categories": [
        "Skills",
        "Custom actions",
        "MCP",
        "Agents"
      ],
      "pairs": [
        {
          "item": "We need the same discovery methodology applied consistently by every consultant.",
          "category": "Skills",
          "why": "Use skills when you need repeatable methodology, domain expertise, or consistent reasoning."
        },
        {
          "item": "We need a write to our in-house claims system with validation before submit.",
          "category": "Custom actions",
          "why": "Use custom actions for deterministic execution against an internal API, legacy system, or proprietary workflow."
        },
        {
          "item": "We want one tool integration reused across Cursor, Claude, and VS Code.",
          "category": "MCP",
          "why": "Use MCP when you want open-standard interoperability and reusable tool access across ecosystems."
        },
        {
          "item": "We need a nightly run that reads new tickets and files summaries.",
          "category": "Agents",
          "why": "Use agents when you need scheduled, event-driven, or governed end-to-end workflows."
        }
      ],
      "takeaway": "That decision rule is the whole module. Name the job, then pick the primitive.",
      "claims": [
        "C-50",
        "C-51",
        "C-52",
        "C-53"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A12",
      "objective": "OBJ-03",
      "eyebrow": "Checkpoint",
      "title": "Where does partner value compound?",
      "type": "choice",
      "prompt": "Pick the statement that describes durable partner differentiation.",
      "options": [
        {
          "id": "o1",
          "text": "Custom agents, connectors, and embedded experiences that create reusable IP and higher-margin offerings.",
          "correct": true,
          "feedback": "Correct. Partners differentiate with custom agents, connectors, and embedded experiences that create reusable IP and higher-margin offerings."
        },
        {
          "id": "o2",
          "text": "Reselling licences at the largest possible discount.",
          "feedback": "Not this one. Discount depth is not differentiation, and it does not create reusable IP."
        },
        {
          "id": "o3",
          "text": "Rebuilding enterprise search from scratch for each customer.",
          "feedback": "Not this one. Search is platform capability; partner value sits in extension and workflow work."
        }
      ],
      "takeaway": "Technology partners build on Glean's open, extensible platform using APIs, MCP-based tools, embedded experiences, agent extensions, and the connector framework.",
      "claims": [
        "C-109",
        "C-110"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "quiz",
      "objective": "OBJ-02",
      "eyebrow": "Prove it",
      "title": "Operating model check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "What does Glean provide over company knowledge?",
          "options": [
            {
              "id": "a",
              "text": "A trusted AI layer powering enterprise search, assistants, agents, and workflow automation.",
              "correct": true,
              "feedback": "Correct. That is the platform definition, and it is why the constructs share one knowledge foundation."
            },
            {
              "id": "b",
              "text": "A standalone chatbot that indexes only public web content.",
              "feedback": "No. The platform operates over company knowledge, not public web content alone."
            },
            {
              "id": "c",
              "text": "A data warehouse that replaces existing systems of record.",
              "feedback": "No. Glean layers over existing knowledge rather than replacing systems of record."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "Which statement correctly describes agents in the operating model?",
          "options": [
            {
              "id": "a",
              "text": "Agents are the governed workflow wrapper that packages skills, tools, and knowledge together.",
              "correct": true,
              "feedback": "Correct. Agents operationalize the other primitives into production workflows."
            },
            {
              "id": "b",
              "text": "Agents are an open protocol for exposing tools to AI apps.",
              "feedback": "No. That describes MCP, not agents."
            },
            {
              "id": "c",
              "text": "Agents are reusable instruction templates loaded when relevant.",
              "feedback": "No. That describes skills."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "A customer needs deterministic execution against a legacy in-house system. Which primitive fits?",
          "options": [
            {
              "id": "a",
              "text": "A custom action.",
              "correct": true,
              "feedback": "Correct. Custom actions are for deterministic execution against an internal API, legacy system, or proprietary workflow."
            },
            {
              "id": "b",
              "text": "A skill.",
              "feedback": "No. Skills carry methodology and reasoning, not deterministic system execution."
            },
            {
              "id": "c",
              "text": "Enterprise search.",
              "feedback": "No. Search retrieves knowledge; it does not execute against a legacy system."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "When should a partner reach for MCP rather than a custom action?",
          "options": [
            {
              "id": "a",
              "text": "When open-standard interoperability and reusable tool access across ecosystems matter.",
              "correct": true,
              "feedback": "Correct. MCP is the interoperability choice, and it reduces lock-in across hosts."
            },
            {
              "id": "b",
              "text": "When the customer wants one hard-coded write to a single internal endpoint.",
              "feedback": "No. A single deterministic write to an internal endpoint is custom action territory."
            },
            {
              "id": "c",
              "text": "When no tools are involved at all.",
              "feedback": "No. MCP exists precisely to expose tools and data."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "Which partner activity is described as creating reusable IP and higher-margin offerings?",
          "options": [
            {
              "id": "a",
              "text": "Building custom agents, connectors, and embedded experiences.",
              "correct": true,
              "feedback": "Correct. That is where partner differentiation compounds."
            },
            {
              "id": "b",
              "text": "Increasing licence discount depth.",
              "feedback": "No. Discounting creates no reusable asset."
            },
            {
              "id": "c",
              "text": "Limiting engagements to one-off configuration work.",
              "feedback": "No. One-off configuration does not accumulate into IP."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A14",
      "objective": "OBJ-03",
      "eyebrow": "Next step",
      "title": "You can place the constructs. Now learn to choose between them.",
      "body": "Partner value-creation motions are source, deploy, build, and scale. Next: FND-105 turns this model into a decision framework.",
      "badge": "Operating model: complete",
      "signature": true,
      "claims": [
        "C-112"
      ]
    }
  ]
};
