#!/usr/bin/env python3
"""Development review feedback: run the review server and work the feedback queue.

    python3 tools/feedback/cli.py serve [--port 8790]
    python3 tools/feedback/cli.py list [--scope SBP-101] [--accreditation accred-ai-blueprinting] [--status open]
    python3 tools/feedback/cli.py export [--scope ...] [--accreditation ...] [--format md|json]
    python3 tools/feedback/cli.py apply FB-... [FB-...] --note "What changed" [--commit SHA] [--by NAME]
    python3 tools/feedback/cli.py reject FB-... --note "Why not"
    python3 tools/feedback/cli.py archive [--commit SHA]
    python3 tools/feedback/cli.py guard [dist ...]

`apply` and `reject` record the resolution and immediately move the comments from the SQLite
database into plan/feedback-history/<scope>.md. `archive` does the same for every comment a
reviewer resolved in the overlay. `export` is the work queue for refining the materials: each
item lists the authoring file and line that most likely holds the reviewed text.

Environment: FEEDBACK_DB (default .feedback/feedback.db), FEEDBACK_HISTORY (default
plan/feedback-history).
"""
from __future__ import annotations

import argparse
import getpass
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import markers  # noqa: E402
import sources  # noqa: E402
from store import ROOT, FeedbackError, Store  # noqa: E402


def _who(args):
    if getattr(args, "by", None):
        return args.by
    try:
        name = subprocess.run(["git", "config", "user.name"], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    except OSError:
        name = ""
    return name or getpass.getuser()


def _rows(store, args, statuses=None):
    return store.list(statuses=statuses, scope_id=args.scope, accreditation=args.accreditation)


def cmd_serve(args):
    import server

    server.serve(args.host, args.port, args.db)
    return 0


def cmd_list(args):
    store = Store(args.db)
    statuses = None if args.status == "all" else args.status.split(",")
    rows = _rows(store, args, statuses)
    for r in rows:
        where = r["section_label"] or r["section_id"] or r["page"]
        text = r["body"] or r["quote"]
        print(f"{r['id']}  {r['status']:<8} {r['kind']:<10} {r['scope_id']:<12} {where[:40]:<40}  "
              f"{r['author']}: {text[:70].replace(chr(10), ' ')}")
    print(f"{len(rows)} comment(s)")
    return 0


def _item_md(r):
    out = [f"### {r['id']} · {r['kind']} · {r['scope_id']}", ""]
    out.append(f"- Where: `{r['page']}` › {r['section_label'] or r['section_id'] or '(page)'}"
               + (f" (`#{r['section_id']}`)" if r["section_id"] else ""))
    out.append(f"- Reviewer: {r['author']} · {r['created_at']} · build {r['build_ref'] or 'unknown'}")
    if r["kind"] == "suggestion":
        out += [f"- Replace: {json.dumps(r['quote'])}", f"- With: {json.dumps(r['replacement'] or '')}"]
    elif r["quote"]:
        out.append(f"- Selected: {json.dumps(r['quote'])}")
    if r["body"]:
        out.append(f"- Comment: {r['body']}")
    for rep in r["replies"]:
        out.append(f"- Reply ({rep['author']}): {rep['body']}")
    hits = r.get("sources") or []
    if hits:
        out.append("- Source: " + "; ".join(f"`{h['path']}:{h['line']}`" + (" (generated)" if h["generated"] else "")
                                            for h in hits))
    elif r["quote"]:
        out.append("- Source: not found automatically; search the module's authoring files")
    return "\n".join(out)


def cmd_export(args):
    store = Store(args.db)
    rows = _rows(store, args, ["open"])
    for r in rows:
        r["sources"] = sources.locate(r["quote"], r["scope_type"], r["scope_id"], ROOT)
    if args.format == "json":
        print(json.dumps(rows, indent=2))
        return 0
    print("# Open review feedback\n")
    print(f"{len(rows)} open item(s). Edit the authoring source (not generated files), rebuild, then run "
          "`python3 tools/feedback/cli.py apply <id> --note \"...\"` or `reject`.\n")
    for r in rows:
        print(_item_md(r) + "\n")
    return 0


def _close(args, status):
    store = Store(args.db)
    try:
        store.close_out(args.ids, status, args.note, _who(args), args.commit)
        done = store.archive(ids=args.ids, statuses=(status,), commit=args.commit)
    except (FeedbackError, KeyError) as exc:
        print(f"ERROR {exc}", file=sys.stderr)
        return 1
    for path, ids in done.items():
        print(f"{status}: {', '.join(ids)} -> {Path(path).relative_to(ROOT) if Path(path).is_relative_to(ROOT) else path}")
    return 0


def cmd_apply(args):
    return _close(args, "applied")


def cmd_reject(args):
    return _close(args, "rejected")


def cmd_archive(args):
    store = Store(args.db)
    done = store.archive(commit=args.commit)
    for path, ids in done.items():
        print(f"archived {len(ids)}: {', '.join(ids)} -> {path}")
    if not done:
        print("nothing to archive (no resolved, applied, or rejected comments)")
    return 0


def cmd_guard(args):
    bad = 0
    targets = []
    for t in args.paths or ["dist"]:
        p = Path(t)
        targets += sorted(p.rglob("*.zip")) if p.is_dir() else [p]
    for z in targets:
        found = markers.scan_package(z)
        if found:
            bad += 1
            print(f"FAIL {z}: development feedback markers: {'; '.join(found[:5])}")
    print(f"guard: {len(targets)} package(s), {bad} with development feedback markers")
    return 1 if bad else 0


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--db", help="SQLite path (default .feedback/feedback.db)")
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("serve")
    s.add_argument("--host", default="127.0.0.1")
    s.add_argument("--port", type=int, default=8790)
    s.set_defaults(fn=cmd_serve)
    for name, fn in (("list", cmd_list), ("export", cmd_export)):
        s = sub.add_parser(name)
        s.add_argument("--scope", help="module or accreditation ID the comment was made on")
        s.add_argument("--accreditation", help="every comment on this accreditation and its modules")
        if name == "list":
            s.add_argument("--status", default="open", help="open, resolved, applied, rejected, a comma list, or all")
        else:
            s.add_argument("--format", choices=("md", "json"), default="md")
        s.set_defaults(fn=fn)
    for name, fn in (("apply", cmd_apply), ("reject", cmd_reject)):
        s = sub.add_parser(name)
        s.add_argument("ids", nargs="+")
        s.add_argument("--note", required=True)
        s.add_argument("--commit")
        s.add_argument("--by")
        s.set_defaults(fn=fn)
    s = sub.add_parser("archive")
    s.add_argument("--commit")
    s.set_defaults(fn=cmd_archive)
    s = sub.add_parser("guard")
    s.add_argument("paths", nargs="*")
    s.set_defaults(fn=cmd_guard)
    args = p.parse_args(argv)
    return args.fn(args)


if __name__ == "__main__":
    sys.exit(main())
