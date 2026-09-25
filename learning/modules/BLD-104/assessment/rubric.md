# BLD-104 assessment rubric

Mastery score: 80%. Items are single-select with explanatory feedback on every option.

## Objective coverage

| Objective | Items |
|---|---|
| `OBJ-01` Compose a multi-step agent with a thinking step, guardrails, and fallback behaviour. | Q-01, Q-02 |
| `OBJ-02` Select memory scope and model size deliberately for each step. | Q-03, Q-04 |
| `OBJ-03` Apply advanced capabilities: branching, loops, and schedule or event triggers. | Q-05 |

## Item-writing rules applied

- Every item tests a claim-backed fact or a decision derived from one, never wording recall.
- Distractors are plausible partner mistakes drawn from the source material, not absurd options.
- Feedback explains why an option is wrong, not merely that it is wrong.
- Answer keys live in `key.json` and are never present in `items.json`.

## Calibration

Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.
