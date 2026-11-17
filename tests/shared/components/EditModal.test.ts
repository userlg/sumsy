/**
 * @file EditModal.test.ts
 * @namespace tests.shared.components
 * @description Tests for the EditModal component
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EditModal from '@/shared/components/EditModal.vue';

describe('EditModal.vue', () => {
  const mountComponent = (props = {}) => {
    return mount(EditModal, {
      props: {
        modelValue: true,
        title: 'Test Modal',
        initialName: 'Initial Name',
        placeHolder: 'Enter name',
        ...props,
      },
    });
  };

  it('updates local name when initialName prop changes', async () => {
    const wrapper = mountComponent();
    await wrapper.setProps({ initialName: 'New Name' });
    const input = wrapper.find('input[type="text"]');
    expect((input.element as HTMLInputElement).value).toBe('New Name');
  });

  it('updates local date when initialDate prop changes', async () => {
    const wrapper = mountComponent({ initialDate: '01-01-23' });

    // The date input should always be visible now (type="date")
    const dateInput = wrapper.find('input[type="date"]');
    expect(dateInput.exists()).toBe(true);
    // Native date input expects YYYY-MM-DD; 01-01-23 -> 2023-01-01
    expect((dateInput.element as HTMLInputElement).value).toBe('2023-01-01');

    // Update prop to a new date
    await wrapper.setProps({ initialDate: '05-05-25' });
    expect((dateInput.element as HTMLInputElement).value).toBe('2025-05-05');

    // Test clearing the date (undefined or empty) to cover the `|| ''` branch
    await wrapper.setProps({ initialDate: undefined });
    expect(wrapper.find('input[type="date"]').exists()).toBe(false);
  });

  it('conditionally renders date input based on initialDate', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="date"]').exists()).toBe(false);
    expect(wrapper.findAll('input').length).toBe(1); // Name only
  });

  it('emits save with date in DD-MM-YY format', async () => {
    const wrapper = mountComponent({ initialDate: '01-01-23' });
    const saveBtn = wrapper.find('#save-button');

    await saveBtn.trigger('click');

    expect(wrapper.emitted('save')).toBeTruthy();
    // The save event should emit the DD-MM-YY format internally
    expect(wrapper.emitted('save')?.[0]).toEqual(['Initial Name', '01-01-23']);
  });
  it('updates internalDate when dateInputValue is changed (fromIsoDate)', async () => {
    const wrapper = mountComponent({ initialDate: '15-01-25' });
    const dateInput = wrapper.find('input[type="date"]');

    // Set native date input value to YYYY-MM-DD
    await dateInput.setValue('2024-12-31');

    // Trigger save to see if the emitted date is converted back to DD-MM-YY correctly
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Guardar')!
      .trigger('click');
    expect(wrapper.emitted('save')).toBeTruthy();
    expect(wrapper.emitted('save')![0]).toEqual(['Initial Name', '31-12-24']);
  });

  it('labels the date input', () => {
    const wrapper = mountComponent({ initialDate: '01-01-23' });
    const dateInput = wrapper.get('[data-test="input-edit-date"]');
    const label = wrapper.get(`label[for="${dateInput.attributes('id')}"]`);
    expect(label.text()).toBe('Fecha');
  });

  it('can be cancelled by default', async () => {
    const wrapper = mountComponent();
    await wrapper.get('#cancel-button').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('cannot be cancelled or dismissed with Escape when canCancel is false', () => {
    const wrapper = mountComponent({ canCancel: false });
    expect(wrapper.get('#cancel-button').attributes('disabled')).toBeDefined();

    // Escape reaches a native <dialog> as a cancelable 'cancel' event.
    const escape = new Event('cancel', { cancelable: true });
    wrapper.get('dialog').element.dispatchEvent(escape);
    expect(escape.defaultPrevented).toBe(true);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('does not save an empty name', async () => {
    const wrapper = mountComponent();
    await wrapper.get('#input-edit-modal').setValue('   ');
    await wrapper.get('#save-button').trigger('click');
    expect(wrapper.emitted('save')).toBeUndefined();
  });

  it('handles invalid date structures gracefully in fromIsoDate', async () => {
    const wrapper = mountComponent({ initialDate: '15-01-25' });
    const dateInput = wrapper.find('input[type="date"]');

    // Set native date input value to invalid format
    await dateInput.setValue('invalid-date');
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Guardar')!
      .trigger('click');

    expect(wrapper.emitted('save')).toBeTruthy();
    expect(wrapper.emitted('save')![0]).toEqual(['Initial Name', '']);
  });
});
