/**
 * @file useNotify.ts
 * @namespace src.shared.composables
 * @description State for one NotifyModal: call notify() and bind the rest to the modal
 *
 * @example
 * const { notify, ...notice } = useNotify();
 * notify('Éxito', 'Datos guardados.', 'success');
 * // <NotifyModal v-model="notice.show.value" … />
 */

import { ref } from 'vue';

export type NotifyType = 'success' | 'error' | 'info';
export type Notify = (title: string, message: string, type?: NotifyType) => void;

export function useNotify() {
  const show = ref(false);
  const title = ref('');
  const message = ref('');
  const type = ref<NotifyType>('info');

  const notify: Notify = (newTitle, newMessage, newType = 'info') => {
    title.value = newTitle;
    message.value = newMessage;
    type.value = newType;
    show.value = true;
  };

  return { show, title, message, type, notify };
}
