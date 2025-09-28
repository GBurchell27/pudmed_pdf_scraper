from __future__ import annotations

from app.services.resolver.fetcher import HtmlFetcher
from app.services.resolver.manager import PubmedResolverManager
from app.services.resolver.results import ResolutionSource


class StubFetcher(HtmlFetcher):
    def __init__(self, responses: dict[str, str]) -> None:
        self._responses = responses

    def fetch(self, url: str) -> str:
        return self._responses[url]


def test_resolver_prefers_pmc(pubmed_pmc_html: str, pmc_pdf_html: str) -> None:
    fetcher = StubFetcher(
        {
            "https://pubmed.ncbi.nlm.nih.gov/12345678/": pubmed_pmc_html,
            "https://pmc.ncbi.nlm.nih.gov/articles/PMC7654321/": pmc_pdf_html,
        }
    )
    resolver = PubmedResolverManager(html_fetcher=fetcher)

    result = resolver.resolve("https://pubmed.ncbi.nlm.nih.gov/12345678/")

    assert result.pdf_url == "https://pmc.ncbi.nlm.nih.gov/articles/PMC7654321/pdf/sample.pdf"
    assert result.source == ResolutionSource.pmc


def test_resolver_falls_back_to_external(pubmed_external_html: str, external_pdf_html: str) -> None:
    fetcher = StubFetcher(
        {
            "https://pubmed.ncbi.nlm.nih.gov/22223333/": pubmed_external_html,
            "https://journals.example.com/article": external_pdf_html,
        }
    )
    resolver = PubmedResolverManager(html_fetcher=fetcher)

    result = resolver.resolve("https://pubmed.ncbi.nlm.nih.gov/22223333/")

    assert result.pdf_url == "https://journals.example.com/pdfs/download.pdf"
    assert result.source == ResolutionSource.external


def test_resolver_reports_failure_when_no_sources() -> None:
    fetcher = StubFetcher(
        {"https://pubmed.ncbi.nlm.nih.gov/99999999/": "<html><body>No links</body></html>"}
    )
    resolver = PubmedResolverManager(html_fetcher=fetcher)

    result = resolver.resolve("https://pubmed.ncbi.nlm.nih.gov/99999999/")

    assert result.pdf_url is None
    assert result.reason == "No PDF source discovered"

