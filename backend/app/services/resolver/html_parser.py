"""Parse PubMed HTML into metadata consumed by the resolver manager.

`manager.py` calls into this module after fetching article HTML via
`fetcher.py`.  The resulting `PubmedArticleMetadata` (defined in
`app.models.models`) feeds into the PMC (`pmc.py`) and external (`external.py`)
pipelines to determine follow-up fetches.  Keeping DOM selectors here keeps the
extractor modules clean and single-purpose.
"""

from __future__ import annotations

import re
from typing import Protocol
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from ...models.models import PubmedArticleMetadata


class PubmedParser(Protocol):
    def parse(self, html: str, *, pmid: str) -> PubmedArticleMetadata:
        ...


class PubmedPageParser(PubmedParser):
    """Extracts PMCID and external links from PubMed HTML."""

    def parse(self, html: str, *, pmid: str) -> PubmedArticleMetadata:
        soup = BeautifulSoup(html, "html.parser")
        base_url = f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
        pmc_id = _extract_pmc_id(soup)
        external_link = _extract_external_link(soup, base_url=base_url)
        return PubmedArticleMetadata(
            pmid=pmid,
            pmc_id=pmc_id,
            external_fulltext_url=external_link,
        )


def _extract_pmc_id(soup: BeautifulSoup) -> str | None:
    meta_candidates = [
        soup.find("meta", attrs={"name": "citation_pmcid"}),
        soup.find("meta", attrs={"name": "pmcid"}),
    ]
    for meta in meta_candidates:
        if not meta:
            continue
        content = (meta.get("content") or "").strip()
        match = re.search(r"PMC(\d+)", content, re.IGNORECASE)
        if match:
            return match.group(1)

    anchor_selectors = [
        "span.identifier.pmcid a",
        'a[data-ga-action="pmc_article"]',
        'a[href*="ncbi.nlm.nih.gov/pmc/articles/"]',
        'a[href*="/pmc/articles/"]',
    ]
    for selector in anchor_selectors:
        for anchor in soup.select(selector):
            text = (anchor.get_text() or "").strip()
            match = re.search(r"PMC(\d+)", text, re.IGNORECASE)
            if match:
                return match.group(1)
            href = anchor.get("href") or ""
            match = re.search(r"PMC(\d+)", href, re.IGNORECASE)
            if match:
                return match.group(1)
    return None


def _extract_external_link(soup: BeautifulSoup, *, base_url: str) -> str | None:
    selectors = {
        "div.full-text-links a",
        "div.full-text-links-list a",
        "section#full-text-links a",
        "ul.full-text-links-list a",
        "a.link-item",
        "a.external-link",
        'a[data-ga-category="full_text"]',
        'a[data-ga-action="fulltext"]',
        'a[data-ga-action="journal_link"]',
        'a[data-ga-action="journal_link_click"]',
    }
    seen: set[str] = set()
    for selector in selectors:
        anchors = soup.select(selector)
        if not anchors:
            continue
        for anchor in anchors:
            href = (anchor.get("href") or "").strip()
            if not href or href.lower().startswith("javascript:"):
                continue
            absolute = urljoin(base_url, href)
            if absolute in seen:
                continue
            seen.add(absolute)
            if any(block in absolute for block in [
                "ncbi.nlm.nih.gov/pmc/articles",
                "pubmed.ncbi.nlm.nih.gov/",
            ]):
                continue
            return absolute
    return None

