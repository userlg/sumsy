/**
 * @file reset-app.ts
 * @namespace src.scripts
 * @description Deletes Sumsy's local data folder (dev tool: `yarn clean:app`)
 */

import fs from 'fs';
import os from 'os';
import path from 'path';

/** Deletes a folder and everything in it; does nothing if it does not exist. */
export function deleteFolder(folderPath: string): void {
  fs.rmSync(folderPath, { recursive: true, force: true });
}

/**
 * Where Tauri keeps this app's local data on the current machine, from the identifier in
 * tauri.conf.json (Windows: %LOCALAPPDATA%; macOS: ~/Library/Application Support; Linux: ~/.local/share).
 */
export function appDataFolder(identifier: string, platform = process.platform): string {
  const home = os.homedir();
  const base =
    platform === 'win32'
      ? (process.env.LOCALAPPDATA ?? path.join(home, 'AppData', 'Local'))
      : platform === 'darwin'
        ? path.join(home, 'Library', 'Application Support')
        : (process.env.XDG_DATA_HOME ?? path.join(home, '.local', 'share'));
  return path.join(base, identifier);
}
