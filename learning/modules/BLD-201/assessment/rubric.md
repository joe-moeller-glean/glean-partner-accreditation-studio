# BLD-201 assessment rubric

Mastery score: 80%. Items are single-select with explanatory feedback on every option.

## Objective coverage

| Objective | Items |
|---|---|
| `OBJ-01` Apply the custom connector reference architecture. | Q-11 |
| `OBJ-02` Design stable IDs and a content model that survives renames and relations. | Q-01 |
| `OBJ-03` Map source identities and permissions without broad fallbacks. | Q-02, Q-03 |
| `OBJ-04` Design completeness guards that stop a partial full crawl from finishing. | Q-04 |
| `OBJ-05` Choose a freshness and deletion strategy for every object family. | Q-05, Q-06 |
| `OBJ-06` Design reliability, state, security, and monitoring for production. | Q-07, Q-08, Q-09, Q-10 |

## Item-writing rules applied

- Every item tests a claim-backed fact or a decision derived from one, never wording recall.
- Distractors are plausible partner mistakes drawn from the source material, not absurd options.
- Feedback explains why an option is wrong, not merely that it is wrong.
- Answer keys live in `key.json` and are never present in `items.json`.

## Calibration

Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.
