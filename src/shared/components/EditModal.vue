<script setup lang="ts">
  /**
   * @file EditModal.vue
   * @namespace src.shared.components
   * @description Main modal component for editing items
   *
   * @component
   * @example
   * <EditModal />
   */

  import { ref, watch, computed } from 'vue';
  import type { useUserStore } from '@/stores/user.store';

  const props = defineProps<{
    modelValue: boolean;
    title: string;
    initialName: string;
    placeHolder: string;
    userStore: ReturnType<typeof useUserStore>;
    initialDate?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'save', newName: string, newDate?: string): void;
  }>();

  const name = ref(props.initialName);
  const internalDate = ref(props.initialDate || '');

  /**
   * Converts DD-MM-YY to YYYY-MM-DD for the native date input
   */
  function toIsoDate(ddmmyy: string): string {
    if (!ddmmyy) return '';
    const parts = ddmmyy.split('-');
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
    return `20${year}-${month}-${day}`;
  }

  /**
   * Converts YYYY-MM-DD from the native date input to DD-MM-YY
   */
  function fromIsoDate(isoDate: string): string {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return '';
    const [fullYear, month, day] = parts;
    const year = fullYear.slice(-2);
    return `${day}-${month}-${year}`;
  }

  /**
   * Computed property to bridge the native date input (YYYY-MM-DD)
   * with the internal DD-MM-YY format
   */
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

  function closeModal() {
    emit('update:modelValue', false);
  }

  function saveEdit() {
    if (name.value.trim() !== '') {
      emit('save', name.value.trim(), internalDate.value);
      closeModal();
    }
  }
</script>

<template>
  <div>
    <transition name="bounce">
      <div
        v-show="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
        data-test="edit-modal"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 class="text-xl font-bold mb-4">
            {{ title }}
          </h2>

          <div class="flex flex-col gap-4">
            <input
              id="input-edit-modal"
              v-model="name"
              type="text"
              class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              :placeholder="props.placeHolder"
            />

            <!-- Date edit -->
            <div v-if="initialDate !== undefined" class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 dark:text-gray-400">Fecha</label>
              <input
                id="input-edit-date"
                v-model="dateInputValue"
                type="date"
                class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              id="cancel-button"
              class="px-4 py-2 rounded transition bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!userStore.getName || userStore.getName.trim() === ''"
              @click="closeModal"
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
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
