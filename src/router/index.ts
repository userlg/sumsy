/**
 * @file index.ts
 * @namespace src.router
 * @description Index file for the router
 */

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/pages/Home.vue';
import Graphs from '@/pages/Graphs.vue';
import { summariesRoute } from '@/modules/summaries';
import { casesRoute } from '@/modules/cases';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/graphs',
    name: 'graphs',
    component: Graphs,
  },
  summariesRoute,
  casesRoute,
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
