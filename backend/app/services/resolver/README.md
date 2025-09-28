# Resolver Module Overview

This package turns a PubMed article URL into the best available PDF source.
It is split into focused modules that coordinate via dependency injection.

- `__init__.py`
  Re-exports the public API (`PubmedResolverManager`, result/exception types)
  so callers never import submodules directly.

- `manager.py`
  Orchestrates the resolution pipeline: URL normalisation (`url_utils.py`),
  HTML fetch (`fetcher.py`), metadata parsing (`html_parser.py`), PMC branch
  (`pmc.py`), and external fallback (`external.py`).

- `fetcher.py`
  Provides the `HtmlFetcher` protocol plus implementations for real HTTPX
  clients and mock responses. Injected everywhere HTML is needed.

- `html_parser.py`
  Extracts `PubmedArticleMetadata` (see `app/models/models.py`) from raw
  PubMed HTML. Supplies PMC IDs and external links to the manager.

- `pmc.py`
  Uses the injected fetcher to download PMC article pages and locate PDF links.

- `external.py`
  Attempts to spot PDF URLs on third-party journal landing pages when PMC is
  unavailable.

- `url_utils.py`
  Validates and normalises PubMed URLs before any network call is made.

- `results.py`
  Shared enum/dataclass for reporting the outcome of PMC/external attempts.

- `exceptions.py`
  Error hierarchy surfaced by the pipeline so callers can render friendly
  messages or trigger retries.

- `prebaked_responses.py`
  Demonstration/mock HTML payloads for local development without network
  traffic.

