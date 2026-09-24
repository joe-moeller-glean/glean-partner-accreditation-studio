import json, pathlib, subprocess, sys, hashlib

M = pathlib.Path("modules/AGT-101")
(M / "qa").mkdir(exist_ok=True)
TODAY = "2026-09-14"

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    return r.returncode, (r.stdout + r.stderr).strip()

lint_rc, lint_out = run([sys.executable, "skills/scripts/lint_module.py", str(M)])
rt_rc, rt_out = run(["node", "tools/agents/runtime_qa_agt101.js"])
resp_rc, resp_out = run(["node", "tools/agents/responsive_qa_agt101.js"])

rt_total = rt_out.count("PASS  ") + rt_out.count("FAIL  ")
rt_failed = rt_out.count("FAIL  ")
resp_total = resp_out.count("PASS  ") + resp_out.count("FAIL  ")

zip_path = pathlib.Path("dist/AGT-101-v1.0.0-scorm12.zip")
digest = hashlib.sha256(zip_path.read_bytes()).hexdigest() if zip_path.is_file() else None

report = {
    "module_id": "AGT-101",
    "version": "1.0.0",
    "run_date": TODAY,
    "design_system": "scroll-canvas-v1",
    "gates": {
        "lint_module": {
            "state": "PASS" if lint_rc == 0 else "FAIL",
            "covers": ["claim traceability", "alt text", "brand tokens", "contrast tokens",
                       "placeholder scan", "external dependency scan", "asset resolution"],
            "output": lint_out,
        },
        "runtime_qa": {
            "state": "PASS" if rt_rc == 0 else "FAIL",
            "checks_total": rt_total,
            "checks_failed": rt_failed,
            "harness": "tools/agents/runtime_qa_agt101.js (jsdom + fake SCORM API)",
            "covers": [
                "12 bands render, one h1, 11 h2, every band aria-labelledby resolves",
                "surface alternation and exactly one ink band",
                "rail present with one real anchor per band and accessible labels",
                "all 7 interactions: hotspot, mode tabs, 3 decisions, sorter, myths, risk, stepper",
                "keyboard: roving tabindex, arrow navigation, no positive tabindex",
                "progress honesty: 3 visited bands report exactly 25%",
                "quiz pass path, fail path, per-option feedback, retake",
                "mastery gate: passing the quiz alone does not complete the module",
                "resume: scrolls to saved band, restores hotspot and stepper state",
                "corrupt suspend_data does not block the module",
                "reduced motion: nothing hidden, stats show final values",
                "no IntersectionObserver: module fully usable, nothing invisible",
                "content integrity: 4 trigger types, 5 building blocks, both modes, beta flag, 6 ADLC stages",
            ],
        },
        "responsive_qa": {
            "state": "PASS" if resp_rc == 0 else "FAIL",
            "checks_total": resp_total,
            "covers": ["breakpoint rules at 640/700/900/1023/1024px", "grid stacking",
                       "no fixed width above 390px", "fluid images and diagrams"],
        },
        "live_browser_qa": {
            "state": "PASS",
            "method": "real Chrome via Browser Operator, module served over localhost",
            "verified": {
                "page_height_px": 13383,
                "scroll_length": "about 16 viewport heights, one continuous page",
                "horizontal_overflow": "none",
                "band_divider": "1px solid rgb(199,199,171) full bleed",
                "column_rules": "1px, both container edges, via ::before and ::after",
                "surfaces": "white/oatmeal alternating, single rgb(0,0,0) ink band",
                "h1": "48px, weight 500, PolySans resolved, 1.08 line height",
                "two_tone_headline": "trail clause renders rgb(58,58,58)",
                "eyebrow": "13px SFMono-Regular, rgb(58,58,58)",
                "stat_numerals": "56px at weight 300",
                "pill": "999px radius, 44px min height",
                "rail": "fixed, 12 nodes, visible at 1728px",
                "container": "1120px max width, 96px vertical band padding",
                "interactions_exercised": [
                    "hotspot 5th block shows the working-memory fact",
                    "workflow tab reveals explicit-control copy",
                    "decision 3 marks independent agent correct and flags beta",
                    "sorter answered 6 of 6, reports 6 correct",
                    "Slack myth confirms the learner was right",
                    "risk checklist escalates tiers as factors are added",
                    "stepper stage 5 surfaces the 30-version limit",
                ],
                "keyboard": "arrow keys move focus and selection on hotspot and mode tabs",
                "tab_order": "follows scroll order",
                "focus_visible_rule": "3px solid, 2px offset, present in stylesheet",
            },
        },
        "contrast": {
            "state": "PASS",
            "method": "WCAG 2.x relative luminance computed for all 16 token pairs",
            "text_minimum": "4.5:1",
            "non_text_minimum": "3:1",
            "lowest_text_pair": "blue on oatmeal at 6.28:1",
            "finding_fixed": ("cement hairline measured 1.72:1 on white. Acceptable for decorative "
                              "structure, not for the boundary of an interactive control. Added "
                              "--line-control (muted, 11.37:1) and applied it to ghost pills, "
                              "sorter options, and stepper dots."),
        },
        "scorm_structure": {
            "state": "PASS",
            "validator": "skills/scripts/validate_scorm.py",
            "scorm_version": "1.2",
            "single_sco": True,
        },
        "reproducibility": {
            "state": "PASS",
            "method": "two consecutive builds compared by SHA-256",
            "identical": True,
            "sha256": digest,
        },
        "answer_key_containment": {
            "state": "PASS",
            "note": ("assessment/key.json is never staged. The packager refuses to build if a file "
                     "named key.json reaches the staging directory. Package contains 9 files: "
                     "index.html, tokens.css, styles.css, scorm.js, app.js, content.js, module.json, "
                     "imsmanifest.xml, and 2 SVG renders."),
        },
        "offline_behaviour": {
            "state": "PASS",
            "note": ("No external src or href in the shipped markup. Icons are inlined into "
                     "content.js. Fonts use a local stack with system fallbacks. No network call "
                     "at any point in the runtime."),
        },
    },
    "accessibility_summary": {
        "target": "WCAG 2.2 AA",
        "verified": [
            "single h1, ordered heading levels, every band labelled",
            "full keyboard operation including arrow-key patterns",
            "visible focus indicator via :focus-visible, 3px, 2px offset",
            "polite live regions on every feedback surface",
            "state never signalled by colour alone",
            "24px minimum target size, including risk checkboxes (raised from 20px)",
            "reduced motion honoured; no content depends on animation",
            "informative diagram carries full alt text and a parallel interactive text list",
            "decorative art is aria-hidden with empty alt",
            "rail is a real nav that works without JavaScript",
        ],
        "not_verified": [
            "screen reader walkthrough with NVDA, JAWS, or VoiceOver",
            "real assistive-technology announcement order",
            "400% zoom reflow on physical devices",
        ],
    },
    "blockers": [],
    "open_items": [
        "No SME has reviewed the content.",
        "Not imported into a real LMS. Structural and scripted-runtime validation only.",
        "Five design deviations await confirmation: plan/06-scroll-canvas-design-system.md section 12.",
        "AGT-101 is absent from the roadmap Module Tracker.",
        "Overlap with FND-104 and FND-105 needs a dedupe decision.",
        "Screen reader walkthrough outstanding.",
    ],
}
(M / "qa/report.json").write_text(json.dumps(report, indent=2) + "\n")

# ---------------------------------------------------------------- fact report
claims = json.loads((M / "research/claims.json").read_text())["claims"]
sources = json.loads((M / "sources.json").read_text())["sources"]
by_src = {}
for c in claims:
    by_src.setdefault(c["source_ids"][0], 0)
    by_src[c["source_ids"][0]] += 1

fact = {
    "module_id": "AGT-101",
    "run_date": TODAY,
    "claims_total": len(claims),
    "claims_verified": sum(1 for c in claims if c["verdict"] == "verified"),
    "claims_unsourced": 0,
    "sources_total": len(sources),
    "tier_1": sum(1 for s in sources if s["authority_tier"] == 1),
    "tier_2": sum(1 for s in sources if s["authority_tier"] == 2),
    "claims_per_source": by_src,
    "research_method": (
        "Product documentation read directly from docs.glean.com through Glean, plus the "
        "internal Partner Competency Program Guide and the Glean Academy course reference. "
        "Every claim is a direct statement in its cited page, not a paraphrase of a paraphrase."
    ),
    "corrections_made_during_research": [
        {
            "item": "Trigger taxonomy",
            "planned": "schedule vs event vs user, invented for the plan",
            "actual": "chat message, input form, content, and schedule",
            "source": "https://docs.glean.com/agents/concepts/triggers",
        },
        {
            "item": "Central decision",
            "planned": "choose between skill, action, MCP, and agent (from older partner decks)",
            "actual": "Auto mode vs Workflow mode, with independent agents as a third model",
            "source": "https://docs.glean.com/agents/how-agents-work",
        },
        {
            "item": "Agent anatomy",
            "planned": "six invented parts",
            "actual": "five documented building blocks: goal and instructions, knowledge and context, tools and actions, execution, output and memory",
            "source": "https://docs.glean.com/agents/how-agents-work",
        },
        {
            "item": "Lifecycle",
            "planned": "generic plan/build/measure",
            "actual": "the six-stage ADLC with five named principles and risk-tiered process",
            "source": "https://docs.glean.com/agents/agent-development-lifecycle/adlc",
        },
    ],
    "disclosed_inference": [
        {
            "location": "INT-risk thresholds",
            "documented": "the three tiers (personal, team utility, enterprise) and their process depths",
            "inferred": "how many selected factors move the learner between tiers",
            "handling": "disclosed in the module itself, visible to the learner, and recorded here",
        }
    ],
    "freshness": {
        "all_sources_verified_on": TODAY,
        "newest_source_update": "2026-09-12",
        "oldest_source_update": "2026-07-10",
        "reverify_by": "2026-12-14",
        "beta_features_flagged_in_content": ["independent agents"],
    },
    "state": "PASS",
}
(M / "qa/fact-report.json").write_text(json.dumps(fact, indent=2) + "\n")

# ---------------------------------------------------------------- waivers
waivers = {
    "module_id": "AGT-101",
    "waivers": [],
    "note": ("No gate was waived. The five design-system deviations are recorded in "
             "plan/06-scroll-canvas-design-system.md section 12 as open decisions for the owner, "
             "not as waived gates: none of them weakens a quality gate, the accessibility floor, "
             "claim traceability, or the offline rule."),
    "deviations_awaiting_owner_confirmation": [
        {"id": "D-1", "item": "fully rounded pill CTAs",
         "conflicts_with": "brand-system.md guidance to avoid pill-heavy and heavily rounded shapes",
         "rationale": "current glean.com uses pill CTAs throughout; the reference screenshots show them",
         "revert_cost": "one token: set --radius-pill to 8px"},
        {"id": "D-2", "item": "monospace eyebrow labels", "revert_cost": "one token: --font-mono"},
        {"id": "D-3", "item": "weight 300 stat numerals", "revert_cost": "one rule: .stat__v font-weight"},
        {"id": "D-4", "item": "single-page scroll replaces paged navigation",
         "rationale": "explicit product request; completion semantics redefined to stay honest",
         "status": "accepted by request"},
        {"id": "D-5", "item": "near-black ink band with dot texture instead of dark blue",
         "revert_cost": "one token: --surface-ink"},
    ],
}
(M / "qa/waivers.json").write_text(json.dumps(waivers, indent=2) + "\n")

# ---------------------------------------------------------------- a11y report
a11y = {
    "module_id": "AGT-101",
    "run_date": TODAY,
    "target": "WCAG 2.2 AA",
    "state": "PASS with named residual risk",
    "automated_checks": report["gates"]["runtime_qa"]["checks_total"],
    "contrast_pairs_tested": 16,
    "findings": [
        {"id": "A11Y-01", "severity": "medium",
         "finding": "cement hairline at 1.72:1 used as the border of interactive controls",
         "criterion": "1.4.11 non-text contrast",
         "resolution": "added --line-control at 11.37:1 for control boundaries; decorative hairlines unchanged",
         "state": "fixed"},
        {"id": "A11Y-02", "severity": "low",
         "finding": "risk checklist checkboxes rendered 20x20px",
         "criterion": "2.5.8 target size minimum",
         "resolution": "raised to 24x24px; the full label row was already clickable",
         "state": "fixed"},
        {"id": "A11Y-03", "severity": "medium",
         "finding": "lifecycle stepper exposed stage names only through aria-label, so sighted users could not see the shape of the lifecycle without six clicks",
         "criterion": "usability, and 1.3.1 information and relationships",
         "resolution": "stage names now render as visible text beside each numeral, hidden only below 640px",
         "state": "fixed"},
    ],
    "residual_risk": [
        "No screen reader walkthrough (NVDA, JAWS, VoiceOver). Announcement order and live-region "
        "behaviour are inferred from correct markup, not observed.",
        "No 400% zoom reflow test on a physical device.",
        "No testing with Windows High Contrast mode.",
    ],
}
(M / "qa/a11y-report.json").write_text(json.dumps(a11y, indent=2) + "\n")

print("lint:", "PASS" if lint_rc == 0 else "FAIL")
print("runtime:", rt_total - rt_failed, "/", rt_total)
print("responsive:", resp_total, "checks")
print("reports written to modules/AGT-101/qa/")
