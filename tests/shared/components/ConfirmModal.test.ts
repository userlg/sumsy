/**
 * @file ConfirmModal.test.ts
 * @namespace tests.shared.components
 * @description Tests for the ConfirmModal component
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfirmModal from '@/shared/components/ConfirmModal.vue';

describe('ConfirmModal.vue', () => {
  const mountComponent = (props = {}) => {
    return mount(ConfirmModal, {
      props: {
        modelValue: true,
        title: 'Confirm',
        message: 'Are you sure?',
        ...props,
      },
    });
  };

  it('renders the modal when modelValue is true', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Confirm');
    expect(wrapper.text()).toContain('Are you sure?');
  });

  it('does not render modal content when modelValue is false', () => {
    const wrapper = mountComponent({ modelValue: false });
    expect(wrapper.find('.fixed').exists()).toBe(false);
  });

  it('renders custom confirmText and cancelText', () => {
    const wrapper = mountComponent({
      confirmText: 'Yes, delete',
      cancelText: 'No, keep',
    });
    expect(wrapper.text()).toContain('Yes, delete');
    expect(wrapper.text()).toContain('No, keep');
  });

  it('renders default confirmText and cancelText when not provided', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Confirmar');
    expect(wrapper.text()).toContain('Cancelar');
  });

  it('emits confirm and update:modelValue when confirm button is clicked', async () => {
    const wrapper = mountComponent();
    const confirmBtn = wrapper.findAll('button').find((b) => b.text().includes('Confirmar'));
    await confirmBtn!.trigger('click');

    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });

  it('emits update:modelValue(false) when cancel button is clicked', async () => {
    const wrapper = mountComponent();
    const cancelBtn = wrapper.findAll('button').find((b) => b.text().includes('Cancelar'));
    await cancelBtn!.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
    expect(wrapper.emitted('confirm')).toBeFalsy();
  });
});
