# CON-101 — Connector Fundamentals: Indexed, Live, Hybrid, and MCP

| Field | Value |
|---|---|
| Level · path | 100 · Custom Connector Competency (entry) |
| Time | 60 min learning · 20 min practice · 15 min assessment = **1.6 h** |
| Prerequisites | None. Helpful: FND-103 platform overview. |
| Design system | `scroll-canvas-v1` (one continuous argument) |
| Owns | Vocabulary, connector types, access modes, tool vs index boundary, first-level fit decision |
| Does not own | Platform internals (CON-201), scoping questionnaire (CON-202), API detail (CON-203) |
| Case | Northbeam §2 inventory (`10-case-packet-northbeam.md`) |

## Learner question

"A customer asked for 'a connector.' What do they actually need, and is a custom connector the right answer?"

## Outcomes (observable)

- `OBJ-101-1` Explain the two functions of a Glean connector and the three data families it must bring in.
- `OBJ-101-2` Distinguish native, web history, push API, and partner connectors, and state who builds and supports each.
- `OBJ-101-3` Predict freshness, latency, and permission behavior for indexed, live, and hybrid access.
- `OBJ-101-4` Explain what tools and MCP integrations do and do not do, and where they are set up.
- `OBJ-101-5` Apply the five-question fit sequence to choose index, tool, both, or neither for a new source.

## Misconceptions to surface and repair

| Misconception | Repair |
|---|---|
| "A connector is a file sync." | A connector brings content **and** the permission map **and** people/activity signals. Content without identity and permissions cannot be shown safely. `C-003` `C-006` |
| "MCP replaces indexing." | Tools act at request time and do not make content searchable. `C-011` |
| "Custom is more flexible, so custom is better." | Custom moves build, freshness, permission, and support ownership to the builder. Prefer an existing connector. `C-035` `C-009` |
| "Live is always fresher, so live is always better." | Live access depends on the source at request time, and behavior, rate limits, and tenant controls differ from indexed paths. `C-014` |
| "Everything in the company should be indexed." | Large structured data and time-series data are poor fits for the index. `C-033` `C-034` |

---

## Teaching sequence

### §1 What a connector does (≈600 words; `OBJ-101-1`)

**Explain.** A connector integrates Glean with a system where content lives, and it is built for that system's API and data model. `C-001` It has two jobs. **Data fetching** pulls data from the source and stores it in the customer's Glean tenant, including the permission map for each item. `C-003` **Content parsing** extracts the item's title, body, comments, and media, and the list of who may view it. `C-004`

Then connect the jobs to the result the customer sees. Indexing connectors index content, mirror permissions from the source, and keep that data current. `C-002` Glean builds its Knowledge Graph from three data families, and the learner must name all three on sight:

1. **Content** — documents, messages, tickets, and other records.
2. **People** — identities, roles, groups, and access information.
3. **Activity** — creation, modification, viewing, and sharing events with the users involved. `C-006`

**Why each family matters.**
- Without **people and permissions**, a result cannot be filtered to the requesting user. Glean's promise is that a user who cannot open an item in the source should not see it in Glean, *assuming the connector and configuration are correct*. `C-020` That assumption is the connector builder's responsibility.
- Without **activity**, the index still works, but ranking is weaker; activity signals such as views, edits, and shares drive relevance. `C-016`

**Data handling (one paragraph, not a security module).** Connector data is encrypted in transit and written to disk only when it reaches the customer's tenant. `C-015` Security depth belongs to TEC-102.

**Check for understanding (unscored).** "A vendor offers a nightly CSV of document titles and bodies with no user information. Which two data families are missing, and what does each absence cost?"

### §2 The four documented connector types (≈700 words; `OBJ-101-2`)

Teach with a comparison table and one example per row. Do **not** invent a fifth type.

| Type | How data gets in | Who builds and supports it | Typical fit | Claim |
|---|---|---|---|---|
| **Native** | Glean calls the source APIs directly. Supports extensive crawling, attachments, threads, mentions. | Glean | Supported SaaS and some on-prem systems | `C-005` |
| **Web history** | The Glean browser extension makes *page titles* from a user's browsing history searchable for specific apps. Results are private to that user. | Glean (extension) | A stop-gap when no native connector exists, the API lacks capabilities, or crawling would violate terms of service | `C-007` |
| **Push API** | The customer's or partner's code pushes data through the Indexing API. | The team that writes the code. Shared code may have limited support. | Custom apps, self-hosted systems, systems behind firewalls, restricted pull access | `C-008` `C-009` |
| **Partner** | A technology partner's integration pushes data through the Indexing API. | The partner organization | Vendor-supported listing in the Connectors catalog | `C-010` |

**Where "custom connector" sits.** "Custom connector" is the everyday name for a push API connector built for one source: an integration that ingests data from a source Glean does not natively support and pushes documents, metadata, and permissions through the Indexing API. `C-040` `C-041` A partner connector is often a custom connector that has been productized and listed with a named support owner. `C-010`

**Web history is not a crawler.** Make the difference explicit: web history is personal and title-only. `C-007` During scoping, the partner separately checks whether an existing native web-crawler datasource can cover a site before building anything. `C-250`

**Namespace preview.** Native and custom connectors live in separate namespaces; a custom connector always has its own identity and document IDs. `C-080` (Full migration treatment: CON-301 §6.)

### §3 Indexed, live, and hybrid access (≈900 words; `OBJ-101-3`)

Present the three modes as three different *data paths at request time*. `C-012`

**Indexed.** Content and permissions were fetched earlier and stored in the tenant. At request time Glean reads its own corpus, so latency is low, and it applies the permission snapshot that was mirrored during crawling and incremental updates. `C-013` Indexed access suits documents, wikis, tickets, knowledge articles, code, and other bulk corpora, and historical or cross-document questions. `C-021`
*Consequence the learner must state:* an indexed answer is only as fresh as the last successful update of **both** the content and the permissions.

**Live.** Glean or a feature calls the source during the request. That can improve freshness or recall, but behavior, rate limits, and the way tenant controls apply differ from indexed paths. `C-014` Some connectors need each end user to authenticate before live access works. `C-014` Live access suits email, calendar, chat, and data where minutes-to-hours freshness dominates or continuous full indexing is impractical. `C-022`
*Consequence:* a live answer depends on the source being up, fast, and within its quota at that moment.

**Hybrid.** The index provides broad recall; targeted live calls add recent or long-tail items; results merge into one permission-filtered context. `C-012` `C-023`

**Runtime choice.** When a user asks Assistant or an agent runs, Glean chooses index, live, or hybrid paths per connector capability and query need. `C-023` The learner does not control that choice per question; the builder controls which paths *exist*.

**Guided contrast (interactive).** Show the same Northbeam question three ways:
- "What is our current insulin storage policy?" → indexed (Beacon).
- "How many beds are open in the east wing now?" → live (BedBoard).
- "Summarize policy changes this week and hold a bed for patient X" → indexed context + live read + write action.

### §4 Tools and MCP (≈700 words; `OBJ-101-4`)

**Core rule.** Tools retrieve current data or perform actions at request time. They do not make source content searchable. `C-011` An MCP integration is one way to provide tools.

**Where they are set up.** Glean deployments created on or after 22 September 2026 set up catalog-backed MCP integrations from **Connectors**. `C-027` One application can have more than one catalog entry — for example, one entry that indexes content and another that provides MCP tools; they are not duplicates. `C-028` Custom or unlisted remote MCP servers use a separate setup path. `C-029` *(Date-sensitive: re-verify before each release. Internal launch note `C-037` records the catalog scale; do not quote it in learner copy.)*

**Worked example of a designed hybrid.** NetSuite MCP gives users real-time access to NetSuite tools using each user's own NetSuite credentials and role, unlike the NetSuite search integration, which indexes records. `C-030` The MCP entry depends on the native connector being set up. `C-031` This is the pattern the learner will recommend for BedBoard-like needs attached to an indexed source.

**What the learner must be able to say to a customer.**
- "MCP will let Assistant *read the current value* or *take the action*. It will not make the content findable in search, and it will not give Assistant historical, cross-document context unless that content is indexed."
- "If you need both, you usually need both paths, each with its own authentication and failure behavior."

### §5 The five-question fit sequence (≈800 words; `OBJ-101-5`)

Teach as an ordered decision. Each question has a documented basis or is marked as a studio heuristic.

| # | Question | If yes | If no | Basis |
|---|---|---|---|---|
| Q1 | Does a native or partner connector already cover the content, permissions, and freshness needed? | Use it. Stop. Consider Custom Metadata for missing fields. | Continue. | `C-035` `C-100` |
| Q2 | Must users **find** or **ground answers in** this content (search, citations, cross-document)? | Indexed path needed. | If the need is only current state or actions → tool/MCP. | `C-021` `C-011` |
| Q3 | Is the data knowledge (text, records) rather than a large structured table or a time series? | Continue with indexing. | Query live through an action or MCP server; or index a generated report. | `C-033` `C-034` |
| Q4 | Does the need tolerate index freshness, or does it demand request-time values? | Indexed. | Add a live path (hybrid). | `C-022` `C-032` |
| Q5 | Can the source provide content, identity, permissions, and (ideally) activity through an API or export? | Proceed to scoping (CON-202). | Plan the fallback and its cost (§6). | `C-240` `C-241` `C-253` |

**What happens when Q5 is partly "no"** (from the Best Practices deck): if identity is missing, a manual map of users to corporate identities is required; if only metadata is available, results show metadata only and Assistant cannot summarize or ground on the content; if permissions are missing, the fallback is org-wide or app-level visibility, which the customer must explicitly accept; without activity signals, results are more likely to be outranked. `C-240` `C-241` `C-136`

### §6 When **not** to build a custom connector (≈500 words)

The Best Practices deck names four cases. Teach each with its alternative.

1. **A native connector already exists.** Work to use it first, or consider migrating the data to a system that has one. `C-035` `C-036`
2. **The need is real-time or live data.** There will always be delay between data generation and indexing; use custom actions or MCP to query live data. `C-032`
3. **Large structured data lake.** Glean indexes large amounts of unstructured data well; for a large structured lake, use a custom action or MCP server to query it. `C-033`
4. **Time-series or sensor data.** Glean is not an analytics platform for that data; index a generated report or query it live. `C-034`

Add one program-level condition, clearly labeled as a program requirement rather than product behavior: a production custom connector needs an owner and a customer-approved maintenance plan. `C-265` `C-273` If no one will own it, the right answer is "not yet."

### §7 Bridge to the path (≈200 words)

Close with the map of the rest of the path and the Northbeam decision: Beacon is a custom indexed connector; BedBoard is a tool; ClaimsLake and FacilityPulse are not indexed; Drive stays native with metadata enrichment. CON-201 next explains what happens to a Beacon page between "pushed" and "answered."

---

## Diagrams (specify before drawing)

### `DGM-CC-101-A` — Three data paths for one question
- **Learner question:** "Where does the answer come from, and when was it true?"
- **Type:** three-lane sequence diagram (Indexed · Live · Tool action).
- **Entities:** User → Glean runtime → (lane 1) tenant index with permission snapshot; (lane 2) source API with per-user auth; (lane 3) tool call → source write.
- **Time markers:** lane 1 shows "fetched earlier" with a clock; lanes 2–3 show "now."
- **Permission markers:** lane 1 "mirrored ACL snapshot"; lane 2 "source enforces for this user"; lane 3 "tool permission + approval."
- **Claims:** `C-012` `C-013` `C-014` `C-011` `C-023`.
- **Text equivalent (required):** numbered prose of each lane.
- **Reuse:** extended in CON-201 as `DGM-CC-201-A`.

### `DGM-CC-101-B` — Connector type matrix
- Comparison matrix: rows = four types; columns = data path, builder, support owner, visibility scope, typical fit. `C-005`–`C-010`.

### `DGM-CC-101-C` — Fit decision tree
- Five diamonds (Q1–Q5) with exits to: native, tool/MCP, live query/report, hybrid, custom indexed, "not yet." Each exit labeled with its claim ID.

## Worked example (fully solved) — Northbeam inventory

Walk through all seven systems from case packet §2 with Q1–Q5. Show the reasoning for two in full:
- **Beacon:** Q1 no native → Q2 yes (policy search, citations) → Q3 yes (text) → Q4 1-hour freshness is acceptable → Q5 API exposes pages, users, groups, read groups; activity is not exposed. **Decision:** custom indexed connector; accept weaker ranking without activity and record it as a known risk. `C-135`
- **Google Drive "Clinic ID" facet:** Q1 native exists → stop. Add the facet with Custom Metadata on native documents; a custom Drive connector would duplicate content in a separate namespace. `C-100` `C-080`

## Guided practice (feedback on every choice)

Sort interaction: learner places ClaimsLake, FacilityPulse, BedBoard, CourseForge, RefDesk into *Native / Custom indexed / Tool-MCP / Live query or report / Not yet*. Feedback cites the Q-number and claim that decides it. A second pass asks for the **rejected** alternative for each.

## Transfer task (different industry)

"Harbor Freight Logistics" (fictional) lists: a proprietary dispatch notes system (SQL + REST, per-route ACLs); a fleet GPS feed; a SaaS HR tool with a native connector; a shipment-status API customers ask about in real time. Learner writes a four-line decision record per system. Rubric: correct mode, cited reason, named alternative, named owner risk.

## Assessment (12 items; mastery 80%; ≥8 application items)

| # | Stem (abbreviated) | Key | Why the distractors are wrong | Obj |
|---|---|---|---|---|
| 1 | A team wants Assistant to answer "what did we decide about X last year?" from a system that has an MCP server but no connector. Best first step? | Scope an indexed path (custom or partner) | MCP alone does not make content searchable (`C-011`); "enable MCP and done" is the trap | 4 |
| 2 | Which statement about web history connectors is true? | Titles from a user's browsing history; private to that user | Not a crawler; not org-wide; not content bodies (`C-007`) | 2 |
| 3 | A custom source returns content but no users or groups. What is the consequence? | Manual identity map or broader visibility, explicitly accepted | "Glean infers ACLs" is false (`C-240`) | 1 |
| 4 | Warehouse with 400M rows; users ask aggregate questions. | Live query via action/MCP | Index is for knowledge, not a data lake (`C-033`) | 5 |
| 5 | Indexed answer shows a document the user lost access to 10 minutes ago. Most likely reason? | Permission snapshot not yet updated | Indexed uses mirrored snapshot (`C-013`) | 3 |
| 6 | Who supports a partner connector? | The partner organization | Not Glean by default (`C-010`) | 2 |
| 7 | Customer asks for a custom Drive connector to add a facet. | Keep native; add Custom Metadata | Custom duplicates in a new namespace (`C-100` `C-080`) | 5 |
| 8 | Where does a new (post-22-Sep-2026) deployment set up a catalog MCP integration? | Connectors | Old path is Platform → Tools for earlier setups (`C-027`) | 4 |
| 9 | Pick the best fit for freezer telemetry every 10 s. | Live query or indexed daily report | Time-series is a poor index fit (`C-034`) | 5 |
| 10 | Which three data families does Glean need to build the graph? | Content, people, activity | Distractors omit people or activity (`C-006`) | 1 |
| 11 | A source has webhooks and the customer needs "current bed count." Index or tool? | Tool (live) | Webhooks improve index freshness but the need is request-time state (`C-022`) | 3 |
| 12 | What changes for the partner when choosing custom over native? | Builder owns freshness, permissions, support | "Glean maintains it" is false for push code (`C-009`) | 2 |

Item bank rule: build two alternates per item for retries.

## Job aid — "Connector fit card" (one page)

Front: the Q1–Q5 table with exits. Back: four "do not build" cases and the one-line customer explanation for "MCP ≠ search."

## Cross-module contract

- CON-201 reuses `DGM-CC-101-A` and extends lane 1 into the full pipeline.
- CON-202 turns Q5 into the questionnaire.
- FND-105 and BLD-102 keep their own constructs; link here for connector-specific depth only.

## Claims used

`C-001` `C-002` `C-003` `C-004` `C-005` `C-006` `C-007` `C-008` `C-009` `C-010` `C-011` `C-012` `C-013` `C-014` `C-015` `C-016` `C-020` `C-021` `C-022` `C-023` `C-027` `C-028` `C-029` `C-030` `C-031` `C-032` `C-033` `C-034` `C-035` `C-036` `C-040` `C-041` `C-080` `C-100` `C-135` `C-136` `C-240` `C-241` `C-250` `C-253` `C-265` `C-273` · internal launch note: `C-037`
