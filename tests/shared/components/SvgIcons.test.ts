/**
 * @file SvgIcons.test.ts
 * @namespace tests.shared.components
 * @description Tests for SVG icon components (DeleteSvg, EditSvg, ViewSvg)
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DeleteSvg from '@/shared/components/DeleteSvg.vue';
import EditSvg from '@/shared/components/EditSvg.vue';
import ViewSvg from '@/shared/components/ViewSvg.vue';

describe('DeleteSvg.vue', () => {
  it('renders an SVG element', () => {
    const wrapper = mount(DeleteSvg);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('has the correct stroke classes', () => {
    const wrapper = mount(DeleteSvg);
    const svg = wrapper.find('svg');
    expect(svg.classes()).toContain('stroke-pink-500');
  });

  it('contains a path element', () => {
    const wrapper = mount(DeleteSvg);
    expect(wrapper.find('path').exists()).toBe(true);
  });
});

describe('EditSvg.vue', () => {
  it('renders an SVG element', () => {
    const wrapper = mount(EditSvg);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('has the correct stroke classes', () => {
    const wrapper = mount(EditSvg);
    const svg = wrapper.find('svg');
    expect(svg.classes()).toContain('stroke-gray-400');
  });

  it('contains a path element', () => {
    const wrapper = mount(EditSvg);
    expect(wrapper.find('path').exists()).toBe(true);
  });
});

describe('ViewSvg.vue', () => {
  it('renders an SVG element', () => {
    const wrapper = mount(ViewSvg);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('has the correct stroke classes', () => {
    const wrapper = mount(ViewSvg);
    const svg = wrapper.find('svg');
    expect(svg.classes()).toContain('stroke-green-600');
  });

  it('contains path elements', () => {
    const wrapper = mount(ViewSvg);
    expect(wrapper.findAll('path').length).toBeGreaterThanOrEqual(2);
  });
});
