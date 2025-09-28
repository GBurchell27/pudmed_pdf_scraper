"""Orchestrator export for the resolver package.

This module ties together the neighbouring resolver components.  It exposes the
`PubmedResolverManager` assembled in `manager.py`, while re-exporting the
canonical result and exception types defined in `results.py` and
`exceptions.py`.  Higher layers (e.g. `app.api.jobs`) import from this module
so they stay agnostic of lower-level details implemented across
`fetcher.py`, `html_parser.py`, `pmc.py`, and `external.py`.
"""

from .manager import PubmedResolverManager, ResolverConfig, build_default_resolver
from .results import PdfResolutionResult, ResolutionSource
from .exceptions import ResolverError

__all__ = [
    "PubmedResolverManager",
    "PdfResolutionResult",
    "ResolutionSource",
    "ResolverError",
    "ResolverConfig",
    "build_default_resolver",
]

