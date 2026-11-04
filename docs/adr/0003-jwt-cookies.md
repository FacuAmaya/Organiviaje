# 0003 · Autenticación propia con JWT en cookies httpOnly

- **Estado:** Aceptada
- **Fecha:** 2026-11-04

## Contexto

Los usuarios se registran con email y contraseña y acceden a viajes por invitación. Queremos entender el flujo completo de autenticación (objetivo de aprendizaje) sin depender de un proveedor externo.

## Decisión

- Registro y login con **email + contraseña**; hash con **argon2** (`argon2-cffi`).
- **Access token** JWT de vida corta (15 min) y **refresh token** de vida larga (7 días) con rotación: cada refresh invalida el anterior (se guarda su `jti` en la base).
- Ambos tokens viajan en **cookies `httpOnly`, `Secure`, `SameSite=Lax`**. El JavaScript del front nunca los lee.
- El backend expone `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me`.
- Dependencia `get_current_user` en FastAPI; autorización por viaje con `require_member` / `require_organizer`.
- El WebSocket se autentica con la misma cookie en el handshake.

## Alternativas consideradas

- **Token en `localStorage`:** simple, pero expuesto a XSS.
- **Proveedor externo (Clerk, Auth.js, Supabase):** menos código, pero oculta el flujo que queremos aprender y agrega dependencia.
- **Sesiones en servidor:** válido, pero requiere store compartido; JWT nos sirve igual para HTTP y WebSocket.

## Consecuencias

- ✅ Tokens no accesibles desde JS (mitiga XSS).
- ✅ Logout real gracias a la revocación del refresh.
- ⚠️ En deploy, front y API en dominios distintos: hay que usar un subdominio común o un proxy de Next.js (`/api/*` → backend) para que las cookies sean first-party. Se resuelve en `chore/20-deploy`.
- ⚠️ Necesitamos protección CSRF en métodos que modifican estado (SameSite=Lax + verificación de `Origin`).
- 🔜 Login con Google puede sumarse después sin cambiar el modelo (R3, opcional).
