import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import EditModal from '@/shared/components/EditModal.vue';
import { useUserStore } from '@/stores/user.store';

describe('EditModal.vue', () => {
  const mountComponent = (props = {}) => {
    return mount(EditModal, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
      props: {
        modelValue: true,
        title: 'Test Modal',
        initialName: 'Initial Name',
        placeHolder: 'Enter name',
        userStore: useUserStore(), // We'll mock this or let pinia handle it
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
    const wrapper = mountComponent({ isDev: true, initialDate: '01-01-23' });

    // Check initial state
    const dateInputs = wrapper.findAll('input[type="text"]');
    // usually the second input is the date one if isDev is true
    const dateInput = dateInputs.length > 1 ? dateInputs[1] : null;
    expect((dateInput?.element as HTMLInputElement).value).toBe('01-01-23');

    // Update prop
    await wrapper.setProps({ initialDate: '05-05-25' });
    expect((dateInput?.element as HTMLInputElement).value).toBe('05-05-25');

    // Test clearing the date (undefined or empty) to cover the `|| ''` branch
    await wrapper.setProps({ initialDate: undefined });
    expect((dateInput?.element as HTMLInputElement).value).toBe('');
  });

  it('renders date input only when isDev is true', () => {
    const wrapperDev = mountComponent({ isDev: true });
    expect(wrapperDev.findAll('input').length).toBeGreaterThan(1); // Name + Date

    const wrapperProd = mountComponent({ isDev: false });
    expect(wrapperProd.findAll('input').length).toBe(1); // Only Name
  });

  it('emits save with date when isDev is true', async () => {
    const wrapper = mountComponent({ isDev: true, initialDate: '01-01-23' });
    const saveBtn = wrapper.find('#save-button');

    await saveBtn.trigger('click');

    expect(wrapper.emitted('save')).toBeTruthy();
    expect(wrapper.emitted('save')?.[0]).toEqual(['Initial Name', '01-01-23']);
  });
});
