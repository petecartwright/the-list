/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    coverage: {
      exclude: ["**/build/**", "**/public/**"],
      provider: "v8",
      reporter: ["json", "html", "text", "text-summary"],
      // TODO: figure out what level of coverage we're happy with here
      //       for a non-revenue-generating personal project.

      // thresholds: {
      //   "100": true,
      // },
    },
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
  },
});
