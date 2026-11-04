# 0001 · Monorepo con backend, frontend y docs

- **Estado:** Aceptada
- **Fecha:** 2026-11-04

## Contexto

La mayoría de las historias de usuario atraviesan backend y frontend a la vez (p. ej. US114 "dividir un gasto en partes iguales" necesita endpoint, lógica de dominio y formulario). El equipo es de 2–4 personas y queremos que cada feature tenga una sola rama, un solo PR y su documentación al lado del código.

## Decisión

Un único repositorio con:

```
backend/    FastAPI
frontend/   Next.js
docs/       plan, features, ADRs, UX, análisis
```

El CI corre los jobs de backend y frontend por separado, filtrando por carpeta modificada.

## Alternativas consideradas

- **Dos repos (api / web):** obliga a coordinar dos PRs por historia y versionar el contrato aparte. Más fricción para un equipo chico.
- **Monorepo con herramienta (Nx/Turborepo):** potente pero agrega complejidad que no necesitamos con solo dos apps en lenguajes distintos.

## Consecuencias

- ✅ Una historia = una rama = un PR, con su md de feature.
- ✅ El cliente tipado del front se regenera en el mismo PR que cambia la API.
- ⚠️ El CI debe filtrar por rutas para no correr todo en cada cambio.
- ⚠️ Deploy separado por carpeta (Vercel usa `frontend/` como root; Render/Railway usa `backend/`).
