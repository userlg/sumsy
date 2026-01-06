/**
 * @file App.test.ts
 * @namespace tests
 * @description Testing App.vue component
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mountFactory } from '@test/setup';
import App from '@/App.vue';
import { useUserStore } from '@/stores/user.store';
import type { VueWrapper } from '@vue/test-utils';

let wrapper: VueWrapper;

describe('App.vue', () => {
  beforeEach(async () => {
    wrapper = await mountFactory({
      component: App,
      initialRoute: '/',
    });

    const store = useUserStore();
    store.name = 'Jhon Doe';
  });

  it('should render NavBar and Footer components', () => {
    // Check for headers and footers as generic checks for presence
    // Ideally we should check by component type but imports are tricky in test setup sometimes
    expect(wrapper.find('header').exists()).toBe(true);
    expect(wrapper.find('footer').exists()).toBe(true);
  });
});
