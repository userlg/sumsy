<script setup lang="ts">
  /**
   * @file BaseModal.vue
   * @namespace src.shared.components
   * @description Dialog shell shared by every modal: overlay, title, focus handling and closing
   *
   * Follows the WAI-ARIA modal dialog pattern:
   * - `role="dialog"`, `aria-modal="true"`, named by its title;
   * - on open, focus moves to the first control (or one marked `autofocus`); Tab and Shift+Tab
   *   stay inside the dialog; on close, focus returns to the control that opened it;
   * - Escape closes it, and so does a click on the backdrop when `closeOnBackdrop` is set,
   *   unless `dismissible` is false (e.g. the first-run name prompt);
   * - teleported to <body>, so no parent's overflow or transform can clip or shift it.
   *
   * Slots: default (body), `footer` (buttons, right-aligned), `header` (replaces the title;
   * receives `titleId`, which the custom heading must use as its id).
   *
   * @component
   * @example
   * <BaseModal v-model="open" title="Confirmar acción">
   *   <p>¿Seguro?</p>
   *   <template #footer><button @click="open = false">Cancelar</button></template>
   * </BaseModal>
   */

  import { nextTick, ref, useId, watch } from 'vue';

  const open = defineModel<boolean>({ required: true });

  const props = withDefaults(
    defineProps<{
      title: string;
      size?: 'sm' | 'md' | 'xl';
      /** False when the user must answer before going on: Escape and the backdrop do nothing. */
      dismissible?: boolean;
      /** For dialogs that only show something; forms keep their input on a stray click. */
      closeOnBackdrop?: boolean;
    }>(),
    { size: 'md', dismissible: true, closeOnBackdrop: false }
  );

  const WIDTHS = { sm: 'max-w-sm', md: 'max-w-md', xl: 'max-w-xl' } as const;
  const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const titleId = `modal-title-${useId()}`;
  const panel = ref<HTMLElement | null>(null);
  let opener: HTMLElement | null = null;

  function close(): void {
    if (props.dismissible) open.value = false;
  }

  function onBackdropClick(): void {
    if (props.closeOnBackdrop) close();
  }

  function focusables(): HTMLElement[] {
    return panel.value ? [...panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)] : [];
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== 'Tab') return;

    // Keep Tab inside the dialog: wrap from the last control to the first and back.
    const items = focusables();
    if (items.length === 0) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  watch(
    open,
    async (isOpen) => {
      if (isOpen) {
        opener = document.activeElement as HTMLElement | null;
        await nextTick();
        const preferred = panel.value?.querySelector<HTMLElement>('[autofocus]');
        (preferred ?? focusables()[0] ?? panel.value)?.focus();
      } else {
        opener?.focus?.();
        opener = null;
      }
    },
    { immediate: true }
  );
</script>

<template>
  <Teleport to="body">
    <Transition name="pop">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
        @click.self="onBackdropClick"
      >
        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          :class="[
            'w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xl focus:outline-none dark:border-slate-700 dark:bg-slate-800',
            WIDTHS[size],
          ]"
          @keydown="onKeydown"
        >
          <slot name="header" :title-id="titleId">
            <h2 :id="titleId" class="mb-4 text-xl font-bold text-slate-800 dark:text-white">
              {{ title }}
            </h2>
          </slot>

          <slot />

          <div v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
