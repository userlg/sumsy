/**
 * @file Cases.test.ts
 * @namespace tests.modules.cases.views
 * @description Tests for the Cases view component
 */

import { describe, it, expect } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mountFactory } from '@test/setup';
import Cases from '@/modules/cases/views/Cases.vue';
import { useCaseStore } from '@/modules/cases/store/case.store';
import type { VueWrapper } from '@vue/test-utils';

describe('Cases.vue', () => {
  async function mountCases(
    piniaState: Record<string, any> = { user: { name: 'Tester' } }
  ): Promise<VueWrapper> {
    return await mountFactory({
      component: Cases,
      initialRoute: '/cases',
      piniaState,
    });
  }

  it('renders the title "Casos Extras"', async () => {
    const wrapper = await mountCases();
    expect(wrapper.text()).toContain('Casos Extras');
  });

  it('renders the input and Agregar button', async () => {
    const wrapper = await mountCases();
    expect(wrapper.find('input[aria-label="Nombre del caso"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Agregar');
  });

  it('adds a case when entering a name and clicking Agregar', async () => {
    const wrapper = await mountCases();
    const caseStore = useCaseStore();

    const input = wrapper.find('input[aria-label="Nombre del caso"]');
    await input.setValue('Test Case');
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Agregar')!
      .trigger('click');
    await flushPromises();

    expect(caseStore.list.length).toBe(1);
    expect(caseStore.list[0].name).toBe('Test Case');
  });

  it('shows error when trying to add empty name via enter', async () => {
    const wrapper = await mountCases();

    const input = wrapper.find('input[aria-label="Nombre del caso"]');
    await input.setValue('   ');
    await input.trigger('keyup.enter');
    await flushPromises();

    expect(wrapper.text()).toContain('El nombre no puede estar vacío.');
  });

  it('handles child component events correctly', async () => {
    const wrapper = await mountCases();
    const caseStore = useCaseStore();
    caseStore.create('Original');

    // Test onPasted from PasteClipboard
    const pasteClipboard = wrapper.findComponent({ name: 'PasteClipboard' });
    if (pasteClipboard.exists()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      pasteClipboard.vm.$emit('pasted', 'Pasted Text');
      await flushPromises();
      expect(
        (wrapper.find('input[aria-label="Nombre del caso"]').element as HTMLInputElement).value
      ).toBe('Pasted Text');
    }

    // Test Table events
    const table = wrapper.findComponent({ name: 'BaseTable' });
    if (table.exists()) {
      // Edit
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      table.vm.$emit('editSummary', 1, 'Edited', '15-05-25');
      expect(caseStore.list[0].name).toBe('Edited');

      // Reverse
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      table.vm.$emit('reverse');
      expect(caseStore.isReversed).toBe(true);

      // Delete
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      table.vm.$emit('deleteSummary', 1);
      expect(caseStore.list.length).toBe(0);

      // Clear
      caseStore.create('Another');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      table.vm.$emit('clear');
      expect(caseStore.list.length).toBe(0);
    }
  });

  it('clears input after successful add', async () => {
    const wrapper = await mountCases();

    const input = wrapper.find('input[aria-label="Nombre del caso"]');
    await input.setValue('Test Case');
    await wrapper
      .findAll('button')
      .find((b) => b.text() === 'Agregar')!
      .trigger('click');
    await flushPromises();

    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('adds a case via Enter key', async () => {
    const wrapper = await mountCases();
    const caseStore = useCaseStore();

    const input = wrapper.find('input[aria-label="Nombre del caso"]');
    await input.setValue('Enter Case');
    await input.trigger('keyup.enter');
    await flushPromises();

    expect(caseStore.list.length).toBe(1);
    expect(caseStore.list[0].name).toBe('Enter Case');
  });

  it('shows "No hay casos disponibles." when list is empty', async () => {
    const wrapper = await mountCases();
    expect(wrapper.text()).toContain('No hay casos disponibles.');
  });
});
