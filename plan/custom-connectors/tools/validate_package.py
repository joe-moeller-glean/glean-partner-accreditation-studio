"""Validate the custom-connector curriculum package.

Checks:
1. Every `C-###` referenced in a module file exists in claims.json.
2. Every `S-##` referenced exists in sources.json.
3. Internal (non-learner-facing) claims appear only on lines that label them as
   internal / reviewer / field evidence.
4. Every claim is used by at least one module file (orphans reported, not fatal).
5. Every module's "Claims used" list covers the claim IDs used in its body.
Exit code 1 on any failure in checks 1-3 or 5.
"""
import json, re, sys, pathlib

HERE = pathlib.Path(__file__).resolve().parent.parent
claims = {c["id"]: c for c in json.load(open(HERE / "claims.json"))["claims"]}
sources = {s["id"]: s for s in json.load(open(HERE / "sources.json"))["sources"]}
LABEL = re.compile(r"internal|reviewer|field|anonymi[sz]ed|calibration", re.I)

fail = 0
used = set()
for f in sorted(HERE.glob("*.md")):
    text = f.read_text()
    body, _, tail = text.partition("## Claims used")
    body_ids = set(re.findall(r"(?<![A-Z])C-\d{3}", body))
    tail_ids = set(re.findall(r"(?<![A-Z])C-\d{3}", tail))
    used |= body_ids | tail_ids
    for cid in sorted(body_ids | tail_ids):
        if cid not in claims:
            print(f"FAIL {f.name}: unknown claim {cid}"); fail += 1
    for sid in sorted(set(re.findall(r"(?<![A-Z])S-\d{2}", text))):
        if sid not in sources:
            print(f"FAIL {f.name}: unknown source {sid}"); fail += 1
    for n, line in enumerate(body.splitlines(), 1):
        for cid in re.findall(r"(?<![A-Z])C-\d{3}", line):
            c = claims.get(cid)
            if c and not c["learner_facing"] and not LABEL.search(line):
                print(f"FAIL {f.name}:{n}: internal claim {cid} on unlabeled line"); fail += 1
    if tail and f.name[:3] in ("CON", "BLD", "TEC", "ACC"):
        missing = body_ids - tail_ids
        if missing:
            print(f"FAIL {f.name}: 'Claims used' missing {sorted(missing)}"); fail += 1

orphans = sorted(set(claims) - used)
print(f"claims={len(claims)} used={len(used & set(claims))} orphans={len(orphans)}")
if orphans:
    print("orphans (not fatal):", " ".join(orphans))
print("RESULT:", "FAIL" if fail else "PASS", f"({fail} failures)")
sys.exit(1 if fail else 0)
