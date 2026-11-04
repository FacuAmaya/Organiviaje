# syntax=docker/dockerfile:1
#
# Imagen del backend con 4 etapas (multi-stage). docker compose / CI eligen cuál con `target`:
#
#   base        Python + dependencias de la app (sin herramientas de desarrollo)
#   desarrollo  + pytest, ruff, mypy… y recarga automática      → docker compose up
#   test        corre lint + tipos + tests y termina             → docker build --target test
#   produccion  solo lo necesario, usuario sin privilegios       → deploy
#
# Las dependencias se instalan ANTES de copiar el código: si solo cambia el código,
# Docker reutiliza la capa de dependencias (cache) y el build tarda segundos.

ARG PYTHON_VERSION=3.13

# ───────────────────────────── base ─────────────────────────────
FROM python:${PYTHON_VERSION}-slim AS base
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    UV_PROJECT_ENVIRONMENT=/opt/venv \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app
COPY pyproject.toml uv.lock .python-version ./
RUN --mount=type=cache,target=/root/.cache/uv uv sync --frozen --no-dev

# ───────────────────────────── desarrollo ─────────────────────────────
FROM base AS desarrollo
RUN --mount=type=cache,target=/root/.cache/uv uv sync --frozen
# En desarrollo el código se monta como volumen (ver docker-compose.yml); esta copia
# sirve para usar la imagen sola o en CI.
COPY . .
EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]

# ───────────────────────────── test ─────────────────────────────
FROM desarrollo AS test
CMD ["sh", "-c", "ruff check . && ruff format --check . && mypy app tests && pytest --cov=app"]

# ───────────────────────────── produccion ─────────────────────────────
FROM python:${PYTHON_VERSION}-slim AS produccion
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    APP_ENV=production

RUN groupadd --system app && useradd --system --gid app --home /app app
WORKDIR /app
COPY --from=base /opt/venv /opt/venv
COPY --chown=app:app app ./app
COPY --chown=app:app alembic ./alembic
COPY --chown=app:app alembic.ini ./

USER app
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" || exit 1
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers --forwarded-allow-ips='*'"]
