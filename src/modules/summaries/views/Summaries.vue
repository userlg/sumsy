<script setup lang="ts">
  import { ref } from 'vue';
  import { useSummaryStore } from '@/modules/summaries/store/summary.store';
  import { useUserStore } from '@/stores/user.store';
  import PasteClipboard from '@/shared/components/PasteClipBoard.vue';
  import Total from '@/shared/components/Total.vue';
  import Table from '@/shared/components/BaseTable.vue';

  const userStore = useUserStore();
  const summarytStore = useSummaryStore();
  const name = ref('');
  const error = ref('');

  function addSummary(): void {
    if (!name.value.trim()) {
      error.value = 'El nombre no puede estar vacío.';
      return;
    }
    error.value = '';
    summarytStore.create(name.value.trim());
    name.value = '';
  }

  function handleEditSummary(id: number, newName: string) {
    summarytStore.updateName(id, newName);
  }

  function onPasted(text: string) {
    name.value = text;
  }

  function handleDeleteSummary(id: number) {
    summarytStore.delete(id);
  }

  function handleReverse() {
    summarytStore.reverseList();
  }

  function handleClear() {
    summarytStore.clearAll();
  }
</script>

<template>
  <div class="flex flex-col">
    <Total title="Resúmenes" />

    <div>
      <PasteClipboard @pasted="onPasted" />
    </div>

    <div class="flex justify-center items-center gap-2 mt-1">
      <input
        v-model="name"
        placeholder="Nombre"
        autocomplete="off"
        aria-label="Nombre del resumen"
        class="border rounded px-3 py-2 flex-1 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
        @keyup.enter="addSummary"
      />
      <button
        :disabled="!name.trim()"
        class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 disabled:bg-gray-400 transition cursor-pointer"
        @click="addSummary"
      >
        Agregar
      </button>
    </div>

    <p v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>

    <div class="border-t border-neutral-400 dark:border-blue-300 my-3" />

    <Table
      :summaries="summarytStore.list"
      :is-reversed="summarytStore.isReversed"
      :user-store="userStore"
      @delete-summary="handleDeleteSummary"
      @reverse="handleReverse"
      @clear="handleClear"
      @edit-summary="handleEditSummary"
    />
  </div>
</template>
