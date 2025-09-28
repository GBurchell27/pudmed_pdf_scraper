"""PMC-specific branch for locating PDF URLs.

Invoked exclusively by `manager.py` once `html_parser.py` identifies a PMC ID.
This module reuses the generic `HtmlFetcher` abstraction (`fetcher.py`) so tests
can inject canned responses.  On success, it returns a `PdfResolutionResult`
(`results.py`) which the manager bubbles up.
"""

from __future__ import annotations

from bs4 import BeautifulSoup

from .exceptions import ParseError
from .fetcher import HtmlFetcher
from .results import PdfResolutionResult, ResolutionSource


class PmcPdfExtractor:
    """Handles resolving PMC articles to their PDF URL."""

    def __init__(self, fetcher: HtmlFetcher) -> None:
        self._fetcher = fetcher

    def resolve(self, pmc_id: str) -> PdfResolutionResult:
        article_url = f"https://pmc.ncbi.nlm.nih.gov/articles/PMC{pmc_id}/"
        html = self._fetcher.fetch(article_url)
        pdf_url = self._extract_pdf_url(html, base_url=article_url)
        if pdf_url:
            return PdfResolutionResult.success(ResolutionSource.pmc, pdf_url)
        return PdfResolutionResult.failure("PMC PDF link not found")

    @staticmethod
    def _extract_pdf_url(html: str, *, base_url: str) -> str | None:
        soup = BeautifulSoup(html, "html.parser")
        pdf_link = soup.select_one('a[href$="pdf"]')
        if pdf_link and pdf_link.get("href"):
            href = pdf_link["href"]
            if href.startswith("http"):
                return href
            if href.startswith("//"):
                return f"https:{href}"
            if href.startswith("/"):
                return base_url.rstrip("/") + href
            return base_url + href
        return None

