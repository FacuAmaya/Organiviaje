# Architecture Decision Records

Cada decisión de arquitectura importante se registra en un archivo propio, numerado y **nunca se edita una vez aceptada**: si cambia, se crea un ADR nuevo que la reemplaza ("Reemplaza a 000X").

Formato: Contexto → Decisión → Alternativas consideradas → Consecuencias.

| # | Título | Estado |
|---|---|---|
| [0001](0001-monorepo.md) | Monorepo con backend, frontend y docs | Aceptada |
| [0002](0002-fastapi-nextjs.md) | FastAPI + Next.js con contrato OpenAPI | Aceptada |
| [0003](0003-jwt-cookies.md) | Autenticación propia con JWT en cookies httpOnly | Aceptada |
| [0004](0004-github-flow.md) | GitHub Flow con ramas por feature y squash merge | Aceptada |

Para crear uno nuevo: copiar el formato de cualquiera, siguiente número, y sumarlo a esta tabla en el mismo PR.
