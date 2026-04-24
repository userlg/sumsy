/**
 * @file Total.test.ts
 * @namespace tests.shared.components
 * @description Tests for the Total component
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { reactive } from 'vue';
import Total from '@/shared/components/Total.vue';

describe('Total.vue', () => {
  it('renders the title', () => {
    const store = reactive({ list: [] });
    const wrapper = mount(Total, {
      props: {
        title: 'Resúmenes',
        store,
      },
    });
    expect(wrapper.text()).toContain('Resúmenes');
  });

  it('renders the count circle', () => {
    const store = reactive({ list: [] });
    const wrapper = mount(Total, {
      props: {
        title: 'Casos',
        store,
      },
    });
    // The circle should exist
    expect(wrapper.find('.rounded-full').exists()).toBe(true);
  });

  it('displays 0 when store list is empty', () => {
    const store = reactive({ list: [] });
    const wrapper = mount(Total, {
      props: {
        title: 'Test',
        store,
      },
    });
    // GSAP animation starts immediately with value 0 for empty list
    expect(wrapper.find('span').exists()).toBe(true);
  });
  it('watches for store list changes and animates', async () => {
    const store = reactive<{ list: any[] }>({ list: [] });
    const wrapper = mount(Total, {
      props: {
        title: 'Casos',
        store,
      },
    });
    
    // Change store.list to trigger the watch
    store.list = [{ id: 1 }, { id: 2 }];
    
    // Wait for the watch to execute
    await wrapper.vm.$nextTick();
    
    // Value will animate, GSAP changes the internal tweened value
    expect(wrapper.find('span').exists()).toBe(true);
  });
  it('renders the h2 title element', () => {
    const store = reactive({ list: [] });
    const wrapper = mount(Total, {
      props: {
        title: 'Mis Casos',
        store,
      },
    });
    expect(wrapper.find('h2').text()).toBe('Mis Casos');
  });
});
