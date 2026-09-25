/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "ACC-104",
  "title": "Builder Accreditation",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "State every requirement the Agent Building Competency imposes on a partner organization."
    },
    {
      "id": "OBJ-02",
      "text": "Audit a candidate agent portfolio against the capability checklist."
    },
    {
      "id": "OBJ-03",
      "text": "Assemble the submission and validation evidence the review requires."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Cold open",
      "title": "Five agents built. Submission rejected.",
      "body": "Every agent worked. None had a documented requirements conversation, an architecture review, or a written business impact rationale. The build was the easy half.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Walk in with a submission that passes",
      "bullets": [
        "State every competency requirement without checking the workbook.",
        "Audit your agent portfolio against the capability checklist.",
        "Bring the evidence the validation review expects."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "What the badge certifies",
      "title": "Design, build, govern, operationalize",
      "body": "The Agent Building Competency certifies partner teams to design, build, govern, and operationalize production-grade Glean Agents that automate workflows and deliver measurable business outcomes.",
      "footnote": "It focuses on persona-aligned agent design, prompt engineering, tool use, governance, and operational best practices across the agent lifecycle.",
      "claims": [
        "C-01",
        "C-02"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-01",
      "eyebrow": "Requirements",
      "title": "Four requirements, all mandatory",
      "body": "Glean competencies require thorough experience and successful completion of an audit process.",
      "asset": {
        "src": "assets/svg/acc-104-a01.svg",
        "alt": "Numbered diagram of the four Agent Building Competency requirements.",
        "caption": "All four must be satisfied and validated."
      },
      "claims": [
        "C-25",
        "C-03",
        "C-04",
        "C-05"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "Per-agent criteria",
      "title": "What every one of the five agents must do",
      "bullets": [
        "Implement at least 3 discrete steps beyond simple retrieval, including at least one thinking or transformation step.",
        "Configure retrieval guardrails with a well-defined source set and clear instructions on what it can and cannot answer.",
        "Contain explicit error handling with a defined fallback for low-confidence or out-of-scope questions."
      ],
      "claims": [
        "C-06",
        "C-07",
        "C-08"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A4",
      "objective": "OBJ-02",
      "eyebrow": "Portfolio criteria",
      "title": "Six capabilities across the portfolio",
      "body": "These are at-least-one requirements. One agent can satisfy several, but every capability must appear somewhere.",
      "asset": {
        "src": "assets/svg/acc-104-a02.svg",
        "alt": "Six cards listing the portfolio-level agent capabilities that at least one agent must demonstrate.",
        "caption": "Portfolio-level requirements: at least one agent each."
      },
      "claims": [
        "C-09",
        "C-10",
        "C-11",
        "C-12",
        "C-13",
        "C-14"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A9",
      "objective": "OBJ-03",
      "eyebrow": "Sort it",
      "title": "Which evidence satisfies which requirement?",
      "prompt": "Place each artefact with the requirement it evidences.",
      "type": "sort",
      "categories": [
        "Requirements gathering",
        "Architecture review",
        "Business impact",
        "Accreditations"
      ],
      "pairs": [
        {
          "item": "A document outlining business and technical requirements for each agent.",
          "category": "Requirements gathering",
          "why": "That is the stated proof of completion for gathering requirements with the end user."
        },
        {
          "item": "A session with a Glean technical resource covering agent structure and best practices followed.",
          "category": "Architecture review",
          "why": "Each agent requires an architecture review with a Glean technical resource."
        },
        {
          "item": "A written explanation of impact and why a Glean Agent was the best solution.",
          "category": "Business impact",
          "why": "Reviewed by a Glean Partner Solutions Engineer."
        },
        {
          "item": "Five completed technical courses in the Glean Partner Portal.",
          "category": "Accreditations",
          "why": "A Glean Partner Manager validates this requirement."
        }
      ],
      "takeaway": "Every requirement has a named proof of completion and a named validator.",
      "claims": [
        "C-15",
        "C-17",
        "C-18",
        "C-03"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Submission",
      "title": "How to submit",
      "bullets": [
        "The Agent Building Competency Submission Workbook is available in the Glean Partner Portal Asset Library.",
        "The programme is open to all registered Glean Partners, including resell, services, and ISV or product partners.",
        "Expect to walk through and run each agent on the validation call; a recorded walkthrough beforehand is ideal."
      ],
      "claims": [
        "C-26",
        "C-24",
        "C-16"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "quiz",
      "objective": "OBJ-01",
      "eyebrow": "Prove it",
      "title": "Accreditation readiness exam",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "How many technical accreditations must be completed in the Partner Portal?",
          "options": [
            {
              "id": "a",
              "text": "Five, validated by a Glean Partner Manager.",
              "correct": true,
              "feedback": "Correct. That is a stated competency requirement."
            },
            {
              "id": "b",
              "text": "One, validated by the customer.",
              "feedback": "No. Five are required, and a Partner Manager validates."
            },
            {
              "id": "c",
              "text": "None; the agent builds replace coursework.",
              "feedback": "No. Accreditations and agent builds are both required."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "How many production-ready agents must a partner build?",
          "options": [
            {
              "id": "a",
              "text": "Five, each meeting the per-agent criteria.",
              "correct": true,
              "feedback": "Correct, with additional at-least-one capabilities across the portfolio."
            },
            {
              "id": "b",
              "text": "Three, with no specific criteria.",
              "feedback": "No. The count is five and the criteria are explicit."
            },
            {
              "id": "c",
              "text": "One reference agent.",
              "feedback": "No. A single agent cannot cover the portfolio requirements."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "Which capability is required of at least one agent, not all five?",
          "options": [
            {
              "id": "a",
              "text": "Using loops to process a collection.",
              "correct": true,
              "feedback": "Correct. Loops, branching, triggers, multi-tool runs, and external writes are at-least-one requirements."
            },
            {
              "id": "b",
              "text": "Configuring retrieval guardrails.",
              "feedback": "No. Guardrails are required of every agent."
            },
            {
              "id": "c",
              "text": "Explicit error handling with a defined fallback.",
              "feedback": "No. That is required of every agent."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-03",
          "stem": "What evidence is required for each agent's business value?",
          "options": [
            {
              "id": "a",
              "text": "A written outline of business impact and why a Glean Agent was the best solution.",
              "correct": true,
              "feedback": "Correct, and it is reviewed by a Glean Partner Solutions Engineer."
            },
            {
              "id": "b",
              "text": "A verbal summary on the validation call.",
              "feedback": "No. A written explanation is required."
            },
            {
              "id": "c",
              "text": "The customer's signed invoice.",
              "feedback": "No. That is not competency evidence."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-01",
          "stem": "Who can pursue the Agent Building Competency?",
          "options": [
            {
              "id": "a",
              "text": "All registered Glean Partners, including resell, services, and ISV or product partners.",
              "correct": true,
              "feedback": "Correct, provided the organization is already a registered Glean Partner."
            },
            {
              "id": "b",
              "text": "Only GSI partners.",
              "feedback": "No. The programme is open across partner types."
            },
            {
              "id": "c",
              "text": "Any organization, registered or not.",
              "feedback": "No. Registration as a Glean Partner is a precondition."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A14",
      "objective": "OBJ-03",
      "eyebrow": "Badge moment",
      "title": "What the badge gets you",
      "bullets": [
        "Market visibility as a trusted Glean Partner, a Competency Badge, and a searchable directory listing.",
        "Access to Glean services opportunities and surfacing to Glean sellers as a preferred services partner.",
        "Priority consideration for agent-focused services opportunities and co-marketing that highlights agent outcomes and ROI."
      ],
      "badge": "Builder accreditation: ready to submit",
      "signature": true,
      "claims": [
        "C-22",
        "C-23"
      ]
    }
  ]
};
