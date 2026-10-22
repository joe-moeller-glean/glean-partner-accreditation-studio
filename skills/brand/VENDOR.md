# Vendored brand skill: Glean Branding Style 2026

This directory is a vendored copy of the **Glean Branding Style 2026** skill. It is the visual
source of truth for every module, badge overview, and accreditation surface in this studio.
`../references/brand-system.md` maps this skill onto the module theme and records the
accessibility overrides that SCORM courseware needs.

| Field | Value |
|---|---|
| Source | `Glean Branding Style 2026.zip` (supplied by Joe Moeller) |
| Source timestamp | 2026-09-21 |
| Vendored | 2026-09-25 |
| Changes | None to text, CSS, icon, or script files. Binary assets changed as listed below. |

## Binary assets

The source ZIP contained 22 PNG files: six logos, three backgrounds, and 13 reference
screenshots. All 22 were corrupted. Every non-ASCII byte had been replaced by the UTF-8
replacement sequence `EF BF BD`, so the files cannot be decoded or recovered. They are
**not** included here.

| Asset | Status |
|---|---|
| `assets/logo/glean-wordmark-electric-blue.svg` | Official vector wordmark (Electric Blue `#343CED`), approved by the owner on 2026-09-25 as the replacement for the corrupt PNG. Also placed at `shared/assets/brand/`. |
| `assets/logo/glean-wordmark-{white,black}.png`, `glean-icon-*.png` | Missing. Needed only for dark surfaces or the avatar mark. Do not recolor the blue vector to make them; get the approved files. |
| `assets/backgrounds/*.png` | Missing. Modules use the CSS corner-wash recipe from `references/COLOR.md`. To make raster backgrounds, run `scripts/glean_backgrounds.py` (needs Pillow and NumPy). |
| `assets/reference/**` | Missing. The written specs in `references/` still apply. |

To refresh the skill, replace this directory with a new, intact export. Then run
`python3 skills/scripts/lint_module.py` on every module and update `brand-system.md` if a token changed.
