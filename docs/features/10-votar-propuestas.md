# 10 · Votar propuestas

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/10-votar-propuestas` | ⏳ pendiente | — *(asignarse en el issue)* | [#12](https://github.com/FacuAmaya/Organiviaje/issues/12) | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que el grupo compare varias propuestas y vote para llegar a un acuerdo (CU1 · *Proponiendo y decidiendo en grupo*).

## Depende de

- 08 · proponer ideas

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US041 | Como integrante quiero seleccionar varias propuestas para compararlas o someterlas a votación | B 5 · E 3 | • En la lista de ideas puedo activar "seleccionar" y marcar varias del mismo tipo. |
| US044 | Como integrante quiero iniciar una votación a partir de varias propuestas para que el grupo elija | B 8 · E 3 | • Necesito **2 o más** propuestas abiertas (excepción del CU1: con una sola no se vota).<br>• Indico pregunta y fecha de cierre (opcional).<br>• Las propuestas pasan a **en votación**. |
| US047 | Como integrante quiero elegir una opción en una encuesta para expresar mi preferencia | B 8 · E 2 | • Un voto por integrante; mientras esté abierta puedo cambiarlo (se guarda el último). |
| US015 | Como integrante quiero votar los destinos propuestos para definir a dónde vamos | B 8 · E 3 | • Es el mismo flujo aplicado a propuestas de tipo destino. |
| US053 | Como integrante quiero ver el resultado de una votación para saber qué eligió el grupo | B 8 · E 2 | • Veo cantidad de votos por opción y cuántos integrantes votaron sobre el total.<br>• Si hay empate, se indica claramente. |
| US054 | Como organizador quiero cerrar una votación manualmente cuando el grupo ya llegó a un acuerdo para no esperar la fecha límite | B 5 · E 1 | • El organizador (o quien la creó) puede cerrarla; al llegar la fecha de cierre se cierra sola. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Confirmar la ganadora como decisión (rama 11).
- Fecha límite con recordatorios, quién falta votar, reglas de desempate avanzadas (R2).
- Voto múltiple, ranking, puntaje (R3).

## Diseño propuesto

### Modelo y migraciones

- `encuestas`: `viaje_id`, `creada_por`, `pregunta`, `fecha_cierre` (nullable), `criterio` (`mayoria_simple` en R1), `estado` (`abierta` / `cerrada`), `cerrada_en`. → **Encuesta**.
- `opciones_encuesta`: `encuesta_id`, `propuesta_id`, `orden`. Mínimo 2 por encuesta. → **OpcionEncuesta**.
- `votos`: `encuesta_id`, `opcion_id`, `miembro_id`. Único (`encuesta_id`, `miembro_id`). → **Voto**.
- `domain.py`: `calcular_resultado(votos) -> Resultado` con ganadora o lista de empatadas (tests unitarios con casos de empate, sin votos, un solo votante).

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| POST | `/viajes/{id}/encuestas` | `require_member` | Crea desde ≥ 2 propuestas abiertas. |
| GET | `/viajes/{id}/encuestas?estado=` | `require_member` | Lista. |
| GET | `/viajes/{id}/encuestas/{eid}` | `require_member` | Detalle + resultado parcial + mi voto. |
| PUT | `/viajes/{id}/encuestas/{eid}/mi-voto` | `require_member` | Vota o cambia el voto (409 si está cerrada). |
| POST | `/viajes/{id}/encuestas/{eid}/cerrar` | organizador o creador | Cierra y fija el resultado. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Votaciones | "No hay votaciones abiertas" | Skeleton | Error + reintentar | Lista |
| Votar | — | Optimista | Revierte + aviso | Tarjetas grandes tocables con costo por persona |
| Resultado | — | — | — | Barras horizontales (accesibles, con números) |

### Notas

**Cierre por fecha:** se evalúa al leer (si `fecha_cierre` pasó, se cierra en ese momento); no hace falta un *cron* en R1.

## Preguntas abiertas para el debate

- [ ] **Regla de desempate (CU1 «extend»):** ¿el organizador elige entre las empatadas (propuesta) o gana la propuesta más antigua?
- [ ] ¿Los votos son públicos (se ve quién votó qué) o solo totales?
- [ ] ¿Pueden votar los integrantes "tentativos"?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US041
- [ ] US044
- [ ] US047
- [ ] US015
- [ ] US053
- [ ] US054
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k encuestas
pnpm test:e2e -g votación
```

Flujo manual:
1. Dos usuarios votan opciones distintas → empate visible.
2. Intentar iniciar una votación con una sola propuesta → no se permite.
