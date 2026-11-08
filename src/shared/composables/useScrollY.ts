/**
 * @file useScrollY.ts
 * @namespace src.shared.composables
 * @description Reactive window.scrollY, for UI that changes once the page is scrolled
 */

import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useScrollY() {
  const scrollY = ref(0);

  function update() {
    scrollY.value = window.scrollY;
  }

  onMounted(() => {
    update();
    window.addEventListener('scroll', update, { passive: true });
  });
  onBeforeUnmount(() => window.removeEventListener('scroll', update));

  return scrollY;
}
