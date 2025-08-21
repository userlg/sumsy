/**
 * @file Home.test.ts
 * @namespace Tests.pages
 * @description Tests del componente Home.vue
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mountFactory } from '@test/setup';
import Home from '@/pages/Home.vue';
import { useUserStore } from '@/stores/user.store';
import type { VueWrapper } from '@vue/test-utils';

describe('Home.vue', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  async function mountHome(piniaState: Record<string, any> = { user: { name: '' } }) {
    vi.useFakeTimers();
    const wrapper = await mountFactory({
      component: Home,
      initialRoute: '/',
      piniaState,
    });
    vi.runAllTimers();
    await flushPromises();
    return wrapper;
  }

  async function fillModal(wrapper: VueWrapper, name: string) {
    const input = wrapper.get('#input-edit-modal');
    await input.setValue(name);
    await wrapper.get('#save-button').trigger('click');
    await flushPromises();
  }

  it('sets the initial username through the modal', async () => {
    const wrapper = await mountHome({ user: { name: '' } });
    await fillModal(wrapper, 'John Doe');

    const userStore = useUserStore();
    expect(userStore.getName).toBe('John Doe');

    const welcome = wrapper.get('#welcome-message');
    expect(welcome.text()).toContain('Bienvenido, John Doe');
  });

  it('edits the username through the change name button', async () => {
    const wrapper = await mountHome();
    const store = useUserStore();
    store.setName('Fake Name');

    await flushPromises();

    await wrapper.get('#change-name-button').trigger('click');
    await fillModal(wrapper, 'John Doe');

    const welcome = wrapper.get('#welcome-message');
    expect(welcome.text()).toContain('Bienvenido, John Doe');
  });

  it('deletes the username using the clear name button', async () => {
    const wrapper = await mountHome();
    const store = useUserStore();
    store.setName('Fake Name');

    await flushPromises();

    const button = wrapper.get('#clear-name-button');
    await button.trigger('click');

    expect(store.getName).toBe('');
  });
});
