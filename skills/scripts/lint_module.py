#!/usr/bin/env python3
"""Lint a module source directory: claim traceability, assets, brand tokens, contrast, hygiene."""
import argparse, json, re
from pathlib import Path

PALETTE = {"#343ced", "#d8fd49", "#f6f3eb", "#ffffff", "#000000", "#fff", "#000",
           "#00b207", "#ff7e4c", "#9300b8", "#1017b1", "#777767",
           "#54d848", "#ffac8c", "#e16bff", "#3fa3ff", "#c7c7ab", "transparent"}
PLACEHOLDERS = ["lorem ipsum", "todo", "tbd", "xxx", "placeholder", "coming soon", "insert text", "synthetic"]
PAIRS = [("--ink", "--surface"), ("--white", "--blue"), ("--ink", "--green"),
         ("--ink", "--oatmeal"), ("--line-control", "--surface"), ("--line-control", "--white")]


def jload(p, default=None):
    try:
        return json.loads(p.read_text())
    except Exception:
        return default


def lum(hexstr):
    h = hexstr.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        return None
    c = []
    for i in (0, 2, 4):
        v = int(h[i:i + 2], 16) / 255
        c.append(v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    la, lb = lum(a), lum(b)
    if la is None or lb is None:
        return None
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)


def resolve_token(value, tokens):
    value = (value or "").strip()
    for _ in range(6):
        match = re.fullmatch(r"var\((--[\\w-]+)\)", value)
        if not match:
            return value
        value = tokens.get(match.group(1), "").strip()
    return value


def check(mod):
    E, W = [], []
    meta = jload(mod / "module.json", {})
    for k in ("module_id", "title", "version", "launch"):
        if not meta.get(k):
            E.append(f"module.json missing {k}")
    src = jload(mod / "sources.json", {"sources": []})
    claims_doc = jload(mod / "research" / "claims.json", {"claims": []})
    source_ids = {s.get("source_id") for s in src.get("sources", [])}
    claims = {c.get("claim_id"): c for c in claims_doc.get("claims", [])}

    # source hygiene
    for s in src.get("sources", []):
        for k in ("source_id", "url", "owner", "verified_on", "authority_tier"):
            if not s.get(k):
                W.append(f"source {s.get('source_id','?')} missing {k}")
        if s.get("status") == "superseded" and not s.get("superseded_by"):
            W.append(f"source {s.get('source_id')} superseded without superseded_by")

    # claim traceability
    for cid, c in claims.items():
        if not c.get("source_ids"):
            E.append(f"claim {cid} has no source_ids")
        for sid in c.get("source_ids", []):
            if sid not in source_ids:
                E.append(f"claim {cid} references unknown source {sid}")
        if c.get("verdict") in {"unsupported", "stale", "conflicted"}:
            E.append(f"claim {cid} verdict {c['verdict']} blocks release")

    # claim references used in content, assessment, assets
    used = set()
    for p in list((mod / "content").rglob("*.json")) + list((mod / "assessment").rglob("*.json")) + \
             list((mod / "interactions").rglob("*.json")):
        used |= set(re.findall(r"\bC-\d{2,}\b", p.read_text(errors="ignore")))
    for cid in sorted(used - set(claims)):
        E.append(f"content references undefined claim {cid}")
    if claims and not used:
        W.append("no claim_ids referenced by content")

    # assets
    manifest = jload(mod / "assets" / "manifest.json", {"assets": []})
    alt = jload(mod / "assets" / "alt-text.json", {})
    alt_by_id = alt.get("by_asset_id", {}) if isinstance(alt, dict) else {}
    listed = {a.get("path") for a in manifest.get("assets", [])}
    for a in manifest.get("assets", []):
        for k in ("asset_id", "path", "purpose", "license", "created"):
            if not a.get(k):
                W.append(f"asset {a.get('asset_id','?')} missing {k}")
        has_alt = bool(a.get("alt") or alt.get(a.get("asset_id", "")) or alt_by_id.get(a.get("asset_id", "")))
        decorative_ok = bool(a.get("decorative") and (a.get("purpose") or alt_by_id.get(a.get("asset_id", ""))))
        if not has_alt and not decorative_ok:
            E.append(f"asset {a.get('asset_id','?')} missing alt text")
        for cid in a.get("claim_ids", []):
            if cid not in claims:
                E.append(f"asset {a.get('asset_id')} references undefined claim {cid}")
        f = mod / a.get("path", "")
        if a.get("path") and not f.is_file():
            E.append(f"asset file missing {a.get('path')}")
        elif f.is_file() and f.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"} and f.stat().st_size > 400_000:
            W.append(f"asset {a.get('asset_id')} over 400KB")
    for f in (mod / "assets").rglob("*"):
        if f.is_file() and f.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".svg", ".mp3", ".mp4"}:
            rel = f.relative_to(mod).as_posix()
            if rel not in listed:
                W.append(f"asset not in manifest: {rel}")
    for f in (mod / "assets").rglob("*.svg"):
        t = f.read_text(errors="ignore")
        if "<title" not in t:
            W.append(f"svg without <title>: {f.name}")
    for f in (mod / "assets").rglob("*"):
        if f.suffix.lower() in {".mp3", ".mp4", ".wav", ".webm"} and not list((mod / "assets").rglob(f.stem + ".vtt")):
            E.append(f"media without captions: {f.name}")

    # markup, style, hygiene
    web = [p for p in mod.rglob("*") if p.suffix.lower() in {".html", ".css", ".js"}]
    text = "\n".join(p.read_text(errors="ignore") for p in web)
    lower = text.lower()
    for ph in PLACEHOLDERS:
        if ph in lower:
            E.append(f"placeholder text found: {ph}")
    if re.search(r'(src|href)=["\']https?://', text, re.I):
        E.append("external runtime dependency in markup")
    if re.search(r"@import\s+url\(['\"]?https?://", text, re.I) or "fonts.googleapis" in lower:
        E.append("network font dependency")
    if "prefers-reduced-motion" not in text:
        E.append("no prefers-reduced-motion handling")
    if not re.search(r'lang=["\'][a-z]{2}', text, re.I):
        W.append("html lang attribute missing")
    if "<img" in lower and re.search(r"<img(?![^>]*alt=)", text, re.I):
        E.append("img without alt attribute")
    if re.search(r":hover", text) and not re.search(r":focus(-visible)?", text):
        W.append("hover styles without focus styles")

    css = "\n".join(p.read_text(errors="ignore") for p in mod.rglob("*.css"))
    tokens = dict(re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", css))
    for m in re.finditer(r"#[0-9a-fA-F]{3,8}\b", css):
        v = m.group(0).lower()
        line = css[:m.start()].count("\n")
        decl = css.splitlines()[line] if line < len(css.splitlines()) else ""
        if v not in PALETTE and not decl.strip().startswith("--"):
            W.append(f"off-token color literal {v}")
    for r_ in re.findall(r"border-radius\s*:\s*(\d+)px", css):
        if int(r_) > 16:
            W.append(f"corner radius {r_}px exceeds brand guidance")
    for a, b in PAIRS:
        va = resolve_token(tokens.get(a, ""), tokens)
        vb = resolve_token(tokens.get(b, ""), tokens)
        if va.startswith("#") and vb.startswith("#"):
            r2 = ratio(va, vb)
            threshold = 3.0 if a == "--line-control" else 4.5
            if r2 and r2 < threshold:
                E.append(f"contrast {a} on {b} = {r2}:1 (needs {threshold}:1)")

    # assessment hygiene
    items = jload(mod / "assessment" / "items.json", None)
    if items:
        pool = items if isinstance(items, list) else items.get("items", [])
        keys = jload(mod / "assessment" / "key.json", None)
        if keys is None:
            E.append("assessment key.json missing (keys must be separated)")
        blob = json.dumps(pool).lower()
        if '"correct"' in blob or '"is_correct": true' in blob:
            E.append("answer key leaked into items.json")
        for it in pool:
            if not it.get("objective_id"):
                W.append(f"item {it.get('id','?')} not mapped to an objective")
    return E, W


def main():
    p = argparse.ArgumentParser()
    p.add_argument("module", type=Path)
    p.add_argument("--json", type=Path, help="write findings to this path")
    a = p.parse_args()
    E, W = check(a.module.resolve())
    for e in E:
        print("ERROR", e)
    for w in W:
        print("WARNING", w)
    print("PASS" if not (E or W) else ("FAILED" if E else "FAILED (warnings block release)"))
    if a.json:
        a.json.parent.mkdir(parents=True, exist_ok=True)
        a.json.write_text(json.dumps({"errors": E, "warnings": W,
                                      "state": "pass" if not (E or W) else "fail"}, indent=2))
    return 1 if (E or W) else 0


if __name__ == "__main__":
    raise SystemExit(main())
