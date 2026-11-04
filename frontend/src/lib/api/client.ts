/**
 * Cliente HTTP tipado de la API.
 *
 * Los tipos salen de `schema.d.ts`, que se genera desde el OpenAPI del backend con
 * `pnpm api:generate`. Nunca se escriben a mano: si el backend cambia, TypeScript avisa.
 */
import createClient from "openapi-fetch";

import type { components, paths } from "./schema";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = createClient<paths>({
  baseUrl: API_URL,
  credentials: "include", // enviar las cookies de sesión (ADR 0003)
  // Se resuelve `fetch` en cada pedido (no al importar): permite simularlo en los tests.
  fetch: (request) => globalThis.fetch(request),
});

export type ErrorApi = components["schemas"]["ErrorResponse"]["error"];

/** Error lanzado por los hooks cuando la API responde con el formato unificado. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly detalle: ErrorApi,
  ) {
    super(detalle.message);
    this.name = "ApiError";
  }
}
