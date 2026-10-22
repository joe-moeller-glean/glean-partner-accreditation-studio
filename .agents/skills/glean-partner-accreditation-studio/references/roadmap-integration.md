# Roadmap integration

Source of record: **Partner Accreditation & Competency Roadmap** (Google Sheets) — `Program Blueprint` tab for paths, `Module Tracker` tab for modules.

## Program Blueprint fields
`Lifecycle Phases`, `Accreditation Path`, `Goal`, `Primary audiences`, `Competency Map`, `Initial module count`, `Launch wave focus`.

Paths include Foundations, Sales & GTM, Solutions & Value, Technical & Architecture, Builders & Integrations, Service Delivery, and Operations & Support, mapped to lifecycle phases and partner types (VAR, Boutique, GSI, ISV, SI, Cloud, Services, Technology).

## Module Tracker columns
`Module ID`, `Academy`, `Learning Path`, `Level`, `Module Title`, `Description`, `Build Status`, `Primary Audience`, `Partner Types`, `Delivery Format`, `Duration Hours`, `Badge / Path`, `Assessment`, `Prerequisites`, `Mapped Existing Assets`, `Source Basis`, `Existing Asset Status`, `Priority`, `Program Wave`, `Target Quarter`, `Current Owner`, `Recommended SME`, `Dependency`, `Notes`.

## Column → studio mapping
| Column | Used by | As |
|---|---|---|
| `Module ID` | all | canonical `module_id` and repo directory |
| `Academy` / `Learning Path` / `Badge / Path` | Portfolio Planner, Experience Designer | path grouping, style card, path map |
| `Level` | Learning Architect, Assessment Builder | scaffolding depth and item mix |
| `Description` | Intake | outcome seed (never learner copy) |
| `Build Status` | Portfolio Planner | request type (below) |
| `Primary Audience` / `Partner Types` | Intake, Content | audience contract and scenario casting |
| `Delivery Format` | SCORM Engineer, Graphics and Media | package composition and media needs |
| `Duration Hours` | Learning Architect | hard runtime budget |
| `Assessment` | Assessment Builder | item type and rubric selection |
| `Prerequisites` / `Dependency` | Portfolio Planner | dependency DAG |
| `Mapped Existing Assets` / `Source Basis` / `Existing Asset Status` | Researcher | starting source set and reuse-vs-rebuild call |
| `Priority` / `Program Wave` / `Target Quarter` | Portfolio Planner | queue ordering |
| `Current Owner` / `Recommended SME` | Researcher, escalation ladder | named human for `needs_sme` |
| `Notes` | Intake | explicit constraints and revamp intent |

## Build Status → request type
| Status | Request type | Notes |
|---|---|---|
| `Ready for LMS` | `qa_only` then `repackage` | Verify before touching content |
| `Refresh needed` | `refresh` | Re-verify all claims; honor revamp notes |
| `In development` | `single` (continue) | Resume from existing artifacts |
| `Planned` | `single` (net-new) | Full research required first |
| `Partial asset` (Existing Asset Status) | `single` | Reuse what is verified, rebuild the rest |
| blank / unknown | `needs_triage` | Do not guess |

## Writeback
After a successful release, update `Build Status`, released version, release date, and ZIP link where the sheet is writable; otherwise report the exact values for a human to paste. Never mark a module released without a successful publish result.
