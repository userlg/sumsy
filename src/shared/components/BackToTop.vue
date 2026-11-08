<script setup lang="ts">
  /**
   * @file BackToTop.vue
   * @namespace src.shared.components
   * @description Floating "back to top" button that shows up after scrolling down a long page
   *
   * @component
   * @example
   * <BackToTop />
   */

  import { computed } from 'vue';
  import { useScrollY } from '@/shared/composables/useScrollY';

  const SHOW_AFTER_PX = 500;

  const scrollY = useScrollY();
  const isVisible = computed(() => scrollY.value > SHOW_AFTER_PX);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<template>
  <Transition name="lift">
    <button
      v-if="isVisible"
      type="button"
      class="back-to-top fixed bottom-6 right-6 z-40 flex items-center justify-center size-11 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-900/10 dark:shadow-black/30 hover:bg-white dark:hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      aria-label="Volver arriba"
      title="Volver arriba"
      @click="scrollToTop"
    >
      <svg
        class="size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75 12 8.25l7.5 7.5" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
  .back-to-top {
    transition:
      background-color 160ms ease,
      transform 160ms var(--ease-out);
  }

  .back-to-top:hover {
    transform: translateY(-2px);
  }

  .back-to-top:active {
    transform: scale(0.94);
  }

  .lift-enter-active,
  .lift-leave-active {
    transition:
      opacity 220ms var(--ease-out),
      transform 220ms var(--ease-out);
  }

  .lift-enter-from,
  .lift-leave-to {
    opacity: 0;
    transform: translateY(12px) scale(0.9);
  }

  @media (prefers-reduced-motion: reduce) {
    .lift-enter-active,
    .lift-leave-active {
      transition: opacity 120ms ease;
    }
    .lift-enter-from,
    .lift-leave-to {
      transform: none;
    }
  }
</style>
