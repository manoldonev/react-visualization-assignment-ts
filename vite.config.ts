import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), tsConfigPaths()],
  base: '/react-app-template-ts/',
  publicDir: './public',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/vitest.setup.ts',
    include: ['src/**/*.test.{tsx,ts}'],
  },
  build: {
    outDir: 'build',
  },
});
