#!/usr/bin/env python3
"""Validate the learning/ hierarchy: canonical modules plus accreditation definitions.

Errors (exit 1):
  - legacy top-level modules/ or accreditations/ directories still exist
  - a module directory's module.json id differs from its directory name
  - an accreditation directory holds SCORM source (module.json) instead of a definition
  - a definition is malformed, its id differs from its directory, or it references an
    unknown module (not in plan/queue.json and not built under learning/modules/)
  - a definition with status "built" references a module that is not built
  - the definition set drifts from the tracker snapshot in plan/accreditations.json
Warnings: built modules that no accreditation references.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import learning_layout as L  # noqa: E402

STATUSES = {"planned", "in_progress", "built", "released", "retired"}
REQUIRED_KEYS = ("id", "name", "status", "required_modules", "completion")


def validate(repo: Path) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    for legacy in ("modules", "accreditations"):
        if (repo / legacy).exists():
            errors.append(f"legacy directory {legacy}/ exists; use {L.LEARNING_DIR}/{legacy}/")

    built = {}
    for d in L.module_dirs(repo):
        meta = L.read_json(d / "module.json")
        if meta.get("module_id") != d.name:
            errors.append(f"{d.relative_to(repo)}: module.json module_id {meta.get('module_id')!r} != directory")
        built[d.name] = meta

    queue_file = repo / "plan" / "queue.json"
    planned = ({j["module_id"] for j in L.read_json(queue_file)["jobs"]}
               if queue_file.is_file() else set())
    known = planned | set(built)

    root = L.accreditations_root(repo)
    if not root.is_dir():
        errors.append(f"{L.ACCREDITATIONS_DIR}/ is missing")
        return errors, warnings

    defs = []
    for d in sorted(p for p in root.iterdir() if p.is_dir()):
        rel = d.relative_to(repo)
        if (d / "module.json").exists():
            errors.append(f"{rel}: contains module.json; SCORM source belongs in {L.MODULES_DIR}/")
        f = d / L.DEFINITION_FILE
        if not f.is_file():
            errors.append(f"{rel}: missing {L.DEFINITION_FILE}")
            continue
        a = L.load_accreditation(f)
        missing = [k for k in REQUIRED_KEYS if not a.get(k)]
        if missing:
            errors.append(f"{rel}: missing keys {missing}")
            continue
        if a["id"] != d.name:
            errors.append(f"{rel}: id {a['id']!r} != directory")
        if a["status"] not in STATUSES:
            errors.append(f"{rel}: status {a['status']!r} not in {sorted(STATUSES)}")
        ids = L.module_ids(a)
        if len(ids) != len(set(ids)):
            errors.append(f"{rel}: duplicate module references")
        for mid in ids:
            if mid not in known:
                errors.append(f"{rel}: unknown module {mid}")
            elif a["status"] in {"built", "released"} and mid not in built:
                errors.append(f"{rel}: status {a['status']} but {mid} is not built")
        assess = a["completion"].get("assessment_module")
        if assess and assess not in a["required_modules"]:
            errors.append(f"{rel}: assessment_module {assess} is not a required module")
        for e in a["electives"]:
            if not {"pattern", "min", "description"} <= set(e):
                errors.append(f"{rel}: elective needs pattern, min, description")
            elif len(L.elective_matches(a, planned | set(built))[e["pattern"]]) < e["min"]:
                errors.append(f"{rel}: elective {e['pattern']} has fewer than {e['min']} candidates")
        ov = a.get("overview_module")
        ov_mods = built.get(ov, {}).get("required_modules") if ov else None
        if ov_mods is not None and set(ov_mods) != set(a["required_modules"]):
            errors.append(f"{rel}: overview module {ov} required_modules differ from definition")
        defs.append(a)

    snapshot = repo / "plan" / "accreditations.json"
    if snapshot.is_file():
        tracker = {e["directory"]: e for e in L.read_json(snapshot)["accreditations"]}
        mine = {a["id"]: L.tracker_view(a) for a in defs}
        for slug in sorted(set(tracker) | set(mine)):
            if slug not in mine:
                errors.append(f"plan/accreditations.json lists {slug} but no definition exists")
            elif slug not in tracker:
                errors.append(f"{slug} is not in plan/accreditations.json")
            elif tracker[slug] != mine[slug]:
                errors.append(f"{slug}: definition drifts from plan/accreditations.json")

    referenced = {m for a in defs for m in L.module_ids(a)}
    for mid in sorted(set(built) - referenced):
        warnings.append(f"{L.MODULES_DIR}/{mid} is not referenced by any accreditation")
    return errors, warnings


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--repo-root", type=Path, default=Path("."))
    p.add_argument("--json", type=Path, help="write findings to this path")
    a = p.parse_args()
    errors, warnings = validate(a.repo_root.resolve())
    for e in errors:
        print("ERROR", e)
    for w in warnings:
        print("WARNING", w)
    if a.json:
        a.json.write_text(json.dumps({"errors": errors, "warnings": warnings}, indent=2) + "\n")
    print("PASS" if not errors else "FAIL")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
