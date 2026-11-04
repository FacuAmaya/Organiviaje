# UX — Organiviaje

Resultado **consolidado** de la experiencia de usuario. Lo exploratorio (referencias, moodboards, bocetos) vive en [docs/ux/](docs/ux/); acá solo entra lo decidido.

> **Estado del look & feel:** 🎨 *provisorio.* Se usa un tema neutro basado en tokens hasta que la investigación de [docs/ux/](docs/ux/README.md) se consolide en [04-design-system.md](docs/ux/04-design-system.md).

## 1. Principios

1. **Mobile-first, sin perder calidad en ningún device.** Se diseña para 360px y se escala a tablet y desktop. Se usa en la calle, durante el viaje, con una mano.
2. **Lo importante, primero.** Al abrir la app durante el viaje: qué tengo hoy, a dónde voy, cuánto debo.
3. **Proponer no es decidir.** Siempre se distingue visualmente propuesta abierta / en votación / decidida.
4. **El grupo es visible.** Se ve quién propuso, quién votó, quién pagó y quién falta.
5. **Nunca una pantalla muda.** Toda vista tiene estados vacío (con acción sugerida), carga (skeleton) y error (con reintento).
6. **Privacidad explícita.** Compartir ubicación es opt-in, siempre visible cuando está activo y fácil de apagar.
7. **Accesible por defecto.** Contraste AA, navegación por teclado, labels en todos los inputs, touch targets ≥ 44px.

## 2. Navegación

```
Mis viajes
└── Viaje
    ├── Hoy            agenda del día y próxima actividad (durante el viaje)
    ├── Ideas          propuestas por tipo, comentarios
    ├── Votaciones     encuestas abiertas y decisiones
    ├── Itinerario     días y actividades
    ├── Mapa           todo lo ubicable + posiciones en vivo
    ├── Gastos         gastos, balances, liquidaciones
    └── Grupo          integrantes, invitaciones, presupuesto
```

- **Mobile:** barra inferior con las 4–5 secciones principales + menú "Más".
- **Desktop:** barra lateral; el mapa puede convivir al costado del itinerario/ideas.

## 3. Flujos principales

| Flujo | Caso de uso | Pantallas |
|---|---|---|
| Crear viaje e invitar | — | Mis viajes → Nuevo viaje → Compartir enlace |
| Aceptar invitación | — | Enlace → Registro/Login → Confirmar participación |
| Proponer y decidir | CU1 | Ideas → Nueva propuesta → Seleccionar → Iniciar votación → Votar → Resultado → Confirmar |
| Registrar y dividir gasto | CU2 | Gastos → Nuevo gasto → Quién pagó → Entre quiénes → Cómo dividir → Balances |
| Compartir ubicación | CU3 | Mapa → Activar ubicación → Ver al grupo en vivo |
| Armar itinerario | CU4 | Decisión → Convertir en actividad → Día / hora / lugar |

Se detalla cada flujo (wireframe + estados) al cerrar la feature correspondiente.

## 4. Design system

Fuente de verdad: [docs/ux/04-design-system.md](docs/ux/04-design-system.md). Implementación: CSS variables del tema + componentes shadcn/ui.

| Token | Valor provisorio |
|---|---|
| Colores | Neutros de shadcn (`--background`, `--foreground`, `--primary`, `--muted`, `--destructive`…) |
| Estados de propuesta | `--estado-abierta`, `--estado-votacion`, `--estado-decidida` (por definir) |
| Categorías de mapa | `--cat-alojamiento`, `--cat-actividad`, `--cat-transporte`, `--cat-restaurante` (por definir) |
| Tipografía | Sistema / Inter (provisorio) |
| Radio | `0.5rem` |
| Modo oscuro | Soportado desde el inicio vía tokens |

## 5. Responsive y PWA

- Breakpoints: `sm 640` · `md 768` · `lg 1024` · `xl 1280`.
- Safe areas de iOS (`env(safe-area-inset-*)`) en barra inferior y modales.
- Imágenes con `next/image`; íconos SVG.
- Instalable como PWA (`display: standalone`), con ícono y splash propios.
- Verificación: Lighthouse ≥ 90 en performance, accesibilidad y PWA; pruebas en Android e iPhone reales.

## 6. Historial de cambios de UX

| Fecha | Cambio | Origen |
|---|---|---|
| 2026-11-04 | Principios, navegación y flujos iniciales | Plan de desarrollo |
