<script setup lang="ts">
  /**
   * @file Graphs.vue
   * @namespace src.pages
   * @description View to show the statistics
   *
   * @component
   * @example
   * <Graphs />
   */

  import { useSummaryStore } from '@/modules/summaries/store/summary.store';
  import { useCaseStore } from '@/modules/cases/store/case.store';
  import Charts from '@/shared/components/Charts.vue';

  const summaryStore = useSummaryStore();
  const caseStore = useCaseStore();
</script>

<template>
  <div class="container mx-auto px-4 py-8 animate-fade-in-up">
    <h1 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
      Estadísticas General
    </h1>

    <div
      v-if="summaryStore.list.length > 0 || caseStore.list.length > 0"
      :class="[
        'grid gap-8 transition-all duration-300',
        summaryStore.list.length > 0 && caseStore.list.length > 0
          ? 'grid-cols-1 lg:grid-cols-2'
          : 'grid-cols-1 max-w-5xl mx-auto',
      ]"
    >
      <!-- Summaries Chart -->
      <div v-if="summaryStore.list.length > 0" class="col-span-1">
        <Charts title="Resúmenes" :items="summaryStore.getItemsGroupedByDate" />
      </div>

      <!-- Cases Chart -->
      <div v-if="caseStore.list.length > 0" class="col-span-1">
        <Charts title="Casos" :items="caseStore.getItemsGroupedByDate" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 opacity-60">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 text-gray-400 mb-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
        />
      </svg>
      <p class="text-xl text-gray-500 dark:text-gray-400 font-medium">No hay datos para mostrar</p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">
        Agrega resúmenes o casos para ver las estadísticas.
      </p>
    </div>
  </div>
</template>
