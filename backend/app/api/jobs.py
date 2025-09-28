from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status

from .schemas.jobs import JobCreate, JobCreated, JobItemStatus, JobState, JobStatus, map_job_record
from ..repositories.jobs_repo import InMemoryJobsRepository, JobItemRecord
from ..services.resolver import PdfResolver


router = APIRouter()


jobs_repo = InMemoryJobsRepository()
resolver = PdfResolver()


def get_jobs_repo() -> InMemoryJobsRepository:
    return jobs_repo


def get_resolver() -> PdfResolver:
    return resolver


def _resolve_job(job_id: str, repo: InMemoryJobsRepository, resolver: PdfResolver) -> None:
    repo.set_state(job_id, JobState.running.value)
    items = repo.list_items(job_id)
    for item in items:
        _process_item(job_id, item, repo, resolver)
    final_record = repo.get(job_id)
    if final_record is None:
        return
    final_state = (
        JobState.failed.value
        if any(item.status == JobItemStatus.failed.value for item in final_record.items)
        else JobState.done.value
    )
    repo.set_state(job_id, final_state)


def _process_item(
    job_id: str,
    item: JobItemRecord,
    repo: InMemoryJobsRepository,
    resolver: PdfResolver,
) -> None:
    try:
        result = resolver.resolve(item.url)
        pdf_url = result.get("pdf_url")
        status_value = (
            JobItemStatus.resolved.value if pdf_url else JobItemStatus.failed.value
        )
        repo.update_item(
            job_id,
            item.url,
            status=status_value,
            pdf_url=pdf_url,
            reason=result.get("reason"),
        )
    except Exception as exc:  # pragma: no cover - placeholder error handling
        repo.update_item(
            job_id,
            item.url,
            status=JobItemStatus.failed.value,
            reason=str(exc),
        )


@router.post("", response_model=JobCreated, status_code=status.HTTP_201_CREATED)
def create_job(
    job_request: JobCreate,
    background_tasks: BackgroundTasks,
    repo: InMemoryJobsRepository = Depends(get_jobs_repo),
    pdf_resolver: PdfResolver = Depends(get_resolver),
) -> JobCreated:
    record = repo.create([str(url) for url in job_request.urls])
    background_tasks.add_task(_resolve_job, record.id, repo, pdf_resolver)
    return JobCreated(id=record.id)


@router.get("/{job_id}", response_model=JobStatus)
def get_job(
    job_id: str,
    repo: InMemoryJobsRepository = Depends(get_jobs_repo),
) -> JobStatus:
    record = repo.get(job_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return map_job_record(record)
