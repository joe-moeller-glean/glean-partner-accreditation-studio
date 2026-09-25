/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "BLD-104",
  "title": "Advanced Agent Building Lab",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Compose a multi-step agent with a thinking step, guardrails, and fallback behaviour."
    },
    {
      "id": "OBJ-02",
      "text": "Select memory scope and model size deliberately for each step."
    },
    {
      "id": "OBJ-03",
      "text": "Apply advanced capabilities: branching, loops, and schedule or event triggers."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Cold open",
      "title": "The demo agent works. The production agent does not.",
      "body": "A single-step retrieval agent demos beautifully and fails in week two: no guardrails on sources, no fallback when confidence drops, no plan for the questions it should refuse.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Build agents that survive contact with users",
      "bullets": [
        "Compose multi-step agents with a real thinking step.",
        "Set retrieval guardrails and explicit fallback behaviour.",
        "Choose memory scope and model size on purpose, per step."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A4",
      "objective": "OBJ-01",
      "eyebrow": "Anatomy",
      "title": "What production-ready actually requires",
      "body": "Each competency agent must implement at least 3 discrete steps beyond simple retrieval, including at least one thinking or transformation step.",
      "asset": {
        "src": "assets/svg/bld-104-a01.svg",
        "alt": "Four-step flow diagram showing the anatomy of a production-ready agent.",
        "caption": "These are competency requirements, not style preferences."
      },
      "claims": [
        "C-06",
        "C-07",
        "C-08"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Guardrails",
      "title": "Say what the agent will not answer",
      "bullets": [
        "Configure retrieval guardrails so the agent uses a well-defined set of content sources.",
        "Give clear instructions for what it can and cannot answer.",
        "Contain explicit error handling with a defined fallback for low-confidence or out-of-scope questions."
      ],
      "footnote": "Agent design best practice is to load and filter context effectively, and to tune for reliability, cost, and performance.",
      "claims": [
        "C-07",
        "C-08",
        "C-21"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A5",
      "objective": "OBJ-02",
      "eyebrow": "Memory",
      "title": "Memory scope is a design decision",
      "body": "Too much memory leads to slower, more expensive runs with wandering answers. Too little creates brittle agents that forget constraints or prior results.",
      "asset": {
        "src": "assets/svg/bld-104-a02.svg",
        "alt": "Numbered diagram of three agent memory scope options and when to use each.",
        "caption": "Memory is a cost and reliability decision on every step."
      },
      "claims": [
        "C-80",
        "C-81"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "Model selection",
      "title": "Right-size the model per step",
      "body": "Use small and fast models for simple transforms. Reserve larger models only where reasoning clearly benefits the outcome.",
      "footnote": "The debugging training reports a 3x speed improvement from optimized memory settings and a 60% cost reduction from using right-sized models.",
      "claims": [
        "C-82",
        "C-83"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A9",
      "objective": "OBJ-03",
      "eyebrow": "Sort it",
      "title": "Which advanced capability does each requirement need?",
      "prompt": "Place each requirement with the capability that satisfies it.",
      "type": "sort",
      "categories": [
        "Conditional branching",
        "Loops",
        "Schedule trigger",
        "Event trigger"
      ],
      "pairs": [
        {
          "item": "Handle approved and rejected differently after the review step.",
          "category": "Conditional branching",
          "why": "Conditional branching is the documented capability for divergent paths."
        },
        {
          "item": "Process every row in a returned list the same way.",
          "category": "Loops",
          "why": "Loops process a collection, which is an explicit competency requirement."
        },
        {
          "item": "Run at 6am every weekday regardless of activity.",
          "category": "Schedule trigger",
          "why": "Schedule-based triggers cover time-driven runs."
        },
        {
          "item": "Run whenever the source policy document changes.",
          "category": "Event trigger",
          "why": "Event-driven runs on content changes cover this case."
        }
      ],
      "takeaway": "Advanced capabilities include schedule-based triggers, event-driven runs on content changes, and conditional branching and looping.",
      "claims": [
        "C-11",
        "C-12",
        "C-13",
        "C-14",
        "C-20"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A6",
      "objective": "OBJ-01",
      "eyebrow": "Decision branch",
      "title": "A reviewer says your agent is not production-ready",
      "type": "choice",
      "prompt": "It retrieves and summarizes in two steps with no fallback. What is the minimum fix?",
      "options": [
        {
          "id": "o1",
          "text": "Add a thinking or transformation step to reach three discrete steps beyond retrieval, plus explicit fallback for low-confidence or out-of-scope questions.",
          "correct": true,
          "feedback": "Correct. Both are hard requirements: three or more discrete steps including a thinking step, and explicit error handling with defined fallback."
        },
        {
          "id": "o2",
          "text": "Switch to a larger model so answers improve.",
          "feedback": "No. Model size does not satisfy the step-count or fallback requirements, and larger models should be reserved for where reasoning clearly benefits."
        },
        {
          "id": "o3",
          "text": "Enable all previous steps memory everywhere.",
          "feedback": "No. Too much memory leads to slower, more expensive runs with wandering answers, and it does not add a fallback path."
        }
      ],
      "claims": [
        "C-06",
        "C-08",
        "C-82",
        "C-80"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "quiz",
      "objective": "OBJ-03",
      "eyebrow": "Prove it",
      "title": "Advanced building check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "What is the minimum step structure for a competency agent?",
          "options": [
            {
              "id": "a",
              "text": "At least 3 discrete steps beyond simple retrieval, including at least one thinking or transformation step.",
              "correct": true,
              "feedback": "Correct. Retrieval alone never satisfies the requirement."
            },
            {
              "id": "b",
              "text": "One retrieval step and one summary step.",
              "feedback": "No. That is below the required step count and has no thinking step."
            },
            {
              "id": "c",
              "text": "Any number of steps, as long as one writes to a system.",
              "feedback": "No. The write requirement is separate from the step-count requirement."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-01",
          "stem": "What must retrieval guardrails accomplish?",
          "options": [
            {
              "id": "a",
              "text": "Constrain the agent to a well-defined set of content sources with clear instructions on what it can and cannot answer.",
              "correct": true,
              "feedback": "Correct. Scope boundaries are part of the build, not an afterthought."
            },
            {
              "id": "b",
              "text": "Prevent the agent from calling any external tools.",
              "feedback": "No. Guardrails scope retrieval; tool calls are a separate concern."
            },
            {
              "id": "c",
              "text": "Force the agent to answer every question asked.",
              "feedback": "The opposite. Guardrails define what it must refuse."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "Which memory setting is the default for formatting and cleanup steps?",
          "options": [
            {
              "id": "a",
              "text": "Only the immediate previous step.",
              "correct": true,
              "feedback": "Correct. It keeps the step cheap and focused."
            },
            {
              "id": "b",
              "text": "All previous steps.",
              "feedback": "No. That is for short flows or complex reasoning."
            },
            {
              "id": "c",
              "text": "No memory.",
              "feedback": "No. That is for independent operations."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "What is the stated model selection strategy?",
          "options": [
            {
              "id": "a",
              "text": "Small and fast models for simple transforms; larger models only where reasoning clearly benefits the outcome.",
              "correct": true,
              "feedback": "Correct, and right-sizing is reported to cut cost by 60%."
            },
            {
              "id": "b",
              "text": "Always use the largest available model.",
              "feedback": "No. That inflates cost without reliable benefit."
            },
            {
              "id": "c",
              "text": "Always use the smallest available model.",
              "feedback": "No. Reserve larger models for genuine reasoning steps."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "Which requirement needs a loop rather than branching?",
          "options": [
            {
              "id": "a",
              "text": "Applying the same treatment to every item in a returned collection.",
              "correct": true,
              "feedback": "Correct. Loops process a collection."
            },
            {
              "id": "b",
              "text": "Taking a different path for approved versus rejected records.",
              "feedback": "No. Divergent paths are conditional branching."
            },
            {
              "id": "c",
              "text": "Starting the agent when a document changes.",
              "feedback": "No. That is an event or content-based trigger."
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
      "title": "You can build one. Now prove it holds up.",
      "body": "The Advanced Agent Building enablement runs as an agent hackathon lasting 1.5 to 4 hours. Next: BLD-207 measures whether what you built actually works.",
      "badge": "Advanced agent building: complete",
      "signature": true,
      "claims": [
        "C-100",
        "C-94"
      ]
    }
  ]
};
