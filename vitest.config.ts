/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import path from 'path';

export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './tests'),
    },
  },
  test: {
    globals: true,
    watch: false,
    root: './',
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx', 'tests/**/*.test.vue'],
    setupFiles: ['./tests/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx,js,jsx,vue}'],
      exclude: [
        'tests/',
        '**/*.d.ts',
        '**/vitest.setup.ts',
        '**/*.test.*',
        'node_modules/',
        'src/main.ts',
        'src/scripts/run-reset-app.ts',
         'src/shared/interfaces/**',
      ],
    },
  },
});
