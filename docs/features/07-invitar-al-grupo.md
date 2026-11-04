# 07 · Invitar al grupo

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/07-invitar-al-grupo` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que el organizador sume personas al viaje compartiendo un enlace (por WhatsApp, por ejemplo) y que cada integrante indique si va, si es tentativo o si no participa.

## Depende de

- 06 · crear y ver viajes

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US003 | Como organizador quiero invitar personas mediante un enlace para sumarlas sin cargar sus datos | B 8 · E 3 | • Genero un enlace de invitación con vencimiento (por defecto 7 días) y lo copio o comparto con el menú nativo del celular.<br>• Puedo cancelar una invitación activa; el enlace deja de funcionar. |
| US004 | Como invitado quiero aceptar una invitación para unirme al viaje | B 8 · E 2 | • Al abrir el enlace veo el nombre del viaje y quién me invita, aun sin sesión.<br>• Si no tengo sesión, me registro o ingreso y vuelvo automáticamente a la invitación.<br>• Al aceptar, quedo como integrante con participación "tentativo".<br>• Si el enlace venció o fue cancelado, veo un mensaje claro y no me uno.<br>• Si ya era miembro, me lleva al viaje sin error. |
| US006 | Como integrante quiero indicar si estoy confirmado, tentativo o no participo para que el grupo sepa con quién contar | B 5 · E 2 | • Puedo cambiar mi participación en cualquier momento desde el viaje.<br>• El cambio se ve en la lista de integrantes (US005). |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Invitar por email (no hay envío de mails en R1).
- Remover integrantes (R2, US009).

## Diseño propuesto

### Modelo y migraciones

- `invitaciones`: `viaje_id`, `token` (aleatorio, 32+ bytes, único), `creada_por` (miembro), `fecha_envio`, `fecha_vencimiento`, `estado` (`activa` / `cancelada`), `usos` (contador). → clase **Invitacion** (métodos `aceptar()`, `cancelar()`).
- Un enlace puede usarse varias veces (grupo de WhatsApp) hasta vencer o cancelarse.

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| POST | `/viajes/{id}/invitaciones` | `require_organizer` | Crea un enlace. |
| GET | `/viajes/{id}/invitaciones` | `require_organizer` | Enlaces activos. |
| DELETE | `/viajes/{id}/invitaciones/{inv_id}` | `require_organizer` | Cancela. |
| GET | `/invitaciones/{token}` | público | Vista previa: nombre del viaje y organizador (nada más). |
| POST | `/invitaciones/{token}/aceptar` | autenticado | Crea el MiembroViaje (idempotente). |
| PATCH | `/viajes/{id}/miembros/yo` | `require_member` | Cambia mi `participacion`. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Grupo → Invitar | "Sin enlaces activos" | Spinner | Error + reintentar | Botón compartir nativo (mobile) / copiar (desktop) |
| `/invitacion/[token]` | — | Skeleton | "La invitación venció o fue cancelada" | Tarjeta centrada |
| Selector de participación | — | Optimista | Revierte + aviso | Segmentado de 3 opciones |

### Notas

**Errores de dominio:** `invitacion_vencida`, `invitacion_cancelada` (410). Token nunca expuesto en logs.

## Preguntas abiertas para el debate

- [ ] ¿Vencimiento por defecto 7 días? ¿Configurable?
- [ ] ¿Un integrante (no organizador) puede invitar?
- [ ] ¿Límite de integrantes por viaje (el análisis supone 2–20)?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US003
- [ ] US004
- [ ] US006
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k invitaciones
pnpm test:e2e -g invitación
```

Flujo manual:
1. Organizador genera enlace → abrirlo en otra sesión (ventana privada) → registrarse → queda en el grupo.
2. Cancelar el enlace y volver a abrirlo → mensaje de cancelado.
