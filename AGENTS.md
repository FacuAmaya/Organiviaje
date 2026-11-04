# AGENTS — Reglas de trabajo

Instrucciones para **cualquiera que escriba código en este repo**: integrantes del equipo y asistentes de IA. Si una regla no te cierra, se discute en un PR que la modifique, no se ignora.

## 0. Antes de tocar código

1. Leé [CONTEXT.md](CONTEXT.md) (dominio y estado) y [ARCHITECTURE.md](ARCHITECTURE.md) (dónde va cada cosa).
2. Leé el `docs/features/NN-*.md` de la feature en curso: ahí están el alcance, las decisiones y lo que falta.
3. **No se empieza una feature sin debatirla primero** (alcance, modelo, endpoints, pantallas) y sin su md creado.

## 1. Comandos

> Se completan a medida que se crean los esqueletos (ramas 01–03). Los de backend se corren desde `backend/`.

| Tarea | Comando |
|---|---|
| Primera vez | `cp .env.example .env` |
| Base de datos (Postgres en el puerto 5433) | `docker compose up -d db` |
| Backend: instalar dependencias | `uv sync` |
| Backend: levantar API | `uv run uvicorn app.main:app --reload` → http://localhost:8000/docs |
| Backend: tests + cobertura | `uv run pytest --cov=app` |
| Backend: lint + formato | `uv run ruff check --fix . && uv run ruff format .` |
| Backend: tipos | `uv run mypy app tests` |
| Backend: agregar dependencia | `uv add paquete` (dev: `uv add --dev paquete`) |
| Nueva migración | `uv run alembic revision --autogenerate -m "descripcion"` (revisarla siempre antes de commitear) |
| Aplicar migraciones | `uv run alembic upgrade head` |
| Verificar que modelos y migraciones coinciden | `uv run alembic check` |
| Frontend: dev | `cd frontend && npm run dev` |
| Frontend: tests | `cd frontend && npm test` |
| Frontend: e2e | `cd frontend && npm run test:e2e` |
| Regenerar cliente API | `cd frontend && npm run api:generate` |

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

## 3. Ciclo de una feature

1. Debate → `docs/features/NN-descripcion.md` desde [`_TEMPLATE.md`](docs/features/_TEMPLATE.md) (primer commit de la rama).
2. Issues de GitHub para cada `US###` de la feature.
3. **Backend**: modelo + migración → `domain.py` con tests (TDD si hay lógica) → repository/service → router + tests de API.
4. `npm run api:generate` en el frontend.
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
- Componentes en `PascalCase.tsx`, hooks `useAlgo`.
- Datos del servidor solo con TanStack Query y el cliente generado.
- Estilos solo con clases de Tailwind que usan tokens del tema. Prohibido hardcodear colores o tamaños mágicos.
- Formularios con react-hook-form + zod.

## 6. Para asistentes de IA

- Trabajar **una feature a la vez** y solo dentro de su alcance definido en el md.
- Antes de proponer código nuevo, buscar si ya existe algo reutilizable.
- No hacer `push`, abrir PRs ni cambiar configuración de GitHub sin confirmación explícita.
- Al terminar una tarea: actualizar las secciones "Hecho" y "Falta" del md de la feature.
- Si algo del plan o del modelo no cierra, frenar y plantearlo en lugar de improvisar.
