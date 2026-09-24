import json, pathlib

ITEMS = [
    {
        "id": "Q-01", "objective_id": "OBJ-01", "type": "single",
        "stem": "A partner asks you to define a Glean Agent in one sentence. Which answer is accurate?",
        "options": [
            {"id": "a", "text": "A reusable AI solution that uses instructions, knowledge, tools, and context to complete tasks."},
            {"id": "b", "text": "A saved search that reruns automatically and emails the results."},
            {"id": "c", "text": "A chatbot that answers questions from a single uploaded knowledge base."},
            {"id": "d", "text": "A connector that indexes a new data source so it becomes searchable."},
        ],
        "correct": "a",
        "feedback": {
            "a": "Correct. That is the product definition, and the four elements it names are what you check on every agent review.",
            "b": "A schedule can start an agent, but a trigger is not the agent. An agent carries out adapting, multi-step work.",
            "c": "Too narrow. Agents combine instructions, knowledge, tools, and context, and can act across many connected systems.",
            "d": "That describes a connector. Connectors supply knowledge; the agent is what uses it.",
        },
        "claims": ["K-03", "K-01"],
    },
    {
        "id": "Q-02", "objective_id": "OBJ-02", "type": "multi",
        "stem": "Which of these are among the five core building blocks that every agent combines? Select all that apply.",
        "options": [
            {"id": "a", "text": "Goal and instructions"},
            {"id": "b", "text": "Knowledge and context"},
            {"id": "c", "text": "Output and memory"},
            {"id": "d", "text": "Billing and cost centre"},
            {"id": "e", "text": "Index refresh schedule"},
        ],
        "correct": ["a", "b", "c"],
        "feedback": {
            "a": "Correct \u2014 target outcomes and behavioral rules.",
            "b": "Correct \u2014 the information available to the agent.",
            "c": "Correct \u2014 results produced and context retained during a run.",
            "d": "Not a building block. Cost matters operationally, but it is not part of the agent model.",
            "e": "Not a building block. That belongs to connectors and indexing, not the agent itself.",
        },
        "claims": ["K-07"],
    },
    {
        "id": "Q-03", "objective_id": "OBJ-03", "type": "single",
        "stem": "A customer needs an agent that runs the same five steps in the same order every time, because an auditor will review the output. Which mode fits?",
        "options": [
            {"id": "a", "text": "Workflow mode, because it gives explicit control over each step, branch, and hand-off."},
            {"id": "b", "text": "Auto mode, because the agent will work out the best path each time."},
            {"id": "c", "text": "Either one, because both produce identical execution paths."},
            {"id": "d", "text": "Neither \u2014 auditable work cannot be done with an agent."},
        ],
        "correct": "a",
        "feedback": {
            "a": "Correct. Fixed and repeatable with explicit control is exactly the Workflow mode case.",
            "b": "Auto mode determines its own path, so runs can vary. That is the opposite of what an auditor wants here.",
            "c": "They differ in a way that matters: Auto mode decides its own path, Workflow mode follows yours.",
            "d": "Agents can absolutely support auditable work \u2014 that is why Workflow mode and the lifecycle exist.",
        },
        "claims": ["K-18", "K-19"],
    },
    {
        "id": "Q-04", "objective_id": "OBJ-04", "type": "single",
        "stem": "An agent must start automatically whenever a document changes in a connected tool, and act on what changed. Which trigger, and how does the agent receive the change?",
        "options": [
            {"id": "a", "text": "A content trigger, and the changed content is passed in as [[Trigger input]]."},
            {"id": "b", "text": "A chat message trigger, and the user pastes the change into the chatbox."},
            {"id": "c", "text": "An input form trigger, and the user selects the document from a multiple choice field."},
            {"id": "d", "text": "A schedule trigger, and the agent re-reads the whole source each run."},
        ],
        "correct": "a",
        "feedback": {
            "a": "Correct on both halves. Content triggers fire on a change in a connected tool and hand the changed content to the agent as [[Trigger input]].",
            "b": "That requires a person to notice and paste, which defeats the point of automatic execution.",
            "c": "An input form needs a person to fill it in first, so it cannot start on its own.",
            "d": "A schedule fires on the clock, not on the change, and would miss or duplicate work.",
        },
        "claims": ["K-33", "K-27"],
    },
    {
        "id": "Q-05", "objective_id": "OBJ-05", "type": "single",
        "stem": "A partner publishes an HR agent to a Slack channel as visible to everyone in the channel, and reports that it returns less than the same agent in the web app. What is happening?",
        "options": [
            {"id": "a", "text": "Expected behavior: for channel-wide visibility the agent only uses documents accessible to all channel members, which prevents restricted content being exposed in a broad channel."},
            {"id": "b", "text": "A defect \u2014 permissions should be identical on every surface, so it should be escalated as a bug."},
            {"id": "c", "text": "The agent lost its permissions when published, and the owner must re-grant document access."},
            {"id": "d", "text": "Slack does not support knowledge retrieval, so the agent falls back to web search."},
        ],
        "correct": "a",
        "feedback": {
            "a": "Correct. It is a deliberate stricter access model for channel-wide visibility. To match web behavior, publish as visible only to the user with the option to share.",
            "b": "Not a defect. Permissions are enforced everywhere, but channel-wide visibility deliberately narrows which documents can be used.",
            "c": "Agents do not hold their own document grants. Access is evaluated at execution time against the relevant user or channel scope.",
            "d": "Retrieval still works in Slack. What changed is the set of documents the agent is allowed to draw on.",
        },
        "claims": ["K-46", "K-47"],
    },
    {
        "id": "Q-06", "objective_id": "OBJ-05", "type": "single",
        "stem": "Your partner is scoping an agent that will be company-wide, read restricted data, and update Jira tickets. What does the lifecycle guidance say about process?",
        "options": [
            {"id": "a", "text": "Apply a comprehensive process: rigorous testing, formal review, and launch planning."},
            {"id": "b", "text": "Apply a lightweight process, then add review only if users complain."},
            {"id": "c", "text": "Process depth is a matter of team preference and is not tied to scope."},
            {"id": "d", "text": "Skip the lifecycle, because write tools are blocked by the platform anyway."},
        ],
        "correct": "a",
        "feedback": {
            "a": "Correct. Broad audience, sensitive data, and write tools each independently call for a more robust process, and enterprise scope means comprehensive.",
            "b": "Reactive review after a broad launch is precisely what the lifecycle exists to prevent.",
            "c": "Process must scale with impact and data access \u2014 that is the explicit guidance.",
            "d": "Write tools are governed, not universally blocked. Admins choose which may run without confirmation, which is a reason for more review, not less.",
        },
        "claims": ["K-39", "K-40"],
    },
]

OBJ = {
    "OBJ-01": "Define a Glean Agent and identify who agents are for.",
    "OBJ-02": "Name the five core building blocks that every agent combines.",
    "OBJ-03": "Choose Auto mode, Workflow mode, or an independent agent for a stated need.",
    "OBJ-04": "Match the right trigger to how people will start the agent.",
    "OBJ-05": "Apply least privilege, permission behavior, and risk-matched process.",
}

items_public = []
key = {}
for it in ITEMS:
    pub = {k: v for k, v in it.items() if k not in ("correct", "feedback")}
    items_public.append(pub)
    key[it["id"]] = {"correct": it["correct"], "feedback": it["feedback"]}

base = pathlib.Path("modules/AGT-101/assessment")
base.mkdir(parents=True, exist_ok=True)
(base / "items.json").write_text(json.dumps(
    {"module_id": "AGT-101", "mastery_score": 80, "objectives": OBJ,
     "shuffle": True, "max_attempts": 0, "items": items_public}, indent=2) + "\n")
(base / "key.json").write_text(json.dumps(
    {"module_id": "AGT-101", "key": key}, indent=2) + "\n")

print("items:", len(items_public), "| objectives:", sorted({i["objective_id"] for i in ITEMS}))
print("items.json leaks key:", '"correct"' in (base / "items.json").read_text())
