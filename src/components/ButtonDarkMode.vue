<!-- src/components/DarkModeToggle.vue -->
<template>
  <button @click="changeMode()">Mode</button>
</template>

<script setup lang="ts">
 function changeMode(): void {
  const isDark = document.documentElement.classList.contains('dark')

  if (isDark) {
    // Cambiar a modo claro
    localStorage.theme = 'light'
    document.documentElement.classList.remove('dark')
  } else {
    // Cambiar a modo oscuro
    localStorage.theme = 'dark'
    document.documentElement.classList.add('dark')
  }
}
</script>
