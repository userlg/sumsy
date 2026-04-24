/**
 * @file PasteClipBoard.test.ts
 * @namespace tests.shared.components
 * @description Tests for the PasteClipBoard component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PasteClipBoard from '@/shared/components/PasteClipBoard.vue';

describe('PasteClipBoard.vue', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the paste button', () => {
    const wrapper = mount(PasteClipBoard);
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('emits pasted event with trimmed clipboard text on success', async () => {
    const clipboardText = '  Hello World  ';
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        readText: vi.fn().mockResolvedValue(clipboardText),
      },
      configurable: true,
      writable: true,
    });

    const wrapper = mount(PasteClipBoard);
    await wrapper.find('button').trigger('click');

    // Wait for the async operation
    await vi.dynamicImportSettled();
    await wrapper.vm.$nextTick();

    // Wait for promise to resolve
    await new Promise((r) => setTimeout(r, 0));
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('pasted')).toBeTruthy();
    expect(wrapper.emitted('pasted')![0]).toEqual(['Hello World']);
  });

  it('shows loading indicator while reading clipboard', async () => {
    let resolveClipboard: (value: string) => void;
    const clipboardPromise = new Promise<string>((resolve) => {
      resolveClipboard = resolve;
    });

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        readText: vi.fn().mockReturnValue(clipboardPromise),
      },
      configurable: true,
      writable: true,
    });

    const wrapper = mount(PasteClipBoard);
    await wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();

    // Should show loading state
    expect(wrapper.find('.animate-pulse').exists()).toBe(true);
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();

    // Resolve the promise
    resolveClipboard!('text');
    await new Promise((r) => setTimeout(r, 0));
    await wrapper.vm.$nextTick();

    // Loading should be done
    expect(wrapper.find('.animate-pulse').exists()).toBe(false);
  });

  it('handles clipboard read error gracefully', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        readText: vi.fn().mockRejectedValue(new Error('Permission denied')),
      },
      configurable: true,
      writable: true,
    });

    const wrapper = mount(PasteClipBoard);
    await wrapper.find('button').trigger('click');
    await new Promise((r) => setTimeout(r, 0));
    await wrapper.vm.$nextTick();

    expect(alertSpy).toHaveBeenCalled();
    expect(wrapper.emitted('pasted')).toBeFalsy();

    alertSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
