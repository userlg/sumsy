/**
 * @file HomeSidebar.test.ts
 * @namespace tests.shared.components
 * @description Tests for the HomeSidebar component
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeSidebar from '@/shared/components/HomeSidebar.vue';

describe('HomeSidebar.vue', () => {
  const mountComponent = (props = {}) => {
    return mount(HomeSidebar, {
      props: {
        hasData: true,
        isDev: true,
        hasUser: true,
        ...props,
      },
    });
  };

  it('renders the sidebar with section titles', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('aside').exists()).toBe(true);
    expect(wrapper.text()).toContain('Datos');
  });

  it('shows import button', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Importar');
  });

  it('shows export JSON and TXT buttons when hasData is true', () => {
    const wrapper = mountComponent({ hasData: true });
    expect(wrapper.text()).toContain('Exportar JSON');
    expect(wrapper.text()).toContain('Exportar TXT');
  });

  it('disables export buttons when hasData is false', () => {
    const wrapper = mountComponent({ hasData: false });
    const exportButtons = wrapper.findAll('button').filter((b) => b.text().includes('Exportar'));
    exportButtons.forEach((btn) => {
      expect(btn.attributes('disabled')).toBeDefined();
    });
  });

  it('shows profile section when hasUser is true', () => {
    const wrapper = mountComponent({ hasUser: true });
    expect(wrapper.text()).toContain('Perfil');
    expect(wrapper.text()).toContain('Cambiar nombre');
  });

  it('hides profile section when hasUser is false', () => {
    const wrapper = mountComponent({ hasUser: false });
    expect(wrapper.text()).not.toContain('Perfil');
    expect(wrapper.text()).not.toContain('Cambiar nombre');
  });

  it('shows dev section when isDev is true', () => {
    const wrapper = mountComponent({ isDev: true });
    expect(wrapper.text()).toContain('Dev');
    expect(wrapper.text()).toContain('Cargar Datos');
  });

  it('hides dev section when isDev is false', () => {
    const wrapper = mountComponent({ isDev: false });
    expect(wrapper.text()).not.toContain('Dev');
    expect(wrapper.text()).not.toContain('Cargar Datos');
  });

  it('shows clear name button in dev section when hasUser is true', () => {
    const wrapper = mountComponent({ isDev: true, hasUser: true });
    expect(wrapper.text()).toContain('Borrar Nombre');
  });

  it('hides clear name button when hasUser is false in dev section', () => {
    const wrapper = mountComponent({ isDev: true, hasUser: false });
    expect(wrapper.text()).not.toContain('Borrar Nombre');
  });

  it('emits importClick when import button is clicked', async () => {
    const wrapper = mountComponent();
    const importBtn = wrapper.findAll('button').find((b) => b.text().includes('Importar'));
    await importBtn!.trigger('click');
    expect(wrapper.emitted('importClick')).toBeTruthy();
  });

  it('emits exportJson when export JSON button is clicked', async () => {
    const wrapper = mountComponent({ hasData: true });
    const exportBtn = wrapper.findAll('button').find((b) => b.text().includes('Exportar JSON'));
    await exportBtn!.trigger('click');
    expect(wrapper.emitted('exportJson')).toBeTruthy();
  });

  it('emits exportTxt when export TXT button is clicked', async () => {
    const wrapper = mountComponent({ hasData: true });
    const exportBtn = wrapper.findAll('button').find((b) => b.text().includes('Exportar TXT'));
    await exportBtn!.trigger('click');
    expect(wrapper.emitted('exportTxt')).toBeTruthy();
  });

  it('emits changeName when change name button is clicked', async () => {
    const wrapper = mountComponent({ hasUser: true });
    await wrapper.get('#change-name-button').trigger('click');
    expect(wrapper.emitted('changeName')).toBeTruthy();
  });

  it('emits seedData when seed data button is clicked', async () => {
    const wrapper = mountComponent({ isDev: true });
    await wrapper.get('#seed-summaries-button').trigger('click');
    expect(wrapper.emitted('seedData')).toBeTruthy();
  });

  it('emits clearName when clear name button is clicked', async () => {
    const wrapper = mountComponent({ isDev: true, hasUser: true });
    await wrapper.get('#clear-name-button').trigger('click');
    expect(wrapper.emitted('clearName')).toBeTruthy();
  });
});
