export * from './store/summary.store';

import SummariesView from './views/Summaries.vue';

export const summariesRoute = {
  path: '/summaries',
  name: 'Summaries',
  component: SummariesView,
};

export { SummariesView };
