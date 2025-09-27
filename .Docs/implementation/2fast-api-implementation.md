## FastAPI Delivery Plan (Baby Steps)

**Goal**
- Ship a minimal, testable FastAPI backend and a proof-of-concept PDF resolver
- Deliver in small, verifiable steps; Next.js only calls HTTP endpoints

**Constraints**
- No persistent databases, queues, or auth yet
- Keep runtime state in memory with clear seams to swap in real infra later

### 1. Scaffold
- Create `backend/` with `app/main.py`, `app/api/jobs.py`, `app/core/config.py`, `app/services/resolver.py`, `tests/`
- Add `pyproject.toml` / `requirements.txt`, `README.md`, `Makefile` (or simple run commands)
- **Acceptance**: `uvicorn app.main:app --reload` exposes `GET /healthz → {"ok": true}`

### 2. Job model + polling endpoints
- Pydantic models: `JobCreate { urls: list[str] }`, `JobStatus { id, created_at, state, items }`
- Endpoints: `POST /jobs` (returns generated `id`), `GET /jobs/{id}` (returns status payload)
- In-memory repository tracks jobs and associated items
- **Acceptance**: Create job → receive `id` → poll status → returns `queued`

### 3. Background processing (simple)
- Use FastAPI `BackgroundTasks` to iterate submitted URLs and invoke resolver
- Update in-memory state to reflect transitions and item outcomes
- **Acceptance**: Job state flows `queued → running → done/failed` deterministically

### 4. Resolver v0 (PubMed page → PDF/External)
- Input: PubMed article URL
- Fetch HTML with configured timeouts, custom User-Agent
- Detect PMC PDF first; otherwise extract "Full text" external link
- If external, fetch landing page (max 1 extra hop) and search for `.pdf` link or "Download PDF" anchor
- Return structure: `{ source: "PMC" | "External" | "None", pdf_url: str | None, reason: str | None }`
- Map errors (timeout, HTTP errors, parse failures) to human-readable `reason`
- **Acceptance**: Known PMC article resolves to PDF; known external resolves to external PDF or reason when not found

### 5. Progress + item statuses
- Track per-URL item state: `pending | resolved | failed`, with `pdf_url` and `reason`
- Aggregate counts (`pending`, `resolved`, `failed`) in job status response
- **Acceptance**: `GET /jobs/{id}` shows per-item status list and summary counts during processing

### 6. CORS + integration contract
- Enable CORS for configured Next.js origin via settings
- Document JSON shapes for `POST /jobs` and `GET /jobs/{id}` in README
- **Acceptance**: Next.js frontend can POST a list of PubMed URLs and poll until job completion without code changes

### 7. Tests + scripts
- Add targetted tests for resolver heuristics and job lifecycle
- Provide `make run`, `make test`, and example `curl` commands in README for manual verification
- **Done When**: Submitting PubMed URLs returns job statuses with discovered `pdf_url` values or clear failure reasons; system runs entirely in-memory without crashes and remains easy to swap to persistent infrastructure later

