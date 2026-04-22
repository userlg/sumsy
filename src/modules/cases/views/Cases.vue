<script setup lang="ts">
  /**
   * @file Cases.vue
   * @namespace src.modules.cases.views
   * @description Cases view component for the application
   *
   * @component
   * @example
   * <Cases />
   */

  import { ref } from 'vue';
  import { useCaseStore } from '@/modules/cases/store/case.store';
  import { useUserStore } from '@/stores/user.store';
  import PasteClipboard from '@/shared/components/PasteClipBoard.vue';
  import Total from '@/shared/components/Total.vue';
  import Table from '@/shared/components/BaseTable.vue';

  const userStore = useUserStore();
  const caseStore = useCaseStore();
  const name = ref('');
  const error = ref('');

  function addSummary(): void {
    if (!name.value.trim()) {
      error.value = 'El nombre no puede estar vacío.';
      return;
    }
    error.value = '';
    caseStore.create(name.value.trim());
    name.value = '';
  }

  function handleEditSummary(id: number, newName: string, newDate?: string) {
    caseStore.update(id, { name: newName, date: newDate });
  }

  function onPasted(text: string) {
    name.value = text;
  }

  function handleDeleteSummary(id: number) {
    caseStore.delete(id);
  }

  function handleReverse() {
    caseStore.reverseList();
  }

  function handleClear() {
    caseStore.clearAll();
  }
</script>

<template>
  <div class="flex flex-col">
    <Total title="Casos Extras" :store="caseStore" />

    <div>
      <PasteClipboard @pasted="onPasted" />
    </div>

    <div class="flex justify-center items-center gap-2 mt-1">
      <input
        v-model="name"
        placeholder="Nombre"
        autocomplete="off"
        aria-label="Nombre del caso"
        class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100"
        @keyup.enter="addSummary"
      />
      <button
        :disabled="!name.trim()"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        @click="addSummary"
      >
        Agregar
      </button>
    </div>

    <p v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>

    <div class="border-t border-slate-200 dark:border-slate-700/80 my-4" />

    <Table
      :items="caseStore.list"
      :is-reversed="caseStore.isReversed"
      :user-store="userStore"
      title-modal-view="Detalles del Caso"
      message="No hay casos disponibles."
      @delete-summary="handleDeleteSummary"
      @reverse="handleReverse"
      @clear="handleClear"
      @edit-summary="handleEditSummary"
    />
  </div>
</template>
