# 0002 · FastAPI + Next.js con contrato OpenAPI

- **Estado:** Aceptada
- **Fecha:** 2026-11-04

## Contexto

Necesitamos una API con lógica de dominio no trivial (división de gastos, saldos, votaciones), soporte de tiempo real (WebSockets) y una interfaz web responsive e instalable en el celular. El equipo quiere aprender un stack actual y usado en la industria.

## Decisión

- **Backend:** Python 3.12 + FastAPI, Pydantic v2, SQLAlchemy 2 async, Alembic, PostgreSQL 16, Redis. Gestión de dependencias con `uv`.
- **Frontend:** Next.js (App Router) + TypeScript estricto, Tailwind CSS, shadcn/ui, TanStack Query.
- **Contrato:** el OpenAPI que genera FastAPI es la fuente de verdad. El frontend genera sus tipos con `openapi-typescript` (`npm run api:generate`). Prohibido escribir tipos de la API a mano.

## Alternativas consideradas

- **Django + DRF:** muy completo, pero más pesado y con async menos natural para WebSockets.
- **Next.js full-stack (API routes + Prisma):** un solo lenguaje, pero mezcla capas y el dominio financiero queda menos aislado y testeable.
- **Vite + React SPA:** más simple, pero perdemos SSR, routing por archivos y la integración con Vercel/PWA.

## Consecuencias

- ✅ Validación y documentación automáticas (`/docs` de FastAPI).
- ✅ Tipos de punta a punta: si cambia un schema, el front no compila hasta adaptarse.
- ✅ Dominio en Python puro, testeable sin DB.
- ⚠️ Dos lenguajes y dos toolchains en el equipo.
- ⚠️ CORS y cookies cross-site requieren configuración cuidadosa en deploy (ver ADR 0003).
