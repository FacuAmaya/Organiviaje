# 15 · Ubicación en tiempo real

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/15-ubicacion-en-tiempo-real` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que cada integrante que quiera comparta su ubicación y que el grupo la vea moverse en el mapa sin recargar (CU3 · *Compartiendo ubicación en tiempo real*). Es opcional por privacidad.

## Depende de

- 05 · experimento de tiempo real
- 14 · mapa del viaje

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US183 | Como integrante quiero activar o desactivar compartir mi ubicación en tiempo real para coordinarme con el grupo cuando yo quiera | B 5 · E 5 | • Está **desactivado por defecto**; al activarlo el navegador pide permiso.<br>• Mientras está activo hay un indicador siempre visible y un botón para apagarlo.<br>• Al desactivarlo, mi posición desaparece del mapa de los demás al instante.<br>• Si niego el permiso o no hay señal (excepciones del CU3), veo qué pasó y cómo solucionarlo. |
| US184 | Como integrante quiero ver en el mapa la posición de quienes comparten ubicación, actualizada sin recargar, para encontrarnos | B 8 · E 8 | • Veo un marcador con el avatar/inicial de cada integrante que comparte.<br>• Se actualiza en vivo (objetivo < 2 s).<br>• Posiciones viejas (más de 10 min) se ocultan o se ven atenuadas. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Ver cuándo fue recibida la última ubicación (R2, US185).
- Seguimiento en segundo plano: una web en iOS no puede enviar la ubicación con la app cerrada (limitación de la plataforma).

## Diseño propuesto

### Modelo y migraciones

- `posiciones_compartidas`: `miembro_id` (único: **solo se guarda la última posición, sin historial**, por privacidad), `latitud`, `longitud`, `precision_m`, `recibida_en`. → **PosicionCompartida** (`estaVigente()`).
- Usa `miembros_viaje.compartiendo_ubicacion`.

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| PATCH | `/viajes/{id}/miembros/yo` | `require_member` | Activa/desactiva `compartiendo_ubicacion` (al desactivar borra la posición). |
| GET | `/viajes/{id}/posiciones` | `require_member` | Posiciones vigentes (carga inicial). |
| WS | `/ws/viajes/{id}` | `require_member` | Recibe `posicion.actualizada` / `posicion.eliminada`; envía `posicion.reportar`. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Mapa (capa en vivo) | "Nadie está compartiendo" | "Conectando…" | "Sin conexión, reintentando" / "Permiso denegado" | Botón flotante para activar; indicador fijo mientras comparto |

### Notas

**Eventos en tiempo real:** el cliente usa `watchPosition` y envía como máximo cada 5 s o cuando se movió más de 20 m. El servidor valida membresía y que `compartiendo_ubicacion` esté activo antes de publicar en Redis.

## Preguntas abiertas para el debate

- [ ] ¿Frecuencia de envío (balance precisión / batería)?
- [ ] ¿Se apaga solo después de X horas para que nadie quede compartiendo sin querer?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US183
- [ ] US184
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k posiciones
pnpm test:e2e -g ubicación   # con geolocalización simulada
```

Flujo manual:
1. Dos navegadores con geolocalización simulada en distintos puntos: cada uno ve al otro moverse.
2. Desactivar → desaparece al instante del otro lado.
