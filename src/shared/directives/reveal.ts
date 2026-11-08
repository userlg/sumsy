/**
 * @file reveal.ts
 * @namespace src.shared.directives
 * @description `v-reveal`: fades an element in the first time it scrolls into view
 *
 * Content is visible by default. Only elements that start below the fold get hidden and
 * then revealed, so nothing stays invisible if the observer is missing or motion is reduced.
 *
 * @example
 * <section v-reveal>…</section>
 * <section v-reveal="120">…</section>  <!-- delay in ms -->
 */

import type { Directive } from 'vue';

const observed = new WeakMap<Element, IntersectionObserver>();

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add('reveal');
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('is-revealed');
        observer.disconnect();
        observed.delete(el);
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    observed.set(el, observer);
  },
  unmounted(el) {
    observed.get(el)?.disconnect();
    observed.delete(el);
  },
};
