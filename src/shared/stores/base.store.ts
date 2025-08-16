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
    },
    persist: true,
  });
}
