"""Common data structures used across resolver components.

`manager.py`, `pmc.py`, and `external.py` all pass around
`PdfResolutionResult` instances to report success/failure while remembering the
origin (PMC vs external).  Keeping the enum/dataclass here avoids circular
imports between manager and the branch modules.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Optional


class ResolutionSource(str, Enum):
    """Enumeration describing how a PDF URL was discovered."""

    pmc = "pmc"
    external = "external"
    none = "none"


@dataclass(slots=True)
class PdfResolutionResult:
    """Outcome of attempting to resolve a PubMed article to a PDF."""

    source: ResolutionSource
    pdf_url: Optional[str]
    reason: Optional[str] = None

    @classmethod
    def success(cls, source: ResolutionSource, pdf_url: str) -> "PdfResolutionResult":
        return cls(source=source, pdf_url=pdf_url, reason=None)

    @classmethod
    def failure(cls, reason: str) -> "PdfResolutionResult":
        return cls(source=ResolutionSource.none, pdf_url=None, reason=reason)

