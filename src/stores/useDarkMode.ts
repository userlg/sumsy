import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDark = ref(document.documentElement.classList.contains('dark'))

  function setTheme(theme: 'light' | 'dark' | 'system') {
    if (theme === 'dark') {
      localStorage.theme = 'dark'
      document.documentElement.classList.add('dark')
      isDark.value = true
    } else if (theme === 'light') {
      localStorage.theme = 'light'
      document.documentElement.classList.remove('dark')
      isDark.value = false
    } else {
      localStorage.removeItem('theme')
      location.reload() // vuelve a aplicar según OS
    }
  }

  return { isDark, setTheme }
})