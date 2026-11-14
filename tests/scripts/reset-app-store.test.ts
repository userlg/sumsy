/**
 * @file reset-app-store.test.ts
 * @namespace tests.scripts
 * @description Tests for the reset-app script
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { appDataFolder, deleteFolder } from '@/scripts/reset-app';

describe('deleteFolder', () => {
  let tempDir: string;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sumsy-test-'));
    const subDir = path.join(tempDir, 'sub');
    fs.mkdirSync(subDir);
    fs.writeFileSync(path.join(tempDir, 'file.txt'), 'hello');
    fs.writeFileSync(path.join(subDir, 'nested.txt'), 'world');
  });

  it('deletes a folder recursively', () => {
    deleteFolder(tempDir);
    expect(fs.existsSync(tempDir)).toBe(false);
  });

  it('does not throw if the folder does not exist', () => {
    expect(() => deleteFolder(tempDir)).not.toThrow();
  });
});

describe('appDataFolder', () => {
  it('ends with the app identifier on every platform', () => {
    for (const platform of ['win32', 'darwin', 'linux'] as const) {
      expect(appDataFolder('com.example.app', platform)).toMatch(/com\.example\.app$/);
    }
  });

  it('never points at a fixed user folder', () => {
    expect(appDataFolder('com.example.app', 'linux')).toContain(os.homedir());
  });
});
