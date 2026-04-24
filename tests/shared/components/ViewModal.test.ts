/**
 * @file ViewModal.test.ts
 * @namespace tests.shared.components
 * @description Tests for the ViewModal component
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ViewModal from '@/shared/components/ViewModal.vue';

describe('ViewModal.vue', () => {
  const mountComponent = (props = {}) => {
    return mount(ViewModal, {
      props: {
        modelValue: true,
        title: 'Detalles del Resumen',
        name: 'Test Item',
        id: 42,
        date: '15-01-25',
        ...props,
      },
    });
  };

  it('renders the modal when modelValue is true', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Detalles del Resumen');
    expect(wrapper.text()).toContain('Test Item');
    expect(wrapper.text()).toContain('42');
    expect(wrapper.text()).toContain('15-01-25');
  });

  it('does not render modal content when modelValue is false', () => {
    const wrapper = mountComponent({ modelValue: false });
    expect(wrapper.find('.fixed').exists()).toBe(false);
  });

  it('displays the item name in the content area', () => {
    const wrapper = mountComponent({ name: 'Nombre muy largo de prueba' });
    expect(wrapper.text()).toContain('Nombre muy largo de prueba');
  });

  it('displays the id and date in the grid', () => {
    const wrapper = mountComponent({ id: 7, date: '01-03-24' });
    expect(wrapper.text()).toContain('7');
    expect(wrapper.text()).toContain('01-03-24');
    expect(wrapper.text()).toContain('Fecha');
  });

  it('emits update:modelValue(false) when Volver button is clicked', async () => {
    const wrapper = mountComponent();
    const btn = wrapper.findAll('button').find((b) => b.text().includes('Volver'));
    await btn!.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });
});
