# Job files

Workers read one JSON file from this directory. The schema is `skills/references/job-contract.md`.

A job file is written when a run starts. Do not add a sample file here. A file in this directory is a real assignment.

Status for the whole queue stays in `plan/status.json`. A scan writes proposals to `plan/refresh-queue.json`, which is gitignored, and the durable copy of a scan belongs in the scan note and the job files the dispatcher then opens.
