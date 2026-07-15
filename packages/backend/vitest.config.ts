import { config } from "dotenv";
import { defineConfig } from "vitest/config";
import type { CoverageOptions } from "vitest/node";

const coverageConfig: CoverageOptions = {
  reporter: ["text", "json-summary", "json"],
  reportOnFailure: true,
  provider: "v8",
};

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    env: {
      ...config({ path: ".env.test" }).parsed,
    },
    coverage: coverageConfig,
  },
});
