# BLD-201 Custom Connector Best Practices - storyboard

## 1. SCR-01 - A1 - Cold open
**Success, and nothing indexed**

Under load, the source API returns 200 with an empty list and no cursor, long before the real end. The connector treats it as the end, reports success, and finalizes the full run. By morning, thousands of pages are gone from search. Nothing errored. This module is about building connectors that fail loudly instead.

## 2. SCR-02 - A2 - What you will be able to do
**Design for the failure you will meet**

## 3. SCR-03 - A3 - Reference architecture
**Six layers, one job each**

Keep the connector boring and layered. Read-only credentials at the source. A data client that paces below quota and retries. A transform that combines related records into one document where that helps. A simple database to track document state. An uploader with retries, backoff, and a dead-letter queue. Operations that rotate tokens automatically.

Claims: C-251, C-193, C-236, C-237, C-242, C-238

## 4. SCR-04 - A4 - Content model
**Four content-model rules**

Claims: C-101, C-236, C-153, C-119

## 5. SCR-05 - A10 - Myth versus reality
**Four design shortcuts reviewers reject**

Claims: C-101, C-170, C-197, C-235, C-026, C-025

## 6. SCR-06 - A3 - Identity and permissions
**Map the source's access model exactly**

Claims: C-235, C-197, C-114, C-115, C-198, C-196, C-195

## 7. SCR-07 - A9 - Practice
**Map each source rule**

Claims: C-198, C-115, C-197

## 8. SCR-08 - A5 - Freshness and deletion
**One strategy per object family**

Claims: C-175, C-174, C-176, C-116, C-257, C-239

## 9. SCR-09 - A7 - Checkpoints
**A checkpoint that cannot skip changes**

Claims: C-173, C-179, C-172, C-237

## 10. SCR-10 - A3 - Completeness
**The guard that matters most**

Never let a partial or failed fetch finish as a successful full crawl. A failed crawl is recoverable. A successful crawl that deleted most of the index is not. A full crawl must cover the entire confirmed scope, because stale deletion removes anything absent from the run.

Claims: C-170, C-171, C-154, C-323, C-190, C-191

## 11. SCR-11 - A6 - Decision
**A 3.8% drop**

Claims: C-170, C-107, C-171

## 12. SCR-12 - A7 - Reliability
**Reliability, step by step**

Claims: C-194, C-193, C-186, C-317, C-242, C-209, C-165, C-178

## 13. SCR-13 - A5 - Security and operations
**Production controls**

Claims: C-251, C-057, C-059, C-238, C-215, C-187, C-188, C-204, C-275

## 14. SCR-14 - A8 - Worked example
**The policy wiki design record**

Claims: C-101, C-198, C-115, C-173, C-176, C-170, C-204

## 15. SCR-15 - A13 - Job aid
**Self-review before anyone else reviews**

Claims: C-101, C-111, C-114, C-195, C-170, C-174, C-173, C-057, C-204

## 16. SCR-16 - quiz - Prove it
**Best practices check**

## 17. SCR-REF - A11 - Sources
**Where every fact on these screens comes from**

Each screen lists claim ids such as C-025. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.

## 18. SCR-17 - A14 - Next step
**Design done. Learn the wire protocol.**

CON-203 teaches the Indexing API and data model your design depends on. Submit your design record to your assessor first.
