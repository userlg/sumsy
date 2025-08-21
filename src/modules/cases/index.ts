/**
 * @file index.ts
 * @namespace src.modules.cases
 * @description Store for managing cases in the application
 */

export * from './store/case.store';

import CasesView from './views/Cases.vue';

export const casesRoute = {
  path: '/cases',
  name: 'Cases',
  component: CasesView,
};

export { CasesView };
