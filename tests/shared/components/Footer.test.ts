/**
 * @file Footer.test.ts
 * @namespace tests.shared.components
 * @description Testing Footer.vue component
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Footer from '@/shared/components/Footer.vue';

describe('Footer.vue', () => {
  it('should render correctly', () => {
    const wrapper = mount(Footer);
    expect(wrapper.find('footer').exists()).toBe(true);
    expect(wrapper.text()).toContain('Sumsy');
    expect(wrapper.text()).toContain('Todos los derechos reservados');
  });

  it('should display the current year', () => {
    const wrapper = mount(Footer);
    const currentYear = new Date().getFullYear().toString();
    expect(wrapper.text()).toContain(currentYear);
  });
});
