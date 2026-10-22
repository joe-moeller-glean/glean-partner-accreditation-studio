# ACC-107 — Custom Connector Competency Capstone

| Field | Value |
|---|---|
| Level · path | 300 · capstone for `accred-custom-connectors` |
| Time | 1.5 h preparation briefing + 2.0 h unseen case + 1.5 h review meeting (plus the learner's real project work) |
| Prerequisites | All required modules |
| Delivery | SCORM module for briefing, self-check, and submission packaging; scoring by two Glean reviewers outside the package |
| Result | **Learning accreditation** on pass. Produces a submission package that is **ready** for the official Glean Custom Connector Competency audit. It does not award the official competency. `C-267` |

## Two different things — say this on the first screen

| | Learning accreditation (`accred-custom-connectors`) | Official Custom Connector Competency |
|---|---|---|
| Awarded to | Individual learner | Partner organization |
| Evidence | Modules, labs, capstone | 5 technical accreditations; Glean-delivered workshop; production connector; planning documents; architecture review; intake form; customer confirmation `C-264` `C-269` `C-261` |
| Reviewer | Course assessors | Glean Partner Manager and Partner Solutions Engineer (S-47) |
| Renewal | Course versioning | Every 18 months; renewal needs a current connector, architecture diagram, and customer feedback within 3 months prior `C-266` `C-270` |

## Capstone components

### A. Portfolio (from the learner's real or lab connector)

Map one-to-one to the official workbook so nothing is produced twice. (S-48)

| Workbook ID | Requirement | Course source |
|---|---|---|
| 3A | Requirements document with use cases and outcomes | CON-202 intake + test questions |
| 3B | Architecture diagram | BLD-201 ADR + `DGM-CC-201-A` adapted |
| 3C | Technical specification | BLD-201 ADR + CON-203 data model `C-271` |
| 3D | Test or success plan (with results) | BLD-202 evidence stages 3–13 |
| 3E | Customer-approved maintenance plan | CON-301 §8 `C-265` |
| 5 | Custom connector intake form | Intake Form v2 (listing fields + documentation page) `C-272` |
| 6 | Customer confirmation or feedback; recorded walkthrough if possible | Customer letter/SOW/email (S-47) |
| — | Build minimum: Indexing API or SDK; users, permissions, documents; automated updates; error and retry/backoff | BLD-202 gates `C-261` `C-262` `C-263` |

### B. Unseen case (2 h, individual)

A second source the learner has not built (CourseForge **or** RefDesk, assigned at random). Deliver in two hours: fit decision (CON-101 Q1–Q5), feasibility by information type, capacity estimate, identity strategy, ACL mapping for three given records, freshness/deletion per object family, completeness guard, and a risk register. Evaluated against the BLD-201 ADR rubric.

### C. Review meeting (90 min, two reviewers)

1. Walkthrough: learner runs the connector (or shows a recorded run with logs). (Field practice accepts a recorded demo when source authentication blocks a live demo.) `S-54`
2. Reviewer probes (script below).
3. Findings with priority Required / High / Medium / Low; categories rated Meets / Partially Meets / Does Not Meet / Not Enough Evidence (internal reviewer scale `C-295`).

## Scoring

| Category (reviewer rubric, `S-52`) | Weight | Hard gate |
|---|---:|---|
| Solution fit | 5% | — |
| Datasource configuration and schema | 5% | — |
| Document indexing and content mapping (stable IDs, metadata, viewURL) | 10% | — |
| User/identity handling | 10% | **Yes** |
| Group and membership handling | 5% | — |
| Permissions model and permissions refresh | 15% | **Yes** |
| Bulk indexing strategy (replacement risk) | 5% | — |
| Incremental refresh strategy (checkpoint) | 5% | — |
| Deletion handling (every object family) | 10% | **Yes** |
| Retry, backoff, reliability, completeness guard | 10% | **Yes** |
| Security and secrets | 5% | **Yes** |
| Hosting and operational readiness | 5% | — |
| Observability and debugging | 3% | — |
| Testing and validation (negative access) | 4% | — |
| Documentation and handoff | 2% | — |
| Packet completeness | 1% | — |

Pass: ≥80% aggregate **and** every gate rated Meets. Two reviewers score independently; differences >10 points go to a third reviewer. Calibrate on the first 10 submissions.

Rules the reviewers apply (from the review skill): strong document indexing does not compensate for missing identity, group, or permission coverage `C-290`; bulk indexing is a replacement strategy, not a default `C-291`; IDs derive from immutable source identifiers `C-292`; each object family needs a deletion story `C-293`; permission-only changes must be detectable `C-294`; over-broad permissions are not accepted because mapping is hard `C-297`.

## Reviewer probe script (sample)

1. "Show me what happens if page 37 of 384 returns an empty list with no cursor." (completeness)
2. "Remove `nurse.lead@` from `clinical-staff` in the source. When and how does Glean reflect it?" (membership refresh)
3. "Change only the read groups on a page. Which code path pushes that?" (permission-only)
4. "Rename a page. How many documents exist afterward?" (stable IDs)
5. "Where is the Beacon token stored, and who rotates it on day 90?" (secrets)
6. "Your nightly run deleted 25% of documents on purpose. What will users see tomorrow, and what do you do?" (`C-107`)
7. "The Job shows Completed. How do you know documents were indexed?" (`C-214`)
8. "What does your connector do with a user whose email is not in the IdP?" (identity)

## Program prerequisites (internal process — calibration only)

The partner-led process expects technical accreditation, a technical deep dive, and the custom connector workshop, or a functioning custom connector in the partner's own Glean environment; Glean performs code review on partner-developed connectors (internal process `C-276` `C-277`). Confirm current policy with the program owner before stating it to partners.

## Known failure patterns (anonymized field evidence for reviewer calibration only)

Stable IDs and content model; secrets management; JSON-file state; anonymous-access references; missing maintenance plan; no production-style deployment and no real production customer. Field evidence: `C-298` `C-299` `C-300` `C-301` `C-302`

## Self-review kit (proposal, OD-7)

Offer partners the same rubric as a self-check before submission, and optionally the automated code-review skill, so review meetings focus on judgment rather than basic defects (field review notes record this request). `S-53`

## Submission (official competency, after the learning accreditation)

Email the Partner Manager and Partner Solutions Engineer with organization name, the competency sought, and a zip containing the completed workbook and all documentation. `C-268`

## Claims used

`C-107` `C-214` `C-261` `C-262` `C-263` `C-264` `C-265` `C-266` `C-267` `C-268` `C-269` `C-270` `C-271` `C-272` · internal process (calibration only): `C-276` `C-277` · reviewer/field: `C-290` `C-291` `C-292` `C-293` `C-294` `C-295` `C-297` `C-298` `C-299` `C-300` `C-301` `C-302`
