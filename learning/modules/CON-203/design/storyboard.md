# CON-203 Indexing API and the Glean Data Model - storyboard

## 1. SCR-01 - A1 - Cold open
**The token that works everywhere but one place**

The indexing token uploads documents, users, and groups without a problem. Then the connector calls the activity endpoint and gets Not Authorized. Nothing is wrong with the token. It is the wrong kind of token for that call. This module is the wire protocol your SDK hides from you.

## 2. SCR-02 - A2 - What you will be able to do
**Know the protocol under the SDK**

## 3. SCR-03 - A5 - API surface
**Three surfaces, two kinds of token**

Claims: C-050, C-051, C-052, C-133, C-134, C-150

## 4. SCR-04 - A4 - Datasource
**Datasource settings that bite later**

Claims: C-158, C-119, C-118, C-121, C-120, C-122, C-123, C-124

## 5. SCR-05 - A3 - Document model
**What a document can carry**

Claims: C-119, C-094, C-090, C-091, C-092, C-093, C-153, C-058

## 6. SCR-06 - A5 - Write semantics
**Single, incremental, or bulk**

Claims: C-137, C-102, C-101, C-109, C-105, C-106, C-075, C-108, C-079, C-107

## 7. SCR-07 - A3 - Identity order
**Users, groups, memberships, then documents**

When documents use non-anonymous permissions, users must be indexed before they are referenced, and a group must be indexed before its memberships. Indexing a user does not give them access to any document.

Claims: C-111, C-114, C-112, C-115, C-113, C-116, C-076

## 8. SCR-08 - A9 - Practice
**Choose the permission shape**

Claims: C-198, C-117, C-071

## 9. SCR-09 - A5 - Properties or metadata
**Two ways to add fields**

Claims: C-125, C-130, C-132, C-100, C-131, C-126, C-127, C-128, C-129, C-077

## 10. SCR-10 - A6 - Decision
**A facet on someone else's documents**

Claims: C-100, C-080, C-035

## 11. SCR-11 - A3 - Activity
**Activity needs its own token**

The activity endpoint must be called with a Client API bearer token, not the Indexing API token: a global Client API token scoped to ACTIVITY. Without activity, signals are limited, ranking is suboptimal, and results are more likely to be outranked by connectors with stronger signals.

Claims: C-133, C-134, C-135, C-136

## 12. SCR-12 - A5 - Limits and codes
**Limits you must design around**

Claims: C-137, C-079, C-138, C-139, C-140, C-058

## 13. SCR-13 - A7 - Debug toolkit
**Debug in this order**

Claims: C-070, C-072, C-074, C-077, C-075, C-076, C-078

## 14. SCR-14 - A8 - API lab walkthrough
**The policy wiki, without the SDK**

Claims: C-103, C-049, C-111, C-114, C-115, C-101, C-107

## 15. SCR-15 - A13 - Job aid
**API cheat sheet**

Claims: C-052, C-134, C-101, C-109, C-105, C-111, C-114, C-070, C-074, C-077

## 16. SCR-16 - quiz - Prove it
**Indexing API check**

## 17. SCR-REF - A11 - Sources
**Where every fact on these screens comes from**

Each screen lists claim ids such as C-035. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.

## 18. SCR-17 - A14 - Next step
**Next: let the SDK do the plumbing**

CON-204 builds the same connector with the Indexing SDK, and shows the handful of SDK choices that silently delete or expose data.
