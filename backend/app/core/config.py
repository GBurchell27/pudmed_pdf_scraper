from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    app_name: str = "PubMed PDF Scraper API"
    cors_origins: list[str] = ["http://localhost:3000"]
    resolver_timeout_seconds: float = 10.0
    resolver_retries: int = 1
    resolver_user_agent: str = "pubmed-pdf-scraper/0.1"
    resolver_mock_mode: bool = False

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


@lru_cache()
def get_settings() -> AppSettings:
    return AppSettings()
