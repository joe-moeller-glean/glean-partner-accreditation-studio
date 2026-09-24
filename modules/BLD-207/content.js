/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "BLD-207",
  "title": "Agent Evaluation, Testing & QA",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Build a test case set that exercises guardrails, fallbacks, and tool paths."
    },
    {
      "id": "OBJ-02",
      "text": "Measure agent quality against success criteria defined before the build."
    },
    {
      "id": "OBJ-03",
      "text": "Prevent regressions when an agent, prompt, or source set changes."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-02",
      "eyebrow": "Cold open",
      "title": "Nobody can tell you whether the agent got better",
      "body": "The prompt changed, the sources changed, and the team believes quality improved. There is no baseline, no test set, and no way to prove it either way.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Make agent quality measurable",
      "bullets": [
        "Write test cases that exercise guardrails, fallbacks, and tool paths.",
        "Measure against criteria set before the build started.",
        "Catch regressions before a customer does."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "The loop",
      "title": "Evaluation starts in the planning phase",
      "body": "Measurement compares actual outcomes against the KPIs and success criteria defined during planning, using both quantitative data and qualitative feedback.",
      "asset": {
        "src": "assets/svg/bld-207-a01.svg",
        "alt": "Four-step flow diagram of the agent evaluation loop from criteria definition through to feeding insights back into planning.",
        "caption": "Evaluation is a loop that starts before the build."
      },
      "claims": [
        "C-45",
        "C-37"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-01",
      "eyebrow": "Coverage",
      "title": "Four things every test set must exercise",
      "body": "Partners are expected to understand best practices for testing and validation of Glean agents. Coverage follows the build requirements.",
      "asset": {
        "src": "assets/svg/bld-207-a02.svg",
        "alt": "Numbered diagram of four required agent test coverage areas.",
        "caption": "Each area maps to a stated competency requirement."
      },
      "claims": [
        "C-27",
        "C-06",
        "C-07",
        "C-08"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "Usage signals",
      "title": "Adoption data is quality data",
      "bullets": [
        "Track the number of agent runs, count of distinct users, frequency of use, and patterns of engagement over time.",
        "High abandonment rates or declining usage can indicate user friction or changing needs.",
        "Gather qualitative and quantitative input from users, not just system metrics."
      ],
      "claims": [
        "C-46",
        "C-47",
        "C-45"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A8",
      "objective": "OBJ-01",
      "eyebrow": "Worked example",
      "title": "Turning one requirement into four test cases",
      "steps": [
        {
          "title": "Requirement",
          "body": "The agent must configure retrieval guardrails with clear instructions for what it can and cannot answer."
        },
        {
          "title": "In-scope case",
          "body": "Ask a question squarely inside the defined source set and confirm a grounded answer."
        },
        {
          "title": "Out-of-scope case",
          "body": "Ask a question outside scope and confirm the defined fallback behaviour fires rather than a guess."
        },
        {
          "title": "Low-confidence case",
          "body": "Ask an ambiguous question and confirm explicit error handling degrades safely instead of answering confidently."
        }
      ],
      "claims": [
        "C-07",
        "C-08"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A10",
      "objective": "OBJ-03",
      "eyebrow": "Myth versus reality",
      "title": "“It passed once, so it works”",
      "body": "Comprehensive testing and refinement cycles are part of the build phase, and formal owner sign-off is secured before launch. A single passing run is not evidence of stability.",
      "footnote": "Successful agents become templates for future development, which means their test sets get reused too.",
      "claims": [
        "C-39",
        "C-48"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A6",
      "objective": "OBJ-03",
      "eyebrow": "Decision branch",
      "title": "Usage dropped 40% after a prompt change",
      "type": "choice",
      "prompt": "Runs are down and no error rate moved. What do you do first?",
      "options": [
        {
          "id": "o1",
          "text": "Treat declining usage as a friction signal, gather qualitative user input, and compare against the pre-change baseline.",
          "correct": true,
          "feedback": "Correct. Declining usage can indicate user friction or changing needs, and measurement pairs quantitative data with qualitative feedback."
        },
        {
          "id": "o2",
          "text": "Assume seasonality and wait a quarter.",
          "feedback": "No. That discards the signal the metric exists to give you."
        },
        {
          "id": "o3",
          "text": "Roll back every change without diagnosis.",
          "feedback": "Rolling back blind loses the learning, and insight from measurement is meant to feed back into planning."
        }
      ],
      "claims": [
        "C-47",
        "C-45",
        "C-48"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "quiz",
      "objective": "OBJ-02",
      "eyebrow": "Prove it",
      "title": "Evaluation and QA check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-02",
          "stem": "When are an agent's success criteria supposed to be defined?",
          "options": [
            {
              "id": "a",
              "text": "During planning, before the build, so measurement has a target.",
              "correct": true,
              "feedback": "Correct. Measurement compares actual outcomes against KPIs defined during planning."
            },
            {
              "id": "b",
              "text": "After launch, once usage patterns emerge.",
              "feedback": "No. Without a pre-set target there is nothing to measure against."
            },
            {
              "id": "c",
              "text": "Only if the customer requests a business case.",
              "feedback": "No. Baseline metrics and success criteria are part of the standard plan."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "Which usage metrics should be tracked?",
          "options": [
            {
              "id": "a",
              "text": "Agent runs, distinct users, frequency of use, and engagement patterns over time.",
              "correct": true,
              "feedback": "Correct. Those four reveal both breadth and depth of adoption."
            },
            {
              "id": "b",
              "text": "Only the total number of agents created.",
              "feedback": "No. Creation count says nothing about whether agents are used."
            },
            {
              "id": "c",
              "text": "Only error rates.",
              "feedback": "No. Error rate misses friction that shows up as abandonment."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-03",
          "stem": "What can high abandonment or declining usage indicate?",
          "options": [
            {
              "id": "a",
              "text": "User friction or changing needs.",
              "correct": true,
              "feedback": "Correct, and both warrant investigation rather than assumption."
            },
            {
              "id": "b",
              "text": "That the agent is working as intended.",
              "feedback": "No. Falling engagement is a warning signal."
            },
            {
              "id": "c",
              "text": "That the model needs to be larger.",
              "feedback": "No. Model size is unrelated to an adoption signal."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-01",
          "stem": "Which test case set matches the fallback requirement?",
          "options": [
            {
              "id": "a",
              "text": "Out-of-scope and low-confidence questions that must trigger defined fallback behaviour.",
              "correct": true,
              "feedback": "Correct. Explicit error handling with a defined fallback is a stated requirement."
            },
            {
              "id": "b",
              "text": "Only questions well inside the defined source set.",
              "feedback": "No. In-scope cases never exercise the fallback path."
            },
            {
              "id": "c",
              "text": "Only performance and latency measurements.",
              "feedback": "No. Latency does not test refusal behaviour."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "What happens to measurement insights at the end of the loop?",
          "options": [
            {
              "id": "a",
              "text": "They feed directly back into planning, and successful agents become templates.",
              "correct": true,
              "feedback": "Correct. That is what makes the loop a continuous improvement cycle."
            },
            {
              "id": "b",
              "text": "They are archived once the project closes.",
              "feedback": "No. Archiving them breaks the improvement cycle."
            },
            {
              "id": "c",
              "text": "They replace the need for future discovery workshops.",
              "feedback": "No. Discovery still surfaces new opportunities."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A13",
      "objective": "OBJ-03",
      "eyebrow": "Job aid",
      "title": "Regression checklist",
      "bullets": [
        "Baseline captured before the change, using criteria defined in planning.",
        "Guardrail, fallback, and tool-path cases re-run after every prompt or source change.",
        "Run count, distinct users, and engagement pattern compared against baseline.",
        "Owner sign-off recorded before the change reaches production."
      ],
      "badge": "Evaluation and QA: complete",
      "signature": true,
      "claims": [
        "C-37",
        "C-46",
        "C-39"
      ]
    }
  ]
};
