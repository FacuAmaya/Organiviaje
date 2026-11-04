# Changelog

Todos los cambios relevantes del proyecto. Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [SemVer](https://semver.org/lang/es/).

## [Sin publicar]

### Agregado
- Estructura del monorepo y documentación base: README, CONTEXT, ARCHITECTURE, UX, AGENTS, CLAUDE.
- ADRs 0001–0004: monorepo, FastAPI + Next.js, JWT en cookies, GitHub Flow.
- Plan de desarrollo en `docs/plan/` (md y pdf).
- Análisis original del TP en `docs/analisis/`.
- Carpeta de investigación de look & feel `docs/ux/`.
- Templates de PR e issues, CODEOWNERS, `.editorconfig`, `.gitignore`.
- Esqueleto del backend: FastAPI, Python 3.13, SQLAlchemy async, Alembic, `/health`, formato de error unificado, pytest, ruff y mypy.
- `docker-compose.yml` con PostgreSQL 16 para desarrollo y base de tests separada.
- ADR 0005: SQLAlchemy async, IDs UUID y Python 3.13.
- Esqueleto del frontend: Next.js 16, pnpm, Tailwind 4, shadcn/ui, modo oscuro sin parpadeo, Inter, textos en español centralizados, cliente tipado de la API, indicador de estado del servidor, Vitest y Playwright (celular y escritorio).
- ADR 0006: base del frontend.
- Especificaciones de las 18 features del MVP (pasos 03–20) con historias, criterios de aceptación, dependencias y diseño propuesto; índice con mapa de dependencias.
- ADR 0007: specs y ramas del MVP creadas por adelantado, con tablero.
