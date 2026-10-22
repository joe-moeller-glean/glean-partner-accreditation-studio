# Repository template

This directory bootstraps metadata and CI for a module repository. It is not the runtime shell.

`skills/scripts/scaffold_module.py` copies the launch file, theme, SCORM runtime, and wordmark from `shared/`. Do not put a second copy of `index.html`, CSS, or JavaScript here.

`module.json` documents the metadata fields the scaffold writes. `.github/workflows/scorm-ci.yml` is the workflow for a standalone module repository whose scripts live at that repository's `scripts/` directory.
