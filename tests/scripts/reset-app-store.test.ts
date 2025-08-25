/**
 * @file reset-app-store.test.ts
 * @namespace tests.scripts
 * @description Tests for the reset-app-store script
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { deleteFolderRecursive } from '@/scripts/reset-app';

describe('deleteFolderRecursive', () => {
  let tempDir: string;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sumsy-test-'));

    const subDir = path.join(tempDir, 'sub');
    fs.mkdirSync(subDir);

    fs.writeFileSync(path.join(tempDir, 'file.txt'), 'hello');
    fs.writeFileSync(path.join(subDir, 'nested.txt'), 'world');

    expect(fs.existsSync(tempDir)).toBe(true);
  });

  it('should delete a folder recursively', () => {
    deleteFolderRecursive(tempDir);

    expect(fs.existsSync(tempDir)).toBe(false);
  });

  it('should not throw if folder does not exist', () => {
    expect(() => deleteFolderRecursive(tempDir)).not.toThrow();
  });
});
