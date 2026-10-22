/* Compiled by the SCORM Engineer from content/, interactions/, and
   assessment/. Do not hand-edit. Answer keys are merged here for runtime
   scoring only; the authored key lives in assessment/key.json. */
window.MODULE = {
  "id": "TEC-201",
  "title": "Connector Deployment Prerequisites",
  "mastery": 80,
  "objectives": [
    {
      "id": "OBJ-01",
      "text": "Confirm the datasource is configured and visible to the right people before the first upload."
    },
    {
      "id": "OBJ-02",
      "text": "Issue and handle an Indexing API token correctly: scope, expiry, rotation, restrictions, and storage."
    },
    {
      "id": "OBJ-03",
      "text": "Confirm source access and network readiness with the owners who control them."
    },
    {
      "id": "OBJ-04",
      "text": "Prepare test personas and run a first-run check before scaling up."
    }
  ],
  "screens": [
    {
      "id": "SCR-01",
      "archetype": "A1",
      "objective": "OBJ-02",
      "eyebrow": "Cold open",
      "title": "The first week, lost",
      "body": "Week one of the build. A production token arrives by email. The datasource exists, but nobody enabled it, so nothing shows up. The customer's firewall blocks the push. Every one of these was knowable before a line of code. This module is the gate that catches them.",
      "footnote": "Composite, fictional case used across this accreditation. Product behavior is sourced; the customer environment and its numbers are invented for practice.",
      "claims": []
    },
    {
      "id": "SCR-02",
      "archetype": "A2",
      "objective": "OBJ-01",
      "eyebrow": "What you will be able to do",
      "title": "Pass the gate before you build",
      "bullets": [
        "Confirm datasource setup and visibility.",
        "Issue and store an indexing token correctly.",
        "Confirm source access and network readiness with their owners.",
        "Prepare test personas and a first-run check."
      ],
      "asset": {
        "src": "assets/svg/tec-201-a01.svg",
        "alt": "Five-step readiness gate from datasource to personas.",
        "caption": "Every gate has an owner and evidence."
      },
      "claims": [
        "C-103",
        "C-054",
        "C-251",
        "C-046",
        "C-049"
      ]
    },
    {
      "id": "SCR-03",
      "archetype": "A3",
      "objective": "OBJ-01",
      "eyebrow": "Datasource",
      "title": "Configure the datasource deliberately",
      "bullets": [
        "Choose the permissions model at setup: per-document ACLs, or visible to everyone in the organization.",
        "urlRegex must be neither too broad, capturing other datasources' URLs, nor too narrow.",
        "Set isUserReferencedByEmail to true to reference users by email.",
        "Choose the category deliberately: the right type enables enhanced ranking.",
        "The datasource must be enabled for search. A test datasource shows results only to beta users with permissions, and turns ranking signals off."
      ],
      "claims": [
        "C-048",
        "C-119",
        "C-118",
        "C-121",
        "C-103",
        "C-124",
        "C-123"
      ]
    },
    {
      "id": "SCR-04",
      "archetype": "A4",
      "objective": "OBJ-02",
      "eyebrow": "The token",
      "title": "Five rules for the indexing token",
      "hotspots": [
        {
          "label": "Issued by Glean",
          "detail": "The Indexing API supports only Glean-issued tokens. OAuth authentication is not available."
        },
        {
          "label": "Expiry and rotation",
          "detail": "An expiration date is required. The minimum rotation period is 1440 minutes (24 hours). Automate rotation."
        },
        {
          "label": "Who can create it",
          "detail": "Setup Admins, Admins, and Super Admins can create Indexing API tokens. Only Super Admins can grant global scope."
        },
        {
          "label": "Where it can be used",
          "detail": "Restrict API access to known infrastructure with IP range restrictions."
        },
        {
          "label": "Shown once",
          "detail": "The token is displayed only once after creation. Use separate tokens for dev, staging, and production."
        }
      ],
      "asset": {
        "src": "assets/svg/tec-201-a02.svg",
        "alt": "Four cells with Indexing API token rules.",
        "caption": "The token value is displayed once. Store it immediately."
      },
      "claims": [
        "C-052",
        "C-054",
        "C-053",
        "C-238",
        "C-056",
        "C-059",
        "C-060",
        "C-055",
        "C-057"
      ]
    },
    {
      "id": "SCR-05",
      "archetype": "A6",
      "objective": "OBJ-02",
      "eyebrow": "Decision",
      "title": "The helpful admin",
      "type": "choice",
      "prompt": "To save time, the customer's admin offers to email you the production indexing token with global scope. You are building in dev this week. What do you ask for?",
      "options": [
        {
          "id": "o2",
          "text": "Accept the production token now and rotate it after go-live.",
          "feedback": "That puts a production credential in dev and in email. Use separate tokens for each environment."
        },
        {
          "id": "o3",
          "text": "Ask for OAuth access instead, so no token is shared.",
          "feedback": "The Indexing API supports only Glean-issued tokens. OAuth is not available."
        },
        {
          "id": "o1",
          "correct": true,
          "text": "A separate dev token, scoped to the dev datasource, with an expiry, delivered to the secret store.",
          "feedback": "Right. Use separate tokens per environment, set an expiry, and store the value when it is shown, because it is displayed only once."
        }
      ],
      "takeaway": "One environment, one token, one secret store.",
      "claims": [
        "C-057",
        "C-054",
        "C-055",
        "C-052"
      ]
    },
    {
      "id": "SCR-06",
      "archetype": "A3",
      "objective": "OBJ-03",
      "eyebrow": "Source and network",
      "title": "Access the source safely, reach Glean reliably",
      "bullets": [
        "Source credentials: read-only keys are preferred, where supported, for content, permission, and activity data.",
        "A dev, test, or sandbox environment to build and validate against.",
        "A static API URL, or a plan for when it changes.",
        "Self-hosted: the environment must allow pushes to Glean's indexing endpoints.",
        "Hosting is chosen before you build, because it determines secrets, scheduling, and networking."
      ],
      "claims": [
        "C-251",
        "C-254",
        "C-256",
        "C-046",
        "C-045"
      ]
    },
    {
      "id": "SCR-07",
      "archetype": "A9",
      "objective": "OBJ-03",
      "eyebrow": "Practice",
      "title": "Who owns each gate?",
      "prompt": "Assign each readiness task to its owner.",
      "type": "sort",
      "categories": [
        "Glean admin",
        "Super Admin",
        "Source owner",
        "Security architect",
        "Partner lead"
      ],
      "pairs": [
        {
          "item": "Create the datasource and enable it for a test group.",
          "category": "Glean admin",
          "why": "Admins configure datasources and their visibility."
        },
        {
          "item": "Grant a token with global scope, if one is truly needed.",
          "category": "Super Admin",
          "why": "Only Super Admins can grant global scope."
        },
        {
          "item": "Issue read-only source credentials and a current sandbox.",
          "category": "Source owner",
          "why": "The source owner controls keys and environments."
        },
        {
          "item": "Approve where secrets are stored and which egress is open.",
          "category": "Security architect",
          "why": "Hosting and network choices are security decisions."
        },
        {
          "item": "Run the first-run check and record the results.",
          "category": "Partner lead",
          "why": "The builder proves one public and one permissioned document behave correctly."
        }
      ],
      "takeaway": "A gate without an owner is a gate nobody closes.",
      "claims": [
        "C-103",
        "C-056",
        "C-251",
        "C-254",
        "C-045",
        "C-049"
      ]
    },
    {
      "id": "SCR-08",
      "archetype": "A7",
      "objective": "OBJ-04",
      "eyebrow": "First run",
      "title": "One public, one permissioned, then scale",
      "steps": [
        {
          "title": "Public sample",
          "body": "Index one public sample document. Confirm it appears in search."
        },
        {
          "title": "Permissioned sample",
          "body": "Index one permissioned document. Confirm only authorized users can see it."
        },
        {
          "title": "Scale",
          "body": "Once both behave correctly, scale up."
        }
      ],
      "claims": [
        "C-049"
      ]
    },
    {
      "id": "SCR-09",
      "archetype": "A5",
      "objective": "OBJ-04",
      "eyebrow": "Personas",
      "title": "Test identities you will need",
      "body": "Denial is as important as access: plan identities that must not see a document. On a test datasource, each persona must be a beta user and still needs document permissions.",
      "table": {
        "caption": "Persona set for the policy wiki",
        "head": [
          "Persona",
          "Proves"
        ],
        "rows": [
          [
            "Connector lead",
            "Setup works end to end"
          ],
          [
            "Clinical staff member",
            "Plain group access"
          ],
          [
            "Pharmacist at one clinic",
            "A both-groups rule allows access"
          ],
          [
            "Nurse lead in a nested group",
            "Nested membership resolves"
          ],
          [
            "Contractor",
            "Denied pages stay hidden"
          ],
          [
            "Source admin",
            "The source's admin bypass is not mirrored"
          ]
        ]
      },
      "footnote": "Persona names are role labels in the fictional case, not real accounts.",
      "claims": [
        "C-124",
        "C-199"
      ]
    },
    {
      "id": "SCR-10",
      "archetype": "A13",
      "objective": "OBJ-01",
      "eyebrow": "Job aid",
      "title": "Readiness gate checklist",
      "table": {
        "caption": "Evidence required before the first upload",
        "head": [
          "Gate",
          "Evidence"
        ],
        "rows": [
          [
            "Datasource",
            "Name, urlRegex, identity references, category, permissions model; enabled for a test group"
          ],
          [
            "Token",
            "Per environment, expiring, rotation planned, IP restricted, stored as a secret"
          ],
          [
            "Source access",
            "Read-only keys, current sandbox, stable API URL"
          ],
          [
            "Network",
            "Egress to Glean indexing endpoints confirmed"
          ],
          [
            "Personas",
            "Allowed and denied identities named; first-run plan agreed"
          ]
        ]
      },
      "claims": [
        "C-119",
        "C-118",
        "C-048",
        "C-103",
        "C-057",
        "C-054",
        "C-059",
        "C-251",
        "C-046",
        "C-049"
      ]
    },
    {
      "id": "SCR-11",
      "archetype": "quiz",
      "objective": "OBJ-02",
      "eyebrow": "Prove it",
      "title": "Deployment prerequisites check",
      "type": "quiz",
      "claims": [],
      "items": [
        {
          "id": "Q-01",
          "objective": "OBJ-02",
          "stem": "Which authentication does the Indexing API accept?",
          "options": [
            {
              "id": "b",
              "text": "OAuth tokens from the customer's identity provider",
              "feedback": "OAuth authentication is not available for the Indexing API."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Glean-issued Indexing API tokens only",
              "feedback": "Right. OAuth authentication is not available."
            },
            {
              "id": "c",
              "text": "A Client API token with any scope",
              "feedback": "Client API tokens are for the Client API and the activity endpoint."
            },
            {
              "id": "d",
              "text": "The source system's service-account token",
              "feedback": "That token reads the source. Glean needs its own issued token."
            }
          ]
        },
        {
          "id": "Q-02",
          "objective": "OBJ-02",
          "stem": "What is the minimum rotation period for an Indexing API token?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "1440 minutes (24 hours)",
              "feedback": "Right. An expiration date is also required."
            },
            {
              "id": "b",
              "text": "60 minutes",
              "feedback": "The documented minimum is 1440 minutes."
            },
            {
              "id": "c",
              "text": "There is no rotation; tokens never expire",
              "feedback": "An expiration date is required."
            },
            {
              "id": "d",
              "text": "90 days, fixed",
              "feedback": "The minimum is 1440 minutes; the customer sets the period above that."
            }
          ]
        },
        {
          "id": "Q-03",
          "objective": "OBJ-02",
          "stem": "Who can grant an Indexing API token global scope?",
          "options": [
            {
              "id": "b",
              "text": "Any Admin or Setup Admin",
              "feedback": "They can create tokens; only Super Admins can grant global scope."
            },
            {
              "id": "c",
              "text": "The partner building the connector",
              "feedback": "Partners do not grant scope in the customer's deployment."
            },
            {
              "id": "d",
              "text": "Glean Support, on request",
              "feedback": "Scope is granted by the customer's Super Admin."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Only Super Admins",
              "feedback": "Right. Setup Admins and Admins can create tokens, but not with global scope."
            }
          ]
        },
        {
          "id": "Q-04",
          "objective": "OBJ-02",
          "stem": "The admin creates the token and closes the dialog before anyone copies it. What now?",
          "options": [
            {
              "id": "b",
              "text": "Reopen the token page to copy the value",
              "feedback": "The token is displayed only once after creation."
            },
            {
              "id": "c",
              "text": "Reuse the production token for now",
              "feedback": "Use separate tokens for each environment."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Create a new token; the value is shown only once",
              "feedback": "Right. Store the value in the secret store as soon as it is shown."
            },
            {
              "id": "d",
              "text": "Ask Glean Support to read the value back",
              "feedback": "The value is shown only once. Create a new token."
            }
          ]
        },
        {
          "id": "Q-05",
          "objective": "OBJ-04",
          "stem": "Why index one public document before one permissioned document?",
          "options": [
            {
              "id": "b",
              "text": "Public documents index faster than permissioned ones",
              "feedback": "No such difference is documented. The order isolates faults."
            },
            {
              "id": "a",
              "correct": true,
              "text": "If the public one appears and the other does not, the fault is in permissions",
              "feedback": "Right. Each step isolates one layer before you scale up."
            },
            {
              "id": "c",
              "text": "Glean requires a public document in every datasource",
              "feedback": "No such requirement exists."
            },
            {
              "id": "d",
              "text": "It sets the datasource category automatically",
              "feedback": "The category is configured separately."
            }
          ]
        },
        {
          "id": "Q-06",
          "objective": "OBJ-01",
          "stem": "You plan to judge result ranking on a test datasource. What should you know?",
          "options": [
            {
              "id": "a",
              "correct": true,
              "text": "All ranking signals are off in a test datasource",
              "feedback": "Right. Judge ranking after the datasource is enabled normally."
            },
            {
              "id": "b",
              "text": "Ranking in a test datasource matches production",
              "feedback": "Ranking signals are turned off in a test datasource."
            },
            {
              "id": "c",
              "text": "Test datasources rank beta users' documents first",
              "feedback": "No such behavior is documented."
            },
            {
              "id": "d",
              "text": "Beta users see every document regardless of ACLs",
              "feedback": "Beta users must also have permission to view each document."
            }
          ]
        },
        {
          "id": "Q-07",
          "objective": "OBJ-03",
          "stem": "A self-hosted connector cannot upload. Which network condition is required?",
          "options": [
            {
              "id": "b",
              "text": "Glean must be able to connect into the source network",
              "feedback": "A push connector sends data outward to Glean."
            },
            {
              "id": "c",
              "text": "The source API must be exposed to the public internet",
              "feedback": "Self-hosting exists to keep the source inside the customer network."
            },
            {
              "id": "d",
              "text": "A VPN between the partner office and Glean",
              "feedback": "The connector's runtime environment pushes to Glean; the partner office is not in the path."
            },
            {
              "id": "a",
              "correct": true,
              "text": "The environment must allow pushes to Glean's indexing endpoints",
              "feedback": "Right."
            }
          ]
        },
        {
          "id": "Q-08",
          "objective": "OBJ-01",
          "stem": "The urlRegex also matches URLs from another datasource. What is the risk?",
          "options": [
            {
              "id": "b",
              "text": "None; a broad regex is safer",
              "feedback": "A too-broad regex captures other datasources' URLs."
            },
            {
              "id": "c",
              "text": "It disables permissions on the datasource",
              "feedback": "urlRegex does not change permissions."
            },
            {
              "id": "a",
              "correct": true,
              "text": "It is too broad and captures URLs that belong to other datasources",
              "feedback": "Right. Avoid regexes that are too broad or too narrow."
            },
            {
              "id": "d",
              "text": "It changes the datasource category",
              "feedback": "Category is a separate setting."
            }
          ]
        },
        {
          "id": "Q-09",
          "objective": "OBJ-03",
          "stem": "Which source access best meets the readiness gate?",
          "options": [
            {
              "id": "b",
              "text": "Admin keys so the connector never lacks access",
              "feedback": "Read-only keys are preferred where supported."
            },
            {
              "id": "a",
              "correct": true,
              "text": "Read-only keys plus a current sandbox to validate against",
              "feedback": "Right."
            },
            {
              "id": "c",
              "text": "Production access only; sandboxes are optional",
              "feedback": "Ask for a dev, test, or sandbox environment."
            },
            {
              "id": "d",
              "text": "Shared credentials from the source owner's account",
              "feedback": "Tie the connector to its own read-only credentials."
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
      "body": "Each screen lists claim ids such as C-045. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.",
      "table": {
        "caption": "Claim ids by source",
        "head": [
          "Source",
          "Where to find it",
          "Claim ids"
        ],
        "rows": [
          [
            "Choose a deployment model",
            "Glean Docs (docs.glean.com)",
            "C-045, C-046, C-047"
          ],
          [
            "Set up a custom connector",
            "Glean Docs (docs.glean.com)",
            "C-048, C-049"
          ],
          [
            "Glean REST APIs",
            "Glean Docs (docs.glean.com)",
            "C-060"
          ],
          [
            "Bulk Indexing",
            "Glean Developer docs (developers.glean.com)",
            "C-103"
          ],
          [
            "Indexing API Authentication",
            "Glean Developer docs (developers.glean.com)",
            "C-052, C-053, C-054, C-055, C-056, C-057, C-059"
          ],
          [
            "Setup Datasource",
            "Glean Developer docs (developers.glean.com)",
            "C-118, C-119"
          ],
          [
            "Indexing SDK — Permissions",
            "Glean Developer docs (developers.glean.com)",
            "C-199"
          ],
          [
            "Test Datasource",
            "Glean Developer docs (developers.glean.com)",
            "C-123, C-124"
          ],
          [
            "Datasource Category",
            "Glean Developer docs (developers.glean.com)",
            "C-121"
          ],
          [
            "Glean Partner Content | Custom Connector Best Practices (deck, April 2026)",
            "Glean partner document (ask your Partner Manager for access)",
            "C-238"
          ],
          [
            "[External] Glean Partner Content | Custom Connector Questionnaire",
            "Glean partner document (ask your Partner Manager for access)",
            "C-251, C-254, C-256"
          ]
        ]
      },
      "claims": []
    },
    {
      "id": "SCR-12",
      "archetype": "A14",
      "objective": "OBJ-04",
      "eyebrow": "Next step",
      "title": "Gate passed. Now design it well.",
      "body": "BLD-201 turns your intake and readiness evidence into a connector design that survives renames, partial crawls, and permission changes. Submit the completed readiness checklist to your assessor.",
      "signature": true,
      "claims": []
    }
  ]
};
