<script setup lang="ts">
  /**
   * @file ButtonDarkMode.vue
   * @namespace src.shared.components
   * @description Main button component for toggling dark mode
   *
   * @component
   * @example
   * <ButtonDarkMode />
   */

  import { computed } from 'vue';
  import { useDarkModeStore } from '@/stores/darkModeStore';
  import Tooltip from './Tooltip.vue';
  import MoonIcon from '@/shared/icons/moon.svg?component';
  import SunIcon from '@/shared/icons/sun.svg?component';

  const darkMode = useDarkModeStore();
  const label = computed(() =>
    darkMode.isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
  );
</script>
<template>
  <Tooltip :text="label" placement="bottom">
    <button
      id="toggle-dark-mode"
      class="flex items-center justify-center p-2 rounded-full bg-transparent border border-transparent text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors duration-200 ease-in-out focus:outline-none cursor-pointer select-none"
      :aria-label="label"
      @click="darkMode.toggleDarkMode()"
    >
      <template v-if="darkMode.isDarkMode">
        <!-- Moon icon -->
        <MoonIcon
          class="w-5 h-5 stroke-amber-300 stroke-2"
          data-test="icon-moon"
          aria-hidden="true"
        />
        <span class="sr-only">Dark mode enabled</span>
      </template>
      <template v-else>
        <!-- Sun icon -->
        <SunIcon
          class="w-6 h-6 stroke-2 stroke-yellow-300"
          data-test="icon-sun"
          aria-hidden="true"
        />
        <span class="sr-only">Light mode enabled</span>
      </template>
    </button>
  </Tooltip>
</template>
