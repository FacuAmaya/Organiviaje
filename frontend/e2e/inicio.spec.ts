import { expect, test } from "@playwright/test";

test.describe("pantalla de inicio", () => {
  test("muestra el lema, los pilares y el estado del servidor", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Organiviaje");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Viajar en grupo, sin caos.");
    await expect(page.getByRole("listitem")).toHaveCount(4);
    // No depende de que el backend esté levantado: alcanza con que muestre algún estado.
    await expect(page.getByRole("status")).toBeVisible();
  });

  test("no tiene scroll horizontal (se ve bien en cualquier ancho)", async ({ page }) => {
    await page.goto("/");
    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda).toBe(false);
  });

  test("el tema elegido se aplica sin parpadeo y se recuerda al recargar", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const boton = page.getByRole("button", { name: /cambiar tema/i });

    await boton.click(); // sistema → claro
    await boton.click(); // claro → oscuro
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    // El script del <head> aplica la clase antes de que cargue React.
    await expect(html).toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: /tema oscuro/i })).toBeVisible();
  });
});
