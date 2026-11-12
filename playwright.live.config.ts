import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
export default defineConfig({
  testDir: "tests/live",
  workers: 1,
  fullyParallel: false,
  reporter: "list",
  timeout: 90000,
  use: {
    baseURL: process.env.TEST_BASE_URL ?? "http://localhost:3107",
    channel: "msedge",
    trace: "off",
    screenshot: "off",
    video: "off",
  },
});
