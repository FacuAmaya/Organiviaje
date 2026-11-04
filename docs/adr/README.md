# Architecture Decision Records

Cada decisión de arquitectura importante se registra en un archivo propio, numerado y **nunca se edita una vez aceptada**: si cambia, se crea un ADR nuevo que la reemplaza ("Reemplaza a 000X").

Formato: Contexto → Decisión → Alternativas consideradas → Consecuencias.

| # | Título | Estado |
|---|---|---|
| [0001](0001-monorepo.md) | Monorepo con backend, frontend y docs | Aceptada |
| [0002](0002-fastapi-nextjs.md) | FastAPI + Next.js con contrato OpenAPI | Aceptada |
| [0003](0003-jwt-cookies.md) | Autenticación propia con JWT en cookies httpOnly | Aceptada |
| [0004](0004-github-flow.md) | GitHub Flow con ramas por feature y squash merge | Aceptada |
| [0005](0005-sqlalchemy-async-uuid.md) | SQLAlchemy async, IDs UUID y Python 3.13 | Aceptada |
| [0006](0006-frontend-base.md) | Base del frontend: pnpm, cliente OpenAPI, tema propio y textos centralizados | Aceptada |
| [0007](0007-ramas-y-specs-por-adelantado.md) | Especificaciones y ramas del MVP creadas por adelantado, con tablero | Aceptada |

Para crear uno nuevo: copiar el formato de cualquiera, siguiente número, y sumarlo a esta tabla en el mismo PR.
