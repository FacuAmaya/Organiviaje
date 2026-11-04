# 03 · Docker completo y CI

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `base/03-docker-y-ci` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que cualquier integrante levante toda la app con un solo comando y que GitHub verifique automáticamente cada PR (tests, lint, tipos y build) antes de permitir el merge. Así nadie rompe `main` sin darse cuenta.

## Depende de

- 01 · backend
- 02 · frontend

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

No cubre historias de usuario: es infraestructura (Fase 0).

## Fuera de alcance

- Deploy público (rama 20).
- Monitoreo y logs centralizados (rama 20).

## Diseño propuesto

### Modelo y migraciones

Sin cambios de base de datos.

### Infraestructura

- `docker-compose.yml` con servicios `db` (ya existe), `redis`, `api` y `web`, todos con *healthcheck*.
- Recarga automática en desarrollo: el código se monta como volumen (`api` con `uvicorn --reload`, `web` con `next dev`).
- Puertos del host configurables por `.env` (`API_PORT`, `WEB_PORT`, `POSTGRES_PORT`) para convivir con otros proyectos.
- `backend/Dockerfile` y `frontend/Dockerfile` multi-stage (desarrollo y producción) + `.dockerignore`.
- GitHub Actions `ci.yml` con filtros por carpeta: *backend* (ruff, mypy, pytest con servicio Postgres) y *frontend* (lint, typecheck, test, build, e2e con Playwright).
- Chequeo de contrato: el CI regenera `schema.d.ts` desde el backend y falla si difiere del commiteado.
- `pre-commit` con ruff y prettier (formatea antes de cada commit).
- Protección de `main`: CI obligatorio para mergear.

## Preguntas abiertas para el debate

- [ ] ¿Los e2e corren en cada PR o solo al mergear a `main` (son los más lentos)?
- [ ] ¿`pre-commit` (Python) o `lefthook` (binario, sin Python) para los hooks?
- [ ] ¿Cacheamos las imágenes de Docker en CI o alcanza con cachear uv/pnpm?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
cp .env.example .env
docker compose up
# API → http://localhost:${API_PORT}/health · Web → http://localhost:${WEB_PORT}
```

Flujo manual:
1. Clonar el repo en una carpeta nueva y levantar todo solo con `docker compose up`.
2. Abrir un PR con un test roto a propósito → el check queda en rojo y no deja mergear.
