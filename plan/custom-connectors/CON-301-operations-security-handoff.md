# CON-301 — Production Operations, Security, Migration, and Handoff

| Field | Value |
|---|---|
| Level · path | 300 · Custom Connector Competency |
| Time | 75 min learning · 45 min incident simulation · 15 min assessment = **2.3 h** |
| Prerequisites | BLD-202 |
| Design system | `paged-v1`; incident simulation as a branching timeline |
| Owns | Hosting operations, deployment, secrets, monitoring, incident diagnosis, reprocessing, migration from native, support model, documentation and publishing, maintenance plan |
| Case | Northbeam day 45: "3,100 Beacon pages vanished overnight; two days later deletions stopped working." |
| Artifacts | Production runbook; maintenance and support plan (customer-approvable); incident report |

## Learner question

"After go-live, how do I keep this connector correct, secure, and supportable — and when something breaks at 2 a.m., how do I find the cause without making it worse?"

## Outcomes

- `OBJ-301-1` Operate a connector in Glean-hosted or self-hosted mode with correct scheduling, secrets, and networking.
- `OBJ-301-2` Deploy with the SDK scaffolding (or an equivalent scheduler) and verify a rollout by document status, not job status.
- `OBJ-301-3` Define monitoring and alerts that catch partial crawls, identity lag, and permission drift.
- `OBJ-301-4` Diagnose missing, stale, over-visible, and vanished documents, and choose the right reprocess call within its rate limit.
- `OBJ-301-5` Plan a native-to-custom migration without losing coverage or user artifacts.
- `OBJ-301-6` Write a customer-approvable maintenance and support plan and customer-facing connector documentation.

---

## Teaching sequence

### §1 Hosting operations (≈500 words; `OBJ-301-1`)

- **Glean-hosted:** Docker image configured in the Glean deployment; Glean manages secrets, scheduling, and runtime; crawls scheduled like a native connector. (S-04) `C-042`
- **Self-hosted (GCP/AWS):** same container in the customer account; customer manages secrets, scheduling, orchestration, and networking to Glean indexing endpoints. `C-046` `C-047`
- Any scheduler that can invoke the connector factory works (VM cron, Cloud Run/Lambda job, Airflow, CI). `C-217`

### §2 Deployment with SDK scaffolding (≈600 words; `OBJ-301-2`)

- A connector is a batch job; `glean-idx deploy` generates Docker + Terraform for a Kubernetes CronJob on GKE/EKS. `C-210`
- The platform team owns the project/account, cluster, registry, identity foundation, and namespace; generated Terraform does not create them. `C-211` Use a dedicated namespace where permitted. (S-30)
- Change `glean_deployment.yaml`, not generated Terraform. `C-212`
- Full and incremental schedules need separate deployment configurations (same immutable image). `C-213`
- Use an immutable image tag for controlled rollouts. (S-30)
- **Verification:** a completed Job proves only that the process exited; document status proves indexing. Wire a smoke test that indexes a known document and polls its status. `C-214` (S-28)
- **Teardown boundaries:** content teardown (empty full replacement) and infrastructure destroy are separate; there is no Indexing API operation to delete a datasource registration. `C-207` `C-216`

### §3 Security operations (≈600 words; `OBJ-301-1`)

- Indexing tokens: Glean-issued, expiry required, minimum rotation 1440 minutes, optional IP allow-list; separate tokens per environment. `C-052` `C-053` `C-054` `C-057` `C-059`
- Automate token rotation. `C-238`
- Secrets: generated workloads receive exact secret access and cannot enumerate secrets; never put values in YAML, images, or Terraform variables. `C-215` (S-30)
- Log redaction covers logs only; do not place secrets in exception messages. `C-187` `C-188`
- Least privilege on the source: read-only credentials. `C-251`
- Permission drift reviews: schedule an access-matrix re-test (BLD-202 matrix) quarterly and after any source permission-model change.

### §4 Monitoring and alerting (≈500 words; `OBJ-301-3`)

Alert on:
1. Non-zero exit or `indexing_errors` > 0. (S-31)
2. No successful run within the expected window. (S-31)
3. `documents_indexed` dropping sharply run-over-run — the partial-crawl signal. `C-204`
4. Uploaded vs indexed gap per object type (rejected documents). `C-202`
5. Identity counts: uploaded vs indexed users (processing stuck). `C-072`
6. Retry count rising — configured rate too high. (S-27)

Cloud telemetry plugins are tested only against mocks; validate them in staging before relying on them. `C-219`

### §5 Incident diagnosis (≈900 words; `OBJ-301-4`)

**Decision table.**

| Symptom | Most likely cause | First evidence | Action | Claim |
|---|---|---|---|---|
| Never appears | Never uploaded | Connector run: posted documents | Fix fetch/transform | `C-202` |
| Uploaded, not searchable | Processing not complete | Processing vs upload timestamps | Wait; if stuck, `/processalldocuments` (once per 3 h) | `C-070` `C-075` `C-079` |
| Visible to some, not others | ACL or identity graph | Access check; debug user/document | Push identities; `/processallmemberships` if stuck | `C-205` `C-076` |
| Users `UPLOAD COMPLETED`, low indexed | Processing incomplete or pagination flags wrong | Uploaded vs indexed users | Check flags; reprocess memberships | `C-072` `C-074` |
| Appears then disappears | Omitted from a later full crawl | Run logs, fetched counts | Fix completeness; rerun full | `C-203` |
| Deleted docs still visible | Stale-deletion safeguard paused deletion | Upload vs deletion percentage | If intended, rerun with the check disabled or delete explicitly | `C-107` |
| Body empty, title only | Content missing, wrong MIME, or size limits | Document debug | Fix content mapping | (S-28) `C-090` |
| Wrong dates/sort | ISO timestamps | Document fields | Epoch seconds | `C-153` |

**Northbeam day 45 (simulation).** Evidence reveals: the Beacon token expired at 01:14 during the nightly full run; the data client swallowed a 401 inside the paging loop and returned 35,300 of 38,400 pages; the run "succeeded". 3,100 pages (8%) were deleted as stale — under the 20% safeguard. Two days later, an engineer "fixed" the problem with a full run that still had a `max_items` cap left from local testing (S-28 names this cause): the replacement omitted about 90% of pages, so the safeguard paused that upload's stale-document deletion for 7 days (scope of the pause for later uploads: open item `U7`). Result: the 90% were protected, but pages genuinely deleted in Beacon and omitted from that upload — which this design removes only through full-run stale deletion — also stayed visible. Explicit deletes would still have worked (lesson: tombstone deletes should not depend on full runs). The learner must identify both failures, the missing alert, the code defect (swallowed error), the process defect (test flag in production), and the recovery order. `C-170` `C-107` `C-159` `C-204`

**Support ticket contents** when escalating: issue and error, endpoint and request body schema, connector name, timestamp and timezone. `C-078`

### §6 Migration from a native connector (≈500 words; `OBJ-301-5`)

- Native and custom connectors use separate namespaces; you cannot push into a built-in connector name. `C-080`
- Agents, saved searches, app filters, and pinned results scoped to the native connector do not carry over; migrate them. `C-081`
- Run both in parallel; populate the custom connector on a schedule (incremental plus full). `C-083`
- Deactivate native only after full population and artifact migration — deactivation removes its content. `C-082`
- Verify with multi-permission-level users, agents, and the debug status endpoint. (S-08)

### §7 Documentation and publishing (≈500 words; `OBJ-301-6`)

For partner-built connectors listed on the Connectors page, the Intake Form v2 gathers listing information and defines customer-facing documentation. `C-272` Required documentation sections: overview; supported objects; supported endpoints/features; limitations; requirements (technical, credential, permission, source setup); configuration and setup; permissions and security (data ingested, **permission propagation logic**, security notes, privacy). `C-275` Add crawling strategy per object type when full vs incremental differs. (S-49) Glean expects the partner to maintain and support a listed connector. `C-273` Request written confirmation that permissions and security meet expectations after a custom test group reviews results. `C-274`

### §8 Maintenance and support plan (≈500 words; `OBJ-301-6`)

A customer-approved maintenance plan is a competency requirement. `C-265` Minimum contents: owner and escalation path; support hours and response targets agreed with the customer; monitoring and alert ownership; token and credential rotation calendar; source API change monitoring; SDK/API upgrade cadence (review the developer changelog `S-41`); quarterly permission re-test; annual full reconciliation drill; data-retention and teardown procedure; change control. Shared push-connector code may have limited support from Glean; the plan must say who supports what. `C-009`

### §9 Glean-internal boundary (for Glean reviewers only)

Internal routing, effort estimates, and commercial constructs in the internal Connector Request Process deck (`S-51`) and the partner-led process (`S-50`) are **not** partner courseware. Glean reviewers may use them to calibrate expectations. Do not quote them in learner copy (OD-6).

---

## Assessment (10 items + two artifacts)

Artifacts: runbook (gated on the §5 decision table and a smoke test) and maintenance plan (gated on owner, rotation calendar, and permission re-test).

Items (sample): job completed but documents missing (`C-214`); two full schedules in one config (`C-213`); delete a datasource registration by API (`C-216`, cannot); reprocess twice in an hour (`C-079`); intended 30% cleanup not visible (`C-107`); migrate saved searches (`C-081`); deactivate native first (`C-082`, wrong); required doc section (`C-275`); who supports a listed partner connector (`C-273`); partial-crawl alert (`C-204`).

## Claims used

`C-009` `C-042` `C-046` `C-047` `C-052` `C-053` `C-054` `C-057` `C-059` `C-070` `C-072` `C-074` `C-075` `C-076` `C-078` `C-079` `C-080` `C-081` `C-082` `C-083` `C-090` `C-107` `C-153` `C-159` `C-170` `C-187` `C-188` `C-202` `C-203` `C-204` `C-205` `C-207` `C-210` `C-211` `C-212` `C-213` `C-214` `C-215` `C-216` `C-217` `C-219` `C-238` `C-251` `C-265` `C-272` `C-273` `C-274` `C-275`
