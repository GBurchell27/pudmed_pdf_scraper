from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass(slots=True)
class PubmedArticleMetadata:
    """Minimal metadata extracted from a PubMed article page."""

    pmid: str
    pmc_id: Optional[str] = None
    external_fulltext_url: Optional[str] = None


@dataclass(slots=True)
class PdfCandidate:
    """Represents a potential PDF target for an article."""

    url: str
    source: str

