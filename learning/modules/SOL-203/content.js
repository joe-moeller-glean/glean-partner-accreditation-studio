/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "SOL-203",
  "title": "Vertical Agent Use Case Design",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Run discovery that surfaces vertical agent opportunities worth building."
    },
    {
      "id": "OBJ-02",
      "text": "Prioritize candidates on business value against implementation complexity."
    },
    {
      "id": "OBJ-03",
      "text": "Specify a vertical agent design covering workflow, sources, and governance."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Cold open",
      "title": "Every vertical wants an agent. Most cannot name the workflow.",
      "body": "An industry team asks for a sector-specific agent and describes an outcome, not a process. Without the workflow, the data sources, and the governance boundary, there is nothing to build.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Turn a vertical workflow into a buildable design",
      "bullets": [
        "Surface candidates through structured discovery, not wishlists.",
        "Rank them on value against complexity.",
        "Produce a design covering workflow, sources, guardrails, and governance."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Discovery",
      "title": "Start from the repository and the workshop",
      "bullets": [
        "Planning begins with a review of the organization's use case repository and facilitated discovery workshops.",
        "Those sessions surface pain points, inefficiencies, and opportunities where agents can deliver impact.",
        "This module designs industry-specific agents that map to common workflows, data sources, and governance requirements."
      ],
      "claims": [
        "C-35",
        "C-97"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "Prioritize",
      "title": "Value against complexity, before design",
      "body": "An Effort and Impact matrix helps teams rank candidate agents by business value and implementation complexity so resources go to the highest-return agents.",
      "asset": {
        "src": "assets/svg/sol-203-a01.svg",
        "alt": "Two-by-two matrix plotting business value against implementation complexity with four recommended responses.",
        "caption": "Rank candidates before designing any of them."
      },
      "claims": [
        "C-36"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A4",
      "objective": "OBJ-03",
      "eyebrow": "The specification",
      "title": "Four questions a vertical design must answer",
      "body": "Design work carries into build: infrastructure preparation configures connectors and indexing for any new sources.",
      "asset": {
        "src": "assets/svg/sol-203-a02.svg",
        "alt": "Four-step flow diagram of a vertical agent design specification.",
        "caption": "A design submission is not finished until all four are answered."
      },
      "claims": [
        "C-38",
        "C-37"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A8",
      "objective": "OBJ-03",
      "eyebrow": "Worked example",
      "title": "From workflow to agent requirements",
      "steps": [
        {
          "title": "Name the owner",
          "body": "Assign a project lead and supporting experts for the candidate agent."
        },
        {
          "title": "Baseline it",
          "body": "Document the current process including the performance numbers that will later show success."
        },
        {
          "title": "Design the future state",
          "body": "Plan how the process changes with the agent in place, including expected improvements and business benefit."
        },
        {
          "title": "Plan the build",
          "body": "Cover scope, key dates, success measures, and security and data compliance checks."
        }
      ],
      "claims": [
        "C-37"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A6",
      "objective": "OBJ-02",
      "eyebrow": "Decision branch",
      "title": "The sponsor wants the hardest use case first",
      "type": "choice",
      "prompt": "The highest-value candidate is also the most complex. What do you recommend?",
      "options": [
        {
          "id": "o1",
          "text": "Stage it, and lead with a high-value, lower-complexity agent to establish the pattern and the baseline.",
          "correct": true,
          "feedback": "Correct. The matrix exists to allocate resources by return, and successful agents become templates for future development."
        },
        {
          "id": "o2",
          "text": "Build the hardest one first to prove ambition.",
          "feedback": "That ignores the prioritization framework and risks the programme on the least predictable build."
        },
        {
          "id": "o3",
          "text": "Decline the engagement until complexity drops.",
          "feedback": "No. High value with high complexity is a staging decision, not a refusal."
        }
      ],
      "claims": [
        "C-36",
        "C-48"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "quiz",
      "objective": "OBJ-02",
      "eyebrow": "Prove it",
      "title": "Vertical design check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "How does the planning phase begin?",
          "options": [
            {
              "id": "a",
              "text": "By reviewing the use case repository and running facilitated discovery workshops.",
              "correct": true,
              "feedback": "Correct. Those two inputs surface the real pain points."
            },
            {
              "id": "b",
              "text": "By building a prototype and showing it to stakeholders.",
              "feedback": "No. Prototyping before discovery skips the prioritization step."
            },
            {
              "id": "c",
              "text": "By selecting whichever agent the sponsor names first.",
              "feedback": "No. That is not a prioritization method."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "What two dimensions does the Effort and Impact matrix use?",
          "options": [
            {
              "id": "a",
              "text": "Business value and implementation complexity.",
              "correct": true,
              "feedback": "Correct, and that ranking drives resource allocation."
            },
            {
              "id": "b",
              "text": "Team size and licence count.",
              "feedback": "No. Neither dimension appears in the framework."
            },
            {
              "id": "c",
              "text": "Model cost and token volume.",
              "feedback": "No. Those are tuning concerns, not prioritization axes."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-03",
          "stem": "What must be documented about the current process?",
          "options": [
            {
              "id": "a",
              "text": "How it works today, including baseline performance numbers.",
              "correct": true,
              "feedback": "Correct. Without a baseline you cannot later prove improvement."
            },
            {
              "id": "b",
              "text": "Only the desired future state.",
              "feedback": "No. The baseline is what makes success measurable."
            },
            {
              "id": "c",
              "text": "Only the names of the stakeholders involved.",
              "feedback": "No. Ownership matters, but the baseline is the measurement anchor."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-03",
          "stem": "What does infrastructure preparation involve before the agent is built?",
          "options": [
            {
              "id": "a",
              "text": "Configuring data source connectors and establishing indexing protocols for new sources.",
              "correct": true,
              "feedback": "Correct. The agent needs reliable access to the content it reasons over."
            },
            {
              "id": "b",
              "text": "Selecting the largest available model.",
              "feedback": "No. Model choice is not infrastructure preparation."
            },
            {
              "id": "c",
              "text": "Writing the launch announcement.",
              "feedback": "No. That belongs to the launch phase."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "What must the implementation plan cover?",
          "options": [
            {
              "id": "a",
              "text": "Scope, key dates, success measures, and security and data compliance checks.",
              "correct": true,
              "feedback": "Correct. Compliance is planned, not retrofitted."
            },
            {
              "id": "b",
              "text": "Only the go-live date.",
              "feedback": "No. A date alone is not a plan."
            },
            {
              "id": "c",
              "text": "Only the list of agent steps.",
              "feedback": "No. Steps are the design, not the plan."
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
      "title": "One good vertical design becomes an accelerator",
      "body": "A well-established agent library serves as the automation hub where proven agents are cataloged, documented, and made accessible across teams.",
      "badge": "Vertical agent design: complete",
      "signature": true,
      "claims": [
        "C-33",
        "C-99"
      ]
    }
  ]
};
