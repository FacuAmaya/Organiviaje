# 01 · Esqueleto del backend

| Rama | Estado | Responsable(s) | Inicio | Cierre | PR |
|---|---|---|---|---|---|
| `chore/01-backend-skeleton` | 🚧 en curso | @FacuAmaya | 2026-11-04 | — | #— |

## Objetivo

Dejar una API FastAPI que arranca, se conecta a PostgreSQL, tiene migraciones, un formato de error único y herramientas de calidad (tests, lint, tipos). Sobre esto se construye cada feature sin volver a discutir infraestructura.

## Historias cubiertas

No cubre historias de usuario: es una tarea de fundaciones (Fase 0).

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| Python 3.13 | Estable, con wheels para todas las dependencias | 3.12 (más viejo), 3.14 (no aporta nada) |
| SQLAlchemy async + asyncpg | No bloquea el event loop; convive con los WebSockets | Sync (más simple, pero bloquea) |
| IDs UUID v4 | No adivinables en URLs de invitación; se pueden generar en el cliente | Enteros autoincrementales |
| Formato de error `{"error": {code, message, details}}` | Contrato único para el frontend, documentado en OpenAPI | Formato por defecto de FastAPI (`{"detail": ...}`) |
| Códigos de error en español (`no_encontrado`, `validacion`…) | Coherentes con el dominio | Códigos en inglés |
| Postgres en el puerto **5433** del host | Hay un Postgres local en el 5432 y chocaría | 5432 (conflicto) |
| Base de tests separada (`organiviaje_test`) | Los tests nunca tocan los datos de desarrollo | Testear contra la misma base |
| `docker-compose.yml` con `db` adelantado de la rama 03 | Hace falta una base para probar `/health` y Alembic ahora | Instalar Postgres a mano |
| `/docs` deshabilitado en producción | No exponer la superficie de la API públicamente | Dejarlo siempre visible |
| `uv` con `package = false` | La API es una aplicación, no una librería publicable | Layout `src/` de paquete |

Detalle en [ADR 0005](../adr/0005-sqlalchemy-async-uuid.md).

## Diseño

```
docker-compose.yml          servicio db (postgres:16-alpine), healthcheck, volumen
.env.example                variables de app, base y base de tests
backend/
  pyproject.toml            dependencias + config de ruff, mypy (strict), pytest y coverage
  .python-version           3.13
  alembic.ini · alembic/    migraciones async; la URL sale de Settings; hooks de ruff en cada migración
  scripts/init-test-db.sql  crea organiviaje_test al inicializar el volumen
  app/
    main.py                 create_app(): CORS con credenciales, handlers de error, routers, lifespan
    models.py               registro central de modelos para Alembic
    core/config.py          Settings (pydantic-settings), validación del driver async
    core/db.py              engine, SessionLocal, Base + naming convention, UUIDPrimaryKey, Timestamps
    core/deps.py            SessionDep, SettingsDep
    core/errors.py          AppError y subclases, ErrorResponse, handlers
    api/health.py           GET /health
  tests/
    conftest.py             fuerza la base de test; saltea @pytest.mark.db si no hay Postgres
    unit/                   config y formato de errores
    integration/            health (con y sin base) y OpenAPI
```

### Endpoints
| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| GET | `/health` | público | `200 {"status":"ok","db":"ok"}` · `503` si la base no responde |
| GET | `/docs` | público (no en producción) | Swagger UI |
| GET | `/openapi.json` | público | Contrato de la API (de acá sale el cliente del frontend) |

### Errores
| Excepción | HTTP | `code` por defecto |
|---|---|---|
| `NotFoundError` | 404 | `no_encontrado` |
| `ConflictError` | 409 | `conflicto` |
| `UnauthorizedError` | 401 | `no_autenticado` |
| `ForbiddenError` | 403 | `sin_permiso` |
| `ServiceUnavailableError` | 503 | `servicio_no_disponible` |
| Validación de request | 422 | `validacion` (con `details.campos[]`) |
| Ruta inexistente / método | 404 / 405 | `ruta_no_encontrada` / `metodo_no_permitido` |
| Cualquier otra excepción | 500 | `error_interno` (sin filtrar detalles) |

## Hecho

- [x] Proyecto con `uv` y Python 3.13; dependencias fijadas en `uv.lock`.
- [x] Settings tipados con validación (driver async obligatorio, CORS como lista).
- [x] Engine y sesión async; base declarativa con naming convention; mixins de UUID y timestamps.
- [x] Formato de error unificado y documentado en OpenAPI.
- [x] `GET /health` con chequeo real de la base.
- [x] Alembic async integrado con Settings y la metadata de la app.
- [x] Postgres en Docker con base de tests separada.
- [x] 12 tests (unitarios + integración), 94% de cobertura.
- [x] Ruff (lint + formato) y mypy strict sin errores.

## Falta / deuda técnica / ideas para después

- [ ] Logging estructurado (JSON) y request-id por request: se suma con el deploy (rama 20).
- [ ] Tests de integración con transacción por test y rollback: se arman en la rama 04, cuando exista la primera tabla (`usuarios`).
- [ ] Servicios `api`, `web` y `redis` en docker-compose, más CI en GitHub Actions: rama 03.
- [ ] Considerar UUID v7 cuando lo soporte la librería estándar (ver ADR 0005).

## Cómo probarlo

```bash
cp .env.example .env              # una sola vez
docker compose up -d db
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
# http://localhost:8000/health  → {"status":"ok","db":"ok"}
# http://localhost:8000/docs    → Swagger

uv run pytest --cov=app
uv run ruff check . && uv run ruff format --check . && uv run mypy app tests
```

Flujo manual:
1. Con la base levantada, `/health` responde 200.
2. `docker compose stop db` → `/health` responde 503 con `code: db_no_disponible`.
3. `GET /cualquier-cosa` → 404 con `code: ruta_no_encontrada`.
