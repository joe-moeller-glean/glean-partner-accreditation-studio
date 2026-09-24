#!/usr/bin/env python3
"""Scan released modules for source drift and emit a prioritized refresh queue."""
import argparse, json, datetime as dt
from pathlib import Path

WINDOWS = {"product": 90, "program": 180, "policy": 180, "brand": 180, "concept": 365, "default": 180}
IMPACT = {"critical": 0, "high": 1, "medium": 2, "low": 3}


def jload(p, d=None):
    try:
        return json.loads(p.read_text())
    except Exception:
        return d


def days_since(datestr, today):
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%Y/%m/%d"):
        try:
            return (today - dt.datetime.strptime(datestr[:19], fmt).date()).days
        except Exception:
            continue
    return None


def score(findings, tier1_hits, audience_size):
    if any(f["severity"] == "critical" for f in findings):
        return "critical"
    if tier1_hits or audience_size == "all":
        return "high" if findings else "low"
    return "medium" if findings else "low"


def scan_module(mod, today, rejected):
    src = jload(mod / "sources.json", {"sources": []})
    meta = jload(mod / "module.json", {})
    claims = jload(mod / "research" / "claims.json", {"claims": []}).get("claims", [])
    findings, tier1 = [], 0
    for s in src.get("sources", []):
        sid = s.get("source_id", "?")
        cls = (s.get("claim_class") or "default").lower()
        window = int(s.get("freshness_days") or WINDOWS.get(cls, WINDOWS["default"]))
        age = days_since(s.get("verified_on", ""), today)
        if age is None:
            findings.append({"source_id": sid, "issue": "no verified_on date", "severity": "high"})
            continue
        if age > window:
            findings.append({"source_id": sid, "issue": f"stale by {age - window} days (age {age}d, window {window}d)",
                             "severity": "critical" if age > window * 2 else "high"})
        if s.get("status") == "superseded":
            findings.append({"source_id": sid, "issue": f"superseded by {s.get('superseded_by','unknown')}",
                             "severity": "critical"})
        if not s.get("owner"):
            findings.append({"source_id": sid, "issue": "no owner", "severity": "medium"})
        if str(s.get("authority_tier")) == "1":
            tier1 += 1
        if str(s.get("authority_tier")) == "4" and s.get("sole_basis"):
            findings.append({"source_id": sid, "issue": "tier-4 source used as sole basis", "severity": "critical"})
    for c in claims:
        if c.get("verdict") in {"stale", "conflicted", "unsupported"}:
            findings.append({"source_id": c.get("claim_id"), "issue": f"claim verdict {c['verdict']}",
                             "severity": "critical"})
    if not findings:
        return None
    sev = score(findings, tier1, "all")
    request_type = "refresh" if any(f["severity"] == "critical" for f in findings) else "targeted_update"
    return {
        "module_id": meta.get("module_id", mod.name),
        "title": meta.get("title", ""),
        "version": meta.get("version", ""),
        "impact": sev,
        "proposed_request_type": request_type,
        "findings": findings,
        "memory_context": rejected.get(meta.get("module_id", mod.name), []),
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--repo-root", type=Path, default=Path("."))
    p.add_argument("--out", type=Path, default=Path("plan/refresh-queue.json"))
    p.add_argument("--today", default=dt.date.today().isoformat())
    a = p.parse_args()
    today = dt.date.fromisoformat(a.today)

    rejected = {}
    rf = a.repo_root / "memory" / "rejections.jsonl"
    if rf.is_file():
        for line in rf.read_text().splitlines():
            try:
                e = json.loads(line)
            except Exception:
                continue
            rejected.setdefault(e.get("module_id"), []).append(
                {"scope": e.get("scope"), "reason_code": e.get("reason_code"), "detail": e.get("detail")})

    results = []
    for mod in sorted((a.repo_root / "modules").glob("*")):
        if not mod.is_dir():
            continue
        r = scan_module(mod, today, rejected)
        if r:
            results.append(r)
    results.sort(key=lambda r: IMPACT[r["impact"]])
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps({"scanned_on": a.today, "candidates": results}, indent=2))
    print(f"{len(results)} refresh candidates -> {a.out}")
    for r in results:
        prior = f" (prior rejections: {len(r['memory_context'])})" if r["memory_context"] else ""
        print(f"  [{r['impact']:<8}] {r['module_id']:<10} {r['proposed_request_type']:<17} "
              f"{len(r['findings'])} finding(s){prior}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
