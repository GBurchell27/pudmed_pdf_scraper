from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from pydantic import BaseModel, Field, HttpUrl

if TYPE_CHECKING:  # pragma: no cover
    from app.repositories.jobs_repo import JobItemRecord, JobRecord


class StrEnum(str, Enum):
    def __str__(self) -> str:  # pragma: no cover - for logging/debug
        return str(self.value)


class JobState(StrEnum):
    queued = "queued"
    running = "running"
    done = "done"
    failed = "failed"


class JobItemStatus(StrEnum):
    pending = "pending"
    resolved = "resolved"
    failed = "failed"


class JobItem(BaseModel):
    url: HttpUrl
    status: JobItemStatus = JobItemStatus.pending
    pdf_url: HttpUrl | None = None
    reason: str | None = None


class JobStatus(BaseModel):
    id: str
    created_at: datetime
    state: JobState
    items: list[JobItem]


class JobCreate(BaseModel):
    urls: list[HttpUrl] = Field(..., min_length=1, description="PubMed URLs to resolve")


class JobCreated(BaseModel):
    id: str


def map_job_record(record: "JobRecord") -> JobStatus:
    return JobStatus(
        id=record.id,
        created_at=record.created_at,
        state=JobState(record.state),
        items=[_map_job_item(item) for item in record.items],
    )


def _map_job_item(item: "JobItemRecord") -> JobItem:
    return JobItem(
        url=item.url,
        status=JobItemStatus(item.status),
        pdf_url=item.pdf_url,
        reason=item.reason,
    )
