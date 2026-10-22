# CON-204 Glean Indexing SDK: Build, Test, Debug, Deploy - storyboard

## 1. SCR-01 - A1 - Cold open
**Every page indexed, no one can see them**

The streaming connector indexed all 38,400 policy pages. Every restricted page is invisible to everyone. The ACLs look right. The groups they name were never pushed, because streaming connectors do not run the identity crawl. The SDK removes most of the plumbing; it does not remove the need to know what it skips.

Claims: C-166, C-196

## 2. SCR-02 - A2 - What you will be able to do
**Write only the source-specific parts**

## 3. SCR-03 - A3 - Architecture
**Two classes you write; the rest is the SDK's**

A connector is two classes: a data client that fetches records from your source, and a connector that turns them into Glean documents. The SDK owns batching, retries, upload sessions, and stale-document cleanup. It is a client for the Indexing API, not a replacement: the API documentation stays the reference for the wire protocol.

Claims: C-157, C-311, C-150, C-161, C-312, C-313, C-162, C-164

## 4. SCR-04 - A7 - Run lifecycle
**What happens in one run**

Claims: C-310, C-324, C-163, C-165, C-166

## 5. SCR-05 - A5 - Base classes
**Choose the base class**

Claims: C-315, C-316, C-169, C-314, C-167, C-168

## 6. SCR-06 - A6 - Decision
**Pick the class for the policy wiki**

Claims: C-315, C-166, C-196, C-169

## 7. SCR-07 - A4 - Data client
**Pull from the source without hurting it**

Claims: C-318, C-186, C-317, C-194, C-193, C-323, C-190, C-191, C-187, C-188

## 8. SCR-08 - A6 - Decision
**The empty page that is not the end**

Claims: C-323, C-154, C-318, C-170

## 9. SCR-09 - A3 - transform()
**The transform checklist**

Claims: C-158, C-101, C-153, C-198, C-152, C-201, C-320

## 10. SCR-10 - A10 - Myth versus reality
**Four SDK surprises**

Claims: C-172, C-325, C-166, C-326, C-159, C-167

## 11. SCR-11 - A5 - Modes and uploads
**Full and incremental, safely**

Claims: C-163, C-154, C-177, C-324, C-173, C-178, C-180, C-181, C-184, C-185

## 12. SCR-12 - A7 - Testing
**Three phases, one change each**

Claims: C-155, C-319, C-206, C-199, C-200

## 13. SCR-13 - A4 - CLI and debugging
**Why is my document not in search?**

Claims: C-202, C-160, C-322, C-321, C-205, C-207, C-208, C-209

## 14. SCR-14 - A3 - Observe and deploy
**A connector is a batch job**

It starts, pulls from a source, pushes to Glean, and exits. You get stage timings, item counts, and structured logs without adding instrumentation. glean-idx deploy generates a Docker image and Terraform for a Kubernetes CronJob on GKE or EKS, but any scheduler that can run it works.

Claims: C-210, C-218, C-332, C-217, C-204, C-219, C-213, C-214

## 15. SCR-15 - A6 - Decision
**The agent-generated connector**

Claims: C-329, C-330, C-152, C-319, C-195

## 16. SCR-16 - A8 - Build lab briefing
**The SDK build lab, step by step**

Claims: C-317, C-193, C-154, C-153, C-166, C-155, C-206, C-321, C-172, C-174

## 17. SCR-17 - quiz - Prove it
**Indexing SDK check**

## 18. SCR-REF - A11 - Sources
**Where every fact on these screens comes from**

Each screen lists claim ids such as C-101. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.

## 19. SCR-18 - A14 - Next step
**Next: build it under fire**

BLD-202 is the end-to-end implementation lab: full and incremental runs, deletions, permission-only changes, injected faults, reconciliation, and handoff.
