/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "ACC-107",
  "title": "Custom Connector Competency Capstone",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Distinguish this learning accreditation from the official Custom Connector Competency."
    },
    {
      "id": "OBJ-02",
      "text": "Assemble a portfolio mapped to the official competency requirements."
    },
    {
      "id": "OBJ-03",
      "text": "Prepare for the unseen case and the reviewer probes."
    },
    {
      "id": "OBJ-04",
      "text": "Prepare the official submission package and plan for renewal."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-03",
      "eyebrow": "Cold open",
      "title": "Defend it",
      "body": "You have scoped, designed, built, broken, and operated a connector. Now two reviewers will ask why, for every choice, and probe the places connectors usually fail. The capstone is not a quiz about the connector. It is proof that you can build one someone else will trust.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A5",
      "objective": "OBJ-01",
      "eyebrow": "Two credentials",
      "title": "Know what this badge is, and is not",
      "body": "The Custom Connector Competency certifies partners to scope, build, deploy, and maintain custom data source integrations with Glean. Competencies require thorough experience and an audit process. This course's accreditation prepares you and your evidence for that audit; it does not award the competency.",
      "asset": {
        "src": "assets/svg/acc-107-a01.svg",
        "alt": "Comparison of the learning accreditation and the official competency.",
        "caption": "This badge prepares you. It does not award the competency."
      },
      "claims": [
        "C-260",
        "C-267",
        "C-266"
      ]
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "Portfolio",
      "title": "Map your portfolio to the requirements",
      "table": {
        "caption": "Official requirements and where this path prepares them",
        "head": [
          "Requirement",
          "Prepared in"
        ],
        "rows": [
          [
            "5 technical accreditations in the Glean Partner Portal",
            "Your accreditation plan with your Partner Manager"
          ],
          [
            "Glean-delivered custom connector workshop session",
            "Scheduled with your Glean technical team"
          ],
          [
            "Architecture review with a Glean technical resource",
            "BLD-201 design record and diagram"
          ],
          [
            "Technical specifications document",
            "BLD-201 design record and CON-203 data model"
          ],
          [
            "Build: users, permissions, documents; automated updates; retry and backoff",
            "BLD-202 evidence pack"
          ],
          [
            "Customer-approved maintenance plan",
            "CON-301 plan, approved by the customer"
          ],
          [
            "Intake form for publishing, where the connector is listed",
            "CON-301 publishing and documentation"
          ]
        ]
      },
      "claims": [
        "C-264",
        "C-333",
        "C-269",
        "C-271",
        "C-261",
        "C-262",
        "C-263",
        "C-265",
        "C-272"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A10",
      "objective": "OBJ-01",
      "eyebrow": "Myth versus reality",
      "title": "Three assumptions that stall submissions",
      "hotspots": [
        {
          "label": "Myth: passing this capstone makes the partner competency-certified.",
          "detail": "Competencies require an audit process. This badge prepares the evidence."
        },
        {
          "label": "Myth: the architecture review can be skipped if the code is good.",
          "detail": "The competency requires a custom connector architecture review with a Glean technical resource."
        },
        {
          "label": "Myth: once earned, the competency is permanent.",
          "detail": "It is validated every 18 months. Renewal needs written documentation from a customer within 3 months before renewal."
        }
      ],
      "claims": [
        "C-267",
        "C-269",
        "C-266",
        "C-270"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A7",
      "objective": "OBJ-03",
      "eyebrow": "Unseen case",
      "title": "Two hours, a source you have not built",
      "steps": [
        {
          "title": "Fit",
          "body": "Apply the five-question sequence; record rejected alternatives."
        },
        {
          "title": "Feasibility",
          "body": "Content, permissions, people, activity: source, method, gap cost."
        },
        {
          "title": "Capacity",
          "body": "Calls per run against source and Glean limits."
        },
        {
          "title": "Identity and ACLs",
          "body": "Identity strategy and the ACL shape for three given records."
        },
        {
          "title": "Freshness and deletion",
          "body": "One strategy per object family, with checkpoints."
        },
        {
          "title": "Guard and risks",
          "body": "The completeness guard and a risk register."
        }
      ],
      "footnote": "You are assigned one of the other case sources at random: the vendor learning system or the reference archive.",
      "asset": {
        "src": "assets/svg/acc-107-a02.svg",
        "alt": "Four-part capstone flow ending in scoring.",
        "caption": "Hard gates cannot be offset by a high score."
      },
      "claims": [
        "C-250",
        "C-006",
        "C-137",
        "C-198",
        "C-174",
        "C-170"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A4",
      "objective": "OBJ-03",
      "eyebrow": "Review probes",
      "title": "Questions reviewers ask",
      "body": "Prepare an answer, with evidence, for each. Answers are not shown here.",
      "hotspots": [
        {
          "label": "Completeness",
          "detail": "Show what happens if page 37 of 384 returns an empty list with no cursor."
        },
        {
          "label": "Membership",
          "detail": "A user is removed from a group in the source. When and how does Glean reflect it?"
        },
        {
          "label": "Permission-only change",
          "detail": "Only a page's read groups change. Which code path pushes that?"
        },
        {
          "label": "Rename",
          "detail": "A page is renamed. How many documents exist afterward?"
        },
        {
          "label": "Secrets",
          "detail": "Where is the source token stored, and who rotates it on day 90?"
        },
        {
          "label": "Intended cleanup",
          "detail": "A nightly run deletes 25% of documents on purpose. What will users see tomorrow, and what do you do?"
        },
        {
          "label": "Proof of indexing",
          "detail": "The Job shows Completed. How do you know documents were indexed?"
        }
      ],
      "claims": [
        "C-154",
        "C-116",
        "C-101",
        "C-238",
        "C-107",
        "C-214"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A6",
      "objective": "OBJ-02",
      "eyebrow": "Decision",
      "title": "A gap in the portfolio",
      "type": "choice",
      "prompt": "Your portfolio is complete except for one item: no architecture review with a Glean technical resource has happened. What do you do?",
      "options": [
        {
          "id": "o2",
          "text": "Submit now; reviewers can do the review during the audit.",
          "feedback": "The review is a requirement, not an audit step to defer."
        },
        {
          "id": "o3",
          "text": "Replace it with a self-review against the rubric.",
          "feedback": "Self-review is good preparation, but it does not replace the required review."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "Schedule the architecture review, then submit.",
          "feedback": "Right. The competency requires a custom connector architecture review with a Glean technical resource."
        }
      ],
      "takeaway": "Close every requirement before you submit.",
      "claims": [
        "C-269"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A5",
      "objective": "OBJ-03",
      "eyebrow": "Scoring",
      "title": "How the capstone is scored",
      "table": {
        "caption": "Capstone scoring (studio-authored; scored outside this package)",
        "head": [
          "Rule",
          "Detail"
        ],
        "rows": [
          [
            "Hard gates",
            "Identity handling; permissions and refresh; deletion for every object family; completeness guard and retry; security and secrets"
          ],
          [
            "Pass mark",
            "80% aggregate, with every hard gate met"
          ],
          [
            "Reviewers",
            "Two, scoring independently; a third when they differ by more than 10 points"
          ],
          [
            "Retake",
            "A different unseen case source"
          ]
        ]
      },
      "footnote": "Studio guidance: the capstone rubric is this course's design, modeled on how connector reviews assess risk.",
      "claims": [
        "C-261",
        "C-263",
        "C-195",
        "C-174",
        "C-170",
        "C-215"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A7",
      "objective": "OBJ-04",
      "eyebrow": "Submission",
      "title": "From badge to official submission",
      "steps": [
        {
          "title": "Work with your Partner Manager",
          "body": "Partners work with their Partner Manager to select and achieve a competency."
        },
        {
          "title": "Package",
          "body": "A zip file with the Competency Submission Workbook and all required documentation."
        },
        {
          "title": "Customer confirmation",
          "body": "Request written confirmation that permissions and security meet expectations after a custom test group reviews the results."
        },
        {
          "title": "Renewal",
          "body": "Validated every 18 months, with written customer documentation from within 3 months before renewal."
        }
      ],
      "claims": [
        "C-334",
        "C-268",
        "C-274",
        "C-266",
        "C-270"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A13",
      "objective": "OBJ-02",
      "eyebrow": "Job aid",
      "title": "Capstone readiness checklist",
      "cards": [
        {
          "tag": "Portfolio",
          "title": "Portfolio",
          "body": "Design record, diagram, specification, evidence pack, maintenance plan."
        },
        {
          "tag": "Program",
          "title": "Program steps",
          "body": "Five technical accreditations, the workshop, and the architecture review."
        },
        {
          "tag": "Customer",
          "title": "Customer",
          "body": "An approved maintenance plan and written permission and security confirmation."
        },
        {
          "tag": "Submit",
          "title": "Submit",
          "body": "The workbook and documents in one zip; renewal on your calendar."
        }
      ],
      "claims": [
        "C-271",
        "C-265",
        "C-264",
        "C-333",
        "C-269",
        "C-274",
        "C-268",
        "C-266"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "quiz",
      "objective": "OBJ-04",
      "eyebrow": "Self-check",
      "title": "Capstone readiness self-check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "What does passing this capstone award?",
          "options": [
            {
              "id": "b",
              "text": "The official Custom Connector Competency",
              "feedback": "The competency requires an audit process by Glean."
            },
            {
              "id": "a",
              "correct": true,
              "text": "This course's learning accreditation, not the official competency",
              "feedback": "Right. Competencies require an audit process."
            },
            {
              "id": "c",
              "text": "A Glean-hosted connector for the partner",
              "feedback": "The capstone awards no hosting."
            },
            {
              "id": "d",
              "text": "Listing on the Glean Connectors webpage",
              "feedback": "Listing uses the intake form."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-04",
          "stem": "How often is the Custom Connector Competency validated?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Every 18 months",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "Every year",
              "feedback": "The documented period is 18 months."
            },
            {
              "id": "c",
              "text": "Once, permanently",
              "feedback": "It is validated every 18 months."
            },
            {
              "id": "d",
              "text": "With every SDK release",
              "feedback": "The validation cycle is 18 months."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-04",
          "stem": "For renewal, how recent must the customer's written documentation be?",
          "options": [
            {
              "id": "b",
              "text": "Within 18 months",
              "feedback": "18 months is the validation cycle."
            },
            {
              "id": "c",
              "text": "Any time since go-live",
              "feedback": "It must be recent: within 3 months before renewal."
            },
            {
              "id": "d",
              "text": "No customer documentation is needed",
              "feedback": "Written customer documentation is required."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Within 3 months before renewal",
              "feedback": "Right."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "Which maintenance plan does the competency require?",
          "options": [
            {
              "id": "b",
              "text": "A partner-internal plan only",
              "feedback": "The customer must approve it."
            },
            {
              "id": "c",
              "text": "No plan; Glean maintains the connector",
              "feedback": "A customer-approved plan is required."
            },
            {
              "id": "a",
              "correct": true,
              "text": "A customer-approved maintenance plan",
              "feedback": "Right."
            },
            {
              "id": "d",
              "text": "A plan approved by Glean Support",
              "feedback": "The customer approves it."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-02",
          "stem": "How many technical accreditations does the competency require?",
          "options": [
            {
              "id": "b",
              "text": "One: this capstone",
              "feedback": "Five technical accreditations are required."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Five, completed in the Glean Partner Portal",
              "feedback": "Right."
            },
            {
              "id": "c",
              "text": "Three, in any learning system",
              "feedback": "Five, in the Glean Partner Portal."
            },
            {
              "id": "d",
              "text": "None; the build is enough",
              "feedback": "Accreditations are required as well."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-02",
          "stem": "Which build does the competency expect?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Indexes users, permissions, and documents; updates automatically; retries with backoff",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "Indexes documents once, manually",
              "feedback": "Automated updates are required."
            },
            {
              "id": "c",
              "text": "Provides MCP tools only",
              "feedback": "The competency is for indexing connectors."
            },
            {
              "id": "d",
              "text": "Indexes documents with allow-all access",
              "feedback": "Permissions are required."
            }
          ]
        },
        {
          "id": "Q-07",
          "objective": "OBJ-04",
          "stem": "What goes in the official submission?",
          "options": [
            {
              "id": "b",
              "text": "A link to the connector's source code only",
              "feedback": "The workbook and documentation are required."
            },
            {
              "id": "c",
              "text": "This course's completion certificate only",
              "feedback": "The course badge does not replace the workbook."
            },
            {
              "id": "d",
              "text": "A recorded demo only",
              "feedback": "The workbook and documentation are required."
            },
            {
              "id": "a",
              "correct": true,
              "text": "A zip with the Competency Submission Workbook and required documentation",
              "feedback": "Right."
            }
          ]
        },
        {
          "id": "Q-08",
          "objective": "OBJ-02",
          "stem": "Which review with Glean is a competency requirement?",
          "options": [
            {
              "id": "b",
              "text": "A pricing review with Glean finance",
              "feedback": "Not a documented requirement."
            },
            {
              "id": "c",
              "text": "A marketing review of the listing",
              "feedback": "Not a documented requirement."
            },
            {
              "id": "a",
              "correct": true,
              "text": "A custom connector architecture review with a Glean technical resource",
              "feedback": "Right."
            },
            {
              "id": "d",
              "text": "No review; the workbook is enough",
              "feedback": "The architecture review is required."
            }
          ]
        },
        {
          "id": "Q-09",
          "objective": "OBJ-04",
          "stem": "When should the partner request the customer's written permission and security confirmation?",
          "options": [
            {
              "id": "b",
              "text": "Before the connector is built",
              "feedback": "There is nothing to confirm yet."
            },
            {
              "id": "a",
              "correct": true,
              "text": "After a custom test group has reviewed the results",
              "feedback": "Right."
            },
            {
              "id": "c",
              "text": "Only if the customer raises concerns",
              "feedback": "Request it as a standard step."
            },
            {
              "id": "d",
              "text": "At renewal, 18 months later",
              "feedback": "Request it once the test group has reviewed results."
            }
          ]
        },
        {
          "id": "Q-10",
          "objective": "OBJ-03",
          "stem": "Which workshop does the competency require?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "A Glean-delivered custom connector workshop session",
              "feedback": "Right. Schedule it with your Glean technical team."
            },
            {
              "id": "b",
              "text": "Any third-party Python course",
              "feedback": "The workshop is Glean-delivered."
            },
            {
              "id": "c",
              "text": "An agent building workshop",
              "feedback": "That belongs to a different competency."
            },
            {
              "id": "d",
              "text": "No workshop is required",
              "feedback": "The Glean-delivered workshop is required."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-REF",
      "archetype": "A11",
      "objective": "OBJ-01",
      "eyebrow": "Sources",
      "title": "Where every fact on these screens comes from",
      "body": "Each screen lists claim ids such as C-006. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.",
      "table": {
        "caption": "Claim ids by source",
        "head": [
          "Source",
          "Where to find it",
          "Claim ids"
        ],
        "rows": [
          [
            "About connectors",
            "Glean Docs (docs.glean.com)",
            "C-006"
          ],
          [
            "Bulk Indexing",
            "Glean Developer docs (developers.glean.com)",
            "C-101"
          ],
          [
            "Bulk Upload Model",
            "Glean Developer docs (developers.glean.com)",
            "C-107"
          ],
          [
            "Permissions (Indexing API guide)",
            "Glean Developer docs (developers.glean.com)",
            "C-116"
          ],
          [
            "Indexing SDK — Indexing modes",
            "Glean Developer docs (developers.glean.com)",
            "C-170, C-174"
          ],
          [
            "Indexing SDK — Permissions",
            "Glean Developer docs (developers.glean.com)",
            "C-195, C-198"
          ],
          [
            "Indexing SDK — Deployment overview",
            "Glean Developer docs (developers.glean.com)",
            "C-214, C-215"
          ],
          [
            "Indexing SDK — Overview",
            "Glean Developer docs (developers.glean.com)",
            "C-154"
          ],
          [
            "Rate Limits and Retries",
            "Glean Developer docs (developers.glean.com)",
            "C-137"
          ],
          [
            "Glean Partner Content | Custom Connector Best Practices (deck, April 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-238"
          ],
          [
            "[External] Glean Partner Content | Custom Connector Questionnaire",
            "Glean partner document (ask your Partner Manager for access)",
            "C-250"
          ],
          [
            "Glean Partner Competency Program Guide (Feb 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-260, C-261, C-262, C-263, C-264, C-265, C-266, C-267, C-268, C-269, C-333, C-334"
          ],
          [
            "Custom Connector Competency Submission Workbook",
            "Glean partner document (ask your Partner Manager for access)",
            "C-270, C-271"
          ],
          [
            "[Template] Custom Connector Intake Form v2",
            "Glean partner document (ask your Partner Manager for access)",
            "C-272, C-274"
          ]
        ]
      },
      "claims": []
    },
    {
      "id": "SCR-12",
      "archetype": "A14",
      "objective": "OBJ-01",
      "eyebrow": "Badge",
      "title": "Custom Connector Competency: learning accreditation",
      "body": "Completing this module and passing the assessor-scored capstone completes the learning accreditation. Next, assemble the official submission with your Partner Manager.",
      "badge": "Custom Connector - learning accreditation",
      "signature": true,
      "claims": []
    }
  ]
};
