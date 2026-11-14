/**
 * @file run-reset-app.ts
 * @namespace src.scripts
 * @description Runs the reset: deletes this app's local data folder
 */

import fs from 'fs';
import { appDataFolder, deleteFolder } from './reset-app.ts';

const config = JSON.parse(fs.readFileSync('src-tauri/tauri.conf.json', 'utf-8')) as {
  identifier: string;
};
const folder = appDataFolder(config.identifier);
deleteFolder(folder);
console.log(`Datos locales borrados: ${folder}`);
