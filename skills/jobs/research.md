# Research job

Read `skills/references/accreditation-build-standard.md`, section 4, before searching. This job finds and records evidence. It does not write learner-facing copy, screens, or quiz items.

## Outputs

- `sources.json` with `source_id`, title, url, datasource, owner, published or updated date, `verified_on`, authority tier, distribution limits, status (`current`, `superseded`, or `unverified`), and anchor notes.
- `research/findings.md` with per-question findings, source anchors, and verbatim-safe quotes.
- `research/coverage.md` mapping each outcome to evidence, including diagrams, interactions, feedback, and assessment rationale. Name every gap and the missing artifact.
- `research/conflicts.md` when sources disagree.
- A draft claim list in `research/claims.json`. Verification of the assembled module happens in the verify job.

## Authority

1. Product code, config, and official product documentation.
2. Current official Glean website, brand resources, and published policy.
3. Owner-maintained internal system-of-record docs and enablement decks.
4. Meeting notes, Slack, and call transcripts. Corroboration only. Never the sole basis for a claim.

Freshness windows: product behavior 90 days, program and policy 180 days, conceptual material 365 days. Default is 180 days.

## Method

1. Turn each learning outcome into 3–7 answerable questions.
2. Search Glean workplace knowledge first. Run two focused queries per question before broadening. Read the full document, deck page, thread, or transcript when a snippet affects a decision.
3. For product behavior, confirm names, defaults, trigger types, limits, permissions, beta flags, lifecycle stages, and UI behavior in current official documentation or code. Treat older deck language as a hypothesis until that check.
4. Use public Glean sources only when internal or official product evidence does not answer a public-positioning question.
5. Record an owner and a reviewer for each source.
6. Mark deprecated material as `superseded_by`. Do not blend a deprecated deck with a current source without a written ruling.
7. Keep Gong recordings, internal decks, copied slides, logos, screenshots, customer names, and customer-specific results as authoring references unless redistribution is explicitly cleared. When clearance is absent, the later author job converts the concept into original prose and diagrams.

Search both English and any requested target language. Record the anchor so a later job can re-verify in one hop.

## Acceptance

Every outcome has at least one tier-1 or tier-2 source, or the job returns `blocked`. Every extracted fact has an anchor. Every source has an owner and `verified_on`. No claim rests on tier 4 alone. Product-behavior claims have been checked against current documentation.

## Stop

Return `blocked` when no authoritative source exists, sources are irreconcilable, or the only source is outside its freshness window and has no owner. Do not invent a replacement fact.
