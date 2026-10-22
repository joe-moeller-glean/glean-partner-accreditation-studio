/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "CON-204",
  "title": "Glean Indexing SDK: Build, Test, Debug, Deploy",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Explain the SDK pipeline and run lifecycle, and which parts the builder writes."
    },
    {
      "id": "OBJ-02",
      "text": "Choose the correct connector base class and data client for a source."
    },
    {
      "id": "OBJ-03",
      "text": "Configure a data client with pagination, rate limiting, retries, and a completeness guard."
    },
    {
      "id": "OBJ-04",
      "text": "Implement transform with stable IDs, epoch timestamps, and ACLs, and supply identities correctly."
    },
    {
      "id": "OBJ-05",
      "text": "Configure full and incremental modes, checkpoints, and upload options safely."
    },
    {
      "id": "OBJ-06",
      "text": "Test in three phases, debug with the CLI, and review generated code and deployment."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-04",
      "eyebrow": "Cold open",
      "title": "Every page indexed, no one can see them",
      "body": "The streaming connector indexed all 38,400 policy pages. Every restricted page is invisible to everyone. The ACLs look right. The groups they name were never pushed, because streaming connectors do not run the identity crawl. The SDK removes most of the plumbing; it does not remove the need to know what it skips.",
      "footnote": "Composite, fictional case used across this accreditation. Product behavior is sourced; the customer environment and its numbers are invented for practice.",
      "claims": [
        "C-166",
        "C-196"
      ]
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Write only the source-specific parts",
      "bullets": [
        "Explain the pipeline and run lifecycle.",
        "Choose the base class and data client.",
        "Configure paging, pacing, retries, and a completeness guard.",
        "Write transform with stable IDs, epoch timestamps, and ACLs.",
        "Run full and incremental modes safely.",
        "Test in three phases, debug with the CLI, and review generated code."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Architecture",
      "title": "Two classes you write; the rest is the SDK's",
      "body": "A connector is two classes: a data client that fetches records from your source, and a connector that turns them into Glean documents. The SDK owns batching, retries, upload sessions, and stale-document cleanup. It is a client for the Indexing API, not a replacement: the API documentation stays the reference for the wire protocol.",
      "bullets": [
        "Configuration is two environment variables and no file: GLEAN_SERVER_URL, your Glean backend URL, and GLEAN_INDEXING_API_TOKEN, a datasource-scoped Indexing API token.",
        "A missing variable fails at client construction, not mid-upload.",
        "Every SDK exception derives from GleanError and carries a fix suggestion."
      ],
      "claims": [
        "C-157",
        "C-311",
        "C-150",
        "C-161",
        "C-312",
        "C-313",
        "C-162",
        "C-164"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A7",
      "objective": "OBJ-01",
      "eyebrow": "Run lifecycle",
      "title": "What happens in one run",
      "steps": [
        {
          "title": "Identity crawl",
          "body": "Users are bulk-indexed first. If groups are returned, memberships must be too, or the SDK raises InconsistentDataError."
        },
        {
          "title": "Resolve since",
          "body": "On an incremental crawl, the SDK calls _get_last_crawl_timestamp(). The base implementation returns None."
        },
        {
          "title": "Fetch and transform",
          "body": "Your data client's get_source_data(), then your transform()."
        },
        {
          "title": "Upload",
          "body": "Full: bulk_index_documents() for replacement and stale cleanup. Incremental: additive index_documents()."
        },
        {
          "title": "Exit",
          "body": "On exception, the error counter increments and the error is re-raised, so a scheduler sees a non-zero exit."
        }
      ],
      "asset": {
        "src": "assets/svg/con-204-a01.svg",
        "alt": "Six-step SDK run lifecycle from identity crawl to exit status.",
        "caption": "Streaming connectors skip step 02. Push identities yourself."
      },
      "claims": [
        "C-310",
        "C-324",
        "C-163",
        "C-165",
        "C-166"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A5",
      "objective": "OBJ-02",
      "eyebrow": "Base classes",
      "title": "Choose the base class",
      "table": {
        "caption": "Connector base classes in the SDK",
        "head": [
          "Class",
          "Peak memory",
          "Use when"
        ],
        "rows": [
          [
            "BaseDatasourceConnector",
            "Whole dataset",
            "The whole dataset fits comfortably in memory"
          ],
          [
            "BaseStreamingDatasourceConnector",
            "One batch",
            "The dataset is large or paginated and the source client is synchronous"
          ],
          [
            "BaseAsyncStreamingDatasourceConnector",
            "One batch",
            "Same model with async generators; drive it with index_data_async()"
          ],
          [
            "BasePeopleConnector",
            "Whole dataset",
            "Employee records, which are distinct from the identities that back ACLs"
          ]
        ]
      },
      "bullets": [
        "If unsure, start with BaseDatasourceConnector. Switching to streaming later changes the base class and the return type of get_source_data(); transform() is unchanged.",
        "At a few hundred thousand documents, memory binds. The fix is a streaming connector, not a smaller batch size, because batching happens after transform. batch_size defaults to 1000."
      ],
      "claims": [
        "C-315",
        "C-316",
        "C-169",
        "C-314",
        "C-167",
        "C-168"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A6",
      "objective": "OBJ-02",
      "eyebrow": "Decision",
      "title": "Pick the class for the policy wiki",
      "type": "choice",
      "prompt": "The wiki has 38,400 pages with HTML bodies, a paginated API, a synchronous HTTP client, and group-based ACLs. What do you build?",
      "options": [
        {
          "id": "o2",
          "text": "An async streaming connector; identities take care of themselves.",
          "feedback": "Async streaming implementations also skip get_identities(). Without identities, the ACLs match nobody."
        },
        {
          "id": "o3",
          "text": "BasePeopleConnector, because the ACLs depend on people.",
          "feedback": "BasePeopleConnector produces employee records, which are distinct from the datasource identities that back ACLs."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "A streaming connector, plus a separate step that pushes users, groups, and memberships first.",
          "feedback": "Right. Large, paginated, synchronous: streaming. Streaming connectors do not run get_identities(), so identities are pushed separately, before content."
        }
      ],
      "takeaway": "Choosing streaming means owning the identity push.",
      "claims": [
        "C-315",
        "C-166",
        "C-196",
        "C-169"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A4",
      "objective": "OBJ-03",
      "eyebrow": "Data client",
      "title": "Pull from the source without hurting it",
      "hotspots": [
        {
          "label": "Retries",
          "detail": "The HTTP client retries 429, 500, 502, 503, and 504; everything else fails immediately. The default max_attempts=2 is one retry. Raise it to 4 or 5 against APIs that rate-limit aggressively."
        },
        {
          "label": "Pacing",
          "detail": "The rate limiter is proactive; retries are reactive. Run below the source quota: at 600 per minute, 7 to 8 per second leaves room for retries."
        },
        {
          "label": "Paging",
          "detail": "Cursor paging stops when the cursor is missing, empty, not a string, or identical to the previous cursor. Offset pagination is unstable while the source is written to. Any loop you write must terminate on a misbehaving source."
        },
        {
          "label": "Logs",
          "detail": "Query parameters are redacted in request logs by default. Redaction covers logging only."
        }
      ],
      "claims": [
        "C-318",
        "C-186",
        "C-317",
        "C-194",
        "C-193",
        "C-323",
        "C-190",
        "C-191",
        "C-187",
        "C-188"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A6",
      "objective": "OBJ-03",
      "eyebrow": "Decision",
      "title": "The empty page that is not the end",
      "type": "choice",
      "prompt": "Under load, the wiki sometimes returns 200 with an empty item list and no next cursor, before the true end. How do you handle it?",
      "options": [
        {
          "id": "o2",
          "text": "Rely on the SDK's cursor guard; a missing cursor ends paging safely.",
          "feedback": "For this source, the missing cursor is the fault. A full crawl must cover the entire scope before completing."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "Add a source-specific guard: raise when a page is empty with no cursor before the expected total.",
          "feedback": "Right. Cursor paging stops on a missing cursor, which is correct for honest sources. Here, stopping means a partial full crawl that deletes the rest."
        },
        {
          "id": "o3",
          "text": "Raise max_attempts to 5 so the client retries the page.",
          "feedback": "A 200 is not a retryable status. The client never retries it."
        }
      ],
      "takeaway": "The SDK guards honest sources. You guard yours.",
      "claims": [
        "C-323",
        "C-154",
        "C-318",
        "C-170"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A3",
      "objective": "OBJ-04",
      "eyebrow": "transform()",
      "title": "The transform checklist",
      "bullets": [
        "The datasource name may contain only ASCII letters and digits.",
        "IDs from the immutable source identifier; a changed ID is a new document.",
        "created_at and updated_at in epoch seconds, not ISO strings.",
        "Real ACLs with allowed groups and group intersections. An allow-all default is the most consequential thing to miss.",
        "Groups returned must come with memberships.",
        "extract_permission_refs() returns the user and group IDs your documents reference: push those identities, and catch dangling references."
      ],
      "claims": [
        "C-158",
        "C-101",
        "C-153",
        "C-198",
        "C-152",
        "C-201",
        "C-320"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A10",
      "objective": "OBJ-05",
      "eyebrow": "Myth versus reality",
      "title": "Four SDK surprises",
      "hotspots": [
        {
          "label": "Myth: the SDK handles incremental for me.",
          "detail": "The SDK does not persist checkpoints. Without an override of _get_last_crawl_timestamp(), since is None and the data client falls back to a full fetch."
        },
        {
          "label": "Myth: streaming connectors push identities.",
          "detail": "Their indexing implementations do not run the optional get_identities() crawl."
        },
        {
          "label": "Myth: --max-items makes a live run safe.",
          "detail": "max_items limits source consumption. It is not a Glean-side upload cap. On a full run, it makes the replacement partial, which can delete everything not included."
        },
        {
          "label": "Myth: smaller batches fix out-of-memory errors.",
          "detail": "Batching happens after transform. Switch to a streaming connector."
        }
      ],
      "claims": [
        "C-172",
        "C-325",
        "C-166",
        "C-326",
        "C-159",
        "C-167"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "A5",
      "objective": "OBJ-05",
      "eyebrow": "Modes and uploads",
      "title": "Full and incremental, safely",
      "table": {
        "caption": "Indexing modes",
        "head": [
          "",
          "Full",
          "Incremental"
        ],
        "rows": [
          [
            "Upload call",
            "bulk_index_documents(): replacement and stale cleanup",
            "index_documents(): additive"
          ],
          [
            "Partial run",
            "Never safe: anything absent is deleted",
            "Safe: nothing is removed by omission"
          ],
          [
            "Empty successful run",
            "Clears the datasource",
            "Changes nothing"
          ],
          [
            "Checkpoint",
            "Not needed",
            "Override _get_last_crawl_timestamp(); write only after success"
          ]
        ]
      },
      "bullets": [
        "force_restart discards an in-progress upload. Use it after a crashed run leaves an upload stuck, not as a default.",
        "First and last pages upload sequentially: the first opens the session; the last closes it and triggers stale deletion.",
        "index_documents() is the right call for connectors reacting to a webhook.",
        "Tune the dominant stage only. Smaller batches usually beat longer timeouts."
      ],
      "claims": [
        "C-163",
        "C-154",
        "C-177",
        "C-324",
        "C-173",
        "C-178",
        "C-180",
        "C-181",
        "C-184",
        "C-185"
      ]
    },
    {
      "id": "SCR-12",
      "archetype": "A7",
      "objective": "OBJ-06",
      "eyebrow": "Testing",
      "title": "Three phases, one change each",
      "steps": [
        {
          "title": "Mock",
          "body": "Glean mocked; your source clients unchanged. Does transform produce the right documents?"
        },
        {
          "title": "Integration",
          "body": "Real source, recorded and replayed; Glean still mocked. It rejects missing permissions, anonymous access, and all-datasource-users access, because they prevent proving denial."
        },
        {
          "title": "Live",
          "body": "A disposable datasource, with --allow-destructive-live."
        },
        {
          "title": "Prove denial",
          "body": "Counting indexed documents proves nothing about permissions. The search result is the ground truth."
        }
      ],
      "asset": {
        "src": "assets/svg/con-204-a02.svg",
        "alt": "Three test phases from mock to live.",
        "caption": "Each phase swaps exactly one thing from mocked to real."
      },
      "claims": [
        "C-155",
        "C-319",
        "C-206",
        "C-199",
        "C-200"
      ]
    },
    {
      "id": "SCR-13",
      "archetype": "A4",
      "objective": "OBJ-06",
      "eyebrow": "CLI and debugging",
      "title": "Why is my document not in search?",
      "hotspots": [
        {
          "label": "Did the connector upload it?",
          "detail": "Check the posted documents in a mocked run first."
        },
        {
          "label": "Has it finished indexing?",
          "detail": "An accepted upload is not yet a searchable document. Use glean-idx document status."
        },
        {
          "label": "Is the datasource healthy?",
          "detail": "glean-idx datasource status shows uploaded and indexed counts per object type, identity counts, visibility, and recent runs."
        },
        {
          "label": "Can this user see it?",
          "detail": "glean-idx document access shows whether a given user can see a document. A correct-looking ACL is wrong if its identities were never pushed."
        },
        {
          "label": "Careful commands",
          "detail": "teardown cannot be undone. SDK exit codes are stable for scripting. An ambiguous failure is reconciled by reading state back, never by repeating the write."
        }
      ],
      "claims": [
        "C-202",
        "C-160",
        "C-322",
        "C-321",
        "C-205",
        "C-207",
        "C-208",
        "C-209"
      ]
    },
    {
      "id": "SCR-14",
      "archetype": "A3",
      "objective": "OBJ-06",
      "eyebrow": "Observe and deploy",
      "title": "A connector is a batch job",
      "body": "It starts, pulls from a source, pushes to Glean, and exits. You get stage timings, item counts, and structured logs without adding instrumentation. glean-idx deploy generates a Docker image and Terraform for a Kubernetes CronJob on GKE or EKS, but any scheduler that can run it works.",
      "bullets": [
        "Alert when documents_indexed drops sharply between runs.",
        "Cloud telemetry plugins are tested only against mocks: validate them in staging.",
        "Full and incremental schedules need separate deployment configurations.",
        "A completed Job proves only that the process exited successfully."
      ],
      "claims": [
        "C-210",
        "C-218",
        "C-332",
        "C-217",
        "C-204",
        "C-219",
        "C-213",
        "C-214"
      ]
    },
    {
      "id": "SCR-15",
      "archetype": "A6",
      "objective": "OBJ-06",
      "eyebrow": "Decision",
      "title": "The agent-generated connector",
      "type": "choice",
      "prompt": "The Connector Builder generated a connector, and its mocked tests pass. In review, you see every document set to allow_all_datasource_users_access. What do you do?",
      "options": [
        {
          "id": "o1",
          "correct": true,
          "text": "Reject it: map real ACLs and identities, then pass the recorded phase.",
          "feedback": "Right. An allow-all default is the most consequential thing to miss, and the recorded phase rejects it because it prevents proving denial."
        },
        {
          "id": "o2",
          "text": "Accept it: the mocked tests passed.",
          "feedback": "Mocked tests check transform output, not denial. Review permissions before trusting generated code."
        },
        {
          "id": "o3",
          "text": "Ship it and tighten the ACLs after launch.",
          "feedback": "Never index sensitive content with an allow-all ACL for now."
        }
      ],
      "takeaway": "Generated code gets the same review as yours.",
      "claims": [
        "C-329",
        "C-330",
        "C-152",
        "C-319",
        "C-195"
      ]
    },
    {
      "id": "SCR-16",
      "archetype": "A8",
      "objective": "OBJ-06",
      "eyebrow": "Build lab briefing",
      "title": "The SDK build lab, step by step",
      "steps": [
        {
          "title": "01 Credentials",
          "body": "glean-idx doctor with your datasource proves the token works."
        },
        {
          "title": "02 Data client",
          "body": "Cursor paging, a limiter below the source quota, max_attempts raised."
        },
        {
          "title": "03 Guard",
          "body": "A unit test proves an empty page before the end raises and nothing uploads."
        },
        {
          "title": "04 Transform",
          "body": "Stable IDs, epoch seconds, group and intersection ACLs."
        },
        {
          "title": "05 Identities",
          "body": "Users, groups, and memberships pushed before streaming content."
        },
        {
          "title": "06 Tests",
          "body": "Mock, then integration with negative identities configured."
        },
        {
          "title": "07 Live",
          "body": "A full run on the disposable datasource; document access checked for three personas."
        },
        {
          "title": "08 Incremental",
          "body": "Override the checkpoint; run incremental after source changes; explain why deletions need their own path."
        }
      ],
      "footnote": "The lab runs outside this package, in your own repository and a disposable test datasource provided by your program. Your assessor scores the lab evidence.",
      "claims": [
        "C-317",
        "C-193",
        "C-154",
        "C-153",
        "C-166",
        "C-155",
        "C-206",
        "C-321",
        "C-172",
        "C-174"
      ]
    },
    {
      "id": "SCR-17",
      "archetype": "quiz",
      "objective": "OBJ-05",
      "eyebrow": "Prove it",
      "title": "Indexing SDK check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-04",
          "stem": "A streaming connector indexes every page, but restricted pages are visible to no one. What is the most likely cause?",
          "options": [
            {
              "id": "b",
              "text": "Streaming connectors ignore ACLs entirely",
              "feedback": "They send the ACLs; the identities those ACLs name are missing."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Streaming connectors skip get_identities(), so the groups were never pushed",
              "feedback": "Right. An ACL naming an unknown group matches nobody."
            },
            {
              "id": "c",
              "text": "The batch size is too large for permissions",
              "feedback": "Batch size does not affect permissions."
            },
            {
              "id": "d",
              "text": "Processing takes 24 hours for streaming uploads",
              "feedback": "No such rule exists. Missing identities explain it."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-05",
          "stem": "An incremental run fetches the whole source every time. Why?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "_get_last_crawl_timestamp() was not overridden, so since is None",
              "feedback": "Right. The base implementation returns None and the client falls back to a full fetch."
            },
            {
              "id": "b",
              "text": "Incremental mode is not supported for this class",
              "feedback": "The mode is supported; the checkpoint is missing."
            },
            {
              "id": "c",
              "text": "The SDK resets checkpoints every night",
              "feedback": "The SDK does not persist checkpoints at all."
            },
            {
              "id": "d",
              "text": "batch_size is set below 1000",
              "feedback": "Batch size does not change what is fetched."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "An in-memory connector runs out of memory at 400,000 documents. What is the fix?",
          "options": [
            {
              "id": "b",
              "text": "Lower batch_size to 100",
              "feedback": "Batching happens after transform, so peak memory is unchanged."
            },
            {
              "id": "c",
              "text": "Raise upload_max_workers",
              "feedback": "Upload concurrency does not reduce source memory."
            },
            {
              "id": "d",
              "text": "Switch to incremental mode only",
              "feedback": "Full runs still need the whole scope."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Switch to a streaming connector",
              "feedback": "Right. Batching happens after transform, so batch size does not help."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-05",
          "stem": "A full crawl runs successfully and returns zero documents. What happens in Glean?",
          "options": [
            {
              "id": "b",
              "text": "Nothing; empty runs are skipped",
              "feedback": "The SDK sends one complete empty bulk page."
            },
            {
              "id": "c",
              "text": "The run fails with a validation error",
              "feedback": "It succeeds, which is the danger."
            },
            {
              "id": "a",
              "correct": true,
              "text": "All previously indexed documents are reconciled as stale",
              "feedback": "Right. An empty successful full crawl clears the datasource."
            },
            {
              "id": "d",
              "text": "Only documents older than 30 days are removed",
              "feedback": "No age rule applies."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-05",
          "stem": "You plan a live full run against a shared datasource with --max-items 5 to keep it small. What is the risk?",
          "options": [
            {
              "id": "b",
              "text": "None; five items cannot cause harm",
              "feedback": "A full replacement with five items deletes the rest."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The replacement is partial and can delete everything not included",
              "feedback": "Right. max_items limits source consumption, not Glean-side deletion."
            },
            {
              "id": "c",
              "text": "The run is rejected for being too small",
              "feedback": "It is accepted, which is the problem."
            },
            {
              "id": "d",
              "text": "Only the five items are re-indexed",
              "feedback": "A full run also removes what it did not include."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-05",
          "stem": "When should you use force_restart?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "After a crashed run leaves an upload stuck",
              "feedback": "Right. It discards any in-progress upload session."
            },
            {
              "id": "b",
              "text": "On every run, to be safe",
              "feedback": "It is not a default."
            },
            {
              "id": "c",
              "text": "To speed up large uploads",
              "feedback": "It changes session handling, not speed."
            },
            {
              "id": "d",
              "text": "To skip the stale-deletion check",
              "feedback": "That is a different option."
            }
          ]
        },
        {
          "id": "Q-07",
          "objective": "OBJ-05",
          "stem": "Why does the uploader send the first and last pages of a bulk upload sequentially?",
          "options": [
            {
              "id": "b",
              "text": "Glean accepts only one page at a time",
              "feedback": "Middle pages can be concurrent."
            },
            {
              "id": "c",
              "text": "To keep memory use low",
              "feedback": "The reason is session integrity."
            },
            {
              "id": "d",
              "text": "To keep the order of documents in search",
              "feedback": "Upload order does not set search order."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The first opens the session; the last closes it and triggers stale deletion",
              "feedback": "Right. Neither can race."
            }
          ]
        },
        {
          "id": "Q-08",
          "objective": "OBJ-05",
          "stem": "A connector reacts to webhooks from the source. Which upload call fits?",
          "options": [
            {
              "id": "b",
              "text": "bulk_index_documents() for every event",
              "feedback": "That replaces the datasource on every event."
            },
            {
              "id": "c",
              "text": "A full crawl for every event",
              "feedback": "Full crawls replace everything."
            },
            {
              "id": "a",
              "correct": true,
              "text": "index_documents(), the additive call",
              "feedback": "Right. It is the right call for event-driven connectors."
            },
            {
              "id": "d",
              "text": "teardown, then re-upload",
              "feedback": "teardown cannot be undone."
            }
          ]
        },
        {
          "id": "Q-09",
          "objective": "OBJ-03",
          "stem": "What does the SDK HTTP client's default max_attempts=2 mean?",
          "options": [
            {
              "id": "b",
              "text": "Two retries after the first attempt",
              "feedback": "The value counts total attempts."
            },
            {
              "id": "a",
              "correct": true,
              "text": "One retry after the first attempt",
              "feedback": "Right. It is total attempts, deliberately conservative."
            },
            {
              "id": "c",
              "text": "Two requests per second",
              "feedback": "Pacing is the rate limiter's job."
            },
            {
              "id": "d",
              "text": "Retry any status twice",
              "feedback": "Only 429 and listed 5xx codes are retried."
            }
          ]
        },
        {
          "id": "Q-10",
          "objective": "OBJ-06",
          "stem": "The CronJob shows Completed. What has that proven?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Only that the process exited successfully",
              "feedback": "Right. Document status proves indexing."
            },
            {
              "id": "b",
              "text": "That every document is searchable",
              "feedback": "Indexing is asynchronous and separate from the job."
            },
            {
              "id": "c",
              "text": "That permissions were validated",
              "feedback": "Search as the user is the ground truth."
            },
            {
              "id": "d",
              "text": "That the full crawl was complete",
              "feedback": "A partial crawl can exit successfully."
            }
          ]
        },
        {
          "id": "Q-11",
          "objective": "OBJ-06",
          "stem": "Why does the integration phase reject allow_all_datasource_users_access?",
          "options": [
            {
              "id": "b",
              "text": "It is not supported by the Indexing API",
              "feedback": "It is supported; it defeats denial testing."
            },
            {
              "id": "c",
              "text": "It slows down the replay",
              "feedback": "The reason is testability of denial."
            },
            {
              "id": "d",
              "text": "It needs a Client API token",
              "feedback": "Tokens are unrelated."
            },
            {
              "id": "a",
              "correct": true,
              "text": "It prevents proving that a configured identity is denied",
              "feedback": "Right."
            }
          ]
        },
        {
          "id": "Q-12",
          "objective": "OBJ-01",
          "stem": "90% of wall-clock time is data_fetch. What should you tune?",
          "options": [
            {
              "id": "b",
              "text": "More upload worker threads",
              "feedback": "Upload is not the bottleneck."
            },
            {
              "id": "c",
              "text": "document_batch_size_bytes",
              "feedback": "Upload batching is not the bottleneck."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The fetch stage, which dominates",
              "feedback": "Right. Tuning upload concurrency accomplishes nothing here."
            },
            {
              "id": "d",
              "text": "upload_timeout_ms",
              "feedback": "Upload timeouts are not the bottleneck."
            }
          ]
        },
        {
          "id": "Q-13",
          "objective": "OBJ-01",
          "stem": "What does GLEAN_INDEXING_API_TOKEN hold?",
          "options": [
            {
              "id": "b",
              "text": "The source system's API key",
              "feedback": "Source credentials belong to your data client."
            },
            {
              "id": "a",
              "correct": true,
              "text": "A datasource-scoped Indexing API token",
              "feedback": "Right. A missing variable fails at client construction."
            },
            {
              "id": "c",
              "text": "A Client API token for search",
              "feedback": "The SDK pushes with an Indexing API token."
            },
            {
              "id": "d",
              "text": "An OAuth refresh token",
              "feedback": "The Indexing API supports only Glean-issued tokens."
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
      "body": "Each screen lists claim ids such as C-101. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.",
      "table": {
        "caption": "Claim ids by source",
        "head": [
          "Source",
          "Where to find it",
          "Claim ids"
        ],
        "rows": [
          [
            "Bulk Indexing",
            "Glean Developer docs (developers.glean.com)",
            "C-101"
          ],
          [
            "Indexing SDK — Indexing modes",
            "Glean Developer docs (developers.glean.com)",
            "C-170, C-172, C-173, C-174, C-177, C-178, C-325"
          ],
          [
            "Indexing SDK — Permissions",
            "Glean Developer docs (developers.glean.com)",
            "C-195, C-196, C-198, C-199, C-200, C-201, C-319, C-320"
          ],
          [
            "Indexing SDK — Architecture",
            "Glean Developer docs (developers.glean.com)",
            "C-161, C-162, C-163, C-164, C-165, C-166, C-310, C-311, C-312, C-313, C-324"
          ],
          [
            "Indexing SDK — Connector types",
            "Glean Developer docs (developers.glean.com)",
            "C-167, C-168, C-169, C-314, C-315, C-316"
          ],
          [
            "Indexing SDK — PushUploader",
            "Glean Developer docs (developers.glean.com)",
            "C-180, C-181"
          ],
          [
            "Indexing SDK — Batching and throughput",
            "Glean Developer docs (developers.glean.com)",
            "C-184, C-185"
          ],
          [
            "Indexing SDK — HTTP client",
            "Glean Developer docs (developers.glean.com)",
            "C-186, C-187, C-188, C-317, C-318"
          ],
          [
            "Indexing SDK — Pagination",
            "Glean Developer docs (developers.glean.com)",
            "C-190, C-191, C-323"
          ],
          [
            "Indexing SDK — Rate limiting",
            "Glean Developer docs (developers.glean.com)",
            "C-193, C-194"
          ],
          [
            "Indexing SDK — Status and debugging",
            "Glean Developer docs (developers.glean.com)",
            "C-202, C-204, C-205"
          ],
          [
            "Indexing SDK — CLI",
            "Glean Developer docs (developers.glean.com)",
            "C-206, C-207, C-208, C-209, C-321, C-322"
          ],
          [
            "Indexing SDK — Deployment overview",
            "Glean Developer docs (developers.glean.com)",
            "C-210, C-213, C-214, C-217, C-332"
          ],
          [
            "Indexing SDK — Observability",
            "Glean Developer docs (developers.glean.com)",
            "C-218, C-219"
          ],
          [
            "Indexing SDK — Overview",
            "Glean Developer docs (developers.glean.com)",
            "C-150, C-152, C-153, C-154, C-155, C-329, C-330"
          ],
          [
            "Indexing SDK — Quickstart",
            "Glean Developer docs (developers.glean.com)",
            "C-157, C-158, C-159, C-160, C-326"
          ]
        ]
      },
      "claims": []
    },
    {
      "id": "SCR-18",
      "archetype": "A14",
      "objective": "OBJ-01",
      "eyebrow": "Next step",
      "title": "Next: build it under fire",
      "body": "BLD-202 is the end-to-end implementation lab: full and incremental runs, deletions, permission-only changes, injected faults, reconciliation, and handoff.",
      "signature": true,
      "claims": []
    }
  ]
};
