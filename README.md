# Glean Partner Accreditation Studio

SCORM 1.2 accreditation development workspace based on the Glean Partner Accreditation Studio template.

## Layout

- `skills/` — extracted studio skill, references, scripts, and repository template.
- `accreditations/` — one SCORM source tree per accreditation from the Module Tracker.
- `shared/` — reusable theme, SCORM, asset, and component sources.
- `plan/` — roadmap and build planning artifacts.
- `memory/` — studio decision and learning logs.
- `dist/` — generated SCORM 1.2 ZIP files and checksums.

Each accreditation source tree follows the template convention and can be built with:

```bash
python3 skills/scripts/build_scorm.py \
  --module accreditations/accred-foundations \
  --output dist
```

Content, source claims, assessment items, and QA evidence are intentionally left for the accreditation build workflow.
