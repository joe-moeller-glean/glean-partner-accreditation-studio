/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "BLD-208",
  "title": "Agent Governance & Safety",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Design approval and escalation boundaries for agents that write to other systems."
    },
    {
      "id": "OBJ-02",
      "text": "Apply retrieval guardrails and refusal behaviour as governance controls."
    },
    {
      "id": "OBJ-03",
      "text": "Specify the production governance evidence a competency review expects."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Cold open",
      "title": "The agent filed 400 tickets overnight",
      "body": "It did exactly what it was told. Nobody had defined an approval boundary, a scope limit, or what should happen when confidence dropped. The behaviour was not a bug.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Make safety a design property",
      "bullets": [
        "Place approval and escalation boundaries before an agent writes anywhere.",
        "Use guardrails and refusal behaviour as real governance controls.",
        "Produce the evidence a competency review will ask for."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "The layers",
      "title": "Four layers, top to bottom",
      "body": "Governance starts in the implementation plan, which covers scope, key dates, success measures, and security and data compliance checks.",
      "asset": {
        "src": "assets/svg/bld-208-a01.svg",
        "alt": "Stacked diagram of four agent governance layers from compliance planning down to fallback behaviour.",
        "caption": "Governance is built in layers, not bolted on at review time."
      },
      "claims": [
        "C-37"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Approval design",
      "title": "Put the gate before the write",
      "bullets": [
        "Custom actions fit approvals, validation, or custom business logic before writing to a system.",
        "At least one competency agent must invoke actions or tools that write to other systems, which is exactly where approval design matters.",
        "Conditional branching gives you the approved and rejected paths a gate requires."
      ],
      "claims": [
        "C-61",
        "C-09",
        "C-11"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A5",
      "objective": "OBJ-02",
      "eyebrow": "Compare",
      "title": "Guardrails and fallbacks do different jobs",
      "table": {
        "caption": "Two controls, two failure modes they prevent.",
        "head": [
          "Control",
          "What it constrains",
          "Failure it prevents"
        ],
        "rows": [
          [
            "Retrieval guardrails",
            "The content sources in play and the answerable scope",
            "Confident answers drawn from sources that should be out of bounds"
          ],
          [
            "Fallback behaviour",
            "What happens when confidence is low or the ask is out of scope",
            "A fabricated answer where a refusal or handoff was correct"
          ]
        ]
      },
      "claims": [
        "C-07",
        "C-08"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A4",
      "objective": "OBJ-03",
      "eyebrow": "Evidence",
      "title": "What the review will ask you to produce",
      "body": "Competency validation is evidence-based. Each artefact below is a stated requirement.",
      "asset": {
        "src": "assets/svg/bld-208-a02.svg",
        "alt": "Four cards describing the evidence artefacts a competency review expects for each agent.",
        "caption": "Governance you cannot evidence does not count."
      },
      "claims": [
        "C-15",
        "C-16",
        "C-17",
        "C-18"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A6",
      "objective": "OBJ-01",
      "eyebrow": "Scenario review",
      "title": "An agent that emails customers directly",
      "type": "choice",
      "prompt": "A partner-built agent drafts and sends customer-facing email autonomously on a schedule. What is the governance gap?",
      "options": [
        {
          "id": "o1",
          "text": "There is no approval or validation step before the write, and no defined behaviour for low-confidence cases.",
          "correct": true,
          "feedback": "Correct. Approvals and validation belong before writing to a system, and explicit error handling with a defined fallback is required."
        },
        {
          "id": "o2",
          "text": "The agent uses a schedule trigger, which is unsafe by nature.",
          "feedback": "No. Schedule-based triggers are a documented advanced capability. The gap is the missing approval gate, not the trigger."
        },
        {
          "id": "o3",
          "text": "Nothing, provided the model is large enough.",
          "feedback": "No. Model size is not a governance control."
        }
      ],
      "takeaway": "Escalation boundaries are design decisions made before launch, not incident responses made after.",
      "claims": [
        "C-61",
        "C-08",
        "C-13"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "quiz",
      "objective": "OBJ-03",
      "eyebrow": "Prove it",
      "title": "Governance and safety check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "Where do approvals and validation belong in an agent that writes to a system?",
          "options": [
            {
              "id": "a",
              "text": "Before the write, as part of the action's custom business logic.",
              "correct": true,
              "feedback": "Correct. That is a documented custom action use case."
            },
            {
              "id": "b",
              "text": "After the write, as a reconciliation report.",
              "feedback": "No. Reconciliation after the fact does not prevent the bad write."
            },
            {
              "id": "c",
              "text": "Nowhere; agents should not have approval logic.",
              "feedback": "No. Approval design is core to production governance."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "What must every competency agent do about out-of-scope questions?",
          "options": [
            {
              "id": "a",
              "text": "Contain explicit error handling with a defined fallback behaviour.",
              "correct": true,
              "feedback": "Correct, covering both low-confidence and out-of-scope cases."
            },
            {
              "id": "b",
              "text": "Answer using the closest available source.",
              "feedback": "No. That is exactly the behaviour guardrails and fallbacks prevent."
            },
            {
              "id": "c",
              "text": "Escalate every question to a human.",
              "feedback": "No. Blanket escalation defeats the automation and is not the requirement."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-03",
          "stem": "Which evidence does competency validation require for each agent?",
          "options": [
            {
              "id": "a",
              "text": "A requirements document, an architecture review with a Glean technical resource, and a written business impact rationale.",
              "correct": true,
              "feedback": "Correct. All three are stated per-agent requirements."
            },
            {
              "id": "b",
              "text": "A screenshot of the agent's final output.",
              "feedback": "No. A screenshot is not one of the required artefacts."
            },
            {
              "id": "c",
              "text": "A signed customer purchase order.",
              "feedback": "No. Commercial paperwork is not competency evidence."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-03",
          "stem": "How should a partner prepare for the agent review call?",
          "options": [
            {
              "id": "a",
              "text": "Expect to walk through and run each agent live, and ideally provide a recorded walkthrough beforehand.",
              "correct": true,
              "feedback": "Correct. The review is a working session, not a document read-out."
            },
            {
              "id": "b",
              "text": "Send documentation only and skip the live run.",
              "feedback": "No. Running each agent on the call is expected."
            },
            {
              "id": "c",
              "text": "Delegate the review to the customer's admin.",
              "feedback": "No. The partner team presents its own agents."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-02",
          "stem": "What do retrieval guardrails constrain?",
          "options": [
            {
              "id": "a",
              "text": "The set of content sources in play and what the agent can and cannot answer.",
              "correct": true,
              "feedback": "Correct. Scope is a governance control, not a tuning detail."
            },
            {
              "id": "b",
              "text": "The maximum number of steps the agent may run.",
              "feedback": "No. Step count is a composition requirement, not a guardrail."
            },
            {
              "id": "c",
              "text": "Which model provider serves the request.",
              "feedback": "No. Model choice is a separate decision."
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
      "title": "Governed agents still break. Learn to diagnose them.",
      "body": "Next: SRV-204 covers trace-driven debugging, issue isolation, and clean escalation packages.",
      "badge": "Governance and safety: complete",
      "signature": true,
      "claims": [
        "C-96"
      ]
    }
  ]
};
