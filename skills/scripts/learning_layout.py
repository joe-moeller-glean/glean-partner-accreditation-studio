#!/usr/bin/env python3
"""Shared paths and loaders for the learning/ hierarchy.

Layout:
    learning/modules/<MODULE-ID>/                  canonical, reusable SCORM module source
    learning/accreditations/<id>/accreditation.yaml credential definition that references modules

A module may belong to several accreditations, so modules are never nested inside an
accreditation. The accreditation definition is the source of truth for membership.
"""
from __future__ import annotations

import fnmatch
import json
from pathlib import Path

LEARNING_DIR = "learning"
MODULES_DIR = f"{LEARNING_DIR}/modules"
ACCREDITATIONS_DIR = f"{LEARNING_DIR}/accreditations"
DEFINITION_FILE = "accreditation.yaml"


def modules_root(repo_root: Path) -> Path:
    return Path(repo_root) / MODULES_DIR


def accreditations_root(repo_root: Path) -> Path:
    return Path(repo_root) / ACCREDITATIONS_DIR


def module_dir(repo_root: Path, module_id: str) -> Path:
    return modules_root(repo_root) / module_id


def module_dirs(repo_root: Path) -> list[Path]:
    """Every built or scaffolded module directory (one with module.json)."""
    root = modules_root(repo_root)
    if not root.is_dir():
        return []
    return sorted(p for p in root.iterdir() if p.is_dir() and (p / "module.json").is_file())


def _yaml():
    try:
        import yaml  # type: ignore
    except ImportError as exc:  # pragma: no cover - environment guard
        raise SystemExit("PyYAML is required: python3 -m pip install pyyaml") from exc
    return yaml


def load_accreditation(path: Path) -> dict:
    data = _yaml().safe_load(Path(path).read_text()) or {}
    data.setdefault("required_modules", [])
    data.setdefault("electives", [])
    data.setdefault("completion", {})
    data.setdefault("overview_module", None)
    return data


def load_accreditations(repo_root: Path) -> list[dict]:
    root = accreditations_root(repo_root)
    if not root.is_dir():
        return []
    return [load_accreditation(p / DEFINITION_FILE)
            for p in sorted(root.iterdir()) if (p / DEFINITION_FILE).is_file()]


def module_ids(accreditation: dict) -> list[str]:
    """Explicit modules needed for the badge: required modules plus any overview module."""
    ids = list(accreditation["required_modules"])
    if accreditation.get("overview_module"):
        ids.append(accreditation["overview_module"])
    return ids


def elective_matches(accreditation: dict, candidates) -> dict[str, list[str]]:
    return {e["pattern"]: sorted(c for c in candidates if fnmatch.fnmatch(c, e["pattern"]))
            for e in accreditation["electives"]}


def accreditations_for_module(repo_root: Path, module_id: str) -> list[str]:
    return [a["id"] for a in load_accreditations(repo_root) if module_id in module_ids(a)]


def tracker_view(accreditation: dict) -> dict:
    """Shape a definition like a plan/accreditations.json entry (tracker order and wording)."""
    entry = {
        "name": accreditation["name"],
        "directory": accreditation["id"],
        "required_modules": list(accreditation["required_modules"])
        + [e["description"] for e in accreditation["electives"]],
    }
    for key in ("origin", "competency_alignment", "source_url"):
        if key in accreditation:
            entry[key] = accreditation[key]
    return entry


def read_json(path: Path) -> dict:
    return json.loads(Path(path).read_text())
