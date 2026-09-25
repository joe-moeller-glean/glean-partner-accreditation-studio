/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "SRV-204",
  "title": "Advanced Agent Debugging",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Run debug mode and read a trace to isolate a failing step."
    },
    {
      "id": "OBJ-02",
      "text": "Classify a failure using the five-category taxonomy."
    },
    {
      "id": "OBJ-03",
      "text": "Assemble an escalation package that Glean can act on immediately."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-02",
      "eyebrow": "Cold open",
      "title": "“The agent is broken” is not a diagnosis",
      "body": "A customer reports a wrong answer. It could be instruction-following, retrieval, an action failure, a trigger problem, or configuration. Guessing costs a day and the escalation gets bounced back.",
      "claims": [
        "C-87"
      ]
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Find the root cause, not the symptom",
      "bullets": [
        "Read a debug trace and isolate the failing step.",
        "Classify any failure into one of five categories.",
        "Hand Glean an escalation package that needs no follow-up questions."
      ],
      "claims": [
        "C-87",
        "C-85"
      ]
    },
    {
      "id": "SCR-03",
      "archetype": "A7",
      "objective": "OBJ-01",
      "eyebrow": "Guided walkthrough",
      "title": "Debug mode, step by step",
      "body": "The trace exposes inputs, including referenced memory and variables, and outputs, including raw tool and LLM responses.",
      "asset": {
        "src": "assets/svg/srv-204-a01.svg",
        "alt": "Four-step flow diagram of the agent debug workflow from enabling debug mode to iterating on a fix.",
        "caption": "Green means success, red means error, and the trace persists."
      },
      "claims": [
        "C-71",
        "C-73",
        "C-74"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-02",
      "eyebrow": "Taxonomy",
      "title": "Five categories, five places to look",
      "body": "The journey covers the agent execution mental model, the debugging toolbox, the failure taxonomy, and escalation.",
      "asset": {
        "src": "assets/svg/srv-204-a02.svg",
        "alt": "Numbered diagram of the five agent failure categories with a short description of each.",
        "caption": "Classify first. The category tells you where to look."
      },
      "claims": [
        "C-86",
        "C-75",
        "C-76",
        "C-77",
        "C-78",
        "C-79"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A9",
      "objective": "OBJ-02",
      "eyebrow": "Sort it",
      "title": "Classify these five reports",
      "prompt": "Place each customer report in the correct failure category.",
      "type": "sort",
      "categories": [
        "Instruction-following",
        "Retrieval and context",
        "Action and integration",
        "Trigger and scheduling",
        "UI and configuration"
      ],
      "pairs": [
        {
          "item": "The agent answered, but ignored the format we specified and picked a tool we did not ask for.",
          "category": "Instruction-following",
          "why": "Wrong tools planned and ignored instructions are instruction-following failures."
        },
        {
          "item": "It says the policy document cannot be found, but the document is definitely indexed.",
          "category": "Retrieval and context",
          "why": "Right tool, wrong or missing results, including not found when it exists."
        },
        {
          "item": "The ticket was half created and then the step returned a timeout.",
          "category": "Action and integration",
          "why": "Partial writes and timeouts are action and integration failures."
        },
        {
          "item": "It was supposed to run at 6am on new documents and it has not run at all.",
          "category": "Trigger and scheduling",
          "why": "Never runs, runs at the wrong time, or runs on the wrong content."
        },
        {
          "item": "The save button does nothing when the admin edits the agent.",
          "category": "UI and configuration",
          "why": "Save failures and permissions problems are UI and configuration issues."
        }
      ],
      "takeaway": "Classification is the fastest debugging skill to build and the one that saves the most time.",
      "claims": [
        "C-75",
        "C-76",
        "C-77",
        "C-78",
        "C-79"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A5",
      "objective": "OBJ-01",
      "eyebrow": "Tuning",
      "title": "Memory and model size are usual suspects",
      "body": "Too much memory leads to slower, more expensive runs with wandering answers. Too little creates brittle agents that forget constraints or prior results.",
      "table": {
        "caption": "Memory options and their intended use.",
        "head": [
          "Setting",
          "Use it for"
        ],
        "rows": [
          [
            "All previous steps",
            "Short flows or complex reasoning"
          ],
          [
            "Only immediate previous step",
            "Default for formatting and cleanup"
          ],
          [
            "No memory",
            "Independent operations"
          ]
        ]
      },
      "footnote": "Use small and fast models for simple transforms; reserve larger models only where reasoning clearly benefits the outcome.",
      "claims": [
        "C-80",
        "C-81",
        "C-82"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A13",
      "objective": "OBJ-03",
      "eyebrow": "Escalation package",
      "title": "What a clean escalation contains",
      "steps": [
        {
          "title": "Classification",
          "body": "Which of the five categories the failure falls into, and the evidence for that call."
        },
        {
          "title": "Trace evidence",
          "body": "The failing step with its inputs, including referenced memory and variables, and its raw outputs."
        },
        {
          "title": "Reproduction",
          "body": "The run that fails, noting that multi-turn chat is supported in debug preview."
        },
        {
          "title": "What you already ruled out",
          "body": "Memory scope and model size changes attempted, and their effect."
        }
      ],
      "footnote": "Clear, actionable escalations are the stated goal: they help partners resolve customer issues faster and increase trust in production agents.",
      "claims": [
        "C-73",
        "C-71",
        "C-80",
        "C-102"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "quiz",
      "objective": "OBJ-02",
      "eyebrow": "Prove it",
      "title": "Debugging check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "How do you enable debug mode?",
          "options": [
            {
              "id": "a",
              "text": "Open the agent in Builder and toggle debug mode in the preview pane, then run it.",
              "correct": true,
              "feedback": "Correct, and multi-turn chat is supported in that preview."
            },
            {
              "id": "b",
              "text": "Submit a support request to have debugging enabled.",
              "feedback": "No. It is a toggle in the preview pane."
            },
            {
              "id": "c",
              "text": "Re-publish the agent with a debug flag in its name.",
              "feedback": "No. Naming has nothing to do with it."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-01",
          "stem": "What does the debug trace expose?",
          "options": [
            {
              "id": "a",
              "text": "Inputs, including referenced memory and variables, and outputs, including raw tool and LLM responses.",
              "correct": true,
              "feedback": "Correct. That pairing is what lets you compare intent against result."
            },
            {
              "id": "b",
              "text": "Only a pass or fail status per step.",
              "feedback": "No. It shows the actual inputs and outputs."
            },
            {
              "id": "c",
              "text": "Only the final answer.",
              "feedback": "No. Step-level detail is the point of the trace."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "A step returns an HTTP validation error and a partial write. Which category?",
          "options": [
            {
              "id": "a",
              "text": "Action and integration failures.",
              "correct": true,
              "feedback": "Correct. HTTP errors, validation errors, partial writes, and timeouts sit here."
            },
            {
              "id": "b",
              "text": "Instruction-following failures.",
              "feedback": "No. That category covers wrong tool planning and ignored instructions."
            },
            {
              "id": "c",
              "text": "Trigger and scheduling failures.",
              "feedback": "No. Those concern when and whether the agent runs."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "The agent reports a document not found, but it is indexed. Which category?",
          "options": [
            {
              "id": "a",
              "text": "Retrieval and context-selection failures.",
              "correct": true,
              "feedback": "Correct. The right tool ran but returned wrong or missing results."
            },
            {
              "id": "b",
              "text": "UI and configuration issues.",
              "feedback": "No. That covers buttons, saves, and permissions."
            },
            {
              "id": "c",
              "text": "Instruction-following failures.",
              "feedback": "No. The instruction was followed; retrieval failed."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "What is the recommended debugging workflow once debug mode is on?",
          "options": [
            {
              "id": "a",
              "text": "Filter to only show errors, open the failing step, compare inputs against outputs, then iterate with Try Again or Reset Preview.",
              "correct": true,
              "feedback": "Correct. It moves from symptom to root cause in the fewest steps."
            },
            {
              "id": "b",
              "text": "Read every step in order from the beginning each time.",
              "feedback": "No. Filtering to errors is faster and is the documented approach."
            },
            {
              "id": "c",
              "text": "Rebuild the agent from scratch.",
              "feedback": "No. That discards the evidence you need."
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
      "title": "Practise on a tenant before you practise on a customer",
      "body": "Use the Glean Help Center Debug your agent guide and live labs on a demo tenant to build hands-on debugging expertise.",
      "badge": "Advanced debugging: complete",
      "signature": true,
      "claims": [
        "C-84"
      ]
    }
  ]
};
