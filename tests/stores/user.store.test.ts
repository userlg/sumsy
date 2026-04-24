/**
 * @file user.store.test.ts
 * @namespace tests.stores
 * @description Tests for the user store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@/stores/user.store';

describe('userStore', () => {
  let store: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
  });

  it('has empty name by default', () => {
    expect(store.name).toBe('');
    expect(store.getName).toBe('');
  });

  it('setName updates the name', () => {
    store.setName('John Doe');
    expect(store.name).toBe('John Doe');
    expect(store.getName).toBe('John Doe');
  });

  it('setName trims and sets correctly', () => {
    store.setName('  Alice  ');
    expect(store.getName).toBe('  Alice  ');
  });

  it('clearName resets name to empty', () => {
    store.setName('John Doe');
    store.clearName();
    expect(store.name).toBe('');
    expect(store.getName).toBe('');
  });

  it('getName getter returns current name', () => {
    expect(store.getName).toBe('');
    store.setName('Test');
    expect(store.getName).toBe('Test');
  });
});
