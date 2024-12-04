import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': new URL('./src/', import.meta.url).pathname, // Match your tsconfig "paths" setting
    },
  },
  test: {
    coverage: {
      exclude: ['node_modules', 'dist'], // Exclude unnecessary files
      include: ['src/**/*.ts'], // Include source files
      provider: 'v8', // Use V8 for coverage reports
      reporter: ['text', 'html'], // Coverage report formats
    },
    environment: 'node', // Node.js environment for testing
    globals: true, // Enable global test APIs like `describe`, `it`, `expect`
    poolOptions: { threads: { singleThread: true } },
    setupFiles: [], // Add setup files if needed
  },
});
