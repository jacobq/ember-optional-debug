/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: { //vitest options here
    testTimeout: 10_000,
    globalSetup: 'tests/vitest-setup.js',
  },
});
