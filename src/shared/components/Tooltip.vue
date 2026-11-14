<script setup lang="ts">
  /**
   * @file Tooltip.vue
   * @namespace src.shared.components
   * @description Short label shown over a control on hover or keyboard focus
   *
   * Follows the WAI-ARIA tooltip pattern and WCAG 1.4.13 (content on hover or focus):
   * - opens on mouse hover and on keyboard focus (`:focus-visible`), never on touch;
   * - Escape closes it, the pointer can move onto it without it vanishing, and it stays
   *   open until the pointer or focus leaves (no timer hides it);
   * - it is teleported to <body> with fixed positioning, so tables and cards never clip it,
   *   and it flips below the control or shifts sideways to stay inside the window.
   *
   * The control keeps its own accessible name (`aria-label`); the tooltip only shows it.
   * When the control has no name of its own, the tooltip is linked with `aria-describedby`.
   *
   * @component
   * @example
   * <Tooltip text="Editar">
   *   <button aria-label="Editar Caso 12">…</button>
   * </Tooltip>
   */

  import { nextTick, onBeforeUnmount, ref, useId } from 'vue';
  import { DEFAULT_TOOLTIP_DELAY } from '@/shared/constants/tooltip.constants';

  // Two roots (the wrapper and the teleported tooltip): attributes go to the wrapper.
  defineOptions({ inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      text: string;
      /** Preferred side; it flips when there is no room. */
      placement?: 'top' | 'bottom';
      /** Milliseconds before it opens, so it does not flash while the pointer passes by. */
      delay?: number;
    }>(),
    { placement: 'top', delay: DEFAULT_TOOLTIP_DELAY }
  );

  /** Gap between the control and the tooltip, and minimum distance to the window edge. */
  const GAP = 8;
  /** Lets the pointer travel from the control onto the tooltip without closing it. */
  const HIDE_GRACE_MS = 120;

  const id = `tooltip-${useId()}`;
  const anchor = ref<HTMLElement | null>(null);
  const bubble = ref<HTMLElement | null>(null);
  const isOpen = ref(false);
  const position = ref({ top: 0, left: 0 });

  let showTimer: ReturnType<typeof setTimeout> | undefined;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  /** The wrapped control (the first element in the slot). */
  function trigger(): HTMLElement | null {
    return (anchor.value?.firstElementChild as HTMLElement | null) ?? null;
  }

  function scheduleOpen(): void {
    clearTimeout(hideTimer);
    if (isOpen.value || !props.text) return;
    clearTimeout(showTimer);
    showTimer = setTimeout(() => void open(), props.delay);
  }

  /** The pointer reached the tooltip itself: keep it (WCAG 1.4.13, hoverable). */
  function keepOpen(): void {
    clearTimeout(hideTimer);
  }

  function scheduleClose(): void {
    clearTimeout(showTimer);
    hideTimer = setTimeout(close, HIDE_GRACE_MS);
  }

  async function open(): Promise<void> {
    isOpen.value = true;
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('scroll', close, { capture: true, passive: true });
    window.addEventListener('resize', close);
    linkDescription(true);
    await nextTick();
    place();
  }

  function close(): void {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    if (!isOpen.value) return;
    isOpen.value = false;
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('scroll', close, { capture: true });
    window.removeEventListener('resize', close);
    linkDescription(false);
  }

  /** Only describes the control when it has no name of its own, so screen readers never repeat it. */
  function linkDescription(linked: boolean): void {
    const control = trigger();
    if (!control || control.hasAttribute('aria-label') || control.hasAttribute('aria-labelledby')) {
      return;
    }
    if (linked) control.setAttribute('aria-describedby', id);
    else control.removeAttribute('aria-describedby');
  }

  /** Centres the tooltip on the control, on the preferred side if it fits. */
  function place(): void {
    const control = trigger();
    if (!control || !bubble.value) return;
    const box = control.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = bubble.value;

    const above = box.top - height - GAP;
    const below = box.bottom + GAP;
    const fitsAbove = above >= GAP;
    const fitsBelow = below + height <= window.innerHeight - GAP;
    const top = props.placement === 'top' ? (fitsAbove ? above : below) : fitsBelow ? below : above;

    const centred = box.left + box.width / 2 - width / 2;
    const left = Math.min(Math.max(centred, GAP), window.innerWidth - width - GAP);
    position.value = { top, left };
  }

  function onPointerEnter(event: PointerEvent): void {
    // On touch the tap already acts; a tooltip would only cover the screen.
    if (event.pointerType !== 'touch') scheduleOpen();
  }

  function onFocusIn(event: FocusEvent): void {
    // Keyboard focus only: a mouse click also focuses, and the hover already covers it.
    if ((event.target as HTMLElement).matches(':focus-visible')) scheduleOpen();
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') close();
  }

  onBeforeUnmount(close);

  defineExpose({ isOpen });
</script>

<template>
  <span
    ref="anchor"
    v-bind="$attrs"
    class="inline-flex"
    @pointerenter="onPointerEnter"
    @pointerleave="scheduleClose"
    @focusin="onFocusIn"
    @focusout="close"
  >
    <slot />
  </span>

  <Teleport to="body">
    <Transition name="tooltip">
      <div
        v-if="isOpen"
        :id="id"
        ref="bubble"
        role="tooltip"
        class="tooltip fixed z-[70] max-w-60 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-white shadow-lg shadow-slate-900/20 dark:bg-slate-100 dark:text-slate-900"
        :style="{ top: `${position.top}px`, left: `${position.left}px` }"
        @pointerenter="keepOpen"
        @pointerleave="scheduleClose"
      >
        {{ text }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .tooltip-enter-active,
  .tooltip-leave-active {
    transition: opacity 120ms ease;
  }

  .tooltip-enter-from,
  .tooltip-leave-to {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .tooltip-enter-active,
    .tooltip-leave-active {
      transition: none;
    }
  }
</style>
