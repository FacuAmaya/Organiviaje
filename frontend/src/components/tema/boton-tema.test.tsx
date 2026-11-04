import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { BotonTema } from "./boton-tema";

describe("BotonTema", () => {
  it("tiene un nombre accesible que indica el tema actual", () => {
    render(<BotonTema />);
    expect(screen.getByRole("button", { name: /tema del sistema/i })).toBeInTheDocument();
  });

  it("al hacer clic pasa de sistema a claro y después a oscuro", async () => {
    const user = userEvent.setup();
    render(<BotonTema />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: /tema claro/i })).toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("dark");

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: /tema oscuro/i })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
  });
});
