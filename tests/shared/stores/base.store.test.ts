/**
 * @file base.store.test.ts
 * @namespace tests.shared.stores
 * @description Tests for the base store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { createListStore } from '@/shared/stores/base.store';

describe('Base Store', () => {
  let store: ReturnType<ReturnType<typeof createListStore>>;

  beforeEach(() => {
    setActivePinia(createPinia());
    const useTestStore = createListStore(`test-${Math.random()}`);
    store = useTestStore();
  });

  describe('create()', () => {
    it('adds a new item with correct properties', () => {
      store.create('Task A');

      expect(store.list.length).toBe(1);
      const item = store.list[0];

      expect(item.id).toBe(1);
      expect(item.name).toBe('Task A');
      expect(item.element).toBe(1);
      expect(item.date).toMatch(/^\d{2}-\d{2}-\d{2}$/); // format: DD-MM-YY
    });

    it('increments id and element sequentially', () => {
      store.create('Task 1');
      store.create('Task 2');

      expect(store.list[0].id).toBe(1);
      expect(store.list[1].id).toBe(2);
      expect(store.list[0].element).toBe(1);
      expect(store.list[1].element).toBe(2);
    });
  });

  describe('update()', () => {
    it('updates an existing item by id', () => {
      store.create('Old Task');
      store.update(1, { name: 'Updated Task' });

      expect(store.list[0].name).toBe('Updated Task');
    });

    it('does nothing if item does not exist', () => {
      store.create('Only Task');
      store.update(99, { name: 'Should not update' });

      expect(store.list[0].name).toBe('Only Task');
    });
  });

  describe('updateName()', () => {
    it('updates only the name of an item', () => {
      store.create('Initial');
      store.updateName(1, 'Renamed');

      expect(store.list[0].name).toBe('Renamed');
    });

    it('does nothing if id is not found', () => {
      store.create('Existing');
      store.updateName(99, 'Ignored');

      expect(store.list[0].name).toBe('Existing');
    });
  });

  describe('delete()', () => {
    it('removes an item from the list', () => {
      store.create('Task to remove');
      store.delete(1);

      expect(store.list.length).toBe(0);
    });

    it('does nothing if item does not exist', () => {
      store.create('Keep me');
      store.delete(99);

      expect(store.list.length).toBe(1);
    });
  });

  describe('reverseList()', () => {
    it('reverses the order of items and toggles isReversed', () => {
      store.create('First');
      store.create('Second');
      store.reverseList();

      expect(store.list[0].name).toBe('Second');
      expect(store.list[1].name).toBe('First');
      expect(store.isReversed).toBe(true);
    });
  });

  describe('clearAll()', () => {
    it('resets the store state', () => {
      store.create('Task 1');
      store.isReversed = true;

      store.clearAll();

      expect(store.list).toEqual([]);
      expect(store.nextId).toBe(1);
      expect(store.nextElement).toBe(1);
      expect(store.isReversed).toBe(false);
    });
  });

  describe('reindexAndSort()', () => {
    it('sorts items by element and reindexes them sequentially', () => {
      store.create('A');
      store.create('B');
      store.create('C');

      // Mess up the order manually
      store.list[0].element = 3;
      store.list[1].element = 1;
      store.list[2].element = 2;

      store.reindexAndSort();

      expect(store.list.map((i) => i.element)).toEqual([1, 2, 3]);
      expect(store.nextElement).toBe(4);
    });

    it('keeps list reversed if isReversed = true', () => {
      store.create('First');
      store.create('Second');
      store.isReversed = true;

      store.reindexAndSort();

      expect(store.list[0].name).toBe('Second');
      expect(store.list[1].name).toBe('First');
    });
  });

  describe('formatDate()', () => {
    it('formats a date as DD-MM-YY', () => {
      const fixedDate = new Date('2025-01-15T12:00:00Z');
      const formatted = store.formatDate(fixedDate);

      expect(formatted).toBe('15-01-25');
    });
  });
});
