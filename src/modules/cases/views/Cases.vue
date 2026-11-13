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
  /** Stays on after adding, so several extras in a row need a single click. */
  const isExtra = ref(false);

  function addSummary(): void {
    if (!name.value.trim()) {
      error.value = 'El nombre no puede estar vacío.';
      return;
    }
    error.value = '';
    caseStore.create(name.value.trim(), isExtra.value);
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

  function handleToggleExtra(id: number) {
    caseStore.toggleExtra(id);
  }

  function handleClear() {
    caseStore.clearAll();
  }
</script>

<template>
  <div class="flex flex-col">
    <Total title="Casos" :store="caseStore" />

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
      <button :disabled="!name.trim()" class="btn-primary" @click="addSummary">Agregar</button>
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
      extras
      @delete-summary="handleDeleteSummary"
      @reverse="handleReverse"
      @clear="handleClear"
      @edit-summary="handleEditSummary"
      @toggle-extra="handleToggleExtra"
    />
  </div>
</template>
