<script setup lang="ts">
  /**
   * @file Cases.vue
   * @namespace src.modules.cases.views
   * @description Cases page: normal and extra totals, add form with the "Extra" check, table
   *
   * @component
   * @example
   * <Cases />
   */

  import { computed, ref } from 'vue';
  import { useCaseStore } from '@/modules/cases/store/case.store';
  import AddItemForm from '@/shared/components/AddItemForm.vue';
  import Total from '@/shared/components/Total.vue';
  import Table from '@/shared/components/BaseTable.vue';
  import { splitCases } from '@/shared/utils/case.utils';

  const caseStore = useCaseStore();
  const cases = computed(() => splitCases(caseStore.list));
  /** Stays on after adding, so several extras in a row need a single click. */
  const isExtra = ref(false);
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-center gap-10">
      <Total title="Casos" :items="cases.normal" />
      <Total title="Extras" :items="cases.extra" tone="pink" />
    </div>

    <AddItemForm label="Nombre del caso" @add="(name) => caseStore.create(name, isExtra)">
      <label
        :class="[
          'flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium cursor-pointer select-none transition-colors duration-200',
          isExtra
            ? 'border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-500/40 dark:bg-pink-500/10 dark:text-pink-300'
            : 'border-slate-200 bg-white/60 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
        ]"
      >
        <input
          id="case-extra"
          v-model="isExtra"
          type="checkbox"
          class="size-4 rounded accent-pink-500 cursor-pointer"
        />
        Extra
      </label>
    </AddItemForm>

    <div class="border-t border-slate-200 dark:border-slate-700/80 my-4" />

    <Table
      item-name="caso"
      item-name-plural="casos"
      :items="caseStore.list"
      :is-reversed="caseStore.isReversed"
      title-modal-view="Detalles del Caso"
      message="No hay casos disponibles."
      extras
      @delete-item="caseStore.delete"
      @edit-item="(id, name, date) => caseStore.update(id, { name, date })"
      @reverse="caseStore.reverseList"
      @clear="caseStore.clearAll"
      @toggle-extra="caseStore.toggleExtra"
    />
  </div>
</template>
