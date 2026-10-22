# Verify job

Read `skills/references/accreditation-build-standard.md`, sections 5 through 10 and 12, before testing. This job judges a module. It does not edit `content/`, `interactions/`, `assessment/`, `sources.json`, or `research/claims.json`. File defects in `qa/` and return `blocked` with the failing command output.

`repackage` rebuilds and revalidates without a content review beyond package hygiene. `verify` runs the full list below.

## Fact review

Audit body copy, SVG labels, alt text, interaction feedback, scenarios, stems, distractors, rationales, job aids, and progress language.

Verdicts: `verified`, `verified_with_rewrite` (exact replacement text only), `unsupported`, `stale`, `conflicted`.

Zero `unsupported` and zero `stale` claims are required. Every conflict needs a recorded ruling. Numbers, limits, prices, security posture, and customer references need a tier-1 or tier-2 anchor. A studio heuristic needs a visible disclosure. Write `qa/fact-report.json`. Do not invent a replacement fact and do not edit the module to make a verdict pass.

## Accessibility

Review against WCAG 2.2 AA. Keyboard completion, focus, headings, names, alt text, captions, contrast, 200% zoom, 24px targets, 3:1 control boundaries, reduced motion, and mobile completion. Severity is `blocker`, `major`, or `minor`. Blockers and majors stop release. Minors need a waiver with owner, reason, and expiry. Write `qa/a11y-report.json`. Scroll modules also need a real nav rail, one labelled h2 per band, DOM order matching scroll order, and no horizontal overflow at 320px and 390px.

## Runtime and package

Run, and record the command output:

- `skills/scripts/lint_module.py`
- `skills/scripts/build_scorm.py`
- `skills/scripts/validate_scorm.py`
- `skills/scripts/validate_accreditations.py` when membership is in scope
- the module's runtime harness under `tools/portfolio/`
- a browser pass against a local HTTP server at desktop and mobile widths

Prove launch with and without an LMS, resume, corrupt suspend data, formative incorrect-to-correct retry with no LMS write, module-quiz 4/5 pass and 3/5 fail, and an independent 10–15 item final with no reused stems or answer sets. Scroll modules also prove band progress, keyboard interactions, reduced motion, and the mobile progress treatment.

The package contains runtime files only. `assessment/key.json`, research, design, and QA stay out. Development feedback markers fail the build. Two consecutive builds of unchanged input are byte-identical. The checksum is recorded. Evidence names the build fingerprint. A new build invalidates older visual evidence until it is rerun.

Write `qa/report.json` with expected versus actual for each case.

## Release recommendation

Recommend `restricted_preview` or `blocked`. Recommend a partner release only when every content, research, clearance, runtime, visual, package, and LMS gate passed and every waiver is unexpired. Assign patch, minor, or major from the diff. The changelog matches that diff. Do not tag, merge, or publish in this job. Report the checksum and the pull request URL. Never report a release that did not happen.

## Stop

A failure that reproduces after the author job's single retry stays `blocked`. Do not fix it here. Do not rerun only the cases that passed. Do not waive a gate.
