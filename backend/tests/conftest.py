"""Configuración común de tests.

- Los tests de integración usan TEST_DATABASE_URL (base `organiviaje_test`), nunca la de desarrollo.
- Los tests marcados con `@pytest.mark.db` se saltean si esa base no está disponible.
"""

import os
from collections.abc import AsyncIterator

os.environ["APP_ENV"] = "test"
os.environ["DATABASE_URL"] = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql+asyncpg://organiviaje:organiviaje@localhost:5433/organiviaje_test",
)

import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text

from app.core.db import engine
from app.main import create_app


async def _db_available() -> bool:
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        return False
    return True


@pytest.fixture(scope="session")
async def db_available() -> AsyncIterator[bool]:
    available = await _db_available()
    yield available
    await engine.dispose()


@pytest.fixture(autouse=True)
def _skip_without_db(request: pytest.FixtureRequest) -> None:
    needs_db = request.node.get_closest_marker("db") is not None
    if needs_db and not request.getfixturevalue("db_available"):
        pytest.skip("PostgreSQL de test no disponible (docker compose up -d db)")


@pytest.fixture
def app() -> FastAPI:
    return create_app()


@pytest.fixture
async def client(app: FastAPI) -> AsyncIterator[AsyncClient]:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
