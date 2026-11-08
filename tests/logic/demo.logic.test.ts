/**
 * @file demo.logic.test.ts
 * @namespace tests.logic
 * @description Tests for the dev-only random demo data
 */

import { describe, it, expect } from 'vitest';
import { buildDemoEntries, randomName } from '@/logic/demo.logic';
import { parseItemDate } from '@/shared/utils/date.utils';

/** Deterministic pseudo-random source (mulberry32). */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const today = new Date(2026, 10, 8);

describe('demo.logic', () => {
  it('names summaries and cases differently', () => {
    expect(randomName('summaries', seeded(1))).toMatch(/^Resumen: .+ – .+$/);
    expect(randomName('cases', seeded(1))).toMatch(/^Caso #\d{4} – .+$/);
  });

  it('creates between 20 and 50 entries for each of the last 12 months', () => {
    const entries = buildDemoEntries('cases', { today, random: seeded(7) });
    const perMonth = new Map<string, number>();
    for (const { date } of entries) {
      const month = date.slice(3);
      perMonth.set(month, (perMonth.get(month) ?? 0) + 1);
    }

    expect(perMonth.size).toBe(12);
    for (const count of perMonth.values()) {
      expect(count).toBeGreaterThanOrEqual(20);
      expect(count).toBeLessThanOrEqual(50);
    }
    expect(perMonth.has('12-25')).toBe(true);
    expect(perMonth.has('11-26')).toBe(true);
  });

  it('never dates an entry after today and lists the oldest first', () => {
    const dates = buildDemoEntries('summaries', { today, random: seeded(3) }).map(
      (entry) => parseItemDate(entry.date)!
    );

    expect(dates.every((date) => date <= today)).toBe(true);
    const times = dates.map((date) => date.getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });
});
