/**
 * @file Tooltip.test.ts
 * @namespace Tests.shared.components
 * @description Test for the Tooltip component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { mountFactory } from '@test/setup';
import Tooltip from '@/shared/components/Tooltip.vue';
import { DEFAULT_TOOLTIP_DELAY } from '@/shared/constants/tooltip.constants';

describe('Tooltip.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders slot content', async () => {
    const wrapper = await mountFactory({
      component: Tooltip,
      piniaState: {},
      componentProps: {
        text: 'Tooltip text',
      },
    });

    expect(wrapper.html()).toContain('<span');
  });

  it('does not show tooltip initially', async () => {
    const wrapper = await mountFactory({
      component: Tooltip,
      piniaState: {},
      initialRoute: '/',
      componentProps: {
        text: 'Tooltip text',
      },
    });

    expect(wrapper.find('[data-testid="tooltip"]').exists()).toBe(false);
  });

  it('shows tooltip after default delay on mouseenter', async () => {
    const wrapper = await mountFactory({
      component: Tooltip,
      componentProps: {
        text: '',
      },
    });

    await wrapper.find('span').trigger('mouseenter');

    vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY);
    await flushPromises();

    const tooltip = wrapper.find('[data-testid="tooltip"]');
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.text()).toBe('');
  });

  it('shows tooltip after custom delay', async () => {
    const wrapper = await mountFactory({
      component: Tooltip,
      componentProps: {
        text: 'Tooltip text',
      },
    });

    await wrapper.setProps({ text: 'Hello world', delay: 500 });
    await wrapper.find('span').trigger('mouseenter');

    vi.advanceTimersByTime(500);
    await flushPromises();

    const tooltip = wrapper.find('[data-testid="tooltip"]');
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.text()).toBe('Hello world');
  });

  it('hides tooltip on mouseleave before it appears', async () => {
    const wrapper = await mountFactory({
      component: Tooltip,
      componentProps: {
        text: 'Tooltip text',
      },
    });

    await wrapper.find('span').trigger('mouseenter');
    await wrapper.find('span').trigger('mouseleave');

    vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY);
    await flushPromises();

    expect(wrapper.find('[data-testid="tooltip"]').exists()).toBe(false);
  });

  it('hides tooltip on mouseleave after it appears', async () => {
    const wrapper = await mountFactory({
      component: Tooltip,
      componentProps: {
        text: 'Tooltip text',
      },
    });

    await wrapper.setProps({ text: 'Bye' });
    await wrapper.find('span').trigger('mouseenter');

    vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY);
    await flushPromises();

    expect(wrapper.find('[data-testid="tooltip"]').exists()).toBe(true);

    await wrapper.find('span').trigger('mouseleave');
    await flushPromises();

    expect(wrapper.find('[data-testid="tooltip"]').exists()).toBe(false);
  });

  it('clears timeout when component is unmounted', async () => {
    const clearSpy = vi.spyOn(global, 'clearTimeout');

    const wrapper = await mountFactory({
      component: Tooltip,
      componentProps: {
        text: 'Tooltip text',
      },
    });

    await wrapper.find('span').trigger('mouseenter');
    wrapper.unmount();

    expect(clearSpy).toHaveBeenCalled();
  });
});
