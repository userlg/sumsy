<script setup lang="ts">
  /**
   * @file Tooltip.vue
   * @namespace src.shared.components
   * @description Tooltip component
   *
   * @component
   * @example
   * <Tooltip />
   */

  import { ref, onUnmounted } from 'vue';
  import { DEFAULT_TOOLTIP_DELAY } from '@/shared/constants/tooltip.constants';

  const props = defineProps<{
    text: string;
    delay?: number;
  }>();

  const show = ref(false);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function clearTooltipTimeout() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function onMouseEnter() {
    timeoutId = setTimeout(() => {
      show.value = true;
    }, props.delay ?? DEFAULT_TOOLTIP_DELAY);
  }

  function onMouseLeave() {
    clearTooltipTimeout();
    show.value = false;
  }

  onUnmounted(() => {
    clearTooltipTimeout();
  });

  defineExpose({
    onMouseEnter,
    onMouseLeave,
    clearTooltipTimeout,
    show,
  });
</script>

<template>
  <div>
    <span class="relative inline-block" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
      <slot />
      <transition name="fade-scale">
        <div
          v-if="show"
          data-testid="tooltip"
          class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap select-none z-50 pointer-events-none"
        >
          {{ text }}
        </div>
      </transition>
    </span>
  </div>
</template>

<style scoped>
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }
  .fade-scale-enter-from,
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
</style>
