/**
 * @file index.ts
 * @namespace src.modules.summaries
 * @description Index file for the summaries module
 */

export * from './store/summary.store';

import SummariesView from './views/Summaries.vue';

export const summariesRoute = {
  path: '/summaries',
  name: 'Summaries',
  component: SummariesView,
  meta: { order: 1 },
};

export { SummariesView };
