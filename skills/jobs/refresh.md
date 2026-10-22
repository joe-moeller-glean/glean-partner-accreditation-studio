# Refresh job

Read `skills/references/accreditation-build-standard.md`, section 11, and `skills/references/memory-and-learning.md`. This job looks for drift and proposes work. It does not edit module content, packages, or releases.

## Method

1. Read the ledger for the modules in scope. Do not re-propose a rejected change unless the evidence is new, and cite the prior rejection.
2. Run `skills/scripts/watch_sources.py`. It applies the freshness windows: product behavior 90 days, program and policy 180 days, conceptual material 365 days.
3. Re-check product-behavior claims against current product documentation, not only a source's modified date. A changed trigger, mode, limit, permission, beta flag, or lifecycle term is drift even when the old deck is unchanged.
4. Check broken links, missing assets, and screenshots past their capture window.
5. Score each finding by learner impact, claim centrality, and audience size: `critical`, `high`, `medium`, or `low`.
6. Drop cosmetic source edits that do not change a claim.

## Outputs

- `plan/refresh-queue.json`, one proposed job per impacted module.
- `monitoring/scan-<date>.md` with the drift, impact, proposed job type, and ledger context.

Proposed job types, smallest first: `update_module` for a named ID, then a broader `update_module`, and `create_module` only when the module no longer matches its outcomes. Batch a shared terminology or asset fix into one job when the same change applies to several modules.

## Cadence

Use this when a person or a future runner asks for a scan. This procedure does not create a schedule.

| When asked | Check |
|---|---|
| Weekly | Source drift and link integrity on released modules |
| Monthly | Freshness against the windows above |
| Quarterly | Assessment quality, brand drift, and design-system conformance |
| After a product or program change | Claims that mention the changed behavior |

A `critical` inaccuracy is reported in the same run with the module owner and a proposed hotfix job. The scan still does not unpublish or edit the module.

## Acceptance

Every proposal names the module ID, the affected claim or asset IDs, the evidence, and the job type. No proposal edits content. No proposal repeats a rejection without new evidence.

## Stop

Return the queue. Do not start the author job from this procedure. The studio dispatcher opens those jobs separately.
