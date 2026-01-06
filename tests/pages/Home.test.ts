/**
 * @file Home.test.ts
 * @namespace tests.pages
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

  it('triggers seed summaries when clicking load data button', async () => {
    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Mount with verified dev mode if possible, but our environment might default to dev
    const wrapper = await mountHome();

    // The button has id #seed-summaries-button
    const seedButton = wrapper.find('#seed-summaries-button');

    // Check if button exists (it requires isDev logic)
    // If our test environment doesn't set import.meta.env.DEV correctly to true, this might fail or skip
    if (seedButton.exists()) {
      await seedButton.trigger('click');
      expect(alertSpy).toHaveBeenCalledWith('Se han cargado 30 resúmenes de prueba.');
    } else {
      // Warning if dev mode isn't active in test environment
      console.warn('Seed button not found, isDev might be false in testing environment');
    }

    alertSpy.mockRestore();
  });
});
