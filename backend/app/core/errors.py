"""Errores de la aplicación y su traducción a un formato HTTP único.

Toda respuesta de error tiene la forma:

    {"error": {"code": "no_encontrado", "message": "…", "details": {…}}}

El dominio lanza subclases de `AppError`; nunca `HTTPException` fuera de los routers.
"""

import logging
from http import HTTPStatus
from typing import Any, cast

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


class ErrorBody(BaseModel):
    code: str
    message: str
    details: dict[str, Any] = {}


class ErrorResponse(BaseModel):
    """Esquema documentado en OpenAPI para todas las respuestas de error."""

    error: ErrorBody


class AppError(Exception):
    status_code: int = status.HTTP_400_BAD_REQUEST
    code: str = "error"
    message: str = "Ocurrió un error"

    def __init__(
        self,
        message: str | None = None,
        *,
        code: str | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message or self.message
        self.code = code or self.code
        self.details = details or {}
        super().__init__(self.message)


class NotFoundError(AppError):
    status_code = status.HTTP_404_NOT_FOUND
    code = "no_encontrado"
    message = "El recurso no existe"


class ConflictError(AppError):
    status_code = status.HTTP_409_CONFLICT
    code = "conflicto"
    message = "La operación entra en conflicto con el estado actual"


class UnauthorizedError(AppError):
    status_code = status.HTTP_401_UNAUTHORIZED
    code = "no_autenticado"
    message = "Necesitás iniciar sesión"


class ForbiddenError(AppError):
    status_code = status.HTTP_403_FORBIDDEN
    code = "sin_permiso"
    message = "No tenés permiso para realizar esta acción"


class ServiceUnavailableError(AppError):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    code = "servicio_no_disponible"
    message = "El servicio no está disponible"


def error_response(
    status_code: int, code: str, message: str, details: dict[str, Any] | None = None
) -> JSONResponse:
    body = ErrorResponse(error=ErrorBody(code=code, message=message, details=details or {}))
    return JSONResponse(status_code=status_code, content=body.model_dump(mode="json"))


# Starlette tipa los handlers con `Exception`; cada uno se registra solo para su tipo concreto.
async def _app_error_handler(_: Request, exc: Exception) -> JSONResponse:
    exc = cast(AppError, exc)
    return error_response(exc.status_code, exc.code, exc.message, exc.details)


async def _validation_error_handler(_: Request, exc: Exception) -> JSONResponse:
    exc = cast(RequestValidationError, exc)
    campos = [
        {
            "campo": ".".join(str(part) for part in err["loc"] if part != "body"),
            "mensaje": err["msg"],
            "tipo": err["type"],
        }
        for err in exc.errors()
    ]
    return error_response(
        status.HTTP_422_UNPROCESSABLE_CONTENT,
        "validacion",
        "Los datos enviados no son válidos",
        {"campos": campos},
    )


# Errores que genera el propio framework (ruta inexistente, método incorrecto…).
_HTTP_ERRORS_ES: dict[int, tuple[str, str]] = {
    404: ("ruta_no_encontrada", "La ruta solicitada no existe"),
    405: ("metodo_no_permitido", "Método HTTP no permitido para esta ruta"),
}


async def _http_error_handler(_: Request, exc: Exception) -> JSONResponse:
    exc = cast(StarletteHTTPException, exc)
    phrase = HTTPStatus(exc.status_code).phrase
    code, message = _HTTP_ERRORS_ES.get(exc.status_code, (phrase.lower().replace(" ", "_"), phrase))
    if isinstance(exc.detail, str) and exc.detail != phrase:
        message = exc.detail
    return error_response(exc.status_code, code, message)


async def _unhandled_error_handler(_: Request, exc: Exception) -> JSONResponse:
    logger.exception("Error no manejado", exc_info=exc)
    return error_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR, "error_interno", "Ocurrió un error inesperado"
    )


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppError, _app_error_handler)
    app.add_exception_handler(RequestValidationError, _validation_error_handler)
    app.add_exception_handler(StarletteHTTPException, _http_error_handler)
    app.add_exception_handler(Exception, _unhandled_error_handler)
