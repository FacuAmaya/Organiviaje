# 08 · Proponer ideas

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/08-proponer-ideas` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que cualquier integrante cargue ideas para el viaje (destinos, fechas, alojamientos, actividades, transportes, restaurantes) con enlace, datos y costo estimado, sin tener que decidirlas en el momento. *Proponer no es decidir.*

## Depende de

- 06 · crear y ver viajes

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US025 | Como integrante quiero crear una propuesta para compartir una idea con el grupo | B 8 · E 2 | • Creo una propuesta con título (obligatorio) y tipo; queda en estado **abierta** y visible para todo el grupo. |
| US026 | Como integrante quiero clasificar una propuesta como alojamiento, actividad, restaurante, transporte u otro tipo para encontrarla y compararla fácil | B 5 · E 2 | • Elijo el tipo al crearla; el formulario muestra los campos de ese tipo.<br>• Puedo filtrar la lista por tipo. |
| US027 | Como integrante quiero pegar un enlace externo en una propuesta para que el grupo vea la fuente | B 5 · E 1 | • Acepto solo URLs `http(s)` válidas; se abren en pestaña nueva con `rel="noopener"`. |
| US028 | Como integrante quiero registrar manualmente nombre, descripción y datos relevantes de una opción para no depender de un enlace | B 5 · E 2 | • Todos los campos salvo título y tipo son opcionales. |
| US030 | Como integrante quiero indicar un costo estimado para que el grupo compare precios | B 5 · E 1 | • Monto ≥ 0 en la moneda base del viaje, con 2 decimales. |
| US035 | Como integrante quiero guardar una idea sin decidirla inmediatamente para no perderla | B 3 · E 1 | • Una propuesta abierta no requiere votación ni decisión; puede quedar así indefinidamente. |
| US039 | Como integrante quiero editar una propuesta que creé para corregir datos | B 3 · E 1 | • Solo quien la creó puede editarla (o retirarla).<br>• No se puede editar mientras esté en una votación abierta. |
| US013 | Como integrante quiero proponer destinos para empezar a definir a dónde vamos | B 8 · E 2 | • Tipo **destino** con nombre del destino. |
| US020 | Como integrante quiero proponer rangos de fechas para acordar cuándo viajar | B 5 · E 2 | • Tipo **rango de fechas** con desde/hasta (desde ≤ hasta); muestra la cantidad de días. |
| US063 | Como integrante quiero proponer un alojamiento mediante su enlace para compartir opciones de Airbnb/Booking | B 5 · E 1 | • Tipo **alojamiento** con enlace. |
| US064 | Como integrante quiero registrar precio total, noches y capacidad de un alojamiento para compararlos | B 5 · E 2 | • Precio total ≥ 0, noches ≥ 1, capacidad ≥ 1. |
| US071 | Como integrante quiero proponer una opción de transporte mediante un enlace para compartir pasajes | B 3 · E 1 | • Tipo **transporte** con enlace. |
| US072 | Como integrante quiero registrar manualmente origen, destino, fecha, horario y precio de un transporte para tenerlo a mano | B 3 · E 2 | • Salida < llegada; precio por persona ≥ 0. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Ubicación en el mapa (rama 14, US029).
- Comentarios (rama 09).
- Votar (rama 10).
- Imágenes, ventajas/desventajas, favoritos (R3).

## Diseño propuesto

### Modelo y migraciones

- `propuestas` (**herencia en una sola tabla**, discriminador `tipo`): comunes `viaje_id`, `creada_por` (miembro), `tipo` (`destino` · `rango_fechas` · `alojamiento` · `actividad` · `transporte` · `restaurante` · `otro`), `titulo`, `descripcion`, `enlace`, `costo_estimado`, `estado` (`abierta` · `en_votacion` · `decidida` · `descartada` · `retirada`), `ubicacion_id` (rama 14).
  Por tipo (columnas nulas si no aplican): destino → `nombre_destino`; rango → `desde`, `hasta`; alojamiento → `precio_total`, `cantidad_noches`, `capacidad`; actividad → `categoria`, `duracion_minutos`, `costo_por_persona`; transporte → `origen`, `destino`, `salida`, `llegada`, `precio_por_persona`.
- *Check constraints* por tipo en la base + **unión discriminada** de Pydantic (`Field(discriminator="tipo")`). → jerarquía **Propuesta** del UML.

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| POST | `/viajes/{id}/propuestas` | `require_member` | Crea (cuerpo según `tipo`). |
| GET | `/viajes/{id}/propuestas?tipo=&estado=` | `require_member` | Lista filtrable. |
| GET | `/viajes/{id}/propuestas/{pid}` | `require_member` | Detalle. |
| PATCH | `/viajes/{id}/propuestas/{pid}` | creador | Edita (409 si está en votación). |
| POST | `/viajes/{id}/propuestas/{pid}/retirar` | creador | Pasa a `retirada`. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Ideas | "Todavía no hay ideas" + proponer | Skeleton | Error + reintentar | Lista con chips de tipo / grilla |
| Nueva / editar propuesta | — | Spinner | Errores por campo | Formulario por pasos: tipo → datos |
| Detalle | — | Skeleton | 404 amable | Página completa / panel lateral |

### Notas

Cada tarjeta muestra el **chip de estado** (abierta / en votación / decidida) con los tokens `--estado-*` de `docs/ux/04-design-system.md`.

## Preguntas abiertas para el debate

- [ ] ¿El tipo "restaurante" es una actividad con categoría o un tipo propio?
- [ ] ¿El organizador puede editar/retirar propuestas de otros?
- [ ] ¿Mostramos vista previa del enlace (título/imagen del sitio)? Requiere que el backend lea la página: R2.

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US025
- [ ] US026
- [ ] US027
- [ ] US028
- [ ] US030
- [ ] US035
- [ ] US039
- [ ] US013
- [ ] US020
- [ ] US063
- [ ] US064
- [ ] US071
- [ ] US072
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k propuestas
pnpm test:e2e -g ideas
```

Flujo manual:
1. Crear una propuesta de cada tipo y filtrarlas.
2. Intentar editar una propuesta de otro integrante → no aparece la opción.
