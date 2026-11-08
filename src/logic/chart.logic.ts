/**
 * @file chart.logic.ts
 * @namespace src.logic
 * @description Turns item dates into an evenly spaced time series for the line charts
 */

import { countByDay } from '@/logic/activity.logic';
import { toDayKey } from '@/shared/utils/date.utils';

export type ChartRange = '7d' | '30d' | '90d' | '12m';

export interface ChartPoint {
  /** Short axis label, e.g. "12 nov". */
  date: string;
  count: number;
  /** Full tooltip title, e.g. "mié, 12 nov 2026" or "Semana del 3 nov". */
  title: string;
}

export const CHART_RANGES: { id: ChartRange; label: string; days: number }[] = [
  { id: '7d', label: '7 días', days: 7 },
  { id: '30d', label: '30 días', days: 30 },
  { id: '90d', label: '90 días', days: 90 },
  { id: '12m', label: '12 meses', days: 52 * 7 },
];

const axisFormat = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });
const titleFormat = new Intl.DateTimeFormat('es-ES', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function clean(text: string): string {
  return text.replace(/\./g, '');
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

/**
 * Builds one point per day (or per week for the 12-month range), filling empty days with 0
 * so gaps in activity show as gaps instead of being squeezed out of the axis.
 */
export function buildSeries(dates: string[], range: ChartRange, today = new Date()): ChartPoint[] {
  const counts = countByDay(dates);
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const { days } = CHART_RANGES.find((option) => option.id === range)!;
  const bucket = range === '12m' ? 7 : 1;
  const start = addDays(end, -days + 1);

  const points: ChartPoint[] = [];
  for (let offset = 0; offset < days; offset += bucket) {
    const first = addDays(start, offset);
    let count = 0;
    for (let i = 0; i < bucket; i++) count += counts.get(toDayKey(addDays(first, i))) ?? 0;

    points.push({
      date: clean(axisFormat.format(first)),
      count,
      title:
        bucket === 1
          ? clean(titleFormat.format(first))
          : `Semana del ${clean(axisFormat.format(first))}`,
    });
  }
  return points;
}
