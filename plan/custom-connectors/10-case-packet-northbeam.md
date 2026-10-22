# Case packet — Northbeam Health Partners (fictional)

**Purpose:** one continuous, realistic case used by every module in the Custom Connector path. Each module adds one constraint. All names, systems, numbers, and people are **fictional**. Product behavior in the case must still match `claims.json`; the case invents only the customer's environment.

**Why one case:** experts learn by watching the same system change under new constraints. The learner meets Northbeam in CON-101, scopes it in CON-202, designs it in BLD-201, builds against it in CON-203/CON-204/BLD-202, operates it in CON-301, and defends it in ACC-107.

---

## 1. Organization profile

| Field | Value |
|---|---|
| Organization | Northbeam Health Partners — regional healthcare services group, 9,200 employees, 41 clinics |
| Glean status | Live for 14 months. SSO through Okta. People data from HRIS. |
| Native connectors live | Google Drive, Slack, Jira, Confluence, ServiceNow |
| Partner firm (learner's role) | "Tidewater Digital", a Glean services partner. The learner is the connector lead. |
| Business sponsor | VP Clinical Operations |
| Customer technical owners | Glean admin (IT Platforms); Beacon system owner (Clinical Informatics); Security architect (AppSec) |
| Business goal | Clinic staff spend too long finding current policy and runbook steps. Target: answer policy questions in Glean Assistant with citations, and search runbooks by clinic and procedure. |

## 2. System inventory (the learner must classify each one in CON-101)

| System | What it holds | Owner | Facts the learner is given | Correct classification (answer key — not shown to learner) |
|---|---|---|---|---|
| **Beacon** | In-house clinical policy and runbook wiki. 38,400 pages; 1,900 attachments. | Clinical Informatics | Built in-house on PostgreSQL with a REST API. No native connector exists. Pages have per-page read groups. Users ask policy questions and need citations. | **Custom indexed connector.** Proprietary, no native connector, search + Assistant grounding need, ACLs available through API. `C-040` `C-021` |
| **Google Drive** | Shared drives | IT | Native connector already live. A team asks for "a custom Drive connector" because they want a "Clinic ID" facet. | **Do not build a custom connector.** Use the native connector. Add the facet with Custom Metadata on native documents. `C-035` `C-100` |
| **ClaimsLake** | 410 million claim rows in a Snowflake warehouse | Finance Data | Analysts want to ask "what was denial rate in Q2 by payer?" | **Do not index.** Large structured data lake: query live through an action or MCP server. `C-033` |
| **FacilityPulse** | HVAC and freezer temperature telemetry every 10 seconds | Facilities | Ops wants "is freezer 12 out of range now?" | **Do not index raw telemetry.** Time-series/sensor data. Query live or index a generated daily report. `C-034` |
| **BedBoard** | Live bed availability | Operations | Changes every few minutes; nurses want current numbers and to place a hold. | **Live tool / MCP (read + write action).** Freshness dominates and a write is required. `C-022` `C-011` |
| **CourseForge** | Vendor SaaS LMS (fictional) | L&D | No native connector. Vendor API with offset pagination; 12,000 courses; enrollment-based visibility. | **Custom indexed connector, second priority.** Flag offset-pagination risk. `C-190` |
| **RefDesk** | Legacy reference desk HTML pages | Library Services | No API. Nightly export to a storage bucket as HTML plus a JSON sidecar that lists read groups per file. | **Custom indexed connector from export files.** The questionnaire's no-API path. `C-253` |

## 3. Beacon — the primary build source

### 3.1 Content model

| Beacon object | Count | Fields | Notes |
|---|---|---|---|
| `Page` | 38,400 | `page_id` (int, immutable), `slug` (mutable), `title`, `body_html`, `space_key`, `clinic_codes[]`, `procedure_code`, `status` (`draft`/`published`/`archived`), `owner_user_id`, `created_at` (ISO 8601), `updated_at` (ISO 8601), `read_groups[]` | Only `published` pages are in scope. Slug changes when a page is renamed. |
| `Attachment` | 1,900 | `attachment_id`, `page_id`, `filename`, `mime_type`, `size_bytes` | Median 180 KB PDF. Largest is a 91 MB scanned PDF. |
| `Comment` | 210,000 | `comment_id`, `page_id`, `author_user_id`, `body` | Low search value. Out of scope for phase 1 (a scoping decision the learner must justify). |

### 3.2 Identity and permission model

- Beacon has its own numeric user IDs (`user_id`). The `/users` endpoint returns `user_id`, `email`, `active`.
- 97% of Beacon users have an `@northbeam.example` email that matches Okta. 3% are legacy contractor accounts with personal emails that do **not** exist in Okta.
- Beacon groups: `clinical-staff`, `pharmacists`, `nurse-leads`, `contractors`, `clinic-<code>` (41 groups), `beacon-admins`.
- Roles: Beacon has a "role" concept (`Pharmacist`, `Charge Nurse`) that grants read on some spaces. Roles behave like groups. `C-235`
- Nested groups: `nurse-leads` is a member of `clinical-staff`.
- Page visibility rule in Beacon: a user can read a published page if they are in **any** of `read_groups[]`. Some controlled-substance pages require membership in **both** `pharmacists` **and** `clinic-<code>`. `C-198`
- Beacon admins can read everything in Beacon. **Security decision given to the learner:** admins must *not* gain access in Glean through that bypass unless a group grants it.

### 3.3 API behaviour (published to the learner)

| Endpoint | Behaviour |
|---|---|
| `GET /api/v2/pages?status=published&cursor=<c>&limit=100&updated_since=<iso>` | Cursor pagination. Response `{ "items": [...], "next_cursor": "..." }`. `updated_since` is supported on pages only, minute precision. |
| `GET /api/v2/pages/{page_id}` | Full page with `read_groups[]`. |
| `GET /api/v2/users?cursor=` | Users with `user_id`, `email`, `active`. |
| `GET /api/v2/groups` and `GET /api/v2/groups/{name}/members` | Groups and members; members can be users or groups. |
| `GET /api/v2/deleted?since=<iso>` | Tombstones for deleted or unpublished pages in the last 30 days. |
| `GET /api/v2/attachments/{id}/content` | Binary content. |
| Rate limit | 300 requests/minute per token. Returns `429` with `Retry-After`. |
| Known fault | Under load, about 1 in 400 page-list calls returns `200` with `{"items": []}` and no `next_cursor` **before** the true end of the list. |
| Auth | Service account bearer token, read-only scope available. Tokens rotate every 90 days. |
| Environments | Sandbox with 2,000 pages, refreshed from production 11 months ago. |

### 3.4 Non-functional constraints

- Hosting: must run in Northbeam's GCP project. No data may leave the customer VPC except to Glean indexing endpoints. `C-046` `C-047`
- Secrets: must live in Secret Manager. AppSec review takes 3 weeks.
- Freshness requirement: published policy changes visible in Glean within 1 hour; permission removals within 1 hour; new pages within 1 hour.
- Change rate: about 600 page updates/day; 40 deletes/unpublishes/day; about 25 group-membership changes/day.
- Success measures (sponsor): 80% of a 50-question policy test set answered with a correct Beacon citation by Assistant; zero unauthorized-exposure findings in UAT.

## 4. Module-by-module constraint additions

| Module | New constraint or event | What the learner must produce |
|---|---|---|
| CON-101 | The inventory table above, without the answer column. | Classification of all seven systems with a reason and a rejected alternative. |
| CON-201 | A clinic manager says: "Beacon pages we published this morning are not in Glean, but the upload returned 200." | Trace the page through every stage; name the check for each. |
| CON-202 | Discovery call transcript (in module) reveals the 3% contractor emails, the 91 MB PDF, and the admin bypass. | Completed intake + risk register + go/no-go. |
| TEC-201 | AppSec asks: which token, which scope, which IPs, who rotates. | Signed readiness checklist. |
| BLD-201 | The empty-200 fault and the minute-precision `updated_since`. | Architecture decision record and failure-mode matrix. |
| CON-203 | API-only exercise before the SDK. | Request collection proving index, update, delete, users, groups, memberships, ACL checks. |
| CON-204 | Build with the SDK against the Beacon fixture. | Connector repo passing mock and integration phases. |
| BLD-202 | Full lab, fault injection enabled. | Working connector with negative-access and deletion evidence. |
| CON-301 | Day-45 incident: "3,100 Beacon pages vanished last night, then 2 days later nothing is deleted anymore." | Incident analysis, runbook, maintenance plan. |
| ACC-107 | Unseen second source (CourseForge or RefDesk) + Beacon portfolio. | Competency submission package and defense. |

## 5. Beacon lab fixture — build specification (for the studio engineer)

The lab needs a safe, deterministic fixture. It must **not** call any real customer system.

- **Form:** a small local HTTP service (container) that implements §3.3 exactly, with seeded data: 400 published pages, 30 drafts, 20 archived, 12 attachments (one at 70 MB to exercise the 64 MB rule), 60 users (2 without matching corporate email), 12 groups (one nested, one intersection case), 15 tombstones.
- **Fault switches (environment variables):**
  - `FAULT_EMPTY_200_RATE` (default `0`; lab sets `0.02`) — returns an empty page with no cursor before the end.
  - `FAULT_429_EVERY_N` (default `0`; lab sets `25`) — returns `429` with `Retry-After: 2`.
  - `FAULT_REPEAT_CURSOR` (default `false`) — returns the same cursor forever from page 3.
  - `FAULT_ISO_TIMESTAMPS` (always on) — timestamps are ISO strings; the learner must convert to epoch seconds. `C-153`
  - `MUTATE_ON_START` — applies a scripted change set: 5 updates, 3 deletes, 1 slug rename, 1 group membership removal, 1 permission-only change on a page whose body does not change (reviewer rubric criterion `C-294`, internal).
- **Glean side:** each learner gets a disposable **test datasource** (`isTestDatasource: true`) with themselves and two persona accounts (`allowed.nurse@`, `denied.contractor@`) added through `/betausers`. `C-123` `C-124`
- **Answer key and scoring scripts** stay in the repository `assessment/` folder and never enter a SCORM package.

## 6. Persona accounts for permission tests

| Persona | Beacon groups | Must see | Must not see |
|---|---|---|---|
| `allowed.nurse@northbeam.example` | `clinical-staff`, `clinic-014` | General policy pages; clinic 014 runbooks | Controlled-substance pages; other clinics' restricted runbooks |
| `pharmacist.014@northbeam.example` | `pharmacists`, `clinic-014` | Controlled-substance pages for clinic 014 | Controlled-substance pages for clinic 022 |
| `nurse.lead@northbeam.example` | `nurse-leads` (nested in `clinical-staff`) | Everything `clinical-staff` sees | Pharmacist-only pages |
| `denied.contractor@northbeam.example` | `contractors` | Contractor onboarding pages | Every clinical page |
| `beacon.admin@northbeam.example` | `beacon-admins` | Only pages granted to `beacon-admins` by group | Pages visible in Beacon only through the admin bypass |
| `legacy.contractor@gmail.example` | `contractors` | — (no Okta identity) | Everything; the learner must document how this account is handled |
