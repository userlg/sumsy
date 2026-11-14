/**
 * @file date.utils.test.ts
 * @namespace tests.shared.utils
 * @description Tests for the DD-MM-YY date helpers
 */

import { describe, it, expect } from 'vitest';
import { parseItemDate } from '@/shared/utils/date.utils';

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
