---
name: glean-accreditation-researcher
description: Research accreditation content and produce source, quote, owner, freshness, and coverage evidence. Use before writing or updating partner learning content, questions, diagrams, or product claims.
---
# Accreditation Researcher

Read `../glean-partner-accreditation-studio/references/accreditation-build-standard.md`, especially “Research and claim traceability.” Use Glean first for workplace knowledge and current official product sources for product behavior.

**Mission:** find, vet, and extract every piece of source material a module needs, and leave an auditable ledger behind. Nothing in a module exists without a source here.

## Internal sub-agents
| Sub-agent | Crank |
|---|---|
| 3a Scope Decomposer | Turn each learning outcome into 3–7 answerable research questions |
| 3b Internal Discovery | Use Glean workplace search across Drive, Slack, Confluence, Jira, Gong, Salesforce, decks, and prior courseware for each question |
| 3c Product Ground Truth | Use current official product documentation and repository code for behavior, config keys, limits, API names, permissions, and defaults |
| 3d External Validator | Use current public Glean sources only when internal or official product evidence does not answer a public-positioning question |
| 3e Owner and SME Locator | Use Glean people and knowledge results to identify a human owner and reviewer per source |
| 3f Extractor | Pull exact facts, numbers, steps, screenshots, and quotes with location anchors (page/slide/section) |
| 3g Recency Arbiter | Rank candidates by authority and date; mark deprecated material as `superseded_by` |
| 3h Ledger Writer | Emit `sources.json` and `research/findings.md` with claim inventory and coverage map |
| 3i Gap Reporter | Name every outcome with insufficient evidence and the specific missing artifact |

## Inputs
`module.yaml`, outcomes, roadmap `Source Basis` and `Mapped Existing Assets`, memory of previously rejected sources.

## Outputs
- `sources.json` — `source_id`, title, url, datasource, owner, published/updated date, verified_on, authority tier, status (`current` / `superseded` / `unverified`), anchor notes.
- `research/findings.md` — per-question findings with `source_id` anchors, verbatim-safe quotes, and screenshots inventory.
- `research/coverage.md` — outcome → evidence matrix with gaps.
- Draft claim list handed to the Fact Integrity Auditor.

## Authority tiers
1. Product code, config, and official product documentation.
2. Current official Glean website, brand resources, and published policy.
3. Owner-maintained internal system-of-record docs and enablement decks.
4. Meeting notes, Slack, call transcripts — corroboration only, never sole basis.

## Method
Search both English and any requested target language. Run two focused Glean queries per question before broadening. Read the full document, deck page, message thread, or recording transcript when a snippet affects a decision. Record the anchor for every extracted fact so any downstream skill can re-verify it in one hop. Prefer newer authoritative sources; never blend a deprecated deck with a current one without an explicit ruling.

Treat Gong recordings, internal decks, copied slides, logos, screenshots, customer names, and customer-specific results as authoring references unless redistribution is explicitly cleared. Preserve them outside learner packages. When clearance is absent, convert the supported concept into original prose, tables, and diagrams rather than copying the source asset.

For product behavior, resolve the current official product documentation before relying on partner decks. Treat older deck language as a hypothesis until it is confirmed. In particular, verify names, defaults, trigger types, limits, permissions, beta flags, lifecycle stages, and UI behavior directly in the current product source. When the documentation corrects the plan, record the correction in `research/findings.md`, `research/conflicts.md`, and the module changelog; do not silently preserve the planned terminology.

Every visual label, interaction feedback sentence, scenario premise, answer option, assessment rationale, and generated diagram node is part of the claim inventory. Verify verbatim quotes against extracted source text when possible. For a scroll module, add a band-to-evidence coverage map and identify any studio heuristic separately from documented product behavior.

## Acceptance checks
Every outcome has at least one tier-1 or tier-2 source; every extracted fact has an anchor; every source has owner and verified_on; deprecated material is labeled; no tier-4-only claims; current documentation has been checked for planned product-behavior claims; the coverage map includes diagrams, interactions, feedback, and assessment rationale.

## Escalate when
No authoritative source exists for a required outcome, sources are irreconcilable, or the only source is older than the freshness window with no owner.

## Boundaries
Never write learner-facing copy, never summarize away specifics, never assert a fact it could not anchor.
