# Tests

The suite runs in a container so results do not depend on your machine's browsers, Node, or
Python. The container mounts the repository read-only and works on a private copy, so a test run
never changes your checkout. Networking is disabled, so any runtime dependency on the internet
fails instead of passing by accident.

## Run

Requires Docker (Docker Desktop, or `colima start` plus `docker-compose`).

```bash
tests/run.sh                       # every stage
tests/run.sh unit packages         # selected stages
tests/run.sh --update-evidence     # full run; on success, copy SBP QA results into plan/
tests/run.sh --rebuild             # rebuild the image without cache
```

Results land in `tests/.results/` (git-ignored): `summary.txt`, a log per stage, JSON results,
SBP screenshots at 1280px and 320px for human review, and the e2e feedback history.

| Stage | What it checks |
| --- | --- |
| `unit` | Python unit tests in `tests/test_*.py`: layout, feedback store/server/API security, production isolation. |
| `build` | Regenerates SBP modules from authoring sources, runs `build_sbp.py validate`, rebuilds `dist/restricted-preview/`. |
| `packages` | `validate_scorm.py` and the feedback guard on every ZIP in `dist/`; isolation tests against the fresh packages; extracts them. |
| `runtime` | SBP SCORM runtime QA (jsdom) against the extracted **packages**, not the source folders. |
| `browser` | Chromium launches every package with a mock SCORM 1.2 API: no overlay traces, no requests outside the package, no page errors, `LMSInitialize` called. Then SBP visual QA (1280px and 320px), figure geometry QA, and screenshots. |
| `overlay` | Chromium drives the review overlay on the dev server: suggest, comment, highlight, reload and re-anchor, reply, resolve, apply, archive; confirms page text and module sources are unchanged. |

`--update-evidence` promotes `visual-qa-results.json` and `runtime-qa-results.json` to
`plan/sales-blueprinting/`, where `build_sbp.py gates` reads them.

## Without Docker

The unit tests need only Python 3 and PyYAML:

```bash
python3 -m unittest discover -s tests
```

The browser stages need the container.

## Image

`tests/container/Dockerfile` pins the Playwright base image and `tests/container/package.json`
pins `playwright` and `jsdom`. Keep the Playwright npm version equal to the image tag.
