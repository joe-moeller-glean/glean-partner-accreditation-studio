#!/usr/bin/env python3
"""Validate SCORM 1.2 structure, runtime wiring, offline safety, and package hygiene."""
import argparse
import re
import tempfile
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    "i": "http://www.imsproject.org/xsd/imscp_rootv1p1p2",
    "a": "http://www.adlnet.org/xsd/adlcp_rootv1p2",
}
AUTHORING_DIRS = {"qa", "design", "research", "interactions", "assessment", "content"}
AUTHORING_NAMES = {"key.json", "claims.json", "findings.md", "conflicts.md", "sources.json", "module.yaml"}


DEV_FEEDBACK_MARKERS = ("data-feedback-dev", "glean-feedback-overlay", "/__feedback/", "__GLEAN_FEEDBACK__")
DEV_FEEDBACK_PATTERN = "|".join(re.escape(m) for m in DEV_FEEDBACK_MARKERS)


def runtime_text(root):
    chunks = []
    for path in root.rglob("*"):
        if path.is_file() and path.suffix.lower() in {".html", ".js", ".css", ".json", ".svg"}:
            chunks.append(path.read_text(errors="ignore"))
    return "\n".join(chunks)


def check(root):
    errors, warnings = [], []
    manifest_path = root / "imsmanifest.xml"
    if not manifest_path.is_file():
        return ["Manifest not at ZIP root"], warnings
    try:
        tree = ET.parse(manifest_path)
    except Exception as exc:
        return [f"Invalid manifest: {exc}"], warnings

    organizations = tree.find("i:organizations", NS)
    resources = tree.find("i:resources", NS)
    if organizations is None or resources is None:
        return ["Missing organizations/resources"], warnings

    orgs = organizations.findall("i:organization", NS)
    if len(orgs) != 1:
        errors.append(f"Expected exactly one organization, found {len(orgs)}")
    resources_list = resources.findall("i:resource", NS)
    sco_resources = [r for r in resources_list if r.get("{" + NS["a"] + "}scormtype") == "sco"]
    if len(sco_resources) != 1:
        errors.append(f"Expected exactly one SCO resource, found {len(sco_resources)}")

    refs = {x.get("identifierref") for x in organizations.findall(".//i:item", NS)}
    resource_ids = {x.get("identifier") for x in resources_list}
    if not refs or not refs.issubset(resource_ids):
        errors.append("Unresolved identifierref")

    listed_paths = set()
    for resource in sco_resources:
        launch = resource.get("href", "")
        if not launch or not (root / launch).is_file():
            errors.append("Missing launch " + launch)
        for file_node in resource.findall("i:file", NS):
            href = file_node.get("href", "")
            listed_paths.add(href)
            if not href or not (root / href).is_file():
                errors.append("Missing listed file " + href)

    all_files = {p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file()}
    if "imsmanifest.xml" not in all_files:
        errors.append("Manifest missing from file set")
    unlisted = sorted(all_files - listed_paths - {"imsmanifest.xml"})
    if unlisted:
        errors.append("Files present but not listed in SCO: " + ", ".join(unlisted))

    leaks = []
    for rel in all_files:
        parts = Path(rel).parts
        if parts and parts[0] in AUTHORING_DIRS:
            leaks.append(rel)
        if Path(rel).name in AUTHORING_NAMES:
            leaks.append(rel)
    if leaks:
        errors.append("Authoring files in package: " + ", ".join(sorted(set(leaks))))

    text = runtime_text(root)
    for token in (
        "LMSInitialize", "LMSGetValue", "LMSSetValue", "LMSCommit", "LMSFinish",
        "cmi.core.lesson_status", "cmi.core.lesson_location", "cmi.core.score.raw",
    ):
        if token not in text:
            errors.append("Missing runtime token " + token)

    runtime_files = [
        p for p in root.rglob("*")
        if p.is_file() and p.name != "imsmanifest.xml" and p.suffix.lower() in {".html", ".js", ".css"}
    ]
    runtime_blob = "\n".join(p.read_text(errors="ignore") for p in runtime_files)
    if re.search(r"(?:src|href)\s*=\s*[\"']https?://", runtime_blob, re.I):
        errors.append("External dependency in runtime markup")
    if re.search(r"@import\s+url\(['\"]?https?://|fonts\.googleapis|fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon", runtime_blob, re.I):
        errors.append("Network-dependent runtime call")
    # The development review overlay (tools/feedback) must never ship. Keep in sync with
    # tools/feedback/markers.py MARKERS; tests/test_production_isolation.py checks that.
    dev_markers = sorted(set(re.findall(DEV_FEEDBACK_PATTERN, text + "\n" + runtime_blob)))
    if dev_markers:
        errors.append("Development feedback overlay in package: " + ", ".join(dev_markers))
    if "prefers-reduced-motion" not in runtime_blob:
        warnings.append("Reduced-motion rule missing")
    if "aria-label" not in runtime_blob and "aria-labelledby" not in runtime_blob:
        warnings.append("No ARIA labelling token found")

    return errors, warnings


def run(target):
    if target.is_dir():
        errors, warnings = check(target)
    elif zipfile.is_zipfile(target):
        with tempfile.TemporaryDirectory() as directory:
            with zipfile.ZipFile(target) as archive:
                archive.extractall(directory)
            errors, warnings = check(Path(directory))
    else:
        print("ERROR invalid target")
        return 1

    for message in errors:
        print("ERROR", message)
    for message in warnings:
        print("WARNING", message)
    print("PASS" if not (errors or warnings) else "FAILED")
    return int(bool(errors or warnings))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("target", type=Path)
    args = parser.parse_args()
    raise SystemExit(run(args.target.resolve()))
