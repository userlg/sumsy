<script setup lang="ts">
  /**
   * @file AddItemForm.vue
   * @namespace src.shared.components
   * @description Name input with paste and "Agregar" for the summaries and cases pages
   *
   * Owns the text and its validation; the page decides what to do with the name.
   * The default slot holds extra controls next to the input (the "Extra" check on Cases).
   *
   * @component
   * @example
   * <AddItemForm label="Nombre del resumen" @add="summaryStore.create" />
   */

  import { ref, useId } from 'vue';
  import PasteClipboard from './PasteClipBoard.vue';

  defineProps<{
    /** Accessible name of the input, e.g. "Nombre del caso". */
    label: string;
  }>();

  const emit = defineEmits<{
    (e: 'add', name: string): void;
  }>();

  const name = ref('');
  const error = ref('');
  const errorId = `add-item-error-${useId()}`;

  function submit(): void {
    const trimmed = name.value.trim();
    if (!trimmed) {
      error.value = 'El nombre no puede estar vacío.';
      return;
    }
    error.value = '';
    emit('add', trimmed);
    name.value = '';
  }

  function onPasted(text: string): void {
    name.value = text;
    error.value = '';
  }
</script>

<template>
  <div>
    <PasteClipboard @pasted="onPasted" @error="(message) => (error = message)" />

    <div class="flex justify-center items-center gap-2 mt-1">
      <input
        v-model="name"
        placeholder="Nombre"
        autocomplete="off"
        :aria-label="label"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="error ? errorId : undefined"
        class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100"
        @keyup.enter="submit"
      />
      <slot />
      <button :disabled="!name.trim()" class="btn-primary" @click="submit">Agregar</button>
    </div>

    <p v-if="error" :id="errorId" role="alert" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>
