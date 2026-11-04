# 18 · Agenda de hoy

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/18-agenda-de-hoy` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Durante el viaje, al abrir la app ver inmediatamente qué hay hoy y cuál es la próxima actividad, dónde queda y cómo llegar. Es la pantalla que más se va a usar en la calle.

## Depende de

- 13 · armar itinerario
- 14 · mapa del viaje

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US167 | Como integrante quiero abrir la aplicación y ver inmediatamente qué tengo hoy para no buscar | B 8 · E 3 | • Si el viaje está en curso (hoy entre inicio y fin, en la zona horaria del viaje), la pantalla de inicio del viaje es **Hoy**.<br>• Fuera de esas fechas muestra la cuenta regresiva o el resumen. |
| US168 | Como integrante quiero ver cuál es la próxima actividad, dónde queda y cómo llegar para moverme sin perder tiempo | B 8 · E 5 | • Tarjeta destacada con la próxima actividad, hora y mini mapa.<br>• Botón "Cómo llegar" que abre Google Maps o Apple Maps con el destino. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Resolver cambios de último momento, votación rápida, gasto rápido desde la actividad (R2).

## Diseño propuesto

### Modelo y migraciones

Sin tablas nuevas. Usa `viajes.zona_horaria` (rama 06).

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| GET | `/viajes/{id}/hoy` | `require_member` | Día actual en la zona del viaje, actividades y próxima actividad. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Hoy | "Día libre 🎉" | Skeleton | Error + reintentar | Pensada para una mano: tarjeta grande arriba, lista abajo |

## Preguntas abiertas para el debate

- [ ] ¿"Cómo llegar" abre siempre Google Maps o detecta iOS para Apple Maps?
- [ ] ¿Fuera del viaje, qué muestra la pantalla Hoy?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US167
- [ ] US168
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k hoy
pnpm test:e2e -g hoy   # con fecha simulada
```

Flujo manual:
1. Simular una fecha dentro del viaje y ver la próxima actividad con el botón de navegación.
