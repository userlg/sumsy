/**
 * @file HomeSidebar.test.ts
 * @namespace tests.shared.components
 * @description Tests for the HomeSidebar component
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HomeSidebar from '@/shared/components/HomeSidebar.vue';

/** Last value emitted through v-model:scope. */
function lastScope(wrapper: { emitted: (event: string) => unknown[][] | undefined }): unknown[] {
  const emitted = wrapper.emitted('update:scope') ?? [];
  return emitted[emitted.length - 1];
}

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
    expect(wrapper.find('#seed-demo-button').exists()).toBe(false);
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

  it('emits seedDemo when the demo button is clicked', async () => {
    const wrapper = mountComponent({ isDev: true });
    await wrapper.get('#seed-demo-button').trigger('click');
    expect(wrapper.emitted('seedDemo')).toBeTruthy();
  });

  it('emits clearName when clear name button is clicked', async () => {
    const wrapper = mountComponent({ isDev: true, hasUser: true });
    await wrapper.get('#clear-name-button').trigger('click');
    expect(wrapper.emitted('clearName')).toBeTruthy();
  });

  it('defaults the export period to the current month and shows its counts', () => {
    const wrapper = mountComponent({ summaryCount: 3, caseCount: 1 });
    const now = new Date();
    expect(wrapper.get('#export-year').text()).toBe(String(now.getFullYear()));
    expect((wrapper.get('#export-month').element as HTMLSelectElement).value).toBe(
      String(now.getMonth() + 1)
    );
    const shown = wrapper.findAll('#export-month option')[now.getMonth()];
    expect(shown.text()).not.toMatch(/\d/);
    expect(wrapper.text()).toContain('3 resúmenes · 1 caso · 0 extras');
  });

  it('emits the picked month and the full backup scope', async () => {
    const wrapper = mountComponent();
    const year = new Date().getFullYear() - 1;
    await wrapper.get('#export-year-prev').trigger('click');
    await wrapper.get('#export-month').setValue('9');
    expect(lastScope(wrapper)).toEqual([`${year}-09`]);

    await wrapper.get('input[type="checkbox"]').setValue(true);
    expect(lastScope(wrapper)).toEqual(['all']);
    expect(wrapper.get('#export-month').attributes('disabled')).toBeDefined();
    expect(wrapper.get('#export-year-prev').attributes('disabled')).toBeDefined();

    await wrapper.get('input[type="checkbox"]').setValue(false);
    expect(lastScope(wrapper)).toEqual([`${year}-09`]);
  });

  it('never moves past the current month', async () => {
    const wrapper = mountComponent();
    const now = new Date();
    expect(wrapper.get('#export-year-next').attributes('disabled')).toBeDefined();

    // From December of last year, stepping forward lands on this month at most.
    await wrapper.get('#export-year-prev').trigger('click');
    await wrapper.get('#export-month').setValue('12');
    await wrapper.get('#export-year-next').trigger('click');
    const month = Math.min(12, now.getMonth() + 1);
    expect(lastScope(wrapper)).toEqual([`${now.getFullYear()}-${String(month).padStart(2, '0')}`]);

    const future = wrapper.findAll('#export-month option').slice(now.getMonth() + 1);
    expect(future.every((option) => option.attributes('disabled') !== undefined)).toBe(true);
  });

  it('shows zero counts when the period is empty', () => {
    const wrapper = mountComponent({ hasData: false });
    expect(wrapper.text()).toContain('0 resúmenes · 0 casos · 0 extras');
  });

  it('shows the extra cases of the period', () => {
    const wrapper = mountComponent({ summaryCount: 2, caseCount: 5, extraCount: 1 });
    expect(wrapper.text()).toContain('2 resúmenes · 5 casos · 1 extra');
  });
});
