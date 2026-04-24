/**
 * @file summaries.index.test.ts
 * @namespace tests.modules.summaries
 * @description Tests for the summaries module index exports
 */

import { describe, it, expect } from 'vitest';
import { summariesRoute, SummariesView, useSummaryStore } from '@/modules/summaries';

describe('Summaries Module Index', () => {
  it('exports summariesRoute with correct path', () => {
    expect(summariesRoute.path).toBe('/summaries');
    expect(summariesRoute.name).toBe('Summaries');
    expect(summariesRoute.component).toBeDefined();
  });

  it('exports SummariesView component', () => {
    expect(SummariesView).toBeDefined();
  });

  it('exports useSummaryStore', () => {
    expect(useSummaryStore).toBeDefined();
    expect(typeof useSummaryStore).toBe('function');
  });
});
