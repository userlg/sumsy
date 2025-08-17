import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import { SummariesView } from '@/modules/summaries';
import { CasesView } from '@/modules/cases';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/summaries', component: SummariesView },
    { path: '/cases', component: CasesView },
  ],
});
