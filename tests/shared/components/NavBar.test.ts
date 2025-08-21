/**
 * @file NavBar.test.ts
 * @namespace Tests.shared.components
 * @description Tests del componente NavBar.vue
 */

import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import Navbar from '@/shared/components/NavBar.vue';
import { mountFactory } from '@test/setup';

describe('Navbar.vue', () => {
  it('renders username when user has a non-empty name', async () => {
    const wrapper = await mountFactory({
      component: Navbar,
      initialRoute: '/',
      piniaState: { user: { name: 'John Doe' } },
    });
    expect(wrapper.text()).toContain('John Doe');
  });

  it('does not render username when name is empty', async () => {
    const wrapper = await mountFactory({
      component: Navbar,
      initialRoute: '/',
      piniaState: { user: { name: '' } },
    });
    expect(wrapper.text()).not.toContain('John Doe');
  });

  it('does not render username when name has only spaces', async () => {
    const wrapper = await mountFactory({
      component: Navbar,
      initialRoute: '/',
      piniaState: { user: { name: '   ' } },
    });
    expect(wrapper.text()).not.toContain('   ');
  });

  it('toggles the mobile menu when clicking the burger button', async () => {
    const wrapper = await mountFactory({
      component: Navbar,
      initialRoute: '/',
      piniaState: { user: { name: 'John Doe' } },
    });

    expect(wrapper.findAll('nav').length).toBe(1);

    // Abrir menú móvil
    await wrapper.get('button[aria-label="Menú"]').trigger('click');
    await nextTick();
    expect(wrapper.findAll('nav').length).toBe(2);

    // Cerrar menú móvil
    await wrapper.get('button[aria-label="Menú"]').trigger('click');
    await nextTick();
    expect(wrapper.findAll('nav').length).toBe(1);
  });
});
