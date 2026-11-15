<script setup lang="ts">
  /**
   * @file ConfirmModal.vue
   * @namespace src.shared.components
   * @description Asks before a destructive action; focus starts on the safe choice (cancel)
   *
   * @component
   * @example
   * <ConfirmModal v-model="show" title="Confirmar acción" message="¿Seguro?" @confirm="clear" />
   */

  import BaseModal from './BaseModal.vue';

  const open = defineModel<boolean>({ required: true });

  defineProps<{
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }>();

  const emit = defineEmits<{
    (e: 'confirm'): void;
  }>();

  function confirmAction(): void {
    emit('confirm');
    open.value = false;
  }
</script>

<template>
  <BaseModal v-model="open" :title="title">
    <p class="text-slate-600 dark:text-slate-300">
      {{ message }}
    </p>

    <template #footer>
      <button
        class="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
        @click="open = false"
      >
        {{ cancelText || 'Cancelar' }}
      </button>
      <button
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition"
        @click="confirmAction"
      >
        {{ confirmText || 'Confirmar' }}
      </button>
    </template>
  </BaseModal>
</template>
