import { defineConfig, devices } from "@playwright/test";

const PUERTO = Number(process.env.PORT ?? 3000);
const BASE_URL = `http://localhost:${PUERTO}`;

/**
 * Tests end-to-end: abren un navegador real y usan la app como una persona.
 * Cada test corre en celular (360px de ancho) y en escritorio.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: BASE_URL, trace: "on-first-retry" },
  projects: [
    {
      name: "celular",
      use: { ...devices["Pixel 7"], viewport: { width: 360, height: 780 } },
    },
    {
      name: "escritorio",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${PUERTO}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
