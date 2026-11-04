# 04 · Registro e inicio de sesión

| Rama | Estado | Responsable(s) | Issue | PR |
|---|---|---|---|---|
| `funcionalidad/04-registro-e-inicio-de-sesion` | ⏳ pendiente | — *(asignarse en el issue)* | #— | #— |

> **Cómo usar este documento:** antes de empezar se lee y se debate (sección *Preguntas abiertas*); mientras se trabaja se completan *Decisiones*, *Hecho* y *Falta*; al cerrar se revisa *Cómo probarlo*. Lo que está en *Diseño propuesto* es un punto de partida, no una obligación: si en el debate se decide otra cosa, se actualiza acá.

## Objetivo

Que una persona pueda crear su cuenta, iniciar y cerrar sesión de forma segura. Es la puerta de entrada: todas las demás funcionalidades necesitan saber quién es el usuario.

## Depende de

- 03 · Docker y CI

Antes de empezar, verificá en [CONTEXT.md](../../CONTEXT.md#estado-del-proyecto) que estén ✅.

## Historias cubiertas

No hay historia explícita en el USM (es un requisito implícito de todas). Se cubren estos criterios:

- Dado un email no registrado, cuando completo nombre, email y contraseña válidos, entonces se crea mi cuenta y quedo con la sesión iniciada.
- Dado un email ya registrado, cuando intento registrarme, entonces veo "Ya existe una cuenta con ese email" (sin revelar otros datos).
- Dado que ingreso email o contraseña incorrectos, entonces veo un único mensaje genérico "Email o contraseña incorrectos".
- Dado que tengo la sesión iniciada, cuando cierro sesión, entonces no puedo volver a entrar a pantallas privadas sin loguearme.
- Dado que mi sesión expira mientras uso la app, entonces se renueva sola sin que lo note (refresh token).

## Fuera de alcance

- Login con Google (R3, opcional).
- Recuperar contraseña por email (se agrega cuando haya envío de mails, R2).
- Verificación de email.

## Diseño propuesto

### Modelo y migraciones

- `usuarios`: `id` UUID, `nombre`, `email` (único, en minúsculas), `password_hash` (argon2), timestamps. → clase **Usuario** del UML.
- `refresh_tokens`: `id` (jti), `usuario_id`, `expira_en`, `revocado_en`, `reemplazado_por`. Permite cerrar sesión de verdad y detectar reuso de tokens robados.

### Endpoints

| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| POST | `/auth/registro` | público | Crea la cuenta e inicia sesión (setea cookies). |
| POST | `/auth/ingreso` | público | Valida credenciales y setea cookies `access` y `refresh`. |
| POST | `/auth/renovar` | cookie refresh | Rota el refresh token y emite un access nuevo. |
| POST | `/auth/salida` | autenticado | Revoca el refresh y borra cookies. |
| GET | `/auth/yo` | autenticado | Datos del usuario actual. |

Errores con el formato unificado `{"error": {code, message, details}}` (ver [01-backend-fastapi](01-backend-fastapi.md#errores)).

### Pantallas y estados

| Pantalla | Vacío | Carga | Error | Mobile / Desktop |
|---|---|---|---|---|
| Registro `/registro` | — | Botón con spinner, deshabilitado | Mensajes por campo + error general | Formulario centrado, 1 columna |
| Ingreso `/ingresar` | — | Ídem | "Email o contraseña incorrectos" | Ídem |
| Rutas privadas | — | — | Redirige a `/ingresar?volver=…` | — |

### Notas

**Seguridad:** contraseña mínima de 8 caracteres; *rate limit* en `/auth/ingreso`; cookies `httpOnly` + `Secure` + `SameSite=Lax`; validación de `Origin` en métodos que modifican datos (CSRF). Se suman `react-hook-form` + `zod` para los formularios. Se crean las dependencias `get_current_user` (backend) y el *proxy* de Next (`/api/*` → backend) para que las cookies sean del mismo sitio (ADR 0003).

## Preguntas abiertas para el debate

- [ ] ¿Proxy de Next (`/api/*`) desde ahora o llamadas directas al backend hasta el deploy?
- [ ] ¿Duración de la sesión: 15 min access / 7 días refresh, o 30 días para no pedir login seguido en el celular?
- [ ] ¿Pedimos solo nombre o también apellido / alias para mostrar en el grupo?

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
uv run pytest tests -k auth
pnpm test:e2e -g sesión
```

Flujo manual:
1. Registrarse, cerrar sesión, volver a entrar.
2. Intentar entrar a una ruta privada sin sesión → redirige a ingresar y después vuelve.
