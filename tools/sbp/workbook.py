#!/usr/bin/env python3
"""Load the Sales Blueprinting authoring workbook snapshot.

Source: "Sales Blueprinting Accreditation Build Plan" (Google Sheet owned by Joe Moeller),
https://docs.google.com/spreadsheets/d/1FNFUQAzKl1BgMlyMgR8zygEvmLtnf7V5s-bhaL-3-48
Snapshot: plan/sales-blueprinting/workbook/NN-<tab>.csv, retrieved 2026-10-21 through Glean.

The Glean export collapses horizontally merged cells into one CSV field. Two
tabs are affected in ways that matter to the build:

- Storyboard: 118 rows have 18 fields instead of 19. In every such row the
  On-screen copy and Narration cells were merged because the text is identical,
  so narration is restored as a copy of on-screen copy. The Branch / next field
  must then land on a screen ID or END, which validate() checks.
- Course content: per-option Feedback A-D cells merge when adjacent feedback is
  identical, so their positions are unreliable. The build uses the explicit
  Correct feedback / Incorrect feedback columns instead and verifies the answer
  key against the Correct answer text column.

Everything here is read-only. validate() returns blocking findings; the build
refuses to generate while any exist.
"""
import csv
import io
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
WB = ROOT / "plan" / "sales-blueprinting" / "workbook"
WORKBOOK_URL = "https://docs.google.com/spreadsheets/d/1FNFUQAzKl1BgMlyMgR8zygEvmLtnf7V5s-bhaL-3-48"
RETRIEVED = "2026-10-21"
RESEARCH_CUTOFF = "2026-10-20"

SCREEN_ID = re.compile(r"^SBP-\d{3}-(L\d{2}-S\d{2}|S\d{3})$")
QUESTION_ID = re.compile(r"^SBP-\d{3}-Q\d{3}$")


def _rows(name):
    path = next(WB.glob(f"*-{name}.csv"))
    rows = list(csv.reader(io.StringIO(path.read_text(encoding="utf-8"))))
    return rows[0], rows[1:]


def _clean(v):
    return (v or "").strip()


def _ids(v):
    return [x.strip() for x in (v or "").split(";") if x.strip()]


# ---------------------------------------------------------------------------
def settings():
    _, rows = _rows("settings")
    out = []
    for r in rows:
        r = list(r)
        if len(r) == 12:
            # Module quiz draw and final exam draw merged because both are equal (SBP-200: 0).
            r.insert(7, r[6])
        out.append({
            "name": _clean(r[0]), "topics": _clean(r[1]), "sort": int(_clean(r[2])),
            "id": _clean(r[3]), "version": _clean(r[4]), "mastery": int(_clean(r[5])),
            "quiz_draw": int(_clean(r[6]) or 0), "final_draw": int(_clean(r[7]) or 0),
            "level": _clean(r[8]), "review_status": _clean(r[9]),
            "partner_clearance": _clean(r[10]), "sme_signoff": _clean(r[11]),
        })
    return sorted(out, key=lambda m: m["sort"])


def overview():
    _, rows = _rows("program-overview")
    out = {}
    for r in rows:
        r = list(r)
        if len(r) == 19:
            # Final exam draw and module quiz draw merged because both are equal (SBP-200: 0).
            r.insert(15, r[14])
        mid = _clean(r[3])
        objs = [o.strip() for o in re.split(r"\s*\d\)\s*", r[5]) if o.strip()]
        out[mid] = {
            "course": _clean(r[0]), "name": _clean(r[1]), "purpose": _clean(r[4]),
            "objectives": objs, "prereqs": _clean(r[6]), "roadmap_alignment": _clean(r[7]),
            "evidence": _clean(r[8]), "source_ids": _ids(r[9]),
            "lessons": int(_clean(r[10])), "lesson_minutes": int(_clean(r[11])),
            "quiz_minutes": int(_clean(r[12])), "total_minutes": int(_clean(r[13])),
            "level": _clean(r[17]) if len(r) > 17 else "", "release_status": _clean(r[18]) if len(r) > 18 else "",
        }
    return out


def lessons():
    head, rows = _rows("lesson-plan")
    out = []
    for r in rows:
        d = dict(zip(head, r))
        out.append({
            "module_id": _clean(d["Module ID"]), "id": _clean(d["Lesson ID"]),
            "seq": int(_clean(d["Sequence"])), "title": _clean(d["Lesson title"]),
            "objective": _clean(d["Performance objective"]), "bloom": _clean(d["Bloom level"]),
            "minutes": int(_clean(d["Duration min (estimate)"])),
            "teaching": _clean(d["Teaching script"]),
            "example": _clean(d["Applied example / narration"]),
            "guardrail": _clean(d["Decision / guardrail script"]),
            "activity": _clean(d["Learner activity"]),
            "worked": _clean(d["Worked response / debrief"]),
            "interaction": _clean(d["Interaction"]),
            "evidence": _clean(d["Evidence / completion check"]),
            "source_ids": _ids(d["Source IDs"]), "locator": _clean(d["Source locator"]),
            "review_status": _clean(d["Review status"]),
            "clearance": _clean(d["Authoring clearance"]),
        })
    return out


STORY_FIELDS = ["module_id", "lesson_id", "id", "seq", "type", "title", "copy", "narration",
                "visual", "action", "expected", "next", "a11y", "seconds", "source_ids",
                "locator", "review_status", "clearance"]


def screens():
    _, rows = _rows("storyboard")
    out = []
    for r in rows:
        r = list(r)
        restored = False
        if len(r) == 18:
            # Copy and narration were one merged cell: restore narration.
            r.insert(7, r[6])
            restored = True
        d = dict(zip(STORY_FIELDS, [_clean(x) for x in r[:18]]))
        d["seq"] = int(d["seq"])
        d["seconds"] = int(d["seconds"] or 0)
        d["source_ids"] = _ids(d["source_ids"])
        d["narration_restored"] = restored
        out.append(d)
    return out


def questions():
    _, rows = _rows("course-content")
    out = []
    for r in rows:
        opts = [_clean(r[14]), _clean(r[15]), _clean(r[16]), _clean(r[17])]
        out.append({
            "id": _clean(r[9]), "module_id": _clean(r[10]), "lesson_id": _clean(r[11]),
            "stem": _clean(r[3]), "concept": _clean(r[4]), "review_status": _clean(r[5]),
            "primary_source": _clean(r[6]), "bloom": _clean(r[12]), "item_type": _clean(r[13]),
            "options": opts, "key": _clean(r[18]), "correct_text": _clean(r[19]),
            "fb_correct": _clean(r[20]), "fb_incorrect": _clean(r[21]),
            "source_ids": _ids(r[22]), "locator": _clean(r[23]), "pool": _clean(r[24]),
            "points": int(_clean(r[25]) or 1), "clearance": _clean(r[26]),
        })
    return out


def _simple(name, keys):
    head, rows = _rows(name)
    return [dict(zip(keys, [_clean(x) for x in r])) for r in rows]


SOURCES_SUPPLEMENT = ROOT / "plan" / "sales-blueprinting" / "sources-supplement.csv"


def sources():
    """Workbook source register plus the post-import supplement (same columns)."""
    head, rows = _rows("sources")
    if SOURCES_SUPPLEMENT.exists():
        sup = list(csv.reader(io.StringIO(SOURCES_SUPPLEMENT.read_text(encoding="utf-8"))))
        if sup and sup[0][:14] != head[:14]:
            raise ValueError("sources-supplement.csv header does not match the workbook register")
        rows = rows + sup[1:]
    out = []
    for r in rows:
        d = dict(zip(head, r))
        out.append({
            "id": _clean(d["Source ID"]), "title": _clean(d["Source title"]),
            "url": _clean(d["Source URL"]), "type": _clean(d["Type"]),
            "authority": _clean(d["Authority / role"]), "owner": _clean(d["Owner (as retrieved)"]),
            "updated": _clean(d["Updated date (as retrieved)"])[:10],
            "use_mapping": _clean(d["Module / use mapping"]),
            "supports": _clean(d["Evidence taken / what it supports"]),
            "distribution": _clean(d["Clearance / distribution"]),
            "retrieval": _clean(d["Retrieval evidence"]),
            "restriction": _clean(d["Use restriction"]),
        })
    return out


def glossary():
    return _simple("glossary", ["term", "definition", "boundary", "source_ids"])


def templates():
    return _simple("assets-templates", ["id", "name", "module", "fields", "example", "checks",
                                         "source_ids", "url", "clearance"])


def prompts():
    return _simple("ai-prompt-library", ["id", "task", "module", "inputs", "prompt", "output",
                                          "review", "source_ids", "url"])


def scenario():
    return _simple("capstone-scenario", ["id", "category", "input", "evidence_class", "learner_use",
                                          "assessor"])


def rubric():
    rows = _simple("capstone-rubric", ["id", "dimension", "max", "evidence", "criteria", "strong",
                                        "developing", "insufficient", "modules", "source_ids"])
    return [r for r in rows if re.match(r"^R\d\d$", r["id"])], \
        next(r for r in rows if r["id"] == "PASS RULE")["dimension"]


def gates():
    return _simple("critical-gates", ["id", "gate", "failure", "remediation"])


def use_cases():
    """Merged Impact/Effort cells mean both ratings are equal (12-field rows)."""
    head, rows = _rows("use-case-practice")
    out = []
    for r in rows:
        r = [_clean(x) for x in r]
        if len(r) == 12:
            r.insert(6, r[5])
        out.append(dict(zip(["id", "workflow", "outcome", "population", "systems", "impact",
                             "effort", "quadrant", "dependency", "next_step", "metric",
                             "evidence_class"], r)))
    return out


def open_questions():
    return _simple("open-questions", ["id", "topic", "question", "status", "role", "required_by",
                                       "safe_default", "source_ids"])


def build_spec():
    return _simple("scorm-build-spec", ["id", "area", "contract", "acceptance", "basis", "status"])


# ---------------------------------------------------------------------------
def validate():
    """Return blocking structural findings (B03, B19, B21 structural rules)."""
    E = []
    st = settings()
    ov = overview()
    ls = lessons()
    sc = screens()
    qs = questions()
    src_ids = {s["id"] for s in sources()}
    mods = [m["id"] for m in st]
    if len(mods) != 14:
        E.append(f"settings: expected 14 modules, found {len(mods)}")
    for m in mods:
        if m not in ov:
            E.append(f"{m}: missing from Program Overview")

    # IDs unique
    for kind, ids in (("lesson", [x["id"] for x in ls]), ("screen", [x["id"] for x in sc]),
                      ("question", [x["id"] for x in qs])):
        dup = sorted({i for i in ids if ids.count(i) > 1})
        if dup:
            E.append(f"duplicate {kind} ids: {dup[:5]}")

    lesson_ids = {x["id"] for x in ls}
    for s in sc:
        if not SCREEN_ID.match(s["id"]):
            E.append(f"{s['id']}: malformed screen id")
        if s["module_id"] not in mods:
            E.append(f"{s['id']}: unknown module {s['module_id']}")
        if s["lesson_id"] != "MODULE" and s["lesson_id"] not in lesson_ids:
            E.append(f"{s['id']}: unknown lesson {s['lesson_id']}")
        if not s["source_ids"]:
            E.append(f"{s['id']}: no source ids")
        for sid in s["source_ids"]:
            if sid not in src_ids:
                E.append(f"{s['id']}: unknown source {sid}")
        if not s["copy"]:
            E.append(f"{s['id']}: empty on-screen copy")

    # next pointers resolve in sequence
    by_mod = {}
    for s in sc:
        by_mod.setdefault(s["module_id"], []).append(s)
    for m, rows in by_mod.items():
        rows.sort(key=lambda x: x["seq"])
        seqs = [r["seq"] for r in rows]
        if seqs != list(range(len(rows))):
            E.append(f"{m}: storyboard sequence not contiguous from 0")
        for a, b in zip(rows, rows[1:]):
            if a["next"] != b["id"]:
                E.append(f"{a['id']}: next {a['next']!r} != following screen {b['id']}")
        if not rows[-1]["next"].startswith("END"):
            E.append(f"{rows[-1]['id']}: last screen does not END")

    for q in qs:
        if not QUESTION_ID.match(q["id"]):
            E.append(f"{q['id']}: malformed question id")
        if q["key"] not in "ABCD" or len(q["key"]) != 1:
            E.append(f"{q['id']}: bad key {q['key']!r}")
            continue
        if q["options"]["ABCD".index(q["key"])] != q["correct_text"]:
            E.append(f"{q['id']}: key {q['key']} does not match correct answer text")
        if len(set(q["options"])) != 4 or not all(q["options"]):
            E.append(f"{q['id']}: options missing or duplicated")
        if q["lesson_id"] not in lesson_ids:
            E.append(f"{q['id']}: unknown lesson {q['lesson_id']}")
        if not q["fb_correct"] or not q["fb_incorrect"]:
            E.append(f"{q['id']}: missing feedback")
        for sid in q["source_ids"]:
            if sid not in src_ids:
                E.append(f"{q['id']}: unknown source {sid}")

    for m in st:
        n = sum(1 for q in qs if q["module_id"] == m["id"])
        if n != 8:
            E.append(f"{m['id']}: expected 8 questions, found {n}")
        if m["quiz_draw"] > n:
            E.append(f"{m['id']}: draw {m['quiz_draw']} exceeds bank {n}")
    final = sum(m["final_draw"] for m in st)
    if final != 44:
        E.append(f"settings: final exam draws sum to {final}, expected 44")
    return E


def counts():
    return {"modules": len(settings()), "lessons": len(lessons()), "screens": len(screens()),
            "questions": len(questions()), "sources": len(sources())}


if __name__ == "__main__":
    f = validate()
    for x in f:
        print("ERROR", x)
    print(counts())
    print("PASS" if not f else "FAIL")
