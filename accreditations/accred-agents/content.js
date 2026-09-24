/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "accred-agents",
  "title": "Agents",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Navigate the Agents accreditation path and its prerequisite order."
    },
    {
      "id": "OBJ-02",
      "text": "Explain how the path maps to the Agent Building Competency."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Welcome",
      "title": "Everything your team needs to build agents that ship",
      "body": "Eleven modules take a partner team from the operating model to a submitted competency portfolio. This orientation shows the route and the order.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What this path covers",
      "title": "Five stages, eleven modules",
      "body": "Foundations, build fundamentals, hands-on labs, production discipline, then design and capstone.",
      "asset": {
        "src": "assets/svg/accred-agents-a01.svg",
        "alt": "Five-stage flow diagram of the Agents accreditation path from foundations to capstone.",
        "caption": "Eleven modules, 12.7 authored hours, three waves."
      },
      "claims": [
        "C-88",
        "C-89",
        "C-90",
        "C-91",
        "C-93"
      ]
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "Why it exists",
      "title": "The path feeds a real competency",
      "body": "The Agent Building Competency certifies partner teams to design, build, govern, and operationalize production-grade Glean Agents that automate workflows and deliver measurable business outcomes.",
      "asset": {
        "src": "assets/svg/accred-agents-a02.svg",
        "alt": "Four cards summarising the capability areas the Agents badge certifies.",
        "caption": "Aligned to the Agent Building Competency outcomes."
      },
      "claims": [
        "C-01",
        "C-19",
        "C-27"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A5",
      "objective": "OBJ-01",
      "eyebrow": "Order matters",
      "title": "Prerequisite chain",
      "table": {
        "caption": "Each module unlocks the next. Waves indicate release sequencing.",
        "head": [
          "Module",
          "Prerequisite",
          "Wave"
        ],
        "rows": [
          [
            "FND-104 Operating model",
            "FND-103",
            "Wave 1"
          ],
          [
            "FND-105 Construct choice",
            "FND-104",
            "Wave 1"
          ],
          [
            "BLD-101 Building with Glean",
            "TEC-101",
            "Wave 1"
          ],
          [
            "BLD-102 Actions and MCP",
            "BLD-101",
            "Wave 1"
          ],
          [
            "BLD-103 Actions workshop",
            "BLD-102",
            "Wave 1"
          ],
          [
            "BLD-104 Advanced building lab",
            "BLD-101",
            "Wave 1"
          ],
          [
            "SRV-204 Advanced debugging",
            "BLD-104",
            "Wave 2"
          ],
          [
            "BLD-207 Evaluation and QA",
            "BLD-104",
            "Wave 3"
          ],
          [
            "BLD-208 Governance and safety",
            "BLD-104",
            "Wave 3"
          ],
          [
            "SOL-203 Vertical design",
            "SOL-202",
            "Wave 3"
          ],
          [
            "ACC-104 Builder accreditation",
            "BLD-208",
            "Wave 3"
          ]
        ]
      },
      "claims": [
        "C-88",
        "C-89",
        "C-90",
        "C-91",
        "C-92",
        "C-93",
        "C-94",
        "C-95",
        "C-96",
        "C-97",
        "C-98"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A12",
      "objective": "OBJ-02",
      "eyebrow": "Checkpoint",
      "title": "What does this path prepare you to submit?",
      "type": "choice",
      "prompt": "Pick the accurate statement about the competency submission.",
      "options": [
        {
          "id": "o1",
          "text": "Five technical accreditations, a Glean-delivered workshop, and five production-ready agents with evidence.",
          "correct": true,
          "feedback": "Correct. The path builds the skills; the submission needs accreditations, the workshop, the agents, and the evidence artefacts."
        },
        {
          "id": "o2",
          "text": "A single reference agent and a slide deck.",
          "feedback": "No. Five production-ready agents are required, each with documented requirements and an architecture review."
        },
        {
          "id": "o3",
          "text": "Only the completion of these eleven modules.",
          "feedback": "Not quite. Coursework is necessary but the competency also requires built agents and validation."
        }
      ],
      "claims": [
        "C-03",
        "C-04",
        "C-05",
        "C-15"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "quiz",
      "objective": "OBJ-01",
      "eyebrow": "Prove it",
      "title": "Path orientation check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "Which module starts the Agents path?",
          "options": [
            {
              "id": "a",
              "text": "FND-104, the operating model for search, assistants, and agents.",
              "correct": true,
              "feedback": "Correct. Construct fluency comes before build work."
            },
            {
              "id": "b",
              "text": "ACC-104, the Builder Accreditation capstone.",
              "feedback": "No. That is the final module."
            },
            {
              "id": "c",
              "text": "SRV-204, Advanced Agent Debugging.",
              "feedback": "No. Debugging assumes you can already build."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-01",
          "stem": "What is the prerequisite for ACC-104?",
          "options": [
            {
              "id": "a",
              "text": "BLD-208, Agent Governance and Safety.",
              "correct": true,
              "feedback": "Correct. Governance precedes the capstone."
            },
            {
              "id": "b",
              "text": "FND-104.",
              "feedback": "No. FND-104 sits at the start of the path."
            },
            {
              "id": "c",
              "text": "There is no prerequisite.",
              "feedback": "No. The capstone has an explicit prerequisite."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "What does the Agent Building Competency certify?",
          "options": [
            {
              "id": "a",
              "text": "That partner teams can design, build, govern, and operationalize production-grade Glean Agents.",
              "correct": true,
              "feedback": "Correct, with measurable business outcomes as the stated goal."
            },
            {
              "id": "b",
              "text": "That an individual has passed a written exam only.",
              "feedback": "No. It certifies partner teams and requires built agents."
            },
            {
              "id": "c",
              "text": "That a partner may resell Glean licences.",
              "feedback": "No. That is a commercial path, not this competency."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-01",
          "stem": "Which three modules make up the production discipline stage?",
          "options": [
            {
              "id": "a",
              "text": "BLD-207 evaluation, BLD-208 governance, and SRV-204 debugging.",
              "correct": true,
              "feedback": "Correct. Measure it, govern it, then diagnose it."
            },
            {
              "id": "b",
              "text": "FND-104, FND-105, and BLD-101.",
              "feedback": "No. Those are foundations and build fundamentals."
            },
            {
              "id": "c",
              "text": "BLD-103, SOL-203, and ACC-104.",
              "feedback": "No. Those span labs, design, and the capstone."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-02",
          "stem": "Which capability area does the badge certify?",
          "options": [
            {
              "id": "a",
              "text": "Persona-aligned agent design, including defining intents and configuring retrieval and guardrails.",
              "correct": true,
              "feedback": "Correct. That is a stated competency outcome."
            },
            {
              "id": "b",
              "text": "Data centre capacity planning.",
              "feedback": "No. That is outside this competency."
            },
            {
              "id": "c",
              "text": "Contract negotiation.",
              "feedback": "No. That is not part of the Agent Building Competency."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A14",
      "objective": "OBJ-02",
      "eyebrow": "Start here",
      "title": "Begin with the operating model",
      "body": "FND-104 explains the Glean operating model for search, assistants, and agents, and where each construct fits for customer outcomes.",
      "badge": "Agents path: oriented",
      "signature": true,
      "claims": [
        "C-88"
      ]
    }
  ]
};
