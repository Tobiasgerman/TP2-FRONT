import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "html"],
      include: ["src/lib/food.js"],
    },
    include: ["tests/unit/**/*.test.js"],
  },
});
