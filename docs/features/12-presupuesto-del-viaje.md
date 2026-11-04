# 12 · Presupuesto del viaje

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/12-presupuesto-del-viaje` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que el grupo tenga una referencia de cuánto quiere gastar y vea, antes de votar, cuánto le costaría a cada uno cada alternativa.

## Depende de

- 08 · proponer ideas
- 11 · confirmar decisiones (para el total decidido)

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US141 | Como organizador quiero definir un presupuesto aproximado del viaje para tener una referencia | B 5 · E 1 | • Indico un monto objetivo (total o por persona) en la moneda base. |
| US022 | Como integrante quiero indicar un rango de presupuesto que considero aceptable para que el grupo lo tenga en cuenta | B 5 · E 2 | • Cargo mi máximo personal; en R1 el grupo ve el mínimo y el promedio, no el monto de cada uno. |
| US142 | Como integrante quiero asignar costos estimados a opciones todavía no decididas para estimar el total | B 5 · E 2 | • Usa el `costo_estimado` de las propuestas (rama 08); el resumen suma decididas y, aparte, el rango de las alternativas abiertas. |
| US147 | Como integrante quiero ver el costo por persona de una alternativa antes de votar para decidir con información | B 5 · E 2 | • Alojamiento: precio total ÷ integrantes confirmados; actividad y transporte: costo por persona.<br>• Se muestra en la tarjeta de la propuesta y en la votación. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Presupuesto personal privado y rango compatible del grupo (R2, US023/US024).
- Plan vs. real y alertas de exceso (R2).

## Diseño propuesto

### Modelo y migraciones

- `presupuestos_viaje`: `viaje_id` (único), `monto_objetivo`, `modalidad` (`total` / `por_persona`). → **PresupuestoViaje** (`totalEstimado()`, `disponible()`).
- Usa `miembros_viaje.presupuesto_personal_maximo`.
- `domain.py`: `costo_por_persona(propuesta, confirmados)` con tests (división por cero si no hay confirmados → usar total de integrantes).

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| PUT | `/viajes/{id}/presupuesto` | `require_organizer` | Define o actualiza. |
| GET | `/viajes/{id}/presupuesto/resumen` | `require_member` | Objetivo, estimado decidido, rango de alternativas, mínimo y promedio personal. |
| PATCH | `/viajes/{id}/miembros/yo` | `require_member` | Mi presupuesto máximo (amplía el endpoint de la rama 07). |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Viaje → Presupuesto | "Definí un presupuesto de referencia" | Skeleton | Error + reintentar | Tarjeta con barra objetivo vs. estimado |

## Preguntas abiertas para el debate

- [ ] ¿El presupuesto es total o por persona (o se elige)?
- [ ] ¿Costo por persona se divide por confirmados o por todos los integrantes?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US141
- [ ] US022
- [ ] US142
- [ ] US147
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k presupuesto
```

Flujo manual:
1. Definir objetivo, cargar propuestas con costos y ver el costo por persona en la votación.
