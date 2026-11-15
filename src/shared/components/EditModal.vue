<script setup lang="ts">
  /**
   * @file EditModal.vue
   * @namespace src.shared.components
   * @description Edits a name, and the date when one is given (summaries, cases, user name)
   *
   * @component
   * @example
   * <EditModal v-model="show" title="Editar caso" :initial-name="name" :initial-date="date"
   *   place-holder="Nombre" @save="save" />
   */

  import { ref, watch, computed, useId } from 'vue';
  import BaseModal from './BaseModal.vue';
  import { fromIsoDate, toIsoDate } from '@/shared/utils/date.utils';

  const open = defineModel<boolean>({ required: true });

  const props = withDefaults(
    defineProps<{
      title: string;
      initialName: string;
      placeHolder: string;
      initialDate?: string;
      /** False for the first-run name prompt: there is nothing to go back to yet. */
      canCancel?: boolean;
    }>(),
    { initialDate: undefined, canCancel: true }
  );

  const emit = defineEmits<{
    (e: 'save', newName: string, newDate?: string): void;
  }>();

  const dateInputId = 'edit-date-' + useId();
  const name = ref(props.initialName);
  const internalDate = ref(props.initialDate || '');

  /** Bridges the native date input (YYYY-MM-DD) and the stored DD-MM-YY. */
  const dateInputValue = computed({
    get: () => toIsoDate(internalDate.value),
    set: (isoVal: string) => {
      internalDate.value = fromIsoDate(isoVal);
    },
  });

  watch(
    () => props.initialName,
    (newVal) => {
      name.value = newVal;
    }
  );

  watch(
    () => props.initialDate,
    (newVal) => {
      internalDate.value = newVal || '';
    }
  );

  function saveEdit(): void {
    if (name.value.trim() !== '') {
      emit('save', name.value.trim(), internalDate.value);
      open.value = false;
    }
  }
</script>

<template>
  <BaseModal v-model="open" :title="title" :dismissible="canCancel">
    <div class="flex flex-col gap-4" data-test="edit-modal">
      <input
        id="input-edit-modal"
        v-model="name"
        type="text"
        aria-label="Nombre"
        class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
        :placeholder="placeHolder"
        @keyup.enter="saveEdit"
      />

      <div v-if="initialDate !== undefined" class="flex flex-col gap-1">
        <label :for="dateInputId" class="text-xs text-gray-500 dark:text-gray-400">Fecha</label>
        <input
          :id="dateInputId"
          v-model="dateInputValue"
          data-test="input-edit-date"
          type="date"
          class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
    </div>

    <template #footer>
      <button
        id="cancel-button"
        class="px-4 py-2 rounded transition bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!canCancel"
        @click="open = false"
      >
        Cancelar
      </button>
      <button
        id="save-button"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition"
        @click="saveEdit"
      >
        Guardar
      </button>
    </template>
  </BaseModal>
</template>
