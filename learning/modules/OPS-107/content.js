/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "OPS-107",
  "title": "Glean Support Center & Escalations",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Choose the correct Glean support path for a request: self-service, conversation, ticket, or feedback."
    },
    {
      "id": "OBJ-02",
      "text": "Build a complete ticket and assign the correct priority from business impact."
    },
    {
      "id": "OBJ-03",
      "text": "Escalate inside the Glean support portal so the incident stays tracked and SLA-eligible."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-03",
      "eyebrow": "Cold open",
      "title": "Search is down. Where do you report it?",
      "body": "It is Monday morning. A customer admin tells you that Glean search is unavailable to every user. Their first idea is to post in a shared chat channel and email a contact they know. Before you agree, ask one question: which channel actually starts a tracked, SLA-eligible incident?",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "By the end of this module",
      "bullets": [
        "Choose between self-service, a conversation, a ticket, and the feedback board.",
        "Build a ticket with the six details support needs, and set priority from business impact.",
        "Keep an escalation inside the support portal so it stays tracked."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "The support path",
      "title": "Everything starts in Gleaniverse",
      "body": "You must sign in to Gleaniverse to reach the Glean Support Center. Logins from the legacy support portal were not migrated. After you sign in, there are two entry points: Ask Query in the top navigation, and the support widget in the bottom-right corner. Before you open a ticket, search Glean Docs, ask Query, and check the Glean status page for known issues.",
      "asset": {
        "src": "assets/svg/ops-107-a01.svg",
        "alt": "Flow diagram of the Glean support path: sign in to Gleaniverse, self-serve, start a conversation, then a tracked ticket.",
        "caption": "Start light. Move to a ticket when the issue needs formal tracking."
      },
      "claims": [
        "C-201",
        "C-202",
        "C-203",
        "C-204"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Two ways to get help",
      "title": "Conversations and tickets do different jobs",
      "body": "Conversations are available to all users and are the best starting point for most requests. Tickets formally track issues that need follow-up or escalation, such as bug reports and outages. If a conversation needs escalation, support can convert it into a ticket.",
      "asset": {
        "src": "assets/svg/ops-107-a02.svg",
        "alt": "Comparison table of support conversations and support tickets by who can use them, what they are for, and how to start them.",
        "caption": "Not sure? Start a conversation. Support can convert it into a ticket."
      },
      "claims": [
        "C-205",
        "C-207",
        "C-208"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A4",
      "objective": "OBJ-01",
      "eyebrow": "Who can do what",
      "title": "Open each role to see its support path",
      "prompt": "Select a role to reveal what it can do in the Support Center.",
      "hotspots": [
        {
          "label": "Designated Support Contact",
          "detail": "Ticket creation is available to Designated Support Contacts as defined in the Glean Support Agreement. To be set up as one, contact the Glean account team. To create a ticket, open the support widget, select Create a ticket, describe the issue, select a priority, and submit."
        },
        {
          "label": "Any other signed-in user",
          "detail": "Conversations are open to all users. Open the support widget and select Send us a message. The assistant triages the request. If it cannot resolve the issue, it guides you toward a ticket. You can also ask your Glean administrator to submit a ticket."
        },
        {
          "label": "A user with evidence to share",
          "detail": "Users who are not entitled to tickets can be cc'd on a conversation or ticket with a Designated Support Contact. Use this when an end user must supply screenshots or reproduction steps."
        },
        {
          "label": "Email to help@glean.com",
          "detail": "Email reaches Glean Support too. The AI assistant triages first and hands off to a human agent for Designated Support Contacts. Email is not the SLA-tracked path; the next screens explain why."
        }
      ],
      "claims": [
        "C-209",
        "C-213",
        "C-205",
        "C-206",
        "C-210",
        "C-223",
        "C-222"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A9",
      "objective": "OBJ-01",
      "eyebrow": "Sort it",
      "title": "Which path fits the request?",
      "prompt": "Place each request on the path built for it.",
      "type": "sort",
      "categories": [
        "Self-service",
        "Conversation",
        "Ticket",
        "Feedback and Ideas"
      ],
      "pairs": [
        {
          "item": "Search is slow for everyone this morning. You want to know if Glean already knows.",
          "category": "Self-service",
          "why": "Check the Glean status page for known issues before you open a ticket."
        },
        {
          "item": "An admin who is not a Designated Support Contact has a how-to question about a setting.",
          "category": "Conversation",
          "why": "Conversations are open to all users and are the best starting point for most requests."
        },
        {
          "item": "A Designated Support Contact confirms a connector sync bug that affects many users.",
          "category": "Ticket",
          "why": "Tickets are best for bug reports and outages that need follow-up and a documented resolution."
        },
        {
          "item": "A customer wants a new capability that the product does not have today.",
          "category": "Feedback and Ideas",
          "why": "Submit feature requests and product feedback on the Feedback and Ideas board in Gleaniverse."
        }
      ],
      "takeaway": "Not sure which to use? Start with a conversation. Support can convert it into a ticket.",
      "claims": [
        "C-203",
        "C-205",
        "C-207",
        "C-224",
        "C-208"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A8",
      "objective": "OBJ-02",
      "eyebrow": "Worked example",
      "title": "Build a ticket support can act on",
      "body": "A complete ticket helps support resolve the issue faster. Here is a role-based example: members of one department no longer see results from a connected wiki.",
      "steps": [
        {
          "title": "Issue description",
          "body": "Members of the finance group stopped seeing wiki pages in search. Steps: sign in as a finance user, search for a known page title."
        },
        {
          "title": "Error messages",
          "body": "Paste the exact text or error code shown. If no error appears, say so."
        },
        {
          "title": "Timing",
          "body": "First seen at a specific date and time, with the timezone, so support can match system logs."
        },
        {
          "title": "User impact",
          "body": "State if one account or multiple users are affected."
        },
        {
          "title": "Document reference",
          "body": "Add the URL of one page that should appear but does not."
        },
        {
          "title": "Visual evidence",
          "body": "Attach a screenshot or recording of the search and its results."
        }
      ],
      "asset": {
        "src": "assets/svg/ops-107-a03.svg",
        "alt": "Six cards listing the details a complete Glean support ticket includes.",
        "caption": "Complete tickets resolve faster."
      },
      "claims": [
        "C-211"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "Priority is a business decision",
      "title": "Set priority from business impact, not frustration",
      "body": "The customer must assess business impact and urgency when selecting a priority. Over-escalating priority can slow resolution for genuinely critical issues.",
      "table": {
        "caption": "Priority levels and examples from the Glean Support Center and Customer Support SLA",
        "head": [
          "Priority",
          "Use it when",
          "Example"
        ],
        "rows": [
          [
            "Urgent",
            "Operations stop, business functionality is severely affected, or there is a security incident",
            "The Service is unavailable to all users"
          ],
          [
            "High",
            "The issue seriously affects the ability to use the product",
            "The Service is unavailable to a subset of users"
          ],
          [
            "Normal",
            "Some operations are affected, but work continues",
            "Results are incomplete from a known connected source"
          ],
          [
            "Low",
            "Non-critical questions and requests",
            "General product inquiries and feature requests"
          ]
        ]
      },
      "claims": [
        "C-219",
        "C-212",
        "C-220"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A12",
      "objective": "OBJ-02",
      "eyebrow": "Checkpoint",
      "title": "A new release broke two existing connectors",
      "type": "choice",
      "prompt": "After a new Service release, two existing connected applications stopped returning results. Most users can still search other sources. Which priority fits?",
      "options": [
        {
          "id": "o2",
          "text": "Urgent.",
          "feedback": "Not this one. Urgent is for a complete outage, such as the Service unavailable to all users, or a security incident."
        },
        {
          "id": "o3",
          "text": "Low.",
          "feedback": "Not this one. Low is for non-critical questions. Broken connected applications affect how people use the product."
        },
        {
          "id": "o1",
          "text": "High.",
          "correct": true,
          "feedback": "Correct. The SLA lists a new Service release that materially harms existing connected applications as a High example."
        }
      ],
      "takeaway": "Match the priority to the documented definition. Accurate priority helps support triage every customer.",
      "claims": [
        "C-220",
        "C-212"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Why the portal matters",
      "title": "Only portal incidents start the SLA clock",
      "body": "Only incidents submitted through the Glean support portal are eligible for SLA response times. Response times cannot be tracked accurately outside the portal. The customer's Order Form sets the support tier.",
      "table": {
        "caption": "Initial response times from the Glean Customer Support SLA (v6Mar2026)",
        "head": [
          "Priority",
          "Standard",
          "Premium"
        ],
        "rows": [
          [
            "Urgent",
            "1 business day",
            "1 hour"
          ],
          [
            "High",
            "2 business days",
            "4 business hours"
          ],
          [
            "Normal",
            "1 business week",
            "1 business day"
          ],
          [
            "Low",
            "1 business week",
            "2 business days"
          ]
        ]
      },
      "footnote": "Standard Support provides 24x5 coverage and 1 to 4 Designated Support Contacts. Premium provides 24x7 coverage for Urgent incidents only and 1 to 10 Designated Support Contacts. These are Glean's commitments to the customer. Never present them as a partner commitment.",
      "claims": [
        "C-216",
        "C-217",
        "C-218"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "A6",
      "objective": "OBJ-03",
      "eyebrow": "Decision",
      "title": "The outage from Monday: what now?",
      "type": "choice",
      "prompt": "Back to the cold open. Search is unavailable to all users. The customer admin is a Designated Support Contact. What do you advise?",
      "options": [
        {
          "id": "o2",
          "text": "Post in the shared chat channel and email a known contact, then open a ticket later if nobody answers.",
          "feedback": "Not this one. Response times cannot be tracked accurately outside the support portal, so the clock does not start."
        },
        {
          "id": "o1",
          "text": "Sign in to Gleaniverse, open the support widget, create an Urgent ticket with all six details, and add any new evidence to that same ticket.",
          "correct": true,
          "feedback": "Correct. Only portal incidents are SLA-eligible. A complete Urgent ticket for a full outage starts the tracked response, and the ticket stays the system of record."
        },
        {
          "id": "o3",
          "text": "Open a High ticket now and a second Urgent ticket in an hour to make sure it gets seen.",
          "feedback": "Not this one. The outage is Urgent by definition. Duplicate tickets and incorrect priority slow triage for everyone."
        }
      ],
      "takeaway": "Escalate inside the portal: correct priority, complete evidence, one ticket.",
      "footnote": "Studio guidance: if a tracked ticket needs more attention, update that ticket and confirm its priority first. For partner-specific escalation paths, confirm your path with the Glean partner team.",
      "claims": [
        "C-216",
        "C-220",
        "C-211",
        "C-212",
        "C-213"
      ]
    },
    {
      "id": "SCR-12",
      "archetype": "A12",
      "objective": "OBJ-03",
      "eyebrow": "Checkpoint",
      "title": "Where is the company's ticket history?",
      "type": "choice",
      "prompt": "A Designated Support Contact wants to see every ticket their company has opened. What should they do?",
      "options": [
        {
          "id": "o1",
          "text": "Open the support widget from Gleaniverse and select the Go to customer portal banner.",
          "correct": true,
          "feedback": "Correct. The banner appears in the Messages and Tickets sections. The portal recognizes identity only through the authenticated Gleaniverse path."
        },
        {
          "id": "o2",
          "text": "Bookmark ticket.glean.com and go there directly.",
          "feedback": "Not this one. The portal will not recognize the user's identity unless they arrive through the support widget."
        },
        {
          "id": "o3",
          "text": "Email help@glean.com and ask for a ticket export.",
          "feedback": "Not this one. Company-wide history is available directly in the customer portal."
        }
      ],
      "takeaway": "The Tickets section appears only after the first ticket is created.",
      "claims": [
        "C-215",
        "C-214"
      ]
    },
    {
      "id": "SCR-13",
      "archetype": "quiz",
      "objective": "OBJ-01",
      "eyebrow": "Prove it",
      "title": "Support Center check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "Who can create a Glean support ticket directly?",
          "options": [
            {
              "id": "b",
              "text": "Any user with a Gleaniverse account.",
              "feedback": "No. All users can start a conversation, but ticket creation is for Designated Support Contacts."
            },
            {
              "id": "a",
              "text": "Designated Support Contacts, as defined in the Glean Support Agreement.",
              "correct": true,
              "feedback": "Correct. Other users start a conversation or ask their Glean administrator to submit a ticket."
            },
            {
              "id": "c",
              "text": "Anyone who emails help@glean.com.",
              "feedback": "No. Email is triaged by the AI assistant and handed to a human agent for Designated Support Contacts."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-01",
          "stem": "A user who is not a Designated Support Contact finds a bug they can reproduce. What is the documented next step?",
          "options": [
            {
              "id": "b",
              "text": "Post the full error log in the community forum.",
              "feedback": "No. Instance bugs go to support, and guidelines say to keep confidential data out of the community."
            },
            {
              "id": "c",
              "text": "Wait for the next monthly product update.",
              "feedback": "No. A bug needs a support path, not a product update session."
            },
            {
              "id": "a",
              "text": "Start a conversation, or ask their Glean administrator to submit a ticket.",
              "correct": true,
              "feedback": "Correct. If the conversation needs escalation, support can convert it into a ticket."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "Which ticket detail lets support correlate the issue with system logs?",
          "options": [
            {
              "id": "a",
              "text": "The date and time the issue occurred, with the timezone.",
              "correct": true,
              "feedback": "Correct. Timing with a timezone lets support match the event to logs."
            },
            {
              "id": "b",
              "text": "The name of the customer's executive sponsor.",
              "feedback": "No. That is not one of the documented ticket details."
            },
            {
              "id": "c",
              "text": "A note asking support to raise the priority.",
              "feedback": "No. Priority is chosen from business impact; it does not help log correlation."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "The Service is unavailable to a subset of users. Which priority does the SLA example match?",
          "options": [
            {
              "id": "b",
              "text": "Urgent priority, because any outage is critical.",
              "feedback": "No. Urgent examples include the Service unavailable to all users or a security incident."
            },
            {
              "id": "c",
              "text": "Low priority, because most users can still work.",
              "feedback": "No. Low is for non-critical issues that do not affect operations."
            },
            {
              "id": "a",
              "text": "High priority, because only some users lose the Service.",
              "correct": true,
              "feedback": "Correct. Unavailability for a subset of users is a documented High example."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "Which incidents are eligible for SLA response times?",
          "options": [
            {
              "id": "b",
              "text": "Any incident raised by email, chat, or phone.",
              "feedback": "No. Other channels may exist for collaboration, but they are not SLA-tracked."
            },
            {
              "id": "a",
              "text": "Only incidents submitted through the Glean support portal.",
              "correct": true,
              "feedback": "Correct. Response times cannot be tracked accurately outside the portal."
            },
            {
              "id": "c",
              "text": "Only incidents raised by the partner.",
              "feedback": "No. SLA eligibility depends on the portal, not on who the requester works for."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-03",
          "stem": "A Designated Support Contact cannot see the Tickets section in the support widget. What is the most likely reason?",
          "options": [
            {
              "id": "a",
              "text": "They have not created a ticket yet. The section appears after the first ticket.",
              "correct": true,
              "feedback": "Correct. If it still does not appear, ticket creation may not be available for the account."
            },
            {
              "id": "b",
              "text": "They must go directly to ticket.glean.com.",
              "feedback": "No. Going directly to ticket.glean.com does not recognize the user's identity."
            },
            {
              "id": "c",
              "text": "Tickets are only visible to Glean employees.",
              "feedback": "No. Designated Support Contacts can see their own and their company's tickets."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-14",
      "archetype": "A14",
      "objective": "OBJ-03",
      "eyebrow": "Carry this with you",
      "title": "Conversation first. Ticket when it needs ownership.",
      "body": "Designated Support Contacts should know the deployment and configuration, have admin access to connected applications, prioritize accurately, and use self-service first. Glean Support also runs a monthly live troubleshooting session on the second Thursday of each month. Next: OPS-108 shows when the community is the better place to ask.",
      "badge": "Glean Support Center: complete",
      "signature": true,
      "claims": [
        "C-221",
        "C-225"
      ]
    }
  ]
};
