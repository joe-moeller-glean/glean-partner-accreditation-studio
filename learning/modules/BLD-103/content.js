/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "BLD-103",
  "title": "Actions & MCP Workshop",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Sequence the lab that builds a custom action and connects a remote MCP server."
    },
    {
      "id": "OBJ-02",
      "text": "Wire a custom action into an agent workflow alongside platform actions."
    },
    {
      "id": "OBJ-03",
      "text": "State the readiness prerequisites and scope boundaries of the workshop."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-03",
      "eyebrow": "Cold open",
      "title": "Half the room cannot start the lab",
      "body": "The workshop assumes RESTful API experience and a working environment. Teams that arrive without either spend the build window on setup and leave with nothing they can reuse.",
      "claims": [
        "C-106"
      ]
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Walk in ready, walk out with a working integration",
      "bullets": [
        "Know the exact sequence the workshop follows.",
        "Wire a custom action into an agent workflow.",
        "State the prerequisites before your team books the session."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A7",
      "objective": "OBJ-01",
      "eyebrow": "Guided sequence",
      "title": "How the workshop runs",
      "body": "The course covers departmental use cases, actions and MCP, integrations, then a hands-on build.",
      "asset": {
        "src": "assets/svg/bld-103-a01.svg",
        "alt": "Four-step flow diagram of the Actions and MCP workshop sequence.",
        "caption": "The published agenda for the Actions and Integrations course."
      },
      "claims": [
        "C-105"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Readiness",
      "title": "What the session assumes about you",
      "body": "The Actions and Integrations course is advanced level, runs 2 to 4 hours, and expects experience with RESTful APIs.",
      "asset": {
        "src": "assets/svg/bld-103-a02.svg",
        "alt": "Stacked diagram of workshop readiness requirements: level, duration, and prerequisite experience.",
        "caption": "Arrive ready or lose the lab window."
      },
      "claims": [
        "C-106"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A8",
      "objective": "OBJ-02",
      "eyebrow": "Worked example",
      "title": "Wiring the action into the workflow",
      "steps": [
        {
          "title": "Add the step",
          "body": "Builders add a custom action as a step in Agent Builder."
        },
        {
          "title": "Bind the inputs",
          "body": "Inputs can be fixed values, user inputs, or AI-predicted values."
        },
        {
          "title": "Compose",
          "body": "Combine the custom action with By Glean and By datasource actions in the same workflow."
        },
        {
          "title": "Return something usable",
          "body": "The onboarding example returns a request ID plus a link, so downstream steps and users have a handle."
        }
      ],
      "claims": [
        "C-62",
        "C-63",
        "C-68"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A10",
      "objective": "OBJ-02",
      "eyebrow": "Myth versus reality",
      "title": "“We will just pick the MCP tool as a step”",
      "body": "Reality: MCP tools are not available as individual single-step selections in Agent Builder. In Agents they are available in Plan and Execute mode and in auto mode.",
      "footnote": "Teams that discover this mid-lab lose the build window. Design for it up front.",
      "claims": [
        "C-59",
        "C-58"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A12",
      "objective": "OBJ-01",
      "eyebrow": "Checkpoint",
      "title": "What is actually built in the lab?",
      "type": "choice",
      "prompt": "Pick the accurate description of the lab deliverable.",
      "options": [
        {
          "id": "o1",
          "text": "A custom integration, built hands-on, after covering actions, MCP, and Client API integrations.",
          "correct": true,
          "feedback": "Correct. The published agenda ends with a hands-on workshop to build a custom integration."
        },
        {
          "id": "o2",
          "text": "A slide deck describing a proposed integration.",
          "feedback": "No. The workshop is a build session, not a design review."
        },
        {
          "id": "o3",
          "text": "A custom connector for a proprietary data source.",
          "feedback": "No. Custom connectors are a separate course with its own lab environment."
        }
      ],
      "claims": [
        "C-105",
        "C-92"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "quiz",
      "objective": "OBJ-03",
      "eyebrow": "Prove it",
      "title": "Workshop readiness check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-03",
          "stem": "What experience does the Actions and Integrations course expect?",
          "options": [
            {
              "id": "a",
              "text": "Experience with RESTful APIs.",
              "correct": true,
              "feedback": "Correct. It is an advanced course and the lab assumes API fluency."
            },
            {
              "id": "b",
              "text": "No prior technical experience.",
              "feedback": "No. It is advanced level with a stated API prerequisite."
            },
            {
              "id": "c",
              "text": "Connector development experience only.",
              "feedback": "No. Connector work is a separate course."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-01",
          "stem": "Which topics does the workshop cover before the hands-on build?",
          "options": [
            {
              "id": "a",
              "text": "Departmental use cases, actions and MCP, then integrations.",
              "correct": true,
              "feedback": "Correct. The build lands last, once the primitives and integrations are covered."
            },
            {
              "id": "b",
              "text": "Connector pipelines and indexing only.",
              "feedback": "No. That is the custom connectors course."
            },
            {
              "id": "c",
              "text": "Competitive positioning and objection handling.",
              "feedback": "No. That is a seller-path module."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "How does a builder add a custom action to an agent?",
          "options": [
            {
              "id": "a",
              "text": "As a step in Agent Builder, with fixed, user, or AI-predicted inputs.",
              "correct": true,
              "feedback": "Correct, and it can sit beside By Glean and By datasource actions."
            },
            {
              "id": "b",
              "text": "By registering it as an MCP single-step selection.",
              "feedback": "No. MCP tools are not available as individual single-step selections in Agent Builder."
            },
            {
              "id": "c",
              "text": "By attaching it to a connector schedule.",
              "feedback": "No. Connector schedules govern indexing, not action steps."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-01",
          "stem": "Which integration examples appear in the course agenda?",
          "options": [
            {
              "id": "a",
              "text": "Client API, resolving tickets in ServiceNow, and embedding in custom web applications.",
              "correct": true,
              "feedback": "Correct. Those are the published integration examples."
            },
            {
              "id": "b",
              "text": "Data warehouse migration and ETL scheduling.",
              "feedback": "No. Those are not part of this agenda."
            },
            {
              "id": "c",
              "text": "Only email and calendar automation.",
              "feedback": "No. The agenda is broader than that."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-02",
          "stem": "Why plan the custom action target before the session?",
          "options": [
            {
              "id": "a",
              "text": "Because custom actions exist for internal APIs, legacy systems, and validation before a write, so the target shapes the build.",
              "correct": true,
              "feedback": "Correct. Choosing the target in advance protects the limited build window."
            },
            {
              "id": "b",
              "text": "Because custom actions cannot be changed after creation.",
              "feedback": "That is not the reason; the reason is lab time and design fit."
            },
            {
              "id": "c",
              "text": "Because only one custom action may exist per organization.",
              "feedback": "No. Custom actions are org-defined automations, not limited to one."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A13",
      "objective": "OBJ-02",
      "eyebrow": "Job aid",
      "title": "Pre-flight list for your team",
      "bullets": [
        "Confirm RESTful API experience across the attending engineers.",
        "Block 2 to 4 hours; the build is the second half, not an appendix.",
        "Decide in advance which internal system the custom action will target.",
        "Remember MCP tools cannot be selected as single steps in Agent Builder."
      ],
      "badge": "Actions and MCP workshop: complete",
      "signature": true,
      "claims": [
        "C-106",
        "C-105",
        "C-59"
      ]
    }
  ]
};
