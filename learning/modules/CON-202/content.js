/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "CON-202",
  "title": "Custom Connector Scoping and Intake",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Run structured discovery with the custom connector questionnaire and record evidence, not assumptions."
    },
    {
      "id": "OBJ-02",
      "text": "Assess feasibility for content, permissions, people, and activity, and state the cost of each gap."
    },
    {
      "id": "OBJ-03",
      "text": "Size a crawl against source and Glean rate limits."
    },
    {
      "id": "OBJ-04",
      "text": "Choose an identity strategy and a hosting model with the customer."
    },
    {
      "id": "OBJ-05",
      "text": "Build a risk register and make a conditional go or no-go call."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-01",
      "eyebrow": "Cold open",
      "title": "Two weeks to go live",
      "body": "The sponsor wants the policy wiki in Glean in two weeks. The source owner says the API has everything. Nobody has asked the security architect. Scoping is where you find out what everything means, before the sponsor's date becomes your problem.",
      "footnote": "Composite, fictional case used across this accreditation. Product behavior is sourced; the customer environment and its numbers are invented for practice.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Turn a request into evidence",
      "bullets": [
        "Run structured discovery with the partner questionnaire.",
        "Assess all four information types and price each gap.",
        "Size a crawl against source and Glean limits.",
        "Decide identity and hosting with the customer, before code.",
        "Write a risk register and make a conditional go or no-go call."
      ],
      "claims": []
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Why structured scoping",
      "title": "Scope before code",
      "body": "Scoping turns a request into evidence. The partner questionnaire starts with the cheapest question: is there an existing native connector for the source, or can the native Glean Web Crawler cover it? Only then does it move to access, identity, environments, and change patterns.",
      "asset": {
        "src": "assets/svg/con-202-a02.svg",
        "alt": "Five-step scoping flow ending in a go or no-go decision.",
        "caption": "Scoping produces evidence the build can rely on."
      },
      "claims": [
        "C-250",
        "C-035"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-01",
      "eyebrow": "The questionnaire",
      "title": "Six questions that change the design",
      "hotspots": [
        {
          "label": "Access and keys",
          "detail": "Read-only keys are preferred, where supported, for content, permission, and activity data."
        },
        {
          "label": "Identity",
          "detail": "Do users in the source system match users in the SSO system associated with Glean?"
        },
        {
          "label": "Environments",
          "detail": "Is there a dev, test, or sandbox environment to build and validate the connector against?"
        },
        {
          "label": "Click-through",
          "detail": "Where should users go when they click a document in Glean? That is the viewURL."
        },
        {
          "label": "Stability and change",
          "detail": "Will the API URL stay static? How often are permissions updated in the source?"
        },
        {
          "label": "No API",
          "detail": "Can the source export content to an external storage location? That is the fallback when no usable API exists."
        }
      ],
      "claims": [
        "C-251",
        "C-252",
        "C-254",
        "C-255",
        "C-256",
        "C-257",
        "C-253"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A3",
      "objective": "OBJ-02",
      "eyebrow": "Feasibility",
      "title": "Four information types, each with a price",
      "body": "Glean builds its graph from content, people, and activity, and every result depends on permissions. For each type, record whether the source exposes it, how, and what a gap costs. A permissions gap is never solved with an allow-all ACL on sensitive content.",
      "asset": {
        "src": "assets/svg/con-202-a01.svg",
        "alt": "Four cells naming the cost of a gap in content, permissions, people, and activity.",
        "caption": "Record the source, the method, and the cost of each gap."
      },
      "claims": [
        "C-006",
        "C-241",
        "C-195",
        "C-240",
        "C-135",
        "C-136"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A10",
      "objective": "OBJ-02",
      "eyebrow": "Myth versus reality",
      "title": "Three scoping shortcuts that fail later",
      "hotspots": [
        {
          "label": "Myth: 'the API has everything' is a finding.",
          "detail": "It is a claim. Test it in the sandbox: pages, read groups, users, groups with members, and deletions."
        },
        {
          "label": "Myth: identity can be sorted out after launch.",
          "detail": "Users must be indexed before they are referenced. Without identity data, you need a manual map of users to corporate identities."
        },
        {
          "label": "Myth: hosting is an operations detail for later.",
          "detail": "Choose where the connector runs before you build: that decision determines how secrets, scheduling, and networking are handled."
        }
      ],
      "claims": [
        "C-254",
        "C-111",
        "C-240",
        "C-045"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A7",
      "objective": "OBJ-03",
      "eyebrow": "Sizing",
      "title": "Sizing the policy wiki crawl",
      "steps": [
        {
          "title": "Source limit",
          "body": "300 requests per minute per token. Pace below quota, about 240 per minute, to leave room for retries."
        },
        {
          "title": "List calls",
          "body": "38,400 pages at 100 per page is 384 calls: under two minutes at 240 per minute."
        },
        {
          "title": "Detail calls",
          "body": "If read groups need one call per page, add 38,400 calls: about 160 minutes per full run."
        },
        {
          "title": "Glean side",
          "body": "/indexdocuments accepts 600 documents per minute; /indexdocument accepts 10 requests per second. Confirm the current bulk limit before you commit a window."
        },
        {
          "title": "Deployment ceiling",
          "body": "8,000 requests per minute across all IP addresses and 100 requests per second from one IP apply across the deployment."
        },
        {
          "title": "Result",
          "body": "A nightly full run fits in about three hours. Hourly incrementals fit easily."
        }
      ],
      "footnote": "Case numbers are fictional. The pacing rule and the Glean limits are sourced.",
      "claims": [
        "C-193",
        "C-137",
        "C-138",
        "C-139"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A6",
      "objective": "OBJ-04",
      "eyebrow": "Decision",
      "title": "The unmatched 3%",
      "type": "choice",
      "prompt": "97% of the wiki's users have emails that match SSO. 3% are legacy contractor accounts with personal emails that do not exist in SSO. Several restricted pages list those contractors. What do you propose?",
      "options": [
        {
          "id": "o2",
          "text": "Make pages that name unmatched users visible to everyone for now.",
          "feedback": "Never index sensitive content with an allow-all ACL for now. That turns an identity gap into an exposure."
        },
        {
          "id": "o3",
          "text": "Replace group ACLs with flattened user lists to catch everyone.",
          "feedback": "Flattening does not fix unmatched identities, and flattened lists drift. Map groups directly."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "Reference users by email, document the unmatched 3%, and agree a customer-approved manual map or exclusion.",
          "feedback": "Right. Email references fit a shared identity provider. Without identity data for the rest, a manual map to corporate identities is needed, or those accounts get no access."
        }
      ],
      "takeaway": "Unmatched identities get a decision, never a broad ACL.",
      "claims": [
        "C-118",
        "C-240",
        "C-195",
        "C-197"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A5",
      "objective": "OBJ-04",
      "eyebrow": "Hosting",
      "title": "Decide hosting with the customer",
      "body": "Glean places no constraints on where a custom connector runs. Choose before you build.",
      "table": {
        "caption": "Documented hosting options",
        "head": [
          "Option",
          "What changes",
          "Choose it when"
        ],
        "rows": [
          [
            "Glean-hosted",
            "Runs in the Glean cloud instance; crawls can be scheduled like native connectors",
            "The customer accepts running the connector in the Glean cloud instance"
          ],
          [
            "Self-hosted",
            "Runs in the customer's environment, which must allow pushes to Glean's indexing endpoints",
            "Data residency, network isolation, or internal security policy requires it"
          ]
        ]
      },
      "footnote": "Before proposing Glean-hosted for a partner-built connector, confirm availability with your Partner Manager.",
      "claims": [
        "C-044",
        "C-045",
        "C-042",
        "C-046",
        "C-047"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A9",
      "objective": "OBJ-05",
      "eyebrow": "Practice",
      "title": "Tag each intake finding",
      "prompt": "Place each finding in the risk area it belongs to.",
      "type": "sort",
      "categories": [
        "Permissions",
        "Identity",
        "Freshness and deletion",
        "Hosting and security",
        "Capacity"
      ],
      "pairs": [
        {
          "item": "Controlled-substance pages require both the pharmacist group and the clinic group.",
          "category": "Permissions",
          "why": "An AND rule maps to a group intersection: a user must belong to every group within one entry."
        },
        {
          "item": "Contractor accounts use personal emails that are not in SSO.",
          "category": "Identity",
          "why": "Unmatched identities need a manual map or a documented exclusion."
        },
        {
          "item": "Permission removals must reach Glean within one hour.",
          "category": "Freshness and deletion",
          "why": "Permission change frequency drives the refresh schedule."
        },
        {
          "item": "No data may leave the customer network except to Glean indexing endpoints.",
          "category": "Hosting and security",
          "why": "A self-hosted environment must allow pushes to Glean's indexing endpoints."
        },
        {
          "item": "The source allows 300 requests per minute and returns 429 with Retry-After.",
          "category": "Capacity",
          "why": "Pace below the quota and honor Retry-After."
        },
        {
          "item": "Deletion tombstones are kept for only 30 days.",
          "category": "Freshness and deletion",
          "why": "A short deletion signal means a regular full run must stay in the plan to reconcile deletions."
        }
      ],
      "takeaway": "Every finding lands in a design decision, or it was not worth asking.",
      "claims": [
        "C-198",
        "C-240",
        "C-257",
        "C-046",
        "C-193",
        "C-176"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "A4",
      "objective": "OBJ-05",
      "eyebrow": "Risk register",
      "title": "The four risks that matter here",
      "hotspots": [
        {
          "label": "Silent empty pages",
          "detail": "About 1 in 400 list calls returns 200 with no items and no cursor before the true end. A full crawl must cover the whole scope, or the missing pages are deleted as stale."
        },
        {
          "label": "Oversized attachments",
          "detail": "The largest attachment is 91 MB. Items over 64 MB index metadata and permissions only."
        },
        {
          "label": "Stale sandbox",
          "detail": "The sandbox was refreshed 11 months ago. Validate against current permission patterns before sign-off."
        },
        {
          "label": "Credential rotation",
          "detail": "Source tokens rotate every 90 days. Plan automated rotation for the Glean indexing token as well."
        }
      ],
      "footnote": "Case facts are fictional; the rules they trigger are sourced.",
      "claims": [
        "C-154",
        "C-170",
        "C-090",
        "C-254",
        "C-238"
      ]
    },
    {
      "id": "SCR-12",
      "archetype": "A8",
      "objective": "OBJ-05",
      "eyebrow": "Worked example",
      "title": "The intake summary, filled in",
      "steps": [
        {
          "title": "Fit",
          "body": "No native connector; document-like policy content; cited answers required. Custom indexed connector."
        },
        {
          "title": "Content",
          "body": "Published pages in scope. Comments deferred with the sponsor's agreement. Attachments over 64 MB are metadata-only."
        },
        {
          "title": "Permissions",
          "body": "Group ACLs per page, including nested groups and AND rules. The source's admin bypass is not mirrored."
        },
        {
          "title": "People",
          "body": "Email references for 97%; unmatched contractors handled by an approved map or excluded."
        },
        {
          "title": "Activity",
          "body": "Not exposed by the API. Expect weaker ranking."
        },
        {
          "title": "Hosting and freshness",
          "body": "Self-hosted in the customer's cloud project. Incremental every hour with tombstone deletes; full run nightly."
        }
      ],
      "claims": [
        "C-040",
        "C-021",
        "C-090",
        "C-135",
        "C-175",
        "C-176"
      ]
    },
    {
      "id": "SCR-13",
      "archetype": "A6",
      "objective": "OBJ-05",
      "eyebrow": "Decision",
      "title": "Go, conditional go, or no-go?",
      "type": "choice",
      "prompt": "The wiki passes the fit check. Two risks are open: the stale sandbox and the unmatched contractors. Security has not approved hosting. What is your call?",
      "options": [
        {
          "id": "o2",
          "text": "Go now and resolve the open risks during acceptance testing.",
          "feedback": "Hosting determines secrets, scheduling, and networking, so it is chosen before you build."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "Conditional go: build starts when hosting is approved, the sandbox is refreshed, and the identity decision is signed.",
          "feedback": "Right. Each condition removes a failure you would otherwise meet later, in security review, validation, or permissions testing."
        },
        {
          "id": "o3",
          "text": "No-go until the source adds activity data.",
          "feedback": "Missing activity weakens ranking, but it does not block a correct connector."
        }
      ],
      "takeaway": "A conditional go names the conditions and who closes each one.",
      "claims": [
        "C-045",
        "C-135"
      ]
    },
    {
      "id": "SCR-14",
      "archetype": "A13",
      "objective": "OBJ-01",
      "eyebrow": "Job aid",
      "title": "Intake checklist",
      "cards": [
        {
          "tag": "Fit",
          "title": "Existing options ruled out",
          "body": "Native connector, web crawler, Custom Metadata, and live options checked and recorded."
        },
        {
          "tag": "Data",
          "title": "Four types assessed",
          "body": "Content, permissions, people, activity: where each comes from, how, and the cost of each gap."
        },
        {
          "tag": "Access",
          "title": "Keys, sandbox, URLs",
          "body": "Read-only keys, a current sandbox, a stable API URL, and the viewURL target."
        },
        {
          "tag": "Decide",
          "title": "Sizing, identity, hosting, risks",
          "body": "Calls per run, unmatched users, where it runs, and a signed go or no-go."
        }
      ],
      "claims": [
        "C-250",
        "C-251",
        "C-254",
        "C-255",
        "C-256"
      ]
    },
    {
      "id": "SCR-15",
      "archetype": "quiz",
      "objective": "OBJ-03",
      "eyebrow": "Prove it",
      "title": "Scoping and intake check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-01",
          "stem": "What does the custom connector questionnaire ask first about a source system?",
          "options": [
            {
              "id": "b",
              "text": "How many engineers the partner can assign",
              "feedback": "Staffing comes after fit is established."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Whether a native connector or the Glean Web Crawler already covers it",
              "feedback": "Right. Check existing options before anything else."
            },
            {
              "id": "c",
              "text": "Which language the connector will use",
              "feedback": "Implementation comes after fit is established."
            },
            {
              "id": "d",
              "text": "Whether the statement of work is signed",
              "feedback": "Commercial steps are not the questionnaire's first question."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-01",
          "stem": "Which credential does the questionnaire prefer for content, permission, and activity data?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "Read-only keys, where the source supports them",
              "feedback": "Right."
            },
            {
              "id": "b",
              "text": "An administrator account with write access",
              "feedback": "Write access adds risk to a connector that only reads."
            },
            {
              "id": "c",
              "text": "A developer's personal token",
              "feedback": "A personal token ties the connector to one person's access and tenure."
            },
            {
              "id": "d",
              "text": "Any key that never expires",
              "feedback": "The questionnaire prefers read-only keys; expiry and rotation are still required elsewhere."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "A source exposes only file names and dates, with no body text. What is the consequence?",
          "options": [
            {
              "id": "b",
              "text": "Results will never appear in search",
              "feedback": "Metadata is still searchable."
            },
            {
              "id": "c",
              "text": "Glean will fetch the body from the viewURL",
              "feedback": "A push connector indexes what it sends. Fetch the body in the connector."
            },
            {
              "id": "d",
              "text": "Ranking improves because documents are smaller",
              "feedback": "No such effect is documented."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Results can be found, but Assistant cannot summarize them",
              "feedback": "Right. Metadata-only results cannot ground generative answers."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "The source has no identity data that maps to corporate accounts. What is needed?",
          "options": [
            {
              "id": "b",
              "text": "An allow-all ACL until identities are sorted out",
              "feedback": "Never index sensitive content with an allow-all ACL for now."
            },
            {
              "id": "c",
              "text": "Nothing; Glean resolves unknown users itself",
              "feedback": "Identity resolution needs identities to resolve."
            },
            {
              "id": "a",
              "correct": true,
              "text": "A manual map of users to corporate identities",
              "feedback": "Right."
            },
            {
              "id": "d",
              "text": "A people connector for employee records",
              "feedback": "Employee data is distinct from the datasource identities that back document ACLs."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-03",
          "stem": "The source allows 600 requests per minute. What pacing does the SDK guidance suggest?",
          "options": [
            {
              "id": "b",
              "text": "Exactly 10 requests per second to finish fastest",
              "feedback": "Running at the quota leaves no room for retries."
            },
            {
              "id": "a",
              "correct": true,
              "text": "About 7 to 8 requests per second, leaving room for retries",
              "feedback": "Right. 600 per minute is 10 per second; 7 to 8 leaves headroom."
            },
            {
              "id": "c",
              "text": "As fast as possible, relying on 429 retries",
              "feedback": "Retries are reactive. A rate limiter paces proactively."
            },
            {
              "id": "d",
              "text": "One request per second, to be safe",
              "feedback": "Over-throttling wastes the crawl window. Pace just below quota."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-03",
          "stem": "Which rate limit applies to the /indexdocuments endpoint?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "600 documents per minute",
              "feedback": "Right. /indexdocument is limited to 10 requests per second."
            },
            {
              "id": "b",
              "text": "10 documents per second per IP",
              "feedback": "10 requests per second is the /indexdocument limit."
            },
            {
              "id": "c",
              "text": "8,000 documents per minute",
              "feedback": "8,000 requests per minute is the deployment-wide ceiling across all IPs."
            },
            {
              "id": "d",
              "text": "Unlimited for push connectors",
              "feedback": "Indexing endpoints have documented limits."
            }
          ]
        },
        {
          "id": "Q-07",
          "objective": "OBJ-04",
          "stem": "The customer's security policy requires the connector to run inside its own network. What is the documented choice?",
          "options": [
            {
              "id": "b",
              "text": "Glean-hosted, because it keeps data inside the network",
              "feedback": "Glean-hosted runs in the Glean cloud instance."
            },
            {
              "id": "c",
              "text": "Either; hosting can be chosen after the build",
              "feedback": "Choose hosting before you build."
            },
            {
              "id": "d",
              "text": "Neither; custom connectors cannot run there",
              "feedback": "Glean places no constraints on where a custom connector runs."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Self-host it; the network must allow pushes to Glean indexing endpoints",
              "feedback": "Right."
            }
          ]
        },
        {
          "id": "Q-08",
          "objective": "OBJ-04",
          "stem": "Source users and SSO users share the same email addresses. How should the datasource reference users?",
          "options": [
            {
              "id": "b",
              "text": "By the source's numeric user IDs only",
              "feedback": "Email references fit a shared identity provider; ID references need their own user records."
            },
            {
              "id": "c",
              "text": "By display name",
              "feedback": "Display names are not unique identifiers."
            },
            {
              "id": "a",
              "correct": true,
              "text": "By email, with isUserReferencedByEmail set to true",
              "feedback": "Right."
            },
            {
              "id": "d",
              "text": "By group membership, with no users",
              "feedback": "Users must be indexed before they are referenced."
            }
          ]
        },
        {
          "id": "Q-09",
          "objective": "OBJ-05",
          "stem": "Why record how often permissions change in the source?",
          "options": [
            {
              "id": "b",
              "text": "It determines the datasource category",
              "feedback": "Category reflects the content type."
            },
            {
              "id": "a",
              "correct": true,
              "text": "It sets how often permissions and memberships must be refreshed",
              "feedback": "Right. Permissions and memberships are processed asynchronously, so the refresh schedule must meet the customer's removal target."
            },
            {
              "id": "c",
              "text": "It decides whether activity is needed",
              "feedback": "Activity is about ranking signals, not permission changes."
            },
            {
              "id": "d",
              "text": "It fixes the viewURL format",
              "feedback": "The viewURL is the click-through target, not a permission setting."
            }
          ]
        },
        {
          "id": "Q-10",
          "objective": "OBJ-05",
          "stem": "The sandbox is 11 months old and misses newer permission patterns. How should this appear in scoping?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "As a risk with a condition: refresh it before validation sign-off",
              "feedback": "Right. Validation needs a representative environment."
            },
            {
              "id": "b",
              "text": "As acceptable, because production gets tested later",
              "feedback": "Late discovery is the expensive kind."
            },
            {
              "id": "c",
              "text": "As a reason to build against production",
              "feedback": "The questionnaire asks for a sandbox precisely to avoid that."
            },
            {
              "id": "d",
              "text": "As irrelevant to permissions testing",
              "feedback": "Permission patterns are exactly what an old sandbox may miss."
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
      "body": "Each screen lists claim ids such as C-006. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.",
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
            "C-006"
          ],
          [
            "How connectors power the Glean experience",
            "Glean Docs (docs.glean.com)",
            "C-021"
          ],
          [
            "Overview of custom data source",
            "Glean Docs (docs.glean.com)",
            "C-040, C-042"
          ],
          [
            "Choose a deployment model",
            "Glean Docs (docs.glean.com)",
            "C-044, C-045, C-046, C-047"
          ],
          [
            "Crawl and index limits",
            "Glean Docs (docs.glean.com)",
            "C-090"
          ],
          [
            "Permissions (Indexing API guide)",
            "Glean Developer docs (developers.glean.com)",
            "C-111, C-116"
          ],
          [
            "Setup Datasource",
            "Glean Developer docs (developers.glean.com)",
            "C-118"
          ],
          [
            "Indexing SDK — Indexing modes",
            "Glean Developer docs (developers.glean.com)",
            "C-170, C-175, C-176"
          ],
          [
            "Indexing SDK — Permissions",
            "Glean Developer docs (developers.glean.com)",
            "C-195, C-197, C-198"
          ],
          [
            "Indexing SDK — Connector types",
            "Glean Developer docs (developers.glean.com)",
            "C-169"
          ],
          [
            "Indexing SDK — Rate limiting",
            "Glean Developer docs (developers.glean.com)",
            "C-193, C-194"
          ],
          [
            "Indexing SDK — Overview",
            "Glean Developer docs (developers.glean.com)",
            "C-154"
          ],
          [
            "Rate Limits and Retries",
            "Glean Developer docs (developers.glean.com)",
            "C-137, C-138, C-139"
          ],
          [
            "Glean Partner Content | Custom Connector Best Practices (deck, April 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-035, C-135, C-136, C-238, C-240, C-241"
          ],
          [
            "[External] Glean Partner Content | Custom Connector Questionnaire",
            "Glean partner document (ask your Partner Manager for access)",
            "C-250, C-251, C-252, C-253, C-254, C-255, C-256, C-257"
          ]
        ]
      },
      "claims": []
    },
    {
      "id": "SCR-16",
      "archetype": "A14",
      "objective": "OBJ-05",
      "eyebrow": "Next step",
      "title": "Next: prove the environment is ready",
      "body": "TEC-201 turns this intake into a readiness gate: datasource, token, source access, network, and test personas. Submit your intake summary to your assessor with the risk register attached.",
      "signature": true,
      "claims": []
    }
  ]
};
