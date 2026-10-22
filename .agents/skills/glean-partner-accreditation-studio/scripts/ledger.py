#!/usr/bin/env python3
"""Append to and query the studio's decision memory (decisions, rejections, recommendations, patterns)."""
import argparse, json, collections, datetime as dt
from pathlib import Path

FILES = {"published": "decisions.jsonl", "applied": "decisions.jsonl", "waived": "decisions.jsonl",
         "rejected": "rejections.jsonl", "deferred": "rejections.jsonl",
         "recommended": "recommendations.jsonl", "declined": "recommendations.jsonl",
         "superseded": "recommendations.jsonl"}
REASONS = {"factual_error", "stale_source", "unsourced_claim", "off_brand", "a11y_blocker", "scope_creep",
           "duplicate_content", "wrong_audience", "too_long", "weak_assessment", "sme_override",
           "license_issue", "runtime_defect", "human_preference", "research_drift",
           "package_leak", "visual_qa_gap", "design_system_conflict", "heuristic_undisclosed",
           "contrast_failure", "target_size_failure"}
PATTERN_THRESHOLD = 3


def mem(root):
    d = root / "memory"
    d.mkdir(parents=True, exist_ok=True)
    return d


def read_all(root):
    out = []
    for f in sorted(set(FILES.values())):
        p = mem(root) / f
        if p.is_file():
            for line in p.read_text().splitlines():
                try:
                    out.append(json.loads(line))
                except Exception:
                    pass
    return out


def cmd_add(a):
    if a.event not in FILES:
        raise SystemExit(f"event must be one of {sorted(FILES)}")
    if a.reason_code and a.reason_code not in REASONS:
        raise SystemExit(f"reason_code must be one of {sorted(REASONS)}")
    entry = {"ts": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
             "module_id": a.module, "version": a.version, "event": a.event, "scope": a.scope,
             "reason_code": a.reason_code, "detail": a.detail,
             "evidence": a.evidence or [], "decided_by": a.decided_by, "action": a.action,
             "prevention": a.prevention, "review_on": a.review_on, "status": a.status}
    path = mem(a.repo_root) / FILES[a.event]
    with path.open("a") as fh:
        fh.write(json.dumps({k: v for k, v in entry.items() if v not in (None, [], "")}) + "\n")
    print(f"recorded {a.event} for {a.module} -> {path}")


def cmd_brief(a):
    rows = [e for e in read_all(a.repo_root) if e.get("module_id") in (a.module, None)]
    mine = [e for e in rows if e.get("module_id") == a.module]
    rejections = [e for e in mine if e.get("event") in {"rejected", "deferred"}]
    open_recs = [e for e in mine if e.get("event") == "recommended"
                 and not any(x.get("scope") == e.get("scope") and x.get("event") in {"applied", "declined", "superseded"}
                             for x in mine)]
    released = [e for e in mine if e.get("event") == "published"]
    patterns = (mem(a.repo_root) / "patterns.md")
    lines = [f"# Recall brief - {a.module}", "",
             f"Generated {dt.date.today().isoformat()}", "",
             f"## Release history ({len(released)})"]
    lines += [f"- v{e.get('version','?')} {e.get('ts','')[:10]} {e.get('detail','')}" for e in released[-8:]] or ["- none"]
    lines += ["", f"## Prior rejections ({len(rejections)}) - do not repeat"]
    lines += [f"- [{e.get('reason_code','?')}] {e.get('scope','')}: {e.get('detail','')}"
              f"{' | prevention: ' + e['prevention'] if e.get('prevention') else ''}" for e in rejections] or ["- none"]
    lines += ["", f"## Open recommendations ({len(open_recs)}) - honor or explicitly decline"]
    lines += [f"- {e.get('scope','')}: {e.get('detail','')} (review {e.get('review_on','n/a')})" for e in open_recs] or ["- none"]
    lines += ["", "## Prevention rules in force"]
    lines += [patterns.read_text().strip()] if patterns.is_file() else ["- none recorded"]
    text = "\n".join(lines) + "\n"
    out = mem(a.repo_root) / f"brief-{a.module}.md"
    out.write_text(text)
    print(text)
    print(f"(written to {out})")


def cmd_query(a):
    rows = read_all(a.repo_root)
    if a.module:
        rows = [e for e in rows if e.get("module_id") == a.module]
    if a.event:
        rows = [e for e in rows if e.get("event") == a.event]
    if a.reason_code:
        rows = [e for e in rows if e.get("reason_code") == a.reason_code]
    for e in rows[-a.limit:]:
        print(json.dumps(e))
    print(f"{len(rows)} matching entries")


def cmd_patterns(a):
    rows = [e for e in read_all(a.repo_root) if e.get("event") in {"rejected", "deferred"}]
    counts = collections.Counter((e.get("reason_code"), (e.get("scope") or "").split("/")[0]) for e in rows)
    rules, promoted = [], 0
    for (reason, scope), n in counts.most_common():
        if n >= PATTERN_THRESHOLD and reason:
            promoted += 1
            examples = [e for e in rows if e.get("reason_code") == reason][-2:]
            prevention = next((e["prevention"] for e in reversed(examples) if e.get("prevention")),
                              "add an explicit contract constraint preventing this")
            rules.append(f"- **PR-{promoted:02d}** `{reason}` in `{scope or 'module'}` seen {n}x -> {prevention}")
    header = ["# Prevention rules", "",
              f"Mined {dt.date.today().isoformat()} from {len(rows)} rejection entries "
              f"(threshold {PATTERN_THRESHOLD} recurrences).", ""]
    text = "\n".join(header + (rules or ["- no patterns above threshold yet"])) + "\n"
    (mem(a.repo_root) / "patterns.md").write_text(text)
    print(text)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--repo-root", type=Path, default=Path("."))
    sub = p.add_subparsers(dest="cmd", required=True)

    add = sub.add_parser("add", help="append a ledger entry")
    add.add_argument("--module", required=True)
    add.add_argument("--event", required=True)
    add.add_argument("--scope", default="")
    add.add_argument("--reason-code", dest="reason_code")
    add.add_argument("--detail", default="")
    add.add_argument("--evidence", nargs="*")
    add.add_argument("--decided-by", dest="decided_by", default="")
    add.add_argument("--action", default="")
    add.add_argument("--prevention", default="")
    add.add_argument("--review-on", dest="review_on", default="")
    add.add_argument("--version", default="")
    add.add_argument("--status", default="")
    add.set_defaults(func=cmd_add)

    br = sub.add_parser("brief", help="produce a recall brief before planning")
    br.add_argument("--module", required=True)
    br.set_defaults(func=cmd_brief)

    q = sub.add_parser("query")
    q.add_argument("--module")
    q.add_argument("--event")
    q.add_argument("--reason-code", dest="reason_code")
    q.add_argument("--limit", type=int, default=20)
    q.set_defaults(func=cmd_query)

    pt = sub.add_parser("patterns", help="mine recurring failures into prevention rules")
    pt.set_defaults(func=cmd_patterns)

    a = p.parse_args()
    a.func(a)


if __name__ == "__main__":
    main()
