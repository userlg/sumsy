<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import { useSummaryStore } from '@/modules/summaries/store/summary.store';
  import gsap from 'gsap';

  const props = defineProps<{
    title: string;
  }>();

  const store = useSummaryStore();
  const tweened = reactive({ number: 0 });

  watch(
    () => store.list,
    (newVal) => {
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
      ref="circleEl"
      class="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-sky-500 dark:border-blue-300 bg-white dark:bg-gray-800 shadow-md transition-all duration-500 hover:scale-105 hover:shadow-lg"
    >
      <span class="text-3xl font-bold text-gray-700 dark:text-gray-100">
        {{ tweened.number.toFixed(0) }}
      </span>
    </div>

    <!-- Title -->
    <h2 class="text-sm font-medium text-gray-600 dark:text-gray-300 text-center">
      {{ props.title }}
    </h2>
  </div>
</template>
