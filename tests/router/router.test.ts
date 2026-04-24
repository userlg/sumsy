/**
 * @file router.test.ts
 * @namespace tests.router
 * @description Tests for the router configuration
 */

import { describe, it, expect } from 'vitest';
import router from '@/router';

describe('Router', () => {
  it('has the correct number of routes', () => {
    const routes = router.getRoutes();
    // home, graphs, summaries, cases
    expect(routes.length).toBeGreaterThanOrEqual(4);
  });

  it('has a home route at /', () => {
    const route = router.resolve('/');
    expect(route.matched.length).toBeGreaterThan(0);
  });

  it('has a graphs route at /graphs', () => {
    const route = router.resolve('/graphs');
    expect(route.matched.length).toBeGreaterThan(0);
    expect(route.name).toBe('graphs');
  });

  it('has a summaries route at /summaries', () => {
    const route = router.resolve('/summaries');
    expect(route.matched.length).toBeGreaterThan(0);
    expect(route.name).toBe('Summaries');
  });

  it('has a cases route at /cases', () => {
    const route = router.resolve('/cases');
    expect(route.matched.length).toBeGreaterThan(0);
    expect(route.name).toBe('Cases');
  });
});
