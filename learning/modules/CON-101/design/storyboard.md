# CON-101 Connector Fundamentals: Indexed, Live, Hybrid, and MCP - storyboard

## 1. SCR-01 - A1 - Cold open
**Seven systems, one steering meeting**

A regional healthcare group asks your team for a connector for everything: a policy wiki, a vendor learning system, a reference archive, a claims warehouse, facility telemetry, a live bed board, and a new facet on Drive files. Build all seven and you ship risk, not value. By the end of this module you will classify each one and defend the call.

## 2. SCR-02 - A2 - What you will be able to do
**Decide before you build**

## 3. SCR-03 - A3 - The job
**What a connector actually does**

A Glean connector integrates Glean with a platform, service, or application where content lives. An indexing connector does two jobs: it fetches data, including permissions, and it parses item content such as title, body, comments, and media, along with permissions. That lets Glean index content, mirror source permissions, and keep the data current in your isolated tenant.

Claims: C-001, C-002, C-003, C-004, C-015

## 4. SCR-04 - A4 - What flows in
**Glean needs more than documents**

Open each data family. A connector that brings only one of them delivers a weaker experience.

Claims: C-006, C-016, C-017, C-019, C-241, C-018

## 5. SCR-05 - A5 - Connector types
**Four documented connector types**

The type decides who builds it, how data arrives, and who supports it after go-live.

Claims: C-005, C-007, C-008, C-009, C-010

## 6. SCR-06 - A10 - Myth versus reality
**Four beliefs that cause bad connector requests**

Claims: C-010, C-009, C-011, C-100, C-013, C-025

## 7. SCR-07 - A3 - Access modes
**Indexed, live, or hybrid**

Indexed data is crawled ahead of time. Live data is fetched at query time. Hybrid is a mix of both. The runtime chooses index, live, or hybrid paths per request, based on connector capabilities and the question.

Claims: C-012, C-023, C-013, C-014, C-011

## 8. SCR-08 - A5 - Match the path to the data
**What each path is for**

Claims: C-021, C-022, C-013, C-014, C-030

## 9. SCR-09 - A4 - Tools and MCP
**MCP adds request-time tools. It does not replace the index.**

Claims: C-027, C-029, C-028, C-030, C-031, C-032, C-033

## 10. SCR-10 - A6 - Decision
**The live bed board**

Claims: C-011, C-022, C-007

## 11. SCR-11 - A9 - Practice
**Classify the seven requests**

Claims: C-040, C-190, C-253, C-035, C-100, C-033, C-034, C-022

## 12. SCR-12 - A3 - Fit sequence
**Five questions, in order**

Claims: C-250, C-035, C-033, C-034, C-022, C-021, C-006, C-253, C-010

## 13. SCR-13 - A8 - Worked example
**The policy wiki, question by question**

Claims: C-040, C-021, C-135, C-010

## 14. SCR-14 - A6 - Decision
**The Drive facet request**

Claims: C-035, C-100, C-080, C-081

## 15. SCR-15 - A13 - Job aid
**Connector fit card**

Claims: C-021, C-022, C-033, C-034, C-028, C-035, C-100

## 16. SCR-16 - quiz - Prove it
**Connector fundamentals check**

## 17. SCR-REF - A11 - Sources
**Where every fact on these screens comes from**

Each screen lists claim ids such as C-001. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.

## 18. SCR-17 - A14 - Next step
**Next: follow one document through the pipeline**

CON-201 traces a single page from fetch to cited answer, including the three states where it can stall and the one rule that deletes documents you did not mean to delete.
