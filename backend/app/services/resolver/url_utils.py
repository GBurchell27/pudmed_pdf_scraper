"""URL validation helpers for the resolver pipeline.

Both `manager.py` and potential future utilities rely on these helpers to keep
PubMed URL handling consistent before any network traffic is issued.  By
isolating the rules here we avoid duplicating regex logic across fetcher/parser
modules.
"""

from __future__ import annotations

import re
from urllib.parse import urlparse

from .exceptions import ResolverError


PUBMED_HOST = "pubmed.ncbi.nlm.nih.gov"


_PMID_PATTERN = re.compile(r"^/([0-9]+)/?$")


def normalize_pubmed_url(raw_url: str) -> tuple[str, str]:
    """Validate and normalize a PubMed article URL.

    Returns a tuple of `(normalized_url, pmid)`.
    """

    parsed = urlparse(raw_url)
    if parsed.netloc != PUBMED_HOST:
        raise ResolverError("URL is not a PubMed article")

    match = _PMID_PATTERN.match(parsed.path)
    if not match:
        raise ResolverError("Cannot extract PMID from URL")

    pmid = match.group(1)
    normalized = f"https://{PUBMED_HOST}/{pmid}/"
    return normalized, pmid

