# Learning hierarchy

An accreditation is a set of modules plus a completion rule. A module may count toward more than
one accreditation, so each module lives once and accreditations reference it by ID.

```text
learning/
├── modules/
│   ├── FND-104/              canonical SCORM source (one package per module)
│   ├── ACC-104/              capstone assessments are modules too
│   └── accred-agents/        badge overview course, referenced as overview_module
└── accreditations/
    └── accred-agents/
        └── accreditation.yaml
```

## accreditation.yaml

| Key | Meaning |
|---|---|
| `id`, `name` | Badge ID (matches the directory) and display name |
| `source` | `tracker` (Module Tracker badge table) or `composed` |
| `status` | `planned`, `in_progress`, `built`, `released`, or `retired` |
| `audience` | Primary audience |
| `required_modules` | Module IDs in tracker order, including the capstone |
| `electives` | Flexible rules: `pattern`, `min`, and the tracker `description` |
| `completion` | `assessment_module` (a required module or `null`), `assessment_type`, `mastery_score` |
| `overview_module` | Optional learner-facing badge overview module |
| `publish_mode` | Release policy for the badge |

Run `python3 skills/scripts/validate_accreditations.py`. It fails when a definition references an
unknown module, when a `built` badge references an unbuilt module, when SCORM source appears under
`accreditations/`, or when definitions drift from `plan/accreditations.json`.
