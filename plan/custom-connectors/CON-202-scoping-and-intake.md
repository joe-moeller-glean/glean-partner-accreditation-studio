# CON-202 — Custom Connector Scoping and Intake

| Field | Value |
|---|---|
| Level · path | 200 · Custom Connector Competency |
| Time | 70 min learning · 45 min practice (discovery simulation + intake) · 15 min assessment = **2.2 h** |
| Prerequisites | CON-101 (CON-201 recommended) |
| Design system | `paged-v1` (procedural, artifact-driven) |
| Owns | Discovery, feasibility, sizing, freshness requirement, identity alignment, hosting choice, risk register, go/no-go, project plan |
| Does not own | Environment readiness checks (TEC-201), architecture patterns (BLD-201) |
| Primary artifacts | Completed Custom Connector Questionnaire; feasibility scorecard; capacity estimate; risk register; go/no-go memo; project timeline |

## Learner question

"Before anyone writes code: is this connector feasible, what exactly will it index, who can see what, how fresh must it be, where will it run, and what could sink it?"

## Outcomes

- `OBJ-202-1` Run a structured discovery using the Custom Connector Questionnaire (sections A–H) and record evidence, not opinions.
- `OBJ-202-2` Assess feasibility across the four information types — content, identity, permissions, activity — and choose the extraction method.
- `OBJ-202-3` Estimate corpus size, document-size risks, change rate, and crawl duration from source quotas.
- `OBJ-202-4` Decide identity reference strategy (email vs datasource ID) and document unmatched identities.
- `OBJ-202-5` Choose a hosting model before build and justify it.
- `OBJ-202-6` Produce a risk register and a go / go-with-conditions / no-go recommendation.

## Misconceptions

| Misconception | Repair |
|---|---|
| "Scoping is a formality; we learn by building." | Hosting determines how secrets, scheduling, and networking are handled; choose it before building. `C-045` |
| "If the API returns documents, we are feasible." | Feasibility needs content **and** identity **and** permissions; activity is highly desirable. Missing pieces have named costs. `C-240` `C-241` `C-136` |
| "Emails always match." | Ask whether source users match SSO users. Unmatched identities cannot be granted access. `C-252` |
| "Big files just index." | Items over 64 MB index metadata and permissions only; indexable text is truncated at 16.875 MB; follow the same limits for custom connectors. `C-090` `C-091` `C-093` |

---

## Teaching sequence

### §1 Why structured scoping (≈400 words)

Frame scoping as risk discovery. The partner's scoping framework appears in the Competency definition itself: define use cases, assess source-system APIs and permissions, estimate index size and frequency, and plan Dev/Test/Deploy with the discovery questionnaire. `C-260` The Content Package organizes the same scope into topic groups: use-case discovery; source API scoping (data and permissions); index size and frequency; indexing pipeline; Glean UI experience; Dev/Test/Deploy. (S-46)

Name the roles the questionnaire expects before the first call — customer coordinator, customer Glean admin, customer source-system technical owner, executive sponsor; partner project manager, partner Glean admin, partner API integration architect. (S-45) A missing source-system owner is itself a risk.

### §2 The questionnaire, section by section (≈1,300 words; `OBJ-202-1`)

For each section: *the questions that matter most · why · what a red flag sounds like*.

**A. General.** Source name, current access, user counts, compliance constraints, and — first — "Is there an existing native connector, or can the native Glean web-crawler datasource crawl it? If yes, why build a custom connector?" `C-250` Red flag: "We want custom because it's ours." (CON-101 Q1.)

**B. Use case.** Which teams, which use cases, search only or Assistant/Agents too, example questions, success metrics, ranking expectations. (S-45) Turn every "example question" into a test case; you will reuse them in BLD-202 and in the customer's acceptance plan.

**C. Source access and permissions (the heaviest section).**
- Does an API export content **and** user permissions (list IDs, get body, get users/groups with read access)? (S-45)
- Incremental support (created/updated fields), activity data, licensing for API use, export restrictions, rate limits, filtering, documentation quality. (S-45)
- Credentials: who provides them; read-only keys preferred for content, permission, and activity data. `C-251`
- Network path: firewalls, private networks, where the code will run. (S-45)
- Sandbox: is there one, who gets access, AppSec approval time, is it representative? `C-254`
- Identity: do source users match the SSO users associated with Glean? `C-252`
- No-API fallback: can the system export content to storage, with permissions in a sidecar file or metadata, and can it export only changes? `C-253`

**D. Content structure.** Types, languages, images and OCR need, metadata relevant to ranking, transformation needs, and structural relationships (parent/child, threads). (S-45)

**E. Content sizing.** Documents count, total bytes, per-item average/min/max, growth, seasonality. (S-45)

**F. Datasource behavior.** How often content and permissions change in the source and how often each must update in Glean; webhook/event support. `C-257` Permission freshness is a *security* requirement, not a convenience.

**G. Glean UI.** Rendering, facets/filters, and the viewURL target. `C-255`

**H. Other.** Future plans, risks, DR environments, and whether the API URL is static. `C-256`

### §3 Feasibility across the four information types (≈700 words; `OBJ-202-2`)

Use the Best Practices deck's framing: *what can be fetched* (feasibility and scope) and *how it can be fetched* (complexity and reliability). (S-44)

| Type | Questions (deck) | Gate |
|---|---|---|
| Content | What records exist? How do they relate hierarchically (reply → message → channel → workspace)? | Required |
| Identity | Who accesses the app? Are identities represented as ID or email? If ID, how does it resolve to the corporate email? | Required for permission-aware results |
| Permissions | Who has access at app level? Record level? Field level? | Required unless org-wide visibility is explicitly accepted |
| Activity | Created, modified, accessed, interacted, searched? | Strongly desirable for ranking |

**Extraction method ranking (deck):** API → ideal; database read → complex; scraping → unreliable. (S-44)

**Cost of each gap** (teach as a consequence table the customer must sign): no identity → manual user map; metadata only → no Assistant grounding; no permissions → org-wide, app-level, or named-set default visibility; no activity → weaker ranking, likely outranked. `C-240` `C-241` `C-136`

### §4 Sizing and capacity math (≈700 words; `OBJ-202-3`)

Teach a repeatable estimate. Use Northbeam Beacon numbers (case packet §3).

1. **Calls for a full crawl.** 38,400 pages ÷ 100 per list call = 384 list calls. If read groups require a detail call per page, add 38,400 → ≈38,800 calls.
2. **Source quota and headroom.** Beacon allows 300 requests/minute (5/s). Run below quota to leave room for retries; the SDK's example runs at 7–8 requests per second against a 10/s limit. `C-193` At 3.5–4/s, a full crawl takes ≈2.7–3.1 hours.
3. **Incremental load.** ≈600 updates/day → a few hundred calls per day; hourly incremental runs are small.
4. **Glean-side limits.** `/indexdocument` is limited to 10 requests/second and `/indexdocuments` to 600 documents/minute; the deployment has overall limits of 8,000 requests/minute across IPs and 100 requests/second from one IP. `C-137` `C-138` `C-139` Bulk-upload-specific limits: confirm with the SME before quoting a number.
5. **Size risks.** Items over 64 MB: metadata and permissions only. Indexable text over 16.875 MB is truncated. Spreadsheets: about 250,000 characters. `C-090` `C-091` `C-092` The Content Package directs custom connectors to follow the same limits. `C-093` Beacon's 91 MB scanned PDF needs a decision (split, OCR externally and push text, or metadata-only).
6. **Unsupported content types.** JSON and XML are not supported MIME types for content; convert to text or HTML. `C-094`

**Output:** a one-page capacity estimate with assumptions and the test that will confirm each.

### §5 Identity strategy (≈600 words; `OBJ-202-4`)

- `isUserReferencedByEmail = true` lets ACLs reference users by email; use it when source and Glean share an identity provider. Otherwise references use datasource user IDs, and a user record must map each ID. `C-118`
- Beacon exposes numeric IDs **and** an email per user. Decide: reference by email (simpler), after verifying emails match Okta.
- **Unmatched identities** (3% legacy contractors): they cannot be matched to a Glean user. Record the decision — typically, they get no Glean access to Beacon content, and the customer confirms that is acceptable.
- **Roles as groups.** Model Beacon roles as groups. `C-235`
- **Admin bypass.** Beacon admins read everything. Do not mirror a bypass as an allow-all; grant only what groups grant. (Security design decision; BLD-201 formalizes it.)

### §6 Hosting choice (≈400 words; `OBJ-202-5`)

Glean places no constraints on where a custom connector runs. `C-044` Two documented models: Glean-hosted (Docker image configured in the Glean deployment; Glean manages secrets, scheduling, runtime) and self-hosted in GCP or AWS (same container in the customer's account; customer manages secrets, scheduling, and networking to Glean indexing endpoints). Choose self-hosted when data residency, network isolation, or internal policy requires it. `C-046` `C-047` The Competency lists GCP, AWS, Azure, or on-prem as agreed with the customer. (S-47)

Northbeam: self-hosted in GCP is mandated (no data leaves the VPC except to Glean).

**Open item** `U4`: confirm partner access to Glean-hosted custom connector deployment before offering it.

### §7 Risk register and go/no-go (≈500 words; `OBJ-202-6`)

Minimum risk categories: solution fit; data access and licensing; identity match; permission fidelity (record/field level, bypasses); freshness vs quota; size and format; network and AppSec lead time; sandbox fidelity; ownership and maintenance; API stability (`C-256`); program evidence (production customer required for the competency — ACC-107).

Decision options: **Go**, **Go with conditions** (each condition has an owner and date), **No-go** (with the alternative from CON-101 §6).

### §8 Project plan (≈300 words)

Use the Content Package project timeline phases: use-case requirements; technical scoping and feasibility; commercials and SOW; implementation plan; (if new customer) environment and Glean configuration; connector and indexing pipeline development; QA/testing; release to an internal test group; launch. (S-46) The partner-led process adds a 2–4 week customer review in the customer environment before broad deployment. `C-278`

---

## Discovery simulation (the core practice)

A branching, transcript-based call with four Northbeam stakeholders. The learner chooses the next question from three options at 10 decision points. Hidden facts are revealed only by good questions:
- The 3% contractor emails (revealed by asking C19 — SSO match).
- The admin bypass (revealed by asking about field/record-level and admin access).
- The 91 MB scanned PDF (revealed by asking E3 min/max).
- The empty-200 fault (revealed only by asking for known API issues or by requesting sandbox access early).
- AppSec's 3-week lead time (revealed by asking C15).

Scoring: coverage of hidden facts; sequencing (identity and permissions before UI); no promises made on the call (e.g., "it will be live in a week").

## Worked example

A completed Beacon intake (all sections), capacity estimate (§4), identity decision (§5), and the resulting "Go with conditions" memo: conditions = AppSec approval; sandbox refresh; contractor-identity decision signed; 91 MB PDF approach agreed; activity not available → ranking risk accepted.

## Transfer task

Scope **RefDesk** (no API; nightly export + JSON ACL sidecar). Learner completes sections C, E, F with the no-API path, estimates capacity from export size, and writes a go/no-go.

## Assessment (10 items + scored artifact)

**Artifact rubric (pass = 80% and all gates):** intake completeness (20%); feasibility by information type (20%); capacity estimate with assumptions (15%); identity decision including unmatched users (15%, **gate**); hosting justification (10%); risk register with owners (15%); go/no-go clarity (5%).

**Items (sample):**
1. First questionnaire question to ask about a new source → existing native connector or web-crawler option (`C-250`).
2. Source identifies users only by numeric ID → set `isUserReferencedByEmail` false or map IDs to email, and push user records (`C-118`).
3. A 70 MB PDF is in scope → metadata and permissions only unless split/extracted (`C-090` `C-093`).
4. The customer wants Assistant summaries but only metadata is exportable → not possible; results are metadata-only (`C-241`).
5. Why choose hosting before build → it determines secrets, scheduling, networking (`C-045`).
6. Preferred credential type → read-only keys (`C-251`).
7. Beacon quota 300/min; plan run rate → below quota with headroom (`C-193`).
8. Permission changes daily; content weekly → permission freshness must be designed separately (`C-257`).
9. JSON records as content → convert; JSON is not a supported content MIME type (`C-094`).
10. No activity data → accept ranking risk explicitly (`C-136`).

## Job aid

"Scoping one-pager": the four information types gate, the capacity formula, the identity decision table, and the risk categories.

## Claims used

`C-044` `C-045` `C-046` `C-047` `C-090` `C-091` `C-092` `C-093` `C-094` `C-118` `C-136` `C-137` `C-138` `C-139` `C-193` `C-235` `C-240` `C-241` `C-250` `C-251` `C-252` `C-253` `C-254` `C-255` `C-256` `C-257` `C-260` `C-278` · Sources without claim-level excerpts in this module: `S-44` (feasibility framing), `S-45` (questionnaire structure), `S-46` (project timeline), `S-47` (hosting list) — add claim IDs during authoring.
