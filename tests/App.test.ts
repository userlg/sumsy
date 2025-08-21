/**
 * @file App.test.ts
 * @namespace Tests
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
    const store = useUserStore();
    store.name = 'Jhon Doe';

    expect(wrapper.text()).toContain('Sumsy');

    expect(wrapper.text()).toContain(
      'Sumsy Inicio Resumen CasosJhon DoeLight mode enabledIntroduce tu nombre Cancelar  Guardar  Sumsy  © 2025 Sumsy — Todos los derechos reservados'
    );
  });
});
