# CON-203 assessment rubric

Mastery score: 80%. Items are single-select with explanatory feedback on every option.

## Objective coverage

| Objective | Items |
|---|---|
| `OBJ-01` Distinguish the Indexing API, the Client API, and the activity endpoint, and the token each needs. | Q-01 |
| `OBJ-02` Configure a datasource correctly. | Q-02 |
| `OBJ-03` Model documents within MIME, size, and timestamp constraints, and choose the right write semantics. | Q-03, Q-06, Q-07 |
| `OBJ-04` Index users, groups, memberships, and ACLs in the correct order. | Q-08, Q-09, Q-11 |
| `OBJ-05` Choose between custom properties and Custom Metadata, and push activity correctly. | Q-04, Q-05 |
| `OBJ-06` Work within rate limits, read response codes, and use the debug and reprocess tools. | Q-10, Q-12 |

## Item-writing rules applied

- Every item tests a claim-backed fact or a decision derived from one, never wording recall.
- Distractors are plausible partner mistakes drawn from the source material, not absurd options.
- Feedback explains why an option is wrong, not merely that it is wrong.
- Answer keys live in `key.json` and are never present in `items.json`.

## Calibration

Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.
