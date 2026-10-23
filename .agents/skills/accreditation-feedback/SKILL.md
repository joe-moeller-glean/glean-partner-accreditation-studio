---
name: accreditation-feedback
description: >-
  Applies open review comments to Glean partner accreditation definitions and
  module content. Use when the user asks to update based on the feedback,
  apply review comments, work the feedback queue, or make an accreditation
  or module match its comments. Uses Glean when a comment needs product or
  source context. Updates layout and interaction code when the comment is
  structural or visual. Clears applied comments from the local SQLite review
  database.
---
# Accreditation feedback

Update accreditation and module materials from the open review queue, then remove those comments from SQLite. Do not publish, tag, or push.

Read `skills/references/accreditation-build-standard.md` before changing learner-facing words. Read `skills/jobs/author.md` when the edit changes lesson copy, assessment items, or an accreditation definition.

## Load the queue

```bash
python3 tools/feedback/cli.py export --format json
python3 tools/feedback/cli.py export --accreditation <id> --format json
python3 tools/feedback/cli.py export --scope <module-or-accreditation-id> --format json
```

Use the scope the user named. If they did not name one, export the open queue and work every item. Each item includes the quote, comment, suggested replacement, section, and authoring `sources` (`path:line`, with `(generated)` when the match is compiled output).

A highlight with an empty comment is not an edit. Leave it in the database and list it in the report.

## Decide the kind of change

| Comment | Do this |
|---|---|
| Wording, fact, product behavior, process, metric, menu path, or a suggested replacement of learner text | Content. Edit the authoring source. Use Glean before writing a fact. |
| Layout, spacing, color, type, diagram structure, component behavior, interaction, or the review overlay | Structural or visual. Edit the code. Do not call Glean unless the same comment also asks about a product fact. |
| Accreditation membership, order, audience, or completion rules | Edit `learning/accreditations/<id>/accreditation.yaml`. Use Glean only when the comment depends on a program or product rule you cannot see in the repo. |

Group items by module or accreditation. Change only the surface the comment names. Preserve `SCR-`, `BAND-`, `OBJ-`, `INT-`, `Q-`, `C-`, and `SRC-` IDs.

## Content changes

1. Open the first authoring path from `sources` that is not marked `(generated)`. When every hit is generated, search `plan/` for the quote and edit that file. For Sales Blueprinting lessons, edit `plan/sales-blueprinting/lessons/<module-id>.md`, then run `python3 tools/sbp/build_sbp.py generate`. For other generated modules, change the spec named in `skills/jobs/author.md` and regenerate. Do not hand-edit compiled `content.js` to sneak in a wording change.
2. When the comment states or changes a product fact, process, metric, or menu path, search Glean before rewriting it. Use `search` for the current doc, then `read_document` on the best official source. Use `chat` only when the comment needs more than one source. Prefer current product documentation over a deck. Do not invent behavior, metrics, or customer names. Keep a `claim_id` on every changed factual sentence.
3. A suggested edit (`kind` is `suggestion`) replaces the quoted text with `replacement` when that replacement does not contradict a current source. If it does, leave the comment in SQLite and say why.
4. Run `python3 skills/scripts/lint_module.py learning/modules/<id>` after a module content edit. Fix lint failures that are in scope.

## Structural and visual changes

Edit the stylesheet, script, layout, or graphic that produces the commented surface. Follow the existing brand tokens. Do not change learner facts while adjusting layout. For the review overlay, edit only `tools/feedback/` and keep it out of SCORM packages.

## Clear applied comments

After the edit for a comment is in the tree, remove that comment from SQLite. `apply` writes `plan/feedback-history/<scope>.md` and deletes the row from `.feedback/feedback.db` in one step:

```bash
python3 tools/feedback/cli.py apply FB-... FB-... --note "What changed"
```

Clear only comments whose change landed. Leave blocked comments in the database. Then confirm:

```bash
python3 tools/feedback/cli.py list --status open
```

The applied IDs must be absent. Do not delete the database file.

## Report

List each comment ID, whether it was content or structural, the file changed, the Glean source used (or none), and whether `apply` removed it from SQLite. Name any comment left open and why.
