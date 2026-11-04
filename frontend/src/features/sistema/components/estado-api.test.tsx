import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EstadoApi } from "./estado-api";

function renderizar() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <EstadoApi />
    </QueryClientProvider>,
  );
}

function respuesta(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("EstadoApi", () => {
  it("muestra 'verificando' mientras espera y 'conectado' si la API responde", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(respuesta(200, { status: "ok", db: "ok" }));
    renderizar();

    expect(screen.getByRole("status")).toHaveTextContent(/verificando/i);
    expect(await screen.findByText(/servidor conectado/i)).toBeInTheDocument();
  });

  it("muestra el error y permite reintentar", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        respuesta(503, {
          error: { code: "db_no_disponible", message: "La base de datos no responde", details: {} },
        }),
      )
      .mockResolvedValueOnce(respuesta(200, { status: "ok", db: "ok" }));
    renderizar();

    expect(await screen.findByText(/no se pudo conectar/i)).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: /reintentar/i }));

    expect(await screen.findByText(/servidor conectado/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
