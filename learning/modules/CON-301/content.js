/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "CON-301",
  "title": "Production Operations, Security, Migration, and Handoff",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Operate a connector in Glean-hosted or self-hosted mode with correct scheduling, secrets, and networking."
    },
    {
      "id": "OBJ-02",
      "text": "Deploy and verify a rollout by document status, not job status."
    },
    {
      "id": "OBJ-03",
      "text": "Define monitoring that catches partial crawls, identity lag, and permission drift."
    },
    {
      "id": "OBJ-04",
      "text": "Diagnose missing, stale, over-visible, and vanished documents, and choose the right recovery."
    },
    {
      "id": "OBJ-05",
      "text": "Plan a native-to-custom migration without losing coverage or user artifacts."
    },
    {
      "id": "OBJ-06",
      "text": "Write customer documentation and a maintenance and support plan the customer can approve."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-04",
      "eyebrow": "Cold open",
      "title": "Day 45",
      "body": "Day 45 after go-live: 3,100 policy pages vanished overnight. Two days later, pages deleted in the source stopped disappearing from search. Two failures, two causes, and one missing alert. By the end of this module you will find both in minutes and fix them in the right order.",
      "footnote": "Composite, fictional case used across this accreditation. Product behavior is sourced; the customer environment and its numbers are invented for practice.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Keep it correct for years",
      "bullets": [
        "Operate hosted or self-hosted connectors correctly.",
        "Deploy and verify rollouts by document status.",
        "Alert on partial crawls, identity lag, and drift.",
        "Diagnose and recover without making it worse.",
        "Migrate from a native connector without a gap.",
        "Write documentation and a maintenance plan the customer approves."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A5",
      "objective": "OBJ-01",
      "eyebrow": "Operating models",
      "title": "Hosted or self-hosted, in operation",
      "table": {
        "caption": "What changes in operation",
        "head": [
          "Model",
          "In operation"
        ],
        "rows": [
          [
            "Glean-hosted",
            "Runs in the Glean cloud instance; crawls can be scheduled like native connectors"
          ],
          [
            "Self-hosted",
            "Runs in the customer's environment, which must allow pushes to Glean's indexing endpoints"
          ],
          [
            "Either",
            "Hosting determines how secrets, scheduling, and networking are handled"
          ],
          [
            "Scheduler",
            "A VM cron job, a Cloud Run or Lambda job, an Airflow task, or a scheduled CI workload can run it"
          ]
        ]
      },
      "claims": [
        "C-042",
        "C-046",
        "C-047",
        "C-045",
        "C-217"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A7",
      "objective": "OBJ-02",
      "eyebrow": "Deployment",
      "title": "Deploy with the SDK scaffolding",
      "steps": [
        {
          "title": "Scaffold",
          "body": "glean-idx deploy generates a Docker image and Terraform for a Kubernetes CronJob on GKE or EKS."
        },
        {
          "title": "Foundation",
          "body": "Generated Terraform does not create the project or account, cluster, registry, workload identity foundation, or namespace. The platform team owns them."
        },
        {
          "title": "Configure",
          "body": "Change glean_deployment.yaml. Generated Terraform is an artifact, not the configuration interface."
        },
        {
          "title": "Schedule",
          "body": "Full and incremental schedules need separate deployment configurations."
        },
        {
          "title": "Secrets",
          "body": "The workload gets exact secret access and cannot enumerate secrets."
        },
        {
          "title": "Verify",
          "body": "A completed Job proves only that the process exited successfully. Check document status."
        }
      ],
      "claims": [
        "C-332",
        "C-211",
        "C-212",
        "C-213",
        "C-215",
        "C-214"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A4",
      "objective": "OBJ-01",
      "eyebrow": "Security operations",
      "title": "Security that survives year two",
      "hotspots": [
        {
          "label": "Tokens",
          "detail": "Separate tokens per environment, each with an expiry, IP restrictions to known infrastructure, and a minimum rotation period of 1440 minutes."
        },
        {
          "label": "Rotation",
          "detail": "Automate indexing token rotation."
        },
        {
          "label": "Source access",
          "detail": "Read-only keys where the source supports them."
        },
        {
          "label": "Logs",
          "detail": "Query parameters are redacted in request logs. Redaction covers logging only, so keep secrets out of error messages."
        },
        {
          "label": "Teardown",
          "detail": "teardown cannot be undone, and there is no Indexing API operation to delete a datasource registration."
        }
      ],
      "claims": [
        "C-057",
        "C-054",
        "C-059",
        "C-053",
        "C-238",
        "C-251",
        "C-187",
        "C-188",
        "C-207",
        "C-216"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Monitoring",
      "title": "Alerts that catch real failures",
      "bullets": [
        "Non-zero exits: failures re-raise so the scheduler sees them.",
        "A sharp drop in documents_indexed between runs: the partial-crawl signal.",
        "A gap between uploaded and indexed counts per object type, and in identity counts.",
        "Users show UPLOAD COMPLETED but indexed counts stay low: processing is not done, or pagination flags are wrong.",
        "Cloud telemetry plugins are tested only against mocks: validate them in staging before you rely on them."
      ],
      "claims": [
        "C-165",
        "C-204",
        "C-322",
        "C-072",
        "C-074",
        "C-219"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A5",
      "objective": "OBJ-04",
      "eyebrow": "Incident table",
      "title": "Symptom, cause, action",
      "table": {
        "caption": "Diagnosis decision table",
        "head": [
          "Symptom",
          "Most likely cause",
          "Action"
        ],
        "rows": [
          [
            "Never appears",
            "Never uploaded",
            "Fix fetch or transform"
          ],
          [
            "Uploaded, not searchable",
            "Processing not complete",
            "Wait; if stuck, /processalldocuments, once every 3 hours"
          ],
          [
            "Some users see it, others do not",
            "ACL or identities",
            "Push identities; /processallmemberships for identity issues"
          ],
          [
            "Appears, then disappears",
            "A later full run omitted it",
            "Fix completeness; rerun a verified full run"
          ],
          [
            "Deleted pages still visible",
            "Stale deletion paused above 20%",
            "If intended, /processalldocuments makes deletions take effect"
          ],
          [
            "Wrong dates or sort order",
            "ISO timestamps",
            "Send epoch seconds"
          ]
        ]
      },
      "claims": [
        "C-202",
        "C-070",
        "C-075",
        "C-079",
        "C-205",
        "C-076",
        "C-203",
        "C-107",
        "C-108",
        "C-153"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A8",
      "objective": "OBJ-04",
      "eyebrow": "Incident walkthrough",
      "title": "Day 45, reconstructed",
      "steps": [
        {
          "title": "01:14",
          "body": "The source token expired during the nightly full run. The data client swallowed the 401 inside its paging loop."
        },
        {
          "title": "Result",
          "body": "35,300 of 38,400 pages fetched; the run succeeded. 3,100 pages, about 8%, were deleted as stale: under the 20% threshold."
        },
        {
          "title": "Day 47",
          "body": "A manual full run carried a max_items cap left from local testing. It omitted about 90% of pages, so deletion of that upload's stale pages paused for 7 days."
        },
        {
          "title": "Side effect",
          "body": "Pages truly deleted in the source waited in search, because this design deleted them only through full runs."
        },
        {
          "title": "Missing alert",
          "body": "Nothing watched for a sharp drop in documents_indexed."
        }
      ],
      "footnote": "Fictional incident. Each cause is one the SDK documentation names for partial full crawls.",
      "claims": [
        "C-331",
        "C-328",
        "C-327",
        "C-326",
        "C-101",
        "C-107",
        "C-204"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A6",
      "objective": "OBJ-04",
      "eyebrow": "Decision",
      "title": "Recover in the right order",
      "type": "choice",
      "prompt": "You have found both causes. What do you do first?",
      "options": [
        {
          "id": "o2",
          "text": "Rerun the full crawl now with the same code.",
          "feedback": "The same code can swallow the next error and repeat the partial run."
        },
        {
          "id": "o3",
          "text": "Tear down the datasource and start clean.",
          "feedback": "teardown cannot be undone, and it removes everything users rely on."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "Fix the client so auth errors fail the run, remove the test cap, then run a full crawl verified against expected counts.",
          "feedback": "Right. Never let a partial fetch finish as a successful full crawl. Fix the fault before you rerun."
        }
      ],
      "takeaway": "Fix the fault, then rerun a verified full crawl.",
      "claims": [
        "C-170",
        "C-207"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A7",
      "objective": "OBJ-05",
      "eyebrow": "Migration",
      "title": "Moving from a native connector",
      "steps": [
        {
          "title": "Namespace",
          "body": "Native and custom connectors occupy separate namespaces."
        },
        {
          "title": "Parallel",
          "body": "Run both connectors in parallel during the transition."
        },
        {
          "title": "Artifacts",
          "body": "Agents, saved searches, app filters, and pinned results scoped to the native connector will not recognize the custom connector's content. Migrate them."
        },
        {
          "title": "Deactivate last",
          "body": "Deactivating a native connector removes its content from the search index."
        }
      ],
      "asset": {
        "src": "assets/svg/con-301-a01.svg",
        "alt": "Five-step migration flow ending with deactivating the native connector.",
        "caption": "Deactivate last. It removes the native content."
      },
      "claims": [
        "C-080",
        "C-083",
        "C-081",
        "C-082"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "A4",
      "objective": "OBJ-06",
      "eyebrow": "Publishing and support",
      "title": "What you owe once it is listed",
      "hotspots": [
        {
          "label": "Listing",
          "detail": "The Custom Connector Intake Form v2 gathers what is needed to publish a partner-built connector on the Glean Connectors webpage."
        },
        {
          "label": "Documentation",
          "detail": "Customer-facing documentation must explain the connector's permission propagation logic."
        },
        {
          "label": "Support",
          "detail": "Glean expects the partner to maintain and support a listed connector. Shared push connector code may have limited support, so say who supports what."
        },
        {
          "label": "Confirmation",
          "detail": "Request written confirmation that permissions and security meet expectations once a custom test group has reviewed the results."
        }
      ],
      "claims": [
        "C-272",
        "C-275",
        "C-273",
        "C-009",
        "C-274"
      ]
    },
    {
      "id": "SCR-12",
      "archetype": "A3",
      "objective": "OBJ-06",
      "eyebrow": "Maintenance plan",
      "title": "A plan the customer can approve",
      "body": "A customer-approved maintenance plan is a Custom Connector Competency requirement. Write it for the customer's operators, not for yourself.",
      "bullets": [
        "Owner, support hours, and escalation path.",
        "Monitoring: which alerts, who receives them, and the response targets.",
        "Credential rotation calendar, with token rotation automated.",
        "Change management: source API changes, Glean API changes, and SDK releases. This path was built on glean-indexing-sdk v1.2.0.",
        "A permission re-test with the persona matrix after any change to the source's permission model."
      ],
      "footnote": "Plan contents beyond the sourced requirement are studio guidance.",
      "asset": {
        "src": "assets/svg/con-301-a02.svg",
        "alt": "Four cards naming the essentials of a maintenance plan.",
        "caption": "The customer approves this plan. Write it for them."
      },
      "claims": [
        "C-265",
        "C-238",
        "C-220",
        "C-199"
      ]
    },
    {
      "id": "SCR-13",
      "archetype": "A13",
      "objective": "OBJ-04",
      "eyebrow": "Job aid",
      "title": "Runbook skeleton",
      "cards": [
        {
          "tag": "Health",
          "title": "Daily health",
          "body": "Exit status, documents_indexed trend, uploaded versus indexed, identity counts."
        },
        {
          "tag": "Triage",
          "title": "Triage",
          "body": "Use the decision table: name the stage before you act."
        },
        {
          "tag": "Recover",
          "title": "Recover",
          "body": "Fix the cause, then a verified full run; reprocess within its limit."
        },
        {
          "tag": "Escalate",
          "title": "Escalate",
          "body": "Issue and error, endpoint and request body, connector name, timestamp with time zone."
        }
      ],
      "claims": [
        "C-165",
        "C-204",
        "C-322",
        "C-202",
        "C-079",
        "C-078"
      ]
    },
    {
      "id": "SCR-14",
      "archetype": "quiz",
      "objective": "OBJ-04",
      "eyebrow": "Prove it",
      "title": "Operations check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-02",
          "stem": "The deployment's Job completed, but users cannot find new pages. What do you check?",
          "options": [
            {
              "id": "b",
              "text": "Nothing; Job success means indexed",
              "feedback": "A completed Job proves only that the process exited."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Document status, since Job success proves only a clean exit",
              "feedback": "Right."
            },
            {
              "id": "c",
              "text": "The container's CPU limits",
              "feedback": "Resources do not explain missing indexing."
            },
            {
              "id": "d",
              "text": "The Terraform state file",
              "feedback": "Terraform describes infrastructure, not indexing."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "You need an hourly incremental and a nightly full schedule. How is that deployed?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Two deployment configurations, one per schedule",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "One CronJob with both modes",
              "feedback": "Each CronJob has one schedule and indexing mode."
            },
            {
              "id": "c",
              "text": "One schedule; the SDK picks the mode",
              "feedback": "The mode is set per deployment configuration."
            },
            {
              "id": "d",
              "text": "Edit the generated Terraform by hand",
              "feedback": "Change glean_deployment.yaml instead."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-01",
          "stem": "Can you delete a datasource registration through the Indexing API?",
          "options": [
            {
              "id": "b",
              "text": "Yes, with teardown",
              "feedback": "teardown clears content with an empty full crawl; it does not delete the registration."
            },
            {
              "id": "c",
              "text": "Yes, with /processalldocuments",
              "feedback": "That reprocesses documents."
            },
            {
              "id": "d",
              "text": "Yes, by revoking the token",
              "feedback": "Revoking a token stops access; the registration remains."
            },
            {
              "id": "a",
              "correct": true,
              "text": "No; there is no Indexing API operation for that",
              "feedback": "Right. teardown clears content and cannot be undone."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-04",
          "stem": "You ran /processalldocuments an hour ago and processing still looks stuck. What now?",
          "options": [
            {
              "id": "b",
              "text": "Call it again immediately",
              "feedback": "It is limited to one request every 3 hours."
            },
            {
              "id": "c",
              "text": "Run a bulk upload to force it",
              "feedback": "A bulk upload is replacement, not reprocessing."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Wait: it allows one request every 3 hours per datasource",
              "feedback": "Right. Use the time to gather evidence for a ticket."
            },
            {
              "id": "d",
              "text": "Tear down and re-upload",
              "feedback": "teardown cannot be undone."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-04",
          "stem": "An intended cleanup removed 30% of pages, but they are still in search the next day. Why?",
          "options": [
            {
              "id": "b",
              "text": "The upload failed silently",
              "feedback": "The safeguard explains it."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Above 20%, stale deletion pauses for 7 days",
              "feedback": "Right. Use /processalldocuments if the deletion is intended."
            },
            {
              "id": "c",
              "text": "Deletions are processed monthly",
              "feedback": "No such schedule is documented."
            },
            {
              "id": "d",
              "text": "The pages are cached in users' browsers",
              "feedback": "The index still holds them."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-05",
          "stem": "During migration, what happens to saved searches scoped to the native connector?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "They will not recognize the custom connector's content; migrate them",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "They carry over automatically",
              "feedback": "Artifacts scoped to the native connector do not carry over."
            },
            {
              "id": "c",
              "text": "They are deleted when the custom connector starts",
              "feedback": "They remain; they simply do not see the new content."
            },
            {
              "id": "d",
              "text": "Only pinned results are affected",
              "feedback": "Agents, saved searches, app filters, and pinned results are all affected."
            }
          ]
        },
        {
          "id": "Q-07",
          "objective": "OBJ-05",
          "stem": "When should the native connector be deactivated during migration?",
          "options": [
            {
              "id": "b",
              "text": "First, to avoid duplicate results",
              "feedback": "Users would lose coverage."
            },
            {
              "id": "c",
              "text": "Midway, once half the content is moved",
              "feedback": "Coverage would have a gap."
            },
            {
              "id": "d",
              "text": "Never; both run forever",
              "feedback": "Parallel running is for the transition period."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Last, after the custom connector is populated and artifacts are migrated",
              "feedback": "Right. Deactivation removes its content."
            }
          ]
        },
        {
          "id": "Q-08",
          "objective": "OBJ-06",
          "stem": "What must customer-facing documentation for a listed connector explain?",
          "options": [
            {
              "id": "b",
              "text": "Its internal code structure",
              "feedback": "Code structure is not the customer's concern."
            },
            {
              "id": "c",
              "text": "The partner's pricing",
              "feedback": "Pricing is not a documentation requirement here."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Its permission propagation logic",
              "feedback": "Right."
            },
            {
              "id": "d",
              "text": "Glean's ranking algorithm",
              "feedback": "Ranking is Glean's, not the connector's."
            }
          ]
        },
        {
          "id": "Q-09",
          "objective": "OBJ-06",
          "stem": "Who is expected to maintain and support a listed partner-built connector?",
          "options": [
            {
              "id": "b",
              "text": "Glean Support",
              "feedback": "Glean expects the partner to maintain and support it."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The partner that built it",
              "feedback": "Right."
            },
            {
              "id": "c",
              "text": "Each customer's admin alone",
              "feedback": "The partner maintains and supports it."
            },
            {
              "id": "d",
              "text": "The source system vendor",
              "feedback": "The partner built it and supports it."
            }
          ]
        },
        {
          "id": "Q-10",
          "objective": "OBJ-03",
          "stem": "Which alert would have caught the day 45 incident first?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "A sharp drop in documents_indexed between runs",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "A non-zero exit code",
              "feedback": "The swallowed error meant the run exited successfully."
            },
            {
              "id": "c",
              "text": "Rising CPU on the host",
              "feedback": "CPU does not measure completeness."
            },
            {
              "id": "d",
              "text": "Token expiry reminders",
              "feedback": "Useful, but the partial run still needed detection."
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
      "body": "Each screen lists claim ids such as C-009. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.",
      "table": {
        "caption": "Claim ids by source",
        "head": [
          "Source",
          "Where to find it",
          "Claim ids"
        ],
        "rows": [
          [
            "About connectors",
            "Glean Docs (docs.glean.com)",
            "C-009"
          ],
          [
            "Overview of custom data source",
            "Glean Docs (docs.glean.com)",
            "C-042"
          ],
          [
            "Choose a deployment model",
            "Glean Docs (docs.glean.com)",
            "C-045, C-046, C-047"
          ],
          [
            "Troubleshooting (custom connectors)",
            "Glean Docs (docs.glean.com)",
            "C-070, C-072, C-074, C-075, C-076, C-078"
          ],
          [
            "Migrate from a native connector to a custom connector",
            "Glean Docs (docs.glean.com)",
            "C-080, C-081, C-082, C-083"
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
            "Indexing API Authentication",
            "Glean Developer docs (developers.glean.com)",
            "C-053, C-054, C-057, C-059"
          ],
          [
            "Indexing SDK — Indexing modes",
            "Glean Developer docs (developers.glean.com)",
            "C-170"
          ],
          [
            "Indexing SDK — Permissions",
            "Glean Developer docs (developers.glean.com)",
            "C-199"
          ],
          [
            "Indexing SDK — Architecture",
            "Glean Developer docs (developers.glean.com)",
            "C-165"
          ],
          [
            "Indexing SDK — HTTP client",
            "Glean Developer docs (developers.glean.com)",
            "C-187, C-188"
          ],
          [
            "Indexing SDK — Status and debugging",
            "Glean Developer docs (developers.glean.com)",
            "C-202, C-203, C-204, C-205, C-327, C-328, C-331"
          ],
          [
            "Indexing SDK — CLI",
            "Glean Developer docs (developers.glean.com)",
            "C-207, C-322"
          ],
          [
            "Indexing SDK — Deployment overview",
            "Glean Developer docs (developers.glean.com)",
            "C-211, C-212, C-213, C-214, C-215, C-216, C-217, C-332"
          ],
          [
            "Indexing SDK — Observability",
            "Glean Developer docs (developers.glean.com)",
            "C-219"
          ],
          [
            "Indexing SDK — Overview",
            "Glean Developer docs (developers.glean.com)",
            "C-153"
          ],
          [
            "Indexing SDK — Quickstart",
            "Glean Developer docs (developers.glean.com)",
            "C-326"
          ],
          [
            "Rate Limits and Retries",
            "Glean Developer docs (developers.glean.com)",
            "C-079"
          ],
          [
            "Developer Changelog (glean-indexing-sdk releases)",
            "Glean Developer docs (developers.glean.com)",
            "C-220"
          ],
          [
            "Glean Partner Content | Custom Connector Best Practices (deck, April 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-238"
          ],
          [
            "[External] Glean Partner Content | Custom Connector Questionnaire",
            "Glean partner document (ask your Partner Manager for access)",
            "C-251"
          ],
          [
            "Glean Partner Competency Program Guide (Feb 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-265"
          ],
          [
            "[Template] Custom Connector Intake Form v2",
            "Glean partner document (ask your Partner Manager for access)",
            "C-272, C-273, C-274, C-275"
          ]
        ]
      },
      "claims": []
    },
    {
      "id": "SCR-15",
      "archetype": "A14",
      "objective": "OBJ-06",
      "eyebrow": "Next step",
      "title": "Next: defend it",
      "body": "Submit your runbook and maintenance plan to your assessor. ACC-107 is the capstone: portfolio, an unseen case, and a review with two assessors.",
      "signature": true,
      "claims": []
    }
  ]
};
