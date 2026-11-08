/**
 * @file chart.logic.test.ts
 * @namespace tests.logic
 * @description Tests for the line chart series builder
 */

import { describe, it, expect } from 'vitest';
import { buildSeries } from '@/logic/chart.logic';

const today = new Date(2026, 10, 3);

describe('chart.logic', () => {
  it('returns one point per day, filling empty days with 0', () => {
    const series = buildSeries(['03-11-26', '03-11-26', '31-10-26'], '7d', today);
    expect(series).toHaveLength(7);
    expect(series.map((point) => point.count)).toEqual([0, 0, 0, 1, 0, 0, 2]);
    expect(series[6].date).toBe('3 nov');
  });

  it('groups the 12-month range by week', () => {
    const series = buildSeries(['03-11-26', '02-11-26', '01-01-20'], '12m', today);
    expect(series).toHaveLength(52);
    expect(series[51].count).toBe(2);
    expect(series[51].title).toMatch(/^Semana del/);
    expect(series.reduce((sum, point) => sum + point.count, 0)).toBe(2);
  });
});
