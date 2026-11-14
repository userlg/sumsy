/**
 * @file Tooltip.test.ts
 * @namespace tests.shared.components
 * @description Tests for the accessible Tooltip (hover, keyboard focus, Escape, touch)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { h } from 'vue';
import Tooltip from '@/shared/components/Tooltip.vue';
import { DEFAULT_TOOLTIP_DELAY } from '@/shared/constants/tooltip.constants';

const bubble = () => document.body.querySelector<HTMLElement>('[role="tooltip"]');

function mountTooltip(buttonAttrs: Record<string, string> = { 'aria-label': 'Editar Caso 1' }) {
  return mount(Tooltip, {
    props: { text: 'Editar' },
    slots: { default: () => h('button', buttonAttrs, 'icono') },
    attachTo: document.body,
  });
}

/** Hovers with a mouse and lets the opening delay pass. */
async function hover(wrapper: VueWrapper, pointerType = 'mouse') {
  await wrapper.find('span').trigger('pointerenter', { pointerType });
  vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY);
  await wrapper.vm.$nextTick();
}

describe('Tooltip.vue', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.useRealTimers();
  });

  it('renders the control and nothing else until needed', () => {
    wrapper = mountTooltip();
    expect(wrapper.find('button').exists()).toBe(true);
    expect(bubble()).toBeNull();
  });

  it('opens on mouse hover after the delay, as role="tooltip"', async () => {
    wrapper = mountTooltip();
    await wrapper.find('span').trigger('pointerenter', { pointerType: 'mouse' });
    vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY - 1);
    await wrapper.vm.$nextTick();
    expect(bubble()).toBeNull();

    vi.advanceTimersByTime(1);
    await wrapper.vm.$nextTick();
    expect(bubble()?.textContent?.trim()).toBe('Editar');
  });

  it('never opens on touch', async () => {
    wrapper = mountTooltip();
    await hover(wrapper, 'touch');
    expect(bubble()).toBeNull();
  });

  it('closes with Escape (WCAG 1.4.13, dismissible)', async () => {
    wrapper = mountTooltip();
    await hover(wrapper);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();
    expect(bubble()).toBeNull();
  });

  it('stays open while the pointer moves onto it (hoverable)', async () => {
    wrapper = mountTooltip();
    await hover(wrapper);
    await wrapper.find('span').trigger('pointerleave');
    bubble()!.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();
    expect(bubble()).not.toBeNull();
  });

  it('closes when the pointer leaves', async () => {
    wrapper = mountTooltip();
    await hover(wrapper);
    await wrapper.find('span').trigger('pointerleave');
    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();
    expect(bubble()).toBeNull();
  });

  it('does not repeat itself to screen readers when the control has a name', async () => {
    wrapper = mountTooltip();
    await hover(wrapper);
    expect(wrapper.find('button').attributes('aria-describedby')).toBeUndefined();
  });

  it('describes a control that has no name of its own, only while open', async () => {
    wrapper = mountTooltip({});
    await hover(wrapper);
    const id = bubble()!.id;
    expect(wrapper.find('button').attributes('aria-describedby')).toBe(id);

    await wrapper.find('span').trigger('pointerleave');
    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('button').attributes('aria-describedby')).toBeUndefined();
  });

  it('opens on keyboard focus but not on a mouse click focus', async () => {
    wrapper = mountTooltip();
    const button = wrapper.find('button').element;
    const matches = vi.spyOn(button, 'matches');

    matches.mockReturnValue(false);
    await wrapper.find('button').trigger('focusin');
    vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY);
    await wrapper.vm.$nextTick();
    expect(bubble()).toBeNull();

    matches.mockReturnValue(true);
    await wrapper.find('button').trigger('focusin');
    vi.advanceTimersByTime(DEFAULT_TOOLTIP_DELAY);
    await wrapper.vm.$nextTick();
    expect(bubble()).not.toBeNull();

    await wrapper.find('button').trigger('focusout');
    await wrapper.vm.$nextTick();
    expect(bubble()).toBeNull();
  });
});
