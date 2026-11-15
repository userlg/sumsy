/**
 * @file BaseModal.test.ts
 * @namespace tests.shared.components
 * @description Tests for the dialog shell: naming, closing and focus handling
 */

import { describe, it, expect, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import BaseModal from '@/shared/components/BaseModal.vue';

describe('BaseModal.vue', () => {
  let wrapper: VueWrapper | undefined;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    document.body.innerHTML = '';
  });

  // attachTo: focus only works on elements inside the document.
  const mountModal = (props: Record<string, unknown> = {}) => {
    wrapper = mount(BaseModal, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Título', ...props },
      slots: {
        default: '<input data-test="first" /><input data-test="second" />',
        footer: '<button data-test="last">OK</button>',
      },
    });
    return wrapper;
  };

  const dialog = (w: VueWrapper) => w.get('[role="dialog"]');

  it('is a modal dialog named by its title', () => {
    const w = mountModal();
    const titleId = dialog(w).attributes('aria-labelledby');
    expect(dialog(w).attributes('aria-modal')).toBe('true');
    expect(w.get(`#${titleId}`).text()).toBe('Título');
  });

  it('renders nothing while closed', () => {
    const w = mountModal({ modelValue: false });
    expect(w.find('[role="dialog"]').exists()).toBe(false);
  });

  it('closes with Escape', async () => {
    const w = mountModal();
    await dialog(w).trigger('keydown', { key: 'Escape' });
    expect(w.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('ignores Escape and the backdrop when not dismissible', async () => {
    const w = mountModal({ dismissible: false, closeOnBackdrop: true });
    await dialog(w).trigger('keydown', { key: 'Escape' });
    await w.get('.fixed.inset-0').trigger('click');
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('closes on a backdrop click only when closeOnBackdrop is set', async () => {
    const kept = mountModal();
    await kept.get('.fixed.inset-0').trigger('click');
    expect(kept.emitted('update:modelValue')).toBeUndefined();
    kept.unmount();

    const closed = mountModal({ closeOnBackdrop: true });
    await closed.get('.fixed.inset-0').trigger('click');
    expect(closed.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('does not close when the panel itself is clicked', async () => {
    const w = mountModal({ closeOnBackdrop: true });
    await dialog(w).trigger('click');
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('moves focus to the first control when it opens', async () => {
    const w = mountModal();
    await flushPromises();
    expect(document.activeElement).toBe(w.get('[data-test="first"]').element);
  });

  it('wraps Tab from the last control to the first and Shift+Tab back', async () => {
    const w = mountModal();
    await flushPromises();
    const first = w.get('[data-test="first"]').element as HTMLElement;
    const last = w.get('[data-test="last"]').element as HTMLElement;

    last.focus();
    await dialog(w).trigger('keydown', { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    await dialog(w).trigger('keydown', { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it('returns focus to the control that opened it', async () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();

    const w = mountModal({ modelValue: false });
    await w.setProps({ modelValue: true });
    await flushPromises();
    expect(document.activeElement).not.toBe(opener);

    await w.setProps({ modelValue: false });
    await flushPromises();
    expect(document.activeElement).toBe(opener);
  });

  it('applies the size width', () => {
    expect(dialog(mountModal({ size: 'xl' })).classes()).toContain('max-w-xl');
  });
});
