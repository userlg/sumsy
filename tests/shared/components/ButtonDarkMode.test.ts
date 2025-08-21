/**
 * @file ButtonDarkMode.test.ts
 * @namespace Tests.shared.components
 * @description Tests del componente ButtonDarkMode.vue
 */

import { describe, it, expect, vi } from 'vitest';
import ButtonDarkMode from '@/shared/components/ButtonDarkMode.vue';
import { mountFactory } from '@test/setup';
import { useDarkModeStore } from '@/stores/darkModeStore';

describe('ButtonDarkMode.vue', () => {
  it('displays the moon icon when isDarkMode = true', async () => {
    const wrapper = await mountFactory({
      component: ButtonDarkMode,
    });

    const darkModeStore = useDarkModeStore();

    darkModeStore.darkIsActive = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Dark mode enabled');

    expect(wrapper.find('svg.stroke-amber-300').exists()).toBe(true); // Moon
    expect(wrapper.find('svg.stroke-yellow-300').exists()).toBe(false); // Sun
  });

  it('displays the sun icon when isDarkMode = false', async () => {
    const wrapper = await mountFactory({
      component: ButtonDarkMode,
    });

    const darkModeStore = useDarkModeStore();

    darkModeStore.darkIsActive = false;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Light mode enabled');
    expect(wrapper.find('svg.stroke-yellow-300').exists()).toBe(true); // Sun
    expect(wrapper.find('svg.stroke-amber-300').exists()).toBe(false); // Moon
  });
});

describe('ButtonDarkMode.vue - toggleDarkMode', () => {
  it('calls darkMode.changeMode() when clicking the button', async () => {
    const wrapper = await mountFactory({
      component: ButtonDarkMode,
    });

    const darkModeStore = useDarkModeStore();

    const spy = vi.spyOn(darkModeStore, 'changeMode');

    await wrapper.get('#toggle-dark-mode').trigger('click');

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
