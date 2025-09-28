from fastapi import FastAPI

from .api import jobs
from .core.config import get_settings


settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0")

app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])


@app.get("/healthz")
def healthcheck() -> dict[str, bool]:
    return {"ok": True}
