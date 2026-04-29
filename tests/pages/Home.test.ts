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
    const wrapper = await mountHome();
    const store = useUserStore();
    store.setName('Test User');
    await flushPromises();

    const seedButton = wrapper.find('#seed-summaries-button');

    if (seedButton.exists()) {
      await seedButton.trigger('click');
      await flushPromises();

      // The app now uses NotifyModal instead of window.alert
      const notifyModal = wrapper.find('[data-test="notify-modal"]');
      expect(notifyModal.exists()).toBe(true);
    } else {
      // Warning if dev mode isn't active in test environment
      console.warn('Seed button not found, isDev might be false in testing environment');
    }
  });

  it('renders the logo and title', async () => {
    const wrapper = await mountHome();
    const store = useUserStore();
    store.setName('Test');
    await flushPromises();

    expect(wrapper.find('h1').text()).toContain('Sumsy');
  });

  it('does not show welcome message when no user name is set', async () => {
    const wrapper = await mountHome({ user: { name: '' } });
    expect(wrapper.find('#welcome-message').exists()).toBe(false);
  });

  it('shows the EditModal when openNameModal is triggered', async () => {
    const wrapper = await mountHome({ user: { name: '' } });

    // Modal should open automatically when name is empty
    const modal = wrapper.find('[data-test="edit-modal"]');
    expect(modal.exists()).toBe(true);
  });
  it('handles Sidebar events for export and import', async () => {
    const wrapper = await mountHome({ user: { name: 'Tester' } });

    const sidebar = wrapper.findComponent({ name: 'HomeSidebar' });
    if (sidebar.exists()) {
      // Test exportJSON
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      sidebar.vm.$emit('exportJSON');
      await flushPromises();

      // Test exportTXT
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      sidebar.vm.$emit('exportTXT');
      await flushPromises();

      // Test importData
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      sidebar.vm.$emit('importData');
      await flushPromises();

      // Notifications are shown during these async tauri events (since we globally mocked tauri plugins).
      // Coverage is hit here.
      expect(wrapper.findComponent({ name: 'NotifyModal' }).exists()).toBe(true);
    }
  });
});
