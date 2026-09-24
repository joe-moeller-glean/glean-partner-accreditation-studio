#!/usr/bin/env python3
"""Package each Agents module as a SCORM 1.2 ZIP.

Stages runtime-only files before calling the shared builder. The builder now
fails closed on authoring leaks and excludes module metadata, research, sources,
design, QA, assessment, interaction specs, and content source files from the
learner ZIP. Authoring sources stay in the repository; only runtime files and
referenced local assets are shipped.
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
BUILD = ROOT / ".glean" / "skills" / "glean-partner-accreditation-studio" / "scripts" / "build_scorm.py"
VALIDATE = ROOT / ".glean" / "skills" / "glean-partner-accreditation-studio" / "scripts" / "validate_scorm.py"
DIST = ROOT / "dist"

RUNTIME_FILES = ["index.html", "tokens.css", "styles.css", "scorm.js", "app.js",
                 "content.js", "module.json"]

# Keep staging and the final archive reproducible even when the source tree has
# changing filesystem mtimes. The shared builder also writes fixed ZIP metadata;
# this normalizer preserves compatibility with the older package workflow.
FIXED_DATE = (2026, 9, 2, 0, 0, 0)
FIXED_MTIME = 1788393600  # 2026-09-02T00:00:00Z


def pin_times(root: Path):
    for p in sorted(root.rglob("*")):
        os.utime(p, (FIXED_MTIME, FIXED_MTIME))
    os.utime(root, (FIXED_MTIME, FIXED_MTIME))


def normalize_zip(zpath: Path):
    """Rewrite the archive with a single fixed timestamp on every entry."""
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




def package(module_dir: Path):
    with tempfile.TemporaryDirectory() as tmp:
        stage = Path(tmp) / module_dir.name
        stage.mkdir(parents=True)
        for f in RUNTIME_FILES:
            src = module_dir / f
            if not src.is_file():
                raise SystemExit(f"{module_dir.name}: missing runtime file {f}")
            shutil.copy(src, stage / f)
        svg_src = module_dir / "assets" / "svg"
        if svg_src.is_dir() and any(svg_src.iterdir()):
            shutil.copytree(svg_src, stage / "assets" / "svg")
        pin_times(stage)
        r = subprocess.run([sys.executable, str(BUILD), "--module", str(stage),
                            "--output", str(DIST)], capture_output=True, text=True)
        if r.returncode != 0:
            print(r.stdout, r.stderr)
            raise SystemExit(f"build failed for {module_dir.name}")
        lines = [x for x in r.stdout.strip().splitlines() if x.strip()]
        zpath = Path(lines[0])
        digest = normalize_zip(zpath)
        return zpath, digest


def main():
    targets = sorted((ROOT / "modules").iterdir())
    targets = [t for t in targets if t.is_dir()]
    targets.append(ROOT / "accreditations" / "accred-agents")
    results = []
    for m in targets:
        zpath, digest = package(m)
        v = subprocess.run([sys.executable, str(VALIDATE), str(zpath)],
                           capture_output=True, text=True)
        state = v.stdout.strip().splitlines()[-1] if v.stdout.strip() else "NO OUTPUT"
        results.append((m.name, zpath.name, digest[:16], state))
        if state != "PASS":
            print(v.stdout)
    width = max(len(r[0]) for r in results)
    for name, zip_name, digest, state in results:
        print(f"{name:<{width}}  {state:<6}  {digest}  {zip_name}")


if __name__ == "__main__":
    main()
