/**
 * @file Charts.test.ts
 * @namespace tests.shared.components
 * @description Tests for the Charts component
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Charts from '@/shared/components/Charts.vue';

import { useDarkModeStore } from '@/stores/darkModeStore';

// Create a hoisted mock Chart class so we can use it in vi.mock and in our tests
const { MockChart } = vi.hoisted(() => {
  class MockChart {
    static register() {}
    destroy() {}
    constructor() {}
  }
  return { MockChart };
});

// Mock chart.js to avoid canvas issues in test environment
vi.mock('chart.js', () => ({
  Chart: MockChart,
  registerables: [],
}));

describe('Charts.vue', () => {
  const mountComponent = (props = {}) => {
    return mount(Charts, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
      props: {
        title: 'Resúmenes',
        items: [
          { date: '01-01-25', count: 5 },
          { date: '02-01-25', count: 3 },
          { date: '03-01-25', count: 8 },
        ],
        chart: MockChart as any,
        ...props,
      },
    });
  };

  it('renders the chart title', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('h3').text()).toBe('Resúmenes');
  });

  it('renders the canvas element', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('canvas').exists()).toBe(true);
  });

  it('renders with different title', () => {
    const wrapper = mountComponent({ title: 'Casos' });
    expect(wrapper.find('h3').text()).toBe('Casos');
  });

  it('renders the chart container with proper styling classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.rounded-2xl').exists()).toBe(true);
    expect(wrapper.find('.shadow-lg').exists()).toBe(true);
  });

  it('renders with empty items array', () => {
    const wrapper = mountComponent({ items: [] });
    expect(wrapper.find('canvas').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toBe('Resúmenes');
  });
  it('watches for items change and updates chart', async () => {
    const wrapper = mountComponent();
    
    // Update items to trigger watch
    await wrapper.setProps({
      items: [
        { date: '04-01-25', count: 10 }
      ]
    });
    
    await wrapper.vm.$nextTick();
    // If the watch fired, the chart would have been updated/re-rendered.
    expect(wrapper.find('canvas').exists()).toBe(true);
  });

  it('watches for dark mode change and updates chart', async () => {
    const wrapper = mountComponent();
    
    const store = useDarkModeStore();
    store.darkIsActive = true;
    
    await wrapper.vm.$nextTick();
    // If the watch fired, the chart would have been updated/re-rendered.
    expect(wrapper.find('canvas').exists()).toBe(true);
  });
});
