from collections.abc import AsyncIterator

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.exc import OperationalError

from app.core.db import get_session


@pytest.mark.db
async def test_health_ok_con_base_disponible(client: AsyncClient) -> None:
    response = await client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "db": "ok"}


async def test_health_503_si_la_base_no_responde(app: FastAPI, client: AsyncClient) -> None:
    class _SesionRota:
        async def execute(self, *_: object) -> None:
            raise OperationalError("SELECT 1", {}, Exception("connection refused"))

    async def _sesion_rota() -> AsyncIterator[_SesionRota]:
        yield _SesionRota()

    app.dependency_overrides[get_session] = _sesion_rota

    response = await client.get("/health")

    assert response.status_code == 503
    assert response.json()["error"]["code"] == "db_no_disponible"


async def test_openapi_documenta_el_error_unificado(client: AsyncClient) -> None:
    response = await client.get("/openapi.json")

    assert response.status_code == 200
    assert "ErrorResponse" in response.json()["components"]["schemas"]
