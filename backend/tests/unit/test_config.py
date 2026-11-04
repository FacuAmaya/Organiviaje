import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_cors_origins_se_separan_por_coma(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("CORS_ORIGINS", "http://localhost:3000, https://organiviaje.app ,")

    settings = Settings()

    assert settings.cors_origins == ["http://localhost:3000", "https://organiviaje.app"]


def test_database_url_exige_driver_async(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DATABASE_URL", "postgresql://u:p@localhost:5432/db")

    with pytest.raises(ValidationError, match="postgresql\\+asyncpg"):
        Settings()


def test_is_production(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("APP_ENV", "production")

    assert Settings().is_production is True
