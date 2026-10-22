"""Development-only markers for the review overlay, and the production guard that rejects them.

Everything the feedback framework adds to a page carries one of these markers. The dev server
injects them at response time; nothing is written into learning/modules. Packagers, the SCORM
validator, and the containerized test suite call `scan_package` / `scan_tree` so a SCORM ZIP
that contains any marker fails before it can ship.
"""
from __future__ import annotations

import re
import zipfile
from pathlib import Path

# Attribute on every injected element, the custom element hosting the overlay UI, the URL prefix
# of the dev server's overlay and API routes, and the global the overlay sets.
ATTRIBUTE = "data-feedback-dev"
HOST_ELEMENT = "glean-feedback-overlay"
ROUTE_PREFIX = "/__feedback/"
GLOBAL = "__GLEAN_FEEDBACK__"

MARKERS = (ATTRIBUTE, HOST_ELEMENT, ROUTE_PREFIX, GLOBAL)
_PATTERN = re.compile("|".join(re.escape(m) for m in MARKERS))
TEXT_SUFFIXES = {".html", ".htm", ".js", ".mjs", ".css", ".json", ".svg", ".xml", ".txt"}


def scan_text(text: str) -> list[str]:
    """Return the distinct markers found in a text blob."""
    return sorted(set(_PATTERN.findall(text)))


def scan_package(zip_path: Path) -> list[str]:
    """Return 'member: marker' findings for a SCORM ZIP. Empty means clean."""
    findings = []
    with zipfile.ZipFile(zip_path) as zf:
        for name in zf.namelist():
            if Path(name).suffix.lower() not in TEXT_SUFFIXES:
                continue
            text = zf.read(name).decode("utf-8", errors="ignore")
            findings += [f"{name}: {m}" for m in scan_text(text)]
    return findings


def scan_tree(root: Path, skip_dirs=()) -> list[str]:
    """Return 'path: marker' findings for text files under a directory (an extracted package or a module)."""
    findings = []
    root = Path(root)
    for path in sorted(root.rglob("*")):
        rel = path.relative_to(root)
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        if rel.parts and rel.parts[0] in skip_dirs:
            continue
        findings += [f"{rel.as_posix()}: {m}" for m in scan_text(path.read_text(errors="ignore"))]
    return findings


if __name__ == "__main__":
    import sys

    bad = 0
    for arg in sys.argv[1:] or ["dist"]:
        p = Path(arg)
        targets = sorted(p.rglob("*.zip")) if p.is_dir() else [p]
        for z in targets:
            found = scan_package(z)
            if found:
                bad += 1
                print(f"FAIL {z}: " + "; ".join(found[:5]))
        print(f"scanned {len(targets)} package(s) under {p}")
    sys.exit(1 if bad else 0)
