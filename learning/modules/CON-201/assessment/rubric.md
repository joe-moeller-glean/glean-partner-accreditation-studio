# CON-201 assessment rubric

Mastery score: 80%. Items are single-select with explanatory feedback on every option.

## Objective coverage

| Objective | Items |
|---|---|
| `OBJ-01` Trace a document from fetch or push to a cited answer, naming each stage. | Q-06, Q-11 |
| `OBJ-02` Distinguish accepted, processed, and searchable states, and read the evidence for each. | Q-01, Q-02 |
| `OBJ-03` Explain bulk replacement, incremental updates, and the stale-deletion safeguard. | Q-03, Q-04, Q-05 |
| `OBJ-04` Decide why a given user can or cannot see a document. | Q-07, Q-08, Q-09 |
| `OBJ-05` Diagnose where a missing, stale, or over-visible document is stuck. | Q-10, Q-12 |

## Item-writing rules applied

- Every item tests a claim-backed fact or a decision derived from one, never wording recall.
- Distractors are plausible partner mistakes drawn from the source material, not absurd options.
- Feedback explains why an option is wrong, not merely that it is wrong.
- Answer keys live in `key.json` and are never present in `items.json`.

## Calibration

Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.
