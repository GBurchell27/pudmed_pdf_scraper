class PdfResolver:
    """Simplified resolver for MVP background processing.

    This implementation does not perform network calls yet; it returns a
    deterministic fake PDF URL for demonstration purposes.
    """

    def resolve(self, url: str) -> dict[str, str | None]:
        # Placeholder: mark every URL as resolved with a fake PDF link
        return {
            "source": "mock",
            "pdf_url": f"{url}.pdf",
            "reason": None,
        }
