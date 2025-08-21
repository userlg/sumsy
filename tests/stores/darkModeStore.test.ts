/**
 * @file darkModeStore.test.ts
 * @namespace Tests.stores
 * @description Test for the darkModeStore
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useDarkModeStore } from '@/stores/darkModeStore';

describe('darkModeStore', () => {
  let store: ReturnType<typeof useDarkModeStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useDarkModeStore();

    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('has dark mode disabled by default', () => {
    expect(store.darkIsActive).toBe(false);
    expect(store.isDarkMode).toBe(false);
  });

  it('setTheme(true) enables dark mode', () => {
    store.setTheme(true);

    expect(store.darkIsActive).toBe(true);
    expect(localStorage.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('setTheme(false) disables dark mode', () => {
    store.setTheme(false);

    expect(store.darkIsActive).toBe(false);
    expect(localStorage.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggleDarkMode toggles the theme', () => {
    expect(store.darkIsActive).toBe(false);

    store.toggleDarkMode();
    expect(store.darkIsActive).toBe(true);

    store.toggleDarkMode();
    expect(store.darkIsActive).toBe(false);
  });

  it('initTheme sets dark mode if localStorage.theme is dark', () => {
    localStorage.theme = 'dark';
    store.initTheme();

    expect(store.darkIsActive).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('initTheme sets light mode if localStorage.theme is light', () => {
    localStorage.theme = 'light';
    store.initTheme();

    expect(store.darkIsActive).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('initTheme respects prefers-color-scheme if no localStorage.theme', () => {
    // Simulate prefers dark
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    store.initTheme();

    expect(store.darkIsActive).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    vi.restoreAllMocks();
  });

  it('changeMode toggles correctly', () => {
    // Start with light
    store.setTheme(false);

    store.changeMode();
    expect(store.darkIsActive).toBe(true);
    expect(localStorage.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    store.changeMode();
    expect(store.darkIsActive).toBe(false);
    expect(localStorage.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
