# PubMed PDF Scraper Backend

Minimal FastAPI backend scaffold for the PubMed PDF Scraper project. This service stays in-memory until later milestones introduce persistence.

## Quickstart

```bash
make install
make dev
# open http://localhost:8000/healthz
```

## Milestone Checks

1. **Health endpoint**
   ```bash
   curl http://localhost:8000/healthz
   ```
2. **(Next milestone)** Create job and poll status once endpoints exist (see `.Docs/implementation/2fast-api-implementation.md`).

## Project Layout

```
backend/
├── app/
│   ├── api/
│   │   └── jobs.py
│   ├── core/
│   │   └── config.py
│   ├── services/
│   │   └── resolver.py
│   └── main.py
├── tests/
└── pyproject.toml / requirements.txt / Makefile / README.md
```

## Tooling

- `FastAPI` for HTTP API
- `Uvicorn` for ASGI server
- `httpx` + `beautifulsoup4` reserved for resolver implementation
- `pytest` for automated tests
