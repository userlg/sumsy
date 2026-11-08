<script setup lang="ts" generic="T extends string">
  /**
   * @file SegmentedControl.vue
   * @namespace src.shared.components
   * @description Pill-style single choice control (filters, ranges)
   *
   * @component
   * @example
   * <SegmentedControl v-model="range" :options="[{ id: '7d', label: '7 días' }]" label="Rango" />
   */

  defineProps<{
    options: { id: T; label: string }[];
    label: string;
  }>();

  const model = defineModel<T>({ required: true });
</script>

<template>
  <div
    class="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700"
    role="group"
    :aria-label="label"
  >
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      :aria-pressed="model === option.id"
      :class="[
        'segment px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-blue-500',
        model === option.id
          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200',
      ]"
      @click="model = option.id"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
  .segment {
    transition:
      background-color 160ms ease,
      color 160ms ease,
      box-shadow 160ms ease,
      transform 120ms var(--ease-out);
  }

  .segment:active {
    transform: scale(0.97);
  }
</style>
