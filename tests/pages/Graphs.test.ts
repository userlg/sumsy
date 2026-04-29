/**
 * @file Graphs.test.ts
 * @namespace tests.pages
 * @description Tests for the Graphs page component
 */

import { describe, it, expect, vi } from 'vitest';
import { mountFactory } from '@test/setup';
import Graphs from '@/pages/Graphs.vue';
import { useSummaryStore } from '@/modules/summaries/store/summary.store';
import { useCaseStore } from '@/modules/cases/store/case.store';
import { flushPromises } from '@vue/test-utils';

// Mock Chart.js to avoid canvas rendering issues in tests
vi.mock('chart.js', () => ({
  Chart: class MockChart {
    static register() {}
    destroy() {}
    constructor() {}
  },
  registerables: [],
}));

describe('Graphs.vue', () => {
  it('renders the title "Estadísticas General"', async () => {
    const wrapper = await mountFactory({
      component: Graphs,
      initialRoute: '/graphs',
    });
    expect(wrapper.text()).toContain('Estadísticas General');
  });

  it('shows empty state when no data exists', async () => {
    const wrapper = await mountFactory({
      component: Graphs,
      initialRoute: '/graphs',
    });
    expect(wrapper.text()).toContain('No hay datos para mostrar');
    expect(wrapper.text()).toContain('Agrega resúmenes o casos para ver las estadísticas.');
  });

  it('shows charts when summaries data exists', async () => {
    const wrapper = await mountFactory({
      component: Graphs,
      initialRoute: '/graphs',
    });

    const summaryStore = useSummaryStore();
    summaryStore.list = [{ id: 1, name: 'S1', date: '01-01-25', element: 1 }];
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Resúmenes');
  });

  it('shows charts when cases data exists', async () => {
    const wrapper = await mountFactory({
      component: Graphs,
      initialRoute: '/graphs',
    });

    const caseStore = useCaseStore();
    caseStore.list = [{ id: 1, name: 'C1', date: '01-01-25', element: 1 }];
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Casos');
  });

  it('shows both charts when both summaries and cases have data', async () => {
    const wrapper = await mountFactory({
      component: Graphs,
      initialRoute: '/graphs',
    });

    const summaryStore = useSummaryStore();
    const caseStore = useCaseStore();
    summaryStore.list = [{ id: 1, name: 'S1', date: '01-01-25', element: 1 }];
    caseStore.list = [{ id: 1, name: 'C1', date: '01-01-25', element: 1 }];
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Resúmenes');
    expect(wrapper.text()).toContain('Casos');
  });

  it('shows the empty state SVG icon', async () => {
    const wrapper = await mountFactory({
      component: Graphs,
      initialRoute: '/graphs',
    });
    expect(wrapper.find('svg').exists()).toBe(true);
  });
});
