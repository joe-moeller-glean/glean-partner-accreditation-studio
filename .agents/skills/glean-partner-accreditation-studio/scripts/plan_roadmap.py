#!/usr/bin/env python3
"""Turn a Module Tracker CSV export into an ordered job queue and dependency graph."""
import argparse, csv, json, re
from pathlib import Path

STATUS_MAP = {
    "ready for lms": "qa_only",
    "refresh needed": "refresh",
    "in development": "single",
    "planned": "single",
    "": "needs_triage",
}
PRIORITY = {"critical": 0, "high": 1, "medium": 2, "low": 3}


def norm(s):
    return (s or "").strip()


def load_rows(path):
    """Find the Module Tracker header row and read records below it."""
    lines = path.read_text(encoding="utf-8-sig").splitlines()
    start = next((i for i, l in enumerate(lines)
                  if re.sub(r"[^a-z ]", "", l.split(",")[0].lower()).strip() == "module id"), None)
    if start is None:
        raise SystemExit("Could not find a 'Module ID' header row")
    header = [h.strip().lstrip("# ").strip() for h in next(csv.reader([lines[start]]))]
    rows = []
    for rec in csv.reader(lines[start + 1:]):
        if not rec or not norm(rec[0]) or norm(rec[0]).startswith("#"):
            continue
        rows.append(dict(zip(header, [norm(c) for c in rec])))
    return rows


def wave_key(v):
    nums = [int(n) for n in re.findall(r"\d+", v or "")]
    return min(nums) if nums else 99


def build(rows, scope):
    jobs, seen, errors = [], set(), []
    for r in rows:
        mid = r.get("Module ID", "")
        if not mid:
            continue
        if mid in seen:
            errors.append(f"duplicate module id {mid}")
            continue
        seen.add(mid)
        status = r.get("Build Status", "").lower()
        deps = [d.strip() for d in re.split(r"[;,/]", r.get("Prerequisites", "") + ";" + r.get("Dependency", ""))
                if d.strip() and d.strip().lower() not in {"none", "n/a", "-"}]
        jobs.append({
            "module_id": mid,
            "title": r.get("Module Title", ""),
            "path": r.get("Learning Path", "") or r.get("Academy", ""),
            "academy": r.get("Academy", ""),
            "level": r.get("Level", ""),
            "request_type": STATUS_MAP.get(status, "needs_triage"),
            "build_status": r.get("Build Status", ""),
            "audience": r.get("Primary Audience", ""),
            "partner_types": r.get("Partner Types", ""),
            "format": r.get("Delivery Format", ""),
            "duration_hours": r.get("Duration Hours", ""),
            "badge": r.get("Badge / Path", ""),
            "assessment": r.get("Assessment", ""),
            "deps": sorted(set(deps)),
            "source_basis": r.get("Source Basis", ""),
            "existing_assets": r.get("Mapped Existing Assets", ""),
            "asset_status": r.get("Existing Asset Status", ""),
            "priority": r.get("Priority", ""),
            "wave": r.get("Program Wave", ""),
            "quarter": r.get("Target Quarter", ""),
            "owner": r.get("Current Owner", ""),
            "sme": r.get("Recommended SME", ""),
            "notes": r.get("Notes", ""),
            "flags": [],
        })
    ids = {j["module_id"] for j in jobs}
    for j in jobs:
        missing = [d for d in j["deps"] if d not in ids]
        j["deps"] = [d for d in j["deps"] if d in ids]
        if missing:
            j["flags"].append("unknown_prereq:" + ",".join(missing))
        if not j["source_basis"] and not j["existing_assets"]:
            j["flags"].append("needs_research_first")
        if not j["owner"] and not j["sme"]:
            j["flags"].append("needs_sme")
        if j["request_type"] == "needs_triage":
            j["flags"].append("needs_triage")
    if scope:
        k, _, v = scope.partition("=")
        jobs = [j for j in jobs if v.lower() in str(j.get(k, "")).lower()]
        keep = {j["module_id"] for j in jobs}
        for j in jobs:
            j["deps"] = [d for d in j["deps"] if d in keep]
    return jobs, errors


def order(jobs):
    """Topological order, tie-broken by wave, priority, then module id."""
    by_id = {j["module_id"]: j for j in jobs}
    depth, resolved = {}, []

    def d(mid, stack=()):
        if mid in depth:
            return depth[mid]
        if mid in stack:
            raise SystemExit(f"prerequisite cycle detected: {' -> '.join(stack + (mid,))}")
        depth[mid] = 0 if not by_id[mid]["deps"] else 1 + max(d(x, stack + (mid,)) for x in by_id[mid]["deps"])
        return depth[mid]

    for mid in by_id:
        d(mid)
    for j in sorted(jobs, key=lambda j: (wave_key(j["wave"]),
                                         PRIORITY.get(j["priority"].lower(), 4),
                                         depth[j["module_id"]],
                                         j["module_id"])):
        j["dependency_depth"] = depth[j["module_id"]]
        resolved.append(j)
    # enforce prerequisites-before-dependents
    out, placed = [], set()
    pending = list(resolved)
    while pending:
        progressed = False
        for j in list(pending):
            if all(x in placed for x in j["deps"]):
                out.append(j); placed.add(j["module_id"]); pending.remove(j); progressed = True
        if not progressed:
            raise SystemExit("unresolvable prerequisite graph")
    for i, j in enumerate(out, 1):
        j["sequence"] = i
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--csv", type=Path, required=True, help="Module Tracker CSV export")
    p.add_argument("--out", type=Path, default=Path("plan"))
    p.add_argument("--scope", help="filter like path=Foundations, wave=Wave 1, priority=Critical")
    a = p.parse_args()
    jobs, errors = build(load_rows(a.csv), a.scope)
    jobs = order(jobs)
    a.out.mkdir(parents=True, exist_ok=True)
    (a.out / "queue.json").write_text(json.dumps({"count": len(jobs), "errors": errors, "jobs": jobs}, indent=2))
    (a.out / "dependency-graph.json").write_text(json.dumps(
        {j["module_id"]: j["deps"] for j in jobs}, indent=2))
    status = {j["module_id"]: {"state": "queued", "request_type": j["request_type"], "version": None} for j in jobs}
    sf = a.out / "status.json"
    if not sf.exists():
        sf.write_text(json.dumps(status, indent=2))
    print(f"queued {len(jobs)} modules -> {a.out/'queue.json'}")
    for e in errors:
        print("ERROR", e)
    for j in jobs[:15]:
        print(f"  {j['sequence']:>3} {j['module_id']:<10} {j['request_type']:<12} "
              f"w={j['wave'] or '-':<8} p={j['priority'] or '-':<8} {','.join(j['flags']) or 'ok'}")
    if len(jobs) > 15:
        print(f"  ... {len(jobs)-15} more")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
