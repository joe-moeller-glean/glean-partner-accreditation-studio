#!/usr/bin/env python3
"""Print a compact authoring brief for one module: lesson plan rows plus quiz concepts.

Usage: python3 tools/sbp/lesson_brief.py SBP-101
Authoring aid only; reads the workbook snapshot.
"""
import csv
import sys
from pathlib import Path

WB = Path(__file__).resolve().parents[2] / "plan" / "sales-blueprinting" / "workbook"


def main(mid):
    L = [r for r in csv.DictReader((WB / "03-lesson-plan.csv").open()) if r["Module ID"] == mid]
    Q = [r for r in csv.DictReader((WB / "05-course-content.csv").open()) if r["Module ID"] == mid]
    for r in L:
        print(f"\n## {r['Lesson ID']} {r['Lesson title']}  [{r['Source IDs']}]")
        print("OBJ:", r["Performance objective"])
        for k, lab in [("Teaching script", "TEACH"), ("Applied example / narration", "EX"),
                       ("Decision / guardrail script", "GUARD"), ("Learner activity", "ACT"),
                       ("Worked response / debrief", "WORKED")]:
            print(f"{lab}: {r[k]}")
        for q in Q:
            if q["Lesson ID"] == r["Lesson ID"]:
                print(f"Q {q['Question ID']}: {q['Question']} -> {q['Correct answer text']}")


if __name__ == "__main__":
    main(sys.argv[1])
