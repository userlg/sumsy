import { describe, it, expect, vi, afterEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mountFactory } from '@test/setup';
import Home from '@/pages/Home.vue';
import { useUserStore } from '@/stores/user.store';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

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

  it('Set the initial username through modal', async () => {
    const wrapper = await mountHome({ user: { name: '' } });
    await fillModal(wrapper, 'Jhon Doe');

    const userStore = useUserStore();
    expect(userStore.getName).toBe('Jhon Doe'); // ahora sí cambia

    const welcome = wrapper.get('#welcome-message');
    expect(welcome.text()).toContain('Bienvenido, Jhon Doe');
  });

  it('When username is loaded edit name with edit modal', async () => {
    const wrapper = await mountHome();
    const store = useUserStore();
    store.setName('Fake Name');

    await flushPromises();

    await wrapper.get('#change-name-button').trigger('click');
    await fillModal(wrapper, 'Jhon Doe');

    const welcome = wrapper.get('#welcome-message');
    expect(welcome.text()).toContain('Bienvenido, Jhon Doe');
  });
  it('abre modal en modo edición al hacer click en "Cambiar nombre"', async () => {
    const wrapper = await mountFactory({
      component: Home,
      initialRoute: '/',
      piniaState: {
        user: { name: 'Pepe' },
        ui: { showNameModal: false }, // si tu store tiene control del modal
      },
    });
    vi.useFakeTimers();

    await flushPromises();

    const button = wrapper.get('#change-name-button'); // ahora sí debería existir
    await button.trigger('click');

    // El modal debería abrirse en modo edición
    expect(wrapper.find('#input-edit-modal').exists()).toBe(true);
    expect(wrapper.html()).toContain('Editar nombre');
  });
});

describe('Cobertura del if (!userStore.getName || trim... === "")', () => {
  it('abre modal cuando getName es undefined', async () => {
    const pinia = createTestingPinia({
      initialState: { user: { name: undefined } }, // fuerza primera parte del OR
      stubActions: false,
    });

    const wrapper = mount(Home, { global: { plugins: [pinia] } });
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#input-edit-modal').exists()).toBe(true);
  });

  it('abre modal cuando getName es string vacío', async () => {
    const pinia = createTestingPinia({
      initialState: { user: { name: '' } }, // fuerza la segunda parte del OR
      stubActions: false,
    });

    const wrapper = mount(Home, { global: { plugins: [pinia] } });
    await wrapper.vm.$nextTick();

    expect(wrapper.find('#input-edit-modal').exists()).toBe(true);
  });
});
