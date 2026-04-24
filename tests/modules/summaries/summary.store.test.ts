/**
 * @file summary.store.test.ts
 * @namespace tests.modules.summaries
 * @description Tests for the summary store (verifies it is a valid listStore instance)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSummaryStore } from '@/modules/summaries/store/summary.store';

describe('Summary Store', () => {
  let store: ReturnType<typeof useSummaryStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useSummaryStore();
  });

  it('initializes with empty list', () => {
    expect(store.list).toEqual([]);
    expect(store.nextId).toBe(1);
    expect(store.nextElement).toBe(1);
    expect(store.isReversed).toBe(false);
  });

  it('creates a summary item', () => {
    store.create('Test Summary');
    expect(store.list.length).toBe(1);
    expect(store.list[0].name).toBe('Test Summary');
  });

  it('deletes a summary item', () => {
    store.create('To Delete');
    store.delete(1);
    expect(store.list.length).toBe(0);
  });

  it('updates a summary item', () => {
    store.create('Original');
    store.update(1, { name: 'Updated' });
    expect(store.list[0].name).toBe('Updated');
  });

  it('clears all summaries', () => {
    store.create('A');
    store.create('B');
    store.clearAll();
    expect(store.list).toEqual([]);
  });

  it('seeds dummy data', () => {
    store.seed(10, 'Resumen');
    expect(store.list.length).toBe(10);
    expect(store.list[0].name).toContain('Resumen');
  });
});
