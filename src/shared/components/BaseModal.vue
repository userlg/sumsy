<script setup lang="ts">
  /**
   * @file BaseModal.vue
   * @namespace src.shared.components
   * @description Dialog shell shared by every modal: native <dialog>, title and closing rules
   *
   * Built on the native modal <dialog> (`showModal()`), so the browser provides what a custom
   * overlay has to rebuild by hand: the top layer, an inert page behind it, focus kept inside,
   * focus moved to the first control (or one marked `autofocus`) and returned to the opener
   * on close, and Escape to close.
   *
   * - `dismissible: false` (e.g. the first-run name prompt): Escape does nothing; only the
   *   modal's own buttons close it.
   * - `closeOnBackdrop`: a click outside the panel closes it, for dialogs that only show
   *   something; forms keep their input on a stray click.
   *
   * The content is only rendered while open, so a closed modal leaves nothing behind.
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

  import { computed, onMounted, ref, useId, watch } from 'vue';

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

  const titleId = `modal-title-${useId()}`;
  const dialog = ref<HTMLDialogElement | null>(null);

  /**
   * How the browser may close it (Chromium 134+). Older WebView2 versions ignore the
   * attribute; `onCancel` and `onClick` below give the same behavior there.
   */
  const closedBy = computed(() => {
    if (!props.dismissible) return 'none';
    return props.closeOnBackdrop ? 'any' : 'closerequest';
  });

  function sync(isOpen: boolean): void {
    const element = dialog.value;
    if (!element) return;
    if (isOpen && !element.open) element.showModal();
    else if (!isOpen && element.open) element.close();
  }

  // 'post': the content (v-if) is in the DOM before showModal() picks what to focus.
  watch(open, sync, { flush: 'post' });
  onMounted(() => sync(open.value));

  /** Fires however it closed (Escape, backdrop, a button): keep v-model in step. */
  function onClose(): void {
    open.value = false;
  }

  /** Escape asks to close; a modal that needs an answer says no. */
  function onCancel(event: Event): void {
    if (!props.dismissible) event.preventDefault();
  }

  /**
   * The dialog has no padding and the panel fills it, so a click whose target is the
   * <dialog> itself landed on the backdrop.
   */
  function onClick(event: MouseEvent): void {
    if (event.target !== dialog.value) return;
    if (props.closeOnBackdrop && props.dismissible) open.value = false;
  }
</script>

<template>
  <dialog
    ref="dialog"
    v-bind="{ closedby: closedBy }"
    :aria-labelledby="titleId"
    :class="[
      'base-modal m-auto w-[calc(100%-2rem)] rounded-2xl border border-slate-200 bg-white p-0 text-inherit shadow-xl dark:border-slate-700 dark:bg-slate-800',
      WIDTHS[size],
    ]"
    @close="onClose"
    @cancel="onCancel"
    @click="onClick"
  >
    <div v-if="open" class="p-6">
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
  </dialog>
</template>
