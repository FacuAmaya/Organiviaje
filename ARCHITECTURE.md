# ARCHITECTURE — Organiviaje

Cómo está organizado el sistema y por qué. Las decisiones de fondo están justificadas en [docs/adr/](docs/adr/).

## Vista general

```
┌──────────────────────────┐        HTTPS / JSON (REST)        ┌──────────────────────────┐
│  Frontend · Next.js      │ ────────────────────────────────▶ │  Backend · FastAPI       │
│  App Router + TS         │ ◀──────────────────────────────── │  módulos por dominio     │
│  PWA instalable          │        WebSocket /ws/viajes/{id}   │                          │
└──────────────────────────┘ ◀═══════════════════════════════▶ └────────────┬─────────────┘
             │                                                             │
             │ tiles / geocoding                         SQLAlchemy async  │  pub/sub
             ▼                                                             ▼
   OpenStreetMap / MapLibre                              PostgreSQL 16      Redis
```

- **Monorepo** ([ADR 0001](docs/adr/0001-monorepo.md)): `backend/`, `frontend/`, `docs/`.
- **Contrato único**: FastAPI genera el OpenAPI → el frontend genera su cliente tipado con `openapi-typescript`. Nunca se escriben tipos de la API a mano.
- **Auth** ([ADR 0003](docs/adr/0003-jwt-cookies.md)): JWT en cookies httpOnly.
- **Tiempo real**: WebSocket por viaje; los mensajes se publican en Redis para que funcione con más de una instancia de la API.

## Backend

```
backend/
  app/
    main.py                 crea la app, monta routers, middlewares, handlers de error
    core/
      config.py             Settings (pydantic-settings, lee .env)
      db.py                 engine async, sesión, Base declarativa
      security.py           hash argon2, emisión/validación de JWT
      deps.py               get_db, get_current_user, require_member, require_organizer
      errors.py             excepciones de dominio → respuestas HTTP uniformes
    modules/
      nucleo/  decisiones/  planificacion/  finanzas/  realtime/
        models.py           tablas SQLAlchemy
        schemas.py          Pydantic: entrada (Create/Update) y salida (Read)
        domain.py           lógica de negocio pura, sin DB ni HTTP
        repository.py       acceso a datos (queries)
        service.py          casos de uso: orquesta repository + domain, maneja transacciones
        router.py           endpoints HTTP: valida, autoriza, delega en service
  alembic/                  migraciones
  tests/
    unit/                   tests de domain.py (rápidos, sin DB)
    integration/            tests de API con DB real de test
```

### Reglas

1. **Dependencias en una sola dirección**: `router → service → repository → models`. `domain.py` no importa nada de infraestructura.
2. **Entre módulos** solo se usan los *services* (equivale al estereotipo «ref» del UML). Ningún módulo hace queries sobre tablas de otro.
3. **Autorización centralizada** en `MiembroViaje`: `require_member(viaje_id)` y `require_organizer(viaje_id)` como dependencias de FastAPI.
4. **Dinero**: `Decimal` en Python, `NUMERIC(12, 2)` en la base. Nunca `float`.
5. **Fechas**: siempre timezone-aware en UTC en la base; el frontend convierte a la zona del viaje.
6. **Errores**: el dominio lanza excepciones propias (`NoEsMiembro`, `DistribucionInvalida`…); `errors.py` las traduce a un formato único:
   ```json
   { "error": { "code": "distribucion_invalida", "message": "Las partes no suman el total", "details": {} } }
   ```
7. **Herencia de Propuesta**: single-table con discriminador `tipo`.
8. **Patrones del modelo** que se respetan en código: `CriterioDivision` como Strategy (polimorfismo de `distribuir()`), conceptos asociativos como tablas propias con datos (`MiembroViaje`, `AporteGasto`, `ParteGasto`, `ParticipacionActividad`).

## Frontend

```
frontend/src/
  app/
    (auth)/login, registro/
    (app)/viajes/
      [viajeId]/  ideas · votaciones · itinerario · mapa · gastos · hoy
  features/<feature>/
    components/             componentes de la feature
    hooks.ts                hooks de TanStack Query (useViajes, useCrearGasto…)
    schemas.ts              validación zod de formularios
  components/ui/            shadcn/ui (base del design system)
  lib/
    api/                    cliente generado desde OpenAPI + fetcher
    realtime/               cliente WebSocket con reconexión
  styles/                   tokens del tema (CSS variables)
```

### Reglas

1. **Server Components por defecto**; `"use client"` solo donde hay interacción.
2. **Estado del servidor** con TanStack Query; nada de duplicarlo en estado global.
3. **Estilos solo vía tokens** (CSS variables del tema). Prohibido hardcodear colores: así el look & feel se puede cambiar entero desde [docs/ux/](docs/ux/).
4. **Mobile-first**: se diseña para 360px y se amplía.
5. Cada pantalla tiene estados **vacío, carga y error**.

## Testing

| Nivel | Herramienta | Qué cubre |
|---|---|---|
| Unit back | pytest | `domain.py` (división de gastos, simplificación de deudas, resultado de encuestas) — cobertura ≥ 80% |
| Integración back | pytest + httpx + Postgres de test | endpoints, permisos, migraciones |
| Componentes | Vitest + Testing Library | componentes con lógica |
| E2E | Playwright (viewports mobile y desktop) | flujos completos de cada CU |

## Seguridad (mínimos)

- Contraseñas con argon2; JWT con expiración corta + refresh rotativo.
- Cookies `httpOnly`, `Secure`, `SameSite=Lax`; CORS restringido al dominio del front.
- Toda ruta de un viaje valida membresía en el backend (nunca confiar en el front).
- Posiciones compartidas: solo visibles para miembros del viaje y con vencimiento (`estaVigente()`).
- Secretos solo en variables de entorno; `.env` nunca se commitea.
