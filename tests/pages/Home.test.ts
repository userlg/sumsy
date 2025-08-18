import { describe, it, expect } from 'vitest';
import { mountFactory } from '@test/index';

const wrapper = await mountFactory({ initialRoute: '/' });

describe('Home.vue', () => {
  it('should render NavBar and Footer components', () => {
    expect(wrapper.find('[data-test="edit-modal"]').exists()).toBe(true);
  });

  it('renderiza el título "Sumsy"', () => {
    expect(wrapper.text()).toContain('Sumsy');
  });
});
