import { describe, it, expect } from 'vitest';
import { setAppVue, createVueApp } from '@/bootstrap';

describe('Bootstrap', () => {
  it('should mount the app with setAppVue', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    const app = await setAppVue();
    expect(app.$el).toBeInstanceOf(HTMLElement);
  });

  it('should create the app without mounting', () => {
    const app = createVueApp();
    expect(app).toBeTruthy();
  });
});
