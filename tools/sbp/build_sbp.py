#!/usr/bin/env python3
"""Build the AI Blueprinting & Value Mapping accreditation (Sales Blueprinting, SBP).

Authoring source: plan/sales-blueprinting/workbook/ (snapshot of the "Sales Blueprinting
Accreditation Build Plan" workbook). This script compiles that workbook by immutable IDs
(Module, Lesson, Screen, Question, Asset, Prompt, Source) into 15 SCOs, following the
workbook SCORM Build Spec B01-B28:

  SBP-101 .. SBP-113  required module SCOs (5-of-8 seeded draw, 80% mastery)
  SBP-200             capstone preparation SCO (readiness only; human rubric decides)
  SBP-FINAL           final exam SCO (44 items stratified across SBP-101..113)

Each module renders as one full page: overview, expanded lessons, toolkit, and the check.
Lesson copy comes from plan/sales-blueprinting/lessons/<MODULE>.md, written by the studio
from the workbook sources (see tools/sbp/lessons.py). Every lesson subsection carries a
claim that resolves to workbook Source IDs; claims whose @quote excerpts pass
`verify-quotes` against the source text are marked verified. Source IDs and claim IDs
stay in the author ledger and module research files; learners never see them.
Nothing here invents product facts, customer outcomes, approvals, or missing values.

Release staging (B21): a restricted internal preview may be packaged while rows are
"In review". A partner release fails closed with row-level reasons until review,
clearance, SME sign-off, fact verification, and open policy questions are resolved.

Usage:
  python3 tools/sbp/build_sbp.py verify-quotes      # needs .research/sbp/ source text
  python3 tools/sbp/build_sbp.py validate
  python3 tools/sbp/build_sbp.py generate
  python3 tools/sbp/build_sbp.py gates
  python3 tools/sbp/build_sbp.py package            # restricted preview ZIPs
  python3 tools/sbp/build_sbp.py package --release  # partner release (fails closed)
"""
import hashlib
import json
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(ROOT / "tools" / "agents"))

import workbook as W  # noqa: E402
import lessons as LS  # noqa: E402

VERSION = "1.0.0"
TODAY = "2026-10-21"
DESIGN_SYSTEM = "paged-v1"
ACCRED_ID = "accred-ai-blueprinting"
ACCRED_NAME = "AI Blueprinting & Value Mapping"
MODULES = ROOT / "learning" / "modules"
LEDGER = ROOT / "plan" / "sales-blueprinting"
RUNTIME = HERE / "runtime"
SHARED = ROOT / "shared"
WORDMARK = "glean-wordmark-electric-blue.svg"
PREVIEW_DIST = ROOT / "dist" / "restricted-preview"
MAX_ATTEMPTS = 2  # B13 proposal; owner confirmation pending (O02)

DO_NOT_SHIP = {"S24", "S61"}      # register: customer details / customer-specific
PARTNER_FACING = {"S05", "S06", "S26"}

TYPE_LABEL = {"Concept": "Concept", "Worked context": "Worked example", "Guardrail": "Guardrail",
              "Practice": "Practice", "Debrief": "Debrief"}
TYPE_KEY = {"Concept": "concept", "Worked context": "worked", "Guardrail": "guardrail",
            "Practice": "practice", "Debrief": "debrief"}

# Learner-build holds applied from the workbook's own interim safe defaults.
HOLDS = {
    "SBP-110-L05-S01": {
        "field": "script",
        "open_question": "O06",
        "reason": "Full script describes a pilot-approval tool transition that the workbook marks "
                  "author-only until the live process is verified. On-screen copy is kept.",
    },
}
ITEM_FLAGS = {}
# Items held out of the learner bank under a workbook interim default.
ITEM_HOLDS = {
    "SBP-110-Q007": "O06: item asks how the course should describe an unverified internal pilot-approval "
                     "tool transition; the workbook keeps that note author-only. Held from the learner bank "
                     "(SBP-110 draws 5 of 7) until the live process is confirmed.",
}

# Claims spot-checked by the studio against the source text on 2026-10-21.
SPOT = {
    "SBP-101-L02-S01": ("verified", "S02",
                        "Step 1: Visioning / Step 2: Day In The Life / Step 3: Executive Readout",
                        "S02 lesson titles call step 3 Executive Readout; its process diagram uses Executive Validation."),
    "SBP-106-L01-S01": ("verified", "S05",
                        "A simple discovery framework: business outcomes → use cases → workflows → data → success metrics.", ""),
    "SBP-105-L06-S01": ("verified", "S05",
                        "Send within 24 hours of the session while context is fresh. Attach the use case log and matrix snapshot as supporting documents.", ""),
    "SBP-106-L05-S01": ("verified", "S05",
                        "Impact vs. Effort Matrix ... Quick Wins / Nice-to-Haves / Strategic Bets / Deprioritize",
                        "Quadrant labels verified; axis placement taken from the workbook."),
    "SBP-103-L02-S01": ("partial", "S05",
                        "Discovery: Partner leads workshops. Build: Partner leads with Glean coaching.",
                        "Supports partner-led discovery; the other engagement models rest on S06 and S21."),
    "SBP-103-L03-S02": ("partial", "S05",
                        "IT / Platform Owner brings system, data, and integration context. Power Users / Frontline provide day in the life detail.",
                        "Supports two of the five roles named on screen."),
    "SBP-105-L05-S01": ("partial", "S02",
                        "The result should be a stack ranking to identify the 3–4 hero use cases ... one meeting each for the top 3-5 prioritized use cases",
                        "Sources vary between 3–4 and 3–5 (workbook O04); the screen says 'typically three to five ... across the source set'."),
}


def jdump(path: Path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=False) + "\n")


def ylist(items):
    return "[" + ", ".join(json.dumps(i) for i in items) + "]"


def tidy_objective(text):
    # Editorial normalization only: "sources, Write" -> "sources, write".
    return re.sub(r"(sources, )([A-Z])", lambda m: m.group(1) + m.group(2).lower(), text)


# ---------------------------------------------------------------------------
# Ledger
class Ledger:
    def __init__(self):
        self.sources = {}
        for s in W.sources():
            pf = s["id"] in PARTNER_FACING
            self.sources[s["id"]] = {
                "source_id": s["id"], "title": s["title"], "url": s["url"],
                "owner": s["owner"] or "not recorded in workbook",
                "doc_updated": s["updated"] or "not recorded",
                "verified_on": W.RESEARCH_CUTOFF,
                "verified_by": "workbook author (source register); studio spot checks noted per claim",
                "authority": s["authority"],
                "authority_tier": {"Primary": 2, "Supporting": 2, "Context": 3,
                                   "Program design": 3}.get(s["authority"], 4),
                "distribution": s["distribution"], "use_restriction": s["restriction"],
                "retrieval": s["retrieval"],
                "status": "current",
                "learner_facing_allowed": pf,
                "do_not_ship": s["id"] in DO_NOT_SHIP,
                "public_label": (s["title"] if pf else "Glean internal source (author-only; clearance pending)"),
            }
        self.claims = {}
        self.by_key = {}
        self.n = 0

    def claim(self, key, text, source_ids, locator="", check=None):
        if key in self.by_key:
            return self.by_key[key]
        self.n += 1
        cid = f"C-{self.n:04d}"
        spot = check or SPOT.get(key)
        authored = bool(check) and check[0] == "attributed"
        rec = {
            "claim_id": cid, "anchor": key, "text": text, "source_ids": list(source_ids),
            "locator": locator,
            "verdict": spot[0] if spot else "attributed",
            "verified_on": TODAY if spot else W.RESEARCH_CUTOFF,
            "checked_by": ("Studio author: drafted from the cited source text; no verbatim excerpt recorded; "
                           "SME verification pending") if authored
            else ("Fact Integrity Auditor (studio spot check)" if spot
                  else "Workbook author attribution; not independently re-verified by the studio"),
            "learner_facing": all(s in PARTNER_FACING for s in source_ids),
        }
        if spot and not authored:
            rec["excerpt_source"] = spot[1]
            rec["excerpt"] = spot[2]
            if spot[3]:
                rec["note"] = spot[3]
        self.claims[cid] = rec
        self.by_key[key] = cid
        return cid

    def write(self):
        jdump(LEDGER / "sources.json", {"retrieved": W.RETRIEVED, "research_cutoff": W.RESEARCH_CUTOFF,
                                        "workbook": W.WORKBOOK_URL,
                                        "sources": list(self.sources.values())})
        jdump(LEDGER / "claims.json", {"generated": TODAY, "claims": list(self.claims.values())})


# ---------------------------------------------------------------------------
# Specs
def module_specs():
    L = Ledger()
    st = W.settings()
    ov = W.overview()
    lessons = W.lessons()
    screens = W.screens()
    qs = W.questions()
    temps = W.templates()
    prompts = W.prompts()
    lesson_by = {l["id"]: l for l in lessons}
    specs = []

    def qrec(q):
        letters = "abcd"
        cid = L.claim(q["id"], q["concept"], q["source_ids"], q["locator"])
        return {
            "id": q["id"], "module": q["module_id"], "lesson": q["lesson_id"], "stem": q["stem"],
            "options": [{"id": letters[n], "text": t, "correct": "ABCD"[n] == q["key"],
                         "feedback": q["fb_correct"] if "ABCD"[n] == q["key"] else q["fb_incorrect"]}
                        for n, t in enumerate(q["options"])],
            "fb_correct": q["fb_correct"], "fb_incorrect": q["fb_incorrect"],
            "claims": [cid], "sources": q["source_ids"], "bloom": q["bloom"],
            "review_status": q["review_status"], "clearance": q["clearance"],
            "flag": ITEM_FLAGS.get(q["id"], ""),
        }

    def toolkit(mid):
        out = []
        t = [x for x in temps if x["module"] == mid and not x["name"].endswith("(source reference)")
             and "author reference only" not in x["name"]]
        if t:
            srcs = sorted({s for x in t for s in W._ids(x["source_ids"])})
            cid = L.claim(f"{mid}-TEMPLATES", "Reusable templates: " + "; ".join(x["id"] for x in t), srcs)
            out.append({
                "id": f"{mid}-X01", "lesson": "toolkit", "type": "reference",
                "eyebrow": "Toolkit · Templates", "title": "Templates for this module",
                "nav": "Templates",
                "body": "Copy-ready structures you can reuse in your own engagements. Examples are fictional.",
                "cards": [{"tag": x["id"], "title": x["name"], "lines": [
                    {"label": "Fields", "text": x["fields"].replace(" | ", ", ")},
                    {"label": "Fictional example", "text": x["example"]},
                    {"label": "Acceptance check", "text": x["checks"]}]} for x in t],
                "claims": [cid], "sources": srcs, "required": True,
            })
        p = [x for x in prompts if x["module"] == mid and x["id"] != "P10"]
        if p:
            srcs = sorted({s for x in p for s in W._ids(x["source_ids"])})
            cid = L.claim(f"{mid}-PROMPTS", "Prompt library entries: " + "; ".join(x["id"] for x in p), srcs)
            out.append({
                "id": f"{mid}-X02", "lesson": "toolkit", "type": "reference",
                "eyebrow": "Toolkit · AI prompts", "title": "AI-assisted preparation prompts", "nav": "AI prompts",
                "body": "Tool-agnostic prompts. AI drafts; a named human reviews facts, sharing, and capability claims before anything is used or sent.",
                "cards": [{"tag": x["id"], "title": x["task"], "lines": [
                    {"label": "Authorized inputs", "text": x["inputs"]},
                    {"label": "Prompt", "text": x["prompt"]},
                    {"label": "Required output", "text": x["output"]},
                    {"label": "Human review", "text": x["review"]}]} for x in p],
                "claims": [cid], "sources": srcs, "required": True,
            })
        return out

    def extras(mid):
        out = []
        if mid == "SBP-101":
            g = W.glossary()
            srcs = sorted({s for x in g for s in W._ids(x["source_ids"])})
            cid = L.claim("SBP-101-GLOSSARY", "Course glossary", srcs)
            out.append({"id": "SBP-101-X03", "lesson": "toolkit", "type": "reference",
                        "eyebrow": "Toolkit · Glossary", "title": "Blueprint terms used in this course", "nav": "Glossary",
                        "table": {"caption": "Glossary", "head": ["Term", "Definition", "Boundary or example"],
                                  "rows": [[x["term"], x["definition"], x["boundary"]] for x in g]},
                        "claims": [cid], "sources": srcs, "required": True})
        if mid == "SBP-106":
            u = W.use_cases()
            cid = L.claim("SBP-106-USECASES", "Use case practice set (fictional)", ["S05", "S02"])
            out.append({"id": "SBP-106-X03", "lesson": "toolkit", "type": "reference",
                        "eyebrow": "Toolkit · Practice set", "title": "Eight fictional use cases, rated", "nav": "Practice set",
                        "body": "Ratings are provisional facilitation examples. Medium ratings are discussed directionally, not forced into a quadrant.",
                        "table": {"caption": "Fictional use cases with impact, effort, and proposed quadrant",
                                  "head": ["ID", "Workflow", "Impact", "Effort", "Proposed quadrant", "Dependency or uncertainty", "Next step"],
                                  "rows": [[x["id"], x["workflow"], x["impact"], x["effort"], x["quadrant"],
                                            x["dependency"], x["next_step"]] for x in u]},
                        "claims": [cid], "sources": ["S05", "S02"], "required": True})
        if mid == "SBP-108":
            cid = L.claim("SBP-108-ROI", "ROI Lab: transparent capacity model with explicit units (fictional inputs)",
                          ["S13", "S39", "S40"])
            out.append({"id": "SBP-108-X03", "lesson": "toolkit", "type": "roi",
                        "eyebrow": "Toolkit · ROI Lab", "title": "Model capacity value with explicit units", "nav": "ROI Lab",
                        "body": "Change any input or load a scenario. Every output shows how it is computed, so you can defend each step.",
                        "roi": roi_model(),
                        "footnote": "Fictional training example. Not a quote, not Glean pricing, not an approved production calculator, and not a realized result. Capacity value is not a cash saving. Formula coverage and evidence labels are still under review.",
                        "claims": [cid], "sources": ["S13", "S39", "S40"], "required": True})
        if mid == "SBP-200":
            sc = W.scenario()
            rb, rule = W.rubric()
            gt = W.gates()
            c1 = L.claim("SBP-200-SCENARIO", "Capstone fictional scenario inputs", ["S54", "S55"])
            c2 = L.claim("SBP-200-RUBRIC", "Capstone rubric and pass rule (proposed)", ["S54", "S55"])
            c3 = L.claim("SBP-200-GATES", "Capstone critical gates (proposed)", ["S54", "S55"])
            out += [
                {"id": "SBP-200-X03", "lesson": "toolkit", "type": "reference",
                 "eyebrow": "Capstone · Scenario", "title": "The fictional organization you will work with", "nav": "Scenario",
                 "body": "All facts belong to the simulation. Some unknowns are deliberate: ask for them rather than assuming.",
                 "table": {"caption": "Capstone scenario inputs", "head": ["ID", "Category", "Fictional input", "Evidence class", "How to use it"],
                           "rows": [[x["id"], x["category"], x["input"], x["evidence_class"], x["learner_use"]] for x in sc]},
                 "claims": [c1], "sources": ["S54", "S55"], "required": True},
                {"id": "SBP-200-X04", "lesson": "toolkit", "type": "reference",
                 "eyebrow": "Capstone · Rubric", "title": "How assessors score your submission", "nav": "Rubric",
                 "body": "Proposed pass rule: " + rule,
                 "table": {"caption": "Capstone rubric (proposed, 100 points)", "head": ["ID", "Dimension", "Points", "Required evidence", "Full-credit anchor", "Insufficient anchor"],
                           "rows": [[x["id"], x["dimension"], x["max"], x["evidence"], x["strong"], x["insufficient"]] for x in rb]},
                 "claims": [c2], "sources": ["S54", "S55"], "required": True},
                {"id": "SBP-200-X05", "lesson": "toolkit", "type": "reference",
                 "eyebrow": "Capstone · Critical gates", "title": "Five gates that block a pass at any score", "nav": "Critical gates",
                 "table": {"caption": "Critical gates (proposed)", "head": ["ID", "Gate", "Fails when", "Required remediation"],
                           "rows": [[x["id"], x["gate"], x["failure"], x["remediation"]] for x in gt]},
                 "claims": [c3], "sources": ["S54", "S55"], "required": True},
            ]
        return out

    authored = LS.load_all()
    qcheck = quote_checks()

    for m in st:
        mid = m["id"]
        o = ov[mid]
        rows = sorted([s for s in screens if s["module_id"] == mid], key=lambda s: s["seq"])
        mod_lessons = sorted([l for l in lessons if l["module_id"] == mid], key=lambda l: l["seq"])
        out = []
        lesson_done = set()
        for s in rows:
            if s["type"] not in {"Module intro", "Module wrap / assessment"}:
                # One full lesson section per lesson replaces the workbook's five storyboard screens.
                lid = s["lesson_id"]
                if lid not in lesson_done:
                    lesson_done.add(lid)
                    out.append(lesson_section(lesson_by[lid], authored.get(lid), rows, L, qcheck))
                continue
            cid = L.claim(s["id"], s["copy"], s["source_ids"], s["locator"])
            base = {"id": s["id"], "claims": [cid], "sources": s["source_ids"], "required": True,
                    "review_status": s["review_status"], "clearance": s["clearance"]}
            if s["type"] == "Module intro":
                base.update({"lesson": "intro", "type": "intro", "eyebrow": f"{mid} · {o['level'] or m['level']}",
                             "title": m["name"], "nav": "Overview", "body": s["copy"],
                             "kicker": f"{o['lessons']} lessons · knowledge check at the end of this page",
                             "list_label": "By the end of this module you can:",
                             "list": o["objectives"],
                             "footnote": "Recommended before this module: " + o["prereqs"] + ". Prerequisites are proposed; roadmap mappings are alignment only, not equivalency."})
            elif s["type"] == "Module wrap / assessment":
                base.update({"lesson": "check", "eyebrow": "Check" if mid != "SBP-200" else "Capstone readiness",
                             "title": "Check your understanding" if mid != "SBP-200" else "Before you submit the practical",
                             "nav": "Knowledge check" if mid != "SBP-200" else "Capstone readiness",
                             "body": s["copy"], "wrap": s["narration"]})
                if mid == "SBP-200":
                    base["type"] = "formative"
                    base["items"] = [q["id"] for q in qs if q["module_id"] == mid]
                    base["footnote"] = ("Finishing this module records preparation as completed. It never records a pass. "
                                        "The accreditation needs every module quiz, the final exam, and a human-scored "
                                        "practical of at least 80/100 with all five critical gates passed.")
                else:
                    base["type"] = "quiz"
            out.append(base)
        wrap = out.pop()
        out += toolkit(mid) + extras(mid)
        out.append(wrap)
        groups = [{"id": x["id"], "label": x.get("nav") or x["title"]} for x in out]
        bank = [qrec(q) for q in qs if q["module_id"] == mid and q["id"] not in ITEM_HOLDS]
        held = [{"id": q["id"], "reason": ITEM_HOLDS[q["id"]]} for q in qs
                if q["module_id"] == mid and q["id"] in ITEM_HOLDS]
        specs.append({
            "id": mid, "title": m["name"], "kind": "capstone" if mid == "SBP-200" else "module",
            "settings": m, "overview": o, "lessons": mod_lessons, "groups": groups,
            "screens": out, "bank": bank, "draw": m["quiz_draw"], "held_items": held,
        })

    # Final exam SCO
    ab = {r["id"]: r for r in W._simple("assessment-blueprint", [
        "id", "scope", "coverage", "bank", "draw", "points", "mastery", "min_correct", "minutes",
        "attempts", "selection", "completion", "basis", "review"])}
    fx = ab["SBP-FINAL-EXAM"]
    cid_rules = L.claim("SBP-FINAL-RULES", fx["selection"] + " " + fx["completion"], ["S56", "S54"])
    final_bank = [b for s in specs if s["kind"] == "module" for b in s["bank"]]
    final_held = [h for s in specs if s["kind"] == "module" for h in s["held_items"]]
    draws = {m["id"]: m["final_draw"] for m in st if m["final_draw"]}
    fscreens = [
        {"id": "SBP-FINAL-S000", "lesson": "intro", "type": "intro", "eyebrow": "SBP-FINAL · Final exam",
         "title": "AI Blueprinting & Value Mapping final exam",
         "body": "One exam across every taught module, weighted toward workflow, value, and executive decisions.",
         "kicker": f"About {fx['minutes']} minutes · {sum(draws.values())} items",
         "list": [f"{sum(draws.values())} items drawn by module from a pool of {len(final_bank)}.",
                  f"Pass with at least {fx['min_correct']} correct ({fx['mastery']}%). The score is never rounded up to pass.",
                  "Feedback appears after you submit.",
                  f"Proposed policy: {MAX_ATTEMPTS} graded attempts, with targeted review before a reset.",
                  "Take this exam after you pass every module quiz. Your LMS enforces that order; this package cannot see other modules."],
         "nav": "Exam rules",
         "footnote": "Version 1 shares its pool with the module quizzes, so you may see items again. Items have not been psychometrically validated.",
         "claims": [cid_rules], "sources": ["S56", "S54"], "required": True},
        {"id": "SBP-FINAL-S999", "lesson": "check", "type": "quiz", "eyebrow": "Final exam",
         "title": "Final exam", "nav": "Final exam", "body": "", "wrap": "", "claims": [cid_rules], "sources": ["S56", "S54"],
         "required": True},
    ]
    specs.append({
        "id": "SBP-FINAL", "title": "AI Blueprinting & Value Mapping: Final Exam", "kind": "final",
        "settings": {"id": "SBP-FINAL", "name": "Final exam", "sort": 150, "version": VERSION, "mastery": 80,
                     "quiz_draw": 0, "final_draw": 0, "level": "Practitioner",
                     "review_status": fx["review"], "partner_clearance": "Pending partner clearance",
                     "sme_signoff": "Not signed"},
        "overview": {"objectives": ["Demonstrate the SBP-101 to SBP-113 objectives on a stratified exam."],
                     "prereqs": "SBP-101 to SBP-113", "total_minutes": int(fx["minutes"]), "lessons": 0,
                     "roadmap_alignment": "", "level": "Practitioner (proposed)"},
        "lessons": [], "groups": [{"id": s["id"], "label": s.get("nav") or s["title"]} for s in fscreens],
        "screens": fscreens, "bank": final_bank, "draw": 0, "final_draws": draws,
        "held_items": final_held,
    })
    return specs, L


# ---------------------------------------------------------------------------
# Expanded lessons and quote verification
RESEARCH = ROOT / ".research" / "sbp"
QUOTE_CHECKS = LEDGER / "quote-checks.json"
UNCHECKED = []  # quotes with no verification record; validate() reports them


def _norm(s):
    s = (s.replace("\u2019", "'").replace("\u2018", "'").replace("\u201c", '"').replace("\u201d", '"')
         .replace("\u2013", "-").replace("\u2014", "-").replace("\u00a0", " "))
    return re.sub(r"\s+", " ", s).strip()


def quote_key(source, text):
    return hashlib.sha1(f"{source}|{_norm(text)}".encode()).hexdigest()[:16]


def quote_checks():
    if not QUOTE_CHECKS.exists():
        return {}
    return json.loads(QUOTE_CHECKS.read_text()).get("quotes", {})


def quote_verdict(quotes, qc, anchor):
    """Verdict for one lesson subsection from its recorded quote checks."""
    if not quotes:
        return ("attributed", None, None, "")
    found, missing = [], 0
    for q in quotes:
        rec = qc.get(quote_key(q["source"], q["text"]))
        if rec is None:
            UNCHECKED.append(f"{anchor}: quote from {q['source']} has no verification record")
        elif rec["found"]:
            found.append(q)
        else:
            missing += 1
    if not found:
        return ("attributed", None, None, "")
    verdict = "verified" if len(found) == len(quotes) else "partial"
    note = f"{len(found)} of {len(quotes)} excerpt(s) matched the source text verbatim (verify-quotes, {TODAY})."
    return (verdict, ", ".join(sorted({q['source'] for q in found})),
            " / ".join(q["text"] for q in found), note)


def learner_objective(text):
    """Workbook objectives carry authoring boilerplate; show learners the task itself."""
    t = re.sub(r"^Given the supplied customer-neutral scenario and sources,\s*", "", text.strip())
    t = re.sub(r"\s*Successful output matches the worked response and states remaining uncertainty\.?$", "", t)
    return t[:1].upper() + t[1:]


def sid_key(x):
    return int(x[1:]) if x[1:].isdigit() else 999


def lesson_section(les, auth, rows, L, qc):
    lid = les["id"]
    sec = {"id": lid, "lesson": lid, "type": "lesson", "seq": les["seq"], "title": les["title"],
           "nav": f"{les['seq']}. {les['title']}", "objective": learner_objective(les["objective"]),
           "required": True, "review_status": les["review_status"], "clearance": les["clearance"]}
    claims, srcs = [], set()
    if auth:
        for part in auth["sections"]:
            ids = sorted(set(part["src"]) | {q["source"] for q in part["quotes"]}, key=sid_key)
            anchor = f"{lid}#{part['n']:02d}"
            cid = L.claim(anchor, LS.plain(part["blocks"])[:600], ids, part["title"] or "opening",
                          quote_verdict(part["quotes"], qc, anchor))
            claims.append(cid)
            srcs |= set(ids)
        sec.update({"blocks": auth["blocks"], "practice": auth["practice"], "worked": auth["worked"],
                    "minutes": max(4, round(auth["words"] / 200) + 4), "expanded": True,
                    "words": auth["words"]})
    else:
        # Not yet expanded: compile the workbook lesson-plan copy into the same single-section shape.
        lrows = [r for r in rows if r.get("lesson_id") == lid]
        for r in lrows:
            claims.append(L.claim(r["id"], r["copy"], r["source_ids"], r["locator"]))
            srcs |= set(r["source_ids"])
        held = [r for r in lrows if r["id"] in HOLDS]
        # A held script (workbook interim default) falls back to that screen's on-screen copy.
        teaching = held[0]["copy"] if held else les["teaching"]
        if held:
            sec["hold"] = HOLDS[held[0]["id"]]
        blocks = [{"t": "p", "x": teaching}, {"t": "h3", "x": "Worked example"},
                  {"t": "p", "x": les["example"]}, {"t": "callout", "label": "Boundary", "x": les["guardrail"]}]
        sec.update({"blocks": blocks, "practice": [{"t": "p", "x": les["activity"]}],
                    "worked": [{"t": "p", "x": les["worked"]}], "minutes": les["minutes"], "expanded": False,
                    "words": LS.words(blocks)})
    sec["eyebrow"] = f"Lesson {les['seq']} · about {sec['minutes']} min"
    sec["claims"], sec["sources"] = claims, sorted(srcs, key=sid_key)
    return sec


def cmd_verify_quotes():
    """Check every @quote against the extracted source text in .research/sbp/ (git-ignored)."""
    if not RESEARCH.exists():
        print("No .research/sbp/ source text. Pull the sources first (tools/sbp/research_extract.py).")
        return 1
    texts = {}
    out, bad, n = {}, [], 0
    for lid, les in LS.load_all().items():
        for part in les["sections"]:
            for q in part["quotes"]:
                n += 1
                s = q["source"]
                if s not in texts:
                    p = RESEARCH / f"{s}.txt"
                    texts[s] = _norm(p.read_text(errors="replace")) if p.exists() else None
                hay = texts[s]
                ok = bool(hay) and _norm(q["text"]) in hay
                out[quote_key(s, q["text"])] = {"lesson": lid, "section": part["title"] or "opening",
                                                 "source": s, "text": q["text"], "found": ok}
                if not ok:
                    bad.append(f"{lid} / {part['title'] or 'opening'} [{s}]: {q['text'][:90]}"
                               + ("" if hay else "  (no source text on file)"))
    jdump(QUOTE_CHECKS, {"checked": TODAY, "method": "whitespace- and typography-normalized exact substring",
                         "quotes": out})
    for b in bad:
        print("NOT FOUND", b)
    print(f"{n - len(bad)}/{n} quotes found verbatim")
    return 1 if bad else 0


def roi_model():
    F = [
        ("users", "Addressable users", "users", 0, 100000, 1, False),
        ("adoption", "Adoption", "% of addressable users active", 0, 100, 1, True),
        ("events", "Events per active user per workday", "events / user / workday", 0, 100, 0.5, False),
        ("burden", "Avoidable time burden per event", "minutes / event (raw friction, not measured saving)", 0, 240, 0.5, False),
        ("workdays", "Workdays per year", "workdays / year", 0, 366, 1, False),
        ("removable", "Fraction of burden removable", "%", 0, 100, 1, True),
        ("coverage", "Relevant data coverage", "%", 0, 100, 1, True),
        ("recapture", "Productivity recapture", "% of freed capacity usefully redeployed", 0, 100, 1, True),
        ("rate", "Fully loaded hourly rate", "USD / hour (fictional)", 0, 1000, 1, False),
        ("haircut", "Risk haircut", "%", 0, 100, 1, True),
        ("platform", "Software / platform annual cost", "USD / year (fictional, not Glean pricing)", 0, 10000000, 100, False),
        ("implementation", "One-time implementation cost", "USD in year 1 (fictional)", 0, 10000000, 100, False),
        ("measurement", "Year-1 adoption and measurement cost", "USD in year 1 (fictional)", 0, 10000000, 100, False),
    ]
    common = {"users": 200, "events": 2, "workdays": 240, "rate": 60, "haircut": 0.10,
              "platform": 20000, "implementation": 6000, "measurement": 4000}
    presets = {
        "conservative": dict(common, adoption=0.35, burden=6, removable=0.50, coverage=0.60, recapture=0.25),
        "base": dict(common, adoption=0.50, burden=8, removable=0.60, coverage=0.80, recapture=0.25),
        "upside": dict(common, adoption=0.65, burden=10, removable=0.70, coverage=0.90, recapture=0.50),
    }
    return {"fields": [{"key": k, "label": l, "unit": u, "min": a, "max": b, "step": s, "pct": p}
                       for k, l, u, a, b, s, p in F], "presets": presets}


def roi_oracle():
    """Recompute the workbook ROI Lab outputs (manual test oracle row) for every preset."""
    expect = {"conservative": 13608, "base": 41472, "upside": 176904}
    errs = []
    for k, v in roi_model()["presets"].items():
        burden = v["users"] * v["adoption"] * v["events"] * v["workdays"] * v["burden"] / 60
        risk = burden * v["removable"] * v["coverage"] * v["recapture"] * v["rate"] * (1 - v["haircut"])
        if round(risk) != expect[k]:
            errs.append(f"ROI Lab {k}: {round(risk)} != workbook {expect[k]}")
    return errs


# ---------------------------------------------------------------------------
def validate_specs(specs, L):
    E = list(W.validate())
    E += roi_oracle()
    for sp in specs:
        mid = sp["id"]
        ids = [s["id"] for s in sp["screens"]]
        if len(ids) != len(set(ids)):
            E.append(f"{mid}: duplicate screen ids")
        if sp["screens"][-1]["type"] not in {"quiz", "formative"}:
            E.append(f"{mid}: last screen must be the check")
        for s in sp["screens"]:
            if s["id"].endswith("-X99"):
                continue
            if not s.get("claims"):
                E.append(f"{mid}: {s['id']} has no claim")
            for c in s.get("claims", []):
                if c not in L.claims:
                    E.append(f"{mid}: {s['id']} claim {c} undefined")
        for q in sp["bank"]:
            if sum(o["correct"] for o in q["options"]) != 1:
                E.append(f"{q['id']}: needs exactly one correct option")
        pre = [o["text"][:25] for q in sp["bank"] for o in q["options"]]
        if sp["kind"] != "final":
            dup = sorted({p for p in pre if pre.count(p) > 1})
            if dup:
                E.append(f"{mid}: option prefixes repeat (harness selects by id; recorded only): {dup[:2]}")
        # objective map: each lesson objective -> screens -> practice -> item
        for l in sp["lessons"]:
            on = [s for s in sp["screens"] if s.get("lesson") == l["id"] and s["type"] == "lesson"]
            if len(on) != 1:
                E.append(f"{mid}: lesson {l['id']} must be exactly one page section")
            elif not (on[0].get("practice") and on[0].get("worked")):
                E.append(f"{mid}: lesson {l['id']} has no practice and worked response")
            elif not on[0]["expanded"] and not ALLOW_UNEXPANDED:
                E.append(f"{mid}: lesson {l['id']} is not expanded (add it to plan/sales-blueprinting/lessons/{mid}.md)")
            if not any(q["lesson"] == l["id"] for q in sp["bank"]):
                E.append(f"{mid}: lesson {l['id']} has no assessment item")
        # Learners never see source IDs, claim IDs, workbook rows, or open-question codes.
        shown = [(s["id"], runtime_section(s)) for s in sp["screens"]]
        shown += [(q["id"], {k: q[k] for k in ("stem", "options", "fb_correct", "fb_incorrect")}) for q in sp["bank"]]
        for sid, obj in shown:
            for txt in learner_strings(obj):
                hit = LEAK.search(txt)
                if hit:
                    E.append(f"{mid}: {sid} shows internal reference '{hit.group(0)}' to learners")
    E += sorted(set(UNCHECKED))
    # option-prefix repeats are informational for this runtime (radio ids), so drop them
    return [e for e in E if "option prefixes repeat" not in e]


ALLOW_UNEXPANDED = bool(__import__("os").environ.get("SBP_ALLOW_UNEXPANDED"))
# Course source IDs (S02), claim IDs (C-0001), open-question codes (O06), or a source-list label.
# "source IDs" in a learner's own deliverable and the ROI/opportunity workbook are legitimate.
LEAK = re.compile(r"\b(S\d{2}|C-\d{4}|O\d{2})\b|\bSources?:")
INTERNAL_KEYS = {"review_status", "clearance", "hold", "required", "claims", "sources", "expanded", "words"}
NON_TEXT_KEYS = {"id", "lesson", "type", "t", "kind", "wide", "narrow"}


def runtime_section(s):
    r = {k: v for k, v in s.items() if k not in INTERNAL_KEYS}
    if s.get("objective") is None:
        r.pop("objective", None)
    return r


def learner_strings(v, key=None):
    if isinstance(v, str):
        if key not in NON_TEXT_KEYS:
            yield v
    elif isinstance(v, dict):
        for k, x in v.items():
            yield from learner_strings(x, k)
    elif isinstance(v, list):
        for x in v:
            yield from learner_strings(x, key)


# ---------------------------------------------------------------------------
def render_figures(sp, dest):
    """Write each authored figure as wide and narrow SVGs; annotate the block with their paths."""
    import figures
    out = []
    for s in sp["screens"]:
        k = 0
        for field in ("blocks", "practice", "worked"):
            for b in s.get(field) or []:
                if b.get("t") != "figure":
                    continue
                k += 1
                aid = f"{s['id']}-F{k}"
                for var in ("wide", "narrow"):
                    rel = f"assets/fig/{aid}-{var}.svg"
                    (dest / rel).parent.mkdir(parents=True, exist_ok=True)
                    (dest / rel).write_text(figures.render(b, var))
                    b[var] = rel
                    out.append({"asset_id": f"{aid}-{var}", "path": rel, "type": "diagram",
                                "purpose": f"{b['kind'].title()} diagram: {b['title']} ({var} layout).",
                                "license": "Original diagram authored for this course; no third-party elements",
                                "created": TODAY, "claim_ids": list(s.get("claims", [])), "alt": b["alt"]})
    return out


def generate_one(sp, L):
    mid = sp["id"]
    dest = MODULES / mid
    if dest.exists():
        shutil.rmtree(dest)
    for d in ["content/screens", "content/feedback", "design", "research", "interactions",
              "assessment", "assets/brand", "qa"]:
        (dest / d).mkdir(parents=True, exist_ok=True)
    claim_ids = sorted({c for s in sp["screens"] for c in s.get("claims", [])} |
                       {c for q in sp["bank"] for c in q["claims"]})
    src_ids = sorted({s for c in claim_ids for s in L.claims[c]["source_ids"]}, key=lambda x: int(x[1:]))
    st = sp["settings"]
    o = sp["overview"]
    hours = round(o["total_minutes"] / 60, 2)

    # metadata
    jdump(dest / "module.json", {
        "module_id": mid, "title": sp["title"], "version": VERSION, "launch": "index.html",
        "mastery_score": 80, "scorm_version": "1.2", "design_system": DESIGN_SYSTEM,
        "accreditation_id": ACCRED_ID, "also_counts_toward": [], "level": o.get("level") or st["level"],
        "target_hours": hours, "kind": sp["kind"],
        "assessment_type": {"module": f"Module quiz: {sp['draw']} of {len(sp['bank'])} items, 80%",
                            "capstone": "Formative check; practical scored by a human assessor",
                            "final": f"Final exam: {sum(sp.get('final_draws', {}).values())} items, 80%"}[sp["kind"]],
        "release_state": "restricted_preview",
        "review_status": st["review_status"], "partner_clearance": st["partner_clearance"],
        "sme_signoff": st["sme_signoff"],
    })
    y = [f"module_id: {mid}", f"title: {json.dumps(sp['title'])}", f"design_system: {DESIGN_SYSTEM}",
         f"learning_path: {json.dumps(ACCRED_NAME)}", "request_type: batch",
         'audience: ["Partner sellers", "Partner solution consultants and SEs", "Practice leads", "Glean field collaborators"]',
         f"level: {json.dumps(o.get('level') or st['level'])}", "learning_outcomes:"]
    y += [f"  - {json.dumps(x)}" for x in o["objectives"]]
    y += ["lesson_objectives:"] + [f"  {l['id']}: {json.dumps(tidy_objective(l['objective']))}" for l in sp["lessons"]]
    y += [f"prerequisites: {json.dumps(o['prereqs'])}",
          f"roadmap_alignment: {json.dumps(o.get('roadmap_alignment', ''))}  # semantic alignment only (O12)",
          f"target_hours: {hours}", "mastery_score: 80",
          f"accreditation: {ACCRED_ID}",
          f"authoring_contract: {json.dumps(W.WORKBOOK_URL)}",
          "authoring_snapshot: plan/sales-blueprinting/workbook/",
          f"review_status: {json.dumps(st['review_status'])}",
          f"partner_clearance: {json.dumps(st['partner_clearance'])}",
          f"sme_signoff: {json.dumps(st['sme_signoff'])}",
          "sme: unassigned - needs_sme (Blueprint SME, BVC / value engineering)",
          "publish_mode: manual_review", "release_state: restricted_preview"]
    (dest / "module.yaml").write_text("\n".join(y) + "\n")

    # sources and research
    jdump(dest / "sources.json", {"module_id": mid, "sources": [L.sources[s] for s in src_ids]})
    jdump(dest / "research" / "claims.json", {"module_id": mid, "claims": [L.claims[c] for c in claim_ids]})
    ver = [L.claims[c] for c in claim_ids if L.claims[c]["verdict"] in {"verified", "partial"}]
    f = [f"# {mid} {sp['title']} - research findings", "",
         f"Workbook research cutoff {W.RESEARCH_CUTOFF}; snapshot retrieved {W.RETRIEVED}.",
         f"{len(claim_ids)} claims across {len(src_ids)} workbook sources. "
         f"{sum(1 for c in ver if c['verdict']=='verified')} verified and "
         f"{sum(1 for c in ver if c['verdict']=='partial')} partially verified by studio spot check; "
         "the rest are workbook-attributed and need SME verification before partner release.", "",
         "| ID | Source | Owner | Updated | Distribution |", "|---|---|---|---|---|"]
    for s in src_ids:
        r = L.sources[s]
        f.append(f"| `{s}` | [{r['title']}]({r['url']}) | {r['owner']} | {r['doc_updated']} | {r['distribution']} |")
    if ver:
        f += ["", "## Studio spot checks", ""]
        for c in ver:
            f.append(f"- `{c['claim_id']}` ({c['anchor']}, {c['verdict']}) {c['excerpt_source']}: \"{c['excerpt']}\""
                     + (f" - {c['note']}" if c.get("note") else ""))
    (dest / "research" / "findings.md").write_text("\n".join(f) + "\n")
    oq = W.open_questions()
    c = [f"# {mid} - conflicts, holds, and open questions", "",
         "Authority: for product behavior, current Glean product documentation outranks enablement decks. "
         "This module teaches a sales process, so most claims rest on internal playbooks (workbook sources).", "",
         "## Open questions from the workbook (all unresolved at build)", ""]
    c += [f"- **{q['id']} {q['topic']}**: {q['question']} Interim default: {q['safe_default']}" for q in oq]
    holds = [s for s in sp["screens"] if s.get("hold")]
    if holds:
        c += ["", "## Learner-build holds", ""]
        c += [f"- `{s['id']}` field `{s['hold']['field']}` withheld ({s['hold']['open_question']}): {s['hold']['reason']}" for s in holds]
    flagged = [q for q in sp["bank"] if q["flag"]]
    if flagged:
        c += ["", "## Flagged items", ""] + [f"- `{q['id']}`: {q['flag']}" for q in flagged]
    if sp["held_items"]:
        c += ["", "## Items held from the learner bank", ""] + [f"- `{x['id']}`: {x['reason']}" for x in sp["held_items"]]
    dns = [s["id"] for s in sp["screens"] if set(s.get("sources", [])) & DO_NOT_SHIP]
    dns += [q["id"] for q in sp["bank"] if set(q["sources"]) & DO_NOT_SHIP]
    if dns:
        c += ["", "## Do-not-ship source citations", "",
              "These rows cite a source the register marks do not ship (S24, S61). Replace the source "
              "or confirm the claim from a shippable source before release: " + ", ".join(f"`{x}`" for x in dns)]
    (dest / "research" / "conflicts.md").write_text("\n".join(c) + "\n")

    # design
    jdump(dest / "design" / "blueprint.json", {
        "module_id": mid, "module_objectives": o["objectives"],
        "objective_map": [{"lesson_id": l["id"], "objective": tidy_objective(l["objective"]), "bloom": l["bloom"],
                           "screens": [s["id"] for s in sp["screens"] if s.get("lesson") == l["id"]],
                           "practice": [s["id"] for s in sp["screens"] if s.get("lesson") == l["id"] and s["type"] == "practice"],
                           "items": [q["id"] for q in sp["bank"] if q["lesson"] == l["id"]]} for l in sp["lessons"]],
    })
    exp = [f"module_id: {mid}", f"design_system: {DESIGN_SYSTEM}", f"accreditation: {ACCRED_ID}",
           "shell: shared paged-v1 tokens and styles plus tools/sbp/runtime (sbp.css, app.js, scorm.js)",
           "layout: single scrolling page - overview -> full lessons (teaching, practice, worked response) -> toolkit -> check",
           "rail: 'On this page' jump links, sticky on wide screens, above the content on narrow screens",
           "progress: sections read (a section counts once its end has been on screen), not scroll position",
           "sources: author ledger and research/ only; never rendered to learners",
           "signature_moment: " + ({"SBP-108": "ROI Lab (SBP-108-X03)", "SBP-200": "rubric and critical gates"}.get(mid, "module check")),
           "motion: rise on reveal only; disabled under prefers-reduced-motion",
           f"screen_count: {len(sp['screens'])}"]
    (dest / "design" / "experience.yaml").write_text("\n".join(exp) + "\n")
    sb = [f"# {mid} storyboard (compiled)", ""]
    raw = {r["id"]: r for r in W.screens()}
    for n, s in enumerate(sp["screens"]):
        sb.append(f"{n:02d}. `{s['id']}` {s['type']} - {s.get('eyebrow','')} - {s['title']}"
                  + (f" ({s['words']} words{'' if s['expanded'] else ', workbook copy - not yet expanded'})"
                     if s["type"] == "lesson" else ""))
        if s["id"] in raw:
            sb.append(f"    - visual: {raw[s['id']]['visual']}")
            sb.append(f"    - accessibility: {raw[s['id']]['a11y']}")
    (dest / "design" / "storyboard.md").write_text("\n".join(sb) + "\n")

    # content, interactions
    for s in sp["screens"]:
        jdump(dest / "content" / "screens" / f"{s['id']}.json", s)
    inter = []
    for s in sp["screens"]:
        kinds = {"lesson": ["local_draft", "reveal"], "quiz": ["graded_choice"],
                 "formative": ["formative_choice"], "roi": ["calculator"]}.get(s["type"], [])
        for kind in kinds:
            suffix = {"local_draft": "-DRAFT", "reveal": "-REVEAL"}.get(kind, "") if s["type"] == "lesson" else ""
            inter.append({"interaction_id": f"INT-{s['id']}{suffix}", "screen_id": s["id"], "kind": kind,
                          "lesson_id": s.get("lesson"), "claims": s.get("claims", []),
                          "keyboard": "Native textarea, button, radio, and number inputs; no drag; visible focus.",
                          "data": "No learner text is persisted or sent to the LMS." if kind == "local_draft" else "Score and interactions only."})
    jdump(dest / "interactions" / "interactions.json", {"module_id": mid, "interactions": inter})
    jdump(dest / "content" / "feedback" / "item-feedback.json",
          {"module_id": mid, "feedback": {q["id"]: {"correct": q["fb_correct"], "incorrect": q["fb_incorrect"]} for q in sp["bank"]}})

    # assessment
    jdump(dest / "assessment" / "items.json", {
        "module_id": mid, "mastery_score": 80,
        "draw": sp["draw"] if sp["kind"] == "module" else (sum(sp["final_draws"].values()) if sp["kind"] == "final" else 0),
        "final_draws": sp.get("final_draws"),
        "items": [{"id": q["id"], "objective_id": q["lesson"], "module_id": q["module"], "stem": q["stem"],
                   "options": [{"id": o_["id"], "text": o_["text"]} for o_ in q["options"]],
                   "claims": q["claims"], "bloom": q["bloom"], "review_status": q["review_status"]} for q in sp["bank"]],
    })
    jdump(dest / "assessment" / "key.json", {"module_id": mid, "key": {
        q["id"]: {"answer": next(o_["id"] for o_ in q["options"] if o_["correct"]),
                  "rationale": {"correct": q["fb_correct"], "incorrect": q["fb_incorrect"]}} for q in sp["bank"]}})
    rub = [f"# {mid} assessment", "",
           {"module": f"Module quiz: draw {sp['draw']} of {len(sp['bank'])} without replacement, seeded per attempt; options shuffled by id. Pass needs every screen visited and at least {-(-80 * sp['draw'] // 100)} of {sp['draw']} correct.",
            "capstone": "Formative only. Completion records readiness, never a pass. The practical is scored by a qualified human assessor against the rubric (>=80/100 and all critical gates).",
            "final": f"Final exam: {sum(sp.get('final_draws', {}).values())} items stratified by module from {len(sp['bank'])}. Pass needs at least 36 correct; 35/44 (79.5%) fails."}[sp["kind"]],
           "", f"Proposed attempts: {MAX_ATTEMPTS} graded (owner confirmation pending, O02). Pool exposure documented (O16).",
           "", "| Lesson objective | Items |", "|---|---|"]
    for l in sp["lessons"]:
        rub.append(f"| `{l['id']}` {tidy_objective(l['objective'])} | {', '.join(q['id'] for q in sp['bank'] if q['lesson'] == l['id'])} |")
    rub += ["", "Calibration: review live pass rates after 30 completions; rewrite items below 30% or above 95%."]
    (dest / "assessment" / "rubric.md").write_text("\n".join(rub) + "\n")

    # assets
    shutil.copy(SHARED / "assets" / "brand" / WORDMARK, dest / "assets" / "brand" / WORDMARK)
    logo = {"asset_id": f"{mid}-LOGO", "path": f"assets/brand/{WORDMARK}", "type": "brand_logo",
            "purpose": "Approved Glean wordmark in the module header. Placed unmodified.",
            "license": "Glean trademark - use per brand guidelines", "created": "2026-09-25",
            "claim_ids": [], "alt": "Glean"}
    figs = render_figures(sp, dest)
    jdump(dest / "assets" / "manifest.json", {"module_id": mid, "assets": [logo] + figs})
    jdump(dest / "assets" / "alt-text.json",
          {"by_asset_id": {logo["asset_id"]: "Glean", **{a["asset_id"]: a["alt"] for a in figs}}})

    # qa stubs and changelog
    jdump(dest / "qa" / "waivers.json", {"waivers": []})
    n_types = sorted({s["type"] for s in sp["screens"]})
    (dest / "CHANGELOG.md").write_text(
        f"# {mid} {sp['title']}\n\n## {VERSION} - {TODAY} (restricted preview)\n\n"
        f"- First compiled build for `{ACCRED_ID}` from the Sales Blueprinting Accreditation Build Plan workbook.\n"
        f"- One full page with {len(sp['screens'])} sections ({', '.join(n_types)}); each lesson is a single section.\n"
        + (f"- {sum(1 for s in sp['screens'] if s.get('expanded'))} of {len(sp['lessons'])} lessons expanded from source "
           f"documents ({sum(s.get('words', 0) for s in sp['screens'] if s['type'] == 'lesson')} lesson words).\n"
           if sp["lessons"] else "")
        + "- Source and claim IDs removed from learner view; traceability kept in research/claims.json.\n"
        f"- {len(sp['bank'])} items in the bank; keys in `assessment/key.json`.\n"
        f"- {len(claim_ids)} claims traced to {len(src_ids)} workbook sources.\n"
        "- Storyboard rows with merged copy/narration cells restored (narration equals copy).\n"
        "- Per-option feedback A-D not used (merged cells); Correct/Incorrect feedback columns used.\n"
        "- Editorial: lowercased the verb after 'sources,' in lesson objectives.\n"
        + "".join(f"- Hold `{s['id']}`: {s['hold']['reason']}\n" for s in holds)
        + "".join(f"- Held item `{x['id']}`: {x['reason']}\n" for x in sp["held_items"])
        + "- Release state: restricted preview. Partner release blocked pending review, clearance, SME sign-off, and O01-O16.\n")

    # runtime
    for name in ["tokens.css", "styles.css"]:
        shutil.copy(SHARED / "theme" / name, dest / name)
    for name in ["app.js", "scorm.js", "sbp.css"]:
        shutil.copy(RUNTIME / name, dest / name)
    html = (RUNTIME / "index.html").read_text()
    html = html.replace("__TITLE__", sp["title"]).replace("__NOTICE_LABEL__", "Restricted internal preview.").replace(
        "__NOTICE__", "Content is in review and not cleared for partner distribution. Examples are fictional.")
    (dest / "index.html").write_text(html)
    runtime_screens = [runtime_section(s) for s in sp["screens"]]
    module = {"id": mid, "title": sp["title"], "version": VERSION, "kind": sp["kind"], "mastery": 80,
              "draw": sp["draw"], "max_attempts": MAX_ATTEMPTS, "lessons": sp["groups"],
              "screens": runtime_screens,
              "bank": [{k: v for k, v in q.items() if k in {"id", "module", "lesson", "stem", "options", "fb_correct", "fb_incorrect"}}
                       for q in sp["bank"]]}
    if sp["kind"] == "final":
        module["final_draws"] = sp["final_draws"]
        module["total_draw"] = sum(sp["final_draws"].values())
    (dest / "content.js").write_text(
        "/* Compiled by tools/sbp/build_sbp.py. Do not hand-edit.\n"
        "   Correct flags are merged here for client-side scoring only (B16: client logic is inspectable). */\n"
        "window.MODULE = " + json.dumps(module, ensure_ascii=False, separators=(",", ":")) + ";\n")
    return dest


def accreditation_yaml(specs):
    req = [s["id"] for s in specs]
    y = [
        "# Accreditation definition. Modules live in learning/modules/<id>/ and are referenced, not nested.",
        f"id: {ACCRED_ID}",
        f"name: {ACCRED_NAME}",
        "source: composed",
        "status: built",
        "audience: [Partner sellers, Partner solution consultants and SEs, Practice leads, Glean field collaborators]",
        "required_modules:",
    ] + [f"  - {m}" for m in req] + [
        "electives: []",
        "completion:",
        "  assessment_module: SBP-FINAL",
        "  assessment_type: \"13 module quizzes (5 of 8 items, 80%), final exam (44 items, 80%), SBP-200 preparation, and a human-scored practical\"",
        "  mastery_score: 80",
        "  practical:",
        "    module: SBP-200",
        "    pass_rule: \"At least 80/100 on the nine-dimension rubric and all five critical gates passed; scored by a qualified human assessor\"",
        "  hard_gates:",
        "    - G01_no_fabricated_customer_facts_results_or_sources",
        "    - G02_safe_data_and_access_handling",
        "    - G03_no_unauthorized_deployment_or_commercial_commitment",
        "    - G04_complete_core_evidence",
        "    - G05_material_financial_and_technical_integrity",
        "  note: \"Proposed award rule (workbook B23); owner approval required (O02). A passed SCO alone never completes the accreditation. No certificate is issued by client code.\"",
        "overview_module: null",
        "publish_mode: manual_review",
        "release_state: restricted_preview",
        "estimated_hours: 12.8  # workbook estimate: 765 minutes incl. quizzes, capstone lessons, and final",
        f"origin: \"Added {TODAY}. Composed from the Sales Blueprinting Accreditation Build Plan workbook (SBP-101 to SBP-113, SBP-200, SBP-FINAL). Working title 'AI Blueprinting & Value Mapping'; the workbook's proposed credential name AI Sales Blueprinting Specialist (AISBS) is not approved (O01).\"",
        "competency_alignment: \"AI Strategy & Use Case Discovery (201) - semantic alignment only, not an approved equivalency (O12)\"",
        f"source_url: \"{W.WORKBOOK_URL}\"",
    ]
    return "\n".join(y) + "\n"


# ---------------------------------------------------------------------------
QA_FP_FILES = ["index.html", "scorm.js", "content.js", "app.js", "sbp.css"]


def build_fingerprint(mid):
    """Same fingerprint as tools/sbp/runtime_qa_sbp.js: sha256 over the shipped runtime files."""
    h = hashlib.sha256()
    for f in QA_FP_FILES:
        h.update((MODULES / mid / f).read_bytes())
    return h.hexdigest()


def qa_evidence_blockers(specs):
    """Block release unless runtime and visual QA passed against the current build of every SCO."""
    out = []
    for name, label in (("runtime-qa-results.json", "Runtime QA (tools/sbp/runtime_qa_sbp.js)"),
                        ("visual-qa-results.json", "Visual QA (tools/sbp/visual_qa.html)")):
        p = LEDGER / name
        if not p.exists():
            out.append(f"{label}: no results recorded")
            continue
        rows = {r["module_id"]: r for r in json.loads(p.read_text())["results"]}
        for sp in specs:
            r = rows.get(sp["id"])
            if not r:
                out.append(f"{label}: {sp['id']} not tested")
            elif r.get("failures"):
                out.append(f"{label}: {sp['id']} has {len(r['failures'])} failure(s)")
            elif (MODULES / sp["id"] / "index.html").exists() and r.get("build") != build_fingerprint(sp["id"]):
                out.append(f"{label}: {sp['id']} results are for an older build; rerun")
    return out


def release_gates(specs, L):
    """Partner-release gates (B21). Returns {module: [blockers]} plus program blockers."""
    oq = W.open_questions()
    program = [f"{q['id']} {q['topic']}: {q['status']}" for q in oq]
    program.append("B22: Impartner restricted test (launch, score, status, resume, reporting) not performed")
    program += qa_evidence_blockers(specs)
    out = {}
    for sp in specs:
        b = []
        st = sp["settings"]
        if st["review_status"] != "Looks good":
            b.append(f"Settings review status is {st['review_status']!r}")
        if "Pending" in st["partner_clearance"] or "pending" in st["partner_clearance"]:
            b.append(f"Partner clearance: {st['partner_clearance']}")
        if st["sme_signoff"] != "Signed":
            b.append(f"SME sign-off: {st['sme_signoff']}")
        rows = [s for s in sp["screens"] if s.get("review_status")]
        not_ok = [s["id"] for s in rows if s["review_status"] != "Looks good"]
        if not_ok:
            b.append(f"{len(not_ok)} storyboard rows not 'Looks good' (first: {not_ok[0]})")
        qn = [q["id"] for q in sp["bank"] if q["review_status"] != "Looks good"]
        if qn:
            b.append(f"{len(qn)} items not 'Looks good' (first: {qn[0]})")
        claims = sorted({c for s in sp["screens"] for c in s.get("claims", [])} | {c for q in sp["bank"] for c in q["claims"]})
        unv = [c for c in claims if L.claims[c]["verdict"] != "verified"]
        if unv:
            b.append(f"{len(unv)} of {len(claims)} claims not independently verified")
        internal = [c for c in claims if not L.claims[c]["learner_facing"]]
        if internal:
            b.append(f"{len(internal)} claims rest on internal-only sources (B16, O11)")
        dns = [s["id"] for s in sp["screens"] if set(s.get("sources", [])) & DO_NOT_SHIP]
        dns += [q["id"] for q in sp["bank"] if set(q["sources"]) & DO_NOT_SHIP]
        if dns:
            b.append("Cites do-not-ship source S24/S61: " + ", ".join(dns))
        for s in sp["screens"]:
            if s.get("hold"):
                b.append(f"Hold {s['id']} ({s['hold']['open_question']})")
        for q in sp["bank"]:
            if q["flag"]:
                b.append(f"Flag {q['id']}: {q['flag']}")
        for x in sp["held_items"]:
            b.append(f"Held item {x['id']} (O06)")
        out[sp["id"]] = b
    return out, program


# ---------------------------------------------------------------------------
def cmd_validate():
    specs, L = module_specs()
    E = validate_specs(specs, L)
    for e in E:
        print("ERROR", e)
    for sp in specs:
        print(f"{sp['id']:<10} screens={len(sp['screens']):<3} bank={len(sp['bank']):<4} "
              f"lessons={len(sp['lessons'])}")
    print(f"claims={len(L.claims)} verified={sum(1 for c in L.claims.values() if c['verdict']=='verified')} "
          f"partial={sum(1 for c in L.claims.values() if c['verdict']=='partial')}")
    print("PASS" if not E else "FAIL")
    return 1 if E else 0


def cmd_generate():
    specs, L = module_specs()
    E = validate_specs(specs, L)
    if E:
        for e in E:
            print("ERROR", e)
        raise SystemExit("validation failed; nothing generated")
    L.write()
    for sp in specs:
        print("generated", generate_one(sp, L).relative_to(ROOT))
    d = ROOT / "learning" / "accreditations" / ACCRED_ID
    d.mkdir(parents=True, exist_ok=True)
    (d / "accreditation.yaml").write_text(accreditation_yaml(specs))
    print("generated", (d / "accreditation.yaml").relative_to(ROOT))
    cmd_gates(quiet=True)
    return 0


def cmd_gates(quiet=False):
    specs, L = module_specs()
    per, program = release_gates(specs, L)
    report = {"accreditation": ACCRED_ID, "version": VERSION, "generated": TODAY,
              "release_state": "restricted_preview" if (program or any(per.values())) else "release_candidate",
              "program_blockers": program, "module_blockers": per}
    jdump(LEDGER / "release-gates.json", report)
    for sp in specs:
        jdump(MODULES / sp["id"] / "qa" / "release-gates.json",
              {"module_id": sp["id"], "partner_release": "blocked" if per[sp["id"]] or program else "eligible",
               "blockers": per[sp["id"]], "program_blockers": program})
    if not quiet:
        for m, b in per.items():
            print(f"{m:<10} {'BLOCKED' if b else 'clear'}  {len(b)} module blockers")
        print(f"program blockers: {len(program)}")
        print("release_state:", report["release_state"])
    return 0


def add_masteryscore(zpath, mastery):
    with zipfile.ZipFile(zpath) as z:
        entries = [(i, z.read(i.filename)) for i in z.infolist()]
    out = []
    for info, data in entries:
        if info.filename == "imsmanifest.xml":
            t = data.decode("utf-8")
            t = re.sub(r"(<item [^>]*>)(<title>.*?</title>)(</item>)",
                       lambda m: m.group(1) + m.group(2) + f"<adlcp:masteryscore>{mastery}</adlcp:masteryscore>" + m.group(3), t)
            data = t.encode("utf-8")
        out.append((info, data))
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for info, data in out:
            z.writestr(info, data)


def cmd_package(release=False):
    specs, L = module_specs()
    if release:
        per, program = release_gates(specs, L)
        blocked = {m: b for m, b in per.items() if b}
        if blocked or program:
            for m, b in blocked.items():
                for x in b:
                    print(f"BLOCKED {m}: {x}")
            for x in program:
                print(f"BLOCKED program: {x}")
            print("FAIL: partner release refused (B21). Restricted preview remains available.")
            return 1
    import package as P
    P.RUNTIME_FILES = ["index.html", "tokens.css", "styles.css", "sbp.css", "scorm.js", "app.js",
                       "content.js", "module.json"]
    P.DIST = ROOT / "dist" if release else PREVIEW_DIST
    P.DIST.mkdir(parents=True, exist_ok=True)
    rc = 0
    rows = []
    for sp in specs:
        zpath, _ = P.package(MODULES / sp["id"])
        if sp["kind"] != "capstone":
            add_masteryscore(zpath, 80)
        digest = P.normalize_zip(zpath)
        v = subprocess.run([sys.executable, str(P.VALIDATE), str(zpath)], capture_output=True, text=True)
        state = v.stdout.strip().splitlines()[-1] if v.stdout.strip() else "NO OUTPUT"
        rows.append({"module_id": sp["id"], "zip": zpath.relative_to(ROOT).as_posix(), "sha256": digest,
                     "bytes": zpath.stat().st_size, "validate_scorm": state})
        print(f"{sp['id']:<10} {state:<6} {digest[:16]}  {zpath.name}")
        if state != "PASS":
            rc = 1
            print(v.stdout, v.stderr)
    jdump(LEDGER / ("release-packages.json" if release else "preview-packages.json"),
          {"generated": TODAY, "release_state": "release" if release else "restricted_preview", "packages": rows})
    return rc


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "validate"
    if cmd == "verify-quotes":
        sys.exit(cmd_verify_quotes())
    if cmd == "validate":
        sys.exit(cmd_validate())
    if cmd == "generate":
        sys.exit(cmd_generate())
    if cmd == "gates":
        sys.exit(cmd_gates())
    if cmd == "package":
        sys.exit(cmd_package(release="--release" in sys.argv))
    raise SystemExit(__doc__)
