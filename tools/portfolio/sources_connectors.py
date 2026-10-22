#!/usr/bin/env python3
"""Source ledger and claim library for the Custom Connector accreditation.

Loads the verified ledger in plan/custom-connectors/ (sources.json, claims.json),
which tools/build_ledger.py regenerates and re-verifies verbatim against saved
source text. Exposes the same interface as sources_data.py so generate.py
builders can be reused.

Fail-closed rules:
- claims_for() raises on an unknown claim id.
- claims_for() raises on any claim that is not learner-facing (internal,
  reviewer, or field evidence). Those claims shape rubrics and cases in the
  authoring plan; they never enter a module's research/claims.json or runtime.
- A claim whose status is not verified-verbatim raises.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
LEDGER = ROOT / "plan" / "custom-connectors"
VERIFIED_ON = "2026-09-26"
CHECKED_BY = "Fact Integrity Auditor (studio)"

_src = json.loads((LEDGER / "sources.json").read_text())
_clm = json.loads((LEDGER / "claims.json").read_text())

TIER = {"T1-product-docs": 1, "T1-developer-docs": 1, "T2-program-policy": 2,
        "T2-partner-enablement": 2}


def _host(url):
    if "docs.glean.com" in url:
        return "Glean Docs (docs.glean.com)"
    if "developers.glean.com" in url:
        return "Glean Developer docs (developers.glean.com)"
    return "Glean partner document (ask your Partner Manager for access)"


SOURCES = []
for s in _src["sources"]:
    SOURCES.append({
        "source_id": s["id"],
        "title": s["title"],
        "url": s["url"],
        "owner": s["owner"],
        "datasource": "glean docs" if "glean.com" in s["url"] else "gdrive",
        "doc_updated": s["source_updated"],
        "verified_on": s["read_in_full"],
        "authority_tier": TIER.get(s["authority"], 3),
        "authority": s["authority"],
        "status": "current",
        "type": s["authority"],
        "learner_facing_allowed": s["learner_facing_allowed"],
        "public_label": _host(s["url"]),
        "notes": f"Read in full {s['read_in_full']}; review every {s['review_every_days']} days.",
        "reverify_by": "2026-12-26" if s["review_every_days"] <= 90 else "2027-03-26",
    })
SOURCES_BY_ID = {s["source_id"]: s for s in SOURCES}

CLAIMS = {}
for c in _clm["claims"]:
    CLAIMS[c["id"]] = {
        "claim_id": c["id"],
        "text": c["statement"],
        "excerpt": c["excerpt"],
        "source_ids": [c["source"]],
        "verdict": "verified" if c["status"] == "verified-verbatim" else "unsupported",
        "verified_on": c["verified_on"],
        "checked_by": CHECKED_BY,
        "learner_facing": c["learner_facing"],
    }


def claims_for(claim_ids):
    missing = [c for c in claim_ids if c not in CLAIMS]
    if missing:
        raise KeyError(f"undefined claims referenced: {missing}")
    internal = [c for c in claim_ids if not CLAIMS[c]["learner_facing"]]
    if internal:
        raise ValueError(f"internal-only claims referenced in learner content: {internal}")
    bad = [c for c in claim_ids if CLAIMS[c]["verdict"] != "verified"]
    if bad:
        raise ValueError(f"unverified claims referenced: {bad}")
    return [CLAIMS[c] for c in claim_ids]


def sources_for(claim_ids):
    sids = []
    for cid in claim_ids:
        for s in CLAIMS[cid]["source_ids"]:
            if s not in sids:
                sids.append(s)
    out = [SOURCES_BY_ID[s] for s in sorted(sids)]
    leaked = [s["source_id"] for s in out if not s["learner_facing_allowed"]]
    if leaked:
        raise ValueError(f"internal sources reached learner content: {leaked}")
    return out
