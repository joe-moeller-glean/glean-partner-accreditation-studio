# BLD-202 assessment rubric

Mastery score: 80%. Items are single-select with explanatory feedback on every option.

## Objective coverage

| Objective | Items |
|---|---|
| `OBJ-01` Deliver a connector that indexes users, permissions, and documents, updates automatically, and retries with backoff. | Q-01 |
| `OBJ-02` Prove allowed and denied visibility for every persona. | Q-04 |
| `OBJ-03` Prove update, delete, rename, and permission-only change propagation. | Q-03, Q-05, Q-06 |
| `OBJ-04` Prove the connector refuses to finish a partial full crawl and recovers from throttling and token expiry. | Q-02, Q-07, Q-08 |
| `OBJ-05` Produce a reconciliation report and a handoff package someone else can maintain. | Q-09, Q-10 |

## Item-writing rules applied

- Every item tests a claim-backed fact or a decision derived from one, never wording recall.
- Distractors are plausible partner mistakes drawn from the source material, not absurd options.
- Feedback explains why an option is wrong, not merely that it is wrong.
- Answer keys live in `key.json` and are never present in `items.json`.

## Calibration

Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.
