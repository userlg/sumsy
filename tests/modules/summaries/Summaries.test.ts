/**
 * @file Summaries.test.ts
 * @namespace tests.modules.summaries.views
 * @description Tests for the Summaries view component
 */

import { describe, it, expect } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mountFactory } from '@test/setup';
import Summaries from '@/modules/summaries/views/Summaries.vue';
import { useSummaryStore } from '@/modules/summaries/store/summary.store';
import type { VueWrapper } from '@vue/test-utils';

describe('Summaries.vue', () => {
  async function mountSummaries(
    piniaState: Record<string, any> = { user: { name: 'Tester' } }
  ): Promise<VueWrapper> {
    return await mountFactory({
      component: Summaries,
      initialRoute: '/summaries',
      piniaState,
    });
  }

  it('renders the title "Resúmenes"', async () => {
    const wrapper = await mountSummaries();
    expect(wrapper.text()).toContain('Resúmenes');
  });

  it('renders the input and Agregar button', async () => {
    const wrapper = await mountSummaries();
    expect(wrapper.find('input[aria-label="Nombre del resumen"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Agregar');
  });

  it('adds a summary when entering a name and clicking Agregar', async () => {
    const wrapper = await mountSummaries();
    const summaryStore = useSummaryStore();

    const input = wrapper.find('input[aria-label="Nombre del resumen"]');
    await input.setValue('Test Summary');
    await wrapper.findAll('button').find((b) => b.text() === 'Agregar')!.trigger('click');
    await flushPromises();

    expect(summaryStore.list.length).toBe(1);
    expect(summaryStore.list[0].name).toBe('Test Summary');
  });

  it('shows error when trying to add empty name via enter', async () => {
    const wrapper = await mountSummaries();

    const input = wrapper.find('input[aria-label="Nombre del resumen"]');
    await input.setValue('   ');
    await input.trigger('keyup.enter');
    await flushPromises();

    expect(wrapper.text()).toContain('El nombre no puede estar vacío.');
  });

  it('handles child component events correctly', async () => {
    const wrapper = await mountSummaries();
    const summaryStore = useSummaryStore();
    summaryStore.create('Original');
    
    // Test onPasted from PasteClipboard
    const pasteClipboard = wrapper.findComponent({ name: 'PasteClipboard' });
    if (pasteClipboard.exists()) {
      pasteClipboard.vm.$emit('pasted', 'Pasted Text');
      await flushPromises();
      expect((wrapper.find('input[aria-label="Nombre del resumen"]').element as HTMLInputElement).value).toBe('Pasted Text');
    }

    // Test Table events
    const table = wrapper.findComponent({ name: 'BaseTable' });
    if (table.exists()) {
      // Edit
      table.vm.$emit('editSummary', 1, 'Edited', '15-05-25');
      expect(summaryStore.list[0].name).toBe('Edited');

      // Reverse
      table.vm.$emit('reverse');
      expect(summaryStore.isReversed).toBe(true);

      // Delete
      table.vm.$emit('deleteSummary', 1);
      expect(summaryStore.list.length).toBe(0);

      // Clear
      summaryStore.create('Another');
      table.vm.$emit('clear');
      expect(summaryStore.list.length).toBe(0);
    }
  });

  it('clears input after successful add', async () => {
    const wrapper = await mountSummaries();

    const input = wrapper.find('input[aria-label="Nombre del resumen"]');
    await input.setValue('Test Summary');
    await wrapper.findAll('button').find((b) => b.text() === 'Agregar')!.trigger('click');
    await flushPromises();

    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('adds a summary via Enter key', async () => {
    const wrapper = await mountSummaries();
    const summaryStore = useSummaryStore();

    const input = wrapper.find('input[aria-label="Nombre del resumen"]');
    await input.setValue('Enter Summary');
    await input.trigger('keyup.enter');
    await flushPromises();

    expect(summaryStore.list.length).toBe(1);
    expect(summaryStore.list[0].name).toBe('Enter Summary');
  });

  it('shows "No hay resúmenes disponibles." when list is empty', async () => {
    const wrapper = await mountSummaries();
    expect(wrapper.text()).toContain('No hay resúmenes disponibles.');
  });
});
