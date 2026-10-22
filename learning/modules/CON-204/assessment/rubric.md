# CON-204 assessment rubric

Mastery score: 80%. Items are single-select with explanatory feedback on every option.

## Objective coverage

| Objective | Items |
|---|---|
| `OBJ-01` Explain the SDK pipeline and run lifecycle, and which parts the builder writes. | Q-12, Q-13 |
| `OBJ-02` Choose the correct connector base class and data client for a source. | Q-03 |
| `OBJ-03` Configure a data client with pagination, rate limiting, retries, and a completeness guard. | Q-09 |
| `OBJ-04` Implement transform with stable IDs, epoch timestamps, and ACLs, and supply identities correctly. | Q-01 |
| `OBJ-05` Configure full and incremental modes, checkpoints, and upload options safely. | Q-02, Q-04, Q-05, Q-06, Q-07, Q-08 |
| `OBJ-06` Test in three phases, debug with the CLI, and review generated code and deployment. | Q-10, Q-11 |

## Item-writing rules applied

- Every item tests a claim-backed fact or a decision derived from one, never wording recall.
- Distractors are plausible partner mistakes drawn from the source material, not absurd options.
- Feedback explains why an option is wrong, not merely that it is wrong.
- Answer keys live in `key.json` and are never present in `items.json`.

## Calibration

Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.
