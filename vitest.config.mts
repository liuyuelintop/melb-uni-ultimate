import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  resolve: {
    // Mirror the `paths` in tsconfig.json. Vitest does not read them itself,
    // so a new alias has to be added in both places.
    alias: {
      "@app": `${src}/app`,
      "@features": `${src}/features`,
      "@shared": `${src}/shared`,
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
