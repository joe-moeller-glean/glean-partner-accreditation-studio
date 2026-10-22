# TEC-201 assessment rubric

Mastery score: 80%. Items are single-select with explanatory feedback on every option.

## Objective coverage

| Objective | Items |
|---|---|
| `OBJ-01` Confirm the datasource is configured and visible to the right people before the first upload. | Q-06, Q-08 |
| `OBJ-02` Issue and handle an Indexing API token correctly: scope, expiry, rotation, restrictions, and storage. | Q-01, Q-02, Q-03, Q-04 |
| `OBJ-03` Confirm source access and network readiness with the owners who control them. | Q-07, Q-09 |
| `OBJ-04` Prepare test personas and run a first-run check before scaling up. | Q-05 |

## Item-writing rules applied

- Every item tests a claim-backed fact or a decision derived from one, never wording recall.
- Distractors are plausible partner mistakes drawn from the source material, not absurd options.
- Feedback explains why an option is wrong, not merely that it is wrong.
- Answer keys live in `key.json` and are never present in `items.json`.

## Calibration

Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.
