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
    changeMode(): void {
      if (this.darkIsActive) {
        localStorage.theme = 'light';
        document.documentElement.classList.remove('dark');
      } else {
        localStorage.theme = 'dark';
        document.documentElement.classList.add('dark');
      }
      this.toggleDarkMode();
    },
  },
});
