/**
 * @file user.store.ts
 * @namespace Stores
 * @description Store global para manejar el nombre del usuario
 */

import { defineStore } from 'pinia';

interface UserState {
  name: string;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: '',
  }),
  persist: true,
  getters: {
    getName: (state) => state.name,
  },

  actions: {
    setName(newName: string): void {
      this.name = newName;
    },
    clearName(): void {
      this.name = '';
    },
  },
});
