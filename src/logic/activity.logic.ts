/**
 * @file activity.logic.ts
 * @namespace src.logic
 * @description Builds the GitHub-style activity calendar from item dates
 */

import { parseItemDate, toDayKey } from '@/shared/utils/date.utils';

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export interface ActivityDay {
  key: string;
  date: Date;
  count: number;
  level: ActivityLevel;
  /** Days after `today` are kept so the last column stays a full week, but never painted. */
  isFuture: boolean;
}

export interface ActivityCalendar {
  weeks: ActivityDay[][];
  total: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  busiestDay: ActivityDay | null;
}

const WEEKS_SHOWN = 53;
const DAYS_PER_WEEK = 7;

/** Counts how many items fall on each day. */
export function countByDay(dates: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const text of dates) {
    const date = parseItemDate(text);
    if (!date) continue;
    const key = toDayKey(date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/**
 * Maps a day's count to one of five intensity levels. Thresholds are fixed so the same
 * count always gets the same color, whatever the filter or the rest of the year looks like.
 */
export function levelFor(count: number): ActivityLevel {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

/** Human-readable range of each level, for the legend. */
export const LEVEL_RANGES = ['0', '1', '2–3', '4–6', '7+'] as const;

/** Monday-first weekday index: Monday = 0 … Sunday = 6. */
function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

/** Streak lengths in consecutive active days, counted over the visible days up to today. */
function streaks(days: ActivityDay[]): { current: number; longest: number } {
  let longest = 0;
  let running = 0;
  for (const day of days) {
    running = day.count > 0 ? running + 1 : 0;
    longest = Math.max(longest, running);
  }

  // An empty today does not break the streak yet: the day is not over.
  let current = 0;
  const lastIndex = days.length - 1;
  const start = lastIndex >= 0 && days[lastIndex].count === 0 ? lastIndex - 1 : lastIndex;
  for (let i = start; i >= 0 && days[i].count > 0; i--) current++;

  return { current, longest };
}

/**
 * Lays out the last 53 weeks as columns of Monday → Sunday, ending on the week of `today`.
 */
export function buildActivityCalendar(dates: string[], today = new Date()): ActivityCalendar {
  const counts = countByDay(dates);
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const firstMonday = addDays(end, -weekdayIndex(end) - (WEEKS_SHOWN - 1) * DAYS_PER_WEEK);
  const todayKey = toDayKey(end);

  const visible: ActivityDay[] = [];
  for (let i = 0; i < WEEKS_SHOWN * DAYS_PER_WEEK; i++) {
    const date = addDays(firstMonday, i);
    const key = toDayKey(date);
    const count = counts.get(key) ?? 0;
    visible.push({ key, date, count, level: levelFor(count), isFuture: key > todayKey });
  }

  const past = visible.filter((day) => !day.isFuture);

  const weeks: ActivityDay[][] = [];
  for (let i = 0; i < visible.length; i += DAYS_PER_WEEK) {
    weeks.push(visible.slice(i, i + DAYS_PER_WEEK));
  }

  const active = past.filter((day) => day.count > 0);
  const { current, longest } = streaks(past);

  return {
    weeks,
    total: active.reduce((sum, day) => sum + day.count, 0),
    activeDays: active.length,
    currentStreak: current,
    longestStreak: longest,
    busiestDay: active.reduce<ActivityDay | null>(
      (best, day) => (!best || day.count > best.count ? day : best),
      null
    ),
  };
}
