/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "OPS-108",
  "title": "Using Gleaniverse Community",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Find the right Gleaniverse area for a learning or networking goal."
    },
    {
      "id": "OBJ-02",
      "text": "Route a request to the community, a support ticket, or the Feedback and Ideas board."
    },
    {
      "id": "OBJ-03",
      "text": "Write a community post that follows the Gleaniverse Community Guidelines."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-02",
      "eyebrow": "Cold open",
      "title": "A good question in the wrong place",
      "body": "A customer admin asks you how other companies roll out agents to their teams. They plan to open a support ticket for it. The question is real, but a ticket is built to track one instance issue to a resolution. There is a place where many peers, and Glean staff, can answer it.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "By the end of this module",
      "bullets": [
        "Find the Gleaniverse area that fits a goal.",
        "Route a request to the community, a ticket, or Feedback and Ideas.",
        "Write a post that follows the community guidelines."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "The community",
      "title": "Gleaniverse is Glean's customer community",
      "body": "Gleaniverse is Glean's primary customer community: a secure space to ask product questions, share feedback, and discover best practices. Register with a work email so you receive the correct role and permissions. The home page offers three starting points: Start a Discussion, Join a Group, and Explore Academy.",
      "asset": {
        "src": "assets/svg/ops-108-a01.svg",
        "alt": "Grid of six Gleaniverse areas and what each one is for.",
        "caption": "One sign-in reaches the community and the Support Center."
      },
      "claims": [
        "C-303",
        "C-304",
        "C-302",
        "C-301"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-01",
      "eyebrow": "Tour",
      "title": "Open each area to see when to use it",
      "prompt": "Select an area to reveal what it is for.",
      "hotspots": [
        {
          "label": "Forum",
          "detail": "Start a discussion to exchange ideas and ask questions. Search first; your question may already have an answer."
        },
        {
          "label": "Events",
          "detail": "Glean Support runs a monthly live troubleshooting session on the second Thursday of each month. The Glean Product Team hosts monthly product updates on the fourth Thursday. Replays of earlier events are available on demand."
        },
        {
          "label": "Academy",
          "detail": "Glean Academy offers courses to master new topics."
        },
        {
          "label": "Feedback and Ideas",
          "detail": "Submit feature requests and product feedback on the Feedback and Ideas board."
        },
        {
          "label": "Admin Hub",
          "detail": "The Admin Hub is a restricted space for customer administrators."
        }
      ],
      "claims": [
        "C-306",
        "C-225",
        "C-312",
        "C-313",
        "C-316",
        "C-224",
        "C-315"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "The routing rule",
      "title": "Community for shared answers. Tickets for your instance.",
      "body": "For bugs and errors in a Glean instance, file a support ticket. For questions, best practices, or feature requests, use the community. Community answers let Support help multiple customers at once.",
      "asset": {
        "src": "assets/svg/ops-108-a02.svg",
        "alt": "Comparison of what belongs in the Gleaniverse community and what belongs in a Glean support ticket.",
        "caption": "If the answer can help many customers, share it in the community."
      },
      "claims": [
        "C-305",
        "C-314"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A9",
      "objective": "OBJ-02",
      "eyebrow": "Sort it",
      "title": "Where does each request belong?",
      "prompt": "Place each request where it will get the right answer.",
      "type": "sort",
      "categories": [
        "Forum",
        "Support ticket",
        "Feedback and Ideas"
      ],
      "pairs": [
        {
          "item": "How do other admins structure an agent rollout for new teams?",
          "category": "Forum",
          "why": "Questions and best practices belong in the community, where many peers can answer."
        },
        {
          "item": "Our connector shows a sync error for every user since this morning.",
          "category": "Support ticket",
          "why": "Bugs and errors in a Glean instance go to a support ticket."
        },
        {
          "item": "We would like a new setting that the product does not offer today.",
          "category": "Feedback and Ideas",
          "why": "Feature requests and product feedback go to the Feedback and Ideas board."
        }
      ],
      "takeaway": "Route by the kind of answer you need: shared knowledge, instance resolution, or product input.",
      "claims": [
        "C-305",
        "C-224"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Post well",
      "title": "Seven guidelines, one standard",
      "table": {
        "caption": "Gleaniverse Community Guidelines",
        "head": [
          "Guideline",
          "What it means"
        ],
        "rows": [
          [
            "Look before you post",
            "Search first; the question may already be answered"
          ],
          [
            "Keep sensitive info out",
            "Do not share confidential or personal data"
          ],
          [
            "Keep it relevant",
            "Glean and the broader AI industry; no spam, self-promotion, bots, or unsolicited outreach"
          ],
          [
            "Be kind",
            "Ask questions, share what you know, support each other"
          ],
          [
            "Make it a safe space",
            "No harassment, hate speech, or unwelcoming behavior"
          ],
          [
            "Make it better",
            "Share feedback and learnings often"
          ],
          [
            "Build together",
            "Jump into conversations and help others"
          ]
        ]
      },
      "footnote": "Glean may remove content or restrict access for guideline violations. Report anything that does not feel right to the Glean team.",
      "claims": [
        "C-306",
        "C-307",
        "C-308",
        "C-309",
        "C-310",
        "C-311"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A12",
      "objective": "OBJ-03",
      "eyebrow": "Review the draft",
      "title": "What is wrong with this post?",
      "type": "choice",
      "prompt": "Draft forum post: \"Our connector fails for one user. Here is our instance URL, the user's email address, and the full error log. Can anyone help?\"",
      "options": [
        {
          "id": "o2",
          "text": "Nothing. More detail always gets a faster answer.",
          "feedback": "Not this one. The guidelines say not to share confidential or personal data, however helpful it seems."
        },
        {
          "id": "o3",
          "text": "It should be posted in a group instead of the forum.",
          "feedback": "Not this one. The guidelines apply everywhere in the community, and an instance error belongs in a ticket."
        },
        {
          "id": "o1",
          "text": "It shares confidential and personal data, and it describes an instance error. Remove the details and open a support ticket instead.",
          "correct": true,
          "feedback": "Correct. Keep confidential and personal data out of the community, and send instance bugs and errors to a support ticket."
        }
      ],
      "takeaway": "Share the pattern in the community. Keep private evidence in a ticket.",
      "claims": [
        "C-307",
        "C-305"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A8",
      "objective": "OBJ-03",
      "eyebrow": "Worked example",
      "title": "Ask a question that gets answered",
      "steps": [
        {
          "title": "Search first",
          "body": "Look for an existing thread before you post."
        },
        {
          "title": "Pick the right place",
          "body": "Forum for questions, Feedback and Ideas for requests, a ticket for instance errors."
        },
        {
          "title": "Describe the goal",
          "body": "State what you want to achieve and what you tried, without confidential or personal data."
        },
        {
          "title": "Stay relevant",
          "body": "Keep it about Glean or the broader AI industry. No promotion."
        },
        {
          "title": "Close the loop",
          "body": "Share what worked so the next person benefits."
        }
      ],
      "claims": [
        "C-306",
        "C-305",
        "C-224",
        "C-307",
        "C-308",
        "C-310"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "quiz",
      "objective": "OBJ-02",
      "eyebrow": "Prove it",
      "title": "Community check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "A customer admin wants live help from Glean Support in a small group. Where should they look?",
          "options": [
            {
              "id": "b",
              "text": "Post a request on the product ideas board.",
              "feedback": "No. The Feedback and Ideas board is for feature requests and product feedback."
            },
            {
              "id": "a",
              "text": "Events: the monthly troubleshooting session on the second Thursday.",
              "correct": true,
              "feedback": "Correct. Glean Support runs it every month and splits into small groups."
            },
            {
              "id": "c",
              "text": "The Admin Hub only.",
              "feedback": "No. The Admin Hub is a restricted space; the live session is listed in Events."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-01",
          "stem": "Why should a user register for Gleaniverse with a work email?",
          "options": [
            {
              "id": "b",
              "text": "Because personal email addresses are shown publicly.",
              "feedback": "No. The documented reason is correct role and permission assignment."
            },
            {
              "id": "c",
              "text": "It is optional and has no effect.",
              "feedback": "No. A work email affects the role and permissions the account receives."
            },
            {
              "id": "a",
              "text": "So they receive the correct role and permissions.",
              "correct": true,
              "feedback": "Correct. The work email tags the account with the right access."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "A customer reports an error in their own Glean instance. Where does it go?",
          "options": [
            {
              "id": "a",
              "text": "A support ticket.",
              "correct": true,
              "feedback": "Correct. Bugs and errors in a Glean instance go to a support ticket."
            },
            {
              "id": "b",
              "text": "A new forum thread with the error log.",
              "feedback": "No. Instance errors go to support, and logs can hold confidential data."
            },
            {
              "id": "c",
              "text": "Submit it as a product idea for voting.",
              "feedback": "No. The Feedback and Ideas board is for feature requests, not errors."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "Where should a feature request go?",
          "options": [
            {
              "id": "b",
              "text": "An Urgent support ticket.",
              "feedback": "No. Feature requests are not incidents, and over-escalating slows critical work."
            },
            {
              "id": "c",
              "text": "An email to a Glean contact.",
              "feedback": "No. The documented path is the Feedback and Ideas board."
            },
            {
              "id": "a",
              "text": "The Feedback and Ideas board in Gleaniverse.",
              "correct": true,
              "feedback": "Correct. Feature requests and product feedback go there."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "Which post breaks the community guidelines?",
          "options": [
            {
              "id": "b",
              "text": "A question that follows a search that found no existing thread.",
              "feedback": "No. Searching first follows the guidelines."
            },
            {
              "id": "a",
              "text": "A post that includes a user's email address and an internal document link.",
              "correct": true,
              "feedback": "Correct. Do not share confidential or personal data."
            },
            {
              "id": "c",
              "text": "A reply that shares what worked for another admin.",
              "feedback": "No. Sharing learnings is encouraged."
            }
          ]
        }
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "A14",
      "objective": "OBJ-01",
      "eyebrow": "Carry this with you",
      "title": "If the answer can help many, share it.",
      "body": "Community answers let Support help multiple customers at once. Use the community for questions, best practices, and ideas, and keep instance issues in a ticket.",
      "badge": "Gleaniverse Community: complete",
      "signature": true,
      "claims": [
        "C-314",
        "C-305"
      ]
    }
  ]
};
