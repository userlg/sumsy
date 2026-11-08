/**
 * @file ActivityHeatmap.test.ts
 * @namespace tests.shared.components
 * @description Tests for the activity calendar component
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ActivityHeatmap from '@/shared/components/ActivityHeatmap.vue';

const today = new Date(2026, 10, 3);

function mountHeatmap(summaryDates: string[] = [], caseDates: string[] = []) {
  return mount(ActivityHeatmap, {
    props: { summaryDates, caseDates, today },
    attachTo: document.body,
  });
}

describe('ActivityHeatmap.vue', () => {
  it('shows the yearly total', () => {
    const wrapper = mountHeatmap(['03-11-26', '03-11-26'], ['02-11-26']);
    expect(wrapper.text()).toContain('3 registros en el último año');
  });

  it('paints a cell per day with its level and a readable label', () => {
    const wrapper = mountHeatmap(['03-11-26', '03-11-26'], ['03-11-26']);
    const cell = wrapper.find('[data-key="2026-11-03"]');
    expect(cell.attributes('data-level')).toBe('2');
    expect(cell.attributes('aria-label')).toContain('3 registros (2 resúmenes, 1 caso)');
  });

  it('filters by source', async () => {
    const wrapper = mountHeatmap(['03-11-26'], ['03-11-26', '02-11-26']);
    const casesButton = wrapper.findAll('button').find((b) => b.text() === 'Casos')!;
    await casesButton.trigger('click');
    expect(casesButton.attributes('aria-pressed')).toBe('true');
    expect(wrapper.text()).toContain('2 registros en el último año');
  });

  it('keeps a single tab stop on today and moves it with the arrow keys', async () => {
    const wrapper = mountHeatmap();
    const focusable = wrapper.findAll('[data-key][tabindex="0"]');
    expect(focusable).toHaveLength(1);
    expect(focusable[0].attributes('data-key')).toBe('2026-11-03');

    await focusable[0].trigger('keydown', { key: 'ArrowUp' });
    expect(wrapper.find('[data-key="2026-11-02"]').attributes('tabindex')).toBe('0');
  });

  it('shows a tooltip on hover and hides it on leave', async () => {
    const wrapper = mountHeatmap(['03-11-26']);
    await wrapper.find('[data-key="2026-11-03"]').trigger('mouseenter');
    expect(wrapper.find('[role="status"]').text()).toContain('1 registro');

    await wrapper.find('.activity-grid').trigger('mouseleave');
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });
});
