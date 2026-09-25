# BLD-208 assessment rubric

Mastery score: 80%. Items are single-select with explanatory feedback on every option.

## Objective coverage

| Objective | Items |
|---|---|
| `OBJ-01` Design approval and escalation boundaries for agents that write to other systems. | Q-01 |
| `OBJ-02` Apply retrieval guardrails and refusal behaviour as governance controls. | Q-02, Q-05 |
| `OBJ-03` Specify the production governance evidence a competency review expects. | Q-03, Q-04 |

## Item-writing rules applied

- Every item tests a claim-backed fact or a decision derived from one, never wording recall.
- Distractors are plausible partner mistakes drawn from the source material, not absurd options.
- Feedback explains why an option is wrong, not merely that it is wrong.
- Answer keys live in `key.json` and are never present in `items.json`.

## Calibration

Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.
