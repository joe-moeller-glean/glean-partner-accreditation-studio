# Glean Partner Accreditation Studio

SCORM 1.2 accreditation development workspace based on the Glean Partner Accreditation Studio template.

## Layout

- `learning/modules/<id>/` — canonical SCORM source for every module, including badge overview modules such as `accred-agents`.
- `learning/accreditations/<id>/accreditation.yaml` — badge definitions that reference modules by ID. See [learning/README.md](learning/README.md).
- `skills/` — extracted studio skill, references, scripts, and repository template.
- `shared/` — reusable theme, SCORM, asset, and component sources.
- `plan/` — roadmap and build planning artifacts. `plan/accreditations.json` is the tracker snapshot.
- `memory/` — studio decision and learning logs.
- `tools/` — generators, packagers, and QA harnesses.
- `dist/` — generated SCORM 1.2 ZIP files and checksums (not committed).

## Build and check

```bash
python3 skills/scripts/validate_accreditations.py            # hierarchy and badge membership
python3 skills/scripts/lint_module.py learning/modules/AGT-101
python3 skills/scripts/build_scorm.py --module learning/modules/AGT-101 --output dist
python3 tools/agents/package.py                               # package and validate every module
python3 -m unittest discover -s tests                         # layout tests
```

Scaffold a new module with `skills/scripts/scaffold_module.py`; it writes to `learning/modules/<id>/`.
