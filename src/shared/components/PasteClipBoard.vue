<script setup lang="ts">
  /**
   * @file PasteClipBoard.vue
   * @namespace src.shared.components
   * @description Paste clipboard component for the application
   *
   * @component
   * @example
   * <PasteClipBoard />
   */

  import { ref } from 'vue';
  import Tooltip from './Tooltip.vue';
  import ClipboardDocumentListIcon from '@/shared/icons/clipboard-document-list.svg?component';

  const emit = defineEmits<{
    (e: 'pasted', value: string): void;
    /** The clipboard could not be read; the parent shows the message next to its input. */
    (e: 'error', message: string): void;
  }>();

  const loading = ref(false);

  async function pasteFromClipboard(): Promise<void> {
    try {
      loading.value = true;
      const text = await navigator.clipboard.readText();
      emit('pasted', text.trim());
    } catch {
      emit('error', 'No se pudo leer el portapapeles.');
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <Tooltip text="Pegar del portapapeles">
    <button
      class="px-3 py-2 rounded transition cursor-pointer flex items-center justify-center"
      :disabled="loading"
      aria-label="Pegar del portapapeles"
      @click="pasteFromClipboard"
    >
      <span v-if="!loading">
        <ClipboardDocumentListIcon
          class="size-6 stroke-2 stroke-gray-400 dark:stroke-blue-300 hover:stroke-gray-500 dark:hover:stroke-blue-400 transition duration-500 ease-in-out"
          aria-hidden="true"
        />
      </span>
      <span v-else class="animate-pulse">⏳</span>
    </button>
  </Tooltip>
</template>
