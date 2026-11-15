<script setup lang="ts">
  /**
   * @file Summaries.vue
   * @namespace src.modules.summaries.views
   * @description Summaries page: total, add form and table
   *
   * @component
   * @example
   * <Summaries />
   */

  import { useSummaryStore } from '@/modules/summaries/store/summary.store';
  import AddItemForm from '@/shared/components/AddItemForm.vue';
  import Total from '@/shared/components/Total.vue';
  import Table from '@/shared/components/BaseTable.vue';

  const summaryStore = useSummaryStore();
</script>

<template>
  <div class="flex flex-col">
    <Total title="Resúmenes" :items="summaryStore.list" />

    <AddItemForm label="Nombre del resumen" @add="(name) => summaryStore.create(name)" />

    <div class="border-t border-slate-200 dark:border-slate-700/80 my-4" />

    <Table
      item-name="resumen"
      item-name-plural="resúmenes"
      :items="summaryStore.list"
      :is-reversed="summaryStore.isReversed"
      title-modal-view="Detalles del Resumen"
      message="No hay resúmenes disponibles."
      @delete-item="summaryStore.delete"
      @edit-item="(id, name, date) => summaryStore.update(id, { name, date })"
      @reverse="summaryStore.reverseList"
      @clear="summaryStore.clearAll"
    />
  </div>
</template>
