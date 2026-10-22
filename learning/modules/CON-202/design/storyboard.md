# CON-202 Custom Connector Scoping and Intake - storyboard

## 1. SCR-01 - A1 - Cold open
**Two weeks to go live**

The sponsor wants the policy wiki in Glean in two weeks. The source owner says the API has everything. Nobody has asked the security architect. Scoping is where you find out what everything means, before the sponsor's date becomes your problem.

## 2. SCR-02 - A2 - What you will be able to do
**Turn a request into evidence**

## 3. SCR-03 - A3 - Why structured scoping
**Scope before code**

Scoping turns a request into evidence. The partner questionnaire starts with the cheapest question: is there an existing native connector for the source, or can the native Glean Web Crawler cover it? Only then does it move to access, identity, environments, and change patterns.

Claims: C-250, C-035

## 4. SCR-04 - A4 - The questionnaire
**Six questions that change the design**

Claims: C-251, C-252, C-254, C-255, C-256, C-257, C-253

## 5. SCR-05 - A3 - Feasibility
**Four information types, each with a price**

Glean builds its graph from content, people, and activity, and every result depends on permissions. For each type, record whether the source exposes it, how, and what a gap costs. A permissions gap is never solved with an allow-all ACL on sensitive content.

Claims: C-006, C-241, C-195, C-240, C-135, C-136

## 6. SCR-06 - A10 - Myth versus reality
**Three scoping shortcuts that fail later**

Claims: C-254, C-111, C-240, C-045

## 7. SCR-07 - A7 - Sizing
**Sizing the policy wiki crawl**

Claims: C-193, C-137, C-138, C-139

## 8. SCR-08 - A6 - Decision
**The unmatched 3%**

Claims: C-118, C-240, C-195, C-197

## 9. SCR-09 - A5 - Hosting
**Decide hosting with the customer**

Glean places no constraints on where a custom connector runs. Choose before you build.

Claims: C-044, C-045, C-042, C-046, C-047

## 10. SCR-10 - A9 - Practice
**Tag each intake finding**

Claims: C-198, C-240, C-257, C-046, C-193, C-176

## 11. SCR-11 - A4 - Risk register
**The four risks that matter here**

Claims: C-154, C-170, C-090, C-254, C-238

## 12. SCR-12 - A8 - Worked example
**The intake summary, filled in**

Claims: C-040, C-021, C-090, C-135, C-175, C-176

## 13. SCR-13 - A6 - Decision
**Go, conditional go, or no-go?**

Claims: C-045, C-135

## 14. SCR-14 - A13 - Job aid
**Intake checklist**

Claims: C-250, C-251, C-254, C-255, C-256

## 15. SCR-15 - quiz - Prove it
**Scoping and intake check**

## 16. SCR-REF - A11 - Sources
**Where every fact on these screens comes from**

Each screen lists claim ids such as C-006. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.

## 17. SCR-16 - A14 - Next step
**Next: prove the environment is ready**

TEC-201 turns this intake into a readiness gate: datasource, token, source access, network, and test personas. Submit your intake summary to your assessor with the risk register attached.
