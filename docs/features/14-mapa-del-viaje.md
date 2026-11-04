# 14 · Mapa del viaje

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/14-mapa-del-viaje` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Ver en un único mapa todo lo ubicable del viaje (propuestas y actividades), distinguir categorías y estados, y que mapa e itinerario estén sincronizados.

## Depende de

- 05 · experimento de tiempo real (componente de mapa)
- 08 · proponer ideas
- 13 · armar itinerario

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US029 | Como integrante quiero asociar una ubicación a una propuesta para verla en el mapa | B 5 · E 3 | • Busco por nombre o dirección y elijo un resultado; se guardan nombre, dirección y coordenadas. |
| US091 | Como integrante quiero ver en un único mapa todas las ubicaciones relacionadas con el viaje para entender la geografía | B 8 · E 5 | • El mapa encuadra todos los puntos al abrir. |
| US092 | Como integrante quiero distinguir visualmente actividades, alojamientos, transportes y restaurantes para leer el mapa rápido | B 5 · E 2 | • Pines con ícono **y** color por categoría (tokens `--cat-*`) + leyenda. |
| US093 | Como integrante quiero distinguir propuestas de lugares ya confirmados para saber qué es seguro | B 5 · E 2 | • Confirmados con pin relleno; propuestas con pin con borde. |
| US097 | Como integrante quiero tocar un lugar del mapa y acceder a su propuesta o actividad para ver el detalle | B 5 · E 3 | • Tocar un pin abre una tarjeta inferior con resumen y enlace al detalle. |
| US043 | Como integrante quiero comparar opciones sobre el mapa para elegir la mejor ubicada | B 5 · E 5 | • Desde una votación, "Ver en el mapa" muestra solo sus opciones. |
| US066 | Como integrante quiero ubicar cada alojamiento en el mapa junto a las actividades propuestas para ver qué queda cerca | B 5 · E 5 | • Filtro rápido: alojamientos + actividades. |
| US101 | Como integrante quiero comparar geográficamente varias opciones de alojamiento para elegir | B 3 · E 3 | • Mismo mecanismo que US043 para alojamientos. |
| US099 | Como integrante quiero ver las actividades de un día conectadas en orden para entender el recorrido | B 5 · E 3 | • Al elegir un día, una línea une sus actividades en orden con números. |
| US109 | Como integrante quiero que el itinerario y el mapa estén sincronizados para no perderme | B 5 · E 8 | • En desktop se ven lado a lado: tocar una actividad la resalta en el mapa y viceversa.<br>• Si cambia el itinerario, el mapa se actualiza sin recargar la página. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Filtros por día/categoría/estado completos y crear propuesta tocando el mapa (R2).
- Distancias y tiempos de traslado (R2).
- Posiciones en vivo (rama 15).

## Diseño propuesto

### Modelo y migraciones

- `ubicaciones`: `nombre`, `direccion`, `latitud`, `longitud` (`NUMERIC(9,6)`). → **Ubicacion** (`distanciaA()`, `esCercanaA()` en `domain.py` con fórmula de Haversine + tests).
- Se completa `propuestas.ubicacion_id` y `actividades_planificadas.ubicacion_id`.

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| GET | `/geocodificar?q=` | autenticado | Proxy a Nominatim con caché y *rate limit* (respeta su política de uso). |
| GET | `/viajes/{id}/mapa?filtro=&encuesta_id=` | `require_member` | Puntos (GeoJSON) de propuestas y actividades con categoría y estado. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Mapa | "Todavía no hay lugares ubicados" | Mapa con skeleton de pines | Mapa base + aviso | Pantalla completa (mobile) / lado a lado con itinerario (desktop) |
| Buscador de ubicación | "Sin resultados" | Spinner | "No pudimos buscar, probá de nuevo" | Campo con lista de resultados |

### Notas

**Accesibilidad:** el mapa tiene alternativa en lista (no todo el mundo puede usar un mapa).

## Preguntas abiertas para el debate

- [ ] ¿Proveedor de tiles para producción (ver conclusión del experimento 05)?
- [ ] ¿Geocodificación con Nominatim alcanza o necesitamos un proveedor con más cuota?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US029
- [ ] US091
- [ ] US092
- [ ] US093
- [ ] US097
- [ ] US043
- [ ] US066
- [ ] US101
- [ ] US099
- [ ] US109
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k ubicaciones
pnpm test:e2e -g mapa
```

Flujo manual:
1. Ubicar 3 propuestas de tipos distintos y verlas con colores distintos.
2. Elegir un día del itinerario y ver la línea del recorrido.
