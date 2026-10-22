# Learning hierarchy

An accreditation is a set of modules plus a completion rule. A module may count toward more than
one accreditation, so each module lives once and accreditations reference it by ID.

```text
learning/
├── modules/
│   ├── FND-104/              canonical SCORM source (one package per module)
│   ├── ACC-104/              capstone and final-exam assessments are modules too
│   ├── SBP-101/              paged-v1 continuous page
│   └── AGT-101/              scroll-canvas-v1
└── accreditations/
    ├── accred-agents/
    │   └── accreditation.yaml
    └── accred-custom-connectors/
        └── accreditation.yaml
```

Accreditation directories contain the definition only. SCORM source never goes under
`learning/accreditations/`.

How a module is researched, written, tested, and refreshed is in the repository
[README](../README.md) and [skills/SKILL.md](../skills/SKILL.md).

## Modules

Every packaged module has `module.json` and a launch file. A fully authored module also keeps
research, design, content, assessment, and QA beside that runtime. Answer keys and research stay
in the repository and out of the SCORM ZIP.

`module.json` records one design system:

- `paged-v1` is one continuous page with semantic sections and an on-page rail.
- `scroll-canvas-v1` is a native-scroll page of 8–14 bands. Progress is the deepest band reached.

Runtime files are local. A shipped module does not call the network for fonts, media, or data.

## accreditation.yaml

| Key | Meaning |
|---|---|
| `id`, `name` | Credential ID, matching the directory, and the learner-facing name |
| `source` | `tracker` when taken from the Module Tracker, or `composed` for a purpose-built definition |
| `status` | `planned`, `in_progress`, `built`, `released`, or `retired` |
| `audience` | Primary audience |
| `required_modules` | Module IDs in learner or tracker order, including the assessment module when it is required |
| `electives` | Flexible rules: `pattern`, `min`, and the tracker description |
| `completion` | `assessment_module`, `assessment_type`, `mastery_score`, and any practical or hard gates |
| `overview_module` | Optional learner-facing overview module |
| `publish_mode` | Release policy, such as `manual_review` |
| `release_state` | Optional distribution constraint, such as `restricted_preview` |
| `origin`, `source_url`, alignment fields | Traceability to the plan, tracker, or competency guide |

`status: built` means the learning assets exist and match the structural checks. Partner
distribution still depends on `release_state`, `publish_mode`, and the QA gates. A passed module
does not, by itself, award the credential when the definition requires a practical, a human
review, or an external audit.

The portfolio table in the repository [README](../README.md) summarizes the current definitions.
The YAML files remain authoritative.

Run `python3 skills/scripts/validate_accreditations.py`. It fails when a definition references an
unknown module, when a `built` accreditation references an unbuilt module, when SCORM source
appears under `accreditations/`, or when definitions drift from `plan/accreditations.json`.
