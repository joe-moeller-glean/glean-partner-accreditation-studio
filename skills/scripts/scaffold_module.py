#!/usr/bin/env python3
"""Scaffold a module directory. Runtime files come from shared/, not a second template shell."""
import argparse, json, shutil, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import learning_layout  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SHARED = ROOT / "shared"
SHELL = {
    "index.html": SHARED / "components" / "index.html",
    "tokens.css": SHARED / "theme" / "tokens.css",
    "styles.css": SHARED / "theme" / "styles.css",
    "app.js": SHARED / "components" / "app.js",
    "scorm.js": SHARED / "scorm" / "scorm.js",
    "assets/brand/glean-wordmark-electric-blue.svg": SHARED / "assets" / "brand" / "glean-wordmark-electric-blue.svg",
}
DIRS = ["content/lessons", "content/screens", "content/bands", "content/scenarios", "content/feedback", "design", "research",
        "interactions", "assessment", "assets/img", "assets/svg", "assets/media", "qa", "intake"]


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
    for rel, src in SHELL.items():
        if not src.is_file():
            raise SystemExit(f"missing shared shell file: {src}")
        target = dest / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(src, target)
    if a.design_system == "scroll-canvas-v1":
        scroll_css = SHARED / "theme" / "scroll-canvas.css"
        if scroll_css.is_file():
            shutil.copy(scroll_css, dest / "scroll-canvas.css")

    scroll = a.design_system == "scroll-canvas-v1"
    navigation = (
        "single-page native scroll; progress is the deepest band reached"
        if scroll
        else "single continuous page with semantic sections and an on-page rail"
    )
    sections_key = "bands" if scroll else "sections"

    (dest / "module.json").write_text(json.dumps({
        "module_id": a.module_id, "title": a.title, "version": a.version,
        "launch": "index.html", "mastery_score": a.mastery, "scorm_version": "1.2",
        "design_system": a.design_system, "release_state": "restricted_preview",
        "assessment_type": "Module quiz: 5 of 8 items, 80%"}, indent=2) + "\n")
    (dest / "module.yaml").write_text(
        f"module_id: {a.module_id}\ntitle: {a.title}\nlearning_path: {a.path}\n"
        f"request_type: single\ndesign_system: {a.design_system}\naudience: []\nlevel: \nlearning_outcomes: []\nprerequisites: []\n"
        f"target_hours: {a.duration_hours}\nmastery_score: {a.mastery}\n"
        f"assessment_type: Module quiz - draw 5 of 8; one formative MCQ per lesson\n"
        f"source_owners: []\npublish_mode: manual_review\nrelease_state: restricted_preview\n"
        f"navigation: {navigation}\n")
    (dest / "sources.json").write_text(json.dumps({"module_id": a.module_id, "sources": []}, indent=2) + "\n")
    (dest / "design" / "blueprint.yaml").write_text(
        f"module_id: {a.module_id}\ndesign_system: {a.design_system}\nobjectives: []\n"
        "default_sequence: [overview, lesson_1, lesson_2, lesson_3, lesson_4, toolkit, module_quiz]\n"
        "lesson_contract: [decision_or_model, why_and_when, sequence_or_criteria, worked_application, guardrail, formative_mcq]\n"
        f"{sections_key}: []\n"
        f"assessment: {{formative_per_lesson: 1, module_bank: 8, module_draw: 5, mastery_score: {a.mastery}}}\n")
    (dest / "design" / "experience.yaml").write_text(
        f"design_system: {a.design_system}\n"
        f"navigation: {navigation}\n"
        "archetypes: []\nmotion_budget: {T3: 1}\nresponsive: {mobile_first: true, qa_widths: [1280, 320]}\n")
    (dest / "research" / "claims.json").write_text(json.dumps({"module_id": a.module_id, "claims": []}, indent=2) + "\n")
    (dest / "research" / "coverage.md").write_text(
        "# Research coverage\n\n| Objective | Research question | Source IDs | Owner | Exact anchor | Distribution | Gap |\n"
        "|---|---|---|---|---|---|---|\n")
    (dest / "assessment" / "model.yaml").write_text(
        f"mastery_score: {a.mastery}\nformative:\n  per_lesson: 1\n  options: 4\n  retry_until_correct: true\n"
        "  writes_lms_score: false\nmodule_quiz:\n  bank: 8\n  draw: 5\n  attempts: 2\n"
        "final_exam:\n  separate_exam_only_bank: true\n  items: 15\n  reuse_formative_or_module_items: false\n")
    (dest / "assets" / "manifest.json").write_text(json.dumps({"module_id": a.module_id, "assets": []}, indent=2) + "\n")
    (dest / "assets" / "alt-text.json").write_text(json.dumps({}, indent=2) + "\n")
    (dest / "qa" / "waivers.json").write_text(json.dumps({"waivers": []}, indent=2) + "\n")
    (dest / "intake" / "gaps.md").write_text("# Intake gaps\n\nNone recorded at scaffold time.\n")
    (dest / "CHANGELOG.md").write_text(
        f"# {a.module_id} {a.title}\n\n## {a.version} - unreleased\n"
        f"- Scaffolded with {a.design_system}. Runtime shell copied from shared/.\n"
        "- Authoring files are repository-only; the SCORM builder excludes them.\n")
    print(f"scaffolded {dest}")


if __name__ == "__main__":
    main()
