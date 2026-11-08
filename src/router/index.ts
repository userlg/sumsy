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

declare module 'vue-router' {
  interface RouteMeta {
    /** Position in the nav bar; decides which way the view transition slides. */
    order?: number;
    /** Spans the whole window (with side margins) instead of the narrow reading width. */
    wide?: boolean;
  }
}

/** Matches the leave duration of the view transition in transitions.css. */
export const VIEW_LEAVE_MS = 140;

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { order: 0, wide: true },
  },
  {
    path: '/graphs',
    name: 'graphs',
    component: Graphs,
    meta: { order: 3 },
  },
  summariesRoute,
  casesRoute,
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // Wait for the old view to leave, then jump: back/forward restores where you were,
  // a new page starts at the top, and in-page anchors glide.
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 };
    return new Promise((resolve) => {
      setTimeout(() => resolve(savedPosition ?? { top: 0, behavior: 'instant' }), VIEW_LEAVE_MS);
    });
  },
});

export default router;
