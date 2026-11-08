<script setup lang="ts">
  /**
   * @file Total.vue
   * @namespace src.shared.components
   * @description Total component for the application
   *
   * @component
   * @example
   * <Total :title="'Summaries'" :store="useSummaryStore()" />
   */

  import { reactive, watch } from 'vue';
  import gsap from 'gsap';

  // ✅ Ahora recibe el store como prop
  const props = defineProps<{
    title: string;
    store: { list: unknown[] }; // mínimo que debe tener (puedes tipar con BaseItem[])
  }>();

  const tweened = reactive({ number: 0 });

  // Any change to the list (add, delete, ASC/DESC) spins the counter up to 50 (75 when the
  // total is already 50) and settles on the real total.
  watch(
    () => props.store.list,
    (newVal) => {
      gsap.killTweensOf(tweened);
      gsap
        .timeline()
        .to(tweened, {
          duration: 0.3,
          number: newVal.length == 50 ? 75 : 50,
          ease: 'power1.in',
        })
        .to(tweened, {
          duration: 0.5,
          number: newVal.length,
          ease: 'power2.inOut',
        });
    },
    { immediate: true, deep: true }
  );
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-2 cursor-default">
    <!-- Circle-->
    <div
      class="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-blue-500 dark:border-blue-400 bg-white dark:bg-slate-800 shadow-md shadow-blue-500/10 transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-lg"
    >
      <span class="text-3xl font-bold tabular-nums text-slate-800 dark:text-slate-100">
        {{ tweened.number.toFixed(0) }}
      </span>
    </div>

    <!-- Title -->
    <h2 class="text-sm font-medium text-slate-600 dark:text-slate-300 text-center">
      {{ props.title }}
    </h2>
  </div>
</template>
