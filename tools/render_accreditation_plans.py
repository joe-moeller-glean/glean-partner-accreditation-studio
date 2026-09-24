#!/usr/bin/env python3
"""Render one badge-level plan per accreditation in plan/accreditations.json."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TRACK = {r["Module ID"]: r for r in json.loads((ROOT / "plan/roadmap-export/tab-02-module-id.json").read_text())["records"]}
QUEUE = {j["module_id"]: j for j in json.loads((ROOT / "plan/queue.json").read_text())["jobs"]}
ACCRED = json.loads((ROOT / "plan/accreditations.json").read_text())
BADGE = {r["Badge / Accreditation"]: r for r in json.loads((ROOT / "plan/roadmap-export/tab-03-badge-accreditation.json").read_text())["records"]}
COMP = json.loads((ROOT / "plan/roadmap-export/tab-06-competency.json").read_text())["records"]

NOTES = {
 "accred-foundations": dict(
   promise="Every partner, regardless of role, can explain what the platform is and navigate their own path.",
   gate="Closes first (all four modules are Wave 1). This badge gates learner confidence in every other path.",
   risks=["FND-107 is `Proposed expansion` with no asset and Medium priority - it is the long pole for a Critical badge.",
          "FND-103 carries two unresolved source conflicts (connector count, control plane).",
          "FND-102 must reflect the 2026 journey, not the superseded 2025 deck."],
   competency="No named competency in the roadmap's competency tab - this is the prerequisite layer beneath all of them."),
 "accred-seller-seller-advanced": dict(
   promise="A partner seller can position, qualify, co-sell, and defend Glean in a competitive deal.",
   gate="Requires ACC-101, which blueprints across SAL-201/202/204 - modules the tracker does not list as its prerequisites.",
   risks=["Tracker prerequisite for ACC-101 is SAL-103 only; the exam needs SAL-201/202/203/204 content. Confirm intended gating.",
          "SAL-101/203/204 all depend on unresolved discount and sales-cycle rulings.",
          "ACC-101 requires a human observer for the role play."],
   competency="AI Value Selling (101)"),
 "accred-technical-advisor": dict(
   promise="A solution advisor can run discovery, prioritize use cases, build a defensible value model, blueprint a solution, and plan adoption.",
   gate="Requires ACC-102, a case study spanning the whole Solutions path. Human-scored.",
   risks=["Five of six required modules are `Proposed expansion` or partial - this is the most authoring-heavy badge.",
          "SOL-102 is Critical with no asset; SOL-103 teaches the exact metric discipline PR-01 enforces.",
          "Three-way scope overlap between FND-106, SAL-202, and SOL-102 must be resolved before authoring."],
   competency="AI Strategy & Use Case Discovery (201)"),
 "accred-builder": dict(
   promise="A builder can implement agents, actions, and connectors that work, are tested, and are governed.",
   gate="Requires ACC-104, a capstone lab with a verifiable end state. Needs a live lab environment.",
   risks=["Every required module needs a working lab environment - confirm availability before scheduling any of them.",
          "BLD-101's source is listed as TBD despite `Existing asset` status.",
          "BLD-102 sits in the fastest-moving product area; expect the most frequent refreshes.",
          "BLD-202 is the longest module in the portfolio (2.5h)."],
   competency="Agent Building (201), Custom Connector (301), Embedded Experiences (301)"),
 "accred-solution-architect": dict(
   promise="An architect can scope, design, secure, and de-risk a deployment, and defend the design under review.",
   gate="Requires ACC-103 (exam + design review). Tracker prerequisite TEC-203 is Wave 2, so the badge cannot close in Wave 1.",
   risks=["TEC-101's control-plane and connector-count conflicts block ACC-103 item writing.",
          "TEC-102 is the highest-consequence factual module in the portfolio (security posture, 90-day window).",
          "TEC-103/104/105/201 are all `Content Requests` with no asset - four net-new builds from product docs.",
          "TEC-101 and TEC-102 sources are NDA-marked; confirm what may ship in a partner-facing package."],
   competency="Advanced Networking & Configuration (301), Platform Deployment & Governance (201), AI Gateway (201)"),
 "accred-delivery-lead": dict(
   promise="A delivery lead can run an implementation end to end, from kickoff through adoption, governance, and run state.",
   gate="Requires ACC-105 (exam + delivery plan). Tracker prerequisite SRV-205 is `In development` in Wave 2.",
   risks=["Four of seven required modules are `qa_only` - the fastest badge to close if the existing assets hold up.",
          "SRV-104 is the only net-new required module.",
          "Katya Alfaro owns five of the seven sources - single-SME dependency risk.",
          "SRV-203 and OPS-103 must never present partner service commitments as Glean SLAs."],
   competency="Delivery Excellence (101), Platform Deployment & Governance (201)"),
 "accred-support-adoption": dict(
   promise="A partner can run admin operations, support tiers, incident triage, release readiness, and governance evidence.",
   gate="Requires ACC-106. Tracker prerequisite OPS-106 is Wave 3 - this is the last badge in the portfolio to close.",
   risks=["Five of six required modules have no asset (Content Requests or Proposed expansion).",
          "OPS-103 is Critical and `In development` with two sources to reconcile.",
          "OPS-106 overstating audit capability is the single highest trust risk in this badge.",
          "Diagnostic and log captures across OPS-102/104 and ACC-106 carry PII risk; redaction is a release gate."],
   competency="Managed Services (201)"),
 "accred-industry-specialist": dict(
   promise="An industry principal can position Glean against a vertical's real workflows, stakeholders, and constraints.",
   gate="Tracker states 'SOL-202, SOL-203 plus 2+ IND modules' - the flexible requirement needs a human ruling before the badge can be evaluated programmatically.",
   risks=["**Open decision: does the badge require named IND modules or any 2+?** This blocks badge-completion logic.",
          "SOL-202 unblocks all seven IND modules - it is the single point of failure for this path.",
          "Every IND module's source is the 'Glean for [VERTICALS]' placeholder with no asset detail.",
          "Regulatory overclaim is the dominant risk: IND-102 (healthcare) and IND-106 (public sector) need named compliance SMEs.",
          "IND-201 is a 300-level capstone lab requiring a live environment."],
   competency="AI Strategy & Use Case Discovery (201)"),
}


def main():
    out = ROOT / "plan/accreditations"
    out.mkdir(parents=True, exist_ok=True)
    for a in ACCRED["accreditations"]:
        slug, name = a["directory"], a["name"]
        n = NOTES[slug]
        br = BADGE.get(name, {})
        mods = [m for m in a["required_modules"] if m in TRACK]
        flex = [m for m in a["required_modules"] if m not in TRACK]
        L = []
        w = L.append
        w("# %s — accreditation plan" % name)
        w("")
        w("| Field | Value |")
        w("|---|---|")
        w("| Source directory | `accreditations/%s/` |" % slug)
        w("| Primary audience | %s |" % br.get("Primary Audience", "—"))
        w("| Core focus | %s |" % (br.get("Core Focus") or "—"))
        w("| Capstone / assessment | %s |" % br.get("Capstone / Assessment", "—"))
        w("| Required modules (tracker) | %s |" % br.get("Required Modules", "—"))
        w("| Mapped competency | %s |" % n["competency"])
        w("")
        w("**Learner promise:** %s" % n["promise"])
        w("")
        w("**Badge gate:** %s" % n["gate"])
        w("")
        w("## Required modules")
        w("")
        w("| Module | Title | Level | Hrs | Wave | Priority | Status → request | Asset state | Plan |")
        w("|---|---|---|---|---|---|---|---|---|")
        total = 0.0
        for m in mods:
            r, q = TRACK[m], QUEUE.get(m, {})
            try:
                total += float(r["Duration Hours"] or 0)
            except ValueError:
                pass
            w("| `%s` | %s | %s | %s | %s | %s | %s → `%s` | %s | [%s.md](../modules/%s.md) |" % (
                m, r["Module Title"], r["Level"], r["Duration Hours"], r["Program Wave"],
                r["Priority"], r["Build Status"], q.get("request_type", "?"),
                r["Existing Asset Status"], m, m))
        for f in flex:
            w("| _%s_ | (flexible requirement stated in the tracker) | — | — | — | — | — | — | — |" % f)
        w("")
        w("**Total authored runtime:** %.1f h across %d modules%s." % (
            total, len(mods), " plus the flexible requirement" if flex else ""))
        w("")
        waves = sorted({TRACK[m]["Program Wave"] for m in mods})
        w("**Waves spanned:** %s. The badge cannot be announced before the last module in %s is released." % (
            ", ".join(waves), waves[-1]))
        w("")
        w("## Sequence within this badge")
        w("")
        seq = sorted(mods, key=lambda m: QUEUE.get(m, {}).get("sequence", 999))
        for m in seq:
            q = QUEUE.get(m, {})
            deps = ", ".join(q.get("deps", [])) or "none"
            w("%d. `%s` (queue #%s) — prerequisites: %s" % (seq.index(m) + 1, m, q.get("sequence", "?"), deps))
        w("")
        w("## Risks and open decisions")
        w("")
        for r in n["risks"]:
            w("- %s" % r)
        w("")
        w("## Badge-completion definition of done")
        w("")
        w("- Every required module released with all gates passed (no open warnings, no expired waivers).")
        w("- Capstone assessment calibrated: no item with a live pass rate below 30% or above 95%.")
        w("- Path map shows a complete unlocked route with correct prerequisite edges.")
        w("- Badge artwork placed from `shared/assets/badges/` (never generated per module).")
        w("- Announcement drafted by the Release Manager only after the final module's release returns a successful write.")
        w("- Ledger entry recorded for the badge closure, including which modules and versions constitute it.")
        w("")
        (out / ("%s.md" % slug)).write_text("\n".join(L) + "\n")
        print("wrote plan/accreditations/%s.md (%d modules, %.1fh)" % (slug, len(mods), total))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
