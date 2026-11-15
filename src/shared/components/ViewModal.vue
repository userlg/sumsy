<script setup lang="ts">
  /**
   * @file ViewModal.vue
   * @namespace src.shared.components
   * @description Shows one item in full: its whole name, number and date
   *
   * @component
   * @example
   * <ViewModal v-model="show" title="Detalles del Caso" :id="3" name="…" date="03-11-26" />
   */

  import BaseModal from './BaseModal.vue';
  import ArrowUturnLeftIcon from '@/shared/icons/arrow-uturn-left.svg?component';

  const open = defineModel<boolean>({ required: true });

  defineProps<{
    title: string;
    name: string;
    id: number;
    date: string;
  }>();
</script>

<template>
  <BaseModal v-model="open" :title="title" size="xl" close-on-backdrop>
    <div
      class="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-5 max-h-36 overflow-y-auto text-slate-800 dark:text-blue-300 text-base leading-relaxed"
    >
      {{ name }}
    </div>

    <div class="border-t border-neutral-400 dark:border-blue-300 my-3" />
    <dl class="grid grid-cols-2 gap-y-3 text-sm">
      <dt class="text-slate-500 dark:text-slate-400 font-medium">#</dt>
      <dd class="text-slate-800 dark:text-slate-200 font-semibold">{{ id }}</dd>

      <dt class="text-slate-500 dark:text-slate-400 font-medium">Fecha</dt>
      <dd class="text-slate-800 dark:text-slate-200 font-semibold">{{ date }}</dd>
    </dl>

    <template #footer>
      <button
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:opacity-90 transition"
        @click="open = false"
      >
        Volver
        <ArrowUturnLeftIcon class="size-4" aria-hidden="true" />
      </button>
    </template>
  </BaseModal>
</template>
