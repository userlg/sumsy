<script setup lang="ts">
  /**
   * @file NotifyModal.vue
   * @namespace src.shared.components
   * @description Success / error / info message with an icon and an "Aceptar" button
   *
   * @component
   * @example
   * <NotifyModal v-model="show" title="Éxito" message="Operación completada." type="success" />
   */

  import BaseModal from './BaseModal.vue';
  import CheckIcon from '@/shared/icons/check.svg?component';
  import InformationCircleIcon from '@/shared/icons/information-circle.svg?component';
  import XMarkIcon from '@/shared/icons/x-mark.svg?component';

  const open = defineModel<boolean>({ required: true });

  defineProps<{
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
  }>();
</script>

<template>
  <BaseModal v-model="open" :title="title" size="sm" close-on-backdrop>
    <template #header="{ titleId }">
      <div class="flex items-center gap-3 mb-3">
        <!-- Success icon -->
        <div
          v-if="type === 'success'"
          class="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"
        >
          <CheckIcon class="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        </div>

        <!-- Error icon -->
        <div
          v-else-if="type === 'error'"
          class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center"
        >
          <XMarkIcon class="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
        </div>

        <!-- Info icon -->
        <div
          v-else
          class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center"
        >
          <InformationCircleIcon
            class="w-5 h-5 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
        </div>

        <h2 :id="titleId" class="text-xl font-bold text-slate-800 dark:text-white">
          {{ title }}
        </h2>
      </div>
    </template>

    <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed ml-[52px]">
      {{ message }}
    </p>

    <template #footer>
      <button
        id="notify-accept-button"
        class="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus-visible:outline-none transition-all duration-200"
        @click="open = false"
      >
        Aceptar
      </button>
    </template>
  </BaseModal>
</template>
