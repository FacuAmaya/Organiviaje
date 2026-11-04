"""Registro central de modelos para Alembic.

Cada feature que agrega tablas importa acá sus modelos, por ejemplo:

    from app.modules.nucleo.models import Usuario, Viaje  # noqa: F401
"""

from app.core.db import Base

__all__ = ["Base"]
