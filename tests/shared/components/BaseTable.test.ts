/**
 * @file BaseTable.test.ts
 * @namespace tests.shared.components
 * @description Tests for the BaseTable component
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import BaseTable from '@/shared/components/BaseTable.vue';
import { useUserStore } from '@/stores/user.store';
import type { BaseItem } from '@/shared/interfaces/BaseItem';

describe('BaseTable.vue', () => {
  function createItems(count: number): BaseItem[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      date: `0${(i % 9) + 1}-01-25`,
      element: i + 1,
    }));
  }

  const mountComponent = (props = {}) => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: { user: { name: 'Tester' } },
    });
    const userStore = useUserStore(pinia);

    return mount(BaseTable, {
      global: { plugins: [pinia] },
      props: {
        items: createItems(3),
        titleModalView: 'Detalles',
        isReversed: false,
        userStore,
        message: 'No hay items.',
        ...props,
      },
    });
  };

  it('renders items in the table', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).toContain('Item 2');
    expect(wrapper.text()).toContain('Item 3');
  });

  it('shows empty message when items is empty', () => {
    const wrapper = mountComponent({ items: [] });
    expect(wrapper.text()).toContain('No hay items.');
    expect(wrapper.find('table').exists()).toBe(false);
  });

  it('shows "Búsqueda sin resultado" when search yields no results', async () => {
    const wrapper = mountComponent();
    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue('nonexistent');

    expect(wrapper.text()).toContain('Búsqueda sin resultado');
  });

  it('filters items by search term', async () => {
    const wrapper = mountComponent();
    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue('Item 2');

    expect(wrapper.text()).toContain('Item 2');
    expect(wrapper.text()).not.toContain('Item 1');
    expect(wrapper.text()).not.toContain('Item 3');
  });

  it('shows ASC/DESC button text based on isReversed', () => {
    const wrapperAsc = mountComponent({ isReversed: false });
    expect(wrapperAsc.text()).toContain('DESC');

    const wrapperDesc = mountComponent({ isReversed: true });
    expect(wrapperDesc.text()).toContain('ASC');
  });

  it('emits reverse when ASC/DESC button is clicked', async () => {
    const wrapper = mountComponent();
    const reverseBtn = wrapper.findAll('button').find((b) => b.text() === 'DESC');
    await reverseBtn!.trigger('click');
    expect(wrapper.emitted('reverse')).toBeTruthy();
  });

  it('emits deleteSummary when delete button is clicked', async () => {
    const wrapper = mountComponent();
    const deleteBtn = wrapper.findAll('button[title="Borrar"]')[0];
    await deleteBtn.trigger('click');
    expect(wrapper.emitted('deleteSummary')).toBeTruthy();
    expect(wrapper.emitted('deleteSummary')![0]).toEqual([1]);
  });

  it('shows pagination when items exceed 20', () => {
    const wrapper = mountComponent({ items: createItems(25) });
    expect(wrapper.text()).toContain('Página 1 de 2');
    expect(wrapper.text()).toContain('Siguiente');
    expect(wrapper.text()).toContain('Anterior');
  });

  it('does not show pagination when items fit on one page', () => {
    const wrapper = mountComponent({ items: createItems(5) });
    expect(wrapper.text()).not.toContain('Página');
  });

  it('navigates pages with Siguiente and Anterior buttons', async () => {
    const wrapper = mountComponent({ items: createItems(25) });

    // Click Siguiente
    const nextBtn = wrapper.findAll('button').find((b) => b.text() === 'Siguiente');
    await nextBtn!.trigger('click');
    expect(wrapper.text()).toContain('Página 2 de 2');

    // Click Anterior
    const prevBtn = wrapper.findAll('button').find((b) => b.text() === 'Anterior');
    await prevBtn!.trigger('click');
    expect(wrapper.text()).toContain('Página 1 de 2');
  });

  it('opens confirm modal when "Borrar todo" is clicked', async () => {
    const wrapper = mountComponent();
    const clearBtn = wrapper.findAll('button').find((b) => b.text() === 'Borrar todo');
    await clearBtn!.trigger('click');

    // Confirm modal should now be visible
    expect(wrapper.text()).toContain('¿Seguro que quieres borrar todos los resúmenes?');
  });

  it('hides ASC/DESC and "Borrar todo" buttons when filteredItems is empty', async () => {
    const wrapper = mountComponent({ items: [] });
    expect(wrapper.findAll('button').filter((b) => b.text() === 'DESC').length).toBe(0);
    expect(wrapper.findAll('button').filter((b) => b.text() === 'Borrar todo').length).toBe(0);
  });

  it('shows table headers: #, Nombre, Fecha, Opciones', () => {
    const wrapper = mountComponent();
    const headers = wrapper.findAll('th');
    const headerTexts = headers.map((h) => h.text());
    expect(headerTexts).toContain('#');
    expect(headerTexts).toContain('Nombre');
    expect(headerTexts).toContain('Fecha');
    expect(headerTexts).toContain('Opciones');
  });
  it('handles ViewModal close event', async () => {
    const wrapper = mountComponent();
    // Click view button on first item
    await wrapper.findAll('button[title="Ver"]')[0].trigger('click');
    expect(wrapper.text()).toContain('Detalles');

    const viewModal = wrapper.findComponent({ name: 'ViewModal' });
    if (viewModal.exists()) {
      viewModal.vm.$emit('update:modelValue', false);
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent({ name: 'ViewModal' }).props('modelValue')).toBe(false);
    }
  });

  it('handles EditModal save and close events', async () => {
    const wrapper = mountComponent();
    // Click edit button on first item
    await wrapper.findAll('button[title="Editar"]')[0].trigger('click');
    
    const editModal = wrapper.findComponent({ name: 'EditModal' });
    if (editModal.exists()) {
      // Test save
      editModal.vm.$emit('save', 'New Name', '15-05-25');
      expect(wrapper.emitted('editSummary')).toBeTruthy();
      expect(wrapper.emitted('editSummary')![0]).toEqual([1, 'New Name', '15-05-25']);

      // Test close
      editModal.vm.$emit('update:modelValue', false);
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent({ name: 'EditModal' }).props('modelValue')).toBe(false);
    }
  });

  it('handles ConfirmModal confirm and close events', async () => {
    const wrapper = mountComponent();
    // Click clear all button
    await wrapper.findAll('button').find((b) => b.text() === 'Borrar todo')!.trigger('click');
    
    const confirmModal = wrapper.findComponent({ name: 'ConfirmModal' });
    if (confirmModal.exists()) {
      // Test confirm
      confirmModal.vm.$emit('confirm');
      expect(wrapper.emitted('clear')).toBeTruthy();

      // Test close
      confirmModal.vm.$emit('update:modelValue', false);
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent({ name: 'ConfirmModal' }).props('modelValue')).toBe(false);
    }
  });
});
