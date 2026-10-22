/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "BLD-202",
  "title": "Custom Connector Implementation Lab",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Deliver a connector that indexes users, permissions, and documents, updates automatically, and retries with backoff."
    },
    {
      "id": "OBJ-02",
      "text": "Prove allowed and denied visibility for every persona."
    },
    {
      "id": "OBJ-03",
      "text": "Prove update, delete, rename, and permission-only change propagation."
    },
    {
      "id": "OBJ-04",
      "text": "Prove the connector refuses to finish a partial full crawl and recovers from throttling and token expiry."
    },
    {
      "id": "OBJ-05",
      "text": "Produce a reconciliation report and a handoff package someone else can maintain."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-05",
      "eyebrow": "Cold open",
      "title": "Done is not when the data appears",
      "body": "Requirements to production handoff in one lab. The documents will appear early. That is not the finish line. The lab is done when you can prove who sees what, what happens when things change or break, and when someone else can maintain it without you.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will prove",
      "title": "Five things you will prove",
      "bullets": [
        "The connector indexes users, permissions, and documents, updates automatically, and retries with backoff.",
        "Every persona sees exactly what it should.",
        "Updates, deletes, renames, and permission-only changes propagate.",
        "A partial full crawl never finishes; throttling and token expiry are survived.",
        "Counts reconcile, and the handoff package stands on its own."
      ],
      "asset": {
        "src": "assets/svg/bld-202-a01.svg",
        "alt": "Five-block lab flow from setup to handoff.",
        "caption": "The lab ends when someone else can run it."
      },
      "claims": [
        "C-261",
        "C-262",
        "C-263"
      ]
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "The floor",
      "title": "The competency build minimum",
      "body": "The Custom Connector Competency expects a build that indexes users, permissions, and documents or data; has some level of automated index updating; and handles errors with retry and backoff. That is the floor. This lab goes further, because production connectors fail in the places the minimum does not name.",
      "claims": [
        "C-261",
        "C-262",
        "C-263"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A5",
      "objective": "OBJ-04",
      "eyebrow": "Lab environment",
      "title": "What the lab kit throws at you",
      "table": {
        "caption": "Injected conditions in the lab kit (fictional source)",
        "head": [
          "Condition",
          "What it tests"
        ],
        "rows": [
          [
            "Empty 200 pages with no cursor before the end",
            "Your completeness guard"
          ],
          [
            "429 with Retry-After on a fixed cadence",
            "Pacing and retries"
          ],
          [
            "ISO timestamps from the source",
            "Conversion to epoch seconds"
          ],
          [
            "Pages changed and deleted at start",
            "Incremental runs and deletion paths"
          ],
          [
            "Source token expires partway through the first full run",
            "Non-zero exit with no partial finalize"
          ]
        ]
      },
      "footnote": "The lab runs outside this package, in your own repository and a disposable test datasource provided by your program. Your assessor scores the lab evidence.",
      "claims": [
        "C-170",
        "C-193",
        "C-153",
        "C-174",
        "C-165"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A7",
      "objective": "OBJ-02",
      "eyebrow": "Stages 1 to 5",
      "title": "Set up and prove the basics",
      "steps": [
        {
          "title": "1 Inputs",
          "body": "Link your intake, design record, and readiness checklist."
        },
        {
          "title": "2 Datasource",
          "body": "Configure from code, then read it back; reconcile ambiguous failures by reading state."
        },
        {
          "title": "3 First run",
          "body": "One public document visible; one permissioned document visible only to authorized personas."
        },
        {
          "title": "4 Identities",
          "body": "Users, then groups including nested, then memberships. Record identity counts."
        },
        {
          "title": "5 Full run under faults",
          "body": "Logs show 429 retries and a raised completeness error; the retry run completes."
        }
      ],
      "claims": [
        "C-209",
        "C-049",
        "C-111",
        "C-114",
        "C-115",
        "C-322",
        "C-170",
        "C-194"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A6",
      "objective": "OBJ-04",
      "eyebrow": "Decision",
      "title": "The token expires at minute 20",
      "type": "choice",
      "prompt": "Twenty minutes into the first full run, the source token expires. Your client starts receiving 401. What must the connector do?",
      "options": [
        {
          "id": "o2",
          "text": "Finalize what was fetched so the index is partly fresh.",
          "feedback": "On a full run, that deletes every page not fetched as stale."
        },
        {
          "id": "o3",
          "text": "Skip the failing pages and continue to the end.",
          "feedback": "Skipped pages make the replacement partial."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "Fail the run with a non-zero exit, leave the upload unfinalized, and rerun after the token is refreshed.",
          "feedback": "Right. A failed crawl is recoverable. A successful partial one deletes what it did not fetch."
        }
      ],
      "takeaway": "Fail loudly; never finish a partial full run.",
      "claims": [
        "C-171",
        "C-165",
        "C-170",
        "C-101"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A7",
      "objective": "OBJ-03",
      "eyebrow": "Stages 6 to 11",
      "title": "Prove visibility and change",
      "steps": [
        {
          "title": "6 Verify",
          "body": "Document status shows indexed; document access checked for six personas on six pages."
        },
        {
          "title": "7 Incremental",
          "body": "Five updates visible; a rename creates no duplicate; the checkpoint is written only on success."
        },
        {
          "title": "8 Deletes",
          "body": "Tombstones delete explicitly; a nightly full run reconciles anything missed. Explain the 20% safeguard with your own numbers."
        },
        {
          "title": "9 Permission-only change",
          "body": "Page body unchanged, read groups changed. Access flips after processing."
        },
        {
          "title": "10 Membership removal",
          "body": "A removed user loses access after membership processing."
        },
        {
          "title": "11 Reconcile",
          "body": "Source count versus uploaded versus indexed, per object type, with every gap explained."
        }
      ],
      "claims": [
        "C-321",
        "C-101",
        "C-173",
        "C-176",
        "C-107",
        "C-116",
        "C-322"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A6",
      "objective": "OBJ-03",
      "eyebrow": "Decision",
      "title": "Only the read groups changed",
      "type": "choice",
      "prompt": "An editor removes a group from a page's read groups. The page body and its updated timestamp do not change. How does your connector reflect this?",
      "options": [
        {
          "id": "o2",
          "text": "Wait for the next body edit to carry the new ACL.",
          "feedback": "The body may never change. Removed users keep access until it does."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "Detect the ACL change on its own path, push it, and verify access flips after processing.",
          "feedback": "Right. Permissions and memberships are processed asynchronously, and permission changes need their own detection and schedule."
        },
        {
          "id": "o3",
          "text": "Nothing is needed; the source checks access at click time.",
          "feedback": "Snippets reach users and the model before any click."
        }
      ],
      "takeaway": "Permission changes are changes, even when the text is not.",
      "claims": [
        "C-116",
        "C-257",
        "C-025",
        "C-026"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A5",
      "objective": "OBJ-02",
      "eyebrow": "Persona matrix",
      "title": "What the access matrix proves",
      "table": {
        "caption": "Example rows from the persona matrix (fictional case)",
        "head": [
          "Persona",
          "Should see",
          "Should not see"
        ],
        "rows": [
          [
            "Clinical staff member",
            "General policy",
            "Controlled-substance log"
          ],
          [
            "Pharmacist at clinic 014",
            "Clinic 014 controlled-substance log",
            "Clinic 022 controlled-substance log"
          ],
          [
            "Contractor",
            "Contractor onboarding",
            "General clinical policy"
          ],
          [
            "Source admin, in no group",
            "Nothing extra",
            "Pages open only through the admin bypass"
          ]
        ]
      },
      "footnote": "Your full matrix covers six personas on six pages. Explain every expected denial.",
      "claims": [
        "C-198",
        "C-199",
        "C-200"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A10",
      "objective": "OBJ-05",
      "eyebrow": "Myth versus reality",
      "title": "Three ways to mistake progress for proof",
      "hotspots": [
        {
          "label": "Myth: the documents are uploaded, so the lab is done.",
          "detail": "An accepted upload is not yet a searchable document, and a searchable document is not yet a proven one."
        },
        {
          "label": "Myth: the counts match, so permissions are right.",
          "detail": "Counting indexed documents proves nothing about permissions. Search as each persona."
        },
        {
          "label": "Myth: the scheduled job is green.",
          "detail": "A completed Job proves only that the process exited successfully. Document status proves indexing."
        }
      ],
      "claims": [
        "C-160",
        "C-199",
        "C-200",
        "C-214"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "A7",
      "objective": "OBJ-05",
      "eyebrow": "Stages 12 to 15",
      "title": "Observe, hand off, clean up",
      "steps": [
        {
          "title": "12 Observe",
          "body": "Read the stage timings and counts; define an alert for a sharp drop in documents_indexed."
        },
        {
          "title": "13 Security",
          "body": "Secrets in the secret store; none in code, images, or logs."
        },
        {
          "title": "14 Handoff",
          "body": "Runbook, architecture diagram, test results, and a maintenance plan draft for customer approval."
        },
        {
          "title": "15 Clean up",
          "body": "Tear down the disposable datasource or record why it stays. Remember that teardown cannot be undone. Revoke lab secrets."
        }
      ],
      "claims": [
        "C-218",
        "C-204",
        "C-215",
        "C-188",
        "C-265",
        "C-207"
      ]
    },
    {
      "id": "SCR-12",
      "archetype": "A5",
      "objective": "OBJ-04",
      "eyebrow": "How you are scored",
      "title": "The assessor rubric",
      "table": {
        "caption": "Lab rubric (studio-authored; scored outside this package)",
        "head": [
          "Area",
          "Weight",
          "Hard gate"
        ],
        "rows": [
          [
            "Indexing completeness and correctness",
            "15%",
            "No"
          ],
          [
            "Identity and permissions",
            "25%",
            "Yes"
          ],
          [
            "Freshness and deletion",
            "20%",
            "Yes"
          ],
          [
            "Failure handling",
            "15%",
            "Yes"
          ],
          [
            "Reconciliation and observability",
            "10%",
            "No"
          ],
          [
            "Security",
            "10%",
            "Yes"
          ],
          [
            "Handoff",
            "5%",
            "No"
          ]
        ]
      },
      "footnote": "Studio guidance: pass at 80% or higher with every hard gate met. A retake uses a different fault seed and persona set.",
      "asset": {
        "src": "assets/svg/bld-202-a02.svg",
        "alt": "Four hard gates for the implementation lab.",
        "caption": "A high score does not offset a failed gate."
      },
      "claims": [
        "C-195",
        "C-174",
        "C-170",
        "C-215"
      ]
    },
    {
      "id": "SCR-13",
      "archetype": "A13",
      "objective": "OBJ-05",
      "eyebrow": "Job aid",
      "title": "Your evidence pack",
      "cards": [
        {
          "tag": "Runs",
          "title": "Run logs",
          "body": "Retries, the raised completeness error, the token-expiry failure, and the clean rerun."
        },
        {
          "tag": "Access",
          "title": "Access matrix",
          "body": "Six personas by six pages, with every denial explained."
        },
        {
          "tag": "Change",
          "title": "Change proofs",
          "body": "Before and after for update, delete, rename, permission-only change, and membership removal."
        },
        {
          "tag": "Handoff",
          "title": "Handoff",
          "body": "Reconciliation report, alert definition, runbook, diagram, and maintenance plan draft."
        }
      ],
      "claims": [
        "C-165",
        "C-199",
        "C-116",
        "C-202",
        "C-204",
        "C-265"
      ]
    },
    {
      "id": "SCR-14",
      "archetype": "quiz",
      "objective": "OBJ-04",
      "eyebrow": "Self-check",
      "title": "Lab readiness self-check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "Which set is the competency build minimum?",
          "options": [
            {
              "id": "b",
              "text": "Documents only, uploaded once by bulk",
              "feedback": "Users and permissions are required, and so are automated updates."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Users, permissions, and documents; automated updates; retry and backoff",
              "feedback": "Right."
            },
            {
              "id": "c",
              "text": "Documents and activity, with no permissions",
              "feedback": "Permissions are part of the minimum."
            },
            {
              "id": "d",
              "text": "A live MCP tool in place of indexing",
              "feedback": "The competency is for indexing connectors."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-04",
          "stem": "The source token expires mid full run. What is the correct behavior?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Exit non-zero with the upload unfinalized, then rerun",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "Finalize the fetched pages to keep the index fresh",
              "feedback": "Every page not fetched would be deleted."
            },
            {
              "id": "c",
              "text": "Retry the 401 until the token works again",
              "feedback": "An expired token will not start working; fail and refresh it."
            },
            {
              "id": "d",
              "text": "Switch to incremental mode mid-run",
              "feedback": "Modes do not switch mid-run; fail the run."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-03",
          "stem": "Only a page's read groups change. What must the connector do?",
          "options": [
            {
              "id": "b",
              "text": "Wait for the page body to change",
              "feedback": "The body may never change."
            },
            {
              "id": "c",
              "text": "Rely on click-time checks in the source",
              "feedback": "Snippets are shown before any click."
            },
            {
              "id": "d",
              "text": "Nothing; Glean polls the source for ACLs",
              "feedback": "A push connector must push the change."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Detect and push the ACL change on its own path",
              "feedback": "Right. Then verify access flips after processing."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "How do you prove a contractor cannot see a clinical policy page?",
          "options": [
            {
              "id": "b",
              "text": "Compare uploaded and indexed document counts",
              "feedback": "Counts prove nothing about permissions."
            },
            {
              "id": "c",
              "text": "Read the ACL in the upload payload",
              "feedback": "A correct-looking ACL can still be wrong in effect."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Check document access and search as the contractor",
              "feedback": "Right. The search result is the ground truth."
            },
            {
              "id": "d",
              "text": "Ask the source owner to confirm",
              "feedback": "Prove it in Glean."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "A page is renamed and its slug changes. How many Glean documents represent it after the next full run?",
          "options": [
            {
              "id": "b",
              "text": "Two: the old slug and the new slug",
              "feedback": "That happens only if IDs come from slugs."
            },
            {
              "id": "a",
              "correct": true,
              "text": "One, because the ID is the immutable page_id",
              "feedback": "Right."
            },
            {
              "id": "c",
              "text": "Zero until the next incremental run",
              "feedback": "The full run includes the page under its stable ID."
            },
            {
              "id": "d",
              "text": "It depends on the viewURL",
              "feedback": "Identity comes from the ID, not the link."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-03",
          "stem": "Tombstones last 30 days. How are deletions handled in the lab design?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Explicit deletes from tombstones, plus a nightly full run to reconcile",
              "feedback": "Right. The full run catches anything the deletion signal missed."
            },
            {
              "id": "b",
              "text": "Tombstones only; full runs are unnecessary",
              "feedback": "A 30-day signal can be missed; reconciliation catches it."
            },
            {
              "id": "c",
              "text": "Full runs only; ignore tombstones",
              "feedback": "Deletions would wait for the next full run."
            },
            {
              "id": "d",
              "text": "Incremental runs delete omitted pages",
              "feedback": "Incremental is additive."
            }
          ]
        },
        {
          "id": "Q-07",
          "objective": "OBJ-04",
          "stem": "The mock API returns an empty 200 page with no cursor before the end. What should your evidence show?",
          "options": [
            {
              "id": "b",
              "text": "A successful run with fewer pages",
              "feedback": "That is the defect the guard prevents."
            },
            {
              "id": "c",
              "text": "An automatic retry of the 200",
              "feedback": "A 200 is not retried."
            },
            {
              "id": "d",
              "text": "A pause from the 20% safeguard",
              "feedback": "The guard must stop the run before the safeguard matters."
            },
            {
              "id": "a",
              "correct": true,
              "text": "A raised completeness error and no finalized upload",
              "feedback": "Right."
            }
          ]
        },
        {
          "id": "Q-08",
          "objective": "OBJ-04",
          "stem": "You intentionally remove 25% of the lab pages in one full run. What do you expect?",
          "options": [
            {
              "id": "b",
              "text": "They disappear within minutes",
              "feedback": "Above 20%, deletion pauses."
            },
            {
              "id": "c",
              "text": "The upload is rejected",
              "feedback": "The upload succeeds; deletion pauses."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Deletion of those stale pages pauses for 7 days",
              "feedback": "Right. Use /processalldocuments if immediate deletion is intended."
            },
            {
              "id": "d",
              "text": "Nothing happens until you delete each page",
              "feedback": "The pause lasts 7 days, not indefinitely."
            }
          ]
        },
        {
          "id": "Q-09",
          "objective": "OBJ-05",
          "stem": "What proves that the scheduled run actually indexed documents?",
          "options": [
            {
              "id": "b",
              "text": "The Job shows Completed",
              "feedback": "That proves only that the process exited."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Document status and a search as an authorized persona",
              "feedback": "Right."
            },
            {
              "id": "c",
              "text": "The log says upload accepted",
              "feedback": "Accepted is not searchable."
            },
            {
              "id": "d",
              "text": "CPU use during the run",
              "feedback": "Resource use proves nothing about indexing."
            }
          ]
        },
        {
          "id": "Q-10",
          "objective": "OBJ-05",
          "stem": "Where do the lab's source and indexing credentials belong?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "A secret store the workload reads with exact access",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "The repository, encrypted with a shared password",
              "feedback": "Secrets in the repository leak with it."
            },
            {
              "id": "c",
              "text": "Log output, redacted automatically",
              "feedback": "Redaction covers query parameters in logs only."
            },
            {
              "id": "d",
              "text": "The container image",
              "feedback": "Images are copied and shared."
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
      "body": "Each screen lists claim ids such as C-025. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.",
      "table": {
        "caption": "Claim ids by source",
        "head": [
          "Source",
          "Where to find it",
          "Claim ids"
        ],
        "rows": [
          [
            "How connectors power the Glean experience",
            "Glean Docs (docs.glean.com)",
            "C-025, C-026"
          ],
          [
            "Set up a custom connector",
            "Glean Docs (docs.glean.com)",
            "C-049"
          ],
          [
            "Bulk Indexing",
            "Glean Developer docs (developers.glean.com)",
            "C-101"
          ],
          [
            "Bulk Upload Model",
            "Glean Developer docs (developers.glean.com)",
            "C-107, C-108"
          ],
          [
            "Permissions (Indexing API guide)",
            "Glean Developer docs (developers.glean.com)",
            "C-111, C-114, C-115, C-116"
          ],
          [
            "Indexing SDK — Indexing modes",
            "Glean Developer docs (developers.glean.com)",
            "C-170, C-171, C-173, C-174, C-176"
          ],
          [
            "Indexing SDK — Permissions",
            "Glean Developer docs (developers.glean.com)",
            "C-195, C-198, C-199, C-200"
          ],
          [
            "Indexing SDK — Architecture",
            "Glean Developer docs (developers.glean.com)",
            "C-165"
          ],
          [
            "Indexing SDK — HTTP client",
            "Glean Developer docs (developers.glean.com)",
            "C-188"
          ],
          [
            "Indexing SDK — Rate limiting",
            "Glean Developer docs (developers.glean.com)",
            "C-193, C-194"
          ],
          [
            "Indexing SDK — Status and debugging",
            "Glean Developer docs (developers.glean.com)",
            "C-202, C-204"
          ],
          [
            "Indexing SDK — CLI",
            "Glean Developer docs (developers.glean.com)",
            "C-207, C-209, C-321, C-322"
          ],
          [
            "Indexing SDK — Deployment overview",
            "Glean Developer docs (developers.glean.com)",
            "C-214, C-215"
          ],
          [
            "Indexing SDK — Observability",
            "Glean Developer docs (developers.glean.com)",
            "C-218"
          ],
          [
            "Indexing SDK — Overview",
            "Glean Developer docs (developers.glean.com)",
            "C-153, C-154"
          ],
          [
            "Indexing SDK — Quickstart",
            "Glean Developer docs (developers.glean.com)",
            "C-160"
          ],
          [
            "[External] Glean Partner Content | Custom Connector Questionnaire",
            "Glean partner document (ask your Partner Manager for access)",
            "C-257"
          ],
          [
            "Glean Partner Competency Program Guide (Feb 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-261, C-262, C-263, C-265"
          ]
        ]
      },
      "claims": []
    },
    {
      "id": "SCR-15",
      "archetype": "A14",
      "objective": "OBJ-05",
      "eyebrow": "Next step",
      "title": "Built and proven. Now run it for years.",
      "body": "Submit your evidence pack to your assessor. CON-301 covers operations, security, incidents, migration, and the maintenance plan your customer approves.",
      "signature": true,
      "claims": []
    }
  ]
};
