# Memory, learning loop, and scheduling

## Why
The studio must not relearn the same lesson. Every cycle writes down what was published, what was rejected and why, and what was recommended — and the next cycle reads it before planning.

## Files
| File | Contents |
|---|---|
| `memory/decisions.jsonl` | Accepted changes, versions, gate results, rationale |
| `memory/rejections.jsonl` | Rejected or reverted changes with reason codes and evidence |
| `memory/recommendations.jsonl` | Open/applied/declined/superseded recommendations with review dates |
| `memory/patterns.md` | Prevention rules mined from ≥3 recurrences |
| `memory/preferences.md` | Durable human preferences (tone, density, cadence, SME routing) |
| `memory/brief-<module>.md` | Per-module recall brief generated before planning |

## Entry schema
```json
{"ts":"ISO8601","module_id":"FND-104","version":"1.3.0",
 "event":"published|rejected|deferred|recommended|applied|declined|superseded|waived",
 "scope":"path/or/ID","reason_code":"one of the reason codes","detail":"one sentence",
 "evidence":["qa/fact-report.json#C-118"],"decided_by":"agent or human","action":"what changed",
 "prevention":"rule to apply next time","review_on":"YYYY-MM-DD"}
```

## Loop
1. **Recall** — before planning any module, run `scripts/ledger.py brief --module <id>`. Load prior rejections, open recommendations, and applicable prevention rules into the contracts you issue.
2. **Constrain** — convert each applicable prevention rule into an explicit contract constraint, so the sub-agent cannot repeat the mistake.
3. **Record** — after every gate failure, human rejection, waiver, and release, append an entry with `scripts/ledger.py add`.
4. **Mine** — the Memory Curator scans for the same `reason_code` + scope pattern ≥3 times and writes a prevention rule into `memory/patterns.md`. A newly accepted portfolio pattern may be recorded earlier as a provisional recommendation, but it must carry an owner and review date.
5. **Promote** — a validated prevention rule becomes a default constraint in the relevant agent file, dated. Review quarterly; retire rules that no longer fire.
6. **Report** — `retro` mode summarizes decisions, rejection themes, applied vs declined recommendations, and rules currently in force.

## Rules
- Honor or explicitly decline every open recommendation; silence is a defect.
- Never re-propose a change rejected for the same reason without new evidence, and cite the prior rejection when overriding.
- Memory sets defaults and constraints. It never overrides a live quality gate or the current human instruction.
- Record design-system choice, navigation/completion semantics, source corrections, package-hygiene findings, and repeatable runtime/QA patterns, not only release decisions.
- Promote a pattern only after it has been observed in at least two module builds or explicitly accepted as a portfolio standard by the owner. AGT-101 establishes `scroll-canvas-v1` as a reusable option; it does not force every module to become a scroll module.
- No secrets, credentials, or personal data in the ledger. Reference document links, not their contents.

## Scheduling
Create real recurring runs: read `/home/user/skills/automation_trigger_configuration/SKILL.md`, then call `request_create_automation`.

| Schedule | Mode | Action |
|---|---|---|
| Weekly | `scan` | Source drift + link integrity on released modules; open `targeted_update` jobs |
| Monthly | `scan` | Full freshness audit against the 90/180/365-day windows |
| Quarterly | `scan` + `retro` | Assessment calibration, engagement review, brand-drift sweep, memory retro |
| On product release | `scan` | Re-verify claims touching changed behavior |

Each scheduled run: recall memory → `scripts/watch_sources.py` → impact-score drift → open the smallest viable jobs → write a scan record → report the queue. Scheduled runs never publish content changes without passing the full pipeline and its gates.
