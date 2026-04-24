/**
 * @file cases.index.test.ts
 * @namespace tests.modules.cases
 * @description Tests for the cases module index exports
 */

import { describe, it, expect } from 'vitest';
import { casesRoute, CasesView, useCaseStore } from '@/modules/cases';

describe('Cases Module Index', () => {
  it('exports casesRoute with correct path', () => {
    expect(casesRoute.path).toBe('/cases');
    expect(casesRoute.name).toBe('Cases');
    expect(casesRoute.component).toBeDefined();
  });

  it('exports CasesView component', () => {
    expect(CasesView).toBeDefined();
  });

  it('exports useCaseStore', () => {
    expect(useCaseStore).toBeDefined();
    expect(typeof useCaseStore).toBe('function');
  });
});
