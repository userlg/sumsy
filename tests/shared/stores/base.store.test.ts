/**
 * @file base.store.test.ts
 * @namespace Tests.shared.stores
 * @description Test for the base store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { createListStore } from '@/shared/stores/base.store';

describe('createListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('agrega un item a la lista', () => {
    const useTestStore = createListStore('test');
    const store = useTestStore();

    store.create('Item de prueba');

    expect(store.list.length).toBe(1);
    expect(store.list[0].name).toBe('Item de prueba');
  });

  it('actualiza un item existente', () => {
    const useTestStore = createListStore('test2');
    const store = useTestStore();

    store.create('Item inicial');
    store.update(1, { name: 'Item actualizado' });

    expect(store.list[0].name).toBe('Item actualizado');
  });

  it('elimina un item', () => {
    const useTestStore = createListStore('test3');
    const store = useTestStore();

    store.create('A borrar');
    store.delete(1);

    expect(store.list.length).toBe(0);
  });
});
