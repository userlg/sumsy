/**
 * @file case.store.test.ts
 * @namespace tests.modules.cases
 * @description Tests for the case store (verifies it is a valid listStore instance)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCaseStore } from '@/modules/cases/store/case.store';

describe('Case Store', () => {
  let store: ReturnType<typeof useCaseStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useCaseStore();
  });

  it('initializes with empty list', () => {
    expect(store.list).toEqual([]);
    expect(store.nextId).toBe(1);
    expect(store.nextElement).toBe(1);
    expect(store.isReversed).toBe(false);
  });

  it('creates a case item', () => {
    store.create('Test Case');
    expect(store.list.length).toBe(1);
    expect(store.list[0].name).toBe('Test Case');
  });

  it('deletes a case item', () => {
    store.create('To Delete');
    store.delete(1);
    expect(store.list.length).toBe(0);
  });

  it('updates a case item', () => {
    store.create('Original');
    store.update(1, { name: 'Updated' });
    expect(store.list[0].name).toBe('Updated');
  });

  it('clears all cases', () => {
    store.create('A');
    store.create('B');
    store.clearAll();
    expect(store.list).toEqual([]);
  });
});
