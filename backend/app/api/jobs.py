from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status

from .schemas.jobs import JobCreate, JobCreated, JobItemStatus, JobState, JobStatus, map_job_record
from ..core.config import get_settings
from ..repositories.jobs_repo import InMemoryJobsRepository, JobItemRecord
from ..services.resolver import PubmedResolverManager, build_default_resolver
from ..services.resolver.manager import ResolverConfig


router = APIRouter()


jobs_repo = InMemoryJobsRepository()


def _build_resolver() -> PubmedResolverManager:
    settings = get_settings()
    config = ResolverConfig(
        timeout=settings.resolver_timeout_seconds,
        retries=settings.resolver_retries,
        user_agent=settings.resolver_user_agent,
        mock_mode=settings.resolver_mock_mode,
    )
    return build_default_resolver(config=config)


resolver_manager = _build_resolver()


def get_jobs_repo() -> InMemoryJobsRepository:
    return jobs_repo


def get_resolver() -> PubmedResolverManager:
    return resolver_manager


def _resolve_job(job_id: str, repo: InMemoryJobsRepository, resolver: PubmedResolverManager) -> None:
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
    resolver: PubmedResolverManager,
) -> None:
    try:
        result = resolver.resolve(item.url)
        pdf_url = result.pdf_url
        status_value = (
            JobItemStatus.resolved.value if pdf_url else JobItemStatus.failed.value
        )
        repo.update_item(
            job_id,
            item.url,
            status=status_value,
            pdf_url=pdf_url,
            reason=result.reason,
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
    pdf_resolver: PubmedResolverManager = Depends(get_resolver),
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
