# 11 · Confirmar decisiones

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/11-confirmar-decisiones` | ⏳ pendiente | — *(asignarse en el issue)* | [#13](https://github.com/FacuAmaya/Organiviaje/issues/13) | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que el organizador convierta una opción (ganadora de una votación o elegida directamente) en una **Decisión** registrada, y que todos distingan claramente lo propuesto de lo decidido.

## Depende de

- 10 · votar propuestas

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US056 | Como organizador quiero confirmar una opción ganadora como decisión para cerrar el tema | B 8 · E 2 | • Desde una encuesta cerrada confirmo la ganadora (o una de las empatadas).<br>• La propuesta pasa a **decidida** y las demás de la encuesta a **descartada**. |
| US016 | Como organizador quiero declarar un destino como decidido para que el grupo avance | B 8 · E 2 | • Puedo confirmar una propuesta de destino directamente, sin votación (con una observación opcional). |
| US021 | Como organizador quiero fijar las fechas elegidas para que todos las tengan claras | B 5 · E 1 | • Al decidir un rango de fechas, el viaje toma esas fechas de inicio y fin (y se generan los días del itinerario, rama 13). |
| US068 | Como organizador quiero confirmar el alojamiento elegido para pasar a reservarlo | B 5 · E 2 | • Mismo flujo para propuestas de alojamiento. |
| US057 | Como integrante quiero distinguir claramente propuestas abiertas de decisiones ya tomadas para no confundirme | B 5 · E 2 | • Chips de estado con color **y** texto (no solo color, por accesibilidad).<br>• Las decisiones se ven en una sección propia del viaje. |
| US061 | Como integrante quiero ver todas las decisiones pendientes para saber qué falta definir | B 5 · E 2 | • Lista de temas sin decisión: destino, fechas, alojamiento (si aún no hay decisión de ese tipo) + votaciones abiertas o cerradas sin confirmar. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Reabrir una decisión manteniendo historial (R2, US060).
- Historial y alternativas descartadas (R3).

## Diseño propuesto

### Modelo y migraciones

- `decisiones`: `viaje_id`, `asunto` (`destino` · `fechas` · `alojamiento` · `transporte` · `actividad` · `otro`), `propuesta_id`, `encuesta_id` (nullable), `confirmada_por`, `fecha_tomada`, `observacion`, `estado` (`vigente` / `anulada`). → **Decision** (proceso separado del resultado: así se puede reabrir sin perder historial).
- Regla: una sola decisión **vigente** por asunto único (destino, fechas).

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| POST | `/viajes/{id}/decisiones` | `require_organizer` | Confirma una propuesta (desde encuesta o directa). |
| GET | `/viajes/{id}/decisiones` | `require_member` | Decisiones vigentes. |
| GET | `/viajes/{id}/pendientes` | `require_member` | Qué falta decidir (US061). |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Viaje → Resumen | "Todavía no hay decisiones" | Skeleton | Error + reintentar | Tarjetas: destino · fechas · alojamiento |
| Pendientes | "¡Todo decidido!" | Skeleton | Error + reintentar | Checklist |
| Confirmar decisión | — | Spinner | Mensaje del error (p. ej. ya hay un destino decidido) | Diálogo de confirmación |

## Preguntas abiertas para el debate

- [ ] ¿Un integrante común puede confirmar si la votación fue unánime?
- [ ] Si ya hay destino decidido y se confirma otro: ¿error o reemplaza (anula el anterior)?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US056
- [ ] US016
- [ ] US021
- [ ] US068
- [ ] US057
- [ ] US061
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k decisiones
```

Flujo manual:
1. Votar → cerrar → confirmar ganadora → la propuesta aparece como decidida y las otras como descartadas.
2. Decidir fechas → el viaje muestra las fechas.
