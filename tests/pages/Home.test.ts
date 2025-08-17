import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { router } from '@test/index';
import App from '@/App.vue';

const wrapper = mount(App, {
  global: {
    plugins: [createTestingPinia(), router],
  },
});

describe('Home.vue', () => {
  it('should render NavBar and Footer components', async () => {
    await router.isReady();
    expect(wrapper.find('[data-test="edit-modal"]').exists()).toBe(true);
  });

  it('renderiza el título "Sumsy"', () => {
    expect(wrapper.text()).toContain('Sumsy');
  });
});
