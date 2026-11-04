# 0006 · Base del frontend: pnpm, cliente OpenAPI, tema propio y textos centralizados

- **Estado:** Aceptada
- **Fecha:** 2026-11-04

## Contexto

La rama 02 fija cómo se trabaja en el frontend antes de la primera pantalla real. Estas decisiones afectan a todas las features que vienen: cómo se piden datos, dónde van los textos, cómo funciona el tema y qué herramientas usa el equipo.

## Decisión

1. **pnpm** (activado con `corepack`) como gestor de paquetes. Los scripts de instalación quedan bloqueados salvo los permitidos en `pnpm-workspace.yaml`.
2. **Datos del servidor**: siempre con TanStack Query sobre el cliente `api` de `src/lib/api/client.ts` (openapi-fetch). Los tipos se generan con `pnpm api:generate` y `schema.d.ts` se commitea. Así el front compila sin tener el backend levantado.
3. **Tema** claro / oscuro / sistema implementado sin librería: un script en el `<head>` aplica la clase `dark` antes del primer pintado (guía oficial de Next 16, *Preventing flash before hydration*), y `BotonTema` lo cambia.
4. **Textos**: todo texto visible vive en `src/textos/es.ts`. Los componentes no tienen strings sueltos.
5. **Nombres de archivo** en kebab-case (`estado-api.tsx`), componentes en PascalCase (`EstadoApi`).
6. **Estructura por feature**: `src/features/<feature>/{components, hooks.ts}`. Lo compartido va en `src/components` y `src/lib`.

## Alternativas consideradas

- **npm**: viene instalado, pero es más lento y permite usar dependencias transitivas sin declararlas.
- **next-themes**: resuelve lo mismo, pero suma una dependencia para 40 líneas de código que además sirven para aprender cómo funciona.
- **next-intl / i18next**: útiles si hubiera varios idiomas. Hoy alcanza con un objeto tipado, y migrar después es mecánico.
- **axios / fetch a mano**: obligaría a escribir los tipos de la API a mano, que es justo lo que el ADR 0002 prohíbe.

## Consecuencias

- ✅ Si el backend cambia un endpoint, `pnpm api:generate` + `pnpm typecheck` muestran qué hay que adaptar.
- ✅ Cambiar el look & feel o traducir la app se hace en un solo lugar.
- ⚠️ Hay que acordarse de correr `pnpm api:generate` después de cambiar la API, y commitear `schema.d.ts` en el mismo PR. Se va a verificar en CI (rama 03).
- ⚠️ Next.js 16 cambió APIs respecto de versiones anteriores: antes de usar algo nuevo, consultar la documentación incluida en `node_modules/next/dist/docs/` (lo pide `frontend/AGENTS.md`).
