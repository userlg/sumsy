/**
 * @file export.logic.ts
 * @namespace src.logic
 * @description Monthly / full exports and merge-on-import for the summaries and cases lists
 */

import type { BaseItem } from '@/shared/interfaces/BaseItem';
import { parseItemDate } from '@/shared/utils/date.utils';

/** "YYYY-MM" for one month, or 'all' for a full backup. */
export type ExportScope = string;
export const FULL_BACKUP: ExportScope = 'all';

export interface ExportLists {
  summaries: BaseItem[];
  cases: BaseItem[];
}

/** "YYYY-MM" of a date, in local time (toISOString would use UTC and can flip the month). */
export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** "noviembre 2026" for "2026-11"; "Copia completa" for a full backup. */
export function scopeLabel(scope: ExportScope): string {
  if (scope === FULL_BACKUP) return 'Copia completa';
  const [year, month] = scope.split('-').map(Number);
  return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1)
  );
}

export function filterByScope(items: BaseItem[], scope: ExportScope): BaseItem[] {
  if (scope === FULL_BACKUP) return items;
  return items.filter((item) => {
    const date = parseItemDate(item.date);
    return date !== null && monthKey(date) === scope;
  });
}

export function scopedLists(lists: ExportLists, scope: ExportScope): ExportLists {
  return {
    summaries: filterByScope(lists.summaries, scope),
    cases: filterByScope(lists.cases, scope),
  };
}

/** sumsy-2026-11.json, or sumsy-backup-2026-11-08.json for a full backup. */
export function exportFileName(scope: ExportScope, extension: 'json' | 'txt', today = new Date()) {
  const prefix = extension === 'json' ? 'sumsy' : 'reporte-sumsy';
  if (scope !== FULL_BACKUP) return `${prefix}-${scope}.${extension}`;
  const day = String(today.getDate()).padStart(2, '0');
  return `${prefix}-backup-${monthKey(today)}-${day}.${extension}`;
}

export function buildJsonExport(lists: ExportLists, scope: ExportScope, now = new Date()) {
  return {
    exportDate: now.toISOString(),
    scope,
    totals: { summaries: lists.summaries.length, cases: lists.cases.length },
    summaries: lists.summaries,
    cases: lists.cases,
  };
}

/** Groups items by day in chronological order: [["03-11-26", [...]], ...]. */
function byDay(items: BaseItem[]): [string, BaseItem[]][] {
  const groups = new Map<string, BaseItem[]>();
  for (const item of items) groups.set(item.date, [...(groups.get(item.date) ?? []), item]);
  const time = (text: string) => parseItemDate(text)?.getTime() ?? 0;
  return [...groups.entries()].sort((a, b) => time(a[0]) - time(b[0]));
}

function section(title: string, items: BaseItem[], empty: string): string {
  let text = `----------------------------------------------------\n`;
  text += ` ${title}: ${items.length} en total\n`;
  text += `----------------------------------------------------\n`;
  if (items.length === 0) return text + `   (${empty})\n\n`;
  for (const [date, dayItems] of byDay(items)) {
    text += ` ${date} (${dayItems.length})\n`;
    dayItems.forEach((item) => (text += `   - ${item.name}\n`));
  }
  return text + `\n`;
}

export function buildTxtReport(
  lists: ExportLists,
  scope: ExportScope,
  userName: string,
  now = new Date()
): string {
  const generated = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let text = `====================================================\n`;
  text += `                 REPORTE DE SUMSY\n`;
  text += `====================================================\n\n`;
  text += `Periodo: ${scopeLabel(scope)}\n`;
  text += `Fecha de generación: ${generated}\n`;
  text += `Usuario: ${userName || 'Desconocido'}\n\n`;
  text += section('RESÚMENES', lists.summaries, 'No hay resúmenes registrados');
  text += section('CASOS', lists.cases, 'No hay casos registrados');
  text += `====================================================\n`;
  return text;
}

/**
 * Adds imported items to the current list, matching by id: an imported item with a known id
 * replaces it, the rest are appended. Nothing already stored is ever dropped, so importing a
 * monthly file cannot erase the other months.
 */
export function mergeById(current: BaseItem[], imported: BaseItem[]): BaseItem[] {
  const merged = new Map(current.map((item) => [item.id, item]));
  for (const item of imported) merged.set(item.id, { ...merged.get(item.id), ...item });
  return [...merged.values()];
}

function isBaseItem(value: unknown): value is BaseItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    Number.isInteger(item.id) &&
    typeof item.name === 'string' &&
    typeof item.date === 'string' &&
    parseItemDate(item.date) !== null
  );
}

/** Keeps only well-formed items, so a damaged file cannot put bad rows in the store. */
export function validItems(value: unknown): BaseItem[] {
  return Array.isArray(value) ? value.filter(isBaseItem) : [];
}
