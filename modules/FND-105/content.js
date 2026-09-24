/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "FND-105",
  "title": "Choosing the Right Construct / Primitive",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Apply a decision rule that selects between search, assistant, prompt, agent, action, MCP, and connector."
    },
    {
      "id": "OBJ-02",
      "text": "Justify native-first sequencing and name the conditions that warrant custom work."
    },
    {
      "id": "OBJ-03",
      "text": "Defend a construct choice against a stakeholder who asked for something else."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Cold open",
      "title": "Two builders, same requirement, opposite designs",
      "body": "One proposes a custom action. The other proposes an MCP-backed agent step. Both can be made to work. Only one is the right cost, and the requirement document does not say which.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "A decision rule you can defend",
      "bullets": [
        "Run a repeatable selection sequence instead of arguing preference.",
        "Explain why native comes first and when custom is correct.",
        "Hold your ground with a stakeholder who asked for the wrong thing."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "The rule",
      "title": "Start with the job, not the surface",
      "body": "Recommended partner positioning is to start with the job to be done, prefer native options first, and go custom when the customer needs proprietary workflow logic, internal systems, or differentiated partner IP.",
      "asset": {
        "src": "assets/svg/fnd-105-a01.svg",
        "alt": "Four-step flow diagram showing the construct selection sequence from job to be done through to custom build.",
        "caption": "Positioning sequence, not a preference ranking."
      },
      "claims": [
        "C-66"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A5",
      "objective": "OBJ-02",
      "eyebrow": "Compare",
      "title": "Native and custom are the same primitive",
      "body": "Choosing custom is a cost and ownership decision, not a capability upgrade. Pair each need against the native option before you price a build.",
      "asset": {
        "src": "assets/svg/fnd-105-a02.svg",
        "alt": "Two-column comparison of native versus custom examples for MCP, actions, and skills.",
        "caption": "Same primitive, different build cost and different reason."
      },
      "claims": [
        "C-65"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A4",
      "objective": "OBJ-01",
      "eyebrow": "Constraints that decide for you",
      "title": "Three facts that end the debate early",
      "prompt": "Open each constraint before you design around it.",
      "hotspots": [
        {
          "label": "Remote MCP servers are fully supported for Assistant",
          "detail": "If the requirement is Assistant-side tool access over an open standard, remote MCP servers are fully supported."
        },
        {
          "label": "In Agents, MCP-backed tools work in Plan and Execute and auto mode",
          "detail": "MCP-backed tools are available in Plan and Execute mode and in auto mode, which is where dynamic tool choice belongs."
        },
        {
          "label": "MCP tools are not individual single-step selections in Agent Builder",
          "detail": "You cannot pick an MCP tool as a single discrete step in Agent Builder. If the design needs one fixed deterministic step, that is a custom action."
        }
      ],
      "claims": [
        "C-57",
        "C-58",
        "C-59"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A6",
      "objective": "OBJ-03",
      "eyebrow": "Decision branch",
      "title": "The stakeholder wants an agent for a single fixed write",
      "type": "choice",
      "prompt": "The requirement is one validated write into an internal system, on demand, no schedule. What do you propose?",
      "options": [
        {
          "id": "o1",
          "text": "A custom action, because it is deterministic execution against an internal API with validation before the write.",
          "correct": true,
          "feedback": "Correct. Custom actions cover internal APIs Glean does not support out of the box, legacy systems, and approvals or validation before writing to a system."
        },
        {
          "id": "o2",
          "text": "An agent with an MCP tool chosen at run time, so it stays flexible.",
          "feedback": "This adds nondeterminism to a requirement that asked for one fixed write, and MCP tools are not available as individual single-step selections in Agent Builder."
        },
        {
          "id": "o3",
          "text": "A skill, so the methodology is reusable.",
          "feedback": "Skills carry reasoning and methodology. They do not perform the validated system write this requirement needs."
        }
      ],
      "takeaway": "Use custom actions when you want precise, governed execution for a known operation.",
      "claims": [
        "C-61",
        "C-59",
        "C-51"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A9",
      "objective": "OBJ-01",
      "eyebrow": "Sort it",
      "title": "Four requirements, four constructs",
      "prompt": "Place each requirement with the construct that should carry it.",
      "type": "sort",
      "categories": [
        "Skills",
        "Custom actions",
        "MCP",
        "Agents"
      ],
      "pairs": [
        {
          "item": "Bring Glean context into the IDE for engineers.",
          "category": "MCP",
          "why": "The engineering copilot scenario uses the Glean MCP server to bring Glean context into Cursor or VS Code."
        },
        {
          "item": "Create an onboarding request in an internal system and return an ID and link.",
          "category": "Custom actions",
          "why": "That is the documented example custom action: an internal IT onboarding action returning a request ID plus link."
        },
        {
          "item": "Enforce one methodology for account plans across every consultant.",
          "category": "Skills",
          "why": "Standardized consulting delivery uses a skill to enforce the same methodology."
        },
        {
          "item": "Run every morning, check new content, and route exceptions for approval.",
          "category": "Agents",
          "why": "Scheduled, event-driven, or governed end-to-end workflows are agent work."
        }
      ],
      "takeaway": "Same four categories, harder inputs. If you can sort these, you can run the conversation live.",
      "claims": [
        "C-70",
        "C-68",
        "C-53"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "quiz",
      "objective": "OBJ-02",
      "eyebrow": "Prove it",
      "title": "Construct selection check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-02",
          "stem": "What is the recommended sequencing for partner positioning?",
          "options": [
            {
              "id": "a",
              "text": "Start with the job to be done, prefer native options first, go custom when proprietary logic, internal systems, or partner IP require it.",
              "correct": true,
              "feedback": "Correct. Native-first keeps build cost honest and reserves custom work for real differentiation."
            },
            {
              "id": "b",
              "text": "Always build custom so the partner controls the code.",
              "feedback": "No. Custom-by-default inflates cost and maintenance without adding customer value."
            },
            {
              "id": "c",
              "text": "Pick whichever construct the stakeholder names first.",
              "feedback": "No. The stakeholder's opening ask is an input, not a decision."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-01",
          "stem": "Which statement about MCP inside Agent Builder is accurate?",
          "options": [
            {
              "id": "a",
              "text": "MCP tools are not available as individual single-step selections in Agent Builder.",
              "correct": true,
              "feedback": "Correct. They are available in Plan and Execute and auto mode, which is a real design constraint."
            },
            {
              "id": "b",
              "text": "MCP tools can be selected as any single discrete step in Agent Builder.",
              "feedback": "No. That is exactly the constraint to design around."
            },
            {
              "id": "c",
              "text": "MCP is unsupported anywhere in Glean.",
              "feedback": "No. Remote MCP servers are fully supported for Assistant."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-01",
          "stem": "A requirement needs approvals and custom business logic before writing to a system. What fits?",
          "options": [
            {
              "id": "a",
              "text": "A custom action.",
              "correct": true,
              "feedback": "Correct. Approvals, validation, or custom business logic before a write is a documented custom action use case."
            },
            {
              "id": "b",
              "text": "A verified third-party MCP server.",
              "feedback": "No. A verified public server will not carry the customer's internal approval logic."
            },
            {
              "id": "c",
              "text": "Enterprise search.",
              "feedback": "No. Search does not write."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "When is MCP the right call for an agent design?",
          "options": [
            {
              "id": "a",
              "text": "When the agent needs dynamic tool choice across a connected toolset and broad interoperability.",
              "correct": true,
              "feedback": "Correct. Dynamic tool choice plus interoperability is the MCP signal."
            },
            {
              "id": "b",
              "text": "When exactly one fixed endpoint is called the same way every run.",
              "feedback": "No. A single fixed call is deterministic work for a custom action."
            },
            {
              "id": "c",
              "text": "When no external systems are involved.",
              "feedback": "No. MCP exists to reach external tools and data."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "Which pairing of native and custom is correct?",
          "options": [
            {
              "id": "a",
              "text": "Native: built-in Jira creation template. Custom: internal approval workflow action.",
              "correct": true,
              "feedback": "Correct. Same primitive, different ownership and build cost."
            },
            {
              "id": "b",
              "text": "Native: partner-authored delivery methodology. Custom: Glean platform skill.",
              "feedback": "Reversed. The platform skill is native; the partner-authored methodology is custom."
            },
            {
              "id": "c",
              "text": "Native: customer-hosted internal MCP server. Custom: verified GitHub MCP server.",
              "feedback": "Reversed. The verified public server is native; the customer-hosted internal one is custom."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A13",
      "objective": "OBJ-03",
      "eyebrow": "Job aid",
      "title": "Carry this into your next scoping call",
      "bullets": [
        "Skills standardize reasoning. Actions standardize execution. MCP standardizes interoperability. Agents operationalize all three.",
        "Start with the job to be done, prefer native first, go custom for proprietary logic, internal systems, or partner IP.",
        "MCP is the answer when an agent needs dynamic tool choice across a connected toolset."
      ],
      "badge": "Construct decisions: complete",
      "signature": true,
      "claims": [
        "C-67",
        "C-66",
        "C-69"
      ]
    }
  ]
};
