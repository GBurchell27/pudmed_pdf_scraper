"""Resolver-specific exception types coordinating cross-module error flow.

`manager.py` surfaces `ResolverError` variants produced by collaborators like
`fetcher.py` (network concerns) and `html_parser.py` (DOM parsing).  Importing
the shared base class keeps downstream consumers oblivious to the exact
implementation file that raised an error while still allowing targeted resets
or retries.
"""


class ResolverError(Exception):
    """Base exception for resolver related failures."""


class FetchError(ResolverError):
    """Raised when fetching HTML fails."""


class ParseError(ResolverError):
    """Raised when parsing HTML content fails."""

