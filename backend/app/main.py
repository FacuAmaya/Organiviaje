"""Punto de entrada de la API: `uv run uvicorn app.main:app --reload`."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health
from app.core.config import get_settings
from app.core.db import engine
from app.core.errors import ErrorResponse, register_error_handlers


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    yield
    await engine.dispose()


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        debug=settings.debug,
        lifespan=lifespan,
        # En producción no se expone la documentación interactiva.
        docs_url=None if settings.is_production else "/docs",
        redoc_url=None,
        responses={
            422: {"model": ErrorResponse, "description": "Datos inválidos"},
            500: {"model": ErrorResponse, "description": "Error inesperado"},
        },
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,  # necesario para las cookies de sesión (ADR 0003)
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_error_handlers(app)
    app.include_router(health.router)
    return app


app = create_app()
