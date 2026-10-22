# Review feedback (development only)

A Google Docs–style review layer for accreditation and module pages. Reviewers select text and
add a **comment**, a **suggested edit** (redline: the original is struck through and the
replacement is shown inline), or a **highlight**. Comments can also be attached to a whole
section. Feedback is stored in a local SQLite database. Once a change is reviewed and applied (or
rejected), the comment is removed from the database and its full history is appended to
`plan/feedback-history/<scope>.md`, which is committed with the change.

Nothing here ships. See [Production isolation](#production-isolation).

## Run a review session

```bash
python3 tools/feedback/cli.py serve            # http://127.0.0.1:8790
```

The index lists every accreditation and module with its open-comment count.

- `/m/<module-id>/` serves the module exactly as built, with the overlay added to the response.
- `/a/<accreditation-id>/` renders the accreditation definition (`accreditation.yaml`) for
  comment.

Hold Shift and click to leave a comment in a small bubble on the page. **Review** opens the comment list on the right. Each comment shows its own status. A coding agent applies or rejects comments; the overlay does not ask for a name.

| Action | How |
| --- | --- |
| Comment | Hold Shift (the pointer becomes a comment bubble) and click. The click comments on the selection under the pointer, or on that word. Shortcut: Ctrl/⌘+Alt+M. |
| Suggest or highlight | Select text with the normal pointer, then choose from the toolbar. |
| Comment on a section | **Comment on this section** in the panel. |
| Review list | **Review** opens the comments on the right. Each comment shows its status. |
| Edit or delete | Buttons on each comment. Applying or rejecting is done by a coding agent, not in this panel. |

Comments are anchored by the selected text plus surrounding context, so they re-attach after
reloads, rebuilds, and screen changes. If the text changes, the card is marked "Text not found on
this screen" instead of being lost. Each comment records the git commit (`+dirty` if the source
was modified) of the build it was made against.

Highlights use the CSS Custom Highlight API: the overlay never edits the page DOM, so module
behavior, SCORM calls, and layout are unaffected. The panel lives in a shadow root.

The server binds to `127.0.0.1`, refuses unexpected `Host` headers, and only accepts writes from
its own pages (same-origin plus a custom header), so other sites cannot write to the database.

## Refine the materials from feedback

```bash
python3 tools/feedback/cli.py list --accreditation accred-ai-blueprinting
python3 tools/feedback/cli.py export --scope SBP-104 > /tmp/sbp-104-feedback.md
```

`export` is the work queue. Each item gives the page and section, the reviewer's text, any
suggested replacement, replies, and the **authoring source file and line** that most likely hold
the text (for example `plan/sales-blueprinting/lessons/SBP-104.md:88`). Generated files are
labelled `(generated)`; edit the authoring source and rebuild instead. `--format json` gives the
same data for an agent.

After making a change, close the feedback. This writes the history and deletes the comment from
SQLite in one step:

```bash
python3 tools/feedback/cli.py apply FB-... FB-... --note "Rewrote the L03 intro" [--commit <sha>]
python3 tools/feedback/cli.py reject FB-... --note "Conflicts with source S12"
python3 tools/feedback/cli.py archive        # archive everything reviewers resolved in the overlay
```

Commit `plan/feedback-history/` with the content change. The database itself is git-ignored.

## Files

| Path | Purpose |
| --- | --- |
| `server.py` | Dev server: serves pages, injects the overlay into responses, JSON API. |
| `store.py` | SQLite schema and operations; archiving to Markdown history. |
| `sources.py` | Maps selected text to authoring files and lines. |
| `markers.py` | Overlay markers and the package scan used by every production guard. |
| `overlay/overlay.js`, `overlay/overlay.css` | Browser overlay. |
| `cli.py` | `serve`, `list`, `export`, `apply`, `reject`, `archive`, `guard`. |

Defaults: database `.feedback/feedback.db` (`FEEDBACK_DB`), history `plan/feedback-history/`
(`FEEDBACK_HISTORY`).

## Production isolation

The overlay can only reach a learner through the dev server:

1. **Never on disk in a module.** The overlay lives only in `tools/feedback/`. The server adds
   one `<script>` tag to HTML responses in memory; module files are not modified.
2. **Packagers scan every ZIP.** `skills/scripts/validate_scorm.py`, which all packagers run,
   fails any package containing an overlay marker. `tools/sbp/build_sbp.py package` also scans
   explicitly.
3. **Tests enforce it.** `tests/test_production_isolation.py` checks that module and shared
   sources are clean, every built package is clean, and that a deliberately leaked package is
   rejected by the validator, the CLI guard, and the marker scan. The container suite also loads
   every production package in Chromium and fails on any overlay element, global, or request.

Check packages manually with `python3 tools/feedback/cli.py guard dist`.
