# Master build plan — 83 modules, 8 accreditations, 3 waves

Mode: `roadmap`. Source of truth: Partner Accreditation & Competency Roadmap, Module Tracker tab
(83 rows, extracted to `plan/roadmap-export/tab-02-module-id.csv`).

## 1. Portfolio shape

| Cut | Counts |
|---|---|
| Total modules | 83 |
| Waves | Wave 1 = 26, Wave 2 = 30, Wave 3 = 27 |
| Priority | Critical 17, High 46, Medium 20 |
| Level | 100 = 25, 200 = 52, 300 = 6 |
| Build status | Planned 58, Refresh needed 10, Ready for LMS 8, In development 6, Not Planned 1 (TEC-107) |
| Academies | Builders 12, Technical 11, Services 10, Sales 8, Industry 8, Department 8, Foundations 7, Solutions 7, Ops 6, Accreditations 6 |
| Request types from status map | single 64, refresh 10, qa_only 8, needs_triage 1 |

Total runtime across the portfolio is ~88 authored hours; the design must hold each module to its
tracker `Duration Hours` (±15%), cutting scope rather than compressing comprehension.

## 2. Execution order

`plan/queue.json` is authoritative and already ordered by wave → priority → dependency depth →
module ID, then re-sorted so prerequisites always precede dependents. The graph is acyclic
(verified by `plan_roadmap.py`, which hard-fails on cycles).

**Wave 1 opening tranche (sequence 1–11, all Critical):**
FND-101 → FND-102 → FND-103 → SAL-101 → SRV-101 → TEC-101 → SAL-103 → SAL-203 → SRV-102 → TEC-102 → SRV-103

FND-103 is the highest-leverage node in the portfolio: SAL-101, TEC-101, FND-104 and FND-106 all
depend on it, and the entire Seller/Architect/Builder chain sits behind it. It is a `refresh`, not a
net-new build, so it must be first-in-queue after the two program modules.

**Structural chokepoints (build these on time or whole paths stall):**
| Module | Unblocks |
|---|---|
| FND-103 Platform Overview & Demo | SAL-101, TEC-101, FND-104, FND-106 (→ nearly everything) |
| TEC-101 Technical Deep Dive | TEC-102…TEC-108, TEC-201/202/203, BLD-101 |
| SOL-101 Outcome Mapping | SOL-102, DEP-101…DEP-108 (8 modules) |
| SOL-202 Industry Design Patterns | IND-101…IND-107 (7 modules), SOL-203 |
| BLD-101 Building with Glean | BLD-102/104/203/205/206 |
| SRV-102 Delivery Methodology | SRV-103/104/105/201/202 |

## 3. Concurrency and budgets

- 3 modules in flight (5 max), 1 release at a time, 1 in flight for `repair`.
- 4 contracts in flight per module; each contract ≤45 minutes of equivalent work.
- Retries: 1 per contract, 2 per gate per module, then escalate.
- Circuit breaker: 2 consecutive release failures or 3 identical gate failures halts the run.
- A module needing >2 research extensions is marked `needs_sme` and the queue moves on.

## 4. Request-type playbooks

| Type | Modules | Phase path |
|---|---|---|
| `qa_only` (8) | FND-101, SAL-103, SRV-101, SRV-102, SRV-103, SRV-201, SRV-202, SRV-204 | 0→1→3(light)→9→10→11(repackage)→12→13→14. No new instructional design unless QA finds a defect. |
| `refresh` (10) | FND-102, FND-103, FND-106, SAL-101, SAL-102, TEC-101, BLD-102, BLD-104, BLD-201, SOL-101 | Full 0→14 but reuse stable IDs; version is minor unless outcomes change. |
| `single` (64) | all Planned (58) + In development (6) | Full 0→14 pipeline. |
| `needs_triage` (1) | TEC-107 (Azure Reference Patterns, status "Not Planned") | Do not build. Ask the human once whether Azure ships with AWS/GCP or is deliberately deferred. |

## 5. Flags that must be resolved before content

- **`needs_sme` on 68 modules** — the tracker has no `Current Owner` or `Recommended SME` for them.
  Named owners that do exist: Jess Eurich (FND-103), David Seeber (SAL-101, TEC-101, BLD-104),
  Eugene Wiehahn (BLD-201), Katya Alfaro (SRV-101/102/103/201/202/204).
  Route the 10 post-sales playbook modules to Katya Alfaro, the technical/builder chain to
  David Seeber and Eugene Wiehahn, and the platform overview chain to Jess Eurich. Everything else
  needs one consolidated SME-assignment question to the human — not 68 separate ones.
- **`needs_research_first`** — none. Every row has either a `Source Basis` or a mapped asset.
- **21 modules carry `Source Basis: Proposed expansion` with `No asset`** — these are net-new authoring
  jobs and must not be scheduled before their research contract returns two authoritative sources.

## 6. Wave tranches and reporting

Report per tranche, never per file.

| Tranche | Modules | Badge outcome |
|---|---|---|
| W1-A Program spine | FND-101, FND-102, FND-103, FND-107 | **Glean Foundations badge closes** |
| W1-B Seller core | SAL-101, SAL-102, SAL-103, SAL-203 | Seller badge 4/5 (waits on ACC-101) |
| W1-C Delivery core | SRV-101, SRV-102, SRV-103, SRV-104 | Delivery Lead 4/7 |
| W1-D Architect core | TEC-101…TEC-105, TEC-201 | Solution Architect 6/7 (waits on ACC-103) |
| W1-E Construct layer | FND-104, FND-105, FND-106, BLD-101, BLD-102 | Feeds Builder + Solutions |
| W2-A Solutions | SOL-101…SOL-103, SOL-201, SOL-204, ACC-102 | **Technical Advisor badge closes** |
| W2-B Builder | BLD-103, BLD-104, BLD-201, BLD-202, BLD-203, BLD-204 | Builder 6/7 |
| W2-C Services adv. | SRV-105, SRV-201, SRV-202, SRV-203, SRV-205, ACC-105 | **Delivery Lead badge closes** |
| W2-D Seller adv. | SAL-201, SAL-202, SAL-204, SAL-205, ACC-101 | **Seller/Seller Advanced badge closes** |
| W2-E Architect adv. | TEC-106, TEC-108, TEC-202, TEC-203, ACC-103 | **Solution Architect badge closes** |
| W3-A Ops | OPS-101…OPS-106, ACC-106 | **Support & Adoption badge closes** |
| W3-B Builder expert | BLD-205…BLD-208, ACC-104 | **Builder badge closes** |
| W3-C Industry | SOL-202, SOL-203, IND-101…IND-107, IND-201 | **Industry Specialist badge closes** |
| W3-D Department | DEP-101…DEP-108 | Department Specialist badge |

## 7. Gate ledger (all required, none self-waivable)

scope · identifier resolution · source traceability + freshness · claim verification · learning
alignment · editorial quality · brand conformance · graphics conformance · accessibility (WCAG 2.2 AA)
· SCORM structure · runtime behavior · regression vs prior release · offline/security · release metadata.

Deterministic gates: `scripts/lint_module.py <module>` and `scripts/validate_scorm.py <zip>`.
Both must exit 0. `lint_module.py` fails on warnings too — that is intentional.

Per-module definition of done:
```
sources.json (≥2 authoritative, owner + verified_on)   research/claims.json (all verdict=verified)
design/blueprint.yaml  design/experience.yaml  design/storyboard.md
content/screens/*  content/scenarios/*  content/feedback/*  content/glossary.json  content/job-aid.md
interactions/INT-*.json + .js       assessment/items.json + key.json + rubric.md
assets/** + assets/manifest.json + assets/alt-text.json (every asset has alt text + license)
qa/fact-report.json  qa/a11y-report.json  qa/report.json  (waivers.json only if justified)
dist/<id>-v<version>-scorm12.zip + .sha256    CHANGELOG.md    ledger entry written
```

## 8. Freshness windows (enforced by Fact Integrity)

| Claim class | Window | Applies to |
|---|---|---|
| Product behavior, limits, connector counts, security posture, pricing | 90 days | FND-103/104/105, TEC-*, BLD-*, OPS-* |
| Program, policy, badge, partner economics | 180 days | FND-101/102/107, SAL-204, ACC-* |
| Conceptual/methodology | 365 days | SOL-*, SRV-*, DEP-*, IND-* |

Screenshots re-verify at 90 days and carry a `Captured YYYY-MM` caption.

## 9. Human decisions required (ask once, consolidated)

1. SME assignment for the 68 `needs_sme` modules (proposed routing in §5).
2. TEC-107 Azure: build with AWS/GCP or keep "Not Planned"?
3. Mastery score confirmation: default 80% across all accreditation modules?
4. Whether Industry Specialist requires named IND modules or any 2+ (tracker says "2+ IND modules").
5. PolySans license files for packaging — otherwise every module ships DM Sans fallback.
6. Publish target: LMS SCORM library path + GitHub `owner/repo` for source of record.

## 10. Known defect in the bundled repository template

`skills/assets/repository-template/styles.css` contains off-token color literals (`#333`, `#444`) that
fail the studio's own `scripts/lint_module.py` brand check, and `scaffold_module.py` does not copy
`tokens.css` into a new module. Both must be fixed in `shared/theme/` before the first module build,
otherwise every module inherits a guaranteed lint failure. Verified by running:

```bash
python3 skills/scripts/lint_module.py accreditations/accred-foundations  # pre-restructure path; now learning/modules/<id>
# WARNING off-token color literal #333 / #444 -> FAILED
```

