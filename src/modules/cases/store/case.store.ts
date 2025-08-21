/**
 * @file case.store.ts
 * @namespace src.modules.cases
 * @description Store for managing cases in the application
 */

import { createListStore } from '@/shared/stores/base.store';

export const useCaseStore = createListStore('caseStore');
