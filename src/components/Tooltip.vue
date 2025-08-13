<script setup lang="ts">
import { ref, onUnmounted } from "vue";

const props = defineProps<{
  text: string;
  delay?: number; 
}>();

const show = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

function onMouseEnter() {
  timeoutId = setTimeout(() => {
    show.value = true;
  }, props.delay ?? 7000);
}

function onMouseLeave() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  show.value = false;
}

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId);
});
</script>

<template>
  <span
    class="relative inline-block"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot />
    <transition name="fade-scale">
      <div
        v-if="show"
        class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap select-none z-50 pointer-events-none"
      >
        {{ text }}
      </div>
    </transition>
  </span>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
