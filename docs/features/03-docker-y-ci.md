# 03 · Docker completo y CI

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `base/03-docker-y-ci` | 🚧 en curso | @FacuAmaya | [#5](https://github.com/FacuAmaya/Organiviaje/issues/5) | #— |

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

- [x] ¿Los e2e corren en cada PR o solo al mergear a `main` (son los más lentos)? → **en cada PR**
- [x] ¿`pre-commit` (Python) o `lefthook` (binario, sin Python) para los hooks? → **pre-commit** con `uvx`
- [x] ¿Cacheamos las imágenes de Docker en CI o alcanza con cachear uv/pnpm? → **ambos** (el cache de capas de Docker en GitHub son 2 líneas)

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| **Un Dockerfile por servicio con 4 etapas**: `base`, `desarrollo`, `test`, `produccion` | Las versiones comparten la base: una librería nueva se agrega en un solo lugar. Idea del equipo: tener una imagen para desarrollo con todo, otra para probar y otra liviana | Un Dockerfile por uso (3 archivos que hay que mantener sincronizados) |
| En desarrollo el código se **monta como volumen** con recarga automática | Guardás un archivo y se ve el cambio sin reconstruir la imagen | Reconstruir la imagen en cada cambio |
| **Puertos del host configurables** en `.env` (`API_PORT`, `WEB_PORT`, `POSTGRES_PORT`, `REDIS_PORT`) | En la máquina de FacuAmaya otro proyecto usa 3000 y 8000 | Puertos fijos |
| Redis en el puerto **6380** del host | Evitar choque con un Redis local | 6379 |
| Imágenes de producción con **usuario sin privilegios** y `HEALTHCHECK` | Seguridad básica; la plataforma de deploy sabe si la app está viva | Correr como root |
| Next.js con `output: "standalone"` | La imagen de producción pesa ~200 MB en vez de ~1 GB | Copiar todo `node_modules` |
| CI con **filtros por carpeta** y un job final **`CI ok`** | Un PR que solo toca el frontend no corre el backend; la protección de `main` exige un único check | Correr todo siempre · exigir cada job por separado |
| Job **contrato**: regenera `schema.d.ts` y falla si difiere | Nadie mergea un cambio de API sin actualizar el frontend | Confiar en acordarse |
| `pnpm api:generate` **exporta el OpenAPI desde el código** (`backend/scripts/exportar_openapi.py`) | Funciona sin levantar el backend y es idéntico en CI y en tu compu | Leerlo del servidor en `:8000` |
| e2e en cada PR | Hoy tardan segundos | Solo en `main` |
| `pre-commit` con `uvx` | Ya usamos `uv`; no hay que instalar nada más | `lefthook` |

## Hecho

- [x] Debate hecho y preguntas abiertas respondidas
- [x] `backend/Dockerfile` y `frontend/Dockerfile` con etapas `base` · `desarrollo` · `test` · `produccion` + `.dockerignore`
- [x] `docker-compose.yml` con `db`, `redis`, `api` y `web`, healthchecks y dependencias en orden (db/redis → api → web)
- [x] Recarga automática verificada en API y web dentro de Docker
- [x] Etapa `test` verificada: backend 11 tests + lint + tipos; frontend 8 tests + lint + tipos + formato
- [x] Imágenes de producción verificadas: API (234 MB, usuario `app`, sin `/docs`) y web standalone (205 MB)
- [x] `.github/workflows/ci.yml`: backend, frontend (con build y e2e), contrato, imágenes de producción y `CI ok`
- [x] `pnpm api:generate` sin servidor
- [x] `.pre-commit-config.yaml` (higiene de archivos, claves privadas, ruff, prettier)
- [ ] CI en verde en el PR
- [ ] Protección de `main` exigiendo `CI ok`
- [x] Docs actualizados (este archivo, AGENTS, README, CONTEXT, CHANGELOG)

## Falta / deuda técnica / ideas para después

- Escaneo de vulnerabilidades de dependencias (Dependabot / `pip-audit` / `pnpm audit`) → cuando haya deploy (rama 20).
- Publicar las imágenes en un registry (GitHub Container Registry) → rama 20.
- Si los e2e crecen mucho, moverlos a un job aparte o solo a `main`.

## Cómo probarlo

```bash
cp .env.example .env                       # ajustá los puertos si están ocupados
docker compose up                          # db + redis + api + web
# API → http://localhost:8000/health · Web → http://localhost:3000 (o los puertos de tu .env)

docker compose up -d db                    # solo la base (para correr API y web en tu compu)
docker build --target test backend         # etapa test del backend
docker run --rm $(docker build -q --target test frontend)   # corre los chequeos del frontend

uvx pre-commit install                     # una vez: activa los chequeos en cada commit
uvx pre-commit run --all-files             # correrlos a mano
```

Flujo manual:
1. Clonar el repo en una carpeta nueva y levantar todo solo con `docker compose up`.
2. Abrir un PR con un test roto a propósito → el check queda en rojo y no deja mergear.
