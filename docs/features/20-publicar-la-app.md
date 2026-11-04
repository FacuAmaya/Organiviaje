# 20 · Publicar la app (deploy)

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `base/20-publicar-la-app` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Publicar el MVP en internet con HTTPS para que el grupo lo use de verdad desde el celular, y cerrar la versión `v1.0.0`.

## Depende de

- Todas las features 03–19

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

Cierre del MVP. Criterios:

- La app está en una URL pública con HTTPS; el backend y la base están en un servicio administrado.
- Cada merge a `main` se despliega solo (deploy continuo) y aplica las migraciones.
- Las cookies de sesión funcionan en el celular (front y API en el mismo sitio, ADR 0003).
- Existe `docs/instalar-en-celular.md` con los pasos para Android y iPhone, con capturas.
- Demo end-to-end completa: crear → invitar → proponer → votar → decidir → itinerario → mapa con ubicación en vivo → gasto → balance.

## Fuera de alcance

- Dominio propio pago (opcional).
- Escalado y alta disponibilidad.

## Diseño propuesto

### Modelo y migraciones

Sin cambios de modelo. Script de datos de demo (`seed`).

### Infraestructura

- Frontend en **Vercel** (root `frontend/`).
- API + PostgreSQL + Redis en **Render** o **Railway** (root `backend/`, `Dockerfile` de producción).
- Variables de entorno y secretos en cada plataforma (nunca en el repo).
- `alembic upgrade head` como paso previo al arranque.
- Logs estructurados y *request-id*; `/health` como chequeo de la plataforma.
- Tag `v1.0.0` + CHANGELOG + release en GitHub.

## Preguntas abiertas para el debate

- [ ] ¿Render o Railway (plan gratuito, límites de "dormido")?
- [ ] ¿Subdominio propio para que front y API compartan sitio (cookies) o proxy de Next?

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
# en producción
curl https://<api>/health
```

Flujo manual:
1. Hacer la demo completa desde dos celulares reales.
2. Instalar la PWA siguiendo `docs/instalar-en-celular.md`.
