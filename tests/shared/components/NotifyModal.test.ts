/**
 * @file NotifyModal.test.ts
 * @namespace tests.shared.components
 * @description Tests for the NotifyModal component
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NotifyModal from '@/shared/components/NotifyModal.vue';

describe('NotifyModal.vue', () => {
  const mountComponent = (props = {}) => {
    return mount(NotifyModal, {
      props: {
        modelValue: true,
        title: 'Success',
        message: 'Operation completed.',
        type: 'success' as const,
        ...props,
      },
    });
  };

  it('renders the modal when modelValue is true', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Success');
    expect(wrapper.text()).toContain('Operation completed.');
  });

  it('shows success icon when type is success', () => {
    const wrapper = mountComponent({ type: 'success' });
    expect(wrapper.find('.bg-emerald-100').exists()).toBe(true);
  });

  it('shows error icon when type is error', () => {
    const wrapper = mountComponent({ type: 'error' });
    expect(wrapper.find('.bg-red-100').exists()).toBe(true);
  });

  it('shows info icon when type is info', () => {
    const wrapper = mountComponent({ type: 'info' });
    expect(wrapper.find('.bg-blue-100').exists()).toBe(true);
  });

  it('shows info icon by default when no type is provided', () => {
    const wrapper = mountComponent({ type: undefined });
    expect(wrapper.find('.bg-blue-100').exists()).toBe(true);
  });

  it('emits update:modelValue(false) when Aceptar button is clicked', async () => {
    const wrapper = mountComponent();
    await wrapper.get('#notify-accept-button').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });

  it('emits update:modelValue(false) when clicking overlay background', async () => {
    const wrapper = mountComponent();
    const overlay = wrapper.find('[data-test="notify-modal"]');
    await overlay.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });
});
