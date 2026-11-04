# 13 · Armar el itinerario

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/13-armar-itinerario` | ⏳ pendiente | — *(asignarse en el issue)* | [#15](https://github.com/FacuAmaya/Organiviaje/issues/15) | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que el organizador convierta decisiones en actividades con día, hora y lugar, y que todos vean el plan del viaje día por día (CU4 · *Armando el itinerario*).

## Depende de

- 11 · confirmar decisiones (fechas decididas → días)

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US075 | Como organizador quiero convertir una propuesta aprobada en una actividad del itinerario para no cargarla dos veces | B 8 · E 3 | • Desde una decisión, "Agregar al itinerario" crea la actividad con título, notas y ubicación de la propuesta. |
| US077 | Como organizador quiero asignar una actividad a un día para ordenar el viaje | B 8 · E 2 | • Los días se generan a partir de las fechas decididas del viaje.<br>• Una actividad puede quedar "sin día" hasta asignarla. |
| US078 | Como organizador quiero asignar horario y duración a una actividad para saber cuánto tiempo ocupa | B 5 · E 2 | • Hora de inicio opcional y duración en minutos; muestra la hora de fin calculada. |
| US079 | Como organizador quiero reordenar actividades para ajustar el plan | B 3 · E 3 | • Arrastrar y soltar dentro del día (y con botones subir/bajar, accesible por teclado). |
| US090 | Como integrante quiero visualizar una agenda resumida del día para saber qué hacemos | B 5 · E 2 | • Vista de un día con sus actividades en orden y horarios. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Participantes por actividad, superposición horaria, tiempo de traslado, mover entre días (R2).
- Mapa del día (rama 14).

## Diseño propuesto

### Modelo y migraciones

- `itinerarios` (1 por viaje), `dias_viaje` (`fecha`, `notas`; único por itinerario + fecha), `actividades_planificadas` (`dia_id` nullable, `titulo`, `hora_inicio`, `duracion_minutos`, `notas`, `orden`, `decision_id` nullable, `ubicacion_id`, `estado` `programada` / `cancelada`). → **Itinerario**, **DiaViaje**, **ActividadPlanificada**.
- Si cambian las fechas del viaje: se crean los días nuevos; los días que quedan afuera conservan sus actividades como "sin día" (nunca se borran).

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| GET | `/viajes/{id}/itinerario` | `require_member` | Días con actividades. |
| POST | `/viajes/{id}/actividades` | `require_organizer` | Crea (opcional `decision_id`). |
| PATCH | `/viajes/{id}/actividades/{aid}` | `require_organizer` | Día, hora, duración, notas. |
| PUT | `/viajes/{id}/dias/{did}/orden` | `require_organizer` | Nuevo orden (lista de ids). |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Itinerario | "Primero decidan las fechas" / "Agregá la primera actividad" | Skeleton | Error + reintentar | Días como acordeón (mobile) / columnas (desktop) |
| Día | "Día libre" | Skeleton | Error + reintentar | Línea de tiempo |

## Preguntas abiertas para el debate

- [ ] ¿Integrantes comunes pueden agregar actividades o solo el organizador?
- [ ] ¿Mostramos ya la advertencia de superposición horaria (excepción del CU4) aunque la historia sea R2?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US075
- [ ] US077
- [ ] US078
- [ ] US079
- [ ] US090
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k itinerario
pnpm test:e2e -g itinerario
```

Flujo manual:
1. Decidir fechas → aparecen los días → convertir una decisión en actividad → reordenar.
