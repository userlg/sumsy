import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import App from '@/App.vue';
import { router } from '@test/index';

describe('App.vue', () => {
  it('should render NavBar and Footer components', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createTestingPinia(), router],
      },
    });

    await router.isReady();

    expect(wrapper.text()).toContain('Sumsy');

    expect(wrapper.text()).toContain(
      'Sumsy Inicio Resumen CasosModo claro activadoIntroduce tu nombre Cancelar  Guardar  Sumsy  © 2025 Sumsy — Todos los derechos reservados'
    );
  });
});
