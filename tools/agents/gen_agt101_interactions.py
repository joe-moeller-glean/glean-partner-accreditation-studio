import json, pathlib

I = {}

I["INT-anatomy"] = {
    "id": "INT-anatomy", "type": "hotspot", "band": "BAND-04",
    "prompt": "Select a building block to inspect it.",
    "diagram": "assets/agent-anatomy.svg",
    "hotspots": [
        {"id": "h1", "n": "01", "label": "Goal and instructions",
         "body": "Target outcomes and behavioral rules. Write them like an SOP for a teammate: the job, the steps or reasoning to follow, the output format, and any rules, limits, or safety constraints.",
         "claims": ["K-08", "K-13", "K-14"]},
        {"id": "h2", "n": "02", "label": "Knowledge and context",
         "body": "The information available to the agent. Add only what the workflow requires \u2014 a smaller, reviewable source list beats an unbounded one.",
         "claims": ["K-09"]},
        {"id": "h3", "n": "03", "label": "Tools and actions",
         "body": "The tasks the agent performs: read documents, tickets, records, or calendars; write to connectors; draft text; update external systems. Give the fewest tools that do the job \u2014 it improves reliability and makes review possible.",
         "claims": ["K-10", "K-12", "K-15"]},
        {"id": "h4", "n": "04", "label": "Execution",
         "body": "How the work runs: Auto mode, where the agent determines the path, or Workflow mode, where you define steps and flow explicitly.",
         "claims": ["K-16", "K-17", "K-18"]},
        {"id": "h5", "n": "05", "label": "Output and memory",
         "body": "The results produced and the context retained during a run. In Workflow mode each step writes to working memory, and by default a step sees only the output of the step immediately before it.",
         "claims": ["K-11", "K-22"]}
    ]
}

I["INT-modes"] = {
    "id": "INT-modes", "type": "tabs", "band": "BAND-05",
    "prompt": "Compare the two modes.",
    "panels": [
        {"id": "auto", "label": "Auto mode", "tagline": "The agent decides the path.",
         "rows": [
             {"k": "Start here when", "v": "The task is open-ended: research, analysis, summarization, drafting.", "claims": ["K-19"]},
             {"k": "How you build", "v": "Describe the outcome in natural language, then review, refine, and test the draft in Builder Assistant.", "claims": ["K-17"]},
             {"k": "Default?", "v": "Yes \u2014 the default starting experience for most use cases.", "claims": ["K-17"]},
             {"k": "Scaling up", "v": "The Task tool splits complex requests into sub-tasks for sub-agents, preserving agent permissions and error handling.", "claims": ["K-23"]}
         ]},
        {"id": "workflow", "label": "Workflow mode", "tagline": "You decide the path.",
         "rows": [
             {"k": "Start here when", "v": "The process is fixed and repeatable and needs explicit control over each step, branch, and hand-off.", "claims": ["K-18"]},
             {"k": "How you build", "v": "Configure steps manually. A step is one unit of work; flow controls how the agent moves between steps.", "claims": ["K-20"]},
             {"k": "Logic available", "v": "Branches that pick a path on a condition, and calls to sub-agents that return to the main flow.", "claims": ["K-21"]},
             {"k": "Memory model", "v": "Each step saves output to working memory; by default a step receives only the previous step's output.", "claims": ["K-22"]}
         ]}
    ]
}

I["INT-decide"] = {
    "id": "INT-decide", "type": "decision_set", "band": "BAND-06", "scored": False,
    "items": [
        {"id": "d1",
         "scenario": "\u201cOur support leads want to paste in a ticket and get a suggested resolution, using the same four steps every time, so two leads never get different treatment.\u201d",
         "options": [
             {"id": "a", "label": "Auto mode", "correct": False,
              "feedback": "Auto mode lets the agent choose its own path, so two runs can differ. The requirement here is explicitly that every ticket gets the same treatment."},
             {"id": "b", "label": "Workflow mode", "correct": True,
              "feedback": "Correct. Fixed, repeatable, and the customer wants control over each step \u2014 that is exactly what Workflow mode is for."},
             {"id": "c", "label": "Independent agent", "correct": False,
              "feedback": "Not yet. A lead starts and supervises each run, so there is no need for an agent-owned identity running without a user session."}
         ], "claims": ["K-18", "K-19"]},
        {"id": "d2",
         "scenario": "\u201cOur strategy team wants to ask broad research questions across Confluence, Slack, and the web \u2014 different question every time, and they want a written summary.\u201d",
         "options": [
             {"id": "a", "label": "Auto mode", "correct": True,
              "feedback": "Correct. Research, analysis, summarization, and drafting are the Auto mode patterns, and the request changes every time."},
             {"id": "b", "label": "Workflow mode", "correct": False,
              "feedback": "You would be hand-building a path for a question that changes every time. Workflow mode pays off when the sequence is fixed."},
             {"id": "c", "label": "Independent agent", "correct": False,
              "feedback": "An analyst is present and supervising, so the independent execution model adds governance overhead with no benefit."}
         ], "claims": ["K-19"]},
        {"id": "d3",
         "scenario": "\u201cWe want something that watches our incident channel around the clock, replies in the channel under its own name, and keeps working until the incident closes \u2014 no one is going to babysit it.\u201d",
         "options": [
             {"id": "a", "label": "Auto mode agent a user runs", "correct": False,
              "feedback": "This depends on a person starting it inside their own session, which is the thing the customer said will not happen."},
             {"id": "b", "label": "Workflow mode agent on a schedule", "correct": False,
              "feedback": "Closer, but a schedule fires at fixed times and still runs per subscribing user. It cannot hold a persistent presence in the channel under its own identity."},
             {"id": "c", "label": "Independent agent", "correct": True,
              "feedback": "Correct \u2014 monitoring events, responding in a shared channel, and continuing until work resolves is the independent agent model. Flag that it is in beta and availability depends on the deployment."}
         ], "claims": ["K-24", "K-25", "K-26"]}
    ]
}

I["INT-triggers"] = {
    "id": "INT-triggers", "type": "sorter", "band": "BAND-07",
    "prompt": "Assign each situation to the trigger that fits.",
    "buckets": [
        {"id": "chat", "label": "Chat message"},
        {"id": "form", "label": "Input form"},
        {"id": "content", "label": "Content change"},
        {"id": "schedule", "label": "Schedule"}
    ],
    "cards": [
        {"id": "c1", "text": "Employees ask free-form HR policy questions and sometimes attach a document.", "bucket": "chat",
         "why": "Open-ended and conversational, with document upload \u2014 the chat message trigger's chatbox.", "claims": ["K-28"]},
        {"id": "c2", "text": "The agent needs a ticket ID and a date range before it can start.", "bucket": "form",
         "why": "Specific required fields up front is the input form case. Remember each step only sees a field you tag with [[input field name]].", "claims": ["K-30", "K-32"]},
        {"id": "c3", "text": "A new call transcript lands in the connected system and should be summarized right away.", "bucket": "content",
         "why": "Something changed in a connected tool, and the changed content arrives as [[Trigger input]].", "claims": ["K-33"]},
        {"id": "c4", "text": "Every Monday at 8am, post a digest of last week's open risks.", "bucket": "schedule",
         "why": "A recurring summary at a defined time is the scheduled run case.", "claims": ["K-35"]},
        {"id": "c5", "text": "A reviewer picks one of three review depths from a fixed list, then the agent runs.", "bucket": "form",
         "why": "A fixed set of options is a multiple choice input field on an input form.", "claims": ["K-31"]},
        {"id": "c6", "text": "A support doc is edited, and the agent should check whether a related article now contradicts it.", "bucket": "content",
         "why": "Driven by a change in connected content, not by a person or a clock.", "claims": ["K-33"]}
    ]
}

I["INT-myths"] = {
    "id": "INT-myths", "type": "myth_fact", "band": "BAND-08",
    "prompt": "Decide whether each statement is true, then reveal the answer.",
    "items": [
        {"id": "m1",
         "claim_text": "\u201cIf I build and publish an agent, it runs with my access, so my colleagues will see what I can see.\u201d",
         "is_true": False,
         "verdict": "Myth.",
         "body": "Access is enforced at execution time based on the identity of the signed-in user running the agent, regardless of who created or published it. In the web app the agent uses the running user's own permissions, so answers are personalized per user.",
         "claims": ["K-42", "K-45"]},
        {"id": "m2",
         "claim_text": "\u201cAn agent behaves the same in Slack as it does in the web app.\u201d",
         "is_true": False,
         "verdict": "Myth \u2014 and this one causes real escalations.",
         "body": "When an agent is published to Slack as visible to everyone in the channel, it applies a stricter model: it only uses documents accessible to all channel members, not just the person asking. That is deliberate \u2014 it stops restricted documents leaking into a broad channel \u2014 but it means the same question can return less in Slack.",
         "claims": ["K-46"]},
        {"id": "m3",
         "claim_text": "\u201cGiving someone editor access lets them publish the agent.\u201d",
         "is_true": False,
         "verdict": "Myth.",
         "body": "Sharing and publishing are separate permissions. Editor access lets a user edit an agent but does not by itself allow publishing. Only an owner can delete an agent or add and remove other owners.",
         "claims": ["K-43", "K-44"]},
        {"id": "m4",
         "claim_text": "\u201cAgent permissions still apply when the agent is called from the API.\u201d",
         "is_true": True,
         "verdict": "Fact.",
         "body": "Permissions are enforced everywhere, including when the agent is invoked from Slack or the API. Governance does not have a side door.",
         "claims": ["K-47"]}
    ]
}

I["INT-risk"] = {
    "id": "INT-risk", "type": "risk_checklist", "band": "BAND-09",
    "prompt": "Select every factor that applies to the agent you are scoping.",
    "factors": [
        {"id": "f1", "text": "Will be shared with a broad audience", "weight": 1, "claims": ["K-40"]},
        {"id": "f2", "text": "Accesses sensitive or restricted data", "weight": 1, "claims": ["K-40"]},
        {"id": "f3", "text": "Performs write tools, for example updating tickets or sending email", "weight": 1, "claims": ["K-40"]},
        {"id": "f4", "text": "Affects a high-value or high-risk business workflow", "weight": 1, "claims": ["K-40"]},
        {"id": "f5", "text": "Runs in the background with no per-run confirmation", "weight": 1, "claims": ["K-53", "K-54"]}
    ],
    "results": [
        {"max": 0, "tier": "Personal", "process": "Lightweight",
         "body": "Basic testing and narrow scoping. Test in Preview and inspect the run in Debug before you share it.",
         "claims": ["K-39", "K-55"]},
        {"max": 2, "tier": "Team utility", "process": "Moderate",
         "body": "Basic design docs and peer review. Name an owner, write down the intended scope, and have someone else read the instructions.",
         "claims": ["K-39"]},
        {"max": 5, "tier": "Enterprise", "process": "Comprehensive",
         "body": "Rigorous testing, formal review, and launch planning. For background runs: prefer organization-trusted sources, avoid high-risk feeds such as the email inbox, constrain web search to known-good domains, and remember that admins control which write tools may run without user confirmation.",
         "claims": ["K-39", "K-53", "K-54"]}
    ]
}

I["INT-lifecycle"] = {
    "id": "INT-lifecycle", "type": "stepper", "band": "BAND-10",
    "prompt": "Step through the lifecycle.",
    "steps": [
        {"n": 1, "label": "Plan and design", "body": "Define the specific problem, the target users, and the intended scope. Start with a clear business need, not a vague automation idea.", "claims": ["K-37", "K-36"]},
        {"n": 2, "label": "Define quality", "body": "Decide how you will measure success before you build \u2014 for example, the agent must correctly cite sources every time.", "claims": ["K-37"]},
        {"n": 3, "label": "Build safely", "body": "Implement the workflow with clear boundaries, system prompts, and safeguards.", "claims": ["K-37"]},
        {"n": 4, "label": "Test and launch", "body": "Validate reliability and permissions, and make sure users have documentation on how to interact with the agent. Test in Preview and inspect behavior in Debug.", "claims": ["K-37", "K-55"]},
        {"n": 5, "label": "Manage versions", "body": "Use drafts and versioning to update the agent without interrupting live workflows. Each save becomes the new live version and snapshots the previous one; the most recent 30 versions are kept.", "claims": ["K-37", "K-56"]},
        {"n": 6, "label": "Govern and monitor", "body": "Track adoption and accuracy, and review ownership regularly so the agent stays relevant. Every agent needs a maintainer.", "claims": ["K-37"]}
    ]
}

p = pathlib.Path("learning/modules/AGT-101/interactions/interactions.json")
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text(json.dumps({"module_id": "AGT-101", "interactions": I}, indent=2) + "\n")
print("interactions:", len(I))
for k, v in I.items():
    n = len(v.get("items") or v.get("cards") or v.get("hotspots") or v.get("steps") or v.get("factors") or v.get("panels") or [])
    print(f"  {k}: {v['type']} ({n} elements)")
