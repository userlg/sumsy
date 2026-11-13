/**
 * @file ShareDonut.test.ts
 * @namespace tests.shared.components
 * @description Tests for the all-time share doughnut
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ShareDonut from '@/shared/components/ShareDonut.vue';

describe('ShareDonut.vue', () => {
  it('shows each share as a percentage of the all-time total', () => {
    const wrapper = mount(ShareDonut, { props: { summaries: 3, cases: 1 } });
    const text = wrapper.text();
    expect(text).toContain('75 %');
    expect(text).toContain('25 %');
    expect(text).toContain('Total de todos los tiempos');
    expect(wrapper.find('figure').attributes('aria-label')).toBe(
      'Resúmenes: 3 (75 %), Casos: 1 (25 %), Extras: 0 (0 %)'
    );
  });

  it('shows the larger share in the center', () => {
    const wrapper = mount(ShareDonut, { props: { summaries: 1, cases: 2 } });
    expect(wrapper.find('figcaption').text()).toMatch(/66,7\s?%/);
    expect(wrapper.find('figcaption').text()).toContain('Casos');
  });

  it('closes the ring when only one list has items', () => {
    const wrapper = mount(ShareDonut, { props: { summaries: 5, cases: 0 } });
    expect(wrapper.text()).toContain('100 %');
    expect(wrapper.text()).toContain('0 %');
  });

  it('shows extra cases as their own share', () => {
    const wrapper = mount(ShareDonut, { props: { summaries: 2, cases: 1, extras: 1 } });
    expect(wrapper.find('figure').attributes('aria-label')).toBe(
      'Resúmenes: 2 (50 %), Casos: 1 (25 %), Extras: 1 (25 %)'
    );
    expect(wrapper.text()).toContain('Extras');
  });
});
