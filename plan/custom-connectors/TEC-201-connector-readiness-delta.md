# TEC-201 — Connector Deployment Prerequisites: custom-connector delta

**Relationship:** TEC-201 is an existing roadmap module (Planned; `needs_sme`). Its general build contract is in `plan/depth-overhaul-2026-09-26/02-technical-builders.md`. This file adds the **custom-connector-specific** readiness content the accreditation requires. Do not duplicate native-connector readiness here.

| Field | Value |
|---|---|
| Time added by this delta | 30 min learning · 20 min practice |
| Prerequisites | CON-202 |
| Artifact | Signed custom-connector readiness gate (one per environment) |

## Learner question

"What must exist, be approved, and be tested **before** the first document is pushed?"

## Outcomes

- `OBJ-T201-1` Prepare a datasource, token, and visibility plan that isolates testing from production users.
- `OBJ-T201-2` Specify token scope, expiry, IP restriction, rotation, and ownership.
- `OBJ-T201-3` Prove network, identity, and persona readiness before build.
- `OBJ-T201-4` Sign a readiness gate with named owners and blocking items.

## Teaching content

### §1 Datasource and visibility (≈500 words)
- Create the connector in the admin console or with `/adddatasource`; set name, display name, category, URL regex, and the identity reference mode. `C-118` `C-119` `C-121`
- Decide the permissions model at setup: permission-aware (per-user ACLs pushed with each document) or visible to everyone. `C-048`
- Use a **test datasource** for development: ranking signals are off and it is visible only to selected users through `/betausers`; beta users still need document permissions. `C-123` `C-124`
- The datasource must be enabled for search (test group or all) before any document appears. `C-103`
- First-run rule: one public sample document, then one permissioned document, then scale. `C-049`

### §2 Indexing token (≈500 words)
- Glean-issued tokens only; no OAuth. `C-052`
- Expiry is required; value shown once; store it immediately in the secret manager. `C-054` `C-055`
- Scope: datasource-specific ("app permissions") where possible; only Super Admins can grant global scope. `C-056` `C-060`
- Optional IP allow-list (CIDR) and rotation period (minimum 1440 minutes). `C-053` `C-059`
- Separate tokens per environment. `C-057`
- Activity push needs a **separate Client API** token (global, scoped to ACTIVITY). Plan it now if activity is in scope. `C-133` `C-134`

### §3 Source access, network, runtime (≈400 words)
- Source credential: read-only preferred; owner and rotation date recorded. `C-251`
- Self-hosted networking must allow pushes to Glean indexing endpoints. `C-046`
- Runtime and scheduler selected (Kubernetes CronJob, Cloud Run/Lambda job, VM cron, Airflow, CI). `C-217`
- For the SDK deployment path: existing cluster, registry, namespace, and identity foundation owned by the platform team; generated Terraform does not create them. `C-211`

### §4 Identity and personas (≈300 words)
- Email alignment sample verified (≥50 users) against the IdP.
- Persona accounts prepared: allowed, denied, nested-group, intersection, admin, unmatched (case packet §6).

## Readiness gate (artifact)

| Area | Check | Evidence | Owner | Blocking? |
|---|---|---|---|---|
| Datasource | Test datasource created; beta users set | Config readback | Glean admin | Yes |
| Token | Datasource-scoped; expiry set; IP list; stored in secret manager | Token record (no value) | Glean admin | Yes |
| Activity token | Required? If yes, created and stored | Token record | Glean admin | If in scope |
| Source credential | Read-only; rotation date | Access review | Source owner | Yes |
| Network | Egress to Glean backend proven | Test request log | Platform | Yes |
| Identity | Email match sample; unmatched list decided | Sample report | IdP owner | Yes |
| Personas | Six personas exist in source and IdP | Account list | Source owner | Yes |
| Runtime | Scheduler, registry, namespace ready | Platform ticket | Platform | Yes |
| Observability | Log sink and alert destination | Screenshot/config | Platform | No (before prod: Yes) |
| AppSec | Review requested; date | Ticket | Security | Before prod |

## Practice

Review a flawed preflight: global token with no expiry note, no IP list, production datasource used for dev, no personas, "we'll use the admin account to test." Learner marks every defect with its claim and fixes the gate.

## Assessment (6 items)

Token OAuth support (`C-052`); who can grant global scope (`C-056`); why a test datasource (`C-123`); beta users and permissions (`C-124`); activity token type (`C-133`); rotation minimum (`C-053`).

## Claims used

`C-046` `C-048` `C-049` `C-052` `C-053` `C-054` `C-055` `C-056` `C-057` `C-059` `C-060` `C-103` `C-118` `C-119` `C-121` `C-123` `C-124` `C-133` `C-134` `C-211` `C-217` `C-251`
