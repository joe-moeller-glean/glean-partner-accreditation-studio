#!/usr/bin/env python3
"""Render one development plan per Module Tracker row from the authored spec table."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TRACK = json.loads((ROOT / "plan/roadmap-export/tab-02-module-id.json").read_text())["records"]
QUEUE = {j["module_id"]: j for j in json.loads((ROOT / "plan/queue.json").read_text())["jobs"]}
ACCRED = json.loads((ROOT / "plan/accreditations.json").read_text())["accreditations"]

ARCH = {
    "A1": "Cold-open scenario", "A2": "Objective contract", "A3": "Concept canvas",
    "A4": "Annotated diagram", "A5": "Compare and contrast", "A6": "Decision branch",
    "A7": "Guided simulation", "A8": "Worked example with fade-out", "A9": "Sort or categorize",
    "A10": "Myth vs reality", "A11": "Field note from an expert", "A12": "Checkpoint self-check",
    "A13": "Job aid reveal", "A14": "Badge moment",
    "ASMT": "Assessment block (exempt from archetype variety)",
}
BUDGET = {
    "A1": "\u226460 words", "A2": "\u226450 words", "A3": "\u226490 words", "A4": "\u226440 words + labels",
    "A5": "\u226480 words", "A6": "\u226470 words per branch", "A7": "\u226435 words per step",
    "A8": "\u226480 words", "A9": "\u226450 words", "A10": "\u226470 words", "A11": "\u226460 words",
    "A12": "\u226440 words", "A13": "\u226460 words", "A14": "\u226440 words",
    "ASMT": "item stems only",
}
REQ_LABEL = {
    "qa_only": "QA + repackage only \u2014 no new instructional design unless QA finds a defect",
    "refresh": "Refresh \u2014 reuse stable IDs, minor version unless outcomes change",
    "single": "Full build \u2014 all 14 phases",
    "needs_triage": "Blocked pending human decision \u2014 do not build",
}


def badges_for(mid):
    return [a["name"] for a in ACCRED if mid in a["required_modules"]]


def dependents(mid):
    return sorted(k for k, v in QUEUE.items() if mid in v.get("deps", []))


def render(row, spec):
    mid = row["Module ID"]
    q = QUEUE.get(mid, {})
    dur = (row["Duration Hours"] or "").strip()
    L = []
    a = L.append
    a("# %s \u2014 %s" % (mid, row["Module Title"]))
    a("")
    a("| Field | Value |")
    a("|---|---|")
    a("| Academy / path | %s / %s |" % (row["Academy"], row["Learning Path"]))
    a("| Level | %s |" % row["Level"])
    a("| Duration target | %s h (hold \u00b115%%) |" % dur)
    a("| Build status \u2192 request type | %s \u2192 `%s` |" % (row["Build Status"], q.get("request_type", "?")))
    a("| Queue sequence | %s of 83 (wave %s, priority %s) |" % (q.get("sequence", "?"), row["Program Wave"], row["Priority"]))
    a("| Primary audience | %s |" % row["Primary Audience"])
    a("| Partner types | %s |" % row["Partner Types"])
    a("| Delivery format | %s |" % row["Delivery Format"])
    a("| Badge / path credit | %s |" % (row["Badge / Path"] or "\u2014"))
    a("| Accreditation requirement | %s |" % (", ".join(badges_for(mid)) or "not a required badge module"))
    a("| Prerequisites | %s |" % (row["Prerequisites"] or "None"))
    a("| Unblocks | %s |" % (", ".join(dependents(mid)) or "\u2014"))
    a("| Assessment (tracker) | %s |" % row["Assessment"])
    a("| Mapped assets | %s |" % (row["Mapped Existing Assets"] or "\u2014"))
    a("| Source basis / asset state | %s / %s |" % (row["Source Basis"], row["Existing Asset Status"]))
    a("| Owner / SME | %s |" % (row["Current Owner"] or row["Recommended SME"] or "**unassigned \u2014 `needs_sme`**"))
    a("| Target quarter | %s |" % row["Target Quarter"])
    a("| Flags | %s |" % (", ".join("`%s`" % f for f in q.get("flags", [])) or "none"))
    a("")
    a("**Execution mode:** %s" % REQ_LABEL.get(q.get("request_type"), "?"))
    a("")
    if row["Notes"]:
        a("**Tracker note:** %s" % row["Notes"])
        a("")

    a("## 1. Narrative frame")
    a("")
    a("- **Recurring persona:** %s" % spec["persona"])
    a("- **Through-line situation:** %s" % spec["situation"])
    a("- **Cold open (A1) hook:** %s" % spec["hook"])
    a("- **Signature moment (one T3 reveal):** %s" % spec["signature"])
    a("")

    a("## 2. Learning outcomes (observable)")
    a("")
    for i, o in enumerate(spec["objectives"], 1):
        a("- `OBJ-%02d` \u2014 %s" % (i, o))
    a("")

    a("## 3. Blueprint \u2192 experience map")
    a("")
    a("| Screen | Archetype | Purpose / headline | Objective | Visual asset | Interaction | Copy budget | Motion |")
    a("|---|---|---|---|---|---|---|---|")
    for s in spec["screens"]:
        sid, arch, title, obj, visual, inter, motion = s
        a("| `%s` | %s \u2014 %s | %s | %s | %s | %s | %s | %s |" % (
            sid, arch, ARCH[arch], title, obj, visual, inter, BUDGET[arch], motion))
    a("")
    kinds = sorted({s[1] for s in spec["screens"] if s[1] != "ASMT"})
    a("Archetype variety: %d distinct (%s) \u2014 floor is 4%s." % (
        len(kinds), ", ".join(kinds),
        "; 6 required above 45 min" if dur and float(dur or 0) > 0.75 else ""))
    a("")

    a("## 4. Graphics and media specifications")
    a("")
    a("| Asset ID | Type | Spec |")
    a("|---|---|---|")
    for aid, kind, detail in spec["assets"]:
        a("| `%s` | %s | %s |" % (aid, kind, detail))
    a("")
    if spec.get("icons"):
        a("**Icons (from `shared/assets/icons/`, 24px grid / 2px stroke, decorative unless sole meaning):** %s"
          % ", ".join("`icon-%s-24`" % i for i in spec["icons"]))
        a("")
    if spec.get("diagrams"):
        a("**Shared diagrams reused (never regenerated):** %s" % ", ".join("`%s`" % d for d in spec["diagrams"]))
        a("")
    a("**Generated-image prompt (append the locked brand frame from `plan/02-graphics-icon-system.md` \u00a71):**")
    a("")
    a("```")
    a(spec["prompt"])
    a("```")
    a("")

    a("## 5. Interactions")
    a("")
    for iid, detail in spec["interactions"]:
        a("- **`%s`** \u2014 %s" % (iid, detail))
    a("- Keyboard-equivalent path required in every component; state persisted to `cmi.suspend_data`; restores exactly on resume.")
    a("")

    a("## 6. Assessment plan")
    a("")
    a("- **Format:** %s (tracker: `%s`)" % (spec["assess_form"], row["Assessment"]))
    a("- **Blueprint:** %s" % spec["assess_blueprint"])
    a("- **Mastery:** %s" % spec.get("mastery", "80%, retries reshuffled, explanatory feedback on final attempt"))
    a("- **Distractor sources:** %s" % spec["distractors"])
    a("")

    a("## 7. Job aid / carry-away")
    a("")
    a("- %s" % spec["jobaid"])
    a("")

    a("## 8. Claims to establish and verify")
    a("")
    for c in spec["claims"]:
        a("- %s" % c)
    a("")
    a("Freshness window: %s. Every factual sentence carries a `claim_id` resolving to `sources.json`." % spec["freshness"])
    a("")

    a("## 9. Risks, blockers, and SME questions")
    a("")
    for r in spec["risks"]:
        a("- %s" % r)
    a("")

    a("## 10. Contract sequence for this module")
    a("")
    seq = spec.get("contracts")
    if not seq:
        rt = q.get("request_type")
        if rt == "qa_only":
            seq = ["memory recall brief", "asset + claim inventory of the existing package",
                   "fact audit of rendered content", "a11y audit", "repackage + checksum",
                   "runtime/regression QA", "release + ledger"]
        elif rt == "refresh":
            seq = ["memory recall brief", "research diff vs mapped asset", "fact baseline",
                   "blueprint update (stable IDs)", "experience/storyboard update",
                   "content + interaction + assessment + graphics (parallel)", "fact + editorial audit",
                   "brand + a11y", "build", "runtime/regression QA", "release + ledger"]
        else:
            seq = ["memory recall brief", "intake + module.yaml", "research + sources.json",
                   "fact baseline (claims.json)", "blueprint", "experience + storyboard",
                   "content + interaction + assessment + graphics (parallel)", "fact + editorial audit",
                   "brand + a11y", "build", "runtime/regression QA", "release + ledger"]
    for i, c in enumerate(seq, 1):
        a("%d. %s" % (i, c))
    a("")
    a("## 11. Definition of done")
    a("")
    a("`scripts/lint_module.py modules/%s` exits 0 \u00b7 `scripts/validate_scorm.py` clean \u00b7 all claims `verified` \u00b7"
      % mid)
    a("a11y report has zero blocker/major \u00b7 runtime cases pass (launch 4, tracking 6, resume 4, assessment 6,")
    a("compatibility 6, regression 4, content spot-check 3) \u00b7 `dist/%s-v<version>-scorm12.zip` + `.sha256` \u00b7" % mid)
    a("`CHANGELOG.md` updated \u00b7 ledger entry written.")
    a("")
    return "\n".join(L)


def main():
    from module_specs import SPECS
    out = ROOT / "plan/modules"
    out.mkdir(parents=True, exist_ok=True)
    written, missing = 0, []
    for row in TRACK:
        mid = row["Module ID"]
        spec = SPECS.get(mid)
        if not spec:
            missing.append(mid)
            continue
        (out / ("%s.md" % mid)).write_text(render(row, spec) + "\n")
        written += 1
    print("wrote %d module plans -> plan/modules/" % written)
    if missing:
        print("MISSING SPECS (%d): %s" % (len(missing), ", ".join(missing)))
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
