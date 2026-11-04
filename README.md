# Organiviaje

> Viajar en grupo, sin caos.

Organizador colaborativo de viajes grupales. Integra en una sola app lo que hoy está desparramado entre notas, chats, mails y planillas: **propuestas y votaciones**, **itinerario sobre mapa**, **ubicación en tiempo real** y **gastos compartidos con balances**.

Resultado buscado: una web app deployada, instalable en el celular como PWA y usable con la misma calidad en mobile, tablet y desktop.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Python 3.13 · FastAPI · SQLAlchemy 2 (async) · Alembic · Pydantic v2 |
| Base de datos | PostgreSQL 16 · Redis (pub/sub de tiempo real) |
| Frontend | Next.js 16 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · TanStack Query |
| Mapas | MapLibre GL · OpenStreetMap |
| Infra | Docker Compose · GitHub Actions · Vercel + Render/Railway |

## Estado

🚧 **Fase 0 — Fundaciones.** Esqueletos de backend y frontend listos; próximo: Docker completo y CI. Ver el estado detallado en [CONTEXT.md](CONTEXT.md#estado-del-proyecto).

## Cómo levantarlo

Requisitos: Docker, [uv](https://docs.astral.sh/uv/) y Node 24 (con corepack para pnpm).

```bash
cp .env.example .env
docker compose up -d db          # PostgreSQL en el puerto 5433
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
# API → http://localhost:8000/docs

# en otra terminal
cd frontend
cp .env.example .env.local
pnpm install                     # pnpm se activa con: corepack enable pnpm
pnpm dev
# Web → http://localhost:3000
```

> En la rama `base/03-docker-y-ci` todo pasa a levantarse con un solo `docker compose up` (API, web, base y Redis).

## Documentación

| Documento | Para qué sirve |
|---|---|
| [CONTEXT.md](CONTEXT.md) | Dominio, glosario, decisiones, supuestos y **estado del proyecto** |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Cómo está organizado el código y por qué |
| [UX.md](UX.md) | Principios de experiencia, flujos y design system consolidado |
| [AGENTS.md](AGENTS.md) | Reglas de trabajo para quien escribe código (personas o IA) |
| [CHANGELOG.md](CHANGELOG.md) | Cambios por versión |
| [docs/plan/](docs/plan/) | Plan de desarrollo completo (md + pdf) |
| [docs/features/](docs/features/) | Un documento por feature: qué se hizo, qué falta, cómo probarlo |
| [docs/adr/](docs/adr/) | Decisiones de arquitectura (ADRs) |
| [docs/ux/](docs/ux/) | Investigación de look & feel en curso |
| [docs/analisis/](docs/analisis/) | Análisis original: modelo UML, USM, casos de uso, actividad |

## Cómo contribuir

Resumen (detalle en [AGENTS.md](AGENTS.md)):

1. Tomá un issue del tablero (cada historia `US###` es un issue).
2. Creá la rama desde `main` actualizada: `funcionalidad/NN-descripcion`.
3. Primer commit: `docs/features/NN-descripcion.md` a partir de [`_TEMPLATE.md`](docs/features/_TEMPLATE.md).
4. Commits con [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) e ID de historia.
5. Abrí un PR con el template, pedí revisión y mergeá con squash cuando el CI esté verde.
