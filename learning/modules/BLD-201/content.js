/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "BLD-201",
  "title": "Custom Connector Best Practices",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Apply the custom connector reference architecture."
    },
    {
      "id": "OBJ-02",
      "text": "Design stable IDs and a content model that survives renames and relations."
    },
    {
      "id": "OBJ-03",
      "text": "Map source identities and permissions without broad fallbacks."
    },
    {
      "id": "OBJ-04",
      "text": "Design completeness guards that stop a partial full crawl from finishing."
    },
    {
      "id": "OBJ-05",
      "text": "Choose a freshness and deletion strategy for every object family."
    },
    {
      "id": "OBJ-06",
      "text": "Design reliability, state, security, and monitoring for production."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-04",
      "eyebrow": "Cold open",
      "title": "Success, and nothing indexed",
      "body": "Under load, the source API returns 200 with an empty list and no cursor, long before the real end. The connector treats it as the end, reports success, and finalizes the full run. By morning, thousands of pages are gone from search. Nothing errored. This module is about building connectors that fail loudly instead.",
      "footnote": "Composite, fictional case used across this accreditation. Product behavior is sourced; the customer environment and its numbers are invented for practice.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Design for the failure you will meet",
      "bullets": [
        "Apply the reference architecture.",
        "Design stable IDs and a content model.",
        "Map identities and permissions without broad fallbacks.",
        "Guard full crawls against partial fetches.",
        "Plan freshness and deletion for every object family.",
        "Build reliability, state, security, and monitoring in."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Reference architecture",
      "title": "Six layers, one job each",
      "body": "Keep the connector boring and layered. Read-only credentials at the source. A data client that paces below quota and retries. A transform that combines related records into one document where that helps. A simple database to track document state. An uploader with retries, backoff, and a dead-letter queue. Operations that rotate tokens automatically.",
      "asset": {
        "src": "assets/svg/bld-201-a01.svg",
        "alt": "Six stacked layers from source to operations, with the completeness guard highlighted.",
        "caption": "Every layer has one job. The guard sits in the data client."
      },
      "claims": [
        "C-251",
        "C-193",
        "C-236",
        "C-237",
        "C-242",
        "C-238"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-02",
      "eyebrow": "Content model",
      "title": "Four content-model rules",
      "hotspots": [
        {
          "label": "Stable IDs",
          "detail": "Derive the document ID from the source's immutable identifier, not a title, slug, or URL. A changed ID is a different document, and bulk replacement deletes the old one."
        },
        {
          "label": "One object, one document",
          "detail": "It may be better to combine relational data into a single document object to be indexed."
        },
        {
          "label": "Timestamps",
          "detail": "Use epoch seconds. With the SDK, created_at and updated_at must be epoch seconds, not ISO strings."
        },
        {
          "label": "Links",
          "detail": "Each viewURL must match the datasource urlRegex, which must be neither too broad nor too narrow."
        }
      ],
      "footnote": "The stable-ID rule is studio guidance derived from the sourced replacement behavior.",
      "claims": [
        "C-101",
        "C-236",
        "C-153",
        "C-119"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A10",
      "objective": "OBJ-02",
      "eyebrow": "Myth versus reality",
      "title": "Four design shortcuts reviewers reject",
      "hotspots": [
        {
          "label": "Myth: bulk index every run; it is simpler.",
          "detail": "Bulk indexing replaces the document list. Anything missing from the run is deleted. Use it for full runs that you have proven complete."
        },
        {
          "label": "Myth: titles and URLs make fine IDs.",
          "detail": "They change on rename. The new ID is a new document, and the old one is removed as stale."
        },
        {
          "label": "Myth: flattening groups into users is safer.",
          "detail": "Do not flatten groups into user lists. Map groups directly, and consider roles a type of group."
        },
        {
          "label": "Myth: the source checks access on click, so ACLs can be loose.",
          "detail": "Retrieved snippets are passed to the model before anyone clicks. The source check at click time comes too late."
        }
      ],
      "claims": [
        "C-101",
        "C-170",
        "C-197",
        "C-235",
        "C-026",
        "C-025"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Identity and permissions",
      "title": "Map the source's access model exactly",
      "bullets": [
        "Consider roles a type of group. Do not flatten groups into user lists.",
        "Index a group before its memberships. Nested groups use memberGroupName.",
        "For a both-groups rule, use one intersection entry: a user must belong to every group within it.",
        "An ACL naming a group Glean has never heard of matches nobody.",
        "Never index sensitive content with an allow-all ACL for now.",
        "If the source lets its admins read everything, decide with the customer whether that bypass is mirrored. The default is not to."
      ],
      "claims": [
        "C-235",
        "C-197",
        "C-114",
        "C-115",
        "C-198",
        "C-196",
        "C-195"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A9",
      "objective": "OBJ-03",
      "eyebrow": "Practice",
      "title": "Map each source rule",
      "prompt": "Choose the permission shape for each source rule.",
      "type": "sort",
      "categories": [
        "allowedGroups entries",
        "Group intersection",
        "Nested membership",
        "No added access"
      ],
      "pairs": [
        {
          "item": "Readable by clinical staff or pharmacists.",
          "category": "allowedGroups entries",
          "why": "Either group is enough: list both groups."
        },
        {
          "item": "Readable only by users in both the pharmacist group and clinic 014.",
          "category": "Group intersection",
          "why": "A user must belong to every group within one intersection entry."
        },
        {
          "item": "Nurse leads are a member group of clinical staff.",
          "category": "Nested membership",
          "why": "Index the membership with memberGroupName rather than flattening users."
        },
        {
          "item": "Source admins can read every page through a bypass.",
          "category": "No added access",
          "why": "Do not mirror the bypass unless the customer decides otherwise; grant access through groups."
        }
      ],
      "takeaway": "Map the rule, not the result you hope for.",
      "claims": [
        "C-198",
        "C-115",
        "C-197"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A5",
      "objective": "OBJ-05",
      "eyebrow": "Freshness and deletion",
      "title": "One strategy per object family",
      "table": {
        "caption": "Freshness and deletion mechanisms",
        "head": [
          "Mechanism",
          "What it does",
          "Watch for"
        ],
        "rows": [
          [
            "Incremental",
            "Every 15 to 60 minutes, keeps search fresh at low cost",
            "Needs a durable checkpoint and a reliable source-side deletion signal"
          ],
          [
            "Full run",
            "Nightly or weekly, reconciles deletions and repairs drift",
            "Replaces everything; must be proven complete"
          ],
          [
            "Explicit deletes",
            "Removes what the source reports as deleted",
            "Only as good as the source's deletion signal"
          ],
          [
            "Permission refresh",
            "Pushes ACL and membership changes that have no content edit",
            "Processed asynchronously; schedule to the removal target"
          ]
        ]
      },
      "footnote": "Partner guidance suggests incremental plus monthly full runs; SDK guidance suggests nightly or weekly. Choose by how long the source keeps its deletion signal.",
      "claims": [
        "C-175",
        "C-174",
        "C-176",
        "C-116",
        "C-257",
        "C-239"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A7",
      "objective": "OBJ-05",
      "eyebrow": "Checkpoints",
      "title": "A checkpoint that cannot skip changes",
      "steps": [
        {
          "title": "Record",
          "body": "Record the timestamp from before the crawl started."
        },
        {
          "title": "Write on success",
          "body": "Only write it after the run succeeds."
        },
        {
          "title": "Overlap",
          "body": "Overlap the next window slightly rather than risk a gap."
        },
        {
          "title": "Store durably",
          "body": "The SDK does not persist checkpoints. Keep them in your state store."
        }
      ],
      "claims": [
        "C-173",
        "C-179",
        "C-172",
        "C-237"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A3",
      "objective": "OBJ-04",
      "eyebrow": "Completeness",
      "title": "The guard that matters most",
      "body": "Never let a partial or failed fetch finish as a successful full crawl. A failed crawl is recoverable. A successful crawl that deleted most of the index is not. A full crawl must cover the entire confirmed scope, because stale deletion removes anything absent from the run.",
      "bullets": [
        "Raise when a page comes back empty before the known end.",
        "Compare the fetched count with a source count, the prior run, and expected churn.",
        "The SDK stops cursor paging when a cursor is missing, empty, or repeated. That is correct for honest sources and wrong for a source that drops its cursor early.",
        "Offset pagination is unstable while the source is being written to."
      ],
      "asset": {
        "src": "assets/svg/bld-201-a02.svg",
        "alt": "Four-step completeness guard ending in finalize only on pass.",
        "caption": "A failed crawl is recoverable. A bad successful one is not."
      },
      "claims": [
        "C-170",
        "C-171",
        "C-154",
        "C-323",
        "C-190",
        "C-191"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "A6",
      "objective": "OBJ-04",
      "eyebrow": "Decision",
      "title": "A 3.8% drop",
      "type": "choice",
      "prompt": "Last night's full run fetched 38,350 pages. Tonight's fetched 36,900. The source averages about 40 deletions a day. What does the connector do?",
      "options": [
        {
          "id": "o2",
          "text": "Finalize: the drop is below the 20% safeguard.",
          "feedback": "Below 20%, stale documents are deleted, not paused. The safeguard is not a completeness check."
        },
        {
          "id": "o3",
          "text": "Finalize, then re-add any missing pages in tomorrow's run.",
          "feedback": "Users lose those pages until the next run, and a bad successful crawl is not recoverable in the meantime."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "Halt before finalizing, reconcile against tombstones and a source count, then rerun.",
          "feedback": "Right. 1,450 missing pages is far beyond normal churn. Never let a partial fetch finish as a successful full crawl."
        }
      ],
      "takeaway": "Compare against expected churn, not against the safeguard.",
      "claims": [
        "C-170",
        "C-107",
        "C-171"
      ]
    },
    {
      "id": "SCR-12",
      "archetype": "A7",
      "objective": "OBJ-06",
      "eyebrow": "Reliability",
      "title": "Reliability, step by step",
      "steps": [
        {
          "title": "Pace",
          "body": "A rate limiter is proactive: pace below the source quota. Retries are reactive: use both."
        },
        {
          "title": "Retry",
          "body": "The SDK default is one retry. Raise it to 4 or 5 against APIs that rate-limit aggressively."
        },
        {
          "title": "Park",
          "body": "Send items that keep failing to a dead-letter queue instead of dropping them."
        },
        {
          "title": "Reconcile",
          "body": "After an ambiguous transport failure, read state back. Never blindly repeat the write."
        },
        {
          "title": "Fail visibly",
          "body": "Exit non-zero so the scheduler sees the failure. Use forceRestart only after a crashed run leaves an upload stuck."
        }
      ],
      "claims": [
        "C-194",
        "C-193",
        "C-186",
        "C-317",
        "C-242",
        "C-209",
        "C-165",
        "C-178"
      ]
    },
    {
      "id": "SCR-13",
      "archetype": "A5",
      "objective": "OBJ-06",
      "eyebrow": "Security and operations",
      "title": "Production controls",
      "table": {
        "caption": "Controls every production connector needs",
        "head": [
          "Area",
          "Control"
        ],
        "rows": [
          [
            "Source credentials",
            "Read-only keys where supported"
          ],
          [
            "Indexing token",
            "Per environment, IP restricted, rotation automated"
          ],
          [
            "Secrets",
            "In a secret store; with the SDK deployment, the workload gets exact secret access and cannot enumerate secrets"
          ],
          [
            "Logs",
            "Query parameters are redacted in request logs; redaction covers logging only"
          ],
          [
            "Monitoring",
            "Alert when documents_indexed drops sharply between runs"
          ],
          [
            "Documentation",
            "Customer-facing docs explain permission propagation logic"
          ]
        ]
      },
      "claims": [
        "C-251",
        "C-057",
        "C-059",
        "C-238",
        "C-215",
        "C-187",
        "C-188",
        "C-204",
        "C-275"
      ]
    },
    {
      "id": "SCR-14",
      "archetype": "A8",
      "objective": "OBJ-05",
      "eyebrow": "Worked example",
      "title": "The policy wiki design record",
      "steps": [
        {
          "title": "IDs",
          "body": "Document ID = the immutable page_id. Slugs change on rename, so they are never IDs."
        },
        {
          "title": "Permissions",
          "body": "Read groups become allowedGroups; both-groups rules become one intersection entry; nurse leads nest with memberGroupName."
        },
        {
          "title": "Freshness",
          "body": "Incremental every hour from a checkpoint written on success."
        },
        {
          "title": "Deletion",
          "body": "Tombstones delete explicitly each hour. Tombstones last 30 days, so a nightly full run reconciles anything missed."
        },
        {
          "title": "Guard",
          "body": "Raise on an empty page before the end; halt if the count falls well beyond expected churn."
        },
        {
          "title": "Operations",
          "body": "Secrets in the secret store; alert on a sharp drop in indexed documents."
        }
      ],
      "footnote": "Composite, fictional case used across this accreditation. Product behavior is sourced; the customer environment and its numbers are invented for practice.",
      "claims": [
        "C-101",
        "C-198",
        "C-115",
        "C-173",
        "C-176",
        "C-170",
        "C-204"
      ]
    },
    {
      "id": "SCR-15",
      "archetype": "A13",
      "objective": "OBJ-06",
      "eyebrow": "Job aid",
      "title": "Self-review before anyone else reviews",
      "cards": [
        {
          "tag": "IDs",
          "title": "Identity of documents",
          "body": "IDs come from immutable source identifiers."
        },
        {
          "tag": "ACL",
          "title": "Access",
          "body": "Users and groups indexed first; groups mapped directly; no allow-all on sensitive content."
        },
        {
          "tag": "Guard",
          "title": "Completeness",
          "body": "A full run halts before finalizing on an early empty page or a count anomaly."
        },
        {
          "tag": "Fresh",
          "title": "Freshness and deletion",
          "body": "Every object family has a deletion path; checkpoints written on success only."
        },
        {
          "tag": "Ops",
          "title": "Operations and security",
          "body": "Secrets in a store; tokens per environment; alert on sharp drops."
        }
      ],
      "claims": [
        "C-101",
        "C-111",
        "C-114",
        "C-195",
        "C-170",
        "C-174",
        "C-173",
        "C-057",
        "C-204"
      ]
    },
    {
      "id": "SCR-16",
      "archetype": "quiz",
      "objective": "OBJ-04",
      "eyebrow": "Prove it",
      "title": "Best practices check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-02",
          "stem": "Source pages have an immutable page_id and a slug that changes on rename. What should the Glean document ID be?",
          "options": [
            {
              "id": "b",
              "text": "The slug, because it is readable",
              "feedback": "A rename changes the slug, creating a duplicate and deleting the old document on the next full run."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The immutable page_id",
              "feedback": "Right. A changed ID is a new document, and bulk replacement removes the old one."
            },
            {
              "id": "c",
              "text": "The page title",
              "feedback": "Titles change and repeat."
            },
            {
              "id": "d",
              "text": "A hash of the page body",
              "feedback": "Every edit would create a new document."
            }
          ]
        },
        {
          "id": "Q-11",
          "objective": "OBJ-01",
          "stem": "Where should a production connector keep document state and checkpoints?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "In a simple database the connector owns",
              "feedback": "Right. A simple database of document state makes freshness easier to ensure, and the SDK does not persist checkpoints."
            },
            {
              "id": "b",
              "text": "In memory, rebuilt from scratch on each run",
              "feedback": "State that disappears with the process cannot drive incremental runs."
            },
            {
              "id": "c",
              "text": "Nowhere; Glean stores it for the connector",
              "feedback": "The connector owns its state. The SDK does not persist checkpoints."
            },
            {
              "id": "d",
              "text": "In the viewURL of each document",
              "feedback": "The viewURL is the click-through link, not a state store."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-03",
          "stem": "The source has 40 roles that grant read access to spaces. How should they be modeled?",
          "options": [
            {
              "id": "b",
              "text": "Flattened into user lists on each document",
              "feedback": "Do not flatten groups into user lists; they drift."
            },
            {
              "id": "c",
              "text": "As allowAnonymousAccess on role spaces",
              "feedback": "That exposes documents to anyone signed into Glean."
            },
            {
              "id": "d",
              "text": "As custom metadata on each document",
              "feedback": "Metadata does not control access."
            },
            {
              "id": "a",
              "correct": true,
              "text": "As groups with memberships",
              "feedback": "Right. Consider roles a type of group."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-03",
          "stem": "A page requires membership in both the pharmacist group and the clinic group. How is it mapped?",
          "options": [
            {
              "id": "b",
              "text": "Both groups listed in allowedGroups",
              "feedback": "That would let either group read the page."
            },
            {
              "id": "c",
              "text": "Two separate intersection entries",
              "feedback": "Multiple entries are alternatives, so either would grant access."
            },
            {
              "id": "a",
              "correct": true,
              "text": "One intersection entry that contains both groups",
              "feedback": "Right. A user must belong to every group within one entry."
            },
            {
              "id": "d",
              "text": "Only the clinic group, since it is narrower",
              "feedback": "Clinic staff who are not pharmacists would gain access."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-04",
          "stem": "During a full crawl, the source returns an empty page with no cursor well before the expected total. What should the connector do?",
          "options": [
            {
              "id": "b",
              "text": "Finalize, because the cursor has ended",
              "feedback": "Everything not fetched would be deleted as stale."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Raise an error and leave the full run unfinalized",
              "feedback": "Right. A full crawl must cover the entire scope before completing."
            },
            {
              "id": "c",
              "text": "Retry that page once, then finalize whatever it has",
              "feedback": "If the retry is also short, the run is still partial."
            },
            {
              "id": "d",
              "text": "Finalize and rely on the 20% safeguard",
              "feedback": "Smaller losses are still deleted."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-05",
          "stem": "What does an incremental crawl need before it is correct rather than merely faster?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "A durable checkpoint and a reliable deletion signal",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "A shorter schedule than the full run",
              "feedback": "Schedule does not make it correct."
            },
            {
              "id": "c",
              "text": "A larger batch size",
              "feedback": "Batch size affects throughput, not correctness."
            },
            {
              "id": "d",
              "text": "Bulk uploads on every run",
              "feedback": "Bulk is replacement, the opposite of incremental."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-05",
          "stem": "When should an incremental connector write its checkpoint?",
          "options": [
            {
              "id": "b",
              "text": "Write the current time when the first page is fetched",
              "feedback": "A failure after that would skip changes on the next run."
            },
            {
              "id": "c",
              "text": "Write the end time even if the run failed",
              "feedback": "A failed run must not advance the checkpoint."
            },
            {
              "id": "d",
              "text": "Never; the SDK persists it automatically",
              "feedback": "The SDK does not persist checkpoints."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Record the start time before the crawl; write it only after success",
              "feedback": "Right."
            }
          ]
        },
        {
          "id": "Q-07",
          "objective": "OBJ-06",
          "stem": "The source rate-limits aggressively. What retry setting does SDK guidance suggest?",
          "options": [
            {
              "id": "b",
              "text": "Keep the default of one retry",
              "feedback": "The default is deliberately conservative."
            },
            {
              "id": "c",
              "text": "Retry every status code, including 400 and 404",
              "feedback": "The client retries 429 and 5xx codes; everything else fails immediately."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Raise max_attempts to 4 or 5, with a rate limiter",
              "feedback": "Right. The default of 2 is one retry."
            },
            {
              "id": "d",
              "text": "Retry forever until the source recovers",
              "feedback": "Unbounded retries hide failures from the scheduler."
            }
          ]
        },
        {
          "id": "Q-08",
          "objective": "OBJ-06",
          "stem": "A datasource configuration call times out. You cannot tell whether it succeeded. What do you do?",
          "options": [
            {
              "id": "b",
              "text": "Repeat the write until it returns success",
              "feedback": "Never blindly repeat the write."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Read the configuration back and compare it",
              "feedback": "Right. Ambiguous failures are reconciled by reading state back."
            },
            {
              "id": "c",
              "text": "Delete the datasource and recreate it",
              "feedback": "There is no Indexing API operation to delete a datasource registration."
            },
            {
              "id": "d",
              "text": "Ignore it and start uploading",
              "feedback": "Uploads against an unknown configuration compound the problem."
            }
          ]
        },
        {
          "id": "Q-09",
          "objective": "OBJ-06",
          "stem": "Where should the source API key and indexing token live in production?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "In a secret store, with the workload granted exact access",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "In the repository's config file",
              "feedback": "Secrets in code or config leak with the repository."
            },
            {
              "id": "c",
              "text": "In exception messages for easier debugging",
              "feedback": "Log redaction covers logging only. Keep secrets out of messages."
            },
            {
              "id": "d",
              "text": "In the container image",
              "feedback": "Images are copied and shared. Keep secrets out of them."
            }
          ]
        },
        {
          "id": "Q-10",
          "objective": "OBJ-06",
          "stem": "Which alert catches a partial full crawl earliest?",
          "options": [
            {
              "id": "b",
              "text": "The job's exit status alone",
              "feedback": "A partial crawl can exit successfully."
            },
            {
              "id": "c",
              "text": "CPU use on the connector host",
              "feedback": "CPU does not reflect completeness."
            },
            {
              "id": "d",
              "text": "A weekly manual dashboard review",
              "feedback": "Too slow: the documents are already gone."
            },
            {
              "id": "a",
              "correct": true,
              "text": "documents_indexed dropping sharply between runs",
              "feedback": "Right."
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
            "Bulk Indexing",
            "Glean Developer docs (developers.glean.com)",
            "C-101"
          ],
          [
            "Bulk Upload Model",
            "Glean Developer docs (developers.glean.com)",
            "C-107"
          ],
          [
            "Indexing API Authentication",
            "Glean Developer docs (developers.glean.com)",
            "C-057, C-059"
          ],
          [
            "Permissions (Indexing API guide)",
            "Glean Developer docs (developers.glean.com)",
            "C-111, C-114, C-115, C-116"
          ],
          [
            "Setup Datasource",
            "Glean Developer docs (developers.glean.com)",
            "C-119"
          ],
          [
            "Indexing SDK — Indexing modes",
            "Glean Developer docs (developers.glean.com)",
            "C-170, C-171, C-172, C-173, C-174, C-175, C-176, C-178, C-179"
          ],
          [
            "Indexing SDK — Permissions",
            "Glean Developer docs (developers.glean.com)",
            "C-195, C-196, C-197, C-198"
          ],
          [
            "Indexing SDK — Architecture",
            "Glean Developer docs (developers.glean.com)",
            "C-165"
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
            "C-204"
          ],
          [
            "Indexing SDK — CLI",
            "Glean Developer docs (developers.glean.com)",
            "C-209"
          ],
          [
            "Indexing SDK — Deployment overview",
            "Glean Developer docs (developers.glean.com)",
            "C-215, C-216"
          ],
          [
            "Indexing SDK — Overview",
            "Glean Developer docs (developers.glean.com)",
            "C-153, C-154"
          ],
          [
            "Glean Partner Content | Custom Connector Best Practices (deck, April 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-235, C-236, C-237, C-238, C-239, C-242"
          ],
          [
            "[External] Glean Partner Content | Custom Connector Questionnaire",
            "Glean partner document (ask your Partner Manager for access)",
            "C-251, C-257"
          ],
          [
            "[Template] Custom Connector Intake Form v2",
            "Glean partner document (ask your Partner Manager for access)",
            "C-275"
          ]
        ]
      },
      "claims": []
    },
    {
      "id": "SCR-17",
      "archetype": "A14",
      "objective": "OBJ-01",
      "eyebrow": "Next step",
      "title": "Design done. Learn the wire protocol.",
      "body": "CON-203 teaches the Indexing API and data model your design depends on. Submit your design record to your assessor first.",
      "signature": true,
      "claims": []
    }
  ]
};
