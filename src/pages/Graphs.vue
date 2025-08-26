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
  <div class="flex flex-col items-center space-y-8 py-6">
    <Charts title="Resúmenes" :items="summaryStore.list" />
    <div class="w-full border-t border-neutral-400 dark:border-blue-300 my-3" />
    <Charts title="Casos" :items="caseStore.list" />
  </div>
</template>
