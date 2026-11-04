"""Chequeo de salud: lo usan Docker, el deploy y el monitoreo."""

from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.deps import SessionDep
from app.core.errors import ErrorResponse, ServiceUnavailableError

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: Literal["ok"]
    db: Literal["ok"]


@router.get(
    "/health",
    response_model=HealthResponse,
    responses={503: {"model": ErrorResponse, "description": "La base de datos no responde"}},
)
async def health(session: SessionDep) -> HealthResponse:
    try:
        await session.execute(text("SELECT 1"))
    except (SQLAlchemyError, OSError) as exc:
        raise ServiceUnavailableError(
            "La base de datos no responde", code="db_no_disponible"
        ) from exc
    return HealthResponse(status="ok", db="ok")
