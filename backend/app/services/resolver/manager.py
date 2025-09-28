"""Central orchestrator combining resolver sub-components.

Routes the high-level `resolve` call from `app.api.jobs` into the lower-level
building blocks:
- normalises PubMed URLs (`url_utils.py`)
- fetches HTML via injected fetcher (`fetcher.py`)
- extracts metadata (`html_parser.py` → `PubmedArticleMetadata`)
- attempts PMC resolution (`pmc.py`)
- falls back to external crawling (`external.py`)
The module exposes factory helpers so the API layer can configure fetch timeouts
and mock responses without importing the lower-level modules directly.
"""

from __future__ import annotations

from typing import Callable, Protocol, NamedTuple

from .exceptions import ResolverError
from .fetcher import HtmlFetcher, HttpxHtmlFetcher
from .html_parser import PubmedParser, PubmedPageParser
from .pmc import PmcPdfExtractor
from .external import ExternalPdfLocator
from .results import PdfResolutionResult
from .url_utils import normalize_pubmed_url
from .prebaked_responses import MOCK_RESPONSES
from .fetcher import MockHtmlFetcher


class PdfResolver(Protocol):
    def resolve(self, url: str) -> PdfResolutionResult:
        ...


class ResolverConfig(NamedTuple):
    timeout: float
    retries: int
    user_agent: str
    mock_mode: bool = False


class PubmedResolverManager:
    """Coordinates the steps required to resolve PubMed article PDFs."""

    def __init__(
        self,
        *,
        html_fetcher: HtmlFetcher,
        pubmed_parser: PubmedParser | None = None,
        pmc_extractor_factory: Callable[[], PmcPdfExtractor] | None = None,
        external_locator_factory: Callable[[], ExternalPdfLocator] | None = None,
    ) -> None:
        self._fetcher = html_fetcher
        self._parser = pubmed_parser or PubmedPageParser()
        self._pmc_extractor_factory = pmc_extractor_factory
        self._external_locator_factory = external_locator_factory

    def resolve(self, raw_url: str) -> PdfResolutionResult:
        try:
            normalized_url, pmid = normalize_pubmed_url(raw_url)
        except ResolverError as exc:
            return PdfResolutionResult.failure(str(exc))

        try:
            article_html = self._fetcher.fetch(normalized_url)
        except Exception as exc:  # pragma: no cover - network failure path
            return PdfResolutionResult.failure(str(exc))

        metadata = self._parser.parse(article_html, pmid=pmid)

        if metadata.pmc_id:
            pmc_result = self._resolve_pmc(metadata.pmc_id)
            if pmc_result.pdf_url:
                return pmc_result

        if metadata.external_fulltext_url:
            external_result = self._resolve_external(metadata.external_fulltext_url)
            if external_result.pdf_url:
                return external_result

        return PdfResolutionResult.failure("No PDF source discovered")

    def _resolve_pmc(self, pmc_id: str) -> PdfResolutionResult:
        extractor = (
            self._pmc_extractor_factory()
            if self._pmc_extractor_factory
            else PmcPdfExtractor(self._fetcher)
        )
        return extractor.resolve(pmc_id)

    def _resolve_external(self, url: str) -> PdfResolutionResult:
        locator = (
            self._external_locator_factory()
            if self._external_locator_factory
            else ExternalPdfLocator(self._fetcher)
        )
        return locator.resolve(url)

    def close(self) -> None:
        close_method = getattr(self._fetcher, "close", None)
        if callable(close_method):
            close_method()


def build_default_resolver(*, config: ResolverConfig) -> PubmedResolverManager:
    fetcher: HtmlFetcher
    if config.mock_mode:
        fetcher = MockHtmlFetcher(MOCK_RESPONSES)
    else:
        fetcher = HttpxHtmlFetcher(
            timeout=config.timeout,
            retries=config.retries,
            user_agent=config.user_agent,
        )
    return PubmedResolverManager(html_fetcher=fetcher)

