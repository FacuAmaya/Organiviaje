# 06 · Crear y ver viajes

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/06-crear-y-ver-viajes` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que un usuario cree un viaje (y quede como organizador), vea sus viajes activos y anteriores, y vea quiénes forman parte de cada uno. Es el contenedor de todo lo demás.

## Depende de

- 04 · registro e inicio de sesión

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US001 | Como usuario quiero crear un viaje indicando un nombre para empezar a organizarlo con mi grupo | B 8 · E 2 | • Dado que tengo sesión, cuando creo un viaje con nombre (obligatorio, 3–80 caracteres), entonces se crea y quedo como **organizador**.<br>• Puedo indicar opcionalmente descripción y moneda base (por defecto ARS).<br>• Al crearlo, me lleva a la pantalla del viaje. |
| US005 | Como integrante quiero ver quiénes forman parte del viaje para saber con quién lo organizo | B 5 · E 1 | • Veo la lista de integrantes con nombre, rol (organizador / integrante) y estado de participación.<br>• Si no soy miembro del viaje, recibo 404 (no se revela que existe). |
| US010 | Como usuario quiero consultar todos mis viajes activos y anteriores para encontrar rápido el que busco | B 5 · E 2 | • Veo dos pestañas: **Activos** y **Anteriores** (finalizados o con fecha de fin pasada).<br>• Si no tengo viajes, veo un estado vacío con el botón "Crear mi primer viaje".<br>• Cada tarjeta muestra nombre, fechas (si están definidas) y cantidad de integrantes. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Invitar personas (rama 07).
- Editar/abandonar/archivar viaje, permisos de organización (R2: US007, US008, US011).

## Diseño propuesto

### Modelo y migraciones

- `viajes`: `nombre`, `descripcion`, `fecha_inicio`, `fecha_fin` (nulas hasta que se decidan, rama 11), `moneda_base` (ISO 4217), **`zona_horaria`** (para la agenda de "hoy", rama 18), `estado` (`activo` / `finalizado`). → clase **Viaje**.
- `miembros_viaje`: `viaje_id`, `usuario_id`, `rol` (`organizador` / `integrante`), `participacion` (`confirmado` / `tentativo` / `no_participa`), `presupuesto_personal_maximo` (rama 12), `compartiendo_ubicacion` (rama 15). Único (`viaje_id`, `usuario_id`). → **concepto asociativo MiembroViaje**.
- Dependencias nuevas: `require_member(viaje_id)` y `require_organizer(viaje_id)`, que usan todas las features siguientes.

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| POST | `/viajes` | autenticado | Crea el viaje y el MiembroViaje organizador (misma transacción). |
| GET | `/viajes?estado=activo|anterior` | autenticado | Mis viajes. |
| GET | `/viajes/{id}` | `require_member` | Detalle del viaje. |
| GET | `/viajes/{id}/miembros` | `require_member` | Integrantes con rol y participación. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Mis viajes `/viajes` | "Todavía no tenés viajes" + crear | Skeleton de tarjetas | Error + reintentar | Lista / grilla de 2–3 columnas |
| Nuevo viaje | — | Botón con spinner | Errores por campo | Hoja inferior (mobile) / modal (desktop) |
| Viaje → Grupo | Solo yo como organizador | Skeleton | Error + reintentar | Lista |

### Notas

**Navegación:** se crea el *shell* del viaje: barra inferior en mobile (Hoy · Ideas · Itinerario · Mapa · Gastos) y lateral en desktop. Las secciones que todavía no existen muestran "Próximamente".

## Preguntas abiertas para el debate

- [ ] ¿Moneda base por defecto ARS o se pregunta siempre?
- [ ] ¿La zona horaria se toma del navegador del organizador o se elige?
- [ ] ¿Un viaje pasa a "anterior" solo por fecha o también a mano ("finalizar")?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US001
- [ ] US005
- [ ] US010
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k viajes
pnpm test:e2e -g viajes
```

Flujo manual:
1. Crear dos viajes y verlos en Activos.
2. Entrar a un viaje ajeno por URL → 404.
