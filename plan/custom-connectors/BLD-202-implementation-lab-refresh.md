# BLD-202 — Custom Connector Implementation Lab (refresh, v2 contract)

| Field | Value |
|---|---|
| Level · path | 300 (tracker: 200) · Builder Advanced + Custom Connector Competency |
| Tracker state | Planned · SME unassigned (propose Indexing SDK engineering owner) |
| Time | 4.0 h lab + 1.0 h assessor review (tracker 2.5 h; approval needed, OD-3) |
| Prerequisites | BLD-201, CON-203, CON-204, TEC-201 |
| Delivery | SCORM shell for briefing, checkpoints, and submission guide; the lab runs in a real repository and the learner's disposable test datasource. Scoring is assessor-based, outside the package. |
| Owns | Production-grade end-to-end build under faults, with evidence |
| Difference from CON-204 lab | CON-204 proves *SDK usage*. BLD-202 proves *production behavior*: full + incremental + deletes + permission-only changes + faults + reconciliation + handoff. |

## Learner question

"Can I deliver a connector whose correctness I can **prove** — for content, identity, permissions, freshness, deletion, and failure — to a customer and to a Glean reviewer?"

## Outcomes

- `OBJ-B202-1` Deliver a connector that indexes documents, users, groups, memberships, and permissions with automated updates and retry/backoff (competency build minimum). `C-261` `C-262` `C-263`
- `OBJ-B202-2` Prove allowed/denied visibility for every persona, including nested, intersection, admin, and unmatched identities.
- `OBJ-B202-3` Prove update, delete, rename, and permission-only change propagation.
- `OBJ-B202-4` Prove the connector refuses to complete a partial full crawl and recovers from throttling and token expiry.
- `OBJ-B202-5` Produce a reconciliation report and a handoff package.

## Lab environment

- Beacon fixture with all fault switches (case packet §5): `FAULT_EMPTY_200_RATE=0.02`, `FAULT_429_EVERY_N=25`, `FAULT_ISO_TIMESTAMPS`, `MUTATE_ON_START`; a scripted token-expiry event at minute 20 of the first full run.
- Disposable **test datasource** with self + six persona accounts as beta users. `C-123` `C-124`
- SDK path is default; a raw-API variant is allowed for advanced learners (must meet the same gates).

## Stages (each stage has an evidence file in `evidence/`)

| # | Stage | Required evidence | Rule tested |
|---|---|---|---|
| 1 | Confirm intake, ADR, readiness gate | Links to CON-202, BLD-201, TEC-201 artifacts | Scope before code |
| 2 | Configure datasource from code; read back | `datasource configure` output | `C-209` |
| 3 | First-run check: one public doc, one permissioned doc | Search screenshots as two personas | `C-049` |
| 4 | Identity push: users, groups (incl. nested), memberships | Status identity counts; debug user for `nurse.lead@` | `C-111` `C-114` `C-115` |
| 5 | Full run with faults on | Run log shows 429 retries and a raised completeness error on empty-200 (no upload); second attempt completes | `C-170` `C-194` |
| 6 | Token expiry mid-run | Run fails non-zero; no partial replacement finalized; rerun succeeds | `C-165` `C-170` |
| 7 | Verify indexed and visible | `document status` indexed; `document access` matrix for 6 personas × 6 pages | `C-199` `C-200` |
| 8 | Incremental run after mutations | 5 updates visible; slug rename did **not** duplicate; checkpoint written only on success | `C-173`; internal reviewer rule `C-292`* |
| 9 | Deletes | Tombstones deleted explicitly; nightly full run reconciles anything missed; explain the 20% safeguard with numbers | `C-101` `C-107` |
| 10 | Permission-only change | Page body unchanged, ACL changed; access flips after processing | `C-116` `C-257` |
| 11 | Group membership removal | Removed user loses access after membership processing | `C-116` |
| 12 | Reconciliation report | Source count vs uploaded vs indexed per object type; explanation of any gap | `C-202` |
| 13 | Observability | Metrics summary; alert rule for sharp `documents_indexed` drop | `C-204` `C-218` |
| 14 | Handoff package | Runbook, maintenance plan draft, architecture diagram, test plan results | `C-265` |
| 15 | Clean-up | Disposable datasource torn down or retained with a reason; secrets revoked | `C-207` |

\* `C-292` is a reviewer-rubric claim; learner copy states the rule without citing the internal source.

## Persona access matrix (expected results — answer key stays in `assessment/`)

Six personas (case packet §6) × six test pages (general policy; clinic-014 runbook; clinic-022 runbook; controlled-substance clinic-014; contractor onboarding; admin-bypass page). The learner fills the matrix from `document access` and search, then explains every *false*.

## Assessor rubric

| Area | Weight | Meets | Hard gate |
|---|---:|---|---|
| Completeness and correctness of indexing | 15% | All in-scope objects indexed with stable IDs, correct metadata | — |
| Identity and permissions | 25% | Matrix fully correct; no broad fallback ACL; unmatched identities documented | **Yes** |
| Freshness and deletion | 20% | Updates, deletes, rename, permission-only change all proven | **Yes** |
| Failure handling | 15% | Empty-200 raises; 429 paced + retried; token expiry non-zero exit without partial finalize | **Yes** |
| Reconciliation and observability | 10% | Counts reconciled; alert defined | — |
| Security | 10% | Secrets in environment/secret store; no secrets in repo or logs | **Yes** |
| Handoff | 5% | Runbook and maintenance plan usable by another engineer | — |

Pass: ≥80% and every gate met. Retake uses a different fault seed and a different persona set.

## Common failure patterns to brief (from field reviews; anonymized)

Stable-ID problems; hard-coded secrets; JSON-file state; anonymous-access references in code or docs; missing maintenance plan; no production-style deployment. These recur in real competency reviews. (Internal evidence `S-53`, `S-54`; brief without naming partners.)

## Claims used

`C-049` `C-101` `C-107` `C-111` `C-114` `C-115` `C-116` `C-123` `C-124` `C-165` `C-170` `C-173` `C-194` `C-199` `C-200` `C-202` `C-204` `C-207` `C-209` `C-218` `C-257` `C-261` `C-262` `C-263` `C-265` · reviewer: `C-292`
