# Prevention rules

Mined 2026-09-03 from 38 rejection entries (threshold 3 recurrences).

- **PR-01** `off_brand` in `shared` seen 24x -> every colour in a stylesheet is either a token definition or a var() reference
- **PR-02** `license_issue` in `shared` seen 12x -> never generate the Glean logo to satisfy a broken reference - use a text label and raise the missing approved asset as a release blocker
