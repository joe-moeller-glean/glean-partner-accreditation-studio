# Graphics, icon, and imagery system

Every asset is on-brand, accessible, source-anchored, and offline-packaged. A generated image may
never assert a fact — all labels, numbers, and product names are real HTML/SVG text.

## 1. Locked prompt frame

Every `image_generation` call appends this suffix verbatim:

```
clean modern editorial illustration, generous negative space, flat geometric shapes with subtle
depth, restrained palette of electric blue #343CED, bright green #D8FD49 accents, oatmeal #F6F3EB
background, black and white structure, crisp precise edges, slight rounding (8px feel), no text,
no words, no letters, no numbers, no logos, no faces, no hands, no UI screenshots, no heavy 3D
gradients, no stock-photo realism, professional enablement course visual
```

| Variant | Aspect | Budget | Used for |
|---|---|---|---|
| `header` | 16:9 | ≤250 KB | A1 cold open, A2 contract backdrop |
| `concept` | 1:1 | ≤200 KB | A3 concept canvas metaphor |
| `spot` | 1:1 small | ≤80 KB | Inline motif, glossary, callout anchor |
| `divider` | 21:9 | ≤120 KB | Stage transitions, Flow-Line-inspired band |
| `celebration` | 16:9 | ≤250 KB | A14 badge moment |

### Subject library (composed with the frame above)

| Concept | Subject phrase |
|---|---|
| Fragmented knowledge | "scattered translucent document planes drifting apart above a dark grid, one blue plane pulling the others into alignment" |
| Enterprise context layer | "layered horizontal planes of oatmeal and white with a single luminous blue lattice threading through every layer" |
| Permission inheritance | "concentric interlocking rings with selectively open apertures, blue light passing only through aligned gaps" |
| Search vs assistant vs agent | "three ascending geometric forms: a lens, a conversational arc, a self-directed looping path" |
| Agent orchestration | "modular blue blocks connecting into a branching pipeline with one green completion node" |
| Connector breadth | "a radial hub of thin blue spokes terminating in varied simple geometric endpoints" |
| Security boundary | "a crisp black boundary frame around a warm oatmeal interior with a single blue key-shaped aperture" |
| Network path | "clean isometric conduits routing between two enclosed volumes, one path highlighted blue" |
| Environment promotion | "three stepped platforms rising left to right with a blue object advancing across gates" |
| Use-case prioritization | "a scatter of geometric tiles resolving into a ranked vertical stack, top tile green" |
| Value realization | "an ascending blue arc over a baseline grid with a green terminal marker" |
| Delivery methodology | "five linked chevron plates forming a continuous path with milestone diamonds" |
| Governance / CoE | "a central blue hexagon ringed by smaller satellite hexagons joined by thin black spokes" |
| Support tiers | "three nested arcs of increasing thickness with a blue escalation vector crossing them" |
| Incident triage | "a branching decision tree of thin black lines with one illuminated blue resolution branch" |
| Industry play | "an abstract skyline of simple extruded blocks with one block lifted and highlighted blue" |
| Badge earned | "a faceted geometric medal form radiating thin green rays over oatmeal, abstract and restrained" |

## 2. Icon set (`shared/assets/icons/`)

One family, 24px grid, 2px stroke, round joins, square caps, no fills, no duotone. 48 icons.
Decorative by default (`aria-hidden`); named only when carrying the sole meaning.

**Navigation/system (10):** arrow-left, arrow-right, check, close, chevron-down, external, download,
search, menu, info
**Program (8):** badge, path, module, level, clock, target, checklist, certificate
**Platform (10):** knowledge-graph, connector, index, query, assistant, agent, action, api, model, permissions
**Security (6):** shield, lock, key, audit-log, boundary, redact
**Delivery (8):** kickoff, milestone, raid, workshop, adoption, governance, handoff, runbook
**Builder (6):** build-block, tool, trace, test, deploy, debug

Naming: `icon-<name>-24.svg`. Each ships with `<title>`. Usage sheet at
`shared/assets/icons/README.md` shows every icon, its name, and whether it is ever meaningful.

## 3. Recurring SVG diagrams (built once, reused)

Authored as inline SVG with real text labels pulled from `claims.json`. Stroke 2px, radius 8px, 8px
grid, sentence-case labels, `<title>` + `<desc>` + keyboard-reachable text equivalent panel.

| ID | Diagram | Semantic color use | Consumers |
|---|---|---|---|
| `DGM-ARCH-01` | Platform architecture: clients → query engine → knowledge graph → connectors → data sources | blue = Glean path, black = structure, oatmeal = customer context | FND-103, TEC-101, TEC-102, BLD-101 |
| `DGM-CONSTRUCT-01` | Construct decision tree: search / assistant / prompt / agent / action / connector / integration | blue = chosen path, cement = pruned branches | FND-104, FND-105, BLD-102 |
| `DGM-PERM-01` | Permission inheritance from source app → index → query-time filter | black = boundary, blue = allowed flow | FND-103, TEC-102, TEC-103 |
| `DGM-DEPLOY-01` | Glean-hosted vs customer-hosted (cloud-prem) topology | `--cat-1` vs `--cat-3` for the two models | TEC-101, TEC-104, TEC-106/108 |
| `DGM-NET-01` | Data path: allowlisting, proxy, DNS, private connectivity | blue = data path, `--cat-2` = failure point | TEC-104, OPS-102 |
| `DGM-ENV-01` | Sandbox → pre-prod → prod with promotion gates | green = passed gate | TEC-105, OPS-105 |
| `DGM-CONN-01` | Connector lifecycle: prerequisites → auth → scopes → crawl → validate | blue = happy path, `--cat-2` = common failure | TEC-201, BLD-201, BLD-202 |
| `DGM-AGENT-01` | Agent anatomy: trigger → context → tools → steps → memory → output | one `--cat-*` per component class | BLD-101…BLD-104, BLD-207/208, SRV-204 |
| `DGM-DELIVERY-01` | Delivery methodology stages with roles and artifacts | blue = stage, oatmeal = artifact | SRV-101…SRV-104, ACC-105 |
| `DGM-VALUE-01` | Pain → use case → outcome → measured value chain | green = realized outcome | SOL-101, SOL-103, SRV-201 |
| `DGM-COE-01` | CoE structure, workstreams, cadence | one `--cat-*` per workstream | SRV-202, OPS-106 |
| `DGM-SUPPORT-01` | L1/L2/Glean escalation with evidence gates | blue = escalation vector | OPS-103, OPS-104, SRV-203 |
| `DGM-PATH-MAP` | The portfolio path map (per path variant) | blue = current, green = earned, cement = locked | every module footer |

## 4. Badge artwork (8 badges, `shared/assets/badges/`)

Abstract faceted geometric medals, no text baked in (badge name is HTML). Common: 8px-feel
faceting, oatmeal ground, thin black structural lines, `--green` earned-state ray accent.

| Badge | Form motif | Accent |
|---|---|---|
| Glean Foundations | Single solid hexagon, one facet lifted | `--blue` |
| Seller / Seller Advanced | Upward chevron stack of 3 | `--blue` + `--green` tip |
| Technical Advisor | Interlocking lens + arc | `--blue` on `--cat-1` |
| Solution Architect | Layered isometric plates | `--dark-blue` |
| Builder | Modular blocks forming a keystone | `--cat-4` node |
| Delivery Lead | Chevron path with milestone diamond | `--blue` |
| Support & Adoption | Nested arcs with a shield notch | `--cat-2` accent |
| Industry Specialist | Extruded skyline facet cluster | one `--cat-*` per vertical |

Advanced/Expert tiers reuse the base form with an added ring (Advanced) or double ring (Expert).

## 5. Screenshots

Real captures only — never generated, never imitation UI. Crop to the relevant region, annotate with
numbered `--blue` circular callouts (white numerals, 24px), caption `Captured YYYY-MM`, register a
90-day re-verify date in `sources.json`. Redact all customer and personal data. Modules that depend
on captures: FND-103, FND-104, FND-105, TEC-102, TEC-202, BLD-102, BLD-103, BLD-104, BLD-204,
SRV-204, OPS-101, OPS-102, OPS-103.

## 6. Alt text patterns (`assets/alt-text.json`)

| Asset type | Pattern |
|---|---|
| Decorative header/divider | `""` + `aria-hidden="true"` |
| Concept illustration | One sentence naming the concept, not the shapes: "Enterprise context as a single layer threading through every application." |
| Diagram | Short alt naming what it shows + `<desc>` long description + visible text-equivalent panel listing nodes and edges in reading order |
| Screenshot | "Glean <surface> showing <the specific state the learner must notice>. Captured 2026-09." |
| Badge | "<Badge name> badge, earned." |

## 7. Manifest + budgets

Every asset gets an `assets/manifest.json` row: `asset_id`, path, type, purpose, `screen_id`,
generator (`image_generation` / SVG author / capture), prompt or capture source, license, creator,
created date, `claim_ids`, alt text, byte size.

Budgets: package ≤20 MB · single raster ≤400 KB · hero ≤250 KB · SVG preferred wherever text or
structure appears · zero runtime network fetches · media ships `.vtt` + transcript, never autoplays.

Naming: `<MODULE>-<variant>-<slug>-v<n>.<ext>` (e.g. `FND-104-concept-construct-ladder-v1.png`),
`DGM-*.svg` for shared diagrams, `icon-*-24.svg` for icons.
