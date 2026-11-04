"""Configuración de la aplicación leída desde variables de entorno (y `.env` en desarrollo)."""

from functools import lru_cache
from typing import Annotated, Literal

from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Organiviaje API"
    app_env: Literal["development", "test", "production"] = "development"
    debug: bool = False

    database_url: PostgresDsn = PostgresDsn(
        "postgresql+asyncpg://organiviaje:organiviaje@localhost:5433/organiviaje"
    )
    database_echo: bool = False

    # Lista separada por comas en el .env: CORS_ORIGINS=http://localhost:3000,https://app.ejemplo.com
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:3000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("database_url", mode="after")
    @classmethod
    def _require_asyncpg(cls, value: PostgresDsn) -> PostgresDsn:
        if value.scheme != "postgresql+asyncpg":
            raise ValueError("DATABASE_URL debe usar el driver async: postgresql+asyncpg://")
        return value

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    """Settings cacheados: se leen una sola vez por proceso."""
    return Settings()
