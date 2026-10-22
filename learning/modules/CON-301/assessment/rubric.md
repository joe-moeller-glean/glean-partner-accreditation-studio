# CON-301 assessment rubric

Mastery score: 80%. Items are single-select with explanatory feedback on every option.

## Objective coverage

| Objective | Items |
|---|---|
| `OBJ-01` Operate a connector in Glean-hosted or self-hosted mode with correct scheduling, secrets, and networking. | Q-03 |
| `OBJ-02` Deploy and verify a rollout by document status, not job status. | Q-01, Q-02 |
| `OBJ-03` Define monitoring that catches partial crawls, identity lag, and permission drift. | Q-10 |
| `OBJ-04` Diagnose missing, stale, over-visible, and vanished documents, and choose the right recovery. | Q-04, Q-05 |
| `OBJ-05` Plan a native-to-custom migration without losing coverage or user artifacts. | Q-06, Q-07 |
| `OBJ-06` Write customer documentation and a maintenance and support plan the customer can approve. | Q-08, Q-09 |

## Item-writing rules applied

- Every item tests a claim-backed fact or a decision derived from one, never wording recall.
- Distractors are plausible partner mistakes drawn from the source material, not absurd options.
- Feedback explains why an option is wrong, not merely that it is wrong.
- Answer keys live in `key.json` and are never present in `items.json`.

## Calibration

Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.
