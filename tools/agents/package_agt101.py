#!/usr/bin/env python3
"""Package AGT-101 as a reproducible SCORM 1.2 ZIP.

Why this exists separately from tools/agents/package.py: that script stages
assets from assets/svg/, which is the layout the earlier paged modules used.
AGT-101 keeps its renders at assets/*.svg and its icon set at assets/icons/*.svg,
and the icons are inlined into content.js at compile time, so they must not be
shipped as separate files.

What is deliberately NOT shipped: assessment/key.json (the answer key),
research/, sources.json, design/, content/, interactions/, qa/, module.yaml.
Those are authoring inputs. Shipping assessment/ would put the answer key in
the learner's browser.
"""
import hashlib
import os
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SKILL = ROOT / "skills" / "scripts"
BUILD = SKILL / "build_scorm.py"
VALIDATE = SKILL / "validate_scorm.py"
DIST = ROOT / "dist"
MODULE = ROOT / "modules" / "AGT-101"

RUNTIME_FILES = ["index.html", "tokens.css", "styles.css", "scorm.js",
                 "app.js", "content.js", "module.json"]

# Only the renders the page actually references with <img src>.
RUNTIME_ASSETS = ["hero-flow.svg", "agent-anatomy.svg"]

FIXED_DATE = (2026, 9, 2, 0, 0, 0)
FIXED_MTIME = 1788393600


def pin_times(root: Path):
    for p in sorted(root.rglob("*")):
        os.utime(p, (FIXED_MTIME, FIXED_MTIME))
    os.utime(root, (FIXED_MTIME, FIXED_MTIME))


def normalize_zip(zpath: Path) -> str:
    with zipfile.ZipFile(zpath) as z:
        entries = [(i, z.read(i.filename)) for i in z.infolist()]
    tmp = zpath.with_suffix(".zip.tmp")
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as out:
        for info, data in entries:
            fixed = zipfile.ZipInfo(info.filename, date_time=FIXED_DATE)
            fixed.compress_type = zipfile.ZIP_DEFLATED
            fixed.external_attr = info.external_attr
            out.writestr(fixed, data)
    tmp.replace(zpath)
    digest = hashlib.sha256(zpath.read_bytes()).hexdigest()
    zpath.with_suffix(".zip.sha256").write_text(f"{digest}  {zpath.name}\n")
    return digest


def build() -> tuple:
    with tempfile.TemporaryDirectory() as tmp:
        stage = Path(tmp) / MODULE.name
        stage.mkdir(parents=True)
        for f in RUNTIME_FILES:
            src = MODULE / f
            if not src.is_file():
                raise SystemExit(f"missing runtime file: {f}")
            shutil.copy(src, stage / f)
        (stage / "assets").mkdir()
        for a in RUNTIME_ASSETS:
            src = MODULE / "assets" / a
            if not src.is_file():
                raise SystemExit(f"missing runtime asset: {a}")
            shutil.copy(src, stage / "assets" / a)

        # guard: the answer key must never reach the package
        for p in stage.rglob("*"):
            if p.name == "key.json":
                raise SystemExit("refusing to build: answer key staged")

        pin_times(stage)
        r = subprocess.run([sys.executable, str(BUILD), "--module", str(stage),
                            "--output", str(DIST)], capture_output=True, text=True)
        if r.returncode != 0:
            print(r.stdout, r.stderr)
            raise SystemExit("build failed")
        lines = [x for x in r.stdout.strip().splitlines() if x.strip()]
        zpath = Path(lines[0])
        return zpath, normalize_zip(zpath)


def main():
    zpath, digest = build()
    v = subprocess.run([sys.executable, str(VALIDATE), str(zpath)],
                       capture_output=True, text=True)
    state = v.stdout.strip().splitlines()[-1] if v.stdout.strip() else "NO OUTPUT"
    if state != "PASS":
        print(v.stdout)
        print(v.stderr)
    print(f"AGT-101  {state}  {digest[:16]}  {zpath.name}")

    with zipfile.ZipFile(zpath) as z:
        names = sorted(z.namelist())
    print("package contents:")
    for n in names:
        print("  " + n)
    leaks = [n for n in names if "key.json" in n or "sources.json" in n
             or n.startswith("research/") or n.startswith("assessment/")]
    print("authoring leaks:", leaks or "none")


if __name__ == "__main__":
    main()
