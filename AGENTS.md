# AGENTS — Reglas de trabajo

Instrucciones para **cualquiera que escriba código en este repo**: integrantes del equipo y asistentes de IA. Si una regla no te cierra, se discute en un PR que la modifique, no se ignora.

## 0. Antes de tocar código

1. Leé [CONTEXT.md](CONTEXT.md) (dominio y estado) y [ARCHITECTURE.md](ARCHITECTURE.md) (dónde va cada cosa).
2. Leé el `docs/features/NN-*.md` de la feature en curso: ahí están el alcance, las decisiones y lo que falta.
3. **No se empieza una feature sin debatirla primero** (alcance, modelo, endpoints, pantallas) y sin su md creado.

## 1. Comandos

Hay dos formas de trabajar: **todo en Docker** (lo más simple) o **base en Docker y API/web en tu compu** (tests más rápidos). Los comandos de backend se corren desde `backend/` y los de frontend desde `frontend/`.

| Tarea | Comando |
|---|---|
| Primera vez | `cp .env.example .env` (ajustá los puertos si están ocupados) y `uvx pre-commit install` |
| **Levantar todo** (db, redis, api, web) | `docker compose up` → web en `WEB_PORT`, API en `API_PORT` |
| Reconstruir imágenes (cambiaron dependencias) | `docker compose up --build` |
| Ver logs de un servicio | `docker compose logs -f api` |
| Apagar todo | `docker compose down` (con `-v` borra también la base) |
| Solo la base (Postgres en el puerto 5433) | `docker compose up -d db` |
| Correr los chequeos como el CI | `docker run --rm $(docker build -q --target test backend)` (ídem `frontend`) |
| Chequeos de pre-commit a mano | `uvx pre-commit run --all-files` |
| Backend: instalar dependencias | `uv sync` |
| Backend: levantar API | `uv run uvicorn app.main:app --reload` → http://localhost:8000/docs |
| Backend: tests + cobertura | `uv run pytest --cov=app` |
| Backend: lint + formato | `uv run ruff check --fix . && uv run ruff format .` |
| Backend: tipos | `uv run mypy app tests` |
| Backend: agregar dependencia | `uv add paquete` (dev: `uv add --dev paquete`) |
| Nueva migración | `uv run alembic revision --autogenerate -m "descripcion"` (revisarla siempre antes de commitear) |
| Aplicar migraciones | `uv run alembic upgrade head` |
| Verificar que modelos y migraciones coinciden | `uv run alembic check` |
| Frontend: instalar dependencias | `pnpm install` (desde `frontend/`; pnpm se activa con `corepack enable pnpm`) |
| Frontend: levantar | `pnpm dev` → http://localhost:3000 |
| Frontend: tests de componentes | `pnpm test` (en modo watch: `pnpm test:watch`) |
| Frontend: e2e (navegador real) | `pnpm test:e2e` (la primera vez: `pnpm exec playwright install chromium`) |
| Frontend: lint + tipos + formato | `pnpm lint && pnpm typecheck && pnpm format:check` (arreglar formato: `pnpm format`) |
| Frontend: agregar componente shadcn | `pnpm dlx shadcn@latest add <componente>` |
| Regenerar cliente de la API | `pnpm api:generate` (no hace falta levantar el backend; commitear `src/lib/api/schema.d.ts`; el CI falla si quedó desactualizado) |
| Build de producción | `pnpm build` |

## 2. Flujo de Git

- `main` está protegida: solo entra código por PR con 1 aprobación y CI verde.
- Ramas desde `main` actualizada. **Los nombres son en español y tienen que entenderse sin conocer el proyecto**: tipo de cambio + número del paso en el plan + qué hace.

  ```
  funcionalidad/16-registrar-y-dividir-gastos
  └─ tipo ─────┘ └┘ └─ qué hace, con verbos ─┘
                  número de paso en el plan
  ```

  | Tipo | Cuándo se usa | Ejemplo |
  |---|---|---|
  | `base/` | Infraestructura y herramientas: lo que la app necesita para existir, pero que el usuario no ve | `base/01-backend-fastapi` |
  | `funcionalidad/` | Algo que el usuario puede hacer (una o varias historias US###) | `funcionalidad/07-invitar-al-grupo` |
  | `diseno/` | Cambios de look & feel desde `docs/ux/` | `diseno/estilo-visual-v1` |
  | `experimento/` | Prueba de concepto para validar algo riesgoso; puede descartarse | `experimento/05-tiempo-real` |
  | `arreglo/` | Corrección de un bug (sin número) | `arreglo/saldo-mal-redondeado` |
  | `docs/` | Solo documentación (sin número) | `docs/moodboard-colores` |

  Reglas: minúsculas, palabras separadas con guiones, sin tildes ni ñ (git y algunas terminales las manejan mal), y como máximo 5–6 palabras. El md de la rama se llama igual que la rama sin el tipo: `docs/features/16-registrar-y-dividir-gastos.md`.

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) en español, en imperativo, con ID de historia cuando aplica:
  ```
  feat(finanzas): dividir gasto en partes iguales (US114)
  fix(nucleo): impedir aceptar invitación vencida
  test(decisiones): cubrir desempate de encuesta
  docs(features): actualizar estado de 16-registrar-y-dividir-gastos
  chore(ci): cachear dependencias de uv
  ```
  Tipos de commit (son palabras clave estándar en inglés, las entienden herramientas como generadores de changelog; el resto del mensaje va en español):

  | Tipo | Significa |
  |---|---|
  | `feat` | funcionalidad nueva |
  | `fix` | arreglo de un bug |
  | `refactor` | reorganizar código sin cambiar lo que hace |
  | `test` | agregar o corregir tests |
  | `docs` | solo documentación |
  | `build` | dependencias o empaquetado |
  | `ci` | integración continua (GitHub Actions) |
  | `chore` | tareas de mantenimiento que no entran en las otras |
  | `style` | formato, sin cambios de lógica |
  | `perf` | mejora de rendimiento |
- **PRs** chicos y enfocados (ideal < 400 líneas). Si crece, se parte. Merge con **squash**.
- Nunca: `push --force` sobre `main`, commitear `.env`, mergear con CI rojo.
- **CI:** cada PR corre `.github/workflows/ci.yml` (solo las partes cuyos archivos cambiaron). Para mergear hace falta el check **CI ok** en verde.

## 3. Ciclo de una feature

Las 18 features del MVP ya tienen spec, rama e issue (ADR 0007). Paso a paso para tomar una: [docs/features/README.md](docs/features/README.md#cómo-tomar-una-feature).

0. Asignarse el issue en el tablero y **actualizar la rama con `main`** (`git fetch origin && git switch <rama> && git merge origin/main`).
1. Debate de las *Preguntas abiertas* del `docs/features/NN-descripcion.md` → anotar las *Decisiones* (primer commit de la rama). Features nuevas (R2/R3): crear el md desde [`_TEMPLATE.md`](docs/features/_TEMPLATE.md).
2. Mover el issue de la feature a *En curso* (cada issue lista sus `US###` como checklist).
3. **Backend**: modelo + migración → `domain.py` con tests (TDD si hay lógica) → repository/service → router + tests de API.
4. `pnpm api:generate` en el frontend (con el backend levantado).
5. **Frontend**: hooks → componentes → página → tests → e2e (mobile y desktop).
6. Actualizar: md de la feature, tabla de estado de [CONTEXT.md](CONTEXT.md#estado-del-proyecto), [UX.md](UX.md) si hay pantallas nuevas, [CHANGELOG.md](CHANGELOG.md).
7. PR con template → revisión → squash merge → cerrar issues.

## 4. Definition of Done

- [ ] Criterios de aceptación de cada `US###` cumplidos.
- [ ] Tests unitarios, de integración y e2e en verde; sin warnings de lint ni de tipos.
- [ ] Validaciones con mensajes de error claros (back y front).
- [ ] Estados vacío / carga / error implementados.
- [ ] Permisos verificados (integrante vs. organizador vs. no miembro).
- [ ] Accesibilidad: teclado, labels, contraste.
- [ ] Revisado en mobile (360px), tablet (768px) y desktop (1280px).
- [ ] Docs actualizados (feature md, CONTEXT, UX, CHANGELOG).
- [ ] Revisado y aprobado por otro integrante.

## 5. Convenciones de código

**Generales**
- Nombres de dominio **en español**, igual que en el modelo UML (`Viaje`, `MiembroViaje`, `calcular_saldo`). Términos técnicos en inglés (`repository`, `service`, `router`, `hooks`).
- Sin código muerto ni comentarios que repiten el código. Comentar el *por qué*, no el *qué*.

**Backend (Python)**
- `snake_case` en funciones/variables, `PascalCase` en clases. Type hints en todo.
- Lógica de negocio en `domain.py`, nunca en el router.
- Dinero con `Decimal`; fechas timezone-aware en UTC.
- Errores de dominio como subclases de `AppError` (`app/core/errors.py`), con `code` en snake_case y en español; nada de `HTTPException` fuera del router.
- Modelos nuevos heredan de `Base`, `UUIDPrimaryKey` y `Timestamps` (`app/core/db.py`) y se registran en `app/models.py`.
- Tests que necesitan Postgres llevan `@pytest.mark.db`.
- Toda ruta de viaje usa `require_member` o `require_organizer`.

**Frontend (TypeScript)**
- `strict: true`; sin `any`.
- Archivos en kebab-case (`boton-tema.tsx`); componentes en PascalCase (`BotonTema`); hooks `useAlgo`.
- **Ningún texto visible escrito en el JSX**: todo sale de `src/textos/es.ts`.
- Datos del servidor solo con TanStack Query y el cliente `api` de `src/lib/api/client.ts`. Si cambia la API: `pnpm api:generate`.
- Código de una feature en `src/features/<feature>/`; lo compartido en `src/components/` y `src/lib/`.
- Next.js 16 cambió APIs: antes de usar algo nuevo, leer `node_modules/next/dist/docs/` (lo pide `frontend/AGENTS.md`, que mantiene Next; no editarlo).
- Estilos solo con clases de Tailwind que usan tokens del tema. Prohibido hardcodear colores o tamaños mágicos.
- Formularios con react-hook-form + zod.

## 6. Para asistentes de IA

- Trabajar **una feature a la vez** y solo dentro de su alcance definido en el md.
- Antes de proponer código nuevo, buscar si ya existe algo reutilizable.
- No hacer `push`, abrir PRs ni cambiar configuración de GitHub sin confirmación explícita.
- Al terminar una tarea: actualizar las secciones "Hecho" y "Falta" del md de la feature.
- Si algo del plan o del modelo no cierra, frenar y plantearlo en lugar de improvisar.
