# 19 · Instalar en el celular (PWA)

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/19-instalar-en-celular` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que la app se pueda instalar en el celular desde el navegador, con ícono propio, que se abra a pantalla completa como una app nativa y que cargue rápido aunque la señal sea mala.

## Depende de

- 02 · frontend
- diseño visual (para el ícono; si no está, ícono provisorio)

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

Es un requisito del resultado final del proyecto. Criterios:

- En Android (Chrome) aparece la opción "Instalar app" y la app se abre sin barra del navegador.
- En iPhone (Safari) funciona "Compartir → Agregar a inicio" y se ve con ícono y nombre correctos.
- Sin conexión, se muestra una pantalla "Sin conexión" propia (no el dinosaurio del navegador).
- Lighthouse ≥ 90 en Performance, Accesibilidad y Buenas prácticas, y la PWA es instalable.

## Fuera de alcance

- Gastos offline con sincronización (R3, US127).
- Notificaciones push (R2).

## Diseño propuesto

### Modelo y migraciones

Sin cambios de base de datos.

### Infraestructura

- `app/manifest.ts` (nombre, colores, `display: standalone`, íconos 192/512 y *maskable*).
- Service worker con **Serwist**: cachea el *shell* y los assets estáticos; página `/sin-conexion`.
- Íconos de Apple (`apple-touch-icon`) y *splash screens*.
- Banner "Instalá la app" (Android usa `beforeinstallprompt`; iOS muestra instrucciones).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Banner de instalación | — | — | — | Solo mobile, descartable |
| `/sin-conexion` | — | — | — | Mensaje + reintentar |

## Preguntas abiertas para el debate

- [ ] ¿Tenemos ícono definitivo (depende de `docs/ux/`) o salimos con uno provisorio?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
pnpm build && pnpm start
# Lighthouse en Chrome DevTools
```

Flujo manual:
1. Instalar en un Android y en un iPhone reales.
2. Poner modo avión y abrir la app → pantalla "Sin conexión".
