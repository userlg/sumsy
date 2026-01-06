/**
 * @file base.store.ts
 * @namespace src.shared.stores
 * @description  Base store to handle common state management logic summaries or cases
 */

import { defineStore } from 'pinia';
import { BaseItem } from '@/shared/interfaces/BaseItem';

export function createListStore(storeId: string) {
  return defineStore(storeId, {
    state: () => ({
      list: [] as BaseItem[],
      nextId: 1,
      nextElement: 1,
      isReversed: false,
    }),
    getters: {
      getItemsGroupedByDate: (state) => {
        const groupedMap = new Map<string, number>();

        state.list.forEach((item) => {
          const count = groupedMap.get(item.date) || 0;
          groupedMap.set(item.date, count + 1);
        });

        const sortedEntries = Array.from(groupedMap.entries()).sort((a, b) => {
          // Parse date DD-MM-YY to verify order
          const [dayA, monthA, yearA] = a[0].split('-').map(Number);
          const [dayB, monthB, yearB] = b[0].split('-').map(Number);
          // Assume 20XX for year
          const dateA = new Date(2000 + yearA, monthA - 1, dayA);
          const dateB = new Date(2000 + yearB, monthB - 1, dayB);
          return dateA.getTime() - dateB.getTime();
        });

        return sortedEntries.map(([date, count]) => ({ date, count }));
      },
    },
    actions: {
      create(name: string): void {
        const dateCurrent = new Date();
        const today = this.formatDate(dateCurrent);

        const newItem: BaseItem = {
          id: this.nextId++,
          name,
          date: today,
          element: this.nextElement++,
        };

        this.list.push(newItem);

        this.reindexAndSort();
      },
      reverseList(): void {
        this.list = [...this.list].reverse();
        this.isReversed = !this.isReversed;
      },
      update(id: number, datos: Partial<BaseItem>): void {
        const idx = this.list.findIndex((r) => r.id === id);
        if (idx !== -1) {
          this.list[idx] = { ...this.list[idx], ...datos };
          this.reindexAndSort();
        }
      },
      delete(id: number): void {
        this.list = this.list.filter((r) => r.id !== id);
        this.reindexAndSort();
      },
      updateName(id: number, newName: string): void {
        const item = this.list.find((i) => i.id === id);
        if (item) {
          item.name = newName;
        }
      },

      clearAll(): void {
        this.list = [];
        this.nextId = 1;
        this.nextElement = 1;
        this.isReversed = false;
      },
      reindexAndSort(): void {
        this.list.sort((a, b) => a.element - b.element);
        this.list.forEach((item, index) => {
          item.element = index + 1;
        });
        this.nextElement = this.list.length + 1;
        if (this.isReversed) {
          this.list = [...this.list].reverse();
        }
      },
      formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
      },
      seed(count: number, prefix: string): void {
        const currentDate = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

        for (let i = 0; i < count; i++) {
          // Random date between one year ago and now
          const randomTimestamp =
            oneYearAgo.getTime() + Math.random() * (currentDate.getTime() - oneYearAgo.getTime());
          const randomDate = new Date(randomTimestamp);
          const formattedDate = this.formatDate(randomDate);

          const newItem: BaseItem = {
            id: this.nextId++,
            name: `${prefix} ${i + 1}`,
            date: formattedDate,
            element: this.nextElement++,
          };
          this.list.push(newItem);
        }
        this.reindexAndSort();
      },
    },
    persist: true,
  });
}
