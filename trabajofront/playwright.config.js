import { defineConfig, devices } from "@playwright/test";

const useSystemChrome = process.env.PW_USE_SYSTEM_CHROME === "true";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    env: {
      ASTRO_TELEMETRY_DISABLED: "1",
      PUBLIC_E2E_MODE: "true",
    },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://127.0.0.1:4321",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(useSystemChrome ? { channel: "chrome" } : {}),
      },
    },
  ],
});
