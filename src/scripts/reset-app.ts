/**
 * @file reset-app.ts
 * @namespace src.scripts
 * @description  Script to reset the application state
 */

import fs from 'fs';
import path from 'path';

export function deleteFolderRecursive(folderPath: string): void {
  if (fs.existsSync(folderPath)) {
    for (const file of fs.readdirSync(folderPath)) {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    }
    fs.rmdirSync(folderPath);
  }
}
