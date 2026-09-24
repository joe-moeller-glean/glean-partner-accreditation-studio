# Task contracts

Every dispatch uses this schema. No free-form asks.

```json
{
  "task_id": "FND-104-content-003",
  "module_id": "FND-104",
  "agent": "content_writer",
  "sub_agent": "7a_screen_copywriter",
  "mode": "single",
  "objective": "Draft copy for BAND-04 (concept canvas: agent vs assistant)",
  "inputs": [
    "design/blueprint.yaml#BAND-04",
    "design/experience.yaml#BAND-04",
    "research/claims.json#C-041,C-042",
    "memory/brief-FND-104.md#recommendations"
  ],
  "output": "content/bands/BAND-04.json",
  "constraints": [
    "max 90 words body",
    "if scroll-canvas-v1, preserve one-band/one-idea contract and the visible disclosure rule for any studio heuristic",
    "sentence case, second person, active voice",
    "every factual sentence carries a claim_id",
    "no new claims",
    "apply prevention rule PR-07 (no metrics without tier-1 anchor)"
  ],
  "acceptance": [
    "all claim_ids resolve in sources.json",
    "within copy budget",
    "no answer cueing for Q-03",
    "terminology matches style-card-foundations"
  ],
  "out_of_scope": ["editing other screens", "changing the archetype", "adding assets"],
  "on_block": "return blocked with the exact missing source or ruling",
  "retry_policy": "one retry with tightened constraints, then escalate",
  "returns": "patch"
}
```

## Rules
- One module, one objective, one primary output, ~45 minutes of equivalent work maximum.
- Always include exact IDs and paths — never "the relevant screen".
- Always inject applicable prevention rules from memory as explicit constraints.
- Acceptance checks must be objectively verifiable by another agent or a script.
- Valid returns: the artifact, a patch, or `blocked` with evidence. Never a guess, never a broadened scope, never self-approval.
- Preserve stable IDs (`SCR-` or `BAND-`, `OBJ-`, `INT-`, `Q-`, `C-`, `SRC-`, `asset_id`) across versions; retiring an ID requires a changelog note.
- For `scroll-canvas-v1`, every contract names the band ID, design-system choice, progress/completion implications, and the runtime/QA evidence expected.
- Sub-agent field is required so the ledger can attribute failures precisely.
