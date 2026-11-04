# 0005 · SQLAlchemy async, IDs UUID y Python 3.13

- **Estado:** Aceptada
- **Fecha:** 2026-11-04
- **Reemplaza parcialmente a:** [0002](0002-fastapi-nextjs.md), en la versión de Python (3.12 → 3.13)

## Contexto

La rama 01 define cómo accede el backend a la base y cómo se identifican las entidades. Hay que decidirlo antes de crear la primera tabla, porque después cambiarlo implica migrar todo. La app tiene WebSockets (CU3) que mantienen muchas conexiones abiertas, y URLs del estilo `/viajes/{id}` que se comparten por invitación.

## Decisión

- **SQLAlchemy 2 en modo async** con el driver `asyncpg`. Una `AsyncSession` por request, inyectada con `SessionDep`. El commit lo decide el *service*, y ante una excepción se hace rollback.
- **Claves primarias UUID v4**, generadas en Python (`UUIDPrimaryKey` en `app/core/db.py`). En Postgres son del tipo nativo `uuid`.
- **Timestamps** `created_at` y `updated_at` timezone-aware, calculados por la base (`Timestamps`).
- **Naming convention** para constraints e índices, así Alembic genera migraciones con nombres estables y reversibles.
- **Python 3.13**: estable y maduro, con wheels para todas las dependencias.

## Alternativas consideradas

- **SQLAlchemy sync**: más simple de entender, pero bloquea el event loop de FastAPI. Habría que mezclar threads con WebSockets.
- **IDs enteros autoincrementales**: más chicos y legibles, pero se pueden adivinar (`/viajes/1`, `/viajes/2`…) y exponen cuántos viajes hay. Además, el cliente no puede generarlos offline (lo vamos a necesitar en R3, US127).
- **UUID v7** (ordenados por tiempo, mejores para índices): Python 3.13 todavía no lo trae en la librería estándar y PostgreSQL 16 no lo genera de forma nativa. Para los volúmenes del proyecto, la diferencia con v4 es despreciable. Se puede adoptar más adelante sin cambiar el tipo de columna.
- **Python 3.14**: más nuevo, pero no aporta nada que necesitemos y algunas librerías tardan en soportarlo.

## Consecuencias

- ✅ No se bloquea el event loop: HTTP y WebSocket comparten el mismo modelo de concurrencia.
- ✅ Los IDs no se pueden adivinar y se pueden generar en el cliente.
- ⚠️ En async no hay *lazy loading* implícito: las relaciones se cargan de forma explícita (`selectinload`, `joinedload`). Es una buena práctica igual, porque evita N+1 ocultos.
- ⚠️ Los tests de integración necesitan un Postgres real (base `organiviaje_test`, creada por `backend/scripts/init-test-db.sql`).
