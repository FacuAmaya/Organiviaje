# 17 · Balances y deudas

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/17-balances-y-deudas` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Mostrar quién le debe a quién, simplificar las deudas al mínimo de transferencias y registrar los pagos entre integrantes (incluye *Recalculando saldos* y *Saldando deudas* del diagrama de casos de uso).

## Depende de

- 16 · registrar y dividir gastos

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

| ID | Historia | B · E | Criterios de aceptación |
|---|---|---|---|
| US131 | Como integrante quiero ver mi balance con cada persona para saber cuánto debo o me deben | B 8 · E 3 | • Veo, por integrante, si le debo o me debe y cuánto. |
| US132 | Como integrante quiero ver el balance global del viaje para entender el estado de las cuentas | B 5 · E 2 | • Saldo de cada integrante (positivo = le deben, negativo = debe); la suma de todos los saldos es 0. |
| US133 | Como integrante quiero simplificar las deudas para hacer la menor cantidad de transferencias | B 5 · E 5 | • Se propone un plan de transferencias: con *n* integrantes, como máximo *n − 1*. |
| US134 | Como integrante quiero registrar una transferencia de liquidación para dar por saldada una deuda | B 5 · E 2 | • Registro "le pagué $X a Y"; los saldos se recalculan al instante.<br>• Puedo anular una liquidación cargada por error. |
| US176 | Como integrante quiero ver qué deudas continúan abiertas para cerrar las cuentas | B 8 · E 2 | • Lista de deudas pendientes según el plan simplificado; vacío = "¡Cuentas saldadas!". |

*B · E = beneficio · esfuerzo del User Story Mapping ([docs/analisis](../analisis/2-user-story-mapping.pdf)). Los criterios de aceptación son una propuesta inicial a validar en el debate.*

## Fuera de alcance

- Pagos parciales e historial de liquidaciones (R2).
- Compartir "cuánto me debés" (R3).

## Diseño propuesto

### Modelo y migraciones

- `liquidaciones`: `viaje_id`, `deudor_id`, `acreedor_id`, `monto`, `fecha`, `estado` (`registrada` / `anulada`), `registrada_por`. → **Liquidacion**.
- **Saldo (derivado, nunca se guarda):** Σ aportes − Σ partes + Σ liquidaciones pagadas − Σ liquidaciones recibidas. → atributo `/saldo` de MiembroViaje.
- `domain.py`: `calcular_saldos()` y `simplificar_deudas()` (algoritmo voraz mayor deudor ↔ mayor acreedor). Tests con propiedades: la suma es 0, a lo sumo n − 1 transferencias, aplicar el plan deja todo en 0.

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| GET | `/viajes/{id}/balances` | `require_member` | Saldos por integrante + mi balance con cada uno. |
| GET | `/viajes/{id}/deudas` | `require_member` | Plan simplificado de transferencias pendientes. |
| POST | `/viajes/{id}/liquidaciones` | `require_member` | Registra un pago. |
| POST | `/viajes/{id}/liquidaciones/{lid}/anular` | quien la registró u organizador | Anula. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Gastos → Balances | "¡Cuentas saldadas!" | Skeleton | Error + reintentar | Mi resumen arriba; lista "X le paga a Y" con botón "Registrar pago" |

## Preguntas abiertas para el debate

- [ ] ¿La liquidación la confirma el acreedor (recibí el dinero) o alcanza con que la registre el deudor?
- [ ] ¿Redondeo del plan simplificado a pesos enteros para facilitar transferencias?

## Decisiones del debate

| Decisión | Por qué | Alternativa descartada |
|---|---|---|
| | | |

## Hecho

- [ ] Debate hecho y preguntas abiertas respondidas
- [ ] US131
- [ ] US132
- [ ] US133
- [ ] US134
- [ ] US176
- [ ] Tests (unitarios, integración y e2e) en verde
- [ ] Docs actualizados (este archivo, CONTEXT, UX si hay pantallas, CHANGELOG)

## Falta / deuda técnica / ideas para después

- …

## Cómo probarlo

```bash
uv run pytest -k balances
```

Flujo manual:
1. 3 gastos entre 4 personas → ver plan simplificado → registrar los pagos → "¡Cuentas saldadas!".
