# Recall brief - BLD-104

Generated 2026-09-02

## Release history (0)
- none

## Prior rejections (3) - do not repeat
- [off_brand] shared/components/app.js: data-state value "todo" for unvisited path-map steps tripped the placeholder gate. | prevention: never use todo, tbd, xxx, or placeholder as a code identifier or attribute value in a shipped module; the placeholder gate matches source text, not intent
- [off_brand] shared/theme/styles.css: Bare #333 and #444 colour literals inherited from the repository template. | prevention: every colour in a stylesheet is either a token definition or a var() reference
- [license_issue] shared/components/index.html: Template header referenced assets/img/glean-wordmark.svg, which does not exist in this repository. | prevention: never generate the Glean logo to satisfy a broken reference - use a text label and raise the missing approved asset as a release blocker

## Open recommendations (2) - honor or explicitly decline
- sme_review: Route to David Seeber, the tracker's named owner for Advanced Agent Building, before release. (review 2026-09-16)
- assessment/calibration: Review live pass rates after 30 completions; rewrite any item below 30% or above 95%. (review 2026-12-01)

## Prevention rules in force
# Prevention rules

Mined 2026-09-02 from 36 rejection entries (threshold 3 recurrences).

- **PR-01** `off_brand` in `shared` seen 24x -> every colour in a stylesheet is either a token definition or a var() reference
- **PR-02** `license_issue` in `shared` seen 12x -> never generate the Glean logo to satisfy a broken reference - use a text label and raise the missing approved asset as a release blocker
