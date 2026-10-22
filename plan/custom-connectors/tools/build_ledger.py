import json, re, sys, html

OUT = "/Users/joemoeller/Documents/projects/glean-partner-accreditation-studio/plan/custom-connectors"
R = "/tmp/ccres/"

# id, title, url, tier, owner, updated, audience, cadence_days, evidence_file
SOURCES = [
 ("S-01","About connectors","https://docs.glean.com/connectors/about","T1-product-docs","Glean Docs","2026-09-23","partner",90,"docs-0.txt"),
 ("S-02","How connectors power the Glean experience","https://docs.glean.com/connectors/connectors-power-glean","T1-product-docs","Glean Docs","2026-08-04","partner",90,"docs-1.txt"),
 ("S-03","Overview of custom data source","https://docs.glean.com/connectors/custom/about","T1-product-docs","Glean Docs","2026-08-19","partner",90,"docs-2.txt"),
 ("S-04","Choose a deployment model","https://docs.glean.com/connectors/custom/deployment","T1-product-docs","Glean Docs","2026-06-29","partner",90,"docs-3.txt"),
 ("S-05","Set up a custom connector","https://docs.glean.com/connectors/custom/setup","T1-product-docs","Glean Docs","2026-09-21","partner",90,"docs-4.txt"),
 ("S-06","Glean REST APIs","https://docs.glean.com/connectors/custom/glean-apis","T1-product-docs","Glean Docs","2026-06-29","partner",90,"docs-5.txt"),
 ("S-07","Troubleshooting (custom connectors)","https://docs.glean.com/connectors/custom/troubleshooting","T1-product-docs","Glean Docs","2026-08-18","partner",90,"docs-7.txt"),
 ("S-08","Migrate from a native connector to a custom connector","https://docs.glean.com/connectors/custom/migration-playbook","T1-product-docs","Glean Docs","2026-08-18","partner",90,"docs-6.txt"),
 ("S-09","Set up tools and MCP integrations from Connectors","https://docs.glean.com/connectors/configure-tools-in-connector/config-tools-mcp-from-connector","T1-product-docs","Glean Docs","2026-09-23","partner",90,"sdk3-2.txt"),
 ("S-10","Crawl and index limits","https://docs.glean.com/connectors/crawler-and-indexing-limits","T1-product-docs","Glean Docs","2026-06-30","partner",90,"limits.log"),
 ("S-11","Indexing API overview","https://developers.glean.com/api/indexing-api","T1-developer-docs","Glean Developer","2026-09-19","partner",90,"dev-3.txt"),
 ("S-12","Bulk Indexing","https://developers.glean.com/api-info/indexing/documents/bulk-indexing","T1-developer-docs","Glean Developer","2026-09-20","partner",90,"sdk2-6.txt"),
 ("S-13","Bulk Upload Model","https://developers.glean.com/api-info/indexing/documents/bulk-upload-model","T1-developer-docs","Glean Developer","2026-09-19","partner",90,"sdk2-7.txt"),
 ("S-14","Indexing API Quickstart","https://developers.glean.com/api-info/indexing/getting-started/overview","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"dev-2.txt"),
 ("S-15","Indexing API Authentication","https://developers.glean.com/api-info/indexing/authentication/overview","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"api-6.txt"),
 ("S-16","Permissions (Indexing API guide)","https://developers.glean.com/api-info/indexing/documents/permissions","T1-developer-docs","Glean Developer","2026-09-20","partner",90,"api-0.txt"),
 ("S-17","Document Model","https://developers.glean.com/api-info/indexing/documents/document-model","T1-developer-docs","Glean Developer","2026-09-20","partner",90,"api-1.txt"),
 ("S-18","Setup Datasource","https://developers.glean.com/api-info/indexing/getting-started/setup-datasource","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"api-2.txt"),
 ("S-19","Indexing SDK — Indexing modes","https://developers.glean.com/libraries/indexing-sdk/concepts/indexing-modes","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"sdk2-2.txt"),
 ("S-20","Indexing SDK — Permissions","https://developers.glean.com/libraries/indexing-sdk/permissions","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"sdk-0.txt"),
 ("S-21","Indexing SDK — Architecture","https://developers.glean.com/libraries/indexing-sdk/concepts/architecture","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"sdk2-1.txt"),
 ("S-22","Indexing SDK — Connector types","https://developers.glean.com/libraries/indexing-sdk/concepts/connector-types","T1-developer-docs","Glean Developer","2026-09-20","partner",90,"sdk2-0.txt"),
 ("S-23","Indexing SDK — PushUploader","https://developers.glean.com/libraries/indexing-sdk/push/uploader","T1-developer-docs","Glean Developer","2026-09-19","partner",90,"sdk2-3.txt"),
 ("S-24","Indexing SDK — Batching and throughput","https://developers.glean.com/libraries/indexing-sdk/push/batching","T1-developer-docs","Glean Developer","2026-09-20","partner",90,"sdk2-4.txt"),
 ("S-25","Indexing SDK — HTTP client","https://developers.glean.com/libraries/indexing-sdk/pull/http-client","T1-developer-docs","Glean Developer","2026-09-19","partner",90,"sdk2-5.txt"),
 ("S-26","Indexing SDK — Pagination","https://developers.glean.com/libraries/indexing-sdk/pull/pagination","T1-developer-docs","Glean Developer","2026-09","partner",90,"sdk3-0.txt"),
 ("S-27","Indexing SDK — Rate limiting","https://developers.glean.com/libraries/indexing-sdk/pull/rate-limiting","T1-developer-docs","Glean Developer","2026-09","partner",90,"sdk3-1.txt"),
 ("S-28","Indexing SDK — Status and debugging","https://developers.glean.com/libraries/indexing-sdk/status-and-debugging","T1-developer-docs","Glean Developer","2026-09","partner",90,"sdk-1.txt"),
 ("S-29","Indexing SDK — CLI","https://developers.glean.com/libraries/indexing-sdk/cli","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"sdk-2.txt"),
 ("S-30","Indexing SDK — Deployment overview","https://developers.glean.com/libraries/indexing-sdk/deployment/overview","T1-developer-docs","Glean Developer","2026-09","partner",90,"sdk-3.txt"),
 ("S-31","Indexing SDK — Observability","https://developers.glean.com/libraries/indexing-sdk/observability","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"sdk-4.txt"),
 ("S-32","Indexing SDK — Overview","https://developers.glean.com/libraries/indexing-sdk/","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"dev-0.txt"),
 ("S-33","Indexing SDK — Quickstart","https://developers.glean.com/libraries/indexing-sdk/quickstart","T1-developer-docs","Glean Developer","2026-09-19","partner",90,"dev-1.txt"),
 ("S-34","Custom Properties","https://developers.glean.com/api-info/indexing/datasource/custom-properties","T1-developer-docs","Glean Developer","2026-09-19","partner",90,"api-3.txt"),
 ("S-35","Custom Properties vs Custom Metadata","https://developers.glean.com/api-info/indexing/custom-metadata/custom-properties-vs-custom-metadata","T1-developer-docs","Glean Developer","2026-09-19","partner",90,"api-4.txt"),
 ("S-36","Activity","https://developers.glean.com/api-info/indexing/documents/activity","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"api-5.txt"),
 ("S-37","Rate Limits and Retries","https://developers.glean.com/get-started/rate-limits","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"api-7.txt"),
 ("S-38","Test Datasource","https://developers.glean.com/api-info/indexing/datasource/test-datasource","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"api-8.txt"),
 ("S-39","Supported MIME Types","https://developers.glean.com/api-info/indexing/documents/supported-mimetypes","T1-developer-docs","Glean Developer","2026-09-18","partner",90,"api-9.txt"),
 ("S-40","Datasource Category","https://developers.glean.com/api-info/indexing/datasource/category","T1-developer-docs","Glean Developer","2026-09-20","partner",90,"api-10.txt"),
 ("S-41","Developer Changelog (glean-indexing-sdk releases)","https://developers.glean.com/changelog/","T1-developer-docs","Glean Developer","2026-09-19","partner",30,"sdk2-8.txt"),
 ("S-42","Index document (API reference)","https://developers.glean.com/api/indexing-api/index-document","T1-developer-docs","Glean Developer","2026-09-20","partner",90,"dev-4.txt"),
 ("S-43","NetSuite MCP","https://docs.glean.com/connectors/native/netsuite/mcp","T1-product-docs","Glean Docs","2026-09-25","partner",90,"snip-netsuite.txt"),
 ("S-44","Glean Partner Content | Custom Connector Best Practices (deck, April 2026)","https://docs.google.com/presentation/d/15HvWzUvLYLZxoHX76WLYksahV-yNdIJc3kYqRpti9dg","T2-partner-enablement","Joe Moeller","2026-09-08","partner",180,"bp-full.txt|bp-deck.txt"),
 ("S-45","[External] Glean Partner Content | Custom Connector Questionnaire","https://docs.google.com/spreadsheets/d/1jWeZyvGmpiChLEgjHNk52dioZPJ2dZJTw_cVDq4HsF8","T2-partner-enablement","Eugene Wiehahn","2025-05-16","partner",180,"int2-3.txt"),
 ("S-46","Glean Custom Connector Content Package","https://docs.google.com/document/d/16wEo2ny-s7TIQsyiNAlYLvZc7aPAoQdmCymQkrPYKh4","T2-partner-enablement","Eugene Wiehahn","2026-05-25","partner",180,"int-0.txt"),
 ("S-47","Glean Partner Competency Program Guide (Feb 2026)","https://docs.google.com/document/d/1mADzsGI3LTRlEIBLXceoMzj0KbQ2N6sLNLojrkMZF7E","T2-program-policy","Sam Cugini","2026-06-26","partner",180,"int-2.txt"),
 ("S-48","Custom Connector Competency Submission Workbook","https://docs.google.com/spreadsheets/d/1Vh4WQq6zGW5BjUZRxy6dwYSggNuQJdsXeI1qU3Xyj8M","T2-program-policy","Sam Cugini","2026-02-06","partner",180,"int2-2.txt"),
 ("S-49","[Template] Custom Connector Intake Form v2","https://docs.google.com/document/d/11TcVp1W61fZ7EuOSfztFHEIA3BsdO6jVGMzY9pcai9M","T2-program-policy","Joe Moeller","2026-07-10","partner",180,"int2-1.txt"),
 ("S-50","Partner-led Custom Connector Development Process","https://docs.google.com/document/d/12IXLo9Jd35hE15sIdeXc4XnDNCw25ABA-ukLZEW9xdk","T3-internal-process","Partnerships","2025-09-24","internal",180,"int-3.txt"),
 ("S-51","[Internal] Custom Connector Request_Process","https://docs.google.com/presentation/d/18LbzkWqU5UZGiudNuYKMG025BpsZqOezBZbYB59QA8w","T3-internal-only","Praveen Menon","2026-09-01","internal-only",180,"int-1.txt"),
 ("S-52","Custom Connector Code Review (Glean skill)","https://app.glean.com/settings/skills?skillId=63e5e694ac254b7b9e88d6caa75401b7","T3-internal-reviewer","Joe Moeller","2026-06-23","reviewer",90,"reviewskill.log"),
 ("S-53","ArisData Custom Connector Review — notes (2026-06-11)","https://docs.google.com/document/d/1CehZM3Q0PHa9Yhj9-YX33R6PtaKpZS9fMAr9vovs1OQ","T4-field-evidence","Bryan Naden","2026-06-11","internal",365,"rev-0.txt"),
 ("S-54","DaCodes + Data Connector Competency — notes (2026-07-15)","https://docs.google.com/document/d/1ImxQYhYS4DgzMGX35u4x2GisFUKNZqx6-mlAgi2o3pM","T4-field-evidence","Bryan Naden","2026-07-15","internal",365,"rev-2.txt"),
 ("S-55","Custom Connector Competency — Rvnway notes (2026-05-18)","https://docs.google.com/document/d/11SQTUYrzS-aMWh3II4c7KhuoBf4u9I2iJwrhzwDree0","T4-field-evidence","Bryan Naden","2026-05-18","internal",365,"rev-1.txt"),
 ("S-56","Custom Datasource Debugging Playbook (Confluence)","https://askscio.atlassian.net/wiki/spaces/ENGINEERIN/pages/2865528891","T3-internal-engineering","Chinmaya Singal","2026-03-04","internal",180,"deletion.log"),
 ("S-57","How Document Deletion Works (Confluence)","https://askscio.atlassian.net/wiki/spaces/ENGINEERIN/pages/797081608","T3-internal-engineering","Alice Wang","2025-08-25","internal",180,"deletion.log"),
 ("S-58","Slack #help-developer-platform — do pushed documents go stale?","https://askscio.slack.com/archives/C03F3JNP9HP/p1732244989775559","T4-field-evidence","Prashant Mahesh","2024-11-22","internal",365,"slackdel.log"),
 ("S-59","Slack #help-connector-escalations — stale deletion check flag","https://askscio.slack.com/archives/C04FXNYPSP5/p1748883723191719?thread_ts=1748883574.856229&cid=C04FXNYPSP5","T4-field-evidence","Chinmaya Singal","2025-06-03","internal",365,"slackdel.log"),
 ("S-60","Slack #launches — Standalone MCPs in the Connectors tab","https://askscio.slack.com/archives/C02TALH7QSH/p1789676424839609?thread_ts=1789676424.839609","T4-field-evidence","Kerem Dilmen","2026-09-17","internal",90,"snip-mcplaunch.txt"),
 ("S-61","[EXTERNAL] Glean Crawler and Indexing Size Limits (partner copy)","https://docs.google.com/document/d/1hmusivKWjCKvF_0vOtBM45jDH7iDrnI7Zy13pIJmTLc","T2-partner-enablement","Joe Moeller","2026-07-14","partner",180,"limits.log"),
 ("S-62","Partner Accreditation & Competency Roadmap","https://docs.google.com/spreadsheets/d/16BS8Y4vawNmNqHJaRY5izRZUGhx_O_14jQefb6ifZ8Q","T2-program-policy","Joe Moeller","2026-09-11","internal",30,None),
]

# claim_id, statement (learner-safe paraphrase), source, verbatim excerpt, modules
C = []
def c(cid, src, excerpt, stmt, mods):
    C.append(dict(id=cid, source=src, excerpt=excerpt, statement=stmt, modules=mods))

# ---- CON-101 connector fundamentals
c("C-001","S-01","A Glean connector integrates Glean with a platform, service, or application where your content lives","A connector integrates Glean with a system where content lives.",["CON-101"])
c("C-002","S-01","They let Glean index content, mirror permissions from the source, and keep that data current in your isolated tenant.","Indexing connectors index content, mirror source permissions, and keep data current in the tenant.",["CON-101","CON-201"])
c("C-003","S-01","Data fetching: Connectors fetch data from connected applications and store the information in Glean's system.","Connector function 1: data fetching, including the permissions map.",["CON-101"])
c("C-004","S-01","Content parsing: Connectors parse item content (for example, title, body, comments, media) and permissions","Connector function 2: content and permission parsing.",["CON-101"])
c("C-005","S-01","Purpose-built for specific applications (for example, Slack, Salesforce, Google Drive). They call source APIs directly","Native connectors are purpose-built per application and call source APIs directly.",["CON-101"])
c("C-006","S-01","Activity data\nCreation, modification, editing, viewing, and sharing timestamps and user information","Glean needs content, people, and activity data to build the Knowledge Graph.",["CON-101","CON-201"])
c("C-007","S-01","The Glean browser extension makes page titles from users’ browsing histories searchable for specific apps. These results are private to the individual user","Web history connectors surface page titles from a user's browsing history, private to that user.",["CON-101"])
c("C-008","S-01","Ideal for custom applications, self-hosted environments, or systems behind firewalls. Data is \"pushed\" into Glean via the Indexing API","Push API connectors push data through the Indexing API for custom, self-hosted, or firewalled systems.",["CON-101"])
c("C-009","S-01","Push API connector code may be shared between customers or Glean partners; support for such code may be limited.","Shared push connector code may have limited support.",["CON-101","CON-301"])
c("C-010","S-01","Built and maintained by Glean technology partners. These connectors use the Indexing API to push data into Glean, but the integration is developed and supported by the partner organization.","Partner connectors use the Indexing API and are built and supported by the partner.",["CON-101","CON-301"])
c("C-011","S-01","Tools retrieve current data or perform actions at request time. They don't make source content searchable.","Tools (including MCP) act at request time and do not make content searchable.",["CON-101"])
c("C-012","S-01","indexed (crawled ahead of time), live (fetched at query time), or hybrid (a mix of both)","Three access modes: indexed, live, hybrid.",["CON-101","CON-201"])
c("C-013","S-01","Latency is typically low, and Glean applies the permission snapshot that was mirrored during crawling and incremental updates.","Indexed access uses the mirrored permission snapshot.",["CON-101","CON-201"])
c("C-014","S-01","Some connectors require individual end users to authenticate before live access works for them.","Live access can require per-user authentication.",["CON-101"])
c("C-015","S-01","Data is end-to-end encrypted in transit and only written to disk once it reaches your tenant.","Connector data is encrypted in transit and written to disk only in the tenant.",["CON-201"])
c("C-016","S-01","Connectors collect activity signals — such as views, edits, and shares — that Glean uses to rank search results by relevance","Activity signals drive relevance ranking.",["CON-201","CON-203"])
c("C-017","S-01","Connectors capture changes as quickly as the source and connector allow, often through webhooks or incremental crawling.","Native freshness uses webhooks or incremental crawling.",["CON-201"])
c("C-018","S-02","connectors populate the index and associated identity and permission structures; the graph interpretation layers on structure and signals derived from that data.","The Enterprise Graph is layered on the index and identity/permission structures.",["CON-201"])
c("C-019","S-02","Identity resolution: Glean aligns identities across systems","Identity resolution aligns identities across systems.",["CON-201"])
c("C-020","S-02","If a user cannot access an item in the source, they should not see it in Glean—assuming the connector and configuration are correct.","Permission mirroring depends on correct connector configuration.",["CON-201","BLD-201"])
c("C-021","S-02","Docs, wikis, tickets, knowledge articles, code, and other bulk corpora; historical or cross-document questions.","Indexed mode suits bulk corpora and historical or cross-document questions.",["CON-101"])
c("C-022","S-02","Email, calendar, chat, or other data where minutes-to-hours freshness dominates, or where continuous full indexing is impractical or undesired.","Live retrieval suits freshness-dominant data or data impractical to index.",["CON-101"])
c("C-023","S-02","Choose data paths: Prefer index, live retrieval, or hybrid, per connector capabilities and query needs.","The runtime chooses index, live, or hybrid paths per request.",["CON-201"])
c("C-024","S-02","Search is often the first place admins validate connector behavior (coverage and permissions) before relying on Chat, Assistant, or Agents.","Validate coverage and permissions in Search first.",["CON-201","BLD-202"])
c("C-025","S-02","Opening a result usually sends the user to the source system, which may enforce access again at click time.","The source may enforce access again at click time.",["CON-201"])
c("C-026","S-02","Retrieved snippets are passed to the language model to condition the answer on your data.","RAG passes retrieved, permission-filtered snippets to the model.",["CON-201"])
c("C-027","S-09","Glean deployments created on or after September 22, 2026, use Connectors to set up catalog-backed MCP integrations.","New deployments set up catalog MCP integrations from Connectors.",["CON-101"])
c("C-028","S-09","A single application can have more than one catalog entry. For example, one entry might index content while another provides MCP tools.","One app can have separate indexing and tools entries.",["CON-101"])
c("C-029","S-09","For a custom or unlisted remote MCP server, use Connect remote MCP servers to Glean instead.","Custom or unlisted MCP servers use a separate setup path.",["CON-101"])
c("C-030","S-43","NetSuite MCP provides real-time access at request time using each user's own NetSuite credentials and role.","Example: NetSuite MCP uses each user's own credentials and role at request time.",["CON-101"])
c("C-031","S-43","NetSuite MCP depends on the native NetSuite connector being set up.","Example of a hybrid design: the MCP entry depends on the indexing connector.",["CON-101"])
c("C-032","S-44","Consider custom actions or MCP integration for querying live data","For live data, consider custom actions or MCP.",["CON-101","CON-202"])
c("C-033","S-44","For large structured data lakes leverage a custom action or MCP server to query the data","For large structured data lakes, query with an action or MCP server.",["CON-101","CON-202"])
c("C-034","S-44","Glean is not a data analytics platform for time series or sensor data","Glean is not a time-series or sensor analytics platform.",["CON-101","CON-202"])
c("C-035","S-44","Work to leverage an existing connector first before building a new one","Use an existing connector before building a new one.",["CON-101","CON-202"])
c("C-036","S-44","Think about migrating data to a data source with a native connector","Consider migrating data to a source with a native connector.",["CON-101"])
c("C-037","S-60","600+ standalone MCPs are now set up directly from the Connectors tab","Hundreds of standalone MCPs are set up from the Connectors tab.",["CON-101"])

# ---- custom connector basics / deployment / setup
c("C-040","S-03","specialized integrations built to ingest and index data from sources that are not natively supported","Custom connectors ingest data from sources without native support.",["CON-101"])
c("C-041","S-03","Custom connectors leverage Glean’s indexing API to push documents, metadata, and permissions into the Glean platform.","Custom connectors push documents, metadata, and permissions via the Indexing API.",["CON-101","CON-203"])
c("C-042","S-03","This is applicable if the connector is deployed in the Glean cloud instance.","Scheduling like native connectors applies to Glean-hosted deployments.",["CON-301"])
c("C-043","S-03","Some custom connectors can include image content as part of indexed content.","Some custom connectors can include image content.",["CON-203"])
c("C-044","S-04","Glean places no constraints on where a custom connector runs","No runtime or hosting constraints.",["CON-301","TEC-201"])
c("C-045","S-04","Choose where it runs before you\nbuild, because it determines how secrets, scheduling, and networking are handled.","Choose hosting before building.",["CON-202","TEC-201"])
c("C-046","S-04","Your environment must allow pushes to Glean's indexing endpoints.","Self-hosted networking must allow pushes to Glean indexing endpoints.",["TEC-201","CON-301"])
c("C-047","S-04","Choose this when data-residency, network isolation, or internal security policies require the\nconnector to run inside your infrastructure.","Self-host when residency, isolation, or policy requires it.",["CON-301"])
c("C-048","S-05","Permissions model — whether documents are permission-aware (per-user ACLs pushed with each\ndocument) or visible to everyone in the org.","Choose the permissions model at setup.",["TEC-201","CON-203"])
c("C-049","S-05","Index a single public sample document and confirm it appears in search. Then\nindex one permissioned document and confirm only authorized users can see\nit. Once both behave correctly, scale up.","First-run: one public, then one permissioned document, then scale.",["TEC-201","BLD-202"])
c("C-050","S-06","The Indexing API (also known as the Push API) pushes documents, users, permissions, and metadata to Glean.","The Indexing (Push) API pushes documents, users, permissions, metadata.",["CON-203"])
c("C-051","S-06","The Client API enables implementation of a custom client interface to interact with the Glean system.","The Client API is for custom client interfaces.",["CON-203"])
c("C-052","S-15","The Indexing API only supports Glean-issued tokens - OAuth authentication is not available.","Indexing API accepts only Glean-issued tokens.",["TEC-201","CON-203","CON-301"])
c("C-053","S-15","Minimum rotation period: 1440 minutes (24 hours)","Minimum token rotation period is 1440 minutes.",["CON-301"])
c("C-054","S-15","An expiration date is required.","Indexing tokens require an expiry date.",["TEC-201","CON-301"])
c("C-055","S-15","The token is only displayed once after creation.","The token value is shown once.",["TEC-201"])
c("C-056","S-15","Setup Admins, Admins, and Super Admins can create Indexing API tokens (only Super Admins can grant global scope).","Only Super Admins can grant global indexing scope.",["TEC-201"])
c("C-057","S-15","Create separate tokens for different environments (dev/staging/prod)","Use separate tokens per environment.",["TEC-201","CON-301"])
c("C-058","S-15","413 Request Entity Too LargeDocument/request too largeSplit into smaller requests or use bulk operations","413 means the request is too large; split it.",["CON-203","CON-301"])
c("C-059","S-15","Restrict API access to known infrastructure","IP restrictions limit tokens to known infrastructure.",["CON-301"])
c("C-060","S-06","IP range restrictions for requests","Indexing tokens support IP range restrictions.",["TEC-201"])

# ---- troubleshooting / pipeline stages
c("C-070","S-07","After documents are uploaded, they will be queued for processing. New documents will be available in search results when the processingHistory timestamp is after the bulkUploadHistory.","Documents are searchable after processingHistory passes bulkUploadHistory.",["CON-201","CON-301"])
c("C-071","S-07","allowAllDatasourceUsersAccess is true and user has been indexed as a user of the connector","allowAllDatasourceUsersAccess requires the user to be indexed as a datasource user.",["CON-203"])
c("C-072","S-07","UPLOAD COMPLETED only means the API accepted your upload. It doesn't mean users are indexed and searchable.","UPLOAD COMPLETED is acceptance, not searchability.",["CON-201","CON-301"])
c("C-073","S-07","Glean expands derived groups and memberships. This step associates u","Processing expands derived groups and memberships.",["CON-201"])
c("C-074","S-07","Incorrect pagination can cause partial uploads to be treated as complete.","Wrong pagination flags can make a partial upload look complete.",["CON-203","BLD-201"])
c("C-075","S-07","This re-indexes all previously uploaded documents without requiring a new upload.","/processalldocuments reprocesses without a new upload.",["CON-301"])
c("C-076","S-07","For issues with user or group permissions rather than document content, use /processallmemberships instead.","Use /processallmemberships for identity problems.",["CON-301"])
c("C-077","S-07","Validation stops at the first invalid custom property it encounters.","Custom property validation fails fast on the first error.",["CON-203"])
c("C-078","S-07","Description of the issue including error message","Support tickets need issue, endpoint/body, connector name, timestamp/timezone.",["CON-301"])
c("C-079","S-37","/processalldocuments1 request every 3 hours per data source","/processalldocuments: once every 3 hours per datasource.",["CON-203","CON-301"])

# ---- migration
c("C-080","S-08","Native and custom connectors occupy separate namespaces in Glean.","Native and custom connectors use separate namespaces.",["CON-101","CON-301"])
c("C-081","S-08","agents, saved searches, app filters, and pinned results scoped to the native connector won't automatically recognize content in the custom connector.","Artifacts scoped to a native connector do not carry over.",["CON-301"])
c("C-082","S-08","When you deactivate a native connector, its content is removed from the search index.","Deactivating a native connector removes its content.",["CON-301"])
c("C-083","S-08","Run both the native and custom connectors in parallel during the transition period.","Run native and custom in parallel during migration.",["CON-301"])

# ---- limits
c("C-090","S-10","If the size is GREATER than 64 MB, the crawler WILL NOT download the item contents and will only download the metadata and permissions information for indexing.","Items over 64 MB index metadata and permissions only.",["CON-202","CON-203"])
c("C-091","S-10","If the content is greater than 16.875 MB, then the first 16.875 MB of content will be stored and fed to the indexer.","Indexable text is truncated at 16.875 MB.",["CON-202","CON-203"])
c("C-092","S-10","By default, approximately 250,000 characters of spreadsheet content are indexed.","Spreadsheets index about 250,000 characters.",["CON-202"])
c("C-093","S-46","This speaks to Native Connector size limits, but should also be followed for Indexing documents into a Custom Connector","Apply the size limits to custom connectors too.",["CON-202","CON-203"])
c("C-094","S-39","application/jsonJSON fileapplication/xmlXML file","JSON and XML MIME types are not supported for content.",["CON-203"])

# ---- Indexing API
c("C-100","S-11","It can attach metadata to documents from any datasource, including native connectors, without re-indexing the source document.","Custom Metadata works on any datasource without re-indexing.",["CON-203"])
c("C-101","S-12","Bulk indexing fully replaces the entire list of documents stored\nin Glean. After a successful bulk upload, all documents that were not a part of the most recent upload are deleted asynchronously.","Bulk indexing replaces the datasource; omitted documents are deleted.",["CON-201","CON-203","BLD-201"])
c("C-102","S-12","/indexdocuments: This endpoint is intended for incremental updates.","/indexdocuments is for incremental updates.",["CON-203"])
c("C-103","S-12","For the indexed document to show up in Glean UI, the datasource must be enabled for search.","The datasource must be enabled for search.",["CON-203","BLD-202"])
c("C-104","S-12","Note that it takes around 15-20 minutes for the documents to be indexed and appear on your Glean UI.","Indexing can take around 15–20 minutes (varies).",["CON-201"])
c("C-105","S-13","Concurrent uploads are not allowed ie. you cannot start a new upload before the previous upload is finished.","No concurrent bulk uploads.",["CON-203","BLD-201"])
c("C-106","S-13","Not specifying this bit in case of an unsuccessful previous upload will fail the request.","After a failed upload, forceRestartUpload is required.",["CON-203"])
c("C-107","S-13","we have a deletion check in place which pauses the deletion of stale documents for 7 days if the percentage of docs being deleted exceeds 20%.","Stale deletion pauses 7 days above 20%.",["CON-201","CON-203","CON-301"])
c("C-108","S-13","If you wish for deletions to take effect immediately, use /processalldocuments endpoint.","Use /processalldocuments for immediate deletions.",["CON-203"])
c("C-109","S-13","You need to have a unique uploadId for all the paginated requests you send for an upload.","One unique uploadId per upload session.",["CON-203"])
c("C-110","S-14","Indexing is asynchronous, so the document can take a few minutes to appear in search.","Indexing is asynchronous.",["CON-201","CON-203"])
c("C-111","S-16","When using non-anonymous permissions, users need to be indexed before being referenced.","Index users before referencing them.",["CON-203","BLD-201"])
c("C-112","S-16","Note that this does not give permissions to the users to search for the document","Indexing a user grants no document access.",["CON-203"])
c("C-113","S-16","Cannot start with the prefix “scio”","Group names: no whitespace, not empty, no 'scio' prefix.",["CON-203"])
c("C-114","S-16","groupName: A group with this particular groupName must be indexed before indexing memberships for it.","Index a group before its memberships.",["CON-203"])
c("C-115","S-16","that can be done by using the\nmemberGroupName\nfield in place of the memberUserId field","Nested groups use memberGroupName.",["CON-203"])
c("C-116","S-16","Permissions and memberships are processed asynchronously","Permissions and memberships process asynchronously.",["CON-203"])
c("C-117","S-17","allowAnonymousAccessIf set to true, anyone who is signed into Glean can view search results for the document","allowAnonymousAccess exposes the document to every signed-in user.",["CON-203","BLD-201"])
c("C-118","S-18","This should be set to true if you want to refer to user identities using emails directly.","isUserReferencedByEmail decides email vs ID references.",["CON-202","CON-203"])
c("C-119","S-18","Avoid regexes that are too broad, and will capture URLs from other datasources, or regexes that are too narrow","urlRegex must be neither too broad nor too narrow.",["CON-203"])
c("C-120","S-40","please set each category using objectDefinitions.docCategory","Set per-object category with docCategory.",["CON-203"])
c("C-121","S-40","Choosing the appropriate type enables enhanced ranking.","Datasource category affects ranking.",["CON-203"])
c("C-122","S-40","This should not be used, please instead use the /bulkindexemployees API to upload data about employees","Do not use the PEOPLE category.",["CON-203"])
c("C-123","S-38","All ranking signals are turned off from a test datasource.","Test datasources have ranking signals off.",["CON-203","BLD-202"])
c("C-124","S-38","For a document to be visible to beta users, they must also have appropriate permissions to view it.","Beta users still need document permissions.",["CON-203","BLD-202"])
c("C-125","S-34","It is highly recommended to configure custom properties first and then upload\ndocuments with the custom properties.","Define custom properties before uploading.",["CON-203"])
c("C-126","S-34","propertyType \"INT\" is not faceted.","INT properties are not faceted.",["CON-203"])
c("C-127","S-34","propertyType \"DATE\" is only faceted if specified value is an epoch timestamp in seconds.","DATE facets need epoch seconds.",["CON-203"])
c("C-128","S-34","Contact Glean support to show the custom property to the search result as per your preference.","Rendering properties in results needs Glean support.",["CON-203"])
c("C-129","S-34","its value is used as a ranking signal to personalize results based on the searcher's location.","The 'country' property is a location ranking signal.",["CON-203"])
c("C-130","S-35","Updating a custom property requires re-uploading the entire document via /indexdocument.","Custom property updates need a full re-upload.",["CON-203"])
c("C-131","S-35","Re-indexing a document via the Indexing API does not affect Custom Metadata attached to it.","Re-indexing does not change Custom Metadata.",["CON-203"])
c("C-132","S-35","Custom Properties support INT, DATE, and USERID types; Custom Metadata does not.","Only Custom Properties support INT, DATE, USERID.",["CON-203"])
c("C-133","S-36","the activity endpoint needs to be called with a client API bearer token (as opposed to an indexing API bearer token for other endpoints).","Activity uses a Client API token.",["CON-203"])
c("C-134","S-36","we need a Global client API token scoped to ACTIVITY.","Activity needs a global Client token scoped to ACTIVITY.",["CON-203"])
c("C-135","S-44","There would be limited signals available due to no activity being pushed, so rankings of search results will be suboptimal.","No activity means weaker ranking.",["CON-201","CON-203"])
c("C-136","S-44","Results from your custom\nconnector are more likely to be outranked by results from other\nconnectors due to stronger ranking signals.","Custom results can be outranked without signals.",["CON-202"])
c("C-137","S-37","/indexdocument10 requests per second/indexdocuments600 documents per minute","/indexdocument 10 rps; /indexdocuments 600 docs/min.",["CON-203","CON-204"])
c("C-138","S-37","8,000 requests per minute across all IP addresses","Deployment limit: 8,000 rpm across IPs.",["CON-203"])
c("C-139","S-37","100 requests per second from a single IP address","Deployment limit: 100 rps from one IP.",["CON-203"])
c("C-140","S-42","OK\nBad Request\nNot Authorized\nConflict\nToo Many Requests","/indexdocument can return 400, 401, 409, 429.",["CON-203"])

# ---- SDK
c("C-150","S-32","The SDK is a client for the Indexing API, not a replacement — the API documentation stays the reference for the wire protocol.","The SDK is a client for the Indexing API.",["CON-204"])
c("C-151","S-32","Use the API directly when indexing from a non-Python service, pushing occasional one-off documents, or attaching custom metadata to documents already in Glean.","When to use the API directly.",["CON-204","CON-203"])
c("C-152","S-32","An allow-all default is the most consequential thing to miss.","Allow-all ACL defaults are the top review risk.",["CON-204","BLD-201"])
c("C-153","S-32","created_at and updated_at must be epoch seconds, not ISO strings.","Timestamps are epoch seconds.",["CON-204"])
c("C-154","S-32","a full crawl must cover the entire confirmed scope before completing, because stale-document deletion removes anything absent from the run.","Full crawls must cover the entire scope.",["CON-204","BLD-201"])
c("C-155","S-32","Each phase swaps exactly one thing from mocked to real, so a failure tells you which layer broke.","Each test phase swaps one dependency.",["CON-204"])
c("C-156","S-32","Eight skills coordinate the build.","The Connector Builder uses eight skills.",["CON-204"])
c("C-157","S-33","A connector is two classes: a data client that fetches records from your\nsource, and a connector that turns them into Glean documents.","A connector is a data client plus a connector class.",["CON-204"])
c("C-158","S-33","CustomDatasourceConfig.name may contain only\nASCII letters and digits","Datasource name: ASCII letters and digits only.",["CON-204"])
c("C-159","S-33","Do not rely on --max-items to make a shared datasource safe","--max-items is not a safety control.",["CON-204","BLD-202"])
c("C-160","S-33","Indexing is asynchronous — an accepted upload is not yet a searchable\ndocument.","Accepted is not searchable.",["CON-204"])
c("C-161","S-21","Two environment variables. There is no configuration file.","SDK config: two env vars.",["CON-204"])
c("C-162","S-21","A missing variable raises MissingEnvironmentVariableError at client\nconstruction, not mid-upload.","Missing env vars fail at construction.",["CON-204"])
c("C-163","S-21","A full crawl calls PushUploader.bulk_index_documents() for replacement and stale cleanup. An incremental crawl calls additive index_documents().","Full = replacement; incremental = additive.",["CON-204"])
c("C-164","S-21","Every SDK exception derives from GleanError and carries a fix_suggestion","SDK errors derive from GleanError.",["CON-204"])
c("C-165","S-21","On exception, increments the error counter and re-raises so a scheduler sees a non-zero exit.","Failures exit non-zero.",["CON-204","CON-301"])
c("C-166","S-21","their indexing implementations do not run the optional get_identities() crawl.","Streaming connectors do not run get_identities().",["CON-204"])
c("C-167","S-22","the fix is a streaming connector, not a smaller batch size, because batching happens after transform.","Memory limits need streaming, not smaller batches.",["CON-204"])
c("C-168","S-22","All four classes expose batch_size, defaulting to 1000.","batch_size defaults to 1000.",["CON-204"])
c("C-169","S-22","It's distinct\nfrom the datasource identities (users, groups, memberships) that back\ndocument ACLs","Employee data is separate from ACL identities.",["CON-204"])
c("C-170","S-19","Never let a partial or failed fetch finish as a successful full crawl.","Never let a partial fetch complete as a full crawl.",["CON-204","BLD-201"])
c("C-171","S-19","A failed crawl is recoverable. A successful crawl that deleted 90% of your\nindex is not.","A bad successful crawl is not recoverable.",["BLD-201"])
c("C-172","S-19","The SDK does not persist checkpoints","The SDK does not persist checkpoints.",["CON-204"])
c("C-173","S-19","Record the timestamp from before the crawl started, and only write it after\nthe run succeeds.","Checkpoint: start time, written only on success.",["CON-204","BLD-201"])
c("C-174","S-19","it needs a durable checkpoint and a reliable source-side deletion signal before it is correct rather than merely faster.","Incremental needs a checkpoint and a deletion signal.",["BLD-201"])
c("C-175","S-19","Incremental every 15–60 minutes — keeps search fresh at low cost.","Common schedule: incremental 15–60 min.",["BLD-201"])
c("C-176","S-19","Full nightly or weekly — reconciles deletions and repairs drift.","Common schedule: full nightly or weekly.",["BLD-201"])
c("C-177","S-19","A successful empty full crawl sends one complete empty bulk page so all\npreviously indexed documents are reconciled as stale.","An empty full crawl clears the datasource.",["CON-204"])
c("C-178","S-19","Discards any in-progress upload session and starts a new one. Use after a crashed run leaves an upload stuck — not as a default.","force_restart only after a stuck upload.",["CON-204"])
c("C-179","S-19","overlap the window slightly rather than\nrisking a gap","Overlap incremental windows slightly.",["BLD-201"])
c("C-180","S-23","the first opens the upload\nsession, the last closes it and triggers stale deletion, so neither can race.","First and last pages are sequential.",["CON-204"])
c("C-181","S-23","This is the right call for event-driven connectors reacting to a webhook.","index_documents() suits webhook updates.",["CON-204"])
c("C-182","S-23","a batch closes when it hits batch_size documents\nor max_batch_bytes serialized bytes, whichever comes first.","Batches close at count or byte cap.",["CON-204"])
c("C-183","S-23","Membership bulk\nuploads do not expose a stale-deletion option","Membership bulk uploads lack a stale-deletion option.",["CON-204"])
c("C-184","S-24","Tuning upload concurrency when 90% of wall-clock is data_fetch accomplishes\nnothing.","Tune the dominant stage only.",["CON-204"])
c("C-185","S-24","Smaller batches are usually the better answer.","Prefer smaller batches over longer timeouts.",["CON-204"])
c("C-186","S-25","The default max_attempts=2 is deliberately conservative — one retry.","Default retries: one retry.",["CON-204","BLD-201"])
c("C-187","S-25","PullOptions.mask_params defaults to True, so query parameters are redacted\nin the client's request logs.","Query params are redacted in logs.",["CON-204","CON-301"])
c("C-188","S-25","Redaction covers logging only.","Redaction covers logs only.",["CON-301"])
c("C-189","S-25","the cap bounds what you receive, not what gets buffered.","get_bytes cap does not bound buffering.",["CON-204"])
c("C-190","S-26","Offset pagination is unstable against a source being written to during the\ncrawl.","Offset pagination is unstable under writes.",["CON-204","BLD-201"])
c("C-191","S-26","Whatever loop you write must terminate on a source that misbehaves.","Paging loops must terminate.",["CON-204","BLD-201"])
c("C-192","S-26","identical to\nthe previous cursor","Cursor mode stops on a repeated cursor.",["CON-204"])
c("C-193","S-27","A source allowing 600 requests/minute is 10/second; running at\n7–8 leaves room for retries","Run below the source quota.",["CON-204","BLD-201"])
c("C-194","S-27","The rate limiter is proactive","Rate limiting is proactive; retries are reactive.",["CON-204","BLD-201"])
c("C-195","S-20","Never index sensitive content with an allow-all ACL \"for now.\"","Never allow-all 'for now'.",["BLD-201","CON-204"])
c("C-196","S-20","An ACL naming a group Glean has never heard of matches nobody.","Unknown groups match nobody.",["CON-203","CON-204"])
c("C-197","S-20","Don't flatten groups into user\nlists","Do not flatten groups into users.",["BLD-201"])
c("C-198","S-20","A user must belong to every group within one entry; multiple entries are alternative intersections.","Intersection semantics.",["CON-203"])
c("C-199","S-20","Counting indexed documents proves nothing about permissions.","Counts prove nothing about permissions.",["BLD-202","ACC-107"])
c("C-200","S-20","the search result is the ground truth, not the upload response.","Search as the user is ground truth.",["BLD-202"])
c("C-201","S-20","If you return groups, you must also return memberships.","Groups require memberships.",["CON-204"])
c("C-202","S-28","Most \"the connector is broken\" reports are really one of four things","Four-step missing-document diagnosis.",["CON-301"])
c("C-203","S-28","Appears, then disappears","'Appears then disappears' means stale deletion.",["CON-301"])
c("C-204","S-28","Alert on documents_indexed dropping\nsharply between runs","Alert on sharp drops in documents_indexed.",["CON-301"])
c("C-205","S-28","a correct-looking ACL is still wrong if the identities it names were never pushed.","ACLs fail without pushed identities.",["CON-301"])
c("C-206","S-29","Every live phase requires --allow-destructive-live","Live tests need --allow-destructive-live.",["CON-204","BLD-202"])
c("C-207","S-29","teardown cannot be undone.","teardown is irreversible.",["CON-204"])
c("C-208","S-29","SDK-owned exit codes are stable.","CLI exit codes are stable.",["CON-204"])
c("C-209","S-29","An ambiguous transport failure is reconciled by reading state back, never by blindly repeating the write.","Ambiguous writes are read back, not retried.",["CON-204"])
c("C-210","S-30","A connector is a batch job: it starts, pulls from a source, pushes to Glean, and\nexits.","A connector is a batch job.",["CON-204","CON-301"])
c("C-211","S-30","The generated Terraform does not create a project/account, cluster, registry,\nWorkload Identity/IRSA foundation, or namespace.","Terraform does not create the foundation.",["CON-301"])
c("C-212","S-30","Generated Terraform is an artifact, not the configuration interface.","Edit glean_deployment.yaml, not Terraform.",["CON-301"])
c("C-213","S-30","A full and incremental schedule need separate deployment configurations","Full and incremental need separate configs.",["CON-301"])
c("C-214","S-30","A completed\nKubernetes Job proves only that the process exited successfully","A completed Job is not proof of indexing.",["CON-301"])
c("C-215","S-30","The workload cannot enumerate\nsecrets.","The workload cannot enumerate secrets.",["CON-301"])
c("C-216","S-30","There is no Indexing API operation to delete a datasource registration.","No API to delete a datasource registration.",["CON-301"])
c("C-217","S-30","It can run as a VM cron job,\nCloud Run or Lambda job, Airflow task, or scheduled CI workload.","Connectors can run on many schedulers.",["CON-301"])
c("C-218","S-31","You get stage timings, item counts, and\nstructured logs without adding any instrumentation.","Observability is built in.",["CON-204"])
c("C-219","S-31","The cloud provider plugins are currently tested only against mocks","Cloud telemetry plugins are mock-tested only.",["CON-301"])
c("C-220","S-41","glean-indexing-sdk v1.2.0","Current SDK release reviewed: v1.2.0.",["CON-204"])

# ---- Deck: architecture and best practices
c("C-230","S-44","Glean uses a 3-tier system to ensure content is continuously kept up-to-date in the index.","Native freshness: three tiers.",["CON-201"])
c("C-231","S-44","Glean conducts a full re-crawl of the entire datasource every 4 weeks. This is technically not needed, but is done as a default “catch-all”.","Native full re-crawl every 4 weeks as a catch-all.",["CON-201"])
c("C-232","S-44","Documents, permissions, people data, and user activity all flow through the same\nbackend queueing and indexing system at a high level, so one type of backlog can\naffect another.","One shared queue: one backlog can delay another.",["CON-201"])
c("C-233","S-44","Worst case: several hours\nto 24+ hours","Worst case latency can exceed 24 hours.",["CON-201"])
c("C-234","S-44","Verifies identities\nand access data.\nWaits for required\ndependencies.","Processing checks identity and permission dependencies before results show.",["CON-201"])
c("C-235","S-44","Consider roles a type of group","Model roles as groups.",["BLD-201"])
c("C-236","S-44","It may be better to combine relational data into a single\ndocument object to be indexed","Combine relational data into one document.",["BLD-201"])
c("C-237","S-44","Leverage a simple database to keep track of document\nstate to more easily ensure data freshness","Keep document state in a simple database.",["BLD-201"])
c("C-238","S-44","Automated indexing token rotation","Automate token rotation.",["BLD-201","CON-301"])
c("C-239","S-44","Implement incremental and monthly indexing to keep data up to date","Deck guidance: incremental plus monthly full.",["BLD-201"])
c("C-240","S-44","Manual map of users to corporate identities needs to be\nprovided","Without identity data, a manual user map is needed.",["CON-202"])
c("C-241","S-44","Can’t be used for GenAI Glean Assistant will not be able to summarize the content","Metadata-only results cannot ground Assistant.",["CON-202"])
c("C-242","S-44","retries, backoff, dead-letter queue","Architecture includes retries, backoff, DLQ.",["BLD-201"])
c("C-243","S-44","Client REST API functionality requires additional licensing above stand enterprise licensing","Client REST API may require extra licensing (verify).",["CON-203"])

# ---- Questionnaire
c("C-250","S-45","Is there an existing Native Connector for this Source System, or can it be crawled using the native Glean Web Crawler datasource?","Scoping asks about native and web-crawler options first.",["CON-202"])
c("C-251","S-45","read-only keys are preferred if supported for Content+Permission+Activity data","Prefer read-only keys.",["CON-202"])
c("C-252","S-45","Do users in the Source System match users in the SSO system associated with Glean?","Check source users match SSO users.",["CON-202"])
c("C-253","S-45","Can the Source System Export Content to an external data storage location","Fallback when no API: export to storage.",["CON-202"])
c("C-254","S-45","Is there a Dev/Test/Sandbox environment against which connector development can be tested/validated?","Ask for a sandbox.",["CON-202"])
c("C-255","S-45","Where should users be redirected when they click the document in Glean (viewURL)?","Define the viewURL target.",["CON-202"])
c("C-256","S-45","Will the API URL stay static?","Ask whether the API URL is static.",["CON-202"])
c("C-257","S-45","How often are permissions updated in the Source System?","Ask permission change frequency.",["CON-202"])

# ---- Competency program
c("C-260","S-47","The Custom Connector Competency certifies Partners to scope, build, deploy, and maintain custom data source integrations with Glean","Competency definition.",["ACC-107"])
c("C-261","S-47","Indexes users, permissions, and documents/data","Build must index users, permissions, documents.",["ACC-107"])
c("C-262","S-47","Some level of automated index updating","Build must auto-update.",["ACC-107"])
c("C-263","S-47","Error and retry/backoff handling","Build must handle errors with retry/backoff.",["ACC-107"])
c("C-264","S-47","Complete 5 technical accreditations within the  Glean Partner Portal","Five technical accreditations required.",["ACC-107"])
c("C-265","S-47","Complete & include a customer-approved maintenance plan","Customer-approved maintenance plan required.",["ACC-107","CON-301"])
c("C-266","S-47","This competency is validated every 18 months.","Renewal every 18 months.",["ACC-107"])
c("C-267","S-47","Glean competencies require thorough experience and successful completion of an audit process.","Competencies require an audit.",["ACC-107"])
c("C-268","S-47","A zip file including the Competency Submission Workbook and all necessary requirements documentation","Submit a zip with the workbook.",["ACC-107"])
c("C-269","S-47","Complete custom connector architecture review with Glean technical resource","Architecture review required.",["ACC-107"])
c("C-270","S-48","Written documentation from a customer within 3 months prior to renewal","Renewal feedback within 3 months.",["ACC-107"])
c("C-271","S-48","Complete & include a technical specifications document","Technical specification required.",["ACC-107"])
c("C-272","S-49","This template gathers the appropriate information needed to publish a partner-built custom connector on the Glean Connectors webpage.","Intake form v2 supports publishing.",["CON-301","ACC-107"])
c("C-273","S-49","Glean expects the partner to maintain and support this connector.","Partner maintains published connectors.",["CON-301"])
c("C-274","S-49","The partner should request written confirmation that permissions and security are meeting expectations once a custom test group has reviewed the results.","Get written permission/security confirmation.",["CON-301","ACC-107"])
c("C-275","S-49","Permission propagation logic","Docs must explain permission propagation.",["CON-301"])
c("C-276","S-50","Technical accreditation, technical deep dive, and custom connector workshop","Partner-led prerequisites.",["ACC-107"])
c("C-277","S-50","Glean team to perform code review on partner-developed connectors","Glean reviews partner code.",["ACC-107"])
c("C-278","S-50","2 - 4 week customer review","2–4 week customer review.",["CON-301"])

# ---- reviewer / field evidence (internal)
c("C-290","S-52","Do not let strong document indexing mask missing identity, group, or permissions coverage.","Reviewers score identity and permissions separately.",["ACC-107","BLD-201"])
c("C-291","S-52","Bulk indexing should be treated as a full-replacement strategy, not a convenience default.","Bulk is a replacement strategy.",["BLD-201","ACC-107"])
c("C-292","S-52","stable document IDs derived from source identifiers rather than mutable titles or URLs","Stable IDs from source identifiers.",["BLD-201","ACC-107"])
c("C-293","S-52","A connector needs a deletion story for every indexed object family it owns.","Deletion story per object family.",["BLD-201","ACC-107"])
c("C-294","S-52","evidence that permission changes can be caught even when document text does not change","Detect permission-only changes.",["BLD-201","ACC-107"])
c("C-295","S-52","Score each category as Meets, Partially Meets, Does Not Meet, or Not Enough Evidence.","Reviewer scale.",["ACC-107"])
c("C-296","S-52","Prefer email-based identities when the source supports them.","Prefer email identities.",["BLD-201"])
c("C-297","S-52","Do not accept over-broad permissions just because ACL mapping is hard.","No over-broad fallback ACLs.",["BLD-201","ACC-107"])
c("C-298","S-53","the code review flagged specific items, including the need for content model refinements and issues with stable IDs","Field: stable IDs flagged.",["BLD-201"])
c("C-299","S-53","the team must avoid hardcoding secrets and instead implement proper secret management systems","Field: hardcoded secrets flagged.",["BLD-201","CON-301"])
c("C-300","S-53","raised concerns regarding the use of JSON files for state management","Field: JSON-file state flagged.",["BLD-201"])
c("C-301","S-54","Specific concerns included a reference to \"allow anonymous access\" and the need for a documented maintenance plan.","Field: anonymous access and missing maintenance plan flagged.",["BLD-201","ACC-107"])
c("C-302","S-54","the lack of a deployment in a real-world production customer environment was identified as a key blocker","Field: production deployment is a blocker.",["ACC-107"])
c("C-303","S-56","If datasourceVisibility is ENABLED_FOR_TEST_GROUP, the document will only be visible to users with appropriate permissions in the test group.","Visibility states gate results.",["CON-301"])
c("C-304","S-58","If they use bulk index documents - we will delete stale documents based on what was not uploaded in the latest one","Field confirmation of bulk replacement.",["CON-201"])
c("C-305","S-59","this  is  due to the stale deletion check flag.","Field: safeguard kept deleted docs visible.",["CON-301"])

# ---- v2.1 additions for the SCORM build (2026-09-27)
c("C-310","S-21","Users are bulk-indexed first. If groups are returned, memberships must be too — otherwise the SDK raises InconsistentDataError, because groups without memberships produce ACLs that can never match anyone.","In the SDK identity crawl, users are bulk-indexed first; groups without memberships raise InconsistentDataError.",["CON-204"])
c("C-311","S-21","SDK owns batching, retries, upload sessions, and stale-document cleanup.","The SDK owns batching, retries, upload sessions, and stale-document cleanup.",["CON-204"])
c("C-312","S-21","GLEAN_SERVER_URLYour Glean backend URL","GLEAN_SERVER_URL is the Glean backend URL.",["CON-204"])
c("C-313","S-21","GLEAN_INDEXING_API_TOKENDatasource-scoped Indexing API token.","GLEAN_INDEXING_API_TOKEN is a datasource-scoped Indexing API token.",["CON-204"])
c("C-314","S-22","If you're unsure, start with BaseDatasourceConnector. Switching to a streaming variant later means changing the base class and the return type of get_source_data() — transform() is unchanged.","Start with BaseDatasourceConnector if unsure; switching to streaming changes the base class and get_source_data() return type, not transform().",["CON-204"])
c("C-315","S-22","The dataset is large or paginated and your source client is synchronous.","Use the streaming connector when the dataset is large or paginated and the source client is synchronous.",["CON-204"])
c("C-316","S-22","Same model, async generators. Drive it with index_data_async().","The async streaming connector uses async generators and is driven with index_data_async().",["CON-204"])
c("C-317","S-25","production connectors should raise it to 4 or 5, particularly against APIs that rate-limit aggressively.","Production connectors should raise max_attempts to 4 or 5 against aggressive rate limiters.",["CON-204"])
c("C-318","S-25","retry_status_codes{429, 500, 502, 503, 504}Everything else fails immediately.","The SDK HTTP client retries 429, 500, 502, 503, 504; everything else fails immediately.",["CON-204"])
c("C-319","S-20","It also rejects missing permissions, allow_anonymous_access=True, and allow_all_datasource_users_access=True, because any of those prevents the harness from proving a configured identity is denied.","Phase 2 rejects missing permissions, anonymous access, and all-datasource-users access because they prevent proving denial.",["CON-204"])
c("C-320","S-20","returning the deduplicated user_ids and group_ids your documents actually reference.","extract_permission_refs() returns the user and group IDs the documents reference.",["CON-204"])
c("C-321","S-29","Whether a given user can see a document","glean-idx document access checks whether a given user can see a document.",["CON-204","CON-301"])
c("C-322","S-29","Uploaded and indexed counts per object type, identity counts, visibility, and the most recent upload and processing runs.","glean-idx datasource status shows uploaded and indexed counts, identity counts, visibility, and recent runs.",["CON-204","CON-301"])
c("C-323","S-26","Paging stops when the cursor is missing, empty, not a string, or identical to the previous cursor.","SDK cursor paging stops when the cursor is missing, empty, not a string, or repeated.",["CON-204","BLD-201"])
c("C-324","S-21","On an incremental crawl, calls _get_last_crawl_timestamp(). The base implementation returns None.","On an incremental crawl the SDK calls _get_last_crawl_timestamp(); the base implementation returns None.",["CON-204"])
c("C-325","S-19","which means since is None and your data client falls back to a full fetch.","Without an override, since is None and the data client falls back to a full fetch.",["CON-204"])
c("C-326","S-33","max_items limits how many source items each registered client consumes. It is not a Glean-side upload cap or a blast-radius guarantee.","max_items limits source consumption; it is not a Glean-side upload cap or a blast-radius guarantee.",["CON-204","CON-301"])
c("C-327","S-28","a max_items cap left set from local testing.","A max_items cap left set from local testing is a named cause of partial full crawls.",["CON-301"])
c("C-328","S-28","an auth token expiring mid-crawl","An auth token expiring mid-crawl is a named cause of partial full crawls.",["CON-301"])
c("C-329","S-32","It explores the source's API, plans the connector with you, generates it against this SDK, and tests it before anything reaches your index.","The Connector Builder explores the source API, plans with you, generates the connector against the SDK, and tests it before anything is indexed.",["CON-204"])
c("C-330","S-32","runs the mocked and recorded test phases before offering to index anything.","The Connector Builder runs mocked and recorded test phases before offering to index anything.",["CON-204"])
c("C-331","S-28","a source error swallowed inside a paging loop","A source error swallowed inside a paging loop is a named cause of partial full crawls.",["CON-301"])
c("C-332","S-30","glean-idx deploy generates and operates a Docker image and Terraform for a Kubernetes CronJob on GKE or EKS.","glean-idx deploy generates a Docker image and Terraform for a Kubernetes CronJob on GKE or EKS.",["CON-204","CON-301"])
c("C-333","S-47","Complete Glean-delivered custom connector workshop session with your Glean technical team","The competency requires a Glean-delivered custom connector workshop session.",["ACC-107"])
c("C-334","S-47","Partner Manager for support with selecting and achieving a Glean Partner Competency","Partners work with their Partner Manager to select and achieve a competency.",["ACC-107"])

def norm(s):
    s = html.unescape(s)
    s = s.replace("\u200b","").replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"').replace("–","-").replace("—","-")
    s = re.sub(r"^> ?", "", s, flags=re.M)
    s = re.sub(r"\s+", " ", s)
    return s.strip()

src = {s[0]: s for s in SOURCES}
cache = {}
fails = []
for cl in C:
    s = src[cl["source"]]
    f = s[8]
    if f is None:
        fails.append((cl["id"], "no evidence file")); continue
    if f not in cache:
        cache[f] = " ".join(norm(open(R+x, encoding="utf-8", errors="ignore").read()) for x in f.split("|"))
    ok = norm(cl["excerpt"]) in cache[f]
    cl["verified"] = ok
    if not ok: fails.append((cl["id"], cl["excerpt"][:80]))

print("claims:", len(C), "fails:", len(fails))
for f in fails: print("  FAIL", f)

if "--write" in sys.argv and not fails:
    tiers = {}
    out_sources = []
    for s in SOURCES:
        out_sources.append(dict(id=s[0], title=s[1], url=s[2], authority=s[3], owner=s[4],
            source_updated=s[5], read_in_full="2026-09-26", audience=s[6], review_every_days=s[7],
            learner_facing_allowed = s[6] in ("partner",)))
    json.dump(dict(version="2.0.0", generated="2026-09-26",
        authority_order=["T1-product-docs","T1-developer-docs","T2-program-policy","T2-partner-enablement","T3-internal-*","T4-field-evidence"],
        rule="Product behavior: T1 only. Program rules: T2-program-policy. T3/T4 inform reviewer rubrics, misconceptions, and cases; never learner-facing product claims.",
        sources=out_sources), open(OUT+"/sources.json","w"), indent=2)
    out_claims=[]
    for cl in C:
        aud = src[cl["source"]][6]
        out_claims.append(dict(id=cl["id"], statement=cl["statement"], source=cl["source"],
            excerpt=norm(cl["excerpt"]), modules=cl["modules"], audience=aud,
            status="verified-verbatim" if cl["verified"] else "unverified",
            verified_on="2026-09-26",
            learner_facing = aud=="partner" and cl["id"] not in ("C-243",)))
    json.dump(dict(version="2.1.0", generated="2026-09-27", count=len(out_claims), claims=out_claims),
        open(OUT+"/claims.json","w"), indent=2)
    print("written")
