/**
 * @file reveal.test.ts
 * @namespace tests.shared.directives
 * @description Tests for the v-reveal directive
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, withDirectives } from 'vue';
import { reveal } from '@/shared/directives/reveal';

function mountWithReveal() {
  const Comp = defineComponent({
    render: () => withDirectives(h('section', 'contenido'), [[reveal, 50]]),
  });
  return mount(Comp, { attachTo: document.body });
}

describe('v-reveal', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('leaves content visible when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const wrapper = mountWithReveal();
    expect(wrapper.find('section').classes()).not.toContain('reveal');
  });

  it('hides below-the-fold content until it intersects', () => {
    let trigger: (entries: Partial<IntersectionObserverEntry>[]) => void = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: typeof trigger) {
          trigger = cb;
        }
        observe() {}
        disconnect = disconnect;
      }
    );
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: window.innerHeight + 100,
    } as DOMRect);

    const wrapper = mountWithReveal();
    const section = wrapper.find('section');
    expect(section.classes()).toContain('reveal');
    expect((section.element as HTMLElement).style.transitionDelay).toBe('50ms');

    trigger([{ isIntersecting: true }]);
    expect(section.classes()).toContain('is-revealed');
    expect(disconnect).toHaveBeenCalled();
  });
});
