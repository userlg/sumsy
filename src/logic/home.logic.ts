import type { Ref } from 'vue';
import { useUserStore } from '@/stores/user.store';

export function initHome(
  userStore: ReturnType<typeof useUserStore>,
  showContent: Ref<boolean>,
  openNameModal: (isEditing?: boolean) => void,
  delay = 100 // timeout configurable para tests
) {
  // Abrir modal si no hay nombre
  if (!userStore.getName || userStore.getName.trim() === '') {
    openNameModal(false);
  }

  // Mostrar contenido después de delay
  setTimeout(() => {
    showContent.value = true;
  }, delay);
}
