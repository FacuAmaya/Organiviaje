# CONTEXT — Organiviaje

Documento vivo con el contexto del producto: qué problema resolvemos, cómo hablamos del dominio, qué decidimos y **en qué estado está el proyecto**. Se actualiza al cerrar cada feature.

---

## 1. Problema y propuesta

Cuando un grupo organiza un viaje, el itinerario está en una nota, las reservas en mails, los gastos en una planilla y las decisiones perdidas entre 200 mensajes.

**Organiviaje integra** lo que hoy resuelven apps separadas (Splitwise para gastos y deudas, Wanderlog para itinerario sobre mapa) y suma la **capa colaborativa**: propuestas, votaciones, decisiones y tareas.

**Usuarios**: grupos de amigos, familias, cualquier grupo de 2 a 20 personas que organiza un viaje en conjunto.

## 2. Actores

| Actor | Descripción |
|---|---|
| **Invitado** | Recibió un enlace de invitación; todavía no forma parte del viaje |
| **Integrante** | Miembro del viaje: propone, vota, registra gastos, comparte ubicación |
| **Organizador** | Hereda de Integrante y además administra: invita, confirma decisiones, arma el itinerario, asigna tareas |
| GPS del dispositivo «sistema» | Fuente de la posición para el tiempo real |
| Servicio de mapas «sistema» | Tiles, geocoding y rutas (OpenStreetMap / MapLibre) |

Un actor es un **rol**, no una persona: la misma persona puede ser Organizador en un viaje e Integrante en otro (por eso el rol vive en `MiembroViaje`).

## 3. Casos de uso centrales

| CU | Nombre | Esencia | Excepciones clave |
|---|---|---|---|
| CU1 | Proponiendo y decidiendo en grupo | Propuesta → Encuesta → Votos → Decisión | Con una sola propuesta no se vota; empate → regla de desempate («extend») |
| CU2 | Registrando y dividiendo un gasto | Separa **quién pagó** (aportes) de **a quién le toca** (partes); incluye recalcular saldos | Si las sumas no coinciden, no se guarda |
| CU3 | Compartiendo ubicación en tiempo real | Opt-in, se actualiza sin recargar | Permiso denegado, sin señal |
| CU4 | Armando el itinerario | Una Decisión se materializa en ActividadPlanificada con día, hora y lugar | Superposición horaria |

## 4. Glosario y mapeo modelo ↔ código

El modelo conceptual (37 clases) está en [docs/analisis/1-modelo-conceptual-uml.pdf](docs/analisis/1-modelo-conceptual-uml.pdf). Cada módulo UML es un módulo de backend.

| Módulo UML | Módulo de código | Conceptos |
|---|---|---|
| Núcleo | `backend/app/modules/nucleo` | Usuario, Viaje, **MiembroViaje** (concepto asociativo: rol, presupuesto personal, ubicación compartida, /saldo), Invitacion, Ubicacion, Disponibilidad, PosicionCompartida |
| Decisiones | `backend/app/modules/decisiones` | Propuesta (abstracta) → DestinoPropuesto, AlojamientoPropuesto, ActividadPropuesta, TransportePropuesto, RangoFechasPropuesto; Comentario, Encuesta, OpcionEncuesta, Voto, Decision |
| Planificación | `backend/app/modules/planificacion` | Itinerario, DiaViaje, ActividadPlanificada, ParticipacionActividad, Reserva, Tarea, Documento, PuntoEncuentro |
| Finanzas | `backend/app/modules/finanzas` | PresupuestoViaje, Gasto, **AporteGasto** (quién pagó), **ParteGasto** (a quién le toca), CriterioDivision (Igualitaria, PorMonto, PorPorcentaje, PorPartes), Liquidacion |

Términos clave:

- **Propuesta**: una idea que todavía no está decidida. *Proponer no es decidir.*
- **Encuesta / Voto**: el *proceso* de decidir. **Decisión**: el *resultado*. Están separados para poder reabrir sin perder historial.
- **Aporte vs. Parte**: una cena de 100.000 que pagan 2 y se divide entre 5 genera 2 aportes y 5 partes.
- **Saldo** (`/saldo`): derivado = aportes − partes ± liquidaciones. Nunca se guarda a mano.
- **Liquidación**: pago registrado entre deudor y acreedor para saldar deudas.

## 5. Decisiones de producto y supuestos

**Decidimos**
- El MVP (R1) recorre el viaje completo de punta a punta: valida la *integración*, que es la idea del producto.
- El tiempo real está dentro del MVP (mayor riesgo técnico → se valida temprano con un spike).
- Compartir ubicación es **opcional** (privacidad, opt-in explícito).
- Nivel de calidad casi profesional: cada feature se cierra con tests, estados de UI completos, accesibilidad y docs.

**Dejamos afuera** (por costo/riesgo, no hacen falta para validar la idea)
- Pagos dentro de la app, reservas integradas con proveedores, chat general.
- Multimoneda y modo offline completo → R3.

**Supuestos**
- Grupos de 2 a 20 personas.
- Celular con datos y GPS; web app responsive instalable como PWA.
- Una moneda base por viaje.
- Acceso a un viaje solo por invitación.

## 6. Priorización

Backlog de 185 historias en un User Story Mapping ([docs/analisis/2-user-story-mapping.pdf](docs/analisis/2-user-story-mapping.pdf)), priorizadas por **Beneficio ÷ Esfuerzo** (Fibonacci 1·2·3·5·8).

| Release | Historias | B/E | Versión |
|---|---|---|---|
| R1 · MVP | 68 | 2.38 | `v1.0.0` |
| R2 · Extensión prioritaria | 74 | 1.12 | `v2.0.0` |
| R3 · Evolución posterior | 43 | 0.51 | `v3.0.0` |

## Estado del proyecto

> Actualizar esta tabla al abrir y al mergear cada rama.

Leyenda: ✅ hecha · 👀 en review (PR abierto) · 🚧 en curso · ⏳ pendiente

### Fase 0 — Fundaciones
| # | Rama | Estado | Doc |
|---|---|---|---|
| 00 | `base/00-preparar-repositorio` | 👀 en review | [00-preparar-repositorio](docs/features/00-preparar-repositorio.md) |
| 01 | `base/01-backend-fastapi` | 🚧 | [01-backend-fastapi](docs/features/01-backend-fastapi.md) |
| 02 | `base/02-frontend-nextjs` | ⏳ | |
| 03 | `base/03-docker-y-ci` | ⏳ | |
| 04 | `funcionalidad/04-registro-e-inicio-de-sesion` | ⏳ | |
| 05 | `experimento/05-tiempo-real` | ⏳ | |

### R1 — MVP
| # | Rama | Historias | Estado |
|---|---|---|---|
| 06 | `funcionalidad/06-crear-y-ver-viajes` | US001, US005, US010 | ⏳ |
| 07 | `funcionalidad/07-invitar-al-grupo` | US003, US004, US006 | ⏳ |
| 08 | `funcionalidad/08-proponer-ideas` | US013, US020, US025–US030, US035, US039, US063, US064, US071, US072 | ⏳ |
| 09 | `funcionalidad/09-comentar-propuestas` | US037, US151 | ⏳ |
| 10 | `funcionalidad/10-votar-propuestas` | US015, US041, US044, US047, US053, US054 | ⏳ |
| 11 | `funcionalidad/11-confirmar-decisiones` | US016, US021, US056, US057, US061, US068 | ⏳ |
| 12 | `funcionalidad/12-presupuesto-del-viaje` | US022, US141, US142, US147 | ⏳ |
| 13 | `funcionalidad/13-armar-itinerario` | US075, US077, US078, US079, US090 | ⏳ |
| 14 | `funcionalidad/14-mapa-del-viaje` | US029, US043, US066, US091–US093, US097, US099, US101, US109 | ⏳ |
| 15 | `funcionalidad/15-ubicacion-en-tiempo-real` | US183, US184 | ⏳ |
| 16 | `funcionalidad/16-registrar-y-dividir-gastos` | US111–US115, US118, US120 | ⏳ |
| 17 | `funcionalidad/17-balances-y-deudas` | US131–US134, US176 | ⏳ |
| 18 | `funcionalidad/18-agenda-de-hoy` | US167, US168 | ⏳ |
| UX | `diseno/estilo-visual-vN` | Look & feel desde `docs/ux/` | ⏳ |
| 19 | `funcionalidad/19-instalar-en-celular` | Instalable en celular | ⏳ |
| 20 | `base/20-publicar-la-app` | Deploy + `v1.0.0` | ⏳ |

R2 (ramas 21–35) y R3 (ramas 36–44): ver [plan de desarrollo](docs/plan/plan-desarrollo.md#6-hoja-de-ruta-de-ramas).
