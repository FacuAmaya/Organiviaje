# 16 · Registrar y dividir gastos

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/16-registrar-y-dividir-gastos` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Registrar quién pagó qué y entre quiénes se divide, separando **quién pagó** (aportes) de **a quién le toca** (partes) (CU2 · *Registrando y dividiendo un gasto*).

## Depende de

- 06 · crear y ver viajes
- 13 · itinerario (solo para US120, opcional)

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US111 | Como integrante quiero registrar un gasto indicando concepto, importe y fecha para llevar las cuentas | B 8 · E 2 | • Concepto obligatorio, importe > 0 en la moneda base, fecha (por defecto hoy). |
| US112 | Como integrante quiero indicar quién pagó un gasto para que se le devuelva | B 8 · E 1 | • Por defecto pagué yo; puedo elegir a otro integrante. |
| US113 | Como integrante quiero seleccionar quiénes participaron de un gasto para que solo paguen ellos | B 8 · E 2 | • Por defecto participan todos los integrantes confirmados. |
| US114 | Como integrante quiero dividir un gasto en partes iguales para no hacer cuentas | B 8 · E 1 | • Los centavos que sobran se reparten de a uno entre los primeros participantes: **la suma de las partes siempre da exacto el total**. |
| US115 | Como integrante quiero dividir un gasto por importes exactos para casos donde cada uno consumió distinto | B 5 · E 2 | • Si las partes no suman el total, no se guarda y se muestra cuánto falta o sobra (excepción del CU2). |
| US118 | Como integrante quiero excluir personas de un gasto para que no paguen lo que no consumieron | B 5 · E 1 | • Destildar participantes; al menos uno debe quedar. |
| US120 | Como integrante quiero asociar un gasto a una actividad para saber cuánto costó cada cosa | B 3 · E 2 | • Selector opcional de actividad del itinerario. |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Dividir por porcentajes o por partes; editar y eliminar gastos; categorías (R2).
- Varios pagadores, multimoneda, comprobantes (R3).

## Diseño propuesto

### Modelo y migraciones

- `gastos`: `viaje_id`, `concepto`, `fecha`, `monto_total` `NUMERIC(12,2)`, `moneda`, `categoria` (nullable), `criterio` (`igualitaria` / `por_monto`), `actividad_id` (nullable), `creado_por`. → **Gasto**.
- `aportes_gasto`: `gasto_id`, `miembro_id`, `monto_pagado`. → **AporteGasto** (en R1 la UI permite uno; el modelo soporta varios).
- `partes_gasto`: `gasto_id`, `miembro_id`, `monto_asignado`. → **ParteGasto**.
- `domain.py`: **patrón Strategy** `CriterioDivision.distribuir(monto, participantes) -> list[Parte]` con `DivisionIgualitaria` y `DivisionPorMonto` (Porcentaje y Partes en R2, sin tocar Gasto). Tests: centavos, 1 participante, montos que no cierran, invariante *Σ partes = Σ aportes = total*.

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| POST | `/viajes/{id}/gastos` | `require_member` | Crea gasto + aportes + partes en una transacción (422 `distribucion_invalida` si no cierra). |
| GET | `/viajes/{id}/gastos` | `require_member` | Lista (más recientes primero). |
| GET | `/viajes/{id}/gastos/{gid}` | `require_member` | Detalle con aportes y partes. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Gastos | "Todavía no hay gastos" + registrar | Skeleton | Error + reintentar | Lista con montos alineados (tabular-nums) |
| Nuevo gasto | — | Spinner | Indicador vivo de "faltan $X" / "sobran $X" | Pasos: importe → quién pagó → entre quiénes → cómo dividir |

### Notas

**Montos:** siempre `Decimal` / `NUMERIC`, nunca `float`. Formato de moneda con `Intl.NumberFormat('es-AR')`.

## Preguntas abiertas para el debate

- [ ] ¿Los tentativos participan por defecto o solo los confirmados?
- [ ] ¿Cualquiera puede registrar un gasto pagado por otro?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US111
- [ ] US112
- [ ] US113
- [ ] US114
- [ ] US115
- [ ] US118
- [ ] US120
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k gastos
pnpm test:e2e -g gastos
```

Flujo manual:
1. Cena de 100.000 que paga 1 y se divide entre 3 → partes 33.333,34 / 33.333,33 / 33.333,33.
2. Dividir por montos que no suman → no deja guardar.
