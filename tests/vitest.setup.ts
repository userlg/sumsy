/**
 * @file vitest.setup.ts
 * @namespace tests
 * @description Global setup for vitest - mocks Tauri APIs and other external dependencies
 */

import { vi } from 'vitest';
import { config } from '@vue/test-utils';

// Modals and tooltips teleport to <body>; render them in place so wrapper.find() sees them.
config.global.stubs = { ...config.global.stubs, teleport: true };

// Mock Tauri dialog plugin
vi.mock('@tauri-apps/plugin-dialog', () => ({
  save: vi.fn().mockResolvedValue(null),
  open: vi.fn().mockResolvedValue(null),
  message: vi.fn().mockResolvedValue(undefined),
  ask: vi.fn().mockResolvedValue(false),
  confirm: vi.fn().mockResolvedValue(false),
}));

// Mock Tauri filesystem plugin
vi.mock('@tauri-apps/plugin-fs', () => ({
  writeTextFile: vi.fn().mockResolvedValue(undefined),
}));
