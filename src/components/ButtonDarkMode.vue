<template>
  <button
    @click="darkMode.changeMode()"
    class="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:-rotate-1"
  >
    <span
      class="transition-transform duration-500"
      :class="darkMode.isDarkMode ? 'rotate-180' : ''"
    >
      {{ darkMode.isDarkMode ? "🌙" : "☀️" }}
    </span>
    <span class="font-medium">
      {{ darkMode.isDarkMode ? "Dark Mode" : "Light Mode" }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useDarkModeStore } from "@/stores/darkMode";

const darkMode = useDarkModeStore();
</script>
