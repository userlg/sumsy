/**
 * @file summary.store.ts
 * @namespace src.modules.summaries
 * @description Store for managing summaries in the application
 */

import { createListStore } from '@/shared/stores/base.store';

export const useSummaryStore = createListStore('summaryStore');
