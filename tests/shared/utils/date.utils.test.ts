/**
 * @file date.utils.test.ts
 * @namespace tests.shared.utils
 * @description Tests for the DD-MM-YY date helpers
 */

import { describe, it, expect } from 'vitest';
import {
  addDays,
  formatItemDate,
  fromIsoDate,
  parseItemDate,
  toIsoDate,
} from '@/shared/utils/date.utils';

describe('parseItemDate', () => {
  it('parses a stored DD-MM-YY date', () => {
    expect(parseItemDate('03-11-26')).toEqual(new Date(2026, 10, 3));
  });

  it('rejects days that do not exist instead of rolling them into another month', () => {
    for (const bad of [
      '32-01-26',
      '31-04-26',
      '29-02-25',
      '00-05-26',
      '15-13-26',
      '15-00-26',
      '1.5-05-26',
      '15-05-2026',
    ]) {
      expect(parseItemDate(bad)).toBeNull();
    }
    expect(parseItemDate('29-02-24')).toEqual(new Date(2024, 1, 29));
  });
});

describe('formatItemDate', () => {
  it('pads day and month and keeps two year digits', () => {
    expect(formatItemDate(new Date(2025, 0, 5))).toBe('05-01-25');
  });
});

describe('addDays', () => {
  it('moves across month and year ends without changing the original', () => {
    const start = new Date(2025, 11, 30);
    expect(addDays(start, 3)).toEqual(new Date(2026, 0, 2));
    expect(addDays(start, -30)).toEqual(new Date(2025, 10, 30));
    expect(start).toEqual(new Date(2025, 11, 30));
  });
});

describe('toIsoDate / fromIsoDate (native date input)', () => {
  it('converts both ways', () => {
    expect(toIsoDate('03-11-26')).toBe('2026-11-03');
    expect(fromIsoDate('2026-11-03')).toBe('03-11-26');
  });

  it('returns an empty value for empty or impossible dates', () => {
    expect(toIsoDate('')).toBe('');
    expect(toIsoDate('32-13-26')).toBe('');
    expect(fromIsoDate('')).toBe('');
  });
});
