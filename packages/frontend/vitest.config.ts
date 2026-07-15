import * as path from "node:path";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";
import type { CoverageOptions } from "vitest/node";
import { isInDebugMode } from "./src/__test__/isInDebugMode";

const coverageConfig: CoverageOptions = {
  reporter: ["text", "json-summary", "json"],
  reportOnFailure: true,
  provider: "v8",
};

export default defineConfig({
  plugins: [...react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared/src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    env: {
      ...config({ path: "../backend/.env.test" }).parsed,
    },
    setupFiles: ["./src/setupTests.ts"],
    coverage: coverageConfig,
    testTimeout: isInDebugMode() ? 3600_000 : 5000,
  },
});
