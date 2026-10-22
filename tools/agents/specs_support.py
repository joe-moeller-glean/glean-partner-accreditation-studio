#!/usr/bin/env python3
"""Module specs: OPS-107 Glean Support Center & Escalations, OPS-108 Using Gleaniverse Community.

Copy is authored against tools/agents/sources_support.py. Every factual sentence
maps to a claim_id. Scenarios are role-based; no customer or partner names.
Where a screen gives studio guidance rather than documented Glean policy, the
screen says so in a visible footnote.
"""

# ---------------------------------------------------------------------------
OPS_107 = {
    "id": "OPS-107",
    "title": "Glean Support Center & Escalations",
    "level": "100",
    "hours": 0.6,
    "wave": "Wave 2",
    "path": "Operations & Support / Admin & Support Path",
    "audience": ["Partner solutions engineers", "Delivery leads", "Support leads", "Customer admins"],
    "prereqs": [],
    "assessment_type": "Quiz",
    "quiz_claims": ["C-209", "C-210", "C-222", "C-211", "C-220", "C-212", "C-216", "C-214", "C-215", "C-305", "C-307"],
    "objectives": [
        {"id": "OBJ-01", "text": "Choose the correct Glean support path for a request: self-service, conversation, ticket, or feedback."},
        {"id": "OBJ-02", "text": "Build a complete ticket and assign the correct priority from business impact."},
        {"id": "OBJ-03", "text": "Escalate inside the Glean support portal so the incident stays tracked and SLA-eligible."},
    ],
    "assets": [
        {
            "asset_id": "OPS-107-A01", "kind": "flow",
            "title": "The Glean support path",
            "desc": "Four steps from top to bottom. One: sign in to Gleaniverse. Two: self-serve with Glean Docs, Ask Query, and the status page. Three: start a conversation in the support widget. Four: a tracked ticket, opened by a Designated Support Contact or converted by support.",
            "alt": "Flow diagram of the Glean support path: sign in to Gleaniverse, self-serve, start a conversation, then a tracked ticket.",
            "caption": "Start light. Move to a ticket when the issue needs formal tracking.",
            "claim_ids": ["C-201", "C-203", "C-205", "C-207", "C-208"],
            "args": {
                "steps": [
                    ("Sign in to Gleaniverse", "Legacy support logins were not migrated"),
                    ("Self-serve first", "Glean Docs, Ask Query, and the Glean status page"),
                    ("Start a conversation", "Support widget > Send us a message. Open to all users"),
                    ("Tracked ticket", "Opened by a DSC, or converted from a conversation"),
                ]
            },
        },
        {
            "asset_id": "OPS-107-A02", "kind": "compare",
            "title": "Conversation or ticket?",
            "desc": "Two-column comparison. Conversation: available to all users, best for questions and quick help, started with Send us a message. Ticket: Designated Support Contacts only, best for bugs, outages, and documented resolution, started with Create a ticket.",
            "alt": "Comparison table of support conversations and support tickets by who can use them, what they are for, and how to start them.",
            "caption": "Not sure? Start a conversation. Support can convert it into a ticket.",
            "claim_ids": ["C-205", "C-207", "C-208", "C-209"],
            "args": {
                "left": "Conversation",
                "right": "Ticket",
                "rows": [
                    ("Who: all signed-in users", "Who: Designated Support Contacts"),
                    ("For: questions and quick help", "For: bugs, outages, documented resolution"),
                    ("Start: Send us a message", "Start: Create a ticket"),
                    ("Needs escalation? Support converts it", "Formal tracking, follow-up, escalation"),
                ],
            },
        },
        {
            "asset_id": "OPS-107-A03", "kind": "cards",
            "title": "Six details every ticket needs",
            "desc": "Six cards: issue description with reproduction steps; exact error messages; date, time, and timezone; user impact; document URL; screenshots or recordings.",
            "alt": "Six cards listing the details a complete Glean support ticket includes.",
            "caption": "Complete tickets resolve faster.",
            "claim_ids": ["C-211"],
            "args": {
                "cols": 3,
                "items": [
                    ("Issue description", "What you tried to do and the steps to reproduce it"),
                    ("Error messages", "The exact text or error code shown"),
                    ("Timing", "Date, time, and timezone, to match system logs"),
                    ("User impact", "One account, or multiple users"),
                    ("Document reference", "The URL for missing results or permission issues"),
                    ("Visual evidence", "Screenshots or recordings of the issue"),
                ],
            },
        },
    ],
    "screens": [
        {
            "id": "SCR-01", "archetype": "A1", "objective": "OBJ-03", "eyebrow": "Cold open",
            "title": "Search is down. Where do you report it?",
            "body": "It is Monday morning. A customer admin tells you that Glean search is unavailable to every user. Their first idea is to post in a shared chat channel and email a contact they know. Before you agree, ask one question: which channel actually starts a tracked, SLA-eligible incident?",
            "claims": [],
        },
        {
            "id": "SCR-02", "archetype": "A2", "objective": "OBJ-01", "eyebrow": "What you will be able to do",
            "title": "By the end of this module",
            "bullets": [
                "Choose between self-service, a conversation, a ticket, and the feedback board.",
                "Build a ticket with the six details support needs, and set priority from business impact.",
                "Keep an escalation inside the support portal so it stays tracked.",
            ],
            "claims": [],
        },
        {
            "id": "SCR-03", "archetype": "A3", "objective": "OBJ-01", "eyebrow": "The support path",
            "title": "Everything starts in Gleaniverse",
            "body": "You must sign in to Gleaniverse to reach the Glean Support Center. Logins from the legacy support portal were not migrated. After you sign in, there are two entry points: Ask Query in the top navigation, and the support widget in the bottom-right corner. Before you open a ticket, search Glean Docs, ask Query, and check the Glean status page for known issues.",
            "asset": "OPS-107-A01",
            "claims": ["C-201", "C-202", "C-203", "C-204"],
        },
        {
            "id": "SCR-04", "archetype": "A3", "objective": "OBJ-01", "eyebrow": "Two ways to get help",
            "title": "Conversations and tickets do different jobs",
            "body": "Conversations are available to all users and are the best starting point for most requests. Tickets formally track issues that need follow-up or escalation, such as bug reports and outages. If a conversation needs escalation, support can convert it into a ticket.",
            "asset": "OPS-107-A02",
            "claims": ["C-205", "C-207", "C-208"],
        },
        {
            "id": "SCR-05", "archetype": "A4", "objective": "OBJ-01", "eyebrow": "Who can do what",
            "title": "Open each role to see its support path",
            "prompt": "Select a role to reveal what it can do in the Support Center.",
            "hotspots": [
                {"label": "Designated Support Contact",
                 "detail": "Ticket creation is available to Designated Support Contacts as defined in the Glean Support Agreement. To be set up as one, contact the Glean account team. To create a ticket, open the support widget, select Create a ticket, describe the issue, select a priority, and submit."},
                {"label": "Any other signed-in user",
                 "detail": "Conversations are open to all users. Open the support widget and select Send us a message. The assistant triages the request. If it cannot resolve the issue, it guides you toward a ticket. You can also ask your Glean administrator to submit a ticket."},
                {"label": "A user with evidence to share",
                 "detail": "Users who are not entitled to tickets can be cc'd on a conversation or ticket with a Designated Support Contact. Use this when an end user must supply screenshots or reproduction steps."},
                {"label": "Email to help@glean.com",
                 "detail": "Email reaches Glean Support too. The AI assistant triages first and hands off to a human agent for Designated Support Contacts. Email is not the SLA-tracked path; the next screens explain why."},
            ],
            "claims": ["C-209", "C-213", "C-205", "C-206", "C-210", "C-223", "C-222"],
        },
        {
            "id": "SCR-06", "archetype": "A9", "objective": "OBJ-01", "eyebrow": "Sort it",
            "title": "Which path fits the request?",
            "prompt": "Place each request on the path built for it.",
            "type": "sort",
            "categories": ["Self-service", "Conversation", "Ticket", "Feedback and Ideas"],
            "pairs": [
                {"item": "Search is slow for everyone this morning. You want to know if Glean already knows.",
                 "category": "Self-service",
                 "why": "Check the Glean status page for known issues before you open a ticket."},
                {"item": "An admin who is not a Designated Support Contact has a how-to question about a setting.",
                 "category": "Conversation",
                 "why": "Conversations are open to all users and are the best starting point for most requests."},
                {"item": "A Designated Support Contact confirms a connector sync bug that affects many users.",
                 "category": "Ticket",
                 "why": "Tickets are best for bug reports and outages that need follow-up and a documented resolution."},
                {"item": "A customer wants a new capability that the product does not have today.",
                 "category": "Feedback and Ideas",
                 "why": "Submit feature requests and product feedback on the Feedback and Ideas board in Gleaniverse."},
            ],
            "takeaway": "Not sure which to use? Start with a conversation. Support can convert it into a ticket.",
            "claims": ["C-203", "C-205", "C-207", "C-224", "C-208"],
        },
        {
            "id": "SCR-07", "archetype": "A8", "objective": "OBJ-02", "eyebrow": "Worked example",
            "title": "Build a ticket support can act on",
            "body": "A complete ticket helps support resolve the issue faster. Here is a role-based example: members of one department no longer see results from a connected wiki.",
            "steps": [
                {"title": "Issue description", "body": "Members of the finance group stopped seeing wiki pages in search. Steps: sign in as a finance user, search for a known page title."},
                {"title": "Error messages", "body": "Paste the exact text or error code shown. If no error appears, say so."},
                {"title": "Timing", "body": "First seen at a specific date and time, with the timezone, so support can match system logs."},
                {"title": "User impact", "body": "State if one account or multiple users are affected."},
                {"title": "Document reference", "body": "Add the URL of one page that should appear but does not."},
                {"title": "Visual evidence", "body": "Attach a screenshot or recording of the search and its results."},
            ],
            "asset": "OPS-107-A03",
            "claims": ["C-211"],
        },
        {
            "id": "SCR-08", "archetype": "A3", "objective": "OBJ-02", "eyebrow": "Priority is a business decision",
            "title": "Set priority from business impact, not frustration",
            "body": "The customer must assess business impact and urgency when selecting a priority. Over-escalating priority can slow resolution for genuinely critical issues.",
            "table": {
                "caption": "Priority levels and examples from the Glean Support Center and Customer Support SLA",
                "head": ["Priority", "Use it when", "Example"],
                "rows": [
                    ["Urgent", "Operations stop, business functionality is severely affected, or there is a security incident", "The Service is unavailable to all users"],
                    ["High", "The issue seriously affects the ability to use the product", "The Service is unavailable to a subset of users"],
                    ["Normal", "Some operations are affected, but work continues", "Results are incomplete from a known connected source"],
                    ["Low", "Non-critical questions and requests", "General product inquiries and feature requests"],
                ],
            },
            "claims": ["C-219", "C-212", "C-220"],
        },
        {
            "id": "SCR-09", "archetype": "A12", "objective": "OBJ-02", "eyebrow": "Checkpoint",
            "title": "A new release broke two existing connectors",
            "type": "choice",
            "prompt": "After a new Service release, two existing connected applications stopped returning results. Most users can still search other sources. Which priority fits?",
            "options": [
                {"id": "o1", "text": "High.", "correct": True,
                 "feedback": "Correct. The SLA lists a new Service release that materially harms existing connected applications as a High example."},
                {"id": "o2", "text": "Urgent.",
                 "feedback": "Not this one. Urgent is for a complete outage, such as the Service unavailable to all users, or a security incident."},
                {"id": "o3", "text": "Low.",
                 "feedback": "Not this one. Low is for non-critical questions. Broken connected applications affect how people use the product."},
            ],
            "takeaway": "Match the priority to the documented definition. Accurate priority helps support triage every customer.",
            "claims": ["C-220", "C-212"],
        },
        {
            "id": "SCR-10", "archetype": "A3", "objective": "OBJ-03", "eyebrow": "Why the portal matters",
            "title": "Only portal incidents start the SLA clock",
            "body": "Only incidents submitted through the Glean support portal are eligible for SLA response times. Response times cannot be tracked accurately outside the portal. The customer's Order Form sets the support tier.",
            "table": {
                "caption": "Initial response times from the Glean Customer Support SLA (v6Mar2026)",
                "head": ["Priority", "Standard", "Premium"],
                "rows": [
                    ["Urgent", "1 business day", "1 hour"],
                    ["High", "2 business days", "4 business hours"],
                    ["Normal", "1 business week", "1 business day"],
                    ["Low", "1 business week", "2 business days"],
                ],
            },
            "footnote": "Standard Support provides 24x5 coverage and 1 to 4 Designated Support Contacts. Premium provides 24x7 coverage for Urgent incidents only and 1 to 10 Designated Support Contacts. These are Glean's commitments to the customer. Never present them as a partner commitment.",
            "claims": ["C-216", "C-217", "C-218"],
        },
        {
            "id": "SCR-11", "archetype": "A6", "objective": "OBJ-03", "eyebrow": "Decision",
            "title": "The outage from Monday: what now?",
            "type": "choice",
            "prompt": "Back to the cold open. Search is unavailable to all users. The customer admin is a Designated Support Contact. What do you advise?",
            "options": [
                {"id": "o1", "text": "Sign in to Gleaniverse, open the support widget, create an Urgent ticket with all six details, and add any new evidence to that same ticket.",
                 "correct": True,
                 "feedback": "Correct. Only portal incidents are SLA-eligible. A complete Urgent ticket for a full outage starts the tracked response, and the ticket stays the system of record."},
                {"id": "o2", "text": "Post in the shared chat channel and email a known contact, then open a ticket later if nobody answers.",
                 "feedback": "Not this one. Response times cannot be tracked accurately outside the support portal, so the clock does not start."},
                {"id": "o3", "text": "Open a High ticket now and a second Urgent ticket in an hour to make sure it gets seen.",
                 "feedback": "Not this one. The outage is Urgent by definition. Duplicate tickets and incorrect priority slow triage for everyone."},
            ],
            "takeaway": "Escalate inside the portal: correct priority, complete evidence, one ticket.",
            "footnote": "Studio guidance: if a tracked ticket needs more attention, update that ticket and confirm its priority first. For partner-specific escalation paths, confirm your path with the Glean partner team.",
            "claims": ["C-216", "C-220", "C-211", "C-212", "C-213"],
        },
        {
            "id": "SCR-12", "archetype": "A12", "objective": "OBJ-03", "eyebrow": "Checkpoint",
            "title": "Where is the company's ticket history?",
            "type": "choice",
            "prompt": "A Designated Support Contact wants to see every ticket their company has opened. What should they do?",
            "options": [
                {"id": "o1", "text": "Open the support widget from Gleaniverse and select the Go to customer portal banner.",
                 "correct": True,
                 "feedback": "Correct. The banner appears in the Messages and Tickets sections. The portal recognizes identity only through the authenticated Gleaniverse path."},
                {"id": "o2", "text": "Bookmark ticket.glean.com and go there directly.",
                 "feedback": "Not this one. The portal will not recognize the user's identity unless they arrive through the support widget."},
                {"id": "o3", "text": "Email help@glean.com and ask for a ticket export.",
                 "feedback": "Not this one. Company-wide history is available directly in the customer portal."},
            ],
            "takeaway": "The Tickets section appears only after the first ticket is created.",
            "claims": ["C-215", "C-214"],
        },
        {
            "id": "SCR-13", "archetype": "quiz", "objective": "OBJ-01", "eyebrow": "Prove it",
            "title": "Support Center check", "type": "quiz",
        },
        {
            "id": "SCR-14", "archetype": "A14", "objective": "OBJ-03", "eyebrow": "Carry this with you",
            "title": "Conversation first. Ticket when it needs ownership.",
            "body": "Designated Support Contacts should know the deployment and configuration, have admin access to connected applications, prioritize accurately, and use self-service first. Glean Support also runs a monthly live troubleshooting session on the second Thursday of each month. Next: OPS-108 shows when the community is the better place to ask.",
            "badge": "Glean Support Center: complete",
            "signature": True,
            "claims": ["C-221", "C-225"],
        },
    ],
    "quiz": [
        {"id": "Q-01", "objective_id": "OBJ-01",
         "stem": "Who can create a Glean support ticket directly?",
         "options": [
             {"id": "a", "text": "Designated Support Contacts, as defined in the Glean Support Agreement.", "correct": True,
              "feedback": "Correct. Other users start a conversation or ask their Glean administrator to submit a ticket."},
             {"id": "b", "text": "Any user with a Gleaniverse account.",
              "feedback": "No. All users can start a conversation, but ticket creation is for Designated Support Contacts."},
             {"id": "c", "text": "Anyone who emails help@glean.com.",
              "feedback": "No. Email is triaged by the AI assistant and handed to a human agent for Designated Support Contacts."},
         ]},
        {"id": "Q-02", "objective_id": "OBJ-01",
         "stem": "A user who is not a Designated Support Contact finds a bug they can reproduce. What is the documented next step?",
         "options": [
             {"id": "a", "text": "Start a conversation, or ask their Glean administrator to submit a ticket.", "correct": True,
              "feedback": "Correct. If the conversation needs escalation, support can convert it into a ticket."},
             {"id": "b", "text": "Post the full error log in the community forum.",
              "feedback": "No. Instance bugs go to support, and guidelines say to keep confidential data out of the community."},
             {"id": "c", "text": "Wait for the next monthly product update.",
              "feedback": "No. A bug needs a support path, not a product update session."},
         ]},
        {"id": "Q-03", "objective_id": "OBJ-02",
         "stem": "Which ticket detail lets support correlate the issue with system logs?",
         "options": [
             {"id": "a", "text": "The date and time the issue occurred, with the timezone.", "correct": True,
              "feedback": "Correct. Timing with a timezone lets support match the event to logs."},
             {"id": "b", "text": "The name of the customer's executive sponsor.",
              "feedback": "No. That is not one of the documented ticket details."},
             {"id": "c", "text": "A note asking support to raise the priority.",
              "feedback": "No. Priority is chosen from business impact; it does not help log correlation."},
         ]},
        {"id": "Q-04", "objective_id": "OBJ-02",
         "stem": "The Service is unavailable to a subset of users. Which priority does the SLA example match?",
         "options": [
             {"id": "a", "text": "High priority, because only some users lose the Service.", "correct": True,
              "feedback": "Correct. Unavailability for a subset of users is a documented High example."},
             {"id": "b", "text": "Urgent priority, because any outage is critical.",
              "feedback": "No. Urgent examples include the Service unavailable to all users or a security incident."},
             {"id": "c", "text": "Low priority, because most users can still work.",
              "feedback": "No. Low is for non-critical issues that do not affect operations."},
         ]},
        {"id": "Q-05", "objective_id": "OBJ-03",
         "stem": "Which incidents are eligible for SLA response times?",
         "options": [
             {"id": "a", "text": "Only incidents submitted through the Glean support portal.", "correct": True,
              "feedback": "Correct. Response times cannot be tracked accurately outside the portal."},
             {"id": "b", "text": "Any incident raised by email, chat, or phone.",
              "feedback": "No. Other channels may exist for collaboration, but they are not SLA-tracked."},
             {"id": "c", "text": "Only incidents raised by the partner.",
              "feedback": "No. SLA eligibility depends on the portal, not on who the requester works for."},
         ]},
        {"id": "Q-06", "objective_id": "OBJ-03",
         "stem": "A Designated Support Contact cannot see the Tickets section in the support widget. What is the most likely reason?",
         "options": [
             {"id": "a", "text": "They have not created a ticket yet. The section appears after the first ticket.", "correct": True,
              "feedback": "Correct. If it still does not appear, ticket creation may not be available for the account."},
             {"id": "b", "text": "They must go directly to ticket.glean.com.",
              "feedback": "No. Going directly to ticket.glean.com does not recognize the user's identity."},
             {"id": "c", "text": "Tickets are only visible to Glean employees.",
              "feedback": "No. Designated Support Contacts can see their own and their company's tickets."},
         ]},
    ],
}

# ---------------------------------------------------------------------------
OPS_108 = {
    "id": "OPS-108",
    "title": "Using Gleaniverse Community",
    "level": "100",
    "hours": 0.4,
    "wave": "Wave 2",
    "path": "Operations & Support / Admin & Support Path",
    "audience": ["Partner solutions engineers", "Delivery leads", "Customer admins"],
    "prereqs": ["OPS-107"],
    "assessment_type": "Quiz",
    "quiz_claims": ["C-225", "C-304", "C-305", "C-224", "C-212", "C-307", "C-306", "C-310", "C-315"],
    "objectives": [
        {"id": "OBJ-01", "text": "Find the right Gleaniverse area for a learning or networking goal."},
        {"id": "OBJ-02", "text": "Route a request to the community, a support ticket, or the Feedback and Ideas board."},
        {"id": "OBJ-03", "text": "Write a community post that follows the Gleaniverse Community Guidelines."},
    ],
    "assets": [
        {
            "asset_id": "OPS-108-A01", "kind": "taxonomy",
            "title": "Where things live in Gleaniverse",
            "desc": "Six areas: Forum for discussions; Groups for peers; Events for live sessions; Academy for courses; Resources for guides and guidelines; Support Center for conversations and tickets.",
            "alt": "Grid of six Gleaniverse areas and what each one is for.",
            "caption": "One sign-in reaches the community and the Support Center.",
            "claim_ids": ["C-301", "C-302", "C-316"],
            "args": {
                "groups": [
                    ("Forum", "Start a discussion, ask questions, exchange ideas"),
                    ("Groups", "Connect with like-minded peers"),
                    ("Events", "Live sessions, webinars, and replays"),
                    ("Academy", "Courses to master new topics"),
                    ("Resources", "Guides, including the community guidelines"),
                    ("Support Center", "Conversations and tickets with Glean Support"),
                ]
            },
        },
        {
            "asset_id": "OPS-108-A02", "kind": "compare",
            "title": "Community or support ticket?",
            "desc": "Two-column comparison. Community: questions, best practices, feature requests, shared answers. Support ticket: bugs and errors in a specific Glean instance, private evidence, tracked resolution.",
            "alt": "Comparison of what belongs in the Gleaniverse community and what belongs in a Glean support ticket.",
            "caption": "If the answer can help many customers, share it in the community.",
            "claim_ids": ["C-305", "C-314", "C-307"],
            "args": {
                "left": "Community",
                "right": "Support ticket",
                "rows": [
                    ("Questions and best practices", "Bugs and errors in your Glean instance"),
                    ("Feature requests (Feedback and Ideas)", "Outages and tracked resolution"),
                    ("Answers that help many customers", "Private logs, URLs, and user details"),
                ],
            },
        },
    ],
    "screens": [
        {
            "id": "SCR-01", "archetype": "A1", "objective": "OBJ-02", "eyebrow": "Cold open",
            "title": "A good question in the wrong place",
            "body": "A customer admin asks you how other companies roll out agents to their teams. They plan to open a support ticket for it. The question is real, but a ticket is built to track one instance issue to a resolution. There is a place where many peers, and Glean staff, can answer it.",
            "claims": [],
        },
        {
            "id": "SCR-02", "archetype": "A2", "objective": "OBJ-01", "eyebrow": "What you will be able to do",
            "title": "By the end of this module",
            "bullets": [
                "Find the Gleaniverse area that fits a goal.",
                "Route a request to the community, a ticket, or Feedback and Ideas.",
                "Write a post that follows the community guidelines.",
            ],
            "claims": [],
        },
        {
            "id": "SCR-03", "archetype": "A3", "objective": "OBJ-01", "eyebrow": "The community",
            "title": "Gleaniverse is Glean's customer community",
            "body": "Gleaniverse is Glean's primary customer community: a secure space to ask product questions, share feedback, and discover best practices. Register with a work email so you receive the correct role and permissions. The home page offers three starting points: Start a Discussion, Join a Group, and Explore Academy.",
            "asset": "OPS-108-A01",
            "claims": ["C-303", "C-304", "C-302", "C-301"],
        },
        {
            "id": "SCR-04", "archetype": "A4", "objective": "OBJ-01", "eyebrow": "Tour",
            "title": "Open each area to see when to use it",
            "prompt": "Select an area to reveal what it is for.",
            "hotspots": [
                {"label": "Forum",
                 "detail": "Start a discussion to exchange ideas and ask questions. Search first; your question may already have an answer."},
                {"label": "Events",
                 "detail": "Glean Support runs a monthly live troubleshooting session on the second Thursday of each month. The Glean Product Team hosts monthly product updates on the fourth Thursday. Replays of earlier events are available on demand."},
                {"label": "Academy",
                 "detail": "Glean Academy offers courses to master new topics."},
                {"label": "Feedback and Ideas",
                 "detail": "Submit feature requests and product feedback on the Feedback and Ideas board."},
                {"label": "Admin Hub",
                 "detail": "The Admin Hub is a restricted space for customer administrators."},
            ],
            "claims": ["C-306", "C-225", "C-312", "C-313", "C-316", "C-224", "C-315"],
        },
        {
            "id": "SCR-05", "archetype": "A3", "objective": "OBJ-02", "eyebrow": "The routing rule",
            "title": "Community for shared answers. Tickets for your instance.",
            "body": "For bugs and errors in a Glean instance, file a support ticket. For questions, best practices, or feature requests, use the community. Community answers let Support help multiple customers at once.",
            "asset": "OPS-108-A02",
            "claims": ["C-305", "C-314"],
        },
        {
            "id": "SCR-06", "archetype": "A9", "objective": "OBJ-02", "eyebrow": "Sort it",
            "title": "Where does each request belong?",
            "prompt": "Place each request where it will get the right answer.",
            "type": "sort",
            "categories": ["Forum", "Support ticket", "Feedback and Ideas"],
            "pairs": [
                {"item": "How do other admins structure an agent rollout for new teams?",
                 "category": "Forum",
                 "why": "Questions and best practices belong in the community, where many peers can answer."},
                {"item": "Our connector shows a sync error for every user since this morning.",
                 "category": "Support ticket",
                 "why": "Bugs and errors in a Glean instance go to a support ticket."},
                {"item": "We would like a new setting that the product does not offer today.",
                 "category": "Feedback and Ideas",
                 "why": "Feature requests and product feedback go to the Feedback and Ideas board."},
            ],
            "takeaway": "Route by the kind of answer you need: shared knowledge, instance resolution, or product input.",
            "claims": ["C-305", "C-224"],
        },
        {
            "id": "SCR-07", "archetype": "A3", "objective": "OBJ-03", "eyebrow": "Post well",
            "title": "Seven guidelines, one standard",
            "table": {
                "caption": "Gleaniverse Community Guidelines",
                "head": ["Guideline", "What it means"],
                "rows": [
                    ["Look before you post", "Search first; the question may already be answered"],
                    ["Keep sensitive info out", "Do not share confidential or personal data"],
                    ["Keep it relevant", "Glean and the broader AI industry; no spam, self-promotion, bots, or unsolicited outreach"],
                    ["Be kind", "Ask questions, share what you know, support each other"],
                    ["Make it a safe space", "No harassment, hate speech, or unwelcoming behavior"],
                    ["Make it better", "Share feedback and learnings often"],
                    ["Build together", "Jump into conversations and help others"],
                ],
            },
            "footnote": "Glean may remove content or restrict access for guideline violations. Report anything that does not feel right to the Glean team.",
            "claims": ["C-306", "C-307", "C-308", "C-309", "C-310", "C-311"],
        },
        {
            "id": "SCR-08", "archetype": "A12", "objective": "OBJ-03", "eyebrow": "Review the draft",
            "title": "What is wrong with this post?",
            "type": "choice",
            "prompt": "Draft forum post: \"Our connector fails for one user. Here is our instance URL, the user's email address, and the full error log. Can anyone help?\"",
            "options": [
                {"id": "o1", "text": "It shares confidential and personal data, and it describes an instance error. Remove the details and open a support ticket instead.",
                 "correct": True,
                 "feedback": "Correct. Keep confidential and personal data out of the community, and send instance bugs and errors to a support ticket."},
                {"id": "o2", "text": "Nothing. More detail always gets a faster answer.",
                 "feedback": "Not this one. The guidelines say not to share confidential or personal data, however helpful it seems."},
                {"id": "o3", "text": "It should be posted in a group instead of the forum.",
                 "feedback": "Not this one. The guidelines apply everywhere in the community, and an instance error belongs in a ticket."},
            ],
            "takeaway": "Share the pattern in the community. Keep private evidence in a ticket.",
            "claims": ["C-307", "C-305"],
        },
        {
            "id": "SCR-09", "archetype": "A8", "objective": "OBJ-03", "eyebrow": "Worked example",
            "title": "Ask a question that gets answered",
            "steps": [
                {"title": "Search first", "body": "Look for an existing thread before you post."},
                {"title": "Pick the right place", "body": "Forum for questions, Feedback and Ideas for requests, a ticket for instance errors."},
                {"title": "Describe the goal", "body": "State what you want to achieve and what you tried, without confidential or personal data."},
                {"title": "Stay relevant", "body": "Keep it about Glean or the broader AI industry. No promotion."},
                {"title": "Close the loop", "body": "Share what worked so the next person benefits."},
            ],
            "claims": ["C-306", "C-305", "C-224", "C-307", "C-308", "C-310"],
        },
        {
            "id": "SCR-10", "archetype": "quiz", "objective": "OBJ-02", "eyebrow": "Prove it",
            "title": "Community check", "type": "quiz",
        },
        {
            "id": "SCR-11", "archetype": "A14", "objective": "OBJ-01", "eyebrow": "Carry this with you",
            "title": "If the answer can help many, share it.",
            "body": "Community answers let Support help multiple customers at once. Use the community for questions, best practices, and ideas, and keep instance issues in a ticket.",
            "badge": "Gleaniverse Community: complete",
            "signature": True,
            "claims": ["C-314", "C-305"],
        },
    ],
    "quiz": [
        {"id": "Q-01", "objective_id": "OBJ-01",
         "stem": "A customer admin wants live help from Glean Support in a small group. Where should they look?",
         "options": [
             {"id": "a", "text": "Events: the monthly troubleshooting session on the second Thursday.", "correct": True,
              "feedback": "Correct. Glean Support runs it every month and splits into small groups."},
             {"id": "b", "text": "Post a request on the product ideas board.",
              "feedback": "No. The Feedback and Ideas board is for feature requests and product feedback."},
             {"id": "c", "text": "The Admin Hub only.",
              "feedback": "No. The Admin Hub is a restricted space; the live session is listed in Events."},
         ]},
        {"id": "Q-02", "objective_id": "OBJ-01",
         "stem": "Why should a user register for Gleaniverse with a work email?",
         "options": [
             {"id": "a", "text": "So they receive the correct role and permissions.", "correct": True,
              "feedback": "Correct. The work email tags the account with the right access."},
             {"id": "b", "text": "Because personal email addresses are shown publicly.",
              "feedback": "No. The documented reason is correct role and permission assignment."},
             {"id": "c", "text": "It is optional and has no effect.",
              "feedback": "No. A work email affects the role and permissions the account receives."},
         ]},
        {"id": "Q-03", "objective_id": "OBJ-02",
         "stem": "A customer reports an error in their own Glean instance. Where does it go?",
         "options": [
             {"id": "a", "text": "A support ticket.", "correct": True,
              "feedback": "Correct. Bugs and errors in a Glean instance go to a support ticket."},
             {"id": "b", "text": "A new forum thread with the error log.",
              "feedback": "No. Instance errors go to support, and logs can hold confidential data."},
             {"id": "c", "text": "Submit it as a product idea for voting.",
              "feedback": "No. The Feedback and Ideas board is for feature requests, not errors."},
         ]},
        {"id": "Q-04", "objective_id": "OBJ-02",
         "stem": "Where should a feature request go?",
         "options": [
             {"id": "a", "text": "The Feedback and Ideas board in Gleaniverse.", "correct": True,
              "feedback": "Correct. Feature requests and product feedback go there."},
             {"id": "b", "text": "An Urgent support ticket.",
              "feedback": "No. Feature requests are not incidents, and over-escalating slows critical work."},
             {"id": "c", "text": "An email to a Glean contact.",
              "feedback": "No. The documented path is the Feedback and Ideas board."},
         ]},
        {"id": "Q-05", "objective_id": "OBJ-03",
         "stem": "Which post breaks the community guidelines?",
         "options": [
             {"id": "a", "text": "A post that includes a user's email address and an internal document link.", "correct": True,
              "feedback": "Correct. Do not share confidential or personal data."},
             {"id": "b", "text": "A question that follows a search that found no existing thread.",
              "feedback": "No. Searching first follows the guidelines."},
             {"id": "c", "text": "A reply that shares what worked for another admin.",
              "feedback": "No. Sharing learnings is encouraged."},
         ]},
    ],
}

SPECS = [OPS_107, OPS_108]


def collect_claims(spec):
    """Union of every claim referenced by screens and assets, in first-use order."""
    seen = []
    for scr in spec["screens"]:
        for c in scr.get("claims", []):
            if c not in seen:
                seen.append(c)
    for a in spec.get("assets", []):
        for c in a.get("claim_ids", []):
            if c not in seen:
                seen.append(c)
    for c in spec.get("quiz_claims", []):
        if c not in seen:
            seen.append(c)
    return seen


def place_correct(options, pos):
    """Move the correct option to index pos, preserving option ids and the order of distractors.

    The shared paged runtime renders options in authored order and does not shuffle,
    so correct-answer position must vary in the source. Option ids stay stable, so
    assessment/key.json and runtime scoring still resolve by id.
    """
    right = [o for o in options if o.get("correct")]
    rest = [o for o in options if not o.get("correct")]
    assert len(right) == 1, "exactly one correct option required"
    pos = pos % len(options)
    return rest[:pos] + right + rest[pos:]


# Deterministic, varied answer positions (no position is correct more than half the time).
POSITIONS = [1, 2, 0, 2, 1, 0, 1, 2]

for _s in SPECS:
    _s["claims"] = collect_claims(_s)
    for _n, _q in enumerate(_s["quiz"]):
        _q["options"] = place_correct(_q["options"], POSITIONS[_n % len(POSITIONS)])
    _choices = [x for x in _s["screens"] if x.get("type") == "choice"]
    for _n, _scr in enumerate(_choices):
        _scr["options"] = place_correct(_scr["options"], POSITIONS[(_n + 3) % len(POSITIONS)])
