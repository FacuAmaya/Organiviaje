# 09 · Comentar propuestas

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/09-comentar-propuestas` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que la conversación sobre cada idea quede pegada a la idea (y no perdida en el chat del grupo). Se diseña genérico para reutilizarlo después en actividades y gastos.

## Depende de

- 08 · proponer ideas

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US037 | Como integrante quiero comentar una propuesta para dar mi opinión | B 5 · E 2 | • Escribo un comentario (1–1000 caracteres) y aparece al instante con mi nombre y la hora.<br>• Puedo editar o eliminar mis comentarios; los editados muestran "(editado)". |
| US151 | Como integrante quiero comentar una actividad, propuesta o gasto dentro de su contexto para no mezclar conversaciones | B 5 · E 3 | • El mismo componente de comentarios funciona sobre cualquier objeto comentable.<br>• En R1 se habilita sobre propuestas; actividades (rama 13) y gastos (rama 16) lo suman reutilizándolo. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Menciones con @ (R2, US038).
- Notificaciones (R2).

## Diseño propuesto

### Modelo y migraciones

- `comentarios`: `viaje_id`, `autor_id` (miembro), `objetivo_tipo` (`propuesta` · `actividad` · `gasto`), `objetivo_id`, `texto`, `editado_en`, `eliminado_en` (borrado lógico). Índice por (`objetivo_tipo`, `objetivo_id`). → clase **Comentario**.

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| GET | `/viajes/{id}/comentarios?objetivo_tipo=&objetivo_id=` | `require_member` | Lista paginada (más viejos primero). |
| POST | `/viajes/{id}/comentarios` | `require_member` | Crea; valida que el objetivo exista en ese viaje. |
| PATCH | `/viajes/{id}/comentarios/{cid}` | autor | Edita. |
| DELETE | `/viajes/{id}/comentarios/{cid}` | autor | Borrado lógico. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Hilo de comentarios (en detalle de propuesta) | "Sé el primero en comentar" | Skeleton | Error + reintentar; el texto escrito no se pierde | Caja de texto fija abajo (mobile) |

## Preguntas abiertas para el debate

- [ ] ¿Comentarios en tiempo real (aparecen sin recargar) en R1 o con refresco al abrir?
- [ ] ¿El organizador puede borrar comentarios de otros (moderación)?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US037
- [ ] US151
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k comentarios
```

Flujo manual:
1. Comentar, editar y borrar en una propuesta desde dos usuarios.
