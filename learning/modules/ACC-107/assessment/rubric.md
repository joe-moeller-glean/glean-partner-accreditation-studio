# ACC-107 assessment rubric

Mastery score: 80%. Items are single-select with explanatory feedback on every option.

## Objective coverage

| Objective | Items |
|---|---|
| `OBJ-01` Distinguish this learning accreditation from the official Custom Connector Competency. | Q-01 |
| `OBJ-02` Assemble a portfolio mapped to the official competency requirements. | Q-04, Q-05, Q-06, Q-08 |
| `OBJ-03` Prepare for the unseen case and the reviewer probes. | Q-10 |
| `OBJ-04` Prepare the official submission package and plan for renewal. | Q-02, Q-03, Q-07, Q-09 |

## Item-writing rules applied

- Every item tests a claim-backed fact or a decision derived from one, never wording recall.
- Distractors are plausible partner mistakes drawn from the source material, not absurd options.
- Feedback explains why an option is wrong, not merely that it is wrong.
- Answer keys live in `key.json` and are never present in `items.json`.

## Calibration

Review live pass rates after 30 completions. Flag any item below 30% or above 95% for rewrite.

## Capstone scoring (assessors)

Portfolio, unseen case, and review meeting are scored outside the SCORM package by two reviewers. Hard gates: identity handling; permissions model and refresh; deletion for every object family; completeness guard and retry; security and secrets. Pass at 80% aggregate with every gate met. Differences over 10 points go to a third reviewer. Calibration notes and internal review criteria are in plan/custom-connectors/ACC-107-competency-capstone.md and are not shipped.
