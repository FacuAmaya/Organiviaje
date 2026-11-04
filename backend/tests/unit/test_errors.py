"""El formato de error es un contrato con el frontend.

Siempre: {"error": {"code", "message", "details"}}.
"""

from fastapi import FastAPI, HTTPException
from httpx import ASGITransport, AsyncClient
from pydantic import BaseModel

from app.core.errors import ConflictError, NotFoundError, register_error_handlers


class _Entrada(BaseModel):
    nombre: str
    personas: int


def _app_de_prueba() -> FastAPI:
    app = FastAPI()
    register_error_handlers(app)

    @app.get("/no-existe")
    async def no_existe() -> None:
        raise NotFoundError("El viaje no existe", details={"viaje_id": "abc"})

    @app.get("/conflicto")
    async def conflicto() -> None:
        raise ConflictError(code="invitacion_vencida")

    @app.post("/validar")
    async def validar(entrada: _Entrada) -> _Entrada:
        return entrada

    @app.get("/http")
    async def http() -> None:
        raise HTTPException(status_code=418, detail="Soy una tetera")

    @app.get("/explota")
    async def explota() -> None:
        raise RuntimeError("bug")

    return app


async def _client() -> AsyncClient:
    transport = ASGITransport(app=_app_de_prueba(), raise_app_exceptions=False)
    return AsyncClient(transport=transport, base_url="http://test")


async def test_app_error_usa_codigo_mensaje_y_detalles() -> None:
    async with await _client() as client:
        response = await client.get("/no-existe")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "no_encontrado",
            "message": "El viaje no existe",
            "details": {"viaje_id": "abc"},
        }
    }


async def test_app_error_permite_codigo_propio_y_mensaje_por_defecto() -> None:
    async with await _client() as client:
        response = await client.get("/conflicto")

    assert response.status_code == 409
    body = response.json()["error"]
    assert body["code"] == "invitacion_vencida"
    assert body["message"] == ConflictError.message


async def test_error_de_validacion_lista_los_campos() -> None:
    async with await _client() as client:
        response = await client.post("/validar", json={"personas": "muchas"})

    assert response.status_code == 422
    error = response.json()["error"]
    assert error["code"] == "validacion"
    campos = {c["campo"] for c in error["details"]["campos"]}
    assert campos == {"nombre", "personas"}


async def test_http_exception_se_normaliza() -> None:
    async with await _client() as client:
        response = await client.get("/http")

    assert response.status_code == 418
    assert response.json()["error"]["message"] == "Soy una tetera"


async def test_ruta_inexistente_usa_el_formato_unificado() -> None:
    async with await _client() as client:
        response = await client.get("/ruta-que-no-existe")

    assert response.status_code == 404
    assert response.json()["error"] == {
        "code": "ruta_no_encontrada",
        "message": "La ruta solicitada no existe",
        "details": {},
    }


async def test_error_inesperado_no_filtra_detalles_internos() -> None:
    async with await _client() as client:
        response = await client.get("/explota")

    assert response.status_code == 500
    assert response.json() == {
        "error": {"code": "error_interno", "message": "Ocurrió un error inesperado", "details": {}}
    }
