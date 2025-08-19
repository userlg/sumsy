import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { mountFactory } from '@test/index';
import Home from '@/pages/Home.vue';
import { useUserStore } from '@/stores/user.store';

const wrapper = await mountFactory();

describe('Home.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should render NavBar and Footer components', () => {
    expect(wrapper.find('[data-test="edit-modal"]').exists()).toBe(true);
  });

  it('render the title sumsy "Sumsy"', () => {
    expect(wrapper.text()).toContain('Sumsy');
  });

  it('Set the initial username through modal', async () => {
    vi.useFakeTimers();

    const wrapper = await mountFactory({
      component: Home,
      initialRoute: '/',
    });

    const store = useUserStore();
    store.name = '';
    store.setName = vi.fn((newName: string) => {
      store.name = newName;
    });

    vi.runAllTimers();
    await flushPromises();

    // Modal visible
    const input = wrapper.get('#input-edit-modal');
    await input.setValue('Jhon Doe');
    await wrapper.get('#save-button').trigger('click');

    // Ahora sí debería estar el mensaje
    const welcome = wrapper.get('#welcome-message');
    expect(welcome.text()).toContain('Bienvenido, Jhon Doe');

    vi.useRealTimers();
  });
});
