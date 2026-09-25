import json, pathlib

BANDS = [
    {
        "id": "BAND-01", "archetype": "hook", "surface": "white", "rail": "hero",
        "eyebrow": "Agent foundations · Module 1 of the agent series",
        "head_lead": "A partner asks you to build an agent.",
        "head_trail": "Where do you start?",
        "lead": "Not with the builder. Start with what an agent actually is, what it is made of, and what makes one run. This module gives you the vocabulary every later agent module assumes you already have.",
        "blocks": [
            {"type": "hero_render"},
            {"type": "meta_row", "items": [
                {"k": "Level", "v": "100 · Foundations"},
                {"k": "Time", "v": "About 45 minutes"},
                {"k": "Pass mark", "v": "80% on 6 questions"},
                {"k": "Path", "v": "Agent Building Competency"}
            ]}
        ]
    },
    {
        "id": "BAND-02", "archetype": "contract", "surface": "warm", "rail": "goals",
        "eyebrow": "What you will be able to do",
        "head_lead": "Five outcomes.",
        "head_trail": "Each one is assessed.",
        "lead": None,
        "blocks": [
            {"type": "icon_row_list", "items": [
                {"icon": "define", "lead": "Define an agent.", "trail": "Say what a Glean Agent is in one sentence, and who it is for.", "claims": ["K-01", "K-03", "K-05"]},
                {"icon": "layers", "lead": "Name the parts.", "trail": "Identify the five building blocks every agent combines.", "claims": ["K-07"]},
                {"icon": "branch", "lead": "Choose a mode.", "trail": "Pick Auto mode or Workflow mode for a stated need, and know when neither fits.", "claims": ["K-16", "K-19", "K-26"]},
                {"icon": "bolt", "lead": "Start a run.", "trail": "Match the right trigger to how people will actually use the agent.", "claims": ["K-27", "K-28", "K-30", "K-33"]},
                {"icon": "shield", "lead": "Govern it.", "trail": "Apply least privilege, match process to risk, and explain who sees what.", "claims": ["K-38", "K-39", "K-41", "K-42"]}
            ]}
        ]
    },
    {
        "id": "BAND-03", "archetype": "model", "surface": "white", "rail": "definition",
        "eyebrow": "The definition",
        "head_lead": "An agent is a reusable AI solution",
        "head_trail": "that uses instructions, knowledge, tools, and context to complete a task.",
        "lead": "That single sentence from the product documentation does a lot of work. Pull it apart and you get the whole model.",
        "blocks": [
            {"type": "numbered_cards", "cards": [
                {"n": "01", "lead": "Reusable.", "trail": "Built once, then discovered, launched, and managed from the Agent Library. An agent is an asset, not a one-off prompt.", "claims": ["K-03", "K-04"]},
                {"n": "02", "lead": "It automates a task.", "trail": "From simple to complex workflows: gathering information, summarizing data, and making decisions based on previous steps.", "claims": ["K-01"]},
                {"n": "03", "lead": "It adapts.", "trail": "Set an agent to start when something specific happens, and it carries out a series of tools that adapt to changing inputs.", "claims": ["K-02"]}
            ]},
            {"type": "callout", "kind": "insight",
             "text": "Three audiences, not one. Builders create custom AI experiences. Consumers run agents other people built. Administrators govern adoption. When a partner says \u201cour users want agents,\u201d ask which of the three they mean \u2014 the answer changes what you build.",
             "claims": ["K-05"]}
        ]
    },
    {
        "id": "BAND-04", "archetype": "anatomy", "surface": "warm", "rail": "anatomy",
        "eyebrow": "Anatomy",
        "head_lead": "Five building blocks.",
        "head_trail": "Every agent combines all five.",
        "lead": "Select a part to inspect it. Every agent you review, debug, or design breaks down into these five.",
        "blocks": [
            {"type": "hotspot", "interaction_id": "INT-anatomy"}
        ]
    },
    {
        "id": "BAND-05", "archetype": "compare", "surface": "white", "rail": "modes",
        "eyebrow": "The first real decision",
        "head_lead": "Auto mode or Workflow mode.",
        "head_trail": "Pick the wrong one and you fight the tool.",
        "lead": "Both modes use the same building blocks. They differ in who decides the path: the agent, or you.",
        "blocks": [
            {"type": "mode_selector", "interaction_id": "INT-modes"},
            {"type": "callout", "kind": "note",
             "text": "A third model exists for shared work. An independent agent runs a shared workflow without depending on one person's session, with its own profile and admin-approved identities in connected apps. It is in beta, and what is available depends on the deployment \u2014 so confirm before you promise it to a customer.",
             "claims": ["K-24", "K-25", "K-26"]}
        ]
    },
    {
        "id": "BAND-06", "archetype": "practice", "surface": "warm", "rail": "practice-mode",
        "eyebrow": "Practice · no score, just feedback",
        "head_lead": "Three partner requests.",
        "head_trail": "Choose the mode you would use.",
        "lead": "Real requests, lightly paraphrased. Choose, then read why.",
        "blocks": [
            {"type": "decision_set", "interaction_id": "INT-decide"}
        ]
    },
    {
        "id": "BAND-07", "archetype": "sort", "surface": "white", "rail": "triggers",
        "eyebrow": "What starts a run",
        "head_lead": "A trigger decides two things:",
        "head_trail": "what starts the agent, and what it receives up front.",
        "lead": "Most agent design mistakes at this stage are trigger mistakes. Sort each situation onto the trigger that fits.",
        "blocks": [
            {"type": "sorter", "interaction_id": "INT-triggers"},
            {"type": "fact_rows", "rows": [
                {"lead": "Chat message.", "trail": "Every step automatically receives the user's message plus earlier messages and responses in that session.", "claims": ["K-28", "K-29"]},
                {"lead": "Input form.", "trail": "Fields are text, document, or multiple choice \u2014 and a step only sees a field you explicitly tag with [[input field name]].", "claims": ["K-30", "K-31", "K-32"]},
                {"lead": "Content.", "trail": "Runs when something changes in a connected tool. The changed content arrives as [[Trigger input]].", "claims": ["K-33"]},
                {"lead": "Schedule.", "trail": "Runs at a defined time. Good for weekly summaries, periodic checks, and routine follow-ups.", "claims": ["K-35"]}
            ]},
            {"type": "callout", "kind": "warning",
             "text": "Triggers are optional. An agent with no trigger is started by a person. Configuring a trigger is what allows it to run without anyone asking \u2014 which is exactly when governance starts to matter.",
             "claims": ["K-34"]}
        ]
    },
    {
        "id": "BAND-08", "archetype": "myth", "surface": "warm", "rail": "permissions",
        "eyebrow": "Permissions · where partners get it wrong",
        "head_lead": "Four beliefs about agent access.",
        "head_trail": "Three of them are wrong.",
        "lead": "Flip each card. These are the misconceptions that turn into customer escalations.",
        "blocks": [
            {"type": "myth_fact", "interaction_id": "INT-myths"}
        ]
    },
    {
        "id": "BAND-09", "archetype": "apply", "surface": "white", "rail": "production",
        "eyebrow": "Production readiness",
        "head_lead": "Match the process to the risk.",
        "head_trail": "Not every agent earns the same rigor.",
        "lead": "Pick the agent's scope, then build the checklist it actually needs. The competency requires this judgment in writing.",
        "blocks": [
            {"type": "risk_checklist", "interaction_id": "INT-risk"},
            {"type": "fact_rows", "rows": [
                {"lead": "Personal.", "trail": "Individual productivity. Lightweight: basic testing and narrow scoping.", "claims": ["K-39"]},
                {"lead": "Team utility.", "trail": "Internal team workflows. Moderate: basic design docs and peer review.", "claims": ["K-39"]},
                {"lead": "Enterprise.", "trail": "Department or company-wide. Comprehensive: rigorous testing, formal review, and launch planning.", "claims": ["K-39"]}
            ]}
        ]
    },
    {
        "id": "BAND-10", "archetype": "lifecycle", "surface": "warm", "rail": "lifecycle",
        "eyebrow": "The agent development lifecycle",
        "head_lead": "Six stages, five principles.",
        "head_trail": "A guide, not a set of stop-and-go gates.",
        "lead": "Agents need a more deliberate lifecycle than traditional software: they produce non-deterministic outputs, touch live enterprise data, and reason across multiple steps. Step through it.",
        "blocks": [
            {"type": "stepper", "interaction_id": "INT-lifecycle"},
            {"type": "principle_grid", "items": [
                {"lead": "Value first.", "trail": "Every agent solves a defined business problem tied to a measurable outcome.", "claims": ["K-38"]},
                {"lead": "Governed innovation.", "trail": "Encourage experimentation; require deeper review as distribution expands.", "claims": ["K-38"]},
                {"lead": "Least privilege.", "trail": "Agents operate within the access boundaries of the user invoking them.", "claims": ["K-38", "K-41"]},
                {"lead": "Safety by design.", "trail": "Guardrails and rollback built in from the start, especially for automated tools.", "claims": ["K-38"]},
                {"lead": "Continuous improvement.", "trail": "Post-launch monitoring adapts to changing data and feedback.", "claims": ["K-38"]}
            ]}
        ]
    },
    {
        "id": "BAND-11", "archetype": "prove", "surface": "ink", "rail": "check",
        "eyebrow": "Knowledge check",
        "head_lead": "Six questions.",
        "head_trail": "Five correct to pass.",
        "lead": "One question at a time. You get feedback on every answer, and you can retake it.",
        "blocks": [
            {"type": "stat_grid", "stats": [
                {"v": "5", "unit": "", "cap": "Building blocks in every agent", "count_to": 5, "claims": ["K-07"]},
                {"v": "4", "unit": "", "cap": "Trigger types to choose from", "count_to": 4, "claims": ["K-28", "K-30", "K-33", "K-35"]},
                {"v": "6", "unit": "", "cap": "ADLC stages", "count_to": 6, "claims": ["K-37"]},
                {"v": "30", "unit": "", "cap": "Agent versions retained", "count_to": 30, "claims": ["K-56"]}
            ]},
            {"type": "quiz", "interaction_id": "INT-quiz"}
        ]
    },
    {
        "id": "BAND-12", "archetype": "carry", "surface": "white", "rail": "carry",
        "eyebrow": "Carry this forward",
        "head_lead": "Your job aid.",
        "head_trail": "And where the series goes next.",
        "lead": None,
        "blocks": [
            {"type": "job_aid", "items": [
                {"lead": "Define before you build.", "trail": "Instructions, knowledge, tools, execution, output and memory. Name all five before opening the builder.", "claims": ["K-07"]},
                {"lead": "Write instructions like an SOP.", "trail": "The job, the steps, the output format, and the rules and limits. Markdown, not rigid fields.", "claims": ["K-13", "K-14"]},
                {"lead": "Give the fewest tools that work.", "trail": "Narrower tool access improves reliability and makes review possible.", "claims": ["K-15"]},
                {"lead": "Match the trigger to the user.", "trail": "Conversational, structured inputs, content change, or a clock.", "claims": ["K-27"]},
                {"lead": "Retrieval: ranked or exhaustive?", "trail": "Company search for relevance. Native connector tools when you need every record.", "claims": ["K-50", "K-51"]},
                {"lead": "Test in Preview, inspect in Debug.", "trail": "Before you share, not after.", "claims": ["K-55"]}
            ]},
            {"type": "next_steps", "items": [
                {"lead": "Next in this series.", "trail": "Building your first agent: steps, flow, and retrieval in practice."},
                {"lead": "Self-paced practice.", "trail": "The Agent Builder course in Glean Academy provides self-paced training to design and create agents.", "claims": ["K-62"]},
                {"lead": "Where this counts.", "trail": "The Agent Building Competency certifies partner teams to design, build, govern, and operationalize production-grade agents. It requires five production-ready agents, each with guardrails and explicit fallback behavior.", "claims": ["K-58", "K-59", "K-60", "K-61"]}
            ]}
        ]
    }
]

p = pathlib.Path("learning/modules/AGT-101/content/bands.json")
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text(json.dumps({"module_id": "AGT-101", "bands": BANDS}, indent=2) + "\n")

used = set()
def walk(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == "claims":
                used.update(v)
            else:
                walk(v)
    elif isinstance(o, list):
        for i in o:
            walk(i)
walk(BANDS)
print("bands:", len(BANDS))
print("claims referenced in bands:", len(used))
surf = [b["surface"] for b in BANDS]
print("surfaces:", surf)
print("ink bands:", surf.count("ink"))
