"""Network fetch helpers shared by resolver components.

The resolver manager (`manager.py`) injects the `HtmlFetcher` protocol into the
HTML parser (`html_parser.py`) and the PMC/external extractors (`pmc.py`,
`external.py`).  This module centralises HTTPX configuration for production
requests (`HttpxHtmlFetcher`) and provides the deterministic `MockHtmlFetcher`
used by unit tests and mock-mode wiring.
"""

from __future__ import annotations

import time
from typing import Protocol

import httpx

from .exceptions import FetchError


class HtmlFetcher(Protocol):
    def fetch(self, url: str) -> str:
        ...


class HttpxHtmlFetcher(HtmlFetcher):
    """Fetches HTML content using httpx with retry support."""

    def __init__(
        self,
        *,
        timeout: float,
        retries: int,
        user_agent: str,
    ) -> None:
        self._retries = max(0, retries)
        self._client = httpx.Client(
            timeout=timeout,
            headers={"User-Agent": user_agent},
            follow_redirects=True,
        )

    def fetch(self, url: str) -> str:
        last_error: Exception | None = None
        for attempt in range(self._retries + 1):
            try:
                response = self._client.get(url)
                response.raise_for_status()
                return response.text
            except httpx.HTTPError as exc:
                last_error = exc
                if attempt < self._retries:
                    time.sleep(0.5 * (attempt + 1))
        raise FetchError(str(last_error))

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> "HttpxHtmlFetcher":  # pragma: no cover - context sugar
        return self

    def __exit__(self, *_) -> None:  # pragma: no cover - context sugar
        self.close()


class MockHtmlFetcher(HtmlFetcher):
    """Returns canned responses for deterministic resolver testing."""

    def __init__(self, responses: dict[str, str]) -> None:
        self._responses = responses

    def fetch(self, url: str) -> str:
        if url not in self._responses:
            raise FetchError(f"No mock response configured for {url}")
        return self._responses[url]

