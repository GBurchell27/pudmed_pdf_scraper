"""External landing page branch for detecting PDF downloads.

When `html_parser.py` returns an external full-text link, `manager.py` invokes
this module.  It shares the same fetcher abstraction (`fetcher.py`) and emits
`PdfResolutionResult` instances (`results.py`), allowing the manager to compare
PMC vs external outcomes consistently.
"""

from __future__ import annotations

from urllib.parse import urljoin

from bs4 import BeautifulSoup

from .fetcher import HtmlFetcher
from .results import PdfResolutionResult, ResolutionSource


class ExternalPdfLocator:
    """Attempts to locate a PDF link on an external landing page."""

    def __init__(self, fetcher: HtmlFetcher) -> None:
        self._fetcher = fetcher

    def resolve(self, url: str) -> PdfResolutionResult:
        html = self._fetcher.fetch(url)
        pdf_url = self._find_pdf_link(html, base_url=url)
        if pdf_url:
            return PdfResolutionResult.success(ResolutionSource.external, pdf_url)
        return PdfResolutionResult.failure("PDF link not discovered on landing page")

    @staticmethod
    def _find_pdf_link(html: str, *, base_url: str) -> str | None:
        soup = BeautifulSoup(html, "html.parser")

        # Look for direct anchors ending with .pdf
        for anchor in soup.select('a[href$=".pdf"]'):
            href = anchor.get("href")
            if href:
                return urljoin(base_url, href)

        # Look for anchors mentioning PDF
        for anchor in soup.find_all("a"):
            text = (anchor.get_text() or "").strip().lower()
            if "pdf" in text:
                href = anchor.get("href")
                if href:
                    return urljoin(base_url, href)

        # Handle meta refresh
        meta_refresh = soup.find("meta", attrs={"http-equiv": "refresh"})
        if meta_refresh:
            content = meta_refresh.get("content")
            if content and "url=" in content.lower():
                _, _, target = content.partition("url=")
                return urljoin(base_url, target.strip())

        return None

