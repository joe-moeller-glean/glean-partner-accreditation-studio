#!/usr/bin/env python3
"""Build a deterministic, runtime-only single-SCO SCORM 1.2 ZIP."""
import argparse
import hashlib
import json
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

# Authoring material is valuable in the repository but must never enter a learner ZIP.
EXCLUDE_DIRS = {"qa", "design", "research", "interactions", "assessment", "content"}
EXCLUDE_FILES = {"module.json", "module.yaml", "sources.json", "CHANGELOG.md"}
EXCLUDE_PATHS = {"assets/manifest.json", "assets/alt-text.json"}
FORBIDDEN_NAMES = {"key.json", "claims.json", "findings.md", "conflicts.md", "sources.json"}
ZIP_EPOCH = (1980, 1, 1, 0, 0, 0)


def runtime_files(module: Path):
    files = []
    for path in module.rglob("*"):
        if not path.is_file() or path.name.startswith("."):
            continue
        rel = path.relative_to(module)
        rel_posix = rel.as_posix()
        if rel.parts[0] in EXCLUDE_DIRS:
            continue
        if path.name in EXCLUDE_FILES or rel_posix in EXCLUDE_PATHS:
            continue
        files.append(rel)

    files.sort(key=lambda p: p.as_posix().lower())
    leaks = [p.as_posix() for p in files if p.name in FORBIDDEN_NAMES]
    if leaks:
        raise SystemExit("Authoring files would be shipped: " + ", ".join(leaks))
    return files


def manifest(module_id, title, launch, files):
    listed = "\n".join(
        '      <file href="' + escape(p.as_posix()) + '"/>' for p in files
    )
    mid, ttl, href = map(escape, (module_id, title, launch))
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="MANIFEST-{mid}" version="1.0" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="ORG-{mid}">
    <organization identifier="ORG-{mid}">
      <title>{ttl}</title>
      <item identifier="ITEM-{mid}" identifierref="RES-{mid}"><title>{ttl}</title></item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-{mid}" type="webcontent" adlcp:scormtype="sco" href="{href}">
{listed}
    </resource>
  </resources>
</manifest>
'''.encode("utf-8")


def write_entry(zf, name, data):
    info = zipfile.ZipInfo(name, date_time=ZIP_EPOCH)
    info.compress_type = zipfile.ZIP_DEFLATED
    info.create_system = 3
    info.external_attr = 0o100644 << 16
    zf.writestr(info, data)


def build(module: Path, out: Path):
    metadata_path = module / "module.json"
    if not metadata_path.is_file():
        raise SystemExit("Missing module.json")
    meta = json.loads(metadata_path.read_text())
    for key in ("module_id", "title", "version", "launch"):
        if not meta.get(key):
            raise SystemExit("Missing " + key)

    launch = Path(meta["launch"])
    if not (module / launch).is_file():
        raise SystemExit("Missing launch file " + launch.as_posix())

    files = runtime_files(module)
    out.mkdir(parents=True, exist_ok=True)
    zpath = out / f"{meta['module_id']}-v{meta['version']}-scorm12.zip"
    with zipfile.ZipFile(zpath, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        write_entry(zf, "imsmanifest.xml", manifest(meta["module_id"], meta["title"], meta["launch"], files))
        for rel in files:
            write_entry(zf, rel.as_posix(), (module / rel).read_bytes())

    digest = hashlib.sha256(zpath.read_bytes()).hexdigest()
    zpath.with_suffix(".zip.sha256").write_text(f"{digest}  {zpath.name}\n")
    # Keep the first output line stable for package wrappers that consume it.
    print(zpath)
    print(f"{meta['module_id']} PASS {digest[:16]} {zpath.name}")
    print("runtime files:")
    for rel in files:
        print("  " + rel.as_posix())
    print("authoring leaks: none")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--module", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    build(args.module.resolve(), args.output.resolve())
