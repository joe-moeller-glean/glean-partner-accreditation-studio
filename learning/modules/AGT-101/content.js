/* Generated from content/, interactions/, assessment/. Do not edit by hand. */
window.AGT101 = {
 "moduleId": "AGT-101",
 "bands": [
  {
   "id": "BAND-01",
   "archetype": "hook",
   "surface": "white",
   "rail": "hero",
   "eyebrow": "Agent foundations · Module 1 of the agent series",
   "head_lead": "A partner asks you to build an agent.",
   "head_trail": "Where do you start?",
   "lead": "Not with the builder. Start with what an agent actually is, what it is made of, and what makes one run. This module gives you the vocabulary every later agent module assumes you already have.",
   "blocks": [
    {
     "type": "hero_render"
    },
    {
     "type": "meta_row",
     "items": [
      {
       "k": "Level",
       "v": "100 · Foundations"
      },
      {
       "k": "Time",
       "v": "About 45 minutes"
      },
      {
       "k": "Pass mark",
       "v": "80% on 6 questions"
      },
      {
       "k": "Path",
       "v": "Agent Building Competency"
      }
     ]
    }
   ]
  },
  {
   "id": "BAND-02",
   "archetype": "contract",
   "surface": "warm",
   "rail": "goals",
   "eyebrow": "What you will be able to do",
   "head_lead": "Five outcomes.",
   "head_trail": "Each one is assessed.",
   "lead": null,
   "blocks": [
    {
     "type": "icon_row_list",
     "items": [
      {
       "icon": "define",
       "lead": "Define an agent.",
       "trail": "Say what a Glean Agent is in one sentence, and who it is for."
      },
      {
       "icon": "layers",
       "lead": "Name the parts.",
       "trail": "Identify the five building blocks every agent combines."
      },
      {
       "icon": "branch",
       "lead": "Choose a mode.",
       "trail": "Pick Auto mode or Workflow mode for a stated need, and know when neither fits."
      },
      {
       "icon": "bolt",
       "lead": "Start a run.",
       "trail": "Match the right trigger to how people will actually use the agent."
      },
      {
       "icon": "shield",
       "lead": "Govern it.",
       "trail": "Apply least privilege, match process to risk, and explain who sees what."
      }
     ]
    }
   ]
  },
  {
   "id": "BAND-03",
   "archetype": "model",
   "surface": "white",
   "rail": "definition",
   "eyebrow": "The definition",
   "head_lead": "An agent is a reusable AI solution",
   "head_trail": "that uses instructions, knowledge, tools, and context to complete a task.",
   "lead": "That single sentence from the product documentation does a lot of work. Pull it apart and you get the whole model.",
   "blocks": [
    {
     "type": "numbered_cards",
     "cards": [
      {
       "n": "01",
       "lead": "Reusable.",
       "trail": "Built once, then discovered, launched, and managed from the Agent Library. An agent is an asset, not a one-off prompt."
      },
      {
       "n": "02",
       "lead": "It automates a task.",
       "trail": "From simple to complex workflows: gathering information, summarizing data, and making decisions based on previous steps."
      },
      {
       "n": "03",
       "lead": "It adapts.",
       "trail": "Set an agent to start when something specific happens, and it carries out a series of tools that adapt to changing inputs."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "insight",
     "text": "Three audiences, not one. Builders create custom AI experiences. Consumers run agents other people built. Administrators govern adoption. When a partner says “our users want agents,” ask which of the three they mean — the answer changes what you build."
    }
   ]
  },
  {
   "id": "BAND-04",
   "archetype": "anatomy",
   "surface": "warm",
   "rail": "anatomy",
   "eyebrow": "Anatomy",
   "head_lead": "Five building blocks.",
   "head_trail": "Every agent combines all five.",
   "lead": "Select a part to inspect it. Every agent you review, debug, or design breaks down into these five.",
   "blocks": [
    {
     "type": "hotspot",
     "interaction_id": "INT-anatomy"
    }
   ]
  },
  {
   "id": "BAND-05",
   "archetype": "compare",
   "surface": "white",
   "rail": "modes",
   "eyebrow": "The first real decision",
   "head_lead": "Auto mode or Workflow mode.",
   "head_trail": "Pick the wrong one and you fight the tool.",
   "lead": "Both modes use the same building blocks. They differ in who decides the path: the agent, or you.",
   "blocks": [
    {
     "type": "mode_selector",
     "interaction_id": "INT-modes"
    },
    {
     "type": "callout",
     "kind": "note",
     "text": "A third model exists for shared work. An independent agent runs a shared workflow without depending on one person's session, with its own profile and admin-approved identities in connected apps. It is in beta, and what is available depends on the deployment — so confirm before you promise it to a customer."
    }
   ]
  },
  {
   "id": "BAND-06",
   "archetype": "practice",
   "surface": "warm",
   "rail": "practice-mode",
   "eyebrow": "Practice · no score, just feedback",
   "head_lead": "Three partner requests.",
   "head_trail": "Choose the mode you would use.",
   "lead": "Real requests, lightly paraphrased. Choose, then read why.",
   "blocks": [
    {
     "type": "decision_set",
     "interaction_id": "INT-decide"
    }
   ]
  },
  {
   "id": "BAND-07",
   "archetype": "sort",
   "surface": "white",
   "rail": "triggers",
   "eyebrow": "What starts a run",
   "head_lead": "A trigger decides two things:",
   "head_trail": "what starts the agent, and what it receives up front.",
   "lead": "Most agent design mistakes at this stage are trigger mistakes. Sort each situation onto the trigger that fits.",
   "blocks": [
    {
     "type": "sorter",
     "interaction_id": "INT-triggers"
    },
    {
     "type": "fact_rows",
     "rows": [
      {
       "lead": "Chat message.",
       "trail": "Every step automatically receives the user's message plus earlier messages and responses in that session."
      },
      {
       "lead": "Input form.",
       "trail": "Fields are text, document, or multiple choice — and a step only sees a field you explicitly tag with [[input field name]]."
      },
      {
       "lead": "Content.",
       "trail": "Runs when something changes in a connected tool. The changed content arrives as [[Trigger input]]."
      },
      {
       "lead": "Schedule.",
       "trail": "Runs at a defined time. Good for weekly summaries, periodic checks, and routine follow-ups."
      }
     ]
    },
    {
     "type": "callout",
     "kind": "warning",
     "text": "Triggers are optional. An agent with no trigger is started by a person. Configuring a trigger is what allows it to run without anyone asking — which is exactly when governance starts to matter."
    }
   ]
  },
  {
   "id": "BAND-08",
   "archetype": "myth",
   "surface": "warm",
   "rail": "permissions",
   "eyebrow": "Permissions · where partners get it wrong",
   "head_lead": "Four beliefs about agent access.",
   "head_trail": "Three of them are wrong.",
   "lead": "Flip each card. These are the misconceptions that turn into customer escalations.",
   "blocks": [
    {
     "type": "myth_fact",
     "interaction_id": "INT-myths"
    }
   ]
  },
  {
   "id": "BAND-09",
   "archetype": "apply",
   "surface": "white",
   "rail": "production",
   "eyebrow": "Production readiness",
   "head_lead": "Match the process to the risk.",
   "head_trail": "Not every agent earns the same rigor.",
   "lead": "Pick the agent's scope, then build the checklist it actually needs. The competency requires this judgment in writing.",
   "blocks": [
    {
     "type": "risk_checklist",
     "interaction_id": "INT-risk"
    },
    {
     "type": "fact_rows",
     "rows": [
      {
       "lead": "Personal.",
       "trail": "Individual productivity. Lightweight: basic testing and narrow scoping."
      },
      {
       "lead": "Team utility.",
       "trail": "Internal team workflows. Moderate: basic design docs and peer review."
      },
      {
       "lead": "Enterprise.",
       "trail": "Department or company-wide. Comprehensive: rigorous testing, formal review, and launch planning."
      }
     ]
    }
   ]
  },
  {
   "id": "BAND-10",
   "archetype": "lifecycle",
   "surface": "warm",
   "rail": "lifecycle",
   "eyebrow": "The agent development lifecycle",
   "head_lead": "Six stages, five principles.",
   "head_trail": "A guide, not a set of stop-and-go gates.",
   "lead": "Agents need a more deliberate lifecycle than traditional software: they produce non-deterministic outputs, touch live enterprise data, and reason across multiple steps. Step through it.",
   "blocks": [
    {
     "type": "stepper",
     "interaction_id": "INT-lifecycle"
    },
    {
     "type": "principle_grid",
     "items": [
      {
       "lead": "Value first.",
       "trail": "Every agent solves a defined business problem tied to a measurable outcome."
      },
      {
       "lead": "Governed innovation.",
       "trail": "Encourage experimentation; require deeper review as distribution expands."
      },
      {
       "lead": "Least privilege.",
       "trail": "Agents operate within the access boundaries of the user invoking them."
      },
      {
       "lead": "Safety by design.",
       "trail": "Guardrails and rollback built in from the start, especially for automated tools."
      },
      {
       "lead": "Continuous improvement.",
       "trail": "Post-launch monitoring adapts to changing data and feedback."
      }
     ]
    }
   ]
  },
  {
   "id": "BAND-11",
   "archetype": "prove",
   "surface": "ink",
   "rail": "check",
   "eyebrow": "Knowledge check",
   "head_lead": "Six questions.",
   "head_trail": "Five correct to pass.",
   "lead": "One question at a time. You get feedback on every answer, and you can retake it.",
   "blocks": [
    {
     "type": "stat_grid",
     "stats": [
      {
       "v": "5",
       "unit": "",
       "cap": "Building blocks in every agent",
       "count_to": 5
      },
      {
       "v": "4",
       "unit": "",
       "cap": "Trigger types to choose from",
       "count_to": 4
      },
      {
       "v": "6",
       "unit": "",
       "cap": "ADLC stages",
       "count_to": 6
      },
      {
       "v": "30",
       "unit": "",
       "cap": "Agent versions retained",
       "count_to": 30
      }
     ]
    },
    {
     "type": "quiz",
     "interaction_id": "INT-quiz"
    }
   ]
  },
  {
   "id": "BAND-12",
   "archetype": "carry",
   "surface": "white",
   "rail": "carry",
   "eyebrow": "Carry this forward",
   "head_lead": "Your job aid.",
   "head_trail": "And where the series goes next.",
   "lead": null,
   "blocks": [
    {
     "type": "job_aid",
     "items": [
      {
       "lead": "Define before you build.",
       "trail": "Instructions, knowledge, tools, execution, output and memory. Name all five before opening the builder."
      },
      {
       "lead": "Write instructions like an SOP.",
       "trail": "The job, the steps, the output format, and the rules and limits. Markdown, not rigid fields."
      },
      {
       "lead": "Give the fewest tools that work.",
       "trail": "Narrower tool access improves reliability and makes review possible."
      },
      {
       "lead": "Match the trigger to the user.",
       "trail": "Conversational, structured inputs, content change, or a clock."
      },
      {
       "lead": "Retrieval: ranked or exhaustive?",
       "trail": "Company search for relevance. Native connector tools when you need every record."
      },
      {
       "lead": "Test in Preview, inspect in Debug.",
       "trail": "Before you share, not after."
      }
     ]
    },
    {
     "type": "next_steps",
     "items": [
      {
       "lead": "Next in this series.",
       "trail": "Building your first agent: steps, flow, and retrieval in practice."
      },
      {
       "lead": "Self-paced practice.",
       "trail": "The Agent Builder course in Glean Academy provides self-paced training to design and create agents."
      },
      {
       "lead": "Where this counts.",
       "trail": "The Agent Building Competency certifies partner teams to design, build, govern, and operationalize production-grade agents. It requires five production-ready agents, each with guardrails and explicit fallback behavior."
      }
     ]
    }
   ]
  }
 ],
 "interactions": {
  "INT-anatomy": {
   "id": "INT-anatomy",
   "type": "hotspot",
   "band": "BAND-04",
   "prompt": "Select a building block to inspect it.",
   "diagram": "assets/agent-anatomy.svg",
   "hotspots": [
    {
     "id": "h1",
     "n": "01",
     "label": "Goal and instructions",
     "body": "Target outcomes and behavioral rules. Write them like an SOP for a teammate: the job, the steps or reasoning to follow, the output format, and any rules, limits, or safety constraints."
    },
    {
     "id": "h2",
     "n": "02",
     "label": "Knowledge and context",
     "body": "The information available to the agent. Add only what the workflow requires — a smaller, reviewable source list beats an unbounded one."
    },
    {
     "id": "h3",
     "n": "03",
     "label": "Tools and actions",
     "body": "The tasks the agent performs: read documents, tickets, records, or calendars; write to connectors; draft text; update external systems. Give the fewest tools that do the job — it improves reliability and makes review possible."
    },
    {
     "id": "h4",
     "n": "04",
     "label": "Execution",
     "body": "How the work runs: Auto mode, where the agent determines the path, or Workflow mode, where you define steps and flow explicitly."
    },
    {
     "id": "h5",
     "n": "05",
     "label": "Output and memory",
     "body": "The results produced and the context retained during a run. In Workflow mode each step writes to working memory, and by default a step sees only the output of the step immediately before it."
    }
   ]
  },
  "INT-modes": {
   "id": "INT-modes",
   "type": "tabs",
   "band": "BAND-05",
   "prompt": "Compare the two modes.",
   "panels": [
    {
     "id": "auto",
     "label": "Auto mode",
     "tagline": "The agent decides the path.",
     "rows": [
      {
       "k": "Start here when",
       "v": "The task is open-ended: research, analysis, summarization, drafting."
      },
      {
       "k": "How you build",
       "v": "Describe the outcome in natural language, then review, refine, and test the draft in Builder Assistant."
      },
      {
       "k": "Default?",
       "v": "Yes — the default starting experience for most use cases."
      },
      {
       "k": "Scaling up",
       "v": "The Task tool splits complex requests into sub-tasks for sub-agents, preserving agent permissions and error handling."
      }
     ]
    },
    {
     "id": "workflow",
     "label": "Workflow mode",
     "tagline": "You decide the path.",
     "rows": [
      {
       "k": "Start here when",
       "v": "The process is fixed and repeatable and needs explicit control over each step, branch, and hand-off."
      },
      {
       "k": "How you build",
       "v": "Configure steps manually. A step is one unit of work; flow controls how the agent moves between steps."
      },
      {
       "k": "Logic available",
       "v": "Branches that pick a path on a condition, and calls to sub-agents that return to the main flow."
      },
      {
       "k": "Memory model",
       "v": "Each step saves output to working memory; by default a step receives only the previous step's output."
      }
     ]
    }
   ]
  },
  "INT-decide": {
   "id": "INT-decide",
   "type": "decision_set",
   "band": "BAND-06",
   "scored": false,
   "items": [
    {
     "id": "d1",
     "scenario": "“Our support leads want to paste in a ticket and get a suggested resolution, using the same four steps every time, so two leads never get different treatment.”",
     "options": [
      {
       "id": "a",
       "label": "Auto mode",
       "correct": false,
       "feedback": "Auto mode lets the agent choose its own path, so two runs can differ. The requirement here is explicitly that every ticket gets the same treatment."
      },
      {
       "id": "b",
       "label": "Workflow mode",
       "correct": true,
       "feedback": "Correct. Fixed, repeatable, and the customer wants control over each step — that is exactly what Workflow mode is for."
      },
      {
       "id": "c",
       "label": "Independent agent",
       "correct": false,
       "feedback": "Not yet. A lead starts and supervises each run, so there is no need for an agent-owned identity running without a user session."
      }
     ]
    },
    {
     "id": "d2",
     "scenario": "“Our strategy team wants to ask broad research questions across Confluence, Slack, and the web — different question every time, and they want a written summary.”",
     "options": [
      {
       "id": "a",
       "label": "Auto mode",
       "correct": true,
       "feedback": "Correct. Research, analysis, summarization, and drafting are the Auto mode patterns, and the request changes every time."
      },
      {
       "id": "b",
       "label": "Workflow mode",
       "correct": false,
       "feedback": "You would be hand-building a path for a question that changes every time. Workflow mode pays off when the sequence is fixed."
      },
      {
       "id": "c",
       "label": "Independent agent",
       "correct": false,
       "feedback": "An analyst is present and supervising, so the independent execution model adds governance overhead with no benefit."
      }
     ]
    },
    {
     "id": "d3",
     "scenario": "“We want something that watches our incident channel around the clock, replies in the channel under its own name, and keeps working until the incident closes — no one is going to babysit it.”",
     "options": [
      {
       "id": "a",
       "label": "Auto mode agent a user runs",
       "correct": false,
       "feedback": "This depends on a person starting it inside their own session, which is the thing the customer said will not happen."
      },
      {
       "id": "b",
       "label": "Workflow mode agent on a schedule",
       "correct": false,
       "feedback": "Closer, but a schedule fires at fixed times and still runs per subscribing user. It cannot hold a persistent presence in the channel under its own identity."
      },
      {
       "id": "c",
       "label": "Independent agent",
       "correct": true,
       "feedback": "Correct — monitoring events, responding in a shared channel, and continuing until work resolves is the independent agent model. Flag that it is in beta and availability depends on the deployment."
      }
     ]
    }
   ]
  },
  "INT-triggers": {
   "id": "INT-triggers",
   "type": "sorter",
   "band": "BAND-07",
   "prompt": "Assign each situation to the trigger that fits.",
   "buckets": [
    {
     "id": "chat",
     "label": "Chat message"
    },
    {
     "id": "form",
     "label": "Input form"
    },
    {
     "id": "content",
     "label": "Content change"
    },
    {
     "id": "schedule",
     "label": "Schedule"
    }
   ],
   "cards": [
    {
     "id": "c1",
     "text": "Employees ask free-form HR policy questions and sometimes attach a document.",
     "bucket": "chat",
     "why": "Open-ended and conversational, with document upload — the chat message trigger's chatbox."
    },
    {
     "id": "c2",
     "text": "The agent needs a ticket ID and a date range before it can start.",
     "bucket": "form",
     "why": "Specific required fields up front is the input form case. Remember each step only sees a field you tag with [[input field name]]."
    },
    {
     "id": "c3",
     "text": "A new call transcript lands in the connected system and should be summarized right away.",
     "bucket": "content",
     "why": "Something changed in a connected tool, and the changed content arrives as [[Trigger input]]."
    },
    {
     "id": "c4",
     "text": "Every Monday at 8am, post a digest of last week's open risks.",
     "bucket": "schedule",
     "why": "A recurring summary at a defined time is the scheduled run case."
    },
    {
     "id": "c5",
     "text": "A reviewer picks one of three review depths from a fixed list, then the agent runs.",
     "bucket": "form",
     "why": "A fixed set of options is a multiple choice input field on an input form."
    },
    {
     "id": "c6",
     "text": "A support doc is edited, and the agent should check whether a related article now contradicts it.",
     "bucket": "content",
     "why": "Driven by a change in connected content, not by a person or a clock."
    }
   ]
  },
  "INT-myths": {
   "id": "INT-myths",
   "type": "myth_fact",
   "band": "BAND-08",
   "prompt": "Decide whether each statement is true, then reveal the answer.",
   "items": [
    {
     "id": "m1",
     "claim_text": "“If I build and publish an agent, it runs with my access, so my colleagues will see what I can see.”",
     "is_true": false,
     "verdict": "Myth.",
     "body": "Access is enforced at execution time based on the identity of the signed-in user running the agent, regardless of who created or published it. In the web app the agent uses the running user's own permissions, so answers are personalized per user."
    },
    {
     "id": "m2",
     "claim_text": "“An agent behaves the same in Slack as it does in the web app.”",
     "is_true": false,
     "verdict": "Myth — and this one causes real escalations.",
     "body": "When an agent is published to Slack as visible to everyone in the channel, it applies a stricter model: it only uses documents accessible to all channel members, not just the person asking. That is deliberate — it stops restricted documents leaking into a broad channel — but it means the same question can return less in Slack."
    },
    {
     "id": "m3",
     "claim_text": "“Giving someone editor access lets them publish the agent.”",
     "is_true": false,
     "verdict": "Myth.",
     "body": "Sharing and publishing are separate permissions. Editor access lets a user edit an agent but does not by itself allow publishing. Only an owner can delete an agent or add and remove other owners."
    },
    {
     "id": "m4",
     "claim_text": "“Agent permissions still apply when the agent is called from the API.”",
     "is_true": true,
     "verdict": "Fact.",
     "body": "Permissions are enforced everywhere, including when the agent is invoked from Slack or the API. Governance does not have a side door."
    }
   ]
  },
  "INT-risk": {
   "id": "INT-risk",
   "type": "risk_checklist",
   "band": "BAND-09",
   "prompt": "Select every factor that applies to the agent you are scoping.",
   "factors": [
    {
     "id": "f1",
     "text": "Will be shared with a broad audience",
     "weight": 1
    },
    {
     "id": "f2",
     "text": "Accesses sensitive or restricted data",
     "weight": 1
    },
    {
     "id": "f3",
     "text": "Performs write tools, for example updating tickets or sending email",
     "weight": 1
    },
    {
     "id": "f4",
     "text": "Affects a high-value or high-risk business workflow",
     "weight": 1
    },
    {
     "id": "f5",
     "text": "Runs in the background with no per-run confirmation",
     "weight": 1
    }
   ],
   "results": [
    {
     "max": 0,
     "tier": "Personal",
     "process": "Lightweight",
     "body": "Basic testing and narrow scoping. Test in Preview and inspect the run in Debug before you share it."
    },
    {
     "max": 2,
     "tier": "Team utility",
     "process": "Moderate",
     "body": "Basic design docs and peer review. Name an owner, write down the intended scope, and have someone else read the instructions."
    },
    {
     "max": 5,
     "tier": "Enterprise",
     "process": "Comprehensive",
     "body": "Rigorous testing, formal review, and launch planning. For background runs: prefer organization-trusted sources, avoid high-risk feeds such as the email inbox, constrain web search to known-good domains, and remember that admins control which write tools may run without user confirmation."
    }
   ],
   "disclosure": "The three tiers and their process depths come from the agent development lifecycle documentation. How many factors tip you from one tier to the next is a studio rule of thumb for this exercise, not product guidance — in real scoping, any single high-risk factor can justify the deepest review."
  },
  "INT-lifecycle": {
   "id": "INT-lifecycle",
   "type": "stepper",
   "band": "BAND-10",
   "prompt": "Step through the lifecycle.",
   "steps": [
    {
     "n": 1,
     "label": "Plan and design",
     "body": "Define the specific problem, the target users, and the intended scope. Start with a clear business need, not a vague automation idea."
    },
    {
     "n": 2,
     "label": "Define quality",
     "body": "Decide how you will measure success before you build — for example, the agent must correctly cite sources every time."
    },
    {
     "n": 3,
     "label": "Build safely",
     "body": "Implement the workflow with clear boundaries, system prompts, and safeguards."
    },
    {
     "n": 4,
     "label": "Test and launch",
     "body": "Validate reliability and permissions, and make sure users have documentation on how to interact with the agent. Test in Preview and inspect behavior in Debug."
    },
    {
     "n": 5,
     "label": "Manage versions",
     "body": "Use drafts and versioning to update the agent without interrupting live workflows. Each save becomes the new live version and snapshots the previous one; the most recent 30 versions are kept."
    },
    {
     "n": 6,
     "label": "Govern and monitor",
     "body": "Track adoption and accuracy, and review ownership regularly so the agent stays relevant. Every agent needs a maintainer."
    }
   ]
  }
 },
 "quiz": {
  "mastery": 80,
  "items": [
   {
    "id": "Q-01",
    "objective_id": "OBJ-01",
    "type": "single",
    "stem": "A partner asks you to define a Glean Agent in one sentence. Which answer is accurate?",
    "options": [
     {
      "id": "a",
      "text": "A reusable AI solution that uses instructions, knowledge, tools, and context to complete tasks."
     },
     {
      "id": "b",
      "text": "A saved search that reruns automatically and emails the results."
     },
     {
      "id": "c",
      "text": "A chatbot that answers questions from a single uploaded knowledge base."
     },
     {
      "id": "d",
      "text": "A connector that indexes a new data source so it becomes searchable."
     }
    ]
   },
   {
    "id": "Q-02",
    "objective_id": "OBJ-02",
    "type": "multi",
    "stem": "Which of these are among the five core building blocks that every agent combines? Select all that apply.",
    "options": [
     {
      "id": "a",
      "text": "Goal and instructions"
     },
     {
      "id": "b",
      "text": "Knowledge and context"
     },
     {
      "id": "c",
      "text": "Output and memory"
     },
     {
      "id": "d",
      "text": "Billing and cost centre"
     },
     {
      "id": "e",
      "text": "Index refresh schedule"
     }
    ]
   },
   {
    "id": "Q-03",
    "objective_id": "OBJ-03",
    "type": "single",
    "stem": "A customer needs an agent that runs the same five steps in the same order every time, because an auditor will review the output. Which mode fits?",
    "options": [
     {
      "id": "a",
      "text": "Workflow mode, because it gives explicit control over each step, branch, and hand-off."
     },
     {
      "id": "b",
      "text": "Auto mode, because the agent will work out the best path each time."
     },
     {
      "id": "c",
      "text": "Either one, because both produce identical execution paths."
     },
     {
      "id": "d",
      "text": "Neither — auditable work cannot be done with an agent."
     }
    ]
   },
   {
    "id": "Q-04",
    "objective_id": "OBJ-04",
    "type": "single",
    "stem": "An agent must start automatically whenever a document changes in a connected tool, and act on what changed. Which trigger, and how does the agent receive the change?",
    "options": [
     {
      "id": "a",
      "text": "A content trigger, and the changed content is passed in as [[Trigger input]]."
     },
     {
      "id": "b",
      "text": "A chat message trigger, and the user pastes the change into the chatbox."
     },
     {
      "id": "c",
      "text": "An input form trigger, and the user selects the document from a multiple choice field."
     },
     {
      "id": "d",
      "text": "A schedule trigger, and the agent re-reads the whole source each run."
     }
    ]
   },
   {
    "id": "Q-05",
    "objective_id": "OBJ-05",
    "type": "single",
    "stem": "A partner publishes an HR agent to a Slack channel as visible to everyone in the channel, and reports that it returns less than the same agent in the web app. What is happening?",
    "options": [
     {
      "id": "a",
      "text": "Expected behavior: for channel-wide visibility the agent only uses documents accessible to all channel members, which prevents restricted content being exposed in a broad channel."
     },
     {
      "id": "b",
      "text": "A defect — permissions should be identical on every surface, so it should be escalated as a bug."
     },
     {
      "id": "c",
      "text": "The agent lost its permissions when published, and the owner must re-grant document access."
     },
     {
      "id": "d",
      "text": "Slack does not support knowledge retrieval, so the agent falls back to web search."
     }
    ]
   },
   {
    "id": "Q-06",
    "objective_id": "OBJ-05",
    "type": "single",
    "stem": "Your partner is scoping an agent that will be company-wide, read restricted data, and update Jira tickets. What does the lifecycle guidance say about process?",
    "options": [
     {
      "id": "a",
      "text": "Apply a comprehensive process: rigorous testing, formal review, and launch planning."
     },
     {
      "id": "b",
      "text": "Apply a lightweight process, then add review only if users complain."
     },
     {
      "id": "c",
      "text": "Process depth is a matter of team preference and is not tied to scope."
     },
     {
      "id": "d",
      "text": "Skip the lifecycle, because write tools are blocked by the platform anyway."
     }
    ]
   }
  ],
  "key": {
   "Q-01": {
    "correct": "a",
    "feedback": {
     "a": "Correct. That is the product definition, and the four elements it names are what you check on every agent review.",
     "b": "A schedule can start an agent, but a trigger is not the agent. An agent carries out adapting, multi-step work.",
     "c": "Too narrow. Agents combine instructions, knowledge, tools, and context, and can act across many connected systems.",
     "d": "That describes a connector. Connectors supply knowledge; the agent is what uses it."
    }
   },
   "Q-02": {
    "correct": [
     "a",
     "b",
     "c"
    ],
    "feedback": {
     "a": "Correct — target outcomes and behavioral rules.",
     "b": "Correct — the information available to the agent.",
     "c": "Correct — results produced and context retained during a run.",
     "d": "Not a building block. Cost matters operationally, but it is not part of the agent model.",
     "e": "Not a building block. That belongs to connectors and indexing, not the agent itself."
    }
   },
   "Q-03": {
    "correct": "a",
    "feedback": {
     "a": "Correct. Fixed and repeatable with explicit control is exactly the Workflow mode case.",
     "b": "Auto mode determines its own path, so runs can vary. That is the opposite of what an auditor wants here.",
     "c": "They differ in a way that matters: Auto mode decides its own path, Workflow mode follows yours.",
     "d": "Agents can absolutely support auditable work — that is why Workflow mode and the lifecycle exist."
    }
   },
   "Q-04": {
    "correct": "a",
    "feedback": {
     "a": "Correct on both halves. Content triggers fire on a change in a connected tool and hand the changed content to the agent as [[Trigger input]].",
     "b": "That requires a person to notice and paste, which defeats the point of automatic execution.",
     "c": "An input form needs a person to fill it in first, so it cannot start on its own.",
     "d": "A schedule fires on the clock, not on the change, and would miss or duplicate work."
    }
   },
   "Q-05": {
    "correct": "a",
    "feedback": {
     "a": "Correct. It is a deliberate stricter access model for channel-wide visibility. To match web behavior, publish as visible only to the user with the option to share.",
     "b": "Not a defect. Permissions are enforced everywhere, but channel-wide visibility deliberately narrows which documents can be used.",
     "c": "Agents do not hold their own document grants. Access is evaluated at execution time against the relevant user or channel scope.",
     "d": "Retrieval still works in Slack. What changed is the set of documents the agent is allowed to draw on."
    }
   },
   "Q-06": {
    "correct": "a",
    "feedback": {
     "a": "Correct. Broad audience, sensitive data, and write tools each independently call for a more robust process, and enterprise scope means comprehensive.",
     "b": "Reactive review after a broad launch is precisely what the lifecycle exists to prevent.",
     "c": "Process must scale with impact and data access — that is the explicit guidance.",
     "d": "Write tools are governed, not universally blocked. Admins choose which may run without confirmation, which is a reason for more review, not less."
    }
   }
  }
 },
 "icons": {
  "bolt": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><path d=\"M13 3L5 14h6l-1 7 8-11h-6l1-7z\"/></svg>",
  "book": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><path d=\"M4 5v14h16V5\"/><path d=\"M4 5a3 3 0 0 1 3-3h13v17H7a3 3 0 0 0-3 3\"/></svg>",
  "branch": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><circle cx=\"6\" cy=\"6\" r=\"2\"/><circle cx=\"18\" cy=\"18\" r=\"2\"/><circle cx=\"6\" cy=\"18\" r=\"2\"/><path d=\"M6 8v8M8 18h8M6 8a10 10 0 0 0 10 8\"/></svg>",
  "chat": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><path d=\"M21 12a8 8 0 0 1-8 8H8l-5 3 1-5a8 8 0 1 1 17-6z\"/></svg>",
  "check": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8 12l3 3 5-6\"/></svg>",
  "clock": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l4 2\"/></svg>",
  "cycle": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><path d=\"M4 12a8 8 0 0 1 13-6l2 2\"/><path d=\"M20 12a8 8 0 0 1-13 6l-2-2\"/><path d=\"M19 3v5h-5M5 21v-5h5\"/></svg>",
  "define": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 8v8M8 12h8\"/></svg>",
  "doc": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z\"/><path d=\"M14 3v5h5\"/></svg>",
  "flag": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><path d=\"M5 21V4h9l-1 3h6l-2 5 2 5h-8l1-3H5\"/></svg>",
  "form": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><path d=\"M8 8h8M8 12h8M8 16h4\"/></svg>",
  "layers": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><path d=\"M12 3l9 5-9 5-9-5 9-5z\"/><path d=\"M3 13l9 5 9-5\"/></svg>",
  "memory": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><rect x=\"5\" y=\"5\" width=\"14\" height=\"14\" rx=\"2\"/><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"/><path d=\"M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3\"/></svg>",
  "play": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M10 8l6 4-6 4V8z\"/></svg>",
  "scale": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><path d=\"M12 4v16M6 8h12\"/><path d=\"M6 8l-3 6h6l-3-6zM18 8l-3 6h6l-3-6z\"/><path d=\"M8 20h8\"/></svg>",
  "shield": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><path d=\"M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z\"/><path d=\"M9 12l2 2 4-4\"/></svg>",
  "target": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/></svg>",
  "tool": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-hidden=\"true\"><path d=\"M14 7a4 4 0 1 0 4 4l3 3-3 3-3-3a4 4 0 0 1-4-4\"/><path d=\"M11 13L4 20\"/></svg>"
 },
 "anatomyAlt": "Diagram of the five building blocks of a Glean Agent: goal and instructions at the top, knowledge and context on the left, tools and actions on the right, execution in the centre running in Auto mode or Workflow mode, and output and memory at the bottom.",
 "sourceCount": 12,
 "claimCount": 62
};
