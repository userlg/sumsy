/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'


export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    test: {
        globals: true,
        watch: false,
        root: './',
        environment: 'happy-dom',
        setupFiles: './vitest.setup.ts',
        include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx', 'tests/**/*.test.vue'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx,js,jsx,vue}'],
            exclude: [
                'tests/',
                '**/*.d.ts',
                '**/vitest.setup.ts',
                '**/*.test.*',
                'node_modules/',
            ],
        }
    },
})
