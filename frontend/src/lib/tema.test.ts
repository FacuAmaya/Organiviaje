import { describe, expect, it } from "vitest";

import { aplicarTema, CLAVE_TEMA, guardarTema, leerTema, siguienteTema } from "./tema";

describe("tema", () => {
  it("usa 'sistema' si no hay nada guardado o el valor es inválido", () => {
    expect(leerTema()).toBe("sistema");
    localStorage.setItem(CLAVE_TEMA, "violeta");
    expect(leerTema()).toBe("sistema");
  });

  it("rota claro → oscuro → sistema → claro", () => {
    expect(siguienteTema("claro")).toBe("oscuro");
    expect(siguienteTema("oscuro")).toBe("sistema");
    expect(siguienteTema("sistema")).toBe("claro");
  });

  it("aplica la clase dark solo cuando corresponde", () => {
    aplicarTema("oscuro");
    expect(document.documentElement).toHaveClass("dark");
    aplicarTema("claro");
    expect(document.documentElement).not.toHaveClass("dark");
    aplicarTema("sistema"); // el mock de matchMedia simula sistema claro
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("guarda la preferencia y la aplica", () => {
    guardarTema("oscuro");
    expect(localStorage.getItem(CLAVE_TEMA)).toBe("oscuro");
    expect(document.documentElement).toHaveClass("dark");
  });
});
