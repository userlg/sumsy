/**
 * @file run-reset-app.ts
 * @namespace src.scripts
 * @description A runner to execute the reset-app script
 */

import { deleteFolderRecursive } from './reset-app.ts';

const folderPath = 'C:\\Users\\Kike\\AppData\\Local\\com.kike.sumsy';
deleteFolderRecursive(folderPath);
