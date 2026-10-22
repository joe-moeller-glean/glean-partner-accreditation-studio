/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "CON-203",
  "title": "Indexing API and the Glean Data Model",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Distinguish the Indexing API, the Client API, and the activity endpoint, and the token each needs."
    },
    {
      "id": "OBJ-02",
      "text": "Configure a datasource correctly."
    },
    {
      "id": "OBJ-03",
      "text": "Model documents within MIME, size, and timestamp constraints, and choose the right write semantics."
    },
    {
      "id": "OBJ-04",
      "text": "Index users, groups, memberships, and ACLs in the correct order."
    },
    {
      "id": "OBJ-05",
      "text": "Choose between custom properties and Custom Metadata, and push activity correctly."
    },
    {
      "id": "OBJ-06",
      "text": "Work within rate limits, read response codes, and use the debug and reprocess tools."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Cold open",
      "title": "The token that works everywhere but one place",
      "body": "The indexing token uploads documents, users, and groups without a problem. Then the connector calls the activity endpoint and gets Not Authorized. Nothing is wrong with the token. It is the wrong kind of token for that call. This module is the wire protocol your SDK hides from you.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-02",
      "eyebrow": "What you will be able to do",
      "title": "Know the protocol under the SDK",
      "bullets": [
        "Pick the right API and token for each call.",
        "Configure a datasource correctly.",
        "Model documents and choose write semantics.",
        "Index identities and ACLs in the right order.",
        "Choose properties or metadata; push activity.",
        "Work within limits and debug with the right tools."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A5",
      "objective": "OBJ-01",
      "eyebrow": "API surface",
      "title": "Three surfaces, two kinds of token",
      "table": {
        "caption": "Which API does what, with which token",
        "head": [
          "Surface",
          "Purpose",
          "Token"
        ],
        "rows": [
          [
            "Indexing API (Push API)",
            "Pushes documents, users, permissions, and metadata",
            "Glean-issued Indexing API token; no OAuth"
          ],
          [
            "Client API",
            "Custom client interfaces to the Glean system",
            "Client API token"
          ],
          [
            "Activity endpoint",
            "Pushes user activity for ranking",
            "Global Client API token scoped to ACTIVITY"
          ]
        ]
      },
      "footnote": "The Indexing SDK is a client for the Indexing API, not a replacement. The API documentation stays the reference for the wire protocol.",
      "claims": [
        "C-050",
        "C-051",
        "C-052",
        "C-133",
        "C-134",
        "C-150"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-02",
      "eyebrow": "Datasource",
      "title": "Datasource settings that bite later",
      "hotspots": [
        {
          "label": "Name",
          "detail": "With the SDK, the datasource name may contain only ASCII letters and digits."
        },
        {
          "label": "urlRegex",
          "detail": "Avoid regexes that are too broad and capture other datasources' URLs, or too narrow."
        },
        {
          "label": "Identity references",
          "detail": "isUserReferencedByEmail should be true if you want to refer to user identities by email."
        },
        {
          "label": "Category",
          "detail": "The right category enables enhanced ranking. Set per-object categories with objectDefinitions.docCategory. Do not use PEOPLE; use /bulkindexemployees for employee data."
        },
        {
          "label": "Test datasource",
          "detail": "All ranking signals are off, and beta users still need permission on each document."
        }
      ],
      "claims": [
        "C-158",
        "C-119",
        "C-118",
        "C-121",
        "C-120",
        "C-122",
        "C-123",
        "C-124"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Document model",
      "title": "What a document can carry",
      "bullets": [
        "A stable ID, title, viewURL that matches urlRegex, body content with a MIME type, and permissions.",
        "JSON and XML are not supported MIME types for content. Send the text itself.",
        "Items over 64 MB index metadata and permissions only. Content over 16.875 MB is truncated. Spreadsheets index about 250,000 characters.",
        "Use epoch seconds for timestamps. With the SDK, created_at and updated_at must be epoch seconds.",
        "413 Request Entity Too Large means split into smaller requests."
      ],
      "claims": [
        "C-119",
        "C-094",
        "C-090",
        "C-091",
        "C-092",
        "C-093",
        "C-153",
        "C-058"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A5",
      "objective": "OBJ-03",
      "eyebrow": "Write semantics",
      "title": "Single, incremental, or bulk",
      "table": {
        "caption": "Documented write paths",
        "head": [
          "Call",
          "Semantics",
          "Limits and rules"
        ],
        "rows": [
          [
            "/indexdocument",
            "Adds or updates one document",
            "10 requests per second"
          ],
          [
            "/indexdocuments",
            "Intended for incremental updates",
            "600 documents per minute"
          ],
          [
            "/bulkindexdocuments",
            "Fully replaces the document list; omitted documents are deleted asynchronously",
            "One unique uploadId per upload; no concurrent uploads; forceRestartUpload after a failed upload"
          ],
          [
            "/processalldocuments",
            "Re-indexes previously uploaded documents; makes deletions take effect immediately",
            "One request every 3 hours per datasource"
          ]
        ]
      },
      "footnote": "Above 20% stale, deletion pauses for 7 days. For targeted deletes, use the delete operation in the API reference for your release; its limits are not in the reviewed sources.",
      "claims": [
        "C-137",
        "C-102",
        "C-101",
        "C-109",
        "C-105",
        "C-106",
        "C-075",
        "C-108",
        "C-079",
        "C-107"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A3",
      "objective": "OBJ-04",
      "eyebrow": "Identity order",
      "title": "Users, groups, memberships, then documents",
      "body": "When documents use non-anonymous permissions, users must be indexed before they are referenced, and a group must be indexed before its memberships. Indexing a user does not give them access to any document.",
      "bullets": [
        "Nested groups: use memberGroupName in place of memberUserId.",
        "Group names cannot be empty, cannot contain whitespace, and cannot start with the prefix scio.",
        "Permissions and memberships are processed asynchronously. For identity problems, use /processallmemberships."
      ],
      "asset": {
        "src": "assets/svg/con-203-a01.svg",
        "alt": "Five stacked layers showing the order users, groups, memberships, documents, processing.",
        "caption": "Out of order means ACLs that match nobody."
      },
      "claims": [
        "C-111",
        "C-114",
        "C-112",
        "C-115",
        "C-113",
        "C-116",
        "C-076"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A9",
      "objective": "OBJ-04",
      "eyebrow": "Practice",
      "title": "Choose the permission shape",
      "prompt": "Choose the permission shape for each source rule.",
      "type": "sort",
      "categories": [
        "allowedGroups",
        "Group intersection",
        "allowAnonymousAccess",
        "allowAllDatasourceUsersAccess"
      ],
      "pairs": [
        {
          "item": "Dosing guide: readable by the pharmacist group.",
          "category": "allowedGroups",
          "why": "One group grants access."
        },
        {
          "item": "Controlled-substance log: pharmacists who are also in clinic 014.",
          "category": "Group intersection",
          "why": "A user must belong to every group within one entry."
        },
        {
          "item": "Company holiday calendar: anyone signed into Glean may read it.",
          "category": "allowAnonymousAccess",
          "why": "Anyone signed into Glean can see results for the document."
        },
        {
          "item": "Wiki how-to page: any user indexed for this datasource may read it.",
          "category": "allowAllDatasourceUsersAccess",
          "why": "Access requires the user to be indexed as a user of the connector."
        }
      ],
      "takeaway": "Read each flag literally before you use it.",
      "claims": [
        "C-198",
        "C-117",
        "C-071"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A5",
      "objective": "OBJ-05",
      "eyebrow": "Properties or metadata",
      "title": "Two ways to add fields",
      "bullets": [
        "INT properties are not faceted.",
        "DATE properties are faceted only when the value is an epoch timestamp in seconds.",
        "To show a property in search results, contact Glean support.",
        "A property named country is used as a location ranking signal.",
        "Custom property validation stops at the first invalid property."
      ],
      "asset": {
        "src": "assets/svg/con-203-a02.svg",
        "alt": "Comparison of custom properties and Custom Metadata.",
        "caption": "Properties belong to your datasource. Metadata can attach to anyone's."
      },
      "claims": [
        "C-125",
        "C-130",
        "C-132",
        "C-100",
        "C-131",
        "C-126",
        "C-127",
        "C-128",
        "C-129",
        "C-077"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A6",
      "objective": "OBJ-05",
      "eyebrow": "Decision",
      "title": "A facet on someone else's documents",
      "type": "choice",
      "prompt": "The customer wants a Clinic ID filter on files the native Drive connector already indexes. Which mechanism fits?",
      "options": [
        {
          "id": "o2",
          "text": "A custom property on the Drive datasource.",
          "feedback": "Custom properties belong to a datasource you index. Native and custom connectors use separate namespaces."
        },
        {
          "id": "o3",
          "text": "Re-index the Drive files through a custom connector with the property.",
          "feedback": "That duplicates a native connector and moves support to you."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "Custom Metadata on the native Drive documents.",
          "feedback": "Right. Custom Metadata attaches to documents from any datasource, including native connectors, without re-indexing."
        }
      ],
      "takeaway": "Properties for your datasource; metadata for anyone's.",
      "claims": [
        "C-100",
        "C-080",
        "C-035"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "A3",
      "objective": "OBJ-05",
      "eyebrow": "Activity",
      "title": "Activity needs its own token",
      "body": "The activity endpoint must be called with a Client API bearer token, not the Indexing API token: a global Client API token scoped to ACTIVITY. Without activity, signals are limited, ranking is suboptimal, and results are more likely to be outranked by connectors with stronger signals.",
      "claims": [
        "C-133",
        "C-134",
        "C-135",
        "C-136"
      ]
    },
    {
      "id": "SCR-12",
      "archetype": "A5",
      "objective": "OBJ-06",
      "eyebrow": "Limits and codes",
      "title": "Limits you must design around",
      "table": {
        "caption": "Documented limits and responses",
        "head": [
          "Scope",
          "Limit or response"
        ],
        "rows": [
          [
            "/indexdocument",
            "10 requests per second"
          ],
          [
            "/indexdocuments",
            "600 documents per minute"
          ],
          [
            "/processalldocuments",
            "1 request every 3 hours per datasource"
          ],
          [
            "Deployment, all IPs",
            "8,000 requests per minute"
          ],
          [
            "Deployment, one IP",
            "100 requests per second"
          ],
          [
            "/indexdocument responses",
            "OK, Bad Request, Not Authorized, Conflict, Too Many Requests"
          ],
          [
            "Too large",
            "413: split into smaller requests"
          ]
        ]
      },
      "claims": [
        "C-137",
        "C-079",
        "C-138",
        "C-139",
        "C-140",
        "C-058"
      ]
    },
    {
      "id": "SCR-13",
      "archetype": "A7",
      "objective": "OBJ-06",
      "eyebrow": "Debug toolkit",
      "title": "Debug in this order",
      "steps": [
        {
          "title": "Processed yet?",
          "body": "New documents appear when processingHistory is later than bulkUploadHistory."
        },
        {
          "title": "Users really indexed?",
          "body": "UPLOAD COMPLETED means only that the API accepted the upload."
        },
        {
          "title": "Flags right?",
          "body": "Incorrect pagination flags can make a partial upload look complete."
        },
        {
          "title": "Properties valid?",
          "body": "Validation stops at the first invalid custom property. Fix and retry iteratively."
        },
        {
          "title": "Reprocess",
          "body": "/processalldocuments re-indexes without a new upload; for user or group problems, use /processallmemberships."
        },
        {
          "title": "Escalate well",
          "body": "Include the issue and error, the endpoint and request body, the connector name, and a timestamp with time zone."
        }
      ],
      "claims": [
        "C-070",
        "C-072",
        "C-074",
        "C-077",
        "C-075",
        "C-076",
        "C-078"
      ]
    },
    {
      "id": "SCR-14",
      "archetype": "A8",
      "objective": "OBJ-04",
      "eyebrow": "API lab walkthrough",
      "title": "The policy wiki, without the SDK",
      "steps": [
        {
          "title": "Datasource",
          "body": "Create it from code and enable it for a test group."
        },
        {
          "title": "First run",
          "body": "Index one public page and find it in search. Then one permissioned page: check it as an allowed and a denied persona."
        },
        {
          "title": "Identities",
          "body": "Index users, then groups including a nested group, then memberships."
        },
        {
          "title": "Bulk replacement",
          "body": "Bulk upload 30 lab pages. Upload again with 28. Observe 2 deleted: about 7%, under the safeguard."
        },
        {
          "title": "Predict",
          "body": "An upload of 20 of 30 would delete 33%. Predict the result and cite the rule: deletion pauses for 7 days."
        }
      ],
      "footnote": "The lab runs outside this package against a disposable test datasource provided by your program. Your assessor scores the lab evidence.",
      "claims": [
        "C-103",
        "C-049",
        "C-111",
        "C-114",
        "C-115",
        "C-101",
        "C-107"
      ]
    },
    {
      "id": "SCR-15",
      "archetype": "A13",
      "objective": "OBJ-06",
      "eyebrow": "Job aid",
      "title": "API cheat sheet",
      "cards": [
        {
          "tag": "Token",
          "title": "Tokens",
          "body": "Indexing token for push; global Client token scoped to ACTIVITY for activity."
        },
        {
          "tag": "Write",
          "title": "Write modes",
          "body": "Single and incremental add; bulk replaces. One uploadId, no concurrency."
        },
        {
          "tag": "Order",
          "title": "Identity order",
          "body": "Users, groups, memberships, then documents."
        },
        {
          "tag": "Debug",
          "title": "Debug",
          "body": "Processing versus upload time; flags; first invalid property; reprocess."
        }
      ],
      "claims": [
        "C-052",
        "C-134",
        "C-101",
        "C-109",
        "C-105",
        "C-111",
        "C-114",
        "C-070",
        "C-074",
        "C-077"
      ]
    },
    {
      "id": "SCR-16",
      "archetype": "quiz",
      "objective": "OBJ-03",
      "eyebrow": "Prove it",
      "title": "Indexing API check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "Which token does the activity endpoint require?",
          "options": [
            {
              "id": "b",
              "text": "The datasource's Indexing API token",
              "feedback": "Other indexing endpoints use it; the activity endpoint does not."
            },
            {
              "id": "a",
              "correct": true,
              "text": "A global Client API token scoped to ACTIVITY",
              "feedback": "Right. It is a Client API bearer token, not an indexing token."
            },
            {
              "id": "c",
              "text": "An OAuth token from the source system",
              "feedback": "Glean endpoints use Glean-issued tokens."
            },
            {
              "id": "d",
              "text": "No token; activity is anonymous",
              "feedback": "The endpoint needs a Client API bearer token."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "What does isUserReferencedByEmail control?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Whether user identities are referenced directly by email",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "Whether Glean emails users about new documents",
              "feedback": "It is an identity reference setting."
            },
            {
              "id": "c",
              "text": "Whether documents must list an author email",
              "feedback": "It concerns how identities are referenced."
            },
            {
              "id": "d",
              "text": "Whether the datasource is visible to all users",
              "feedback": "Visibility is controlled separately."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-03",
          "stem": "A connector sends page bodies as application/json. What happens to the content?",
          "options": [
            {
              "id": "b",
              "text": "Glean parses the JSON fields into text",
              "feedback": "JSON is not a supported MIME type."
            },
            {
              "id": "c",
              "text": "Only the first 16.875 MB is indexed",
              "feedback": "Truncation applies to supported content."
            },
            {
              "id": "d",
              "text": "It is indexed as a spreadsheet",
              "feedback": "Spreadsheet limits do not apply to JSON."
            },
            {
              "id": "a",
              "correct": true,
              "text": "JSON is not a supported content MIME type",
              "feedback": "Right. Send the text content itself."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-05",
          "stem": "A DATE custom property is not showing as a facet. What is the most likely cause?",
          "options": [
            {
              "id": "b",
              "text": "DATE properties are never faceted",
              "feedback": "They are faceted when the value is epoch seconds. INT is the type that is not faceted."
            },
            {
              "id": "c",
              "text": "The datasource category is wrong",
              "feedback": "Category does not control facets."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The value is not an epoch timestamp in seconds",
              "feedback": "Right. DATE is faceted only for epoch seconds."
            },
            {
              "id": "d",
              "text": "Activity data is missing",
              "feedback": "Activity affects ranking, not facets."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-05",
          "stem": "How do you update a custom property value on an indexed document?",
          "options": [
            {
              "id": "b",
              "text": "Send only the changed property",
              "feedback": "Updating a custom property requires re-uploading the entire document."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Re-upload the entire document via /indexdocument",
              "feedback": "Right."
            },
            {
              "id": "c",
              "text": "Attach it as Custom Metadata",
              "feedback": "Custom Metadata is a separate mechanism with different types."
            },
            {
              "id": "d",
              "text": "Run /processalldocuments",
              "feedback": "Reprocessing does not change the uploaded values."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-03",
          "stem": "Bulk upload A holds pages 1 to 30. Bulk upload B holds pages 1 to 28. What happens after B succeeds?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Pages 29 and 30 are deleted asynchronously",
              "feedback": "Right. About 7% is under the 20% safeguard."
            },
            {
              "id": "b",
              "text": "Pages 29 and 30 stay until deleted explicitly",
              "feedback": "Bulk indexing replaces the document list."
            },
            {
              "id": "c",
              "text": "Deletion pauses for 7 days",
              "feedback": "The pause applies above 20%."
            },
            {
              "id": "d",
              "text": "Upload B is rejected as incomplete",
              "feedback": "Omitted documents are treated as stale, not as an error."
            }
          ]
        },
        {
          "id": "Q-07",
          "objective": "OBJ-03",
          "stem": "You start a bulk upload while the previous one is still running. What happens?",
          "options": [
            {
              "id": "b",
              "text": "The two uploads are merged",
              "feedback": "Uploads are never merged."
            },
            {
              "id": "c",
              "text": "The new upload queues automatically",
              "feedback": "No queueing is documented."
            },
            {
              "id": "d",
              "text": "The newer upload silently replaces the older",
              "feedback": "Concurrent uploads are not allowed at all."
            },
            {
              "id": "a",
              "correct": true,
              "text": "It is not allowed; finish the previous upload first",
              "feedback": "Right. Concurrent uploads are not allowed."
            }
          ]
        },
        {
          "id": "Q-08",
          "objective": "OBJ-04",
          "stem": "In what order should a permission-aware connector index identities and documents?",
          "options": [
            {
              "id": "b",
              "text": "Documents first, then identities",
              "feedback": "Users must be indexed before they are referenced."
            },
            {
              "id": "c",
              "text": "Memberships, then groups, then users",
              "feedback": "A group must be indexed before its memberships."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Users, groups, memberships, then documents with ACLs",
              "feedback": "Right."
            },
            {
              "id": "d",
              "text": "Order does not matter; processing sorts it out",
              "feedback": "Order is documented for users and group memberships."
            }
          ]
        },
        {
          "id": "Q-09",
          "objective": "OBJ-04",
          "stem": "How do you express that the nurse-leads group is a member of clinical-staff?",
          "options": [
            {
              "id": "b",
              "text": "Copy every nurse lead into clinical-staff as a user",
              "feedback": "Flattened lists drift. Map groups directly."
            },
            {
              "id": "a",
              "correct": true,
              "text": "A membership with memberGroupName set to nurse-leads",
              "feedback": "Right. Use memberGroupName in place of memberUserId."
            },
            {
              "id": "c",
              "text": "List both groups on every document",
              "feedback": "That does not express nesting."
            },
            {
              "id": "d",
              "text": "It cannot be expressed; flatten it",
              "feedback": "Nested groups are supported."
            }
          ]
        },
        {
          "id": "Q-10",
          "objective": "OBJ-06",
          "stem": "You called /processalldocuments 40 minutes ago. Can you call it again now?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "No; it allows one request every 3 hours per datasource",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "Yes; reprocessing is not rate limited",
              "feedback": "It is limited to one request every 3 hours."
            },
            {
              "id": "c",
              "text": "Yes, if you use a bulk upload instead",
              "feedback": "A bulk upload is replacement, not reprocessing."
            },
            {
              "id": "d",
              "text": "Yes, with a global-scope token",
              "feedback": "Scope does not lift the limit."
            }
          ]
        },
        {
          "id": "Q-11",
          "objective": "OBJ-04",
          "stem": "Which group name will be rejected?",
          "options": [
            {
              "id": "b",
              "text": "clinic-014",
              "feedback": "Hyphens and digits are allowed."
            },
            {
              "id": "c",
              "text": "nurseleads",
              "feedback": "Letters only is allowed."
            },
            {
              "id": "d",
              "text": "pharmacy_staff",
              "feedback": "Underscores and letters are allowed."
            },
            {
              "id": "a",
              "correct": true,
              "text": "sciopharmacists",
              "feedback": "Right. Group names cannot start with the prefix scio."
            }
          ]
        },
        {
          "id": "Q-12",
          "objective": "OBJ-06",
          "stem": "User uploads show UPLOAD COMPLETED, but indexed user counts are low. What should you check?",
          "options": [
            {
              "id": "b",
              "text": "Nothing; UPLOAD COMPLETED means users are searchable",
              "feedback": "It does not mean users are indexed and searchable."
            },
            {
              "id": "c",
              "text": "Which category the datasource uses",
              "feedback": "Category does not affect user counts."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Pagination flags, since wrong flags can make a partial upload look complete",
              "feedback": "Right. UPLOAD COMPLETED means only that the API accepted the upload."
            },
            {
              "id": "d",
              "text": "The activity token",
              "feedback": "Activity does not upload users."
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
      "body": "Each screen lists claim ids such as C-035. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.",
      "table": {
        "caption": "Claim ids by source",
        "head": [
          "Source",
          "Where to find it",
          "Claim ids"
        ],
        "rows": [
          [
            "Set up a custom connector",
            "Glean Docs (docs.glean.com)",
            "C-049"
          ],
          [
            "Glean REST APIs",
            "Glean Docs (docs.glean.com)",
            "C-050, C-051"
          ],
          [
            "Troubleshooting (custom connectors)",
            "Glean Docs (docs.glean.com)",
            "C-070, C-071, C-072, C-074, C-075, C-076, C-077, C-078"
          ],
          [
            "Migrate from a native connector to a custom connector",
            "Glean Docs (docs.glean.com)",
            "C-080"
          ],
          [
            "Crawl and index limits",
            "Glean Docs (docs.glean.com)",
            "C-090, C-091, C-092"
          ],
          [
            "Indexing API overview",
            "Glean Developer docs (developers.glean.com)",
            "C-100"
          ],
          [
            "Bulk Indexing",
            "Glean Developer docs (developers.glean.com)",
            "C-101, C-102, C-103"
          ],
          [
            "Bulk Upload Model",
            "Glean Developer docs (developers.glean.com)",
            "C-105, C-106, C-107, C-108, C-109"
          ],
          [
            "Indexing API Authentication",
            "Glean Developer docs (developers.glean.com)",
            "C-052, C-058"
          ],
          [
            "Permissions (Indexing API guide)",
            "Glean Developer docs (developers.glean.com)",
            "C-111, C-112, C-113, C-114, C-115, C-116"
          ],
          [
            "Document Model",
            "Glean Developer docs (developers.glean.com)",
            "C-117"
          ],
          [
            "Setup Datasource",
            "Glean Developer docs (developers.glean.com)",
            "C-118, C-119"
          ],
          [
            "Indexing SDK — Permissions",
            "Glean Developer docs (developers.glean.com)",
            "C-197, C-198"
          ],
          [
            "Indexing SDK — Overview",
            "Glean Developer docs (developers.glean.com)",
            "C-150, C-153"
          ],
          [
            "Indexing SDK — Quickstart",
            "Glean Developer docs (developers.glean.com)",
            "C-158"
          ],
          [
            "Custom Properties",
            "Glean Developer docs (developers.glean.com)",
            "C-125, C-126, C-127, C-128, C-129"
          ],
          [
            "Custom Properties vs Custom Metadata",
            "Glean Developer docs (developers.glean.com)",
            "C-130, C-131, C-132"
          ],
          [
            "Activity",
            "Glean Developer docs (developers.glean.com)",
            "C-133, C-134"
          ],
          [
            "Rate Limits and Retries",
            "Glean Developer docs (developers.glean.com)",
            "C-079, C-137, C-138, C-139"
          ],
          [
            "Test Datasource",
            "Glean Developer docs (developers.glean.com)",
            "C-123, C-124"
          ],
          [
            "Supported MIME Types",
            "Glean Developer docs (developers.glean.com)",
            "C-094"
          ],
          [
            "Datasource Category",
            "Glean Developer docs (developers.glean.com)",
            "C-120, C-121, C-122"
          ],
          [
            "Index document (API reference)",
            "Glean Developer docs (developers.glean.com)",
            "C-140"
          ],
          [
            "Glean Partner Content | Custom Connector Best Practices (deck, April 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-035, C-135, C-136"
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
      "title": "Next: let the SDK do the plumbing",
      "body": "CON-204 builds the same connector with the Indexing SDK, and shows the handful of SDK choices that silently delete or expose data.",
      "signature": true,
      "claims": []
    }
  ]
};
