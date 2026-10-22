/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "CON-101",
  "title": "Connector Fundamentals: Indexed, Live, Hybrid, and MCP",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Explain what a connector does and the data families it brings into Glean."
    },
    {
      "id": "OBJ-02",
      "text": "Distinguish native, web history, push API, and partner connectors, including who builds and supports each."
    },
    {
      "id": "OBJ-03",
      "text": "Choose indexed, live, or hybrid access from the data and the question."
    },
    {
      "id": "OBJ-04",
      "text": "Explain where tools and MCP fit, and what they do not do."
    },
    {
      "id": "OBJ-05",
      "text": "Decide whether a custom connector is justified, using a five-question fit sequence."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-05",
      "eyebrow": "Cold open",
      "title": "Seven systems, one steering meeting",
      "body": "A regional healthcare group asks your team for a connector for everything: a policy wiki, a vendor learning system, a reference archive, a claims warehouse, facility telemetry, a live bed board, and a new facet on Drive files. Build all seven and you ship risk, not value. By the end of this module you will classify each one and defend the call.",
      "footnote": "Composite, fictional case used across this accreditation. Product behavior is sourced; the customer environment and its numbers are invented for practice.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Decide before you build",
      "bullets": [
        "Explain what a connector does and the three data families it brings in.",
        "Tell native, web history, push API, and partner connectors apart, and who supports each.",
        "Choose indexed, live, or hybrid access for a given question.",
        "Place tools and MCP correctly: request-time actions, not search.",
        "Justify or reject a custom connector with a five-question sequence."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "The job",
      "title": "What a connector actually does",
      "body": "A Glean connector integrates Glean with a platform, service, or application where content lives. An indexing connector does two jobs: it fetches data, including permissions, and it parses item content such as title, body, comments, and media, along with permissions. That lets Glean index content, mirror source permissions, and keep the data current in your isolated tenant.",
      "bullets": [
        "Data is encrypted in transit and written to disk only once it reaches your tenant."
      ],
      "claims": [
        "C-001",
        "C-002",
        "C-003",
        "C-004",
        "C-015"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-01",
      "eyebrow": "What flows in",
      "title": "Glean needs more than documents",
      "body": "Open each data family. A connector that brings only one of them delivers a weaker experience.",
      "hotspots": [
        {
          "label": "Content",
          "detail": "Items and their metadata. If a result has no body text, users can find it, but Assistant cannot summarize it."
        },
        {
          "label": "People and identity",
          "detail": "Glean aligns identities across systems, so authorship and permissions resolve to the right person."
        },
        {
          "label": "Activity",
          "detail": "Creation, modification, viewing, and sharing timestamps and users. Signals such as views, edits, and shares rank results by relevance."
        },
        {
          "label": "Freshness",
          "detail": "Connectors capture changes as quickly as the source and connector allow, often through webhooks or incremental crawling."
        }
      ],
      "claims": [
        "C-006",
        "C-016",
        "C-017",
        "C-019",
        "C-241",
        "C-018"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A5",
      "objective": "OBJ-02",
      "eyebrow": "Connector types",
      "title": "Four documented connector types",
      "body": "The type decides who builds it, how data arrives, and who supports it after go-live.",
      "table": {
        "caption": "Connector types in Glean documentation",
        "head": [
          "Type",
          "How data arrives",
          "Built and supported by",
          "Typical fit"
        ],
        "rows": [
          [
            "Native",
            "Glean calls the source APIs directly",
            "Glean; purpose-built per application",
            "Applications such as Slack, Salesforce, Google Drive"
          ],
          [
            "Web history",
            "The Glean browser extension makes page titles searchable",
            "Glean; results are private to each user",
            "Apps where titles from a user's browsing help"
          ],
          [
            "Push API",
            "Data is pushed through the Indexing API",
            "The implementer; shared code may have limited support",
            "Custom apps, self-hosted systems, systems behind firewalls"
          ],
          [
            "Partner",
            "The partner pushes through the Indexing API",
            "The technology partner organization",
            "Partner-built, partner-supported integrations"
          ]
        ]
      },
      "claims": [
        "C-005",
        "C-007",
        "C-008",
        "C-009",
        "C-010"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A10",
      "objective": "OBJ-02",
      "eyebrow": "Myth versus reality",
      "title": "Four beliefs that cause bad connector requests",
      "hotspots": [
        {
          "label": "Myth: a custom connector is supported like a native one.",
          "detail": "Partner connectors are developed and supported by the partner organization, and shared push connector code may have limited support. Name the owner before you build."
        },
        {
          "label": "Myth: connecting an MCP server makes the source searchable.",
          "detail": "Tools retrieve current data or perform actions at request time. They do not make source content searchable."
        },
        {
          "label": "Myth: a missing facet on Drive needs a custom Drive connector.",
          "detail": "Custom Metadata attaches metadata to documents from any datasource, including native connectors, without re-indexing the source document."
        },
        {
          "label": "Myth: once content is in Glean, the source never checks access again.",
          "detail": "Glean applies the permission snapshot mirrored during crawling. Opening a result usually sends the user to the source, which may enforce access again."
        }
      ],
      "claims": [
        "C-010",
        "C-009",
        "C-011",
        "C-100",
        "C-013",
        "C-025"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Access modes",
      "title": "Indexed, live, or hybrid",
      "body": "Indexed data is crawled ahead of time. Live data is fetched at query time. Hybrid is a mix of both. The runtime chooses index, live, or hybrid paths per request, based on connector capabilities and the question.",
      "asset": {
        "src": "assets/svg/con-101-a01.svg",
        "alt": "Four cells comparing indexed, live, hybrid, and tool-based access.",
        "caption": "Every connector decision is a data-path decision."
      },
      "claims": [
        "C-012",
        "C-023",
        "C-013",
        "C-014",
        "C-011"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A5",
      "objective": "OBJ-03",
      "eyebrow": "Match the path to the data",
      "title": "What each path is for",
      "table": {
        "caption": "Documented fit for each access path",
        "head": [
          "Path",
          "Best for",
          "Permissions"
        ],
        "rows": [
          [
            "Indexed",
            "Docs, wikis, tickets, knowledge articles, code, and other bulk corpora; historical or cross-document questions",
            "The snapshot mirrored during crawling and incremental updates"
          ],
          [
            "Live",
            "Email, calendar, chat, or data where minutes-to-hours freshness dominates, or where full indexing is impractical",
            "Some connectors require each user to authenticate first"
          ],
          [
            "Hybrid",
            "Recall from the index plus current state or actions at request time",
            "Example: NetSuite MCP uses each user's own credentials and role"
          ]
        ]
      },
      "claims": [
        "C-021",
        "C-022",
        "C-013",
        "C-014",
        "C-030"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A4",
      "objective": "OBJ-04",
      "eyebrow": "Tools and MCP",
      "title": "MCP adds request-time tools. It does not replace the index.",
      "hotspots": [
        {
          "label": "Where to set it up",
          "detail": "Deployments created on or after September 22, 2026 use Connectors to set up catalog-backed MCP integrations. A custom or unlisted remote MCP server uses the separate Connect remote MCP servers path."
        },
        {
          "label": "One app, two entries",
          "detail": "One application can have more than one catalog entry: one entry might index content while another provides MCP tools."
        },
        {
          "label": "A documented hybrid",
          "detail": "NetSuite MCP gives real-time access with each user's own NetSuite credentials and role, and depends on the native NetSuite connector being set up."
        },
        {
          "label": "When partner guidance says go live",
          "detail": "Consider custom actions or MCP for querying live data. For large structured data lakes, use a custom action or MCP server to query the data."
        }
      ],
      "footnote": "Date-sensitive: the Connectors setup path applies to deployments created on or after 2026-09-22. Re-verified 2026-09-26.",
      "claims": [
        "C-027",
        "C-029",
        "C-028",
        "C-030",
        "C-031",
        "C-032",
        "C-033"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A6",
      "objective": "OBJ-04",
      "eyebrow": "Decision",
      "title": "The live bed board",
      "type": "choice",
      "prompt": "Nurses want current bed availability, which changes every few minutes, and want to place a hold on a bed from Glean. What do you propose?",
      "options": [
        {
          "id": "o2",
          "text": "A custom indexed connector that re-crawls the bed board every 15 minutes.",
          "feedback": "Availability would lag behind reality, and indexing cannot perform the hold. Live retrieval suits data where minutes-to-hours freshness dominates."
        },
        {
          "id": "o3",
          "text": "A web history connector so nurses can find bed board pages they visited.",
          "feedback": "Web history makes page titles from a user's own browsing searchable. It returns no current availability and performs no action."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "A live tool or MCP integration that reads availability and places the hold at request time.",
          "feedback": "Right. Freshness dominates and a write is required. Tools retrieve current data or perform actions at request time; an index is a snapshot and cannot place a hold."
        }
      ],
      "takeaway": "When freshness dominates or the user must act, go live.",
      "claims": [
        "C-011",
        "C-022",
        "C-007"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "A9",
      "objective": "OBJ-05",
      "eyebrow": "Practice",
      "title": "Classify the seven requests",
      "prompt": "Place each request in the approach that fits it.",
      "type": "sort",
      "categories": [
        "Custom indexed connector",
        "Native connector plus Custom Metadata",
        "Live action or MCP, not indexing"
      ],
      "pairs": [
        {
          "item": "Policy wiki: in-house, 38,400 pages, REST API with per-page read groups; staff want cited answers.",
          "category": "Custom indexed connector",
          "why": "No native connector, document-like content, and permissions available through the API."
        },
        {
          "item": "Vendor learning system: no native connector, 12,000 courses, enrollment-based visibility, offset pagination.",
          "category": "Custom indexed connector",
          "why": "Document-like content with no native option. Flag offset pagination: it is unstable while the source is being written to."
        },
        {
          "item": "Reference archive: no API, but a nightly HTML export with a file listing read groups.",
          "category": "Custom indexed connector",
          "why": "Scoping covers the no-API case: can the source export content to external storage?"
        },
        {
          "item": "Drive team wants a Clinic ID filter on files the native Drive connector already indexes.",
          "category": "Native connector plus Custom Metadata",
          "why": "Use the existing connector first. Custom Metadata attaches to native documents without re-indexing."
        },
        {
          "item": "Claims warehouse: 410 million rows; analysts ask for denial rates by payer.",
          "category": "Live action or MCP, not indexing",
          "why": "For large structured data lakes, query with a custom action or MCP server."
        },
        {
          "item": "Facility telemetry: freezer temperatures every 10 seconds.",
          "category": "Live action or MCP, not indexing",
          "why": "Glean is not a data analytics platform for time series or sensor data."
        },
        {
          "item": "Bed board: availability changes every few minutes; nurses place holds.",
          "category": "Live action or MCP, not indexing",
          "why": "Freshness dominates and an action is required."
        }
      ],
      "takeaway": "Three of seven need a custom connector. The other four are better served another way.",
      "claims": [
        "C-040",
        "C-190",
        "C-253",
        "C-035",
        "C-100",
        "C-033",
        "C-034",
        "C-022"
      ]
    },
    {
      "id": "SCR-12",
      "archetype": "A3",
      "objective": "OBJ-05",
      "eyebrow": "Fit sequence",
      "title": "Five questions, in order",
      "bullets": [
        "1. Is there a native connector, or can the native Glean Web Crawler cover it? Use an existing connector first.",
        "2. Is the data document-like, or a data lake, telemetry, or fast-changing state? The last three go live.",
        "3. Does the need include search, historical, or cross-document questions? That favors indexing.",
        "4. Can you get content, permissions, people, and activity through an API or an export?",
        "5. Who builds, supports, and maintains it? Partner connectors are partner-supported."
      ],
      "footnote": "The five-question order is studio guidance composed from the sourced rules on this screen.",
      "asset": {
        "src": "assets/svg/con-101-a02.svg",
        "alt": "Flow of five fit questions ending in ownership.",
        "caption": "Stop at the first question that sends you elsewhere."
      },
      "claims": [
        "C-250",
        "C-035",
        "C-033",
        "C-034",
        "C-022",
        "C-021",
        "C-006",
        "C-253",
        "C-010"
      ]
    },
    {
      "id": "SCR-13",
      "archetype": "A8",
      "objective": "OBJ-05",
      "eyebrow": "Worked example",
      "title": "The policy wiki, question by question",
      "steps": [
        {
          "title": "Q1 Existing option",
          "body": "No native connector exists for the in-house wiki."
        },
        {
          "title": "Q2 Data shape",
          "body": "Policy and runbook pages: documents, not rows or telemetry."
        },
        {
          "title": "Q3 Need",
          "body": "Staff ask policy questions and need citations across many pages: an indexed use case."
        },
        {
          "title": "Q4 Data types",
          "body": "The API exposes pages, users, groups with members, and deletions. It exposes no activity, so expect weaker ranking."
        },
        {
          "title": "Q5 Ownership",
          "body": "The partner builds it and must name who supports it after go-live."
        },
        {
          "title": "Decision",
          "body": "Custom indexed connector. Record the rejected alternatives and why."
        }
      ],
      "claims": [
        "C-040",
        "C-021",
        "C-135",
        "C-010"
      ]
    },
    {
      "id": "SCR-14",
      "archetype": "A6",
      "objective": "OBJ-05",
      "eyebrow": "Decision",
      "title": "The Drive facet request",
      "type": "choice",
      "prompt": "A team asks for a custom Google Drive connector so they can filter by Clinic ID. Drive is already connected natively. What do you recommend?",
      "options": [
        {
          "id": "o2",
          "text": "Build a custom Drive connector that pushes Clinic ID as a custom property.",
          "feedback": "This duplicates a supported connector and moves support to you. Native and custom connectors use separate namespaces, so filters and agents scoped to one do not see the other."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "Keep the native Drive connector and attach Clinic ID with Custom Metadata.",
          "feedback": "Right. Use an existing connector before building a new one. Custom Metadata attaches to documents from any datasource, including native connectors, without re-indexing."
        },
        {
          "id": "o3",
          "text": "Ask users to type the Clinic ID into every file title.",
          "feedback": "This pushes a data-model problem onto users and still creates no filterable field."
        }
      ],
      "takeaway": "The cheapest connector is the one you do not have to build.",
      "claims": [
        "C-035",
        "C-100",
        "C-080",
        "C-081"
      ]
    },
    {
      "id": "SCR-15",
      "archetype": "A13",
      "objective": "OBJ-03",
      "eyebrow": "Job aid",
      "title": "Connector fit card",
      "cards": [
        {
          "tag": "Index",
          "title": "Use an indexed connector when",
          "body": "Content is document-like, users need search or cited answers, and permissions can be mirrored."
        },
        {
          "tag": "Live",
          "title": "Use a live tool or MCP when",
          "body": "Freshness dominates, the data is a structured lake or telemetry, or the user must act."
        },
        {
          "tag": "Hybrid",
          "title": "Combine them when",
          "body": "Users need recall from the index and current state or actions from the same application."
        },
        {
          "tag": "Stop",
          "title": "Do not build custom when",
          "body": "A native connector or crawler covers it, or Custom Metadata closes the gap."
        }
      ],
      "claims": [
        "C-021",
        "C-022",
        "C-033",
        "C-034",
        "C-028",
        "C-035",
        "C-100"
      ]
    },
    {
      "id": "SCR-16",
      "archetype": "quiz",
      "objective": "OBJ-03",
      "eyebrow": "Prove it",
      "title": "Connector fundamentals check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "Which pair describes the two functions an indexing connector performs?",
          "options": [
            {
              "id": "b",
              "text": "Rendering search results and ranking them for each user",
              "feedback": "Ranking uses signals that connectors collect, but rendering and ranking are not connector functions."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Fetching data including permissions, and parsing content and permissions",
              "feedback": "Right. Connectors fetch data from connected applications and parse item content and permissions."
            },
            {
              "id": "c",
              "text": "Hosting the source application and backing up its data",
              "feedback": "A connector integrates with the system where content lives. It does not host or back it up."
            },
            {
              "id": "d",
              "text": "Answering questions with a language model at query time",
              "feedback": "Answer generation happens downstream of the index, not in the connector."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-01",
          "stem": "A custom connector pushes documents and permissions but no activity data. What should the partner tell the customer?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Results will work, but ranking is weaker and other sources may outrank them",
              "feedback": "Right. With no activity pushed, limited signals make ranking suboptimal, and results are more likely to be outranked by connectors with stronger signals."
            },
            {
              "id": "b",
              "text": "Activity is optional and has no effect on relevance",
              "feedback": "Activity signals such as views, edits, and shares drive relevance ranking."
            },
            {
              "id": "c",
              "text": "Documents stay hidden from search until activity arrives",
              "feedback": "Activity affects ranking, not whether a permitted document can appear."
            },
            {
              "id": "d",
              "text": "Glean will infer activity from upload timestamps",
              "feedback": "Upload times are not user activity. Nothing replaces pushed activity signals."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "A technology partner builds an integration that pushes through the Indexing API and lists it for customers. Who supports it?",
          "options": [
            {
              "id": "b",
              "text": "Glean Support, as with native connectors",
              "feedback": "Native connectors are Glean's. Partner connectors are developed and supported by the partner."
            },
            {
              "id": "c",
              "text": "The customer's Glean admin, alone",
              "feedback": "The admin configures it, but the partner develops and supports the integration."
            },
            {
              "id": "d",
              "text": "Nobody; push connectors are unsupported",
              "feedback": "A listed partner connector is the partner's to maintain and support."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The partner organization that built it",
              "feedback": "Right. Partner connectors use the Indexing API but are developed and supported by the partner, and Glean expects the partner to maintain a listed connector."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "Which system is the documented fit for a push API connector?",
          "options": [
            {
              "id": "b",
              "text": "A SaaS app that already has a native Glean connector",
              "feedback": "Use an existing connector before building a new one."
            },
            {
              "id": "c",
              "text": "Browsing history from users' web sessions",
              "feedback": "That is the web history connector, delivered through the Glean browser extension."
            },
            {
              "id": "a",
              "correct": true,
              "text": "An in-house application behind the customer's firewall",
              "feedback": "Right. Push API connectors suit custom applications, self-hosted environments, and systems behind firewalls."
            },
            {
              "id": "d",
              "text": "A fast-changing feed that users must act on",
              "feedback": "Freshness-dominant data with actions calls for live tools or MCP."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "Users ask what changed in the leave policy over the last three years, across many wiki pages. Which path fits best?",
          "options": [
            {
              "id": "b",
              "text": "Live access, because policy content is sensitive",
              "feedback": "Sensitivity is handled by mirrored permissions. Live access does not help historical, cross-document recall."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Indexed access, because the question is historical and cross-document",
              "feedback": "Right. Indexed mode suits bulk corpora and historical or cross-document questions."
            },
            {
              "id": "c",
              "text": "A tool that fetches one page at request time",
              "feedback": "A single request-time fetch cannot search three years of pages."
            },
            {
              "id": "d",
              "text": "Web history, because users visited the pages",
              "feedback": "Web history shows page titles from a user's own browsing, not page content."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-03",
          "stem": "Which data does the documentation describe as a fit for live retrieval?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Email, calendar, or chat where minutes-to-hours freshness dominates",
              "feedback": "Right. Live retrieval suits data where freshness dominates or continuous full indexing is impractical."
            },
            {
              "id": "b",
              "text": "Knowledge articles that change quarterly",
              "feedback": "Slow-changing document corpora suit indexing."
            },
            {
              "id": "c",
              "text": "Source code repositories searched by engineers",
              "feedback": "Code is listed with the bulk corpora that suit indexing."
            },
            {
              "id": "d",
              "text": "Historical wiki pages used for cited answers",
              "feedback": "Historical, cross-document content suits indexing."
            }
          ]
        },
        {
          "id": "Q-07",
          "objective": "OBJ-03",
          "stem": "With indexed access, which permissions does Glean apply when a user searches?",
          "options": [
            {
              "id": "b",
              "text": "A live permission check against the source on every query",
              "feedback": "That describes live access, which can require each user to authenticate."
            },
            {
              "id": "c",
              "text": "No permissions; indexed content is open to all users",
              "feedback": "Indexing mirrors source permissions. A user who cannot access an item in the source should not see it in Glean."
            },
            {
              "id": "d",
              "text": "Only the permissions of the connector's service account",
              "feedback": "The service account fetches data. Users see results according to the mirrored permissions."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The permission snapshot mirrored during crawling and incremental updates",
              "feedback": "Right. The source may still enforce access again when the user opens the item."
            }
          ]
        },
        {
          "id": "Q-08",
          "objective": "OBJ-04",
          "stem": "A team connects an MCP server to its ticketing tool and creates tickets from Glean. A week later, the tickets are not in search. Why?",
          "options": [
            {
              "id": "b",
              "text": "The MCP server has not finished its nightly crawl",
              "feedback": "MCP servers do not crawl content into the index."
            },
            {
              "id": "c",
              "text": "Search hides content that agents create",
              "feedback": "No such rule exists. The tickets were never indexed."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Tools act at request time and do not make source content searchable",
              "feedback": "Right. Searchable content needs an indexing connector."
            },
            {
              "id": "d",
              "text": "The tickets need Custom Metadata before they show",
              "feedback": "Custom Metadata attaches to documents that are already indexed. These tickets were never indexed."
            }
          ]
        },
        {
          "id": "Q-09",
          "objective": "OBJ-04",
          "stem": "A deployment created on 2026-10-05 needs a catalog-backed MCP integration. Where does the admin set it up?",
          "options": [
            {
              "id": "b",
              "text": "Through the Indexing API datasource configuration",
              "feedback": "The Indexing API configures push datasources, not MCP tools."
            },
            {
              "id": "a",
              "correct": true,
              "text": "From Connectors, where catalog MCP integrations are configured",
              "feedback": "Right. Deployments created on or after September 22, 2026 use Connectors for catalog-backed MCP integrations."
            },
            {
              "id": "c",
              "text": "Only by writing a custom connector first",
              "feedback": "Catalog MCP integrations need no custom connector."
            },
            {
              "id": "d",
              "text": "Through the Connect remote MCP servers path",
              "feedback": "That path is for custom or unlisted remote MCP servers, not catalog entries."
            }
          ]
        },
        {
          "id": "Q-10",
          "objective": "OBJ-04",
          "stem": "NetSuite MCP is an example of which design?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Hybrid: the MCP entry depends on the native indexing connector",
              "feedback": "Right. NetSuite MCP uses each user's own credentials and role at request time and depends on the native NetSuite connector."
            },
            {
              "id": "b",
              "text": "Live-only, which removes the need for an index",
              "feedback": "It depends on the native NetSuite connector being set up."
            },
            {
              "id": "c",
              "text": "Indexed-only, with no request-time access",
              "feedback": "It provides real-time access at request time."
            },
            {
              "id": "d",
              "text": "A third-party integration outside Glean's documentation",
              "feedback": "It is documented in Glean product documentation alongside the native NetSuite connector."
            }
          ]
        },
        {
          "id": "Q-11",
          "objective": "OBJ-05",
          "stem": "Finance asks you to index 410 million claim rows so analysts can ask for denial rates by payer. What do you recommend?",
          "options": [
            {
              "id": "b",
              "text": "Build a custom connector that indexes each row",
              "feedback": "Row-level indexing of a data lake is exactly what the guidance steers away from."
            },
            {
              "id": "c",
              "text": "Index a sample and let Assistant extrapolate",
              "feedback": "Extrapolating from a sample gives wrong aggregate answers."
            },
            {
              "id": "d",
              "text": "Use web history for the analysts' dashboards",
              "feedback": "Web history returns page titles only, never the numbers."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Query the warehouse live with a custom action or MCP server",
              "feedback": "Right. For large structured data lakes, the guidance is to query with a custom action or MCP server."
            }
          ]
        },
        {
          "id": "Q-12",
          "objective": "OBJ-05",
          "stem": "Which question comes first, before any build decision?",
          "options": [
            {
              "id": "b",
              "text": "What programming language will the connector use?",
              "feedback": "Implementation choices come after you decide a connector is justified."
            },
            {
              "id": "c",
              "text": "How many documents will the first bulk upload hold?",
              "feedback": "Sizing comes later, during scoping."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Is there a native connector, or can the Glean Web Crawler cover it?",
              "feedback": "Right. Scoping starts by checking for a native connector or web crawler option."
            },
            {
              "id": "d",
              "text": "Which hosting option is cheapest?",
              "feedback": "Hosting is chosen before you build, but only after fit is established."
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
      "body": "Each screen lists claim ids such as C-001. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.",
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
            "C-001, C-002, C-003, C-004, C-005, C-006, C-007, C-008, C-009, C-010, C-011, C-012, C-013, C-014, C-015, C-016, C-017"
          ],
          [
            "How connectors power the Glean experience",
            "Glean Docs (docs.glean.com)",
            "C-018, C-019, C-020, C-021, C-022, C-023, C-025"
          ],
          [
            "Overview of custom data source",
            "Glean Docs (docs.glean.com)",
            "C-040"
          ],
          [
            "Choose a deployment model",
            "Glean Docs (docs.glean.com)",
            "C-045"
          ],
          [
            "Migrate from a native connector to a custom connector",
            "Glean Docs (docs.glean.com)",
            "C-080, C-081"
          ],
          [
            "Set up tools and MCP integrations from Connectors",
            "Glean Docs (docs.glean.com)",
            "C-027, C-028, C-029"
          ],
          [
            "Indexing API overview",
            "Glean Developer docs (developers.glean.com)",
            "C-100"
          ],
          [
            "Indexing SDK — Pagination",
            "Glean Developer docs (developers.glean.com)",
            "C-190"
          ],
          [
            "NetSuite MCP",
            "Glean Docs (docs.glean.com)",
            "C-030, C-031"
          ],
          [
            "Glean Partner Content | Custom Connector Best Practices (deck, April 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-032, C-033, C-034, C-035, C-135, C-136, C-241"
          ],
          [
            "[External] Glean Partner Content | Custom Connector Questionnaire",
            "Glean partner document (ask your Partner Manager for access)",
            "C-250, C-253"
          ],
          [
            "[Template] Custom Connector Intake Form v2",
            "Glean partner document (ask your Partner Manager for access)",
            "C-273"
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
      "title": "Next: follow one document through the pipeline",
      "body": "CON-201 traces a single page from fetch to cited answer, including the three states where it can stall and the one rule that deletes documents you did not mean to delete.",
      "signature": true,
      "claims": []
    }
  ]
};
