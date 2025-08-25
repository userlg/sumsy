/**
 * @file home.logic.test.ts
 * @namespace tests.logic
 * @description Test for the home.logic
 */

import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import { initHome } from '@/logic/home.logic';
import { useUserStore } from '@/stores/user.store';
import { createTestingPinia } from '@pinia/testing';

describe('initHome', () => {
  it('calls openNameModal(false) when name is undefined', () => {
    const pinia = createTestingPinia({
      initialState: { user: { name: undefined } },
      stubActions: false,
    });
    const userStore = useUserStore(pinia);

    const showContent = ref(false);
    const openNameModal = vi.fn();

    initHome(userStore, showContent, openNameModal, 0);

    expect(openNameModal).toHaveBeenCalledWith(false);
  });

  it('calls openNameModal(false) when name is empty string', () => {
    const pinia = createTestingPinia({
      initialState: { user: { name: '' } },
      stubActions: false,
    });
    const userStore = useUserStore(pinia);

    const showContent = ref(false);
    const openNameModal = vi.fn();

    initHome(userStore, showContent, openNameModal, 0);

    expect(openNameModal).toHaveBeenCalledWith(false);
  });

  it('sets showContent to true after the delay', () => {
    const pinia = createTestingPinia({
      initialState: { user: { name: 'John Doe' } },
      stubActions: false,
    });
    const userStore = useUserStore(pinia);

    const showContent = ref(false);
    const openNameModal = vi.fn();

    vi.useFakeTimers();
    initHome(userStore, showContent, openNameModal, 100);
    vi.advanceTimersByTime(100);

    expect(showContent.value).toBe(true);
    vi.useRealTimers();
  });
});
