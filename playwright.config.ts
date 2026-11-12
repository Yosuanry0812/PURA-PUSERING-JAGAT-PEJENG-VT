import { defineConfig } from "@playwright/test";
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3107);
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://localhost:" + port,
    channel: "msedge",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- --port " + port,
    url: "http://localhost:" + port,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
