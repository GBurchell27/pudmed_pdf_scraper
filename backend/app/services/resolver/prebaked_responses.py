"""Canned HTML responses for mock resolver mode.

This supports dependency injection scenarios where the `manager` is constructed
with a `MockHtmlFetcher` from `fetcher.py`.  Keeping fixtures here prevents
tests or local demos from having to open external network connections.
"""

from __future__ import annotations

MOCK_RESPONSES: dict[str, str] = {
    "https://pubmed.ncbi.nlm.nih.gov/38702718/": (
        "<html><body><div class='full-text-links'>"
        "<a href='https://pmc.ncbi.nlm.nih.gov/articles/PMC10730138/'>Free PMC article</a>"
        "</div></body></html>"
    ),
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC10730138/": (
        "<html><body><a href='/articles/PMC10730138/pdf/main.pdf'>Download PDF</a></body></html>"
    ),
    "https://pubmed.ncbi.nlm.nih.gov/21458665/": (
        "<html><body><div class='full-text-links'>"
        "<a href='https://www.sciencedirect.com/science/article/pii/S1090385511000293'>Journal</a>"
        "</div></body></html>"
    ),
    "https://www.sciencedirect.com/science/article/pii/S1090385511000293": (
        "<html><body><a href='https://www.sciencedirect.com/science/article/pii/S1090385511000293/pdfft?md5=abc123&pid=1-s2.0-S1090385511000293-main.pdf'>Download PDF</a></body></html>"
    ),
}

