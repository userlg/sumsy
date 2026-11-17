/**
 * @file darkModeStore.ts
 * @namespace src.stores
 * @description Store para manejar el modo oscuro
 */
import { defineStore } from 'pinia';

export const useDarkModeStore = defineStore('darkMode', {
  state: () => ({
    darkIsActive: false,
  }),
  persist: true,
  getters: {
    isDarkMode: (state) => state.darkIsActive,
  },
  actions: {
    setTheme(isDark: boolean): void {
      this.darkIsActive = isDark;
      localStorage.theme = isDark ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', isDark);
      // Native UI painted before the CSS loads (and the CSS itself) follows the chosen theme.
      document
        .querySelector('meta[name="color-scheme"]')
        ?.setAttribute('content', isDark ? 'dark' : 'light');
    },

    toggleDarkMode(): void {
      this.setTheme(!this.darkIsActive);
    },

    initTheme(): void {
      const storedTheme = localStorage.theme;

      if (storedTheme === 'dark') {
        this.setTheme(true);
      } else if (storedTheme === 'light') {
        this.setTheme(false);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(prefersDark);
      }
    },
  },
});
