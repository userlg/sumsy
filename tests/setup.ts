/**
 * @file setup.ts
 * @namespace Tests
 * @description setup file to export the mountFactory function
 */

import { mount, VueWrapper } from '@vue/test-utils';
import { vi } from 'vitest';
import { createRouter, createWebHistory, Router } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';

import App from '@/App.vue';
import Home from '@/pages/Home.vue';
import { SummariesView } from '@/modules/summaries';
import { CasesView } from '@/modules/cases';

type MountOptions = {
  component?: any;
  initialRoute?: string;
  piniaState?: Record<string, any>;
  componentProps?: Record<string, any>;
};

export function createTestRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/summaries', component: SummariesView },
      { path: '/cases', component: CasesView },
    ],
  });
}

export async function mountFactory(options: MountOptions = {}): Promise<VueWrapper> {
  const router = createTestRouter();

  const wrapper = mount(options.component ?? App, {
    props: options.componentProps,
    global: {
      plugins: [
        createTestingPinia({
          initialState: options.piniaState,
          stubActions: false,
          createSpy: vi.fn,
        }),
        router,
      ],
    },
  });

  if (options.initialRoute) {
    await router.push(options.initialRoute);
    await router.isReady();
  }

  return wrapper;
}
