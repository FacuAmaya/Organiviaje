# 02 · Esqueleto del frontend

| Rama | Estado | Responsable(s) | Inicio | Cierre | PR |
|---|---|---|---|---|---|
| `base/02-frontend-nextjs` | 🚧 en curso | @FacuAmaya | 2026-11-04 | — | #— |

## Objetivo

Dejar una app Next.js lista para construir pantallas: estilos con tokens, componentes accesibles, modo oscuro, textos en español centralizados, conexión tipada con la API y tests (de componentes y en navegador real). Todavía no hay pantallas de negocio: solo un inicio provisorio que verifica la conexión con el backend.

## Historias cubiertas

No cubre historias de usuario: es una tarea de fundaciones (Fase 0).

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| **pnpm** como gestor de paquetes (vía corepack) | Más rápido; no deja usar dependencias no declaradas; bloquea scripts de instalación por defecto | npm |
| **Next.js 16** (App Router, Turbopack) | Versión actual; rutas por carpetas, Server Components, base para la PWA | Vite + React (sin SSR ni rutas) |
| **Solo español**, con textos en `src/textos/es.ts` | Ningún texto escrito dentro de los componentes: traducir después es agregar un archivo | Textos sueltos en el JSX · librería i18n completa (innecesaria hoy) |
| **Modo oscuro desde el inicio** (claro / oscuro / sistema) | Hacerlo al final obliga a revisar todas las pantallas | Agregarlo más adelante |
| Tema **sin librería**: script en el `<head>` + clase `dark` | Es lo que recomienda la guía oficial de Next 16; evita el "parpadeo" y una dependencia | `next-themes` |
| **Inter** como tipografía provisoria, con `next/font` | Neutra y legible en el celular; se sirve desde nuestro dominio (sin pedidos a Google) | Geist (la que trae el template) |
| **shadcn/ui** (estilo `base-nova`, color neutro) | Componentes accesibles cuyo código queda en el repo y se adapta al look & feel futuro | Librería cerrada (MUI, Chakra) |
| Cliente de API generado con **openapi-typescript + openapi-fetch** | Los tipos salen del backend: si cambia la API, el front no compila (ADR 0002) | Tipos escritos a mano · axios |
| **TanStack Query** para datos del servidor | Maneja solo carga, error, reintentos y caché | `useEffect` + `useState` a mano |
| Archivos en **kebab-case** (`boton-tema.tsx`), componentes en PascalCase (`BotonTema`) | Es la convención de shadcn y de Next; evita problemas de mayúsculas entre macOS y Linux | Archivos en PascalCase |
| Vitest + Testing Library + **Playwright en 360px y 1280px** | Cada e2e corre en celular y en escritorio | Probar solo en escritorio |

Detalle en [ADR 0006](../adr/0006-frontend-base.md).

## Diseño

```
frontend/
  package.json              scripts: dev, build, lint, typecheck, format, test, test:e2e, api:generate
  pnpm-workspace.yaml       permite los scripts de instalación de sharp y unrs-resolver
  components.json           configuración de shadcn/ui
  .prettierrc.json          Prettier + orden automático de clases de Tailwind
  eslint.config.mjs         reglas de Next + Prettier
  vitest.config.mts · vitest.setup.ts
  playwright.config.ts      proyectos "celular" (360px) y "escritorio" (1280px)
  .env.example              NEXT_PUBLIC_API_URL
  AGENTS.md                 reglas que mantiene Next.js (no editar a mano)
  e2e/inicio.spec.ts
  src/
    app/layout.tsx          html lang="es", Inter, script de tema, Encabezado, <main> con safe areas
    app/page.tsx            inicio provisorio
    app/providers.tsx       QueryClientProvider (1 reintento por defecto)
    app/globals.css         tokens del tema (claro y oscuro) + prefers-reduced-motion
    components/ui/          shadcn (button)
    components/layout/encabezado.tsx
    components/tema/boton-tema.tsx
    features/sistema/       useEstadoApi() + <EstadoApi />
    lib/api/                client.ts (openapi-fetch) · schema.d.ts (generado)
    lib/tema.ts             leer/guardar/aplicar tema + script del <head>
    textos/es.ts            todos los textos de la interfaz
```

### Pantallas y estados
| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Inicio | — | "Verificando conexión…" (punto que late) | "No se pudo conectar" + botón Reintentar | 1 columna / 2 columnas |

## Hecho

- [x] Proyecto Next.js 16 con TypeScript estricto, Tailwind 4 y ESLint.
- [x] shadcn/ui inicializado con tokens claro/oscuro.
- [x] Modo oscuro sin parpadeo; se recuerda la preferencia y sigue al sistema en vivo.
- [x] Inter con `next/font`; `lang="es"`; viewport con safe areas de iOS y `theme-color`.
- [x] Textos centralizados en `src/textos/es.ts`.
- [x] Cliente tipado de la API generado desde el OpenAPI del backend.
- [x] Indicador de estado del servidor con estados de carga, éxito y error.
- [x] 8 tests de componentes (Vitest) y 6 e2e (Playwright: 3 tests × celular y escritorio).
- [x] Build de producción: la página de inicio se pre-renderiza estática.
- [x] Lint, tipos y formato sin errores.

## Falta / deuda técnica / ideas para después

- [ ] Correr el frontend dentro de docker compose y sumar los checks a GitHub Actions → rama 03.
- [ ] Proxy de Next (`/api/*` → backend) para que las cookies de sesión sean del mismo sitio → se decide en la rama 04 (ADR 0003).
- [ ] react-hook-form + zod → se instalan con el primer formulario (rama 04).
- [ ] Navegación inferior (mobile) / lateral (desktop) → cuando existan las secciones del viaje (rama 06).
- [ ] Look & feel definitivo → rama `diseno/estilo-visual-v1`, cuando esté la investigación de `docs/ux/`.
- [ ] Manifest e íconos de la PWA → rama 19.

## Cómo probarlo

```bash
# backend (otra terminal): docker compose up -d db && cd backend && uv run uvicorn app.main:app --reload
cd frontend
cp .env.example .env.local
pnpm install
pnpm dev                    # http://localhost:3000
pnpm test                   # tests de componentes
pnpm exec playwright install chromium   # una sola vez
pnpm test:e2e               # navegador real, celular y escritorio
pnpm lint && pnpm typecheck && pnpm format:check
```

> ⚠️ **Puertos ocupados en la máquina de FacuAmaya:** hay otro proyecto en Docker (`repo-api-1`) usando los puertos 3000 y 8000. En ese caso:
> `pnpm dev --port 3100`, backend con `--host 127.0.0.1` y `CORS_ORIGINS=http://localhost:3100`, y en `.env.local` `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`. Para los e2e: `PORT=3100 pnpm test:e2e`.

Flujo manual:
1. Con el backend levantado, el inicio muestra "Servidor conectado".
2. Apagá el backend → a los segundos aparece "No se pudo conectar" con el botón Reintentar.
3. El botón de arriba a la derecha rota claro → oscuro → sistema; al recargar se mantiene sin parpadear.
4. Achicá la ventana a 360px: no aparece scroll horizontal.
