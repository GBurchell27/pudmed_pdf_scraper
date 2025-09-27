# PubMed PDF Scraper App — Detailed Build Description

The application is a **web-based tool** for automatically retrieving and downloading research article PDFs based on PubMed queries. It should allow researchers to input a search query, retrieve article results from PubMed, resolve whether a PDF is available either from PubMed Central (PMC) or external journal websites, and then download and organize those PDFs. The app should include **frontend, backend, database, and worker processes**, with clear user flows and error handling.

---

## User Journey

### Stage 1: Onboarding / Job Creation

* The user starts by opening a **“New Job”** page.
* They paste a PubMed query (for example: `"atrial fibrillation"[tiab] AND malnutrition[tiab]`).
* They may set advanced options:

  * Maximum number of results to fetch
  * Date range for studies
  * Whether to include PMC-only results or allow crawling external journals
  * Concurrency level (number of downloads in parallel, between 1 and 5)
  * Destination folder or naming rules for saved PDFs
* They click a **“Validate Query”** button to check the syntax, then **“Start Job.”**
* If the query is invalid or empty, they see an inline error. If concurrency is set too high, the system automatically reduces it to a safe limit.
* Once valid, the system creates a new job, stores it in the database, and returns a `job_id` with initial status set to “Queued.”

### Stage 2: Running the Search

* The system runs the PubMed search using the provided query.
* It fetches PMIDs (PubMed IDs), article titles, PubMed URLs, and PMC IDs if available.
* Each article is stored as a preliminary record with a status like “Pending URLs.”
* If no results are found, the job status becomes “Empty” and a “0 results” screen is shown.
* If PubMed rate limits or returns an error, the system retries with backoff. Persistent failure marks the job as “Failed Search.”
* The user sees a results table with the list of articles, their PMIDs, titles, and current PDF status.

### Stage 3: Resolving PDF Sources

* For each article, the system decides where to obtain the PDF.
* If a PMC ID is present, it builds the direct PMC PDF link.
* If no PMC is present and the user has allowed external crawling:

  * The system extracts full-text links from the PubMed record and prepares to crawl them.
* If external crawling is not allowed, the article is marked “Skipped.”
* Failure states are clearly tracked, such as “Robots.txt disallows,” “Paywall detected,” or “Access blocked.”
* The UI shows per-article source resolution status: **PMC, External, Skipped, or Failed.**

### Stage 4: Crawling External Journals

* When external crawling is enabled, the system fetches the HTML of the journal landing page.
* It looks for PDF links using common patterns like “href ending in .pdf,” “Download PDF,” or metadata tags.
* Relative links are normalized. If no PDF is found, it may attempt one additional hop (depth limit of 2).
* If blocked by a cookie wall, JavaScript-heavy rendering, or explicit robots.txt rules, the article is marked with the relevant failure state.
* The user can preview crawl results in the UI for a given article.

### Stage 5: Downloading PDFs

* The user clicks **“Download All”** or selects specific rows to download.
* They may set a filename pattern (such as `pmid_author_year.pdf`).
* The system streams the PDF to storage, validates that the file is truly a PDF, checks file size, and computes a checksum.
* Duplicate files (same checksum) are deduplicated.
* Articles update their status to “Downloaded” or an appropriate failure status if something goes wrong.
* Download progress is displayed via a progress bar with counts for queued, downloading, done, and failed.

### Stage 6: Reviewing and Retrying

* The user can filter the results table by status: Downloaded, Failed, or Skipped.
* Clicking an article allows them to open the PDF, view the source page, or retry the download.
* For retries, the system shows the reason for failure (e.g., paywall) and allows the user to manually enter a corrected source URL.
* Retry attempts are limited to avoid infinite loops.

### Stage 7: Exporting

* Once finished, the user can export metadata (as CSV or JSON) containing information such as PMID, title, chosen source, file path, and status.
* They can also download a ZIP archive containing all PDFs.
* Large ZIP files should be streamed in chunks or broken into batches.

### Stage 8: Saving and Scheduling Jobs (Future Enhancement)

* Users can save job templates with their query and options.
* They may schedule the job to rerun automatically (for example, every week).
* Duplicate schedules should trigger a warning or be merged.

---

## Key Inputs and Outputs

* **Inputs:** PubMed query, options (max results, date filters, PMC-only flag, allow external crawl, concurrency, filename pattern).
* **Outputs:** Job ID, per-article statuses, logs of failures, saved PDFs, metadata exports (CSV/JSON), optional ZIP archive.

---

## Decision Logic

1. If PMC is present, always prefer PMC direct PDF.
2. If PMC is absent and external crawling is enabled, attempt crawl; otherwise skip.
3. Respect robots.txt rules and publisher terms. If crawling is disallowed, mark article as skipped.
4. Validate that retrieved files are true PDFs by checking MIME type and file structure.
5. Deduplicate files using checksums.
6. Apply rate limits and backoff to avoid hammering external servers.

---

## Data Model

The app uses a simple relational database (SQLite in MVP, extendable later):

* **Jobs Table**: stores job metadata, queries, settings, status, and error messages.
* **Articles Table**: stores article metadata (PMID, title, URLs, chosen PDF URL, status, failure reasons).
* **Downloads Table**: stores file paths, sizes, MIME type, checksums, and timestamps.
* **Logs Table**: stores messages and errors associated with jobs and articles.

---

## Frontend (Next.js)

* Pages:

  * `/jobs/new`: form for creating new jobs with validation.
  * `/jobs/{job_id}`: job details and progress view, with results table and export options.
* Components:

  * JobForm: input form for query and options.
  * ResultsTable: lists articles with statuses and actions.
  * ProgressBar: shows progress through search, resolve, crawl, and download stages.
  * StatusChip: visual badges for status like Downloaded, Failed, Skipped.
  * RetryButton and ExportMenu: contextual user actions.

---

## Backend (FastAPI)

* Endpoints for creating jobs, running searches, resolving sources, downloading PDFs, retrying failed articles, and exporting results.
* Background workers handle long-running operations (search, crawling, downloading).
* Error states are reported clearly and stored in logs.

---

## Guardrails

* Always respect robots.txt.
* Provide clear error reasons like “Paywall detected” or “File was HTML, not PDF.”
* Limit concurrency to avoid server overload.
* Store files with deterministic safe filenames.
* Include a dry-run mode to test queries and resolve sources without downloading.

---

## Core User Intents

* **Bulk one-off download:** Run search, resolve sources, download, export.
* **PMC-only quick harvest:** Skip crawling, grab only PMC PDFs.
* **Metadata-only diagnostic run:** Search and resolve sources without downloading.
* **Recovery from errors:** Filter failed articles, retry with corrected URLs, then export.

