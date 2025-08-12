<template>
  <div class="flex flex-col items-center justify-center space-y-2">
    <!-- Círculo -->
    <div
      class="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-sky-500 dark:border-blue-300 bg-white dark:bg-gray-800 shadow-md transition-all duration-500 hover:scale-105 hover:shadow-lg"
    >
      <span
        class="text-2xl font-bold transition-colors duration-500 text-gray-700 dark:text-gray-100 animate-pulse"
      >
        {{ props.total }}
      </span>
    </div>

    <!-- Título -->
    <h2
      class="text-sm font-medium text-gray-600 dark:text-gray-300 text-center"
    >
      {{ props.title }}
    </h2>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  total: number;
}>();
</script>
