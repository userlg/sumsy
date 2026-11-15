/**
 * @file base.store.ts
 * @namespace src.shared.stores
 * @description  Base store to handle common state management logic summaries or cases
 */

import { defineStore } from 'pinia';
import { BaseItem } from '@/shared/interfaces/BaseItem';
import { formatItemDate, parseItemDate } from '@/shared/utils/date.utils';
import { mergeById } from '@/logic/export.logic';

export function createListStore(storeId: string) {
  return defineStore(storeId, {
    state: () => ({
      list: [] as BaseItem[],
      nextId: 1,
      nextElement: 1,
      isReversed: false,
    }),
    actions: {
      /** `extra` is only used by cases; it is stored only when true. */
      create(name: string, extra = false): void {
        const dateCurrent = new Date();
        const today = formatItemDate(dateCurrent);

        const newItem: BaseItem = {
          id: this.nextId++,
          name,
          date: today,
          element: this.nextElement++,
          ...(extra && { extra: true }),
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
      /** Cases only: marks a case as extra, or back to normal. */
      toggleExtra(id: number): void {
        const item = this.list.find((i) => i.id === id);
        if (item) item.extra = !item.extra;
      },
      clearAll(): void {
        this.list = [];
        this.nextId = 1;
        this.nextElement = 1;
        this.isReversed = false;
      },
      /**
       * Orders the list by date (oldest first; same day keeps the order they were added in),
       * renumbers it and applies DESC if it is on. A case edited to an earlier day moves into place.
       */
      reindexAndSort(): void {
        const time = (item: BaseItem) => parseItemDate(item.date)?.getTime() ?? 0;
        this.list.sort((a, b) => time(a) - time(b) || a.element - b.element);
        this.list.forEach((item, index) => {
          item.element = index + 1;
        });
        this.nextElement = this.list.length + 1;
        if (this.isReversed) {
          this.list = [...this.list].reverse();
        }
      },
      /** Appends several items at once, keeping each one's own date (used by demo data). */
      addMany(entries: { name: string; date: string; extra?: boolean }[]): void {
        for (const { name, date, extra } of entries) {
          this.list.push({
            id: this.nextId++,
            name,
            date,
            element: this.nextElement++,
            ...(extra && { extra: true }),
          });
        }
        this.reindexAndSort();
      },
      /**
       * Adds or updates items from a backup by id, never replacing the whole list:
       * importing one month must not erase the others.
       */
      importItems(items: BaseItem[]): void {
        if (items.length === 0) return;
        this.list = mergeById(this.list, items);
        this.nextId = Math.max(0, ...this.list.map((item) => item.id)) + 1;
        this.reindexAndSort();
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
          const formattedDate = formatItemDate(randomDate);

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
