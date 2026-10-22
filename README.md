# Glean Partner Accreditation Studio

Development workspace for researching, designing, building, testing, and maintaining Glean partner
accreditations as offline-safe SCORM 1.2 learning modules.

The repository separates **reusable modules** from **accreditation definitions**. A module is built
and released as one SCORM package. An accreditation references a set of module IDs and defines the
rules for earning the credential; it does not contain copies of those modules.

## Learning model

```text
Accreditation / credential
├── optional overview module
├── required learning modules
├── optional elective rule(s)
├── assessment or capstone module
└── completion and release policy
```

The important organizational rules are:

1. **One module, one canonical source directory, one SCORM ZIP.** A batch release is a collection of
   independent module packages, never one merged accreditation ZIP.
2. **Accreditations reference modules by ID.** A module can count toward multiple accreditations
   without being copied or nested.
3. **Assessment and overview experiences are modules too.** Capstones such as `ACC-104` and a
   learner-facing overview such as `accred-agents` live in `learning/modules/` and package normally.
4. **Credential completion can extend beyond SCORM status.** An accreditation may require a human
   review, practical, hard gates, or another external decision. A passed SCO does not necessarily
   award the credential.
5. **Authoring evidence stays outside shipped packages.** Research, answer keys, QA reports, source
   ledgers, and review feedback remain in the repository. Packages contain runtime files only.

See [learning/README.md](learning/README.md) for the concise hierarchy and schema reference.

## Repository structure

```text
.
├── learning/
│   ├── modules/<module-id>/                 canonical module source and runtime
│   └── accreditations/<accreditation-id>/
│       └── accreditation.yaml               credential membership and completion rules
├── plan/                                    portfolio and authoring plans
│   ├── accreditations.json                  tracker snapshot used for drift validation
│   ├── accreditations/                      accreditation-level plans
│   ├── modules/                             module-level plans
│   ├── queue.json                           ordered build queue
│   ├── status.json                          resumable portfolio status
│   ├── dependency-graph.json                prerequisites and build ordering
│   ├── sales-blueprinting/                  SBP source workbook, lessons, and QA evidence
│   └── feedback-history/                    archived review decisions, when created
├── shared/
│   ├── theme/                               shared tokens and visual styling
│   ├── scorm/                               reusable SCORM runtime code
│   ├── assets/                              approved reusable media
│   └── components/                          proven reusable UI components
├── skills/                                  studio playbook, references, and core scripts
├── tools/                                   program-specific generators, QA, packaging, review
│   ├── agents/                              agent accreditation build and QA tools
│   ├── feedback/                            development-only review framework
│   └── sbp/                                 AI Blueprinting build and QA tools
├── tests/                                   unit, package-isolation, browser, and container tests
├── memory/                                  project decisions and reusable lessons
└── dist/                                    generated SCORM ZIPs and checksums; not source
```

### Source-of-truth boundaries

| Concern | Source of truth | Notes |
| --- | --- | --- |
| Module identity and build metadata | `learning/modules/<id>/module.json` | ID, title, version, launch file, mastery score, design system, and delivery metadata. |
| Module authoring and runtime | `learning/modules/<id>/` plus program-specific authoring under `plan/` | Some generators produce module runtime from structured plans; edit the authoring source, then regenerate. |
| Accreditation membership | `learning/accreditations/<id>/accreditation.yaml` | Required modules, electives, completion rules, overview module, and publish policy. |
| Portfolio tracker snapshot | `plan/accreditations.json` | Validated against definitions to detect organizational drift. |
| Shared runtime and design elements | `shared/` | Promote a component only after it has proven reusable. |
| Built packages | `dist/` | Generated output. Do not treat ZIP contents as editable source. |
| Review queue | `.feedback/feedback.db` | Local and git-ignored. Applied or rejected feedback is archived under `plan/feedback-history/`. |

## Module organization

A fully authored module can use the following structure. Generated or legacy modules may use only
the files their builder requires, but every packaged module needs `module.json` and its launch file.

```text
learning/modules/<id>/
├── module.json                 build metadata and launch contract
├── module.yaml                 intake brief and authoring contract
├── sources.json                vetted sources and verification dates
├── research/                   findings, claims, and conflicts
├── design/                     learning blueprint, experience, and storyboard
├── content/                    lessons, scenarios, feedback, and glossary
├── interactions/               interaction specifications and handlers
├── assessment/                 items, key, and rubric; authoring-only files stay out of ZIP
├── assets/                     local images, diagrams, icons, media, and alt text
├── qa/                         fact, accessibility, runtime, and waiver evidence
├── index.html                  typical SCORM launch document
└── CHANGELOG.md                version history
```

Modules use either:

- `paged-v1` for screen-at-a-time lessons with explicit navigation; or
- `scroll-canvas-v1` for a continuous native-scroll experience.

The selected design system belongs in module metadata and authoring design files. All runtime assets
must be local; shipped modules must not depend on network calls, remote fonts, or hosted media.

### Module ID families

The prefix identifies the learning family or role in the portfolio:

| Prefix | Family or role | Examples |
| --- | --- | --- |
| `FND` | Foundations | `FND-104` |
| `AGT` | Agents | `AGT-101` |
| `BLD` | Builder | `BLD-101`, `BLD-208` |
| `SBP` | AI Blueprinting & Value Mapping | `SBP-101`, `SBP-200`, `SBP-FINAL` |
| `SOL`, `SRV` | Solution and services topics | `SOL-203`, `SRV-204` |
| `ACC` | Cross-module assessment or capstone | `ACC-104`, `ACC-107` |
| `accred-*` | Learner-facing accreditation overview module | `accred-agents` |

Numeric levels generally communicate progression: `100` foundation, `200` applied/intermediate,
and `300` advanced or capstone. The accreditation definition, not the prefix alone, determines
credential membership.

## Accreditation organization

Each accreditation has one definition at:

```text
learning/accreditations/<accreditation-id>/accreditation.yaml
```

Accreditation directories contain definitions only. SCORM source must never appear under
`learning/accreditations/`.

### Definition fields

| Field | Purpose |
| --- | --- |
| `id`, `name` | Stable credential ID and learner-facing name. The ID matches the directory. |
| `source` | `tracker` when derived from the roadmap tracker, or `composed` for a purpose-built definition. |
| `status` | Portfolio lifecycle: `planned`, `in_progress`, `built`, `released`, or `retired`. |
| `audience` | Intended learner roles. |
| `required_modules` | Canonical module IDs in learner or tracker order, including capstones when required. |
| `electives` | Optional flexible requirements such as a module pattern and minimum count. |
| `completion` | Assessment module, assessment type, mastery score, and any practical or hard gates. |
| `overview_module` | Optional learner-facing overview module ID. |
| `publish_mode` | Credential release policy, such as manual review. |
| `release_state` | Optional distribution constraint independent of build status, such as `restricted_preview`. |
| `origin`, `source_url`, alignment fields | Traceability to the plan, tracker, or supporting roadmap. |

`status: built` means the defined learning assets exist and satisfy the repository's structural
expectations. It does **not** imply that the credential is cleared for partner distribution.
`release_state`, `publish_mode`, review gates, and QA evidence control that decision.

### Current accreditation portfolio

This table summarizes the definitions currently under `learning/accreditations/`. The YAML files are
authoritative if this summary changes.

| Accreditation ID | Name | Status | Required modules | Completion / assessment | Distribution note |
| --- | --- | ---: | ---: | --- | --- |
| `accred-agents` | Agents | built | 11 | `ACC-104` | Includes overview module `accred-agents`. |
| `accred-ai-blueprinting` | AI Blueprinting & Value Mapping | built | 15 | `SBP-FINAL`, plus the `SBP-200` human-scored practical and hard gates | Restricted preview; manual review. |
| `accred-builder` | Builder | planned | 7 | `ACC-104` | Planned definition. |
| `accred-delivery-lead` | Delivery Lead | planned | 7 | `ACC-105` | Planned definition. |
| `accred-foundations` | Glean Foundations | planned | 4 | Defined in YAML | Planned definition. |
| `accred-industry-specialist` | Industry Specialist | planned | 2 | Defined in YAML | Planned definition. |
| `accred-seller-seller-advanced` | Seller / Seller Advanced | planned | 5 | `ACC-101` | Planned definition. |
| `accred-solution-architect` | Solution Architect | planned | 7 | `ACC-103` | Planned definition. |
| `accred-support-adoption` | Support & Adoption | planned | 6 | `ACC-106` | Planned definition. |
| `accred-technical-advisor` | Technical Advisor | planned | 6 | `ACC-102` | Planned definition. |

A planned definition can reference roadmap modules that have not been built yet. A built definition
must reference built module sources. `validate_accreditations.py` enforces those relationships and
checks the definitions against `plan/accreditations.json`.

## Development and release flow

```text
plan and source research
        ↓
module brief and vetted claim set
        ↓
learning architecture and experience design
        ↓
content, interaction, assessment, and graphics production
        ↓
fact, editorial, brand, accessibility, and runtime QA
        ↓
runtime-only SCORM 1.2 package
        ↓
restricted review / LMS test / release approval
        ↓
one module release plus checksum and history
```

The studio uses strict gates. Unsourced learner-facing claims, unresolved package warnings,
network-dependent runtime behavior, answer-key leaks, major accessibility defects, or missing visual
browser evidence block release. A module can be built and packaged for restricted testing while its
accreditation remains unreleased.

## Build and check

```bash
# Validate accreditation hierarchy, membership, and tracker alignment.
python3 skills/scripts/validate_accreditations.py

# Check and package one module.
python3 skills/scripts/lint_module.py learning/modules/AGT-101
python3 skills/scripts/build_scorm.py --module learning/modules/AGT-101 --output dist

# Program-specific batch packaging.
python3 tools/agents/package.py
python3 tools/sbp/build_sbp.py validate
python3 tools/sbp/build_sbp.py package

# Tests.
tests/run.sh                                                  # full containerized suite
python3 -m unittest discover -s tests                         # unit tests only, no Docker

# Confirm no development feedback code entered a package.
python3 tools/feedback/cli.py guard dist
```

The containerized suite is documented in [tests/README.md](tests/README.md). It rebuilds in a private
copy, validates and extracts packages, runs runtime checks against packaged output, launches packages
in Chromium with a mock SCORM 1.2 API, runs responsive and figure QA, and exercises the feedback
workflow end to end.

## Run and test with Colima and Docker

The full suite uses Docker Compose. On macOS, Colima provides the local Docker daemon without
requiring Docker Desktop. The test image pins Playwright, Chromium, Firefox, WebKit, Node, jsdom,
Python, and PyYAML so browser and package checks run consistently.

### Prerequisites

Install the Docker CLI, Docker Compose, and Colima using your preferred package manager. Confirm the
commands are available:

```bash
colima version
docker version
docker compose version
```

The repository supports the `docker compose` plugin and the standalone `docker-compose` command.
The first image build downloads the pinned Playwright base image, which is approximately 2 GB.

### Start the Docker daemon

```bash
# Start the Colima virtual machine and Docker daemon.
colima start

# Confirm Colima and Docker are ready.
colima status
docker context show
docker info
```

`colima start` normally selects the `colima` Docker context. If Docker points elsewhere and cannot
reach the daemon, select it explicitly:

```bash
docker context use colima
docker info
```

### Run the suite

Run commands from the repository root:

```bash
# Build or reuse the test image and run every stage.
tests/run.sh

# Run selected stages in their normal order.
tests/run.sh unit
tests/run.sh unit build packages
tests/run.sh build packages runtime browser overlay

# Rebuild the test image without Docker's build cache, then run all stages.
tests/run.sh --rebuild

# Run all tests and, only if they pass, promote current SBP runtime and visual
# evidence into plan/sales-blueprinting/.
tests/run.sh --update-evidence
```

Available stages are:

| Stage | Purpose |
| --- | --- |
| `unit` | Python layout, feedback-store/API, security, and production-isolation tests. |
| `build` | Regenerates, validates, and packages the SBP modules in the container's private workspace. |
| `packages` | Validates every SCORM ZIP, runs the feedback-code guard, and extracts packages for later stages. |
| `runtime` | Runs deterministic SBP runtime QA against extracted production packages. Requires `packages` in the same run. |
| `browser` | Launches packages in Chromium with a mock SCORM 1.2 API, then runs responsive, visual, and figure QA. Requires `packages`. |
| `overlay` | Exercises the development feedback workflow end to end in Chromium. |

The wrapper builds `tests/container/Dockerfile` and invokes
`tests/container/docker-compose.yml`. The repository is mounted read-only; the suite copies it into
a private container workspace before generating files. Container networking is disabled during the
test run, so a shipped runtime that depends on an external URL fails instead of passing silently.

### Run through Docker Compose directly

The wrapper is preferred because it detects Compose, builds the image, creates the results directory,
and handles evidence promotion. For debugging, the equivalent direct commands are:

```bash
# Build the pinned test image.
docker compose -f tests/container/docker-compose.yml build tests

# Run the complete suite.
docker compose -f tests/container/docker-compose.yml run --rm tests

# Run one or more stages.
docker compose -f tests/container/docker-compose.yml run --rm tests unit
docker compose -f tests/container/docker-compose.yml run --rm tests build packages runtime browser
```

Do not run `runtime` or `browser` alone through separate Compose invocations: extracted packages live
in that invocation's private workspace. Include `packages` before them in the same command.

### Results

Generated results are written to `tests/.results/`, which is git-ignored:

```text
tests/.results/
├── summary.txt                    pass/fail status by stage
├── unit.log                       Python test output
├── build.log                      generation and package-build output
├── packages.log                   package validation and isolation output
├── runtime.log                    deterministic runtime QA output
├── browser.log                    production browser, visual, and figure QA output
├── overlay.log                    feedback workflow end-to-end output
├── prod-smoke-results.json        package-level Chromium results
├── overlay-e2e-results.json       review workflow results
└── sbp/
    ├── runtime-qa-results.json
    ├── visual-qa-results.json
    ├── figure-qa-results.json
    └── screenshots/               1280px and 320px screenshots for human review
```

Check the summary first, then inspect the log and JSON for any failed stage:

```bash
cat tests/.results/summary.txt
```

### Stop or troubleshoot Colima

```bash
# Stop the VM when finished.
colima stop

# Restart a daemon that is stopped or unresponsive.
colima stop --force
colima start

docker info
```

If `docker info` reports that it cannot connect, verify `colima status` and the active Docker context.
If Colima reports that its disk is already in use, stop the existing instance with
`colima stop --force` before restarting it. Do not manually remove Colima lock or disk files. A
`colima delete` recreates the VM and deletes its local images and containers, so use it only as an
intentional last resort.

## Development review feedback

```bash
python3 tools/feedback/cli.py serve
```

The local review server lets reviewers comment on accreditation definitions and module pages,
highlight text, suggest redline edits, reply, and resolve feedback. It stores the active queue in
local SQLite. Applying or rejecting an item removes it from SQLite and appends its history to
`plan/feedback-history/<scope>.md`.

The overlay is development-only. It is injected into HTTP responses without modifying module files,
and SCORM validators and packagers reject packages containing any overlay marker. See
[tools/feedback/README.md](tools/feedback/README.md).

## Adding content

### Scaffold a module

```bash
python3 skills/scripts/scaffold_module.py <arguments>
```

The script writes to `learning/modules/<id>/`. Select a stable ID, preserve screen/objective/question
IDs across versions, register its accreditation relationship in metadata where appropriate, and add
it to an accreditation definition only when the membership is intentional.

### Add or change an accreditation

1. Create or update `learning/accreditations/<id>/accreditation.yaml`.
2. Reference canonical IDs from `learning/modules/`; never copy module source into the accreditation.
3. Define completion honestly, including external practicals and human review.
4. Update the tracker snapshot or authoring plan when it is the source of the change.
5. Run `python3 skills/scripts/validate_accreditations.py`.
6. Build and test each changed module independently.
7. Keep the accreditation restricted until its policy, content, QA, clearance, and LMS gates pass.
