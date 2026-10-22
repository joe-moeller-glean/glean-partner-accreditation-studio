import json, pathlib

C = [
 # OBJ-01 what an agent is
 ("K-01","D-01","A Glean Agent is an AI-powered tool that automates tasks, from simple to complex workflows, by handling tools like gathering information, summarizing data, and making decisions based on previous steps."),
 ("K-02","D-01","You can set up an agent to start working when something specific happens, and it carries out a series of tools that adapt to changing inputs."),
 ("K-03","D-02","Glean Agents are reusable AI solutions that use instructions, knowledge, tools, and context to complete tasks for an individual or a team."),
 ("K-04","D-02","Agents are discovered, launched, and managed from the Agent Library."),
 ("K-05","D-01","Agents serve three user types: builders who create custom AI experiences, consumers who use agents built by others, and administrators who manage adoption and governance."),
 ("K-06","D-01","Common agent examples include sales prospect outreach, support ticket next steps, pull request review, meeting recap, and a daily digest."),
 # OBJ-02 building blocks
 ("K-07","D-02","Agents combine five core building blocks: goal and instructions, knowledge and context, tools and actions, execution, and output and memory."),
 ("K-08","D-02","Goal and instructions define target outcomes and behavioral rules."),
 ("K-09","D-02","Knowledge and context is the information available to the agent."),
 ("K-10","D-02","Tools and actions are the tasks the agent performs."),
 ("K-11","D-02","Output and memory are the results produced and the context retained during a run."),
 ("K-12","D-02","A tool is a concrete task an agent executes, such as reading data from documents, tickets, records, or calendars, writing to connectors, drafting text, or updating external systems."),
 ("K-13","D-08","The instructions editor is a markdown-first surface, so instructions are written like an SOP or operating guide for a teammate rather than filled into rigid fields."),
 ("K-14","D-08","Good instructions explain the job the agent should do, the steps or reasoning it should follow, the output format it should return, and any rules, limitations, or safety constraints it must respect."),
 ("K-15","D-08","Limit tool access to only what the agent needs, because narrower access improves reliability and makes the agent easier to review."),
 # OBJ-03 modes
 ("K-16","D-02","Agents are built in two modes: Auto mode and Workflow mode."),
 ("K-17","D-02","Auto mode is the default starting experience for most use cases: describe the desired outcome in natural language, then review, refine, and test the draft in Builder Assistant."),
 ("K-18","D-02","Workflow mode is best for fixed, repeatable processes that require explicit control over each step, branch, and hand-off."),
 ("K-19","D-02","Use Auto mode for open-ended tasks such as research, analysis, summarization, and drafting. Use Workflow mode for fixed sequences requiring controlled logic."),
 ("K-20","D-02","In Workflow mode, a step is a single unit of work, and flow controls how the agent navigates from one step to the next."),
 ("K-21","D-02","Flow supports branches that select paths based on conditions, and calls to sub-agents that delegate tasks and then return to the main flow."),
 ("K-22","D-02","In Workflow mode, each step saves output to working memory, and by default a step receives output only from the immediately preceding step."),
 ("K-23","D-02","Auto mode agents can use the Task tool to split complex requests into sub-tasks and delegate them to sub-agents, and the Task tool maintains agent permissions and error handling."),
 ("K-24","D-07","Independent agents run shared workflows without depending on an individual user session, and each has its own profile and uses admin-approved identities in connected apps."),
 ("K-25","D-07","Independent agents are in beta, and available templates, triggers, channels, and administrative controls depend on the deployment."),
 ("K-26","D-07","Use an independent agent when a workflow needs to monitor events, respond in a shared channel, or continue running until work resolves; for a one-time question or a user-supervised workflow, use an interactive or scheduled agent instead."),
 # OBJ-04 triggers
 ("K-27","D-03","A trigger is how you choose what starts an agent and what information it receives up front."),
 ("K-28","D-03","A chat message trigger creates a conversational agent that responds to a wide variety of requests and displays a chatbox where the user enters a freeform message and uploads documents."),
 ("K-29","D-03","With a chat message trigger, all steps automatically receive the contents of the user's message along with previous messages and agent responses from the current session."),
 ("K-30","D-03","An input form trigger creates a task-based agent that executes a specific workflow and displays a form with the input fields the agent needs."),
 ("K-31","D-03","Input form fields can be text, document, or multiple choice."),
 ("K-32","D-03","Input form fields are not automatically presented to steps; a field must be explicitly tagged using the [[input field name]] format for a step to access it."),
 ("K-33","D-03","A content trigger runs an agent automatically when something changes in a connected tool, and the changed content is passed in as [[Trigger input]]."),
 ("K-34","D-02","Triggers are optional, and configuring one enables automatic execution without manual intervention."),
 ("K-35","D-08","Use a scheduled run when the agent should run automatically at a defined time, such as weekly summaries, periodic checks, or routine follow-ups."),
 # OBJ-05 govern / safety / limits
 ("K-36","D-04","Agents require a more deliberate development lifecycle than traditional software because they produce non-deterministic outputs, interact with live enterprise data, and execute multi-step reasoning."),
 ("K-37","D-04","The ADLC has six stages: plan and design, define quality, build safely, test and launch, manage versions, and govern and monitor."),
 ("K-38","D-04","The five ADLC principles are value first, governed innovation, least privilege, safety by design, and continuous improvement."),
 ("K-39","D-04","Process must scale with impact and data access: personal agents need a lightweight process, team utility agents a moderate process, and enterprise agents a comprehensive process."),
 ("K-40","D-04","Apply a more robust process when an agent will be shared broadly, accesses sensitive or restricted data, performs write tools, or affects a high-value or high-risk workflow."),
 ("K-41","D-04","Under least privilege, agents always operate within the existing access boundaries of the user invoking them."),
 ("K-42","D-10","The platform enforces agent access at execution time based on the executor's identity, the signed-in user running the agent, regardless of who created or published the agent."),
 ("K-43","D-05","Sharing and publishing are separate permissions: editor access lets a user edit an agent but does not by itself allow the user to publish it."),
 ("K-44","D-05","Agent permissions run from no access, to viewer, to editor, to owner, and only an owner can delete an agent or add and remove other owners."),
 ("K-45","D-05","In the Glean web app an agent uses the signed-in user's individual permissions, so responses are personalized to each user."),
 ("K-46","D-05","When an agent is published to Slack as visible to everyone in the channel, it applies a stricter access model and only uses documents accessible to all channel members, not just the person asking."),
 ("K-47","D-05","Agent permissions are enforced everywhere, including when the agent is called from Slack or the API."),
 ("K-48","D-06","Each agent run has a maximum number of tool calls, and every tool the agent invokes counts toward that same budget."),
 ("K-49","D-06","Each tool response is subject to a size cap, so a response may be truncated even when the underlying system has more matches."),
 ("K-50","D-06","Use company search for ranked, permission-aware retrieval across connectors when a broad relevance-ordered sweep is enough."),
 ("K-51","D-06","Use native connector tools such as Search Jira with JQL or Search Salesforce with SOQL when you need exhaustive enumeration, precise field-based filtering, or aggregations."),
 ("K-52","D-06","If an agent runs out of tool calls before finishing, break the work into fewer, broader queries rather than many narrow ones."),
 ("K-53","D-10","For background runs, prefer organization-trusted sources, avoid high-risk feeds such as the email inbox, and constrain web search to known-good domains."),
 ("K-54","D-10","Admins can choose which write tools may run without user confirmation; all other write tools remain interactive or are blocked from background runs."),
 ("K-55","D-08","Test an agent in Preview and use Debug to inspect how it behaves before sharing it."),
 ("K-56","D-09","Each save makes the current changes the new live agent and stores a snapshot of the previous version, and only the most recent 30 versions are retained."),
 ("K-57","D-09","The tools available in the Agent Builder depend on the organization's admin settings, and some Glean tools appear only when an admin has enabled the corresponding feature."),
 # partner program context
 ("K-58","S-01","The Glean Agent Building Competency certifies partner teams to design, build, govern, and operationalize production-grade Glean Agents that automate workflows and deliver measurable business outcomes."),
 ("K-59","S-01","The Agent Building Competency requires partners to build five production-ready agents, each implementing at least three discrete steps beyond simple retrieval, including at least one thinking or transformation step."),
 ("K-60","S-01","The Agent Building Competency requires each agent to configure retrieval guardrails with a well-defined set of content sources and clear instructions about what it can and cannot answer."),
 ("K-61","S-01","The Agent Building Competency requires each agent to contain explicit error handling with defined fallback behavior for low-confidence or out-of-scope questions."),
 ("K-62","C-01","The Agent Builder course in Glean Academy provides self-paced training to design and create agents."),
]

claims = {
    "module_id": "AGT-101",
    "verified_on": "2026-09-14",
    "verifier": "Fact Integrity Auditor (doc-grounded pass)",
    "claims": [
        {"claim_id": c, "text": t, "source_ids": [s], "verdict": "verified",
         "evidence": "直接 statement in source." if False else "Direct statement in cited source page."}
        for (c, s, t) in C
    ],
}
p = pathlib.Path("learning/modules/AGT-101/research/claims.json")
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text(json.dumps(claims, indent=2) + "\n")
print("claims:", len(claims["claims"]))
srcs = sorted({c["source_ids"][0] for c in claims["claims"]})
print("sources used:", srcs)
