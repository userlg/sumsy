/**
 * @file activity.logic.test.ts
 * @namespace tests.logic
 * @description Tests for the activity calendar logic
 */

import { describe, it, expect } from 'vitest';
import { buildActivityCalendar, countByDay, levelFor } from '@/logic/activity.logic';

// Tuesday 3 Nov 2026
const today = new Date(2026, 10, 3);

describe('activity.logic', () => {
  it('counts items per day and skips malformed dates', () => {
    const counts = countByDay(['03-11-26', '03-11-26', '02-11-26', 'basura']);
    expect(counts.get('2026-11-03')).toBe(2);
    expect(counts.get('2026-11-02')).toBe(1);
    expect(counts.size).toBe(2);
  });

  it('maps counts to fixed levels', () => {
    expect([0, 1, 2, 3, 4, 6, 7, 40].map(levelFor)).toEqual([0, 1, 2, 2, 3, 3, 4, 4]);
  });

  it('lays out 53 Monday-first weeks ending on the current week', () => {
    const calendar = buildActivityCalendar([], today);
    expect(calendar.weeks).toHaveLength(53);
    calendar.weeks.forEach((week) => expect(week).toHaveLength(7));
    expect(calendar.weeks[0][0].date.getDay()).toBe(1);

    const lastWeek = calendar.weeks[52];
    expect(lastWeek[1].key).toBe('2026-11-03');
    expect(lastWeek[1].isFuture).toBe(false);
    expect(lastWeek[2].isFuture).toBe(true);
  });

  it('colors a day darker the more items it has', () => {
    const calendar = buildActivityCalendar(
      ['01-11-26', '02-11-26', '02-11-26', '03-11-26', '03-11-26', '03-11-26', '03-11-26'],
      today
    );
    const byKey = new Map(calendar.weeks.flat().map((day) => [day.key, day]));
    expect(byKey.get('2026-11-01')!.level).toBe(1);
    expect(byKey.get('2026-11-02')!.level).toBe(2);
    expect(byKey.get('2026-11-03')!.level).toBe(3);
    expect(calendar.total).toBe(7);
    expect(calendar.activeDays).toBe(3);
    expect(calendar.busiestDay?.key).toBe('2026-11-03');
  });

  it('computes current and longest streaks, keeping the streak alive on an empty today', () => {
    const calendar = buildActivityCalendar(
      ['20-10-26', '21-10-26', '22-10-26', '23-10-26', '01-11-26', '02-11-26'],
      today
    );
    expect(calendar.currentStreak).toBe(2);
    expect(calendar.longestStreak).toBe(4);
  });

  it('ignores items outside the visible year', () => {
    const calendar = buildActivityCalendar(['01-01-20'], today);
    expect(calendar.total).toBe(0);
    expect(calendar.busiestDay).toBeNull();
  });
});
