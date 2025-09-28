from __future__ import annotations

from pathlib import Path

import pytest


FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture
def pubmed_pmc_html() -> str:
    return (FIXTURES / "pubmed_pmc_article.html").read_text(encoding="utf-8")


@pytest.fixture
def pmc_pdf_html() -> str:
    return (FIXTURES / "pmc_pdf_article.html").read_text(encoding="utf-8")


@pytest.fixture
def pubmed_external_html() -> str:
    return (FIXTURES / "pubmed_external_article.html").read_text(encoding="utf-8")


@pytest.fixture
def external_pdf_html() -> str:
    return (FIXTURES / "external_pdf_article.html").read_text(encoding="utf-8")

