/**
 * @file BaseModal.test.ts
 * @namespace tests.shared.components
 * @description Tests for the dialog shell: naming and closing rules (focus is the browser's job)
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

  const dialog = (w: VueWrapper) => w.get('dialog');

  it('is a native modal dialog named by its title', async () => {
    const w = mountModal();
    await flushPromises();
    const element = dialog(w).element as HTMLDialogElement;
    expect(element.open).toBe(true);
    expect(w.get(`#${dialog(w).attributes('aria-labelledby')}`).text()).toBe('Título');
  });

  it('renders no content while closed', () => {
    const w = mountModal({ modelValue: false });
    expect((dialog(w).element as HTMLDialogElement).open).toBe(false);
    expect(w.find('[data-test="first"]').exists()).toBe(false);
  });

  it('keeps v-model in step when the browser closes it (Escape, closedby)', async () => {
    const w = mountModal();
    await dialog(w).trigger('close');
    expect(w.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('lets Escape through only when dismissible', () => {
    const cancel = () => new Event('cancel', { cancelable: true });

    const open = mountModal();
    const allowed = cancel();
    dialog(open).element.dispatchEvent(allowed);
    expect(allowed.defaultPrevented).toBe(false);
    open.unmount();

    const locked = mountModal({ dismissible: false });
    const blocked = cancel();
    dialog(locked).element.dispatchEvent(blocked);
    expect(blocked.defaultPrevented).toBe(true);
  });

  it('tells the browser how it may close', () => {
    expect(dialog(mountModal()).attributes('closedby')).toBe('closerequest');
    wrapper?.unmount();
    expect(dialog(mountModal({ closeOnBackdrop: true })).attributes('closedby')).toBe('any');
    wrapper?.unmount();
    expect(
      dialog(mountModal({ dismissible: false, closeOnBackdrop: true })).attributes('closedby')
    ).toBe('none');
  });

  it('ignores the backdrop when not dismissible', async () => {
    const w = mountModal({ dismissible: false, closeOnBackdrop: true });
    await dialog(w).trigger('click');
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('closes on a backdrop click only when closeOnBackdrop is set', async () => {
    const kept = mountModal();
    await dialog(kept).trigger('click');
    expect(kept.emitted('update:modelValue')).toBeUndefined();
    kept.unmount();

    // A click whose target is the <dialog> itself landed on the backdrop.
    const closed = mountModal({ closeOnBackdrop: true });
    await dialog(closed).trigger('click');
    expect(closed.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('does not close when the content is clicked', async () => {
    const w = mountModal({ closeOnBackdrop: true });
    await w.get('[data-test="first"]').trigger('click');
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('applies the size width', () => {
    expect(dialog(mountModal({ size: 'xl' })).classes()).toContain('max-w-xl');
  });
});
