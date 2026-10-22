# Studio patterns

Observed while building the Agents accreditation (2026-09-02, 12 packages).

## Gate failures that recur

1. **Placeholder scan matches code, not prose.** Attribute values and identifiers named `todo` fail the gate. Name states `upcoming`, `pending_review`, or similar.
2. **Template stylesheets carry off-token colours.** The repository template ships `#333` and `#444`. Tokenise before generating modules or every module inherits the warning.
3. **Templates reference assets that do not exist.** `assets/img/glean-wordmark.svg` is referenced but absent. Resolve asset existence before the build gate, and never generate a logo to close the gap.

## Structural lessons

- **Generate, do not hand-author, at batch scale.** 12 packages from one spec set means a gate fix is one regeneration, not 12 edits.
- **Separate the claim library from module specs.** Facts changed once propagate everywhere; module specs stay readable.
- **Lint is necessary but not sufficient.** `lint_module.py` never executes the runtime. A DOM-shim harness (`tools/portfolio/runtime_qa.js`) caught behaviour the linter cannot see: quiz scoring, retry paths, resume, progress honesty, and archetype pacing.
- **Read the build script's exclude list before trusting it.** It shipped answer keys.

## Content discipline that held up

- Every performance figure is attributed to its reporting source rather than stated as a platform guarantee.
- Distractors are drawn from real partner mistakes in the source material, which makes feedback teachable rather than punitive.
- Role-based scenarios avoid invented customer names without going abstract.
