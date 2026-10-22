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
1. **Recall** — before planning any module, run `skills/scripts/ledger.py brief --module <id>`. Load prior rejections, open recommendations, and applicable prevention rules into the job file.
2. **Constrain** — convert each applicable prevention rule into an explicit job-file acceptance check, so the next worker cannot repeat the mistake.
3. **Record** — after every gate failure, human rejection, waiver, and release, append an entry with `skills/scripts/ledger.py add`.
4. **Mine** — when the same `reason_code` and scope pattern occurs at least 3 times, write a prevention rule into `memory/patterns.md`. A newly accepted portfolio pattern may be recorded earlier as a provisional recommendation, but it must carry an owner and review date.
5. **Promote** — a validated prevention rule becomes a default acceptance check in the relevant file under `skills/jobs/`, dated. Review quarterly; retire rules that no longer fire.
6. **Report** — `retro` mode summarizes decisions, rejection themes, applied vs declined recommendations, and rules currently in force.

## Rules
- Honor or explicitly decline every open recommendation; silence is a defect.
- Never re-propose a change rejected for the same reason without new evidence, and cite the prior rejection when overriding.
- Memory sets defaults and constraints. It never overrides a live quality gate or the current human instruction.
- Record design-system choice, navigation/completion semantics, source corrections, package-hygiene findings, and repeatable runtime/QA patterns, not only release decisions.
- Promote a pattern only after it has been observed in at least two module builds or explicitly accepted as a portfolio standard by the owner. AGT-101 establishes `scroll-canvas-v1` as a reusable option; it does not force every module to become a scroll module.
- No secrets, credentials, or personal data in the ledger. Reference document links, not their contents.

## Scans

A scan is a `scan` job that follows `skills/jobs/refresh.md`. It writes `plan/refresh-queue.json` and a note under `monitoring/`. It does not create a Cursor Automation, cloud agent, or other schedule. A future runner may start that job from `.agents/prompts/refresh.md`.

| When a scan is requested | Action |
|---|---|
| Weekly | Source drift and link integrity on released modules; propose `update_module` jobs |
| Monthly | Freshness audit against the 90/180/365-day windows |
| Quarterly | Assessment calibration, engagement review, brand-drift sweep, ledger retro |
| On product release | Re-verify claims that mention the changed behavior |

Each scan: recall memory, run `skills/scripts/watch_sources.py`, score drift, propose the smallest jobs, write the scan record, and stop. A scan never publishes content changes.
