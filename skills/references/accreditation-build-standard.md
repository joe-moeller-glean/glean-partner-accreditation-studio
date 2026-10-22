# Accreditation build standard

Use this standard for every new or updated partner accreditation unless the user explicitly approves a documented exception. The AI Blueprinting & Value Mapping accreditation is the reference implementation.

## Contents

1. Reference implementation
2. Accreditation and package architecture
3. Module format and content depth
4. Research and claim traceability
5. Lesson knowledge checks
6. Module quizzes
7. Independent final exam
8. Runtime behavior
9. Visual and media approach
10. Build, QA, and release gates
11. Update and maintenance rules
12. Required acceptance evidence

## 1. Reference implementation

Use these files as concrete examples of the standard:

- Accreditation: `learning/accreditations/accred-ai-blueprinting/accreditation.yaml`
- Modules: `learning/modules/SBP-101` through `learning/modules/SBP-113`
- Independent exam: `learning/modules/SBP-FINAL`
- Canonical lesson authoring: `plan/sales-blueprinting/lessons/`
- Builder and validation: `tools/sbp/build_sbp.py`
- Runtime: `tools/sbp/runtime/`
- Runtime QA: `tools/sbp/runtime_qa_sbp.js`
- Responsive QA: `tools/sbp/visual_qa.html`
- Research ledgers: `plan/sales-blueprinting/sources.json`, `claims.json`, and `quote-checks.json`

Copy the model, not Blueprint-specific claims, identifiers, counts, or wording.

## 2. Accreditation and package architecture

- Keep one canonical source directory and one SCORM 1.2 ZIP per module.
- An accreditation references module IDs; it never nests or merges module packages.
- Keep the accreditation definition explicit: audience, required modules, final assessment module, mastery, release state, origin, and semantic competency alignment.
- Default to learning modules plus an independent final exam. Do not add a capstone or human-scored practical unless the user explicitly requires one and its rubric, governance, LMS handling, and reviewer ownership are approved.
- Keep every build in `restricted_preview` until content, policy, clearance, runtime, visual, and LMS gates pass. Passing local QA does not authorize partner distribution.
- Keep learner runtime assets local and offline-safe. Do not depend on network calls, internal links, or authenticated resources at runtime.

## 3. Module format and content depth

Default to a single, continuous module page with this sequence:

1. Overview: purpose, audience, prerequisites, learning outcomes, and time estimate.
2. Four to six substantive lessons in a deliberate progression.
3. One formative knowledge check inside each lesson.
4. Reusable toolkit or job aids when the topic needs operational support.
5. A separate graded module quiz.

Each lesson should contain enough depth for independent application, not a card-level summary. Include, when relevant:

- the decision, model, or workflow being taught;
- why it matters and when to use it;
- a clear sequence, criteria, or framework;
- a realistic worked example;
- evidence boundaries, guardrails, and common failure modes;
- a concise practice decision and feedback.

Prefer four to six focused lesson sections over many shallow screens. Cut nice-to-know material before compressing essential reasoning. Use plain language, active voice, sentence case, and short paragraphs. Keep internal source IDs and author notes out of the learner experience.

## 4. Research and claim traceability

Research before outlining or writing.

1. Decompose every objective into answerable research questions.
2. Search workplace knowledge through Glean first for internal context, current enablement, approved decks, recordings, policy, and owners.
3. Use current official product documentation or code as the primary authority for product behavior.
4. Use internal decks, Gong recordings, meeting notes, and Slack as authoring references and corroboration. Do not redistribute recordings, copied slides, logos, customer details, or restricted screenshots without explicit clearance.
5. Read full source passages when snippets affect a decision. Record source ID, URL, owner, date, authority tier, distribution limits, and exact page, slide, section, or timestamp.
6. Build a claim ledger before learner copy. Every factual statement, diagram label, question rationale, feedback sentence, and quantitative input must resolve to vetted evidence.
7. Record conflicts and interim safe defaults. Do not silently merge contradictory sources.
8. Verify verbatim quotes programmatically against extracted source text when possible.
9. Mark examples as fictional or directional where applicable. Never convert a benchmark, peer result, or AI-generated estimate into a customer's measured result.
10. Keep restricted research and author-only evidence outside packages.

If distribution rights are unclear, teach the supported concept with original prose, tables, and diagrams rather than embedded source media.

## 5. Lesson knowledge checks

Use one formative multiple-choice check per lesson.

- Four options, one defensible best answer.
- Keep the stem short. Do not add framing such as “A trainee selects” or verbose rationale prompts.
- Make all options concise and directly relevant to the lesson content.
- Build distractors from realistic misconceptions, incomplete actions, sequencing errors, evidence errors, role confusion, or overclaimed authority.
- Avoid joke answers, obviously impossible choices, and generic distractors reused across lessons.
- Make the learner read the lesson by testing a meaningful distinction, boundary, or application—not by making the prose longer.
- Show immediate explanatory feedback.
- If the learner is incorrect, keep every option enabled, display “Not correct. Try again.”, clear stale feedback when another option is selected, and allow resubmission.
- Lock the item only after the correct answer is submitted.
- Keep lesson checks formative: do not write LMS scores or SCORM interactions.
- Give checks stable IDs separate from graded item IDs.

## 6. Module quizzes

The default module assessment model is:

- eight source-grounded items in the bank;
- draw five without replacement;
- shuffle options by stable option ID;
- 80% mastery, so four of five passes and three of five fails;
- two proposed graded attempts before an administrator-managed reset;
- explanatory feedback after submission;
- blank responses score incorrect;
- completion requires the module's reading/progress contract as well as quiz mastery.

Module quiz items must differ from lesson knowledge checks in identity and wording. Cover every objective. Prefer application and judgment over recall when the outcome supports it.

## 7. Independent final exam

- Use a separate exam-only bank of 10 to 15 questions; the default is 15.
- Do not reuse lesson knowledge-check or module-quiz stems, answer sets, or item IDs.
- Validate exact non-duplication programmatically and review semantic similarity. Rewrite near-duplicates rather than adding cosmetic wording.
- Cover every required module. Use cross-module scenarios where they test integrated judgment.
- Keep stems and options concise, with four plausible options and one best answer.
- Default to 80% mastery. For 15 items, 12 correct passes.
- Keep the exam a separate SCORM package referenced by the accreditation.
- Do not add a capstone by default.
- State that the final exam alone does not award the accreditation; required module completion still applies.

## 8. Runtime behavior

- Initialize and finish SCORM 1.2 safely, including bounded API discovery and cross-origin handling.
- Preserve location, visit state, drawn items, answers, attempts, status, and score within the 4096-character suspend-data budget.
- Never overwrite a prior pass on resume.
- Record graded quiz and final-exam interactions with valid SCORM 1.2 vocabulary when supported.
- Keep formative lesson checks out of LMS scoring and interaction records.
- Support keyboard operation, visible focus, reduced motion, semantic headings, labeled radio inputs, and non-color status.
- Make untracked local preview explicit. Never simulate LMS completion when no API exists.
- Keep development feedback overlays out of production packages and fail packaging if marker code is found.

## 9. Visual and media approach

- Use the Glean brand system, local assets, semantic HTML, and responsive SVG or CSS diagrams.
- Prefer original diagrams and workflow visuals over copied internal slides or screenshots.
- Every visual must teach a relationship, sequence, decision, comparison, or evidence boundary. Avoid decorative media that adds no learning value.
- Provide meaningful alt text or an adjacent text/table equivalent.
- Validate at desktop and narrow mobile widths. Check overflow, clipped text, contrast, target size, focus, reduced motion, and responsive image selection.
- Do not add video unless redistribution, captioning, and offline packaging are cleared.

## 10. Build, QA, and release gates

Run deterministic validation before browser QA, then package only after the generated source passes.

Required checks:

- unique and resolving module, lesson, screen, question, claim, source, interaction, and asset IDs;
- objective → teaching → practice → formative check → graded item coverage;
- exactly four options and one correct answer for every selected-response item;
- final-exam bank size between 10 and 15 and no knowledge-check/module-quiz duplication;
- claim and quote verification;
- no learner-facing internal IDs or author notes;
- no remote runtime dependencies or restricted authoring files in ZIPs;
- SCORM manifest, launch, score, status, resume, attempt, interaction, and suspend-data tests;
- incorrect-to-correct formative retry behavior;
- responsive browser QA at desktop and mobile widths;
- production scan for development feedback markers;
- one validated ZIP and checksum per module.

Record QA evidence against a build fingerprint. Regeneration invalidates older runtime or visual evidence until it is rerun.

## 11. Update and maintenance rules

- Preserve stable IDs unless an item or screen is explicitly retired; record retirement in the changelog.
- Change canonical authoring or compiler sources, then regenerate. Never hand-edit compiled module output.
- Keep source-only, generated, QA, and package changes in a focused commit.
- Refresh research before changing product behavior, process, metrics, policy, or external claims.
- Re-run focused unit, runtime, package, and visual checks after every relevant change.
- Keep the build restricted when any approval, clearance, policy, human review, or LMS gate remains open.

## 12. Required acceptance evidence

A completed build or update reports:

- active module and package counts;
- lesson and formative-check counts;
- module quiz bank/draw/mastery rules;
- final bank size, pass threshold, coverage, and duplicate-check result;
- claim and quote verification totals;
- unit and deterministic validation results;
- runtime QA results by module;
- responsive visual QA results and tested widths;
- package validation and development-marker scan;
- release state and unresolved blockers;
- whether changes were committed, pushed, or published.
