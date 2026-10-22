#!/usr/bin/env python3
"""Vetted source ledger and claim library for OPS-107 and OPS-108.

OPS-107 Glean Support Center & Escalations
OPS-108 Using Gleaniverse Community

Current product and support documentation is the primary authority (tier 1).
Internal field guidance is tier 2 and is used only where it adds detail that the
public documentation does not contradict. Sources were retrieved through Glean
enterprise search and document reads on 2026-09-26.

Deliberately excluded:
- "[External] Glean Support for Customers" (2024-10) - superseded by the 2026
  Fin support migration; named escalation contacts are volatile.
- Meeting notes "Discuss Intercom Escalation Path for Partners" (2026-09-25) -
  working notes, not published policy. Recorded as an open SME question.
"""

VERIFIED_ON = "2026-09-26"
CHECKED_BY = "Fact Integrity Auditor (studio)"

SOURCES = [
    {
        "source_id": "S-101",
        "title": "Glean Support Center (Glean Docs)",
        "url": "https://docs.glean.com/troubleshooting/support-center/",
        "owner": "Glean Support",
        "datasource": "glean docs",
        "doc_updated": "2026-08-07",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "product_documentation",
        "notes": "Sign-in, self-service steps, conversation versus ticket, feedback, and email support.",
        "reverify_by": "2026-12-26",
    },
    {
        "source_id": "S-102",
        "title": "Conversations (Glean Docs)",
        "url": "https://docs.glean.com/troubleshooting/support-center/conversations",
        "owner": "Glean Support",
        "datasource": "glean docs",
        "doc_updated": "2026-08-31",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "product_documentation",
        "notes": "Conversation prerequisites and steps.",
        "reverify_by": "2026-12-26",
    },
    {
        "source_id": "S-103",
        "title": "Tickets (Glean Docs)",
        "url": "https://docs.glean.com/troubleshooting/support-center/tickets",
        "owner": "Glean Support",
        "datasource": "glean docs",
        "doc_updated": "2026-09-22",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "product_documentation",
        "notes": "Ticket eligibility, required details, priority levels, creation steps, ticket history, customer portal.",
        "reverify_by": "2026-12-26",
    },
    {
        "source_id": "S-104",
        "title": "Glean Customer Support SLA (v6Mar2026)",
        "url": "https://www.glean.com/sla",
        "owner": "Glean Legal",
        "datasource": "public web",
        "doc_updated": "2026-03-06",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "contract_terms",
        "notes": "Portal eligibility, initial response times, support hours, Designated Support Contact counts and duties, priority classification.",
        "reverify_by": "2026-12-26",
    },
    {
        "source_id": "S-105",
        "title": "Common Internal FAQs on Fin Support Migration",
        "url": "https://docs.google.com/document/d/1MH-LXGabPFVKO1o0drmkB-fY_3BRWPs_trWciTxU_8w",
        "owner": "Leanna Syrimis",
        "datasource": "gdrive",
        "doc_updated": "2026-07-21",
        "verified_on": VERIFIED_ON,
        "authority_tier": 2,
        "status": "current",
        "type": "internal_field_guidance",
        "notes": "Field FAQ. Used for Query scope and cc of non-entitled users; consistent with S-101 and S-103.",
        "reverify_by": "2026-11-26",
    },
    {
        "source_id": "S-106",
        "title": "Gleaniverse Community (home page)",
        "url": "https://community.glean.com",
        "owner": "Glean Community team",
        "datasource": "gleaniverse",
        "doc_updated": "2026-09-25",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "product_page",
        "notes": "Navigation, entry points, and area names.",
        "reverify_by": "2026-12-26",
    },
    {
        "source_id": "S-107",
        "title": "Gleaniverse Community Guidelines",
        "url": "https://community.glean.com/public/resources/gleaniverse-community-guidelines-2026-04-02",
        "owner": "Glean Community team",
        "datasource": "gleaniverse",
        "doc_updated": "2026-04-02",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "community_policy",
        "notes": "Posting guidelines and moderation.",
        "reverify_by": "2026-12-26",
    },
    {
        "source_id": "S-108",
        "title": "Events - Gleaniverse",
        "url": "https://community.glean.com/categories/events",
        "owner": "Glean Community team",
        "datasource": "gleaniverse",
        "doc_updated": "2026-09-25",
        "verified_on": VERIFIED_ON,
        "authority_tier": 1,
        "status": "current",
        "type": "product_page",
        "notes": "Recurring support and product sessions; replay link.",
        "reverify_by": "2026-11-26",
    },
    {
        "source_id": "S-109",
        "title": "Community Toolkit (Gleaniverse Toolkit)",
        "url": "https://docs.google.com/document/d/1W4PbMdwT8GYsoOcK1AkzFOirBulFX3IA_Vesej_JZHA",
        "owner": "Joel McKelvey",
        "datasource": "gdrive",
        "doc_updated": "2025-11-12",
        "verified_on": VERIFIED_ON,
        "authority_tier": 2,
        "status": "current",
        "type": "internal_field_guidance",
        "notes": "Routing rule (tickets versus community), work-email registration, Admin Hub access. Older than 180 days; reverify before next release.",
        "reverify_by": "2026-10-26",
    },
]

_CLAIMS = [
    # --- Support Center access and self-service
    ("C-201", "You must sign in to Gleaniverse to access the Glean Support Center.", ["S-101"]),
    ("C-202", "Logins from the legacy support portal were not migrated, so users need a Gleaniverse account.", ["S-101", "S-102"]),
    ("C-203", "Before opening a ticket, search Glean Docs, ask Query, and check the Glean status page for known issues.", ["S-101"]),
    ("C-204", "The Support Center has two entry points: Ask Query in the top navigation and the support widget in the bottom-right corner.", ["S-101"]),
    # --- Conversations and tickets
    ("C-205", "Conversations are available to all users and are the best starting point for most requests.", ["S-101", "S-102"]),
    ("C-206", "To start a conversation, open the support widget and select Send us a message. The assistant triages the request and guides you to a ticket if it cannot resolve the issue.", ["S-102"]),
    ("C-207", "Tickets formally track issues that need follow-up or escalation. They are best for bug reports, outages, and requests that need a documented resolution.", ["S-101", "S-103"]),
    ("C-208", "If a conversation needs escalation, support can convert it into a ticket.", ["S-101"]),
    ("C-209", "Ticket creation is available to Designated Support Contacts as defined in the Glean Support Agreement. Contact the Glean account team to be set up as one.", ["S-103"]),
    ("C-210", "Users who are not Designated Support Contacts can start a conversation or ask their Glean administrator to submit a ticket.", ["S-103"]),
    ("C-211", "A complete ticket includes an issue description with reproduction steps, exact error messages, date and time with timezone, user impact, the relevant document URL, and screenshots or recordings.", ["S-103"]),
    ("C-212", "Priority levels are Low, Normal, High, and Urgent. Low covers non-critical issues such as general product inquiries and feature requests. Over-escalating priority can slow resolution for genuinely critical issues.", ["S-103"]),
    ("C-213", "To create a ticket, a Designated Support Contact opens the support widget, selects Create a ticket, describes the issue, selects a priority, and submits.", ["S-103"]),
    ("C-214", "The Tickets section in the support widget appears only after the first ticket is created.", ["S-103"]),
    ("C-215", "Designated Support Contacts view company-wide conversations and tickets through the Go to customer portal banner in the support widget. Do not go directly to ticket.glean.com.", ["S-103"]),
    # --- SLA
    ("C-216", "Only incidents submitted through the Glean support portal are eligible for SLA response times. Response times cannot be tracked accurately outside the portal.", ["S-104"]),
    ("C-217", "Standard Support initial response times: Urgent 1 business day, High 2 business days, Normal and Low 1 business week. Premium: Urgent 1 hour, High 4 business hours, Normal 1 business day, Low 2 business days.", ["S-104"]),
    ("C-218", "Standard Support provides 24x5 hours and 1 to 4 Designated Support Contacts. Premium provides 24x7 for Urgent incidents only and 1 to 10 Designated Support Contacts. The Order Form sets the tier.", ["S-104"]),
    ("C-219", "The customer must assess business impact and urgency when selecting a priority.", ["S-104"]),
    ("C-220", "Urgent examples: the Service is unavailable to all users, or a security incident is detected. High examples: the Service is unavailable to a subset of users, or a new release materially harmed existing connected applications. Normal example: results are incomplete or truncated from known connected sources.", ["S-104"]),
    ("C-221", "Designated Support Contacts should know the deployment and configuration, have admin access to connected applications, prioritize accurately, and use self-service resources first.", ["S-104"]),
    ("C-222", "Email to help@glean.com is triaged by the AI assistant first and handed to a human agent for Designated Support Contacts.", ["S-101"]),
    ("C-223", "Non-entitled users can be cc'd on a conversation or ticket with a Designated Support Contact, for example to supply screenshots or reproduction steps.", ["S-105"]),
    ("C-224", "Submit feature requests and product feedback on the Feedback and Ideas board in Gleaniverse.", ["S-101"]),
    ("C-225", "Glean Support runs a monthly live troubleshooting session on the second Thursday of each month, working through questions in small groups.", ["S-108", "S-105"]),
    # --- Community
    ("C-301", "Gleaniverse navigation includes Forum, Resources, Support Center, Events, Groups, Ask Query, and Academy.", ["S-106"]),
    ("C-302", "The Gleaniverse home page offers three starting points: Start a Discussion, Join a Group, and Explore Academy.", ["S-106"]),
    ("C-303", "Gleaniverse is Glean's primary customer community: a secure space to ask product questions, share feedback, and discover best practices.", ["S-109"]),
    ("C-304", "Register for Gleaniverse with a work email so you receive the correct role and permissions.", ["S-109"]),
    ("C-305", "For bugs and errors in a Glean instance, file a support ticket. For questions, best practices, or feature requests, use the community.", ["S-109"]),
    ("C-306", "Look before you post: search first, because the question may already be answered.", ["S-107"]),
    ("C-307", "Keep sensitive information out: do not share confidential or personal data.", ["S-107"]),
    ("C-308", "Keep it relevant: focus on Glean and the broader AI industry. No spam, self-promotion, bots, or unsolicited outreach.", ["S-107"]),
    ("C-309", "Be kind and make it a safe space. Harassment, hate speech, or unwelcoming behavior is not tolerated.", ["S-107"]),
    ("C-310", "Make it better and build together: share feedback and learnings, and help others when they need it.", ["S-107"]),
    ("C-311", "Glean may remove content or restrict access for guideline violations. Report anything that does not feel right to the Glean team.", ["S-107"]),
    ("C-312", "The Glean Product Team hosts monthly product updates on the fourth Thursday of each month.", ["S-108"]),
    ("C-313", "Replays of previous Glean webinars and events are available on demand.", ["S-108"]),
    ("C-314", "Community answers let Support help multiple customers at once and can reduce inbound volume.", ["S-109"]),
    ("C-315", "The Admin Hub is a restricted space for customer administrators.", ["S-109"]),
    ("C-316", "Glean Academy in Gleaniverse offers courses to master new topics.", ["S-106"]),
]

CLAIMS = {
    cid: {
        "claim_id": cid,
        "text": text,
        "source_ids": sids,
        "verdict": "verified",
        "verified_on": VERIFIED_ON,
        "checked_by": CHECKED_BY,
    }
    for cid, text, sids in _CLAIMS
}

SOURCES_BY_ID = {s["source_id"]: s for s in SOURCES}

OPEN_QUESTIONS = [
    {
        "id": "SME-01",
        "question": "Can a partner file a Glean ticket for a customer under the partner's own account, naming the customer in the request?",
        "evidence": "Discussed in 2026-09-25 partner escalation meeting notes; not in published documentation.",
        "handling": "Module states only the documented paths and asks partners to confirm their own path with the Glean partner team.",
    },
    {
        "id": "SME-02",
        "question": "What is the published escalation path after a ticket is filed and stalls?",
        "evidence": "A 2024 customer support deck describes account-team escalation; it predates the 2026 support migration.",
        "handling": "Module teaches staying in the ticket, adding evidence, and correcting priority; account-team involvement is labelled studio guidance.",
    },
]


def claims_for(claim_ids):
    missing = [c for c in claim_ids if c not in CLAIMS]
    if missing:
        raise KeyError(f"undefined claims referenced: {missing}")
    return [CLAIMS[c] for c in claim_ids]


def sources_for(claim_ids):
    sids = []
    for cid in claim_ids:
        for s in CLAIMS[cid]["source_ids"]:
            if s not in sids:
                sids.append(s)
    return [SOURCES_BY_ID[s] for s in sorted(sids)]
