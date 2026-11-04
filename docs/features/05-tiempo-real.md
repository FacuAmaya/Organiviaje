# 05 · Experimento: tiempo real con WebSocket y mapa

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `experimento/05-tiempo-real` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Validar temprano lo más riesgoso del proyecto (lo dice el análisis: US184 es el mayor riesgo técnico): que dos navegadores vean moverse un punto en un mapa en vivo, con WebSocket, Redis y MapLibre. Si funciona, el código se reutiliza en la rama 15; si no, se cambia de enfoque antes de invertir más.

## Depende de

- 03 · Docker y CI (Redis)
- 04 · sesión (para autenticar el WebSocket)

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

Es un experimento (*spike*): no entrega historias, entrega **aprendizaje**. Criterios de éxito:

- Con dos navegadores abiertos en el mismo "viaje de prueba", lo que se mueve en uno aparece en el otro en menos de 1 segundo.
- Funciona con 2 instancias de la API a la vez (Redis reparte los mensajes).
- Si se corta la conexión, el cliente se reconecta solo.
- Un usuario sin sesión no puede conectarse.

## Fuera de alcance

- Persistir posiciones, permisos por viaje y privacidad (rama 15).
- Diseño final del mapa (rama 14).

## Diseño propuesto

### Modelo y migraciones

Sin tablas. Solo mensajes efímeros en Redis.

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| WS | `/ws/viajes/{viaje_id}` | autenticado | Canal del viaje: el cliente envía y recibe mensajes JSON `{tipo, datos}`. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| `/experimentos/tiempo-real` | Mapa vacío | "Conectando…" | "Sin conexión, reintentando" | Mapa a pantalla completa |

### Notas

**Entregable principal:** un ADR con el resultado (qué funcionó, latencias medidas, límites encontrados, por ejemplo, que en iOS una web no puede enviar la ubicación en segundo plano) y la decisión para la rama 15.

## Preguntas abiertas para el debate

- [ ] ¿Proveedor de tiles del mapa para producción (OpenStreetMap tiene límites de uso; MapTiler/Stadia tienen planes gratis)?
- [ ] ¿Cada cuántos segundos / metros enviar la posición sin gastar batería?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
docker compose up
# abrir /experimentos/tiempo-real en dos navegadores
```

Flujo manual:
1. Mover el punto en un navegador y verlo en el otro.
2. Cortar la red unos segundos y comprobar que reconecta.
