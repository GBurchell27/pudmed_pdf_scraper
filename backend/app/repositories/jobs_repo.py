from __future__ import annotations

from dataclasses import dataclass, field, replace
from datetime import datetime, timezone
from threading import Lock
from typing import Dict, Iterable, List
from uuid import uuid4


@dataclass(slots=True)
class JobItemRecord:
    url: str
    status: str = "pending"
    pdf_url: str | None = None
    reason: str | None = None


@dataclass(slots=True)
class JobRecord:
    id: str
    created_at: datetime
    state: str
    items: list[JobItemRecord] = field(default_factory=list)


class InMemoryJobsRepository:
    def __init__(self) -> None:
        self._jobs: Dict[str, JobRecord] = {}
        self._lock = Lock()

    def create(self, urls: list[str]) -> JobRecord:
        with self._lock:
            job_id = uuid4().hex
            job = JobRecord(
                id=job_id,
                created_at=datetime.now(timezone.utc),
                state="queued",
                items=[JobItemRecord(url=url) for url in urls],
            )
            self._jobs[job_id] = job
            return job

    def get(self, job_id: str) -> JobRecord | None:
        with self._lock:
            job = self._jobs.get(job_id)
            if job is None:
                return None
            return replace(job, items=[replace(item) for item in job.items])

    def list_items(self, job_id: str) -> List[JobItemRecord]:
        with self._lock:
            job = self._jobs.get(job_id)
            if job is None:
                return []
            return [replace(item) for item in job.items]

    def set_state(self, job_id: str, state: str) -> None:
        with self._lock:
            job = self._jobs.get(job_id)
            if job is None:
                return
            job.state = state

    def update_item(
        self,
        job_id: str,
        url: str,
        *,
        status: str,
        pdf_url: str | None = None,
        reason: str | None = None,
    ) -> None:
        with self._lock:
            job = self._jobs.get(job_id)
            if job is None:
                return
            for item in job.items:
                if item.url == url:
                    item.status = status
                    item.pdf_url = pdf_url
                    item.reason = reason
                    break
