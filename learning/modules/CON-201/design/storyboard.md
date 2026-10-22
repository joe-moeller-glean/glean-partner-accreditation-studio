# CON-201 Indexing Architecture and Data Flow - storyboard

## 1. SCR-01 - A1 - Cold open
**Accepted, but not found**

Your connector pushed a revised policy page, and the API accepted it. Forty minutes later, a nurse lead searches and gets last month's version. Nothing errored. Where is the page? This module gives you the map to answer that in minutes, not days.

## 2. SCR-02 - A2 - What you will be able to do
**Read the pipeline like an engineer**

## 3. SCR-03 - A3 - Two ingestion paths
**Two ways in, one platform**

Native connectors call source APIs directly. Custom connectors push documents, metadata, and permissions through the Indexing API. After ingestion, both share the same machinery: documents, permissions, people data, and user activity flow through the same backend queueing and indexing system, so one type of backlog can affect another.

Claims: C-005, C-041, C-232

## 4. SCR-04 - A4 - The pipeline
**Stage by stage**

Open each stage for what happens there.

Claims: C-003, C-041, C-044, C-004, C-234, C-073, C-018, C-023, C-026

## 5. SCR-05 - A5 - Three states
**Accepted, processed, searchable**

Indexing is asynchronous. Plan for around 15 to 20 minutes before new documents appear, and treat that as typical, not guaranteed.

Claims: C-110, C-104, C-072, C-073, C-070, C-103, C-200

## 6. SCR-06 - A10 - Myth versus reality
**Three beliefs that waste a day of debugging**

Claims: C-160, C-110, C-232, C-233, C-205, C-196

## 7. SCR-07 - A3 - Write modes
**Replacement versus increments**

Bulk indexing fully replaces the list of documents stored for the datasource. After a successful bulk upload, every document that was not part of that upload is deleted asynchronously. The /indexdocuments endpoint is intended for incremental updates and removes nothing by omission.

Claims: C-101, C-102, C-109, C-105, C-106, C-163

## 8. SCR-08 - A4 - The safeguard
**The 20% rule protects you, but only partly**

Claims: C-107, C-108, C-079, C-101, C-170, C-177

## 9. SCR-09 - A6 - Decision
**A token expires mid-run**

Claims: C-101, C-107, C-108, C-170

## 10. SCR-10 - A7 - Visibility
**Five gates between a document and a user**

Claims: C-103, C-124, C-048, C-111, C-114, C-116, C-025

## 11. SCR-11 - A5 - Read the flags literally
**Three broad settings that mean different things**

Claims: C-117, C-071, C-112, C-195

## 12. SCR-12 - A9 - Practice
**Where is it stuck?**

Claims: C-202, C-070, C-205, C-203, C-124

## 13. SCR-13 - A8 - Worked diagnosis
**The stale policy page, solved**

Claims: C-070, C-232, C-075, C-079

## 14. SCR-14 - A3 - Query time
**Content quality limits answer quality**

At query time, results are permission-filtered, and retrieved snippets are passed to the language model. What you index is what the model can use.

Claims: C-026, C-090, C-241, C-091, C-093, C-024

## 15. SCR-15 - A13 - Job aid
**Where is my document?**

Claims: C-202, C-070, C-205, C-203, C-107

## 16. SCR-16 - quiz - Prove it
**Indexing architecture check**

## 17. SCR-REF - A11 - Sources
**Where every fact on these screens comes from**

Each screen lists claim ids such as C-003. This table maps each id to the document it was verified against on 2026-09-26. Current Glean product and developer documentation is the authority for product behavior.

## 18. SCR-17 - A14 - Next step
**Next: scope the source before anyone writes code**

CON-202 turns a connector request into evidence: data types, sizing, identity, hosting, and a go or no-go call.
