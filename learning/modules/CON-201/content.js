/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "CON-201",
  "title": "Indexing Architecture and Data Flow",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Trace a document from fetch or push to a cited answer, naming each stage."
    },
    {
      "id": "OBJ-02",
      "text": "Distinguish accepted, processed, and searchable states, and read the evidence for each."
    },
    {
      "id": "OBJ-03",
      "text": "Explain bulk replacement, incremental updates, and the stale-deletion safeguard."
    },
    {
      "id": "OBJ-04",
      "text": "Decide why a given user can or cannot see a document."
    },
    {
      "id": "OBJ-05",
      "text": "Diagnose where a missing, stale, or over-visible document is stuck."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-02",
      "eyebrow": "Cold open",
      "title": "Accepted, but not found",
      "body": "Your connector pushed a revised policy page, and the API accepted it. Forty minutes later, a nurse lead searches and gets last month's version. Nothing errored. Where is the page? This module gives you the map to answer that in minutes, not days.",
      "footnote": "Composite, fictional case used across this accreditation. Product behavior is sourced; the customer environment and its numbers are invented for practice.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Read the pipeline like an engineer",
      "bullets": [
        "Trace a document from fetch or push to a cited answer.",
        "Tell accepted, processed, and searchable apart, with evidence for each.",
        "Predict what bulk and incremental writes delete, and when the safeguard applies.",
        "Explain why one user sees a document and another does not.",
        "Locate where a missing, stale, or over-visible document is stuck."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Two ingestion paths",
      "title": "Two ways in, one platform",
      "body": "Native connectors call source APIs directly. Custom connectors push documents, metadata, and permissions through the Indexing API. After ingestion, both share the same machinery: documents, permissions, people data, and user activity flow through the same backend queueing and indexing system, so one type of backlog can affect another.",
      "claims": [
        "C-005",
        "C-041",
        "C-232"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-01",
      "eyebrow": "The pipeline",
      "title": "Stage by stage",
      "body": "Open each stage for what happens there.",
      "hotspots": [
        {
          "label": "Fetch or push",
          "detail": "Connectors fetch data, including permissions. A custom connector pushes instead, from wherever it runs; Glean places no constraints on where that is."
        },
        {
          "label": "Parse",
          "detail": "Item content such as title, body, comments, and media is parsed together with permissions."
        },
        {
          "label": "Process",
          "detail": "Processing verifies identities and access data and waits for required dependencies. Glean expands derived groups and memberships."
        },
        {
          "label": "Index and graph",
          "detail": "Connectors populate the index plus identity and permission structures; the graph layers structure and signals on top of that data."
        },
        {
          "label": "Query",
          "detail": "The runtime chooses index, live, or hybrid paths per request. Retrieved snippets are passed to the model to condition the answer."
        }
      ],
      "asset": {
        "src": "assets/svg/con-201-a01.svg",
        "alt": "Six-stage pipeline from fetch or push to a cited answer.",
        "caption": "Most stuck documents are stuck between stages 03 and 05."
      },
      "claims": [
        "C-003",
        "C-041",
        "C-044",
        "C-004",
        "C-234",
        "C-073",
        "C-018",
        "C-023",
        "C-026"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A5",
      "objective": "OBJ-02",
      "eyebrow": "Three states",
      "title": "Accepted, processed, searchable",
      "body": "Indexing is asynchronous. Plan for around 15 to 20 minutes before new documents appear, and treat that as typical, not guaranteed.",
      "table": {
        "caption": "What each state means and how to prove it",
        "head": [
          "State",
          "What it means",
          "Evidence to check"
        ],
        "rows": [
          [
            "Accepted",
            "The API accepted the request. For users, UPLOAD COMPLETED means only this.",
            "API response and upload history"
          ],
          [
            "Processed",
            "Queued work finished: identities verified; groups and memberships expanded.",
            "processingHistory timestamp"
          ],
          [
            "Searchable",
            "New documents appear once processingHistory is after bulkUploadHistory and the datasource is enabled for search.",
            "A search run as an authorized user"
          ]
        ]
      },
      "claims": [
        "C-110",
        "C-104",
        "C-072",
        "C-073",
        "C-070",
        "C-103",
        "C-200"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A10",
      "objective": "OBJ-02",
      "eyebrow": "Myth versus reality",
      "title": "Three beliefs that waste a day of debugging",
      "hotspots": [
        {
          "label": "Myth: the upload response proves the document is live.",
          "detail": "An accepted upload is not yet a searchable document. Processing happens afterward, asynchronously."
        },
        {
          "label": "Myth: each kind of backlog is independent.",
          "detail": "Documents, permissions, people data, and activity share one queue, so one backlog can delay another. The worst case runs from several hours to more than 24 hours."
        },
        {
          "label": "Myth: a correct-looking ACL is enough.",
          "detail": "An ACL is still wrong if the identities it names were never pushed. An ACL naming a group Glean has never heard of matches nobody."
        }
      ],
      "claims": [
        "C-160",
        "C-110",
        "C-232",
        "C-233",
        "C-205",
        "C-196"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Write modes",
      "title": "Replacement versus increments",
      "body": "Bulk indexing fully replaces the list of documents stored for the datasource. After a successful bulk upload, every document that was not part of that upload is deleted asynchronously. The /indexdocuments endpoint is intended for incremental updates and removes nothing by omission.",
      "bullets": [
        "Every paginated request in one bulk upload shares one unique uploadId.",
        "Concurrent uploads are not allowed: finish one before starting the next.",
        "After an unsuccessful upload, the next request must set forceRestartUpload or it fails."
      ],
      "asset": {
        "src": "assets/svg/con-201-a02.svg",
        "alt": "Comparison of bulk replacement and incremental writes.",
        "caption": "Know what each write mode deletes before you schedule it."
      },
      "claims": [
        "C-101",
        "C-102",
        "C-109",
        "C-105",
        "C-106",
        "C-163"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A4",
      "objective": "OBJ-03",
      "eyebrow": "The safeguard",
      "title": "The 20% rule protects you, but only partly",
      "hotspots": [
        {
          "label": "The rule",
          "detail": "If the share of documents being deleted as stale exceeds 20%, deletion of those stale documents pauses for 7 days."
        },
        {
          "label": "Immediate deletions",
          "detail": "To make deletions take effect immediately, use /processalldocuments. It is limited to one request every 3 hours per datasource."
        },
        {
          "label": "Below the threshold",
          "detail": "A run that silently drops 8% of documents is under 20%, so those documents are deleted. The safeguard is not a completeness check."
        },
        {
          "label": "Empty runs",
          "detail": "With the Indexing SDK, a successful empty full crawl sends one complete empty page, and all previously indexed documents are reconciled as stale."
        }
      ],
      "claims": [
        "C-107",
        "C-108",
        "C-079",
        "C-101",
        "C-170",
        "C-177"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A6",
      "objective": "OBJ-03",
      "eyebrow": "Decision",
      "title": "A token expires mid-run",
      "type": "choice",
      "prompt": "A nightly full run of the 38,400-page policy wiki returns 30,000 pages because the source token expired mid-crawl. The code still finalized the bulk upload. What happens?",
      "options": [
        {
          "id": "o2",
          "text": "Nothing, because Glean keeps every document it has already indexed.",
          "feedback": "Bulk indexing replaces the document list. Omitted documents are deleted unless the safeguard pauses them."
        },
        {
          "id": "o3",
          "text": "The 8,400 missing pages are deleted within minutes.",
          "feedback": "Above 20%, stale deletion pauses for 7 days. Immediate deletion requires /processalldocuments."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "About 22% would be deleted, so deletion of those documents pauses for 7 days. The run is still wrong.",
          "feedback": "Right. 8,400 of 38,400 is about 22%, above the 20% threshold. The pause buys time; it does not fix the run. Never let a partial fetch finish as a successful full crawl."
        }
      ],
      "takeaway": "The safeguard buys time. It never makes a partial run correct.",
      "claims": [
        "C-101",
        "C-107",
        "C-108",
        "C-170"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A7",
      "objective": "OBJ-04",
      "eyebrow": "Visibility",
      "title": "Five gates between a document and a user",
      "steps": [
        {
          "title": "01 Datasource enabled",
          "body": "The datasource must be enabled for search. A test datasource shows results only to beta users, who still need document permissions."
        },
        {
          "title": "02 Document permissions",
          "body": "Documents are either permission-aware, with ACLs pushed per document, or visible to everyone in the organization. You choose at setup."
        },
        {
          "title": "03 Identities exist",
          "body": "Users must be indexed before they are referenced. A group must be indexed before its memberships."
        },
        {
          "title": "04 Processing finished",
          "body": "Permissions and memberships are processed asynchronously."
        },
        {
          "title": "05 Click-through",
          "body": "Opening a result usually sends the user to the source, which may check access again."
        }
      ],
      "claims": [
        "C-103",
        "C-124",
        "C-048",
        "C-111",
        "C-114",
        "C-116",
        "C-025"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "A5",
      "objective": "OBJ-04",
      "eyebrow": "Read the flags literally",
      "title": "Three broad settings that mean different things",
      "table": {
        "caption": "Who each setting lets see a document",
        "head": [
          "Setting",
          "Who can see the document"
        ],
        "rows": [
          [
            "allowAnonymousAccess",
            "Anyone who is signed into Glean"
          ],
          [
            "allowAllDatasourceUsersAccess",
            "Users who have been indexed as users of this datasource"
          ],
          [
            "Indexing a user, with no ACL naming them",
            "Nobody new: indexing a user grants no document access"
          ]
        ]
      },
      "footnote": "Never index sensitive content with an allow-all ACL for now.",
      "claims": [
        "C-117",
        "C-071",
        "C-112",
        "C-195"
      ]
    },
    {
      "id": "SCR-12",
      "archetype": "A9",
      "objective": "OBJ-05",
      "eyebrow": "Practice",
      "title": "Where is it stuck?",
      "prompt": "Match each symptom to the stage where the document is stuck.",
      "type": "sort",
      "categories": [
        "Never uploaded",
        "Accepted, not processed",
        "Identity or permissions",
        "Deleted by replacement",
        "Visibility gate"
      ],
      "pairs": [
        {
          "item": "No upload record exists for the document ID.",
          "category": "Never uploaded",
          "why": "Check whether the connector posted it before looking inside Glean."
        },
        {
          "item": "Upload accepted an hour ago; processingHistory is older than bulkUploadHistory.",
          "category": "Accepted, not processed",
          "why": "Documents become searchable only after processing passes the upload."
        },
        {
          "item": "The page owner sees it; a nurse lead in the same group does not.",
          "category": "Identity or permissions",
          "why": "Check that the user, the group, and its memberships were pushed and processed."
        },
        {
          "item": "It appeared yesterday and vanished after the nightly full run.",
          "category": "Deleted by replacement",
          "why": "Appears, then disappears usually means a later full crawl omitted it."
        },
        {
          "item": "Only beta users see anything in the datasource.",
          "category": "Visibility gate",
          "why": "A test datasource shows results only to beta users with permissions."
        }
      ],
      "takeaway": "Name the stage first. The fix follows from the stage.",
      "claims": [
        "C-202",
        "C-070",
        "C-205",
        "C-203",
        "C-124"
      ]
    },
    {
      "id": "SCR-13",
      "archetype": "A8",
      "objective": "OBJ-05",
      "eyebrow": "Worked diagnosis",
      "title": "The stale policy page, solved",
      "steps": [
        {
          "title": "Symptom",
          "body": "Search returns last month's version 40 minutes after an accepted upload."
        },
        {
          "title": "Was it sent?",
          "body": "The upload log shows the new version posted under the same document ID."
        },
        {
          "title": "Is it processed?",
          "body": "processingHistory is still older than the upload. The page is accepted, not yet searchable."
        },
        {
          "title": "Why so slow?",
          "body": "The same hour pushed 2,000 membership changes. Documents and permissions share one queue."
        },
        {
          "title": "Action",
          "body": "Watch processing; do not re-upload. If processing is stuck, /processalldocuments reprocesses without a new upload, once every 3 hours."
        }
      ],
      "claims": [
        "C-070",
        "C-232",
        "C-075",
        "C-079"
      ]
    },
    {
      "id": "SCR-14",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Query time",
      "title": "Content quality limits answer quality",
      "body": "At query time, results are permission-filtered, and retrieved snippets are passed to the language model. What you index is what the model can use.",
      "bullets": [
        "Items over 64 MB index metadata and permissions only: users can find them, but Assistant cannot summarize them.",
        "Indexable content is truncated at 16.875 MB. Apply these limits to custom connectors too.",
        "Validate coverage and permissions in Search before relying on Assistant or Agents."
      ],
      "claims": [
        "C-026",
        "C-090",
        "C-241",
        "C-091",
        "C-093",
        "C-024"
      ]
    },
    {
      "id": "SCR-15",
      "archetype": "A13",
      "objective": "OBJ-05",
      "eyebrow": "Job aid",
      "title": "Where is my document?",
      "cards": [
        {
          "tag": "1",
          "title": "Was it sent?",
          "body": "Check the connector's posted documents and the upload history."
        },
        {
          "tag": "2",
          "title": "Is it processed?",
          "body": "Compare processingHistory with bulkUploadHistory."
        },
        {
          "tag": "3",
          "title": "Can this user see it?",
          "body": "Check datasource visibility, the ACL, and that every identity it names was pushed."
        },
        {
          "tag": "4",
          "title": "Did a full run remove it?",
          "body": "Compare fetched counts between runs, and check the 20% safeguard."
        }
      ],
      "claims": [
        "C-202",
        "C-070",
        "C-205",
        "C-203",
        "C-107"
      ]
    },
    {
      "id": "SCR-16",
      "archetype": "quiz",
      "objective": "OBJ-02",
      "eyebrow": "Prove it",
      "title": "Indexing architecture check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-02",
          "stem": "The Indexing API returns success for a document upload. What does that prove?",
          "options": [
            {
              "id": "b",
              "text": "The document is searchable for all permitted users",
              "feedback": "Searchability follows processing, which runs after acceptance."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The request was accepted; the document is not yet searchable",
              "feedback": "Right. Indexing is asynchronous. An accepted upload is not yet a searchable document."
            },
            {
              "id": "c",
              "text": "Permissions for the document have been evaluated",
              "feedback": "Permissions and memberships are processed asynchronously, after upload."
            },
            {
              "id": "d",
              "text": "The document has been added to the graph",
              "feedback": "Graph structures derive from processed data, which comes later."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "When do newly uploaded documents become available in search results?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "When processingHistory is later than bulkUploadHistory",
              "feedback": "Right. That is the documented signal to read."
            },
            {
              "id": "b",
              "text": "As soon as the last page of the upload is accepted",
              "feedback": "The last page closes the upload. Processing still has to run."
            },
            {
              "id": "c",
              "text": "Exactly 15 minutes after the upload",
              "feedback": "Around 15 to 20 minutes is typical, not guaranteed. Read the processing timestamps."
            },
            {
              "id": "d",
              "text": "After the next four-week native re-crawl",
              "feedback": "The four-week re-crawl is a native connector catch-all, not a custom connector step."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-03",
          "stem": "A successful bulk upload includes 38,000 of the 38,400 pages previously indexed. What happens to the other 400?",
          "options": [
            {
              "id": "b",
              "text": "They stay, because bulk uploads only add documents",
              "feedback": "Bulk indexing fully replaces the document list."
            },
            {
              "id": "c",
              "text": "They stay for 7 days and are then deleted",
              "feedback": "The 7-day pause applies only when more than 20% would be deleted."
            },
            {
              "id": "d",
              "text": "The upload is rejected until they are included",
              "feedback": "Omitted documents are treated as stale, not as an error."
            },
            {
              "id": "a",
              "correct": true,
              "text": "They are deleted asynchronously after the upload",
              "feedback": "Right. 400 of 38,400 is about 1%, below the 20% safeguard, so they are removed."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-03",
          "stem": "Which statement about the stale-deletion safeguard is accurate?",
          "options": [
            {
              "id": "b",
              "text": "It verifies that each full crawl fetched the whole source",
              "feedback": "It reacts only to large deletion percentages. Small silent losses are still deleted."
            },
            {
              "id": "c",
              "text": "It prevents bulk uploads from deleting anything",
              "feedback": "Below 20%, omitted documents are deleted."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Above 20% stale, deletion of those documents pauses for 7 days",
              "feedback": "Right."
            },
            {
              "id": "d",
              "text": "It needs a support ticket to release paused deletions",
              "feedback": "For immediate deletions, the documented path is /processalldocuments."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "The previous bulk upload failed midway. What must the next bulk upload do?",
          "options": [
            {
              "id": "b",
              "text": "Reuse the failed upload's uploadId to resume",
              "feedback": "Each upload needs its own unique uploadId, and a failed upload must be restarted."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Set forceRestartUpload, or the request fails",
              "feedback": "Right."
            },
            {
              "id": "c",
              "text": "Run concurrently with a cleanup upload",
              "feedback": "Concurrent uploads are not allowed."
            },
            {
              "id": "d",
              "text": "Wait for the four-week re-crawl to clear it",
              "feedback": "That re-crawl is native connector behavior."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-01",
          "stem": "A burst of 50,000 group-membership changes arrives just before a set of document updates. Why might the documents appear late?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Permissions and documents share one backend queue",
              "feedback": "Right. One type of backlog can affect another."
            },
            {
              "id": "b",
              "text": "Documents always wait for the next full run",
              "feedback": "Incremental updates do not wait for a full run."
            },
            {
              "id": "c",
              "text": "Membership changes lock the datasource for 24 hours",
              "feedback": "No lock is documented. The shared queue explains the delay."
            },
            {
              "id": "d",
              "text": "Glean processes memberships only at night",
              "feedback": "No such schedule is documented. The shared queue explains the delay."
            }
          ]
        },
        {
          "id": "Q-07",
          "objective": "OBJ-04",
          "stem": "A document has allowAnonymousAccess set to true. Who can see it in search?",
          "options": [
            {
              "id": "b",
              "text": "Only users indexed for that datasource",
              "feedback": "That describes allowAllDatasourceUsersAccess."
            },
            {
              "id": "c",
              "text": "Anyone on the public internet",
              "feedback": "The user must be signed into Glean."
            },
            {
              "id": "d",
              "text": "No one until groups are assigned",
              "feedback": "The setting grants access on its own."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Anyone who is signed into Glean",
              "feedback": "Right. Use it only for content everyone in the company may see."
            }
          ]
        },
        {
          "id": "Q-08",
          "objective": "OBJ-04",
          "stem": "You index a user for the datasource, but no document ACL names the user or any of the user's groups. What can the user now find?",
          "options": [
            {
              "id": "b",
              "text": "Every document in the datasource",
              "feedback": "That would require allowAllDatasourceUsersAccess."
            },
            {
              "id": "c",
              "text": "Documents shared with the user's source groups, automatically",
              "feedback": "Group access needs the group, its memberships, and ACLs that name the group."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Nothing new; indexing a user grants no document access",
              "feedback": "Right."
            },
            {
              "id": "d",
              "text": "Documents from other datasources, newly unlocked",
              "feedback": "Other datasources are unaffected, and this one grants nothing new."
            }
          ]
        },
        {
          "id": "Q-09",
          "objective": "OBJ-04",
          "stem": "A test datasource returns nothing for a user on its beta list. What is the most likely cause?",
          "options": [
            {
              "id": "b",
              "text": "Test datasources never show documents",
              "feedback": "They show documents to beta users who have permissions."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The user lacks permission on the documents themselves",
              "feedback": "Right. Beta users must also have permission to view each document."
            },
            {
              "id": "c",
              "text": "Ranking signals are off, which hides results",
              "feedback": "Ranking signals are off in a test datasource. That changes order, not visibility."
            },
            {
              "id": "d",
              "text": "The datasource needs activity data first",
              "feedback": "Activity affects ranking, not visibility."
            }
          ]
        },
        {
          "id": "Q-10",
          "objective": "OBJ-05",
          "stem": "A page appeared in search yesterday and disappeared after last night's full run. What do you check first?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Whether the full run fetched and uploaded that page",
              "feedback": "Right. Appears, then disappears usually means a later full crawl omitted it."
            },
            {
              "id": "b",
              "text": "Whether the page's viewURL changed",
              "feedback": "A changed link does not remove a document."
            },
            {
              "id": "c",
              "text": "Whether activity data stopped arriving",
              "feedback": "Activity affects ranking, not presence."
            },
            {
              "id": "d",
              "text": "Whether the Client API token expired",
              "feedback": "Client API tokens do not upload documents."
            }
          ]
        },
        {
          "id": "Q-11",
          "objective": "OBJ-01",
          "stem": "A scanned policy PDF is 91 MB. What can users do with it in Glean?",
          "options": [
            {
              "id": "b",
              "text": "Search its full text, truncated at 16.875 MB",
              "feedback": "Truncation applies to content that is downloaded. Over 64 MB, content is not downloaded."
            },
            {
              "id": "c",
              "text": "Nothing; files over 64 MB are rejected",
              "feedback": "Metadata and permissions are still indexed."
            },
            {
              "id": "d",
              "text": "Ask Assistant to summarize all of it",
              "feedback": "Metadata-only results cannot ground a summary."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Find it by metadata; its content cannot ground an answer",
              "feedback": "Right. Items over 64 MB index metadata and permissions only."
            }
          ]
        },
        {
          "id": "Q-12",
          "objective": "OBJ-05",
          "stem": "Before rolling a new connector out to Assistant, where should the admin validate coverage and permissions?",
          "options": [
            {
              "id": "b",
              "text": "In the upload response logs",
              "feedback": "Accepted uploads say nothing about permissions."
            },
            {
              "id": "c",
              "text": "In Assistant's answers alone",
              "feedback": "Answers depend on retrieval. Validate retrieval in Search first."
            },
            {
              "id": "a",
              "correct": true,
              "text": "In Search, as users with different permissions",
              "feedback": "Right. Search is often the first place admins validate connector behavior."
            },
            {
              "id": "d",
              "text": "In the count of indexed documents",
              "feedback": "Counting indexed documents proves nothing about permissions."
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
      "body": "Each screen lists claim ids such as C-003. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.",
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
            "C-003, C-004, C-005"
          ],
          [
            "How connectors power the Glean experience",
            "Glean Docs (docs.glean.com)",
            "C-018, C-023, C-024, C-025, C-026"
          ],
          [
            "Overview of custom data source",
            "Glean Docs (docs.glean.com)",
            "C-041"
          ],
          [
            "Choose a deployment model",
            "Glean Docs (docs.glean.com)",
            "C-044"
          ],
          [
            "Set up a custom connector",
            "Glean Docs (docs.glean.com)",
            "C-048"
          ],
          [
            "Troubleshooting (custom connectors)",
            "Glean Docs (docs.glean.com)",
            "C-070, C-071, C-072, C-073, C-075"
          ],
          [
            "Crawl and index limits",
            "Glean Docs (docs.glean.com)",
            "C-090, C-091"
          ],
          [
            "Bulk Indexing",
            "Glean Developer docs (developers.glean.com)",
            "C-101, C-102, C-103, C-104"
          ],
          [
            "Bulk Upload Model",
            "Glean Developer docs (developers.glean.com)",
            "C-105, C-106, C-107, C-108, C-109"
          ],
          [
            "Indexing API Quickstart",
            "Glean Developer docs (developers.glean.com)",
            "C-110"
          ],
          [
            "Permissions (Indexing API guide)",
            "Glean Developer docs (developers.glean.com)",
            "C-111, C-112, C-114, C-116"
          ],
          [
            "Document Model",
            "Glean Developer docs (developers.glean.com)",
            "C-117"
          ],
          [
            "Indexing SDK — Indexing modes",
            "Glean Developer docs (developers.glean.com)",
            "C-170, C-177"
          ],
          [
            "Indexing SDK — Permissions",
            "Glean Developer docs (developers.glean.com)",
            "C-195, C-196, C-199, C-200"
          ],
          [
            "Indexing SDK — Architecture",
            "Glean Developer docs (developers.glean.com)",
            "C-163"
          ],
          [
            "Indexing SDK — Status and debugging",
            "Glean Developer docs (developers.glean.com)",
            "C-202, C-203, C-205"
          ],
          [
            "Indexing SDK — Quickstart",
            "Glean Developer docs (developers.glean.com)",
            "C-160"
          ],
          [
            "Rate Limits and Retries",
            "Glean Developer docs (developers.glean.com)",
            "C-079"
          ],
          [
            "Test Datasource",
            "Glean Developer docs (developers.glean.com)",
            "C-123, C-124"
          ],
          [
            "Glean Partner Content | Custom Connector Best Practices (deck, April 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-231, C-232, C-233, C-234, C-241"
          ],
          [
            "Glean Custom Connector Content Package",
            "Glean partner document (ask your Partner Manager for access)",
            "C-093"
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
      "title": "Next: scope the source before anyone writes code",
      "body": "CON-202 turns a connector request into evidence: data types, sizing, identity, hosting, and a go or no-go call.",
      "signature": true,
      "claims": []
    }
  ]
};
