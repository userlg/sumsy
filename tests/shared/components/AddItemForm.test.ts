/**
 * @file AddItemForm.test.ts
 * @namespace tests.shared.components
 * @description Tests for the shared add form of the summaries and cases pages
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AddItemForm from '@/shared/components/AddItemForm.vue';
import PasteClipboard from '@/shared/components/PasteClipBoard.vue';

describe('AddItemForm.vue', () => {
  const mountForm = () =>
    mount(AddItemForm, {
      props: { label: 'Nombre del caso' },
      slots: { default: '<label data-test="slot">Extra</label>' },
    });

  const input = (wrapper: ReturnType<typeof mountForm>) =>
    wrapper.get('input[aria-label="Nombre del caso"]');
  const addButton = (wrapper: ReturnType<typeof mountForm>) =>
    wrapper.findAll('button').find((b) => b.text() === 'Agregar')!;

  it('emits the trimmed name and clears the input', async () => {
    const wrapper = mountForm();
    await input(wrapper).setValue('  Caso 1  ');
    await addButton(wrapper).trigger('click');

    expect(wrapper.emitted('add')).toEqual([['Caso 1']]);
    expect((input(wrapper).element as HTMLInputElement).value).toBe('');
  });

  it('submits with Enter', async () => {
    const wrapper = mountForm();
    await input(wrapper).setValue('Caso 2');
    await input(wrapper).trigger('keyup.enter');
    expect(wrapper.emitted('add')).toEqual([['Caso 2']]);
  });

  it('disables Agregar while the input is empty', async () => {
    const wrapper = mountForm();
    expect(addButton(wrapper).attributes('disabled')).toBeDefined();
    await input(wrapper).setValue('x');
    expect(addButton(wrapper).attributes('disabled')).toBeUndefined();
  });

  it('shows an error tied to the input for an empty name', async () => {
    const wrapper = mountForm();
    await input(wrapper).setValue('   ');
    await input(wrapper).trigger('keyup.enter');

    const error = wrapper.get('[role="alert"]');
    expect(error.text()).toBe('El nombre no puede estar vacío.');
    expect(input(wrapper).attributes('aria-invalid')).toBe('true');
    expect(input(wrapper).attributes('aria-describedby')).toBe(error.attributes('id'));
    expect(wrapper.emitted('add')).toBeUndefined();
  });

  it('fills the input from the clipboard and clears the error', async () => {
    const wrapper = mountForm();
    await input(wrapper).trigger('keyup.enter');
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    wrapper.findComponent(PasteClipboard).vm.$emit('pasted', 'Pegado');
    await wrapper.vm.$nextTick();

    expect((input(wrapper).element as HTMLInputElement).value).toBe('Pegado');
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it('shows a clipboard error', async () => {
    const wrapper = mountForm();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    wrapper.findComponent(PasteClipboard).vm.$emit('error', 'No se pudo leer el portapapeles.');
    await wrapper.vm.$nextTick();
    expect(wrapper.get('[role="alert"]').text()).toBe('No se pudo leer el portapapeles.');
  });

  it('renders the slot next to the input', () => {
    expect(mountForm().find('[data-test="slot"]').exists()).toBe(true);
  });
});
