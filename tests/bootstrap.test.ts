/**
 * @file bootstrap.test.ts
 * @namespace tests
 * @description Test for the Bootstrap
 */

import { describe, it, expect, afterEach } from 'vitest';
import { setAppVue, createVueApp } from '@/bootstrap';
import { VIEW_LEAVE_MS } from '@/router';

describe('Bootstrap', () => {
  // The router scrolls VIEW_LEAVE_MS after each navigation; let that finish while the
  // test document still exists, or it fails after teardown ("document is not defined").
  afterEach(() => new Promise((resolve) => setTimeout(resolve, VIEW_LEAVE_MS + 50)));

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
