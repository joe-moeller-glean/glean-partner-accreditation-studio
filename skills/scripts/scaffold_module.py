#!/usr/bin/env python3
"""Scaffold a module directory from the repository template with IDs wired."""
import argparse, json, shutil, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import learning_layout  # noqa: E402

TEMPLATE = Path(__file__).resolve().parent.parent / "assets" / "repository-template"
DIRS = ["content/screens", "content/bands", "content/scenarios", "content/feedback", "design", "research",
        "interactions", "assessment", "assets/img", "assets/svg", "assets/media", "qa"]


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--module-id", required=True)
    p.add_argument("--title", required=True)
    p.add_argument("--repo-root", type=Path, default=Path("."))
    p.add_argument("--version", default="0.1.0")
    p.add_argument("--path", default="")
    p.add_argument("--duration-hours", default="")
    p.add_argument("--mastery", type=int, default=80)
    p.add_argument("--design-system", choices=("paged-v1", "scroll-canvas-v1"), default="paged-v1")
    a = p.parse_args()

    dest = learning_layout.module_dir(a.repo_root, a.module_id)
    if dest.exists():
        raise SystemExit(f"{dest} already exists")
    for d in DIRS:
        (dest / d).mkdir(parents=True, exist_ok=True)
    for f in ("index.html", "styles.css", "app.js", "scorm.js"):
        src = TEMPLATE / f
        if src.is_file():
            shutil.copy(src, dest / f)

    (dest / "module.json").write_text(json.dumps({
        "module_id": a.module_id, "title": a.title, "version": a.version,
        "launch": "index.html", "mastery_score": a.mastery, "scorm_version": "1.2",
        "design_system": a.design_system}, indent=2))
    (dest / "module.yaml").write_text(
        f"module_id: {a.module_id}\ntitle: {a.title}\nlearning_path: {a.path}\n"
        f"request_type: single\ndesign_system: {a.design_system}\naudience: []\nlevel: \nlearning_outcomes: []\nprerequisites: []\n"
        f"target_hours: {a.duration_hours}\nmastery_score: {a.mastery}\nassessment_type: \n"
        f"source_owners: []\npublish_mode: automatic_after_green\n"
        f"navigation: {'single-page native scroll' if a.design_system == 'scroll-canvas-v1' else 'paged'}\n")
    (dest / "sources.json").write_text(json.dumps({"module_id": a.module_id, "sources": []}, indent=2))
    (dest / "design" / "blueprint.yaml").write_text(
        f"module_id: {a.module_id}\ndesign_system: {a.design_system}\nobjectives: []\n"
        f"{'bands' if a.design_system == 'scroll-canvas-v1' else 'screens'}: []\nassessment: {{items: [], mastery_score: {a.mastery}}}\n")
    (dest / "design" / "experience.yaml").write_text(
        f"design_system: {a.design_system}\n"
        f"navigation: {'single-page native scroll' if a.design_system == 'scroll-canvas-v1' else 'paged'}\n"
        "archetypes: []\nmotion_budget: {T3: 1}\nresponsive: {mobile_first: true}\n")
    (dest / "research" / "claims.json").write_text(json.dumps({"module_id": a.module_id, "claims": []}, indent=2))
    (dest / "assets" / "manifest.json").write_text(json.dumps({"module_id": a.module_id, "assets": []}, indent=2))
    (dest / "assets" / "alt-text.json").write_text(json.dumps({}, indent=2))
    (dest / "qa" / "waivers.json").write_text(json.dumps({"waivers": []}, indent=2))
    (dest / "CHANGELOG.md").write_text(
        f"# {a.module_id} {a.title}\n\n## {a.version} - unreleased\n"
        f"- Scaffolded with {a.design_system}.\n"
        "- Authoring files are repository-only; the SCORM builder excludes them.\n")
    print(f"scaffolded {dest}")


if __name__ == "__main__":
    main()
