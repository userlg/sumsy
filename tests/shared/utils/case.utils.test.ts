/**
 * @file case.utils.test.ts
 * @namespace tests.shared.utils
 * @description Tests for telling normal cases from extra cases
 */

import { describe, it, expect } from 'vitest';
import { isExtraCase, splitCases } from '@/shared/utils/case.utils';

const item = (id: number, extra?: boolean) => ({
  id,
  name: `Caso ${id}`,
  date: '03-11-26',
  element: id,
  extra,
});

describe('case.utils', () => {
  it('treats only an explicit true as extra (older cases have no flag)', () => {
    expect(isExtraCase(item(1, true))).toBe(true);
    expect(isExtraCase(item(2, false))).toBe(false);
    expect(isExtraCase({ id: 3, name: 'Viejo', date: '03-11-26', element: 3 })).toBe(false);
  });

  it('splits a list keeping the order', () => {
    const { normal, extra } = splitCases([item(1), item(2, true), item(3), item(4, true)]);
    expect(normal.map((i) => i.id)).toEqual([1, 3]);
    expect(extra.map((i) => i.id)).toEqual([2, 4]);
  });
});
