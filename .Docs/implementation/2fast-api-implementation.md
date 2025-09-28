## FastAPI Delivery Plan (Baby Steps)

**Goal**
- Ship a minimal, testable FastAPI backend and a proof-of-concept PDF resolver
- Deliver in small, verifiable steps; Next.js only calls HTTP endpoints

**Constraints**
- No persistent databases, queues, or auth yet
- Keep runtime state in memory with clear seams to swap in real infra later

### 1. ✅ Scaffold
- Create `backend/` with `app/main.py`, `app/api/jobs.py`, `app/core/config.py`, `app/services/resolver.py`, `tests/`
- Add `pyproject.toml` / `requirements.txt`, `README.md`, `Makefile` (or simple run commands)
- **Acceptance**: `uvicorn app.main:app --reload` exposes `GET /healthz → {"ok": true}`
- **Milestone Test**: `curl http://localhost:8000/healthz` returns `{"ok": true}` and logs show startup without errors

### 2. ✅ Job model + polling endpoints
- Pydantic models: `JobCreate { urls: list[str] }`, `JobStatus { id, created_at, state, items }`
- Endpoints: `POST /jobs` (returns generated `id`), `GET /jobs/{id}` (returns status payload)
- In-memory repository tracks jobs and associated items
- **Acceptance**: Create job → receive `id` → poll status → returns `queued`
- **Milestone Test**: `curl -X POST http://localhost:8000/jobs -d '{"urls":["https://pubmed.ncbi.nlm.nih.gov/example"]}'` then `curl http://localhost:8000/jobs/{id}` shows `state: "queued"`
- ✅✅ (base) PS C:\Users\georg\Documents\Python_Scripts\pubmed_pdf_scraper> Invoke-RestMethod      -Method  Post -Uri http://localhost:8000/jobs `
        >>   -Headers @{ "Content-Type" = "application/json" } `
        >>   -Body '{"urls":["https://pubmed.ncbi.nlm.nih.gov/example"]}'

        id
        --
        7fa43697adf84fe088444449727ed0d1


(base) PS C:\Users\georg\Documents\Python_Scripts\pubmed_pdf_scraper>

### 3. ✅ Background processing (simple)
- Use FastAPI `BackgroundTasks` to iterate submitted URLs and invoke resolver
- Update in-memory state to reflect transitions and item outcomes
- **Acceptance**: Job state flows `queued → running → done/failed` deterministically
- **Milestone Test**: Submit a job with two dummy URLs; observe successive `GET /jobs/{id}` responses showing state progression and final completion within a few seconds
-✅✅✅✅✅✅ Invoke-RestMethod -Method Post -Uri http://localhost:8000/jobs `
     -Headers @{ "Content-Type" = "application/json" } `
     -Body '{"urls":["https://pubmed.ncbi.nlm.nih.gov/example1","https://pubmed.ncbi.nlm.nih.gov/example2"]}'

### ✅ 4. Resolver v0 (PubMed page → PDF/External)

#### ✅ 4.1. Input Validation & Normalization
- **Step:** Validate input URL.
- **Action:** Normalize to `https://pubmed.ncbi.nlm.nih.gov/{pmid}/`.

#### ✅ 4.2. HTML Fetching
- **Component:** `PubmedHtmlFetcher`
  - Configurable timeouts, user agent, and retries.
  - Fetches the PubMed page and returns either HTML or a structured error.

#### ✅ 4.3. Resolution Orchestration
- **Component:** `PubmedResolverManager`
  - Orchestrates the parsing process:
    1. Try the PMC (PubMed Central) path.
    2. If unsuccessful, try external links.
    3. If all fail, return `None`.

---

#### ✅ 4.4. PMC Branch

- **a. PMCID Extraction**
  - **Component:** `PubmedPageParser`
    - Isolates the PMCID using DOM selectors or metadata.

- **b. PMC Article Fetching**
  - **Component:** `PmcArticleFetcher`
    - Builds the URL: `https://pmc.ncbi.nlm.nih.gov/articles/PMC{pmcid}/`
    - Downloads the article HTML.

- **c. PDF Extraction**
  - **Component:** `PmcPdfExtractor`
    - Locates the PDF anchor using a selector.
    - Normalizes relative URLs.
    - Returns: `{ source: "PMC", pdf_url, reason: None }`.

- **d. Error Tracking**
  - Track PMCID lookups and HTTP errors separately for improved error messages.

---

#### ✅ 4.5. External Branch

- **a. Full Text Link Extraction**
  - **Component:** `FullTextLinkExtractor`
    - Extracts candidates from the “Full text links” section (limit to first valid).

- **b. External Landing Fetching**
  - **Component:** `ExternalLandingFetcher`
    - Loads the landing page using the same fetcher (one extra hop max).

- **c. PDF Location**
  - **Component:** `ExternalPdfLocator`
    - Scans for:
      - Direct `.pdf` URLs
      - “Download PDF” anchors
      - `<meta http-equiv="refresh">` tags pointing to PDFs
    - If none found, returns: `{ source: "External", pdf_url: None, reason: "PDF link not discovered on landing page" }`.

---

#### ☐ 4.6. Error Handling & Observability

- Map fetch failures to reason enums/messages (e.g., timeout, 4xx, 5xx, parse errors).
- Log structured events: URL, stage, status.
- Expose a lightweight tracing ID for each operation.
- Include hooks for circuit breaker/backoff for future scaling.

---

#### ☐ 4.7. Testing & Harness

- Add fixtures for:
  - A known PMC article.
  - A known external article.
- Provide a CLI/test harness:
  - `python -m app.services.resolver <pubmed-url>` prints JSON result.
  - Use dependency injection to swap fetchers for tests.
- Write:
  - Unit tests for each component.
  - Integration tests for both happy and failure paths.

---

#### 4.8. Extension Points & Structure

- All classes accept interfaces (e.g., `HtmlFetcher`, `ArticleParser`) to allow future strategies (API-based retrieval, caching, etc.).
- Keep each class under 200 lines.
- Prefer separate modules under `app/services/resolver/` for each responsibility.

### 5. Progress + item statuses
- Track per-URL item state: `pending | resolved | failed`, with `pdf_url` and `reason`
- Aggregate counts (`pending`, `resolved`, `failed`) in job status response
- **Acceptance**: `GET /jobs/{id}` shows per-item status list and summary counts during processing
- **Milestone Test**: Submit mixed URLs (one resolving, one intentionally failing) and confirm polling response includes per-item objects with accurate states and reasons plus correct totals

### 6. CORS + integration contract
- Enable CORS for configured Next.js origin via settings
- Document JSON shapes for `POST /jobs` and `GET /jobs/{id}` in README
- **Acceptance**: Next.js frontend can POST a list of PubMed URLs and poll until job completion without code changes
- **Milestone Test**: From the Next.js dev app, trigger job creation and observe successful fetch requests without CORS errors and UI updates once polling completes

### 7. Tests + scripts
- Add targetted tests for resolver heuristics and job lifecycle
- Provide `make run`, `make test`, and example `curl` commands in README for manual verification
- **Done When**: Submitting PubMed URLs returns job statuses with discovered `pdf_url` values or clear failure reasons; system runs entirely in-memory without crashes and remains easy to swap to persistent infrastructure later
- **Milestone Test**: `make test` (or `pytest`) passes locally; README curl examples execute successfully end-to-end

