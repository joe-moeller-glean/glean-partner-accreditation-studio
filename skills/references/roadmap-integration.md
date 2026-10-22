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
| `Academy` / `Learning Path` / `Badge / Path` | studio queue and author job | path grouping, style card, path map |
| `Level` | author job | scaffolding depth and item mix |
| `Description` | author intake | outcome seed (never learner copy) |
| `Build Status` | `skills/scripts/plan_roadmap.py` | request type (below) |
| `Primary Audience` / `Partner Types` | author job | audience contract and scenario casting |
| `Delivery Format` | author job | package composition and media needs |
| `Duration Hours` | author job | hard runtime budget |
| `Assessment` | author job | item type and rubric selection |
| `Prerequisites` / `Dependency` | `skills/scripts/plan_roadmap.py` | dependency DAG |
| `Mapped Existing Assets` / `Source Basis` / `Existing Asset Status` | research job | starting source set and reuse-vs-rebuild call |
| `Priority` / `Program Wave` / `Target Quarter` | `skills/scripts/plan_roadmap.py` | queue ordering |
| `Current Owner` / `Recommended SME` | research job and escalation | named human for `needs_sme` |
| `Notes` | author intake | explicit constraints and revamp intent |

## Build Status → request type
| Status | Request type | Notes |
|---|---|---|
| `Ready for LMS` | `verify` | Confirm the package before any content edit |
| `Refresh needed` | `update_module` | Re-verify affected claims, then patch |
| `In development` | `create_module` | Resume from existing artifacts |
| `Planned` | `create_module` | Research before authoring |
| `Partial asset` (Existing Asset Status) | `create_module` | Reuse what is verified, rebuild the rest |
| blank / unknown | `needs_triage` | Do not guess |

## Writeback
After a successful release, update `Build Status`, released version, release date, and ZIP link where the sheet is writable; otherwise report the exact values for a human to paste. Never mark a module released without a successful publish result.
