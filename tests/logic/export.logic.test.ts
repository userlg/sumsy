/**
 * @file export.logic.test.ts
 * @namespace tests.logic
 * @description Tests for monthly exports and merge-on-import
 */

import { describe, it, expect } from 'vitest';
import {
  buildJsonExport,
  buildTxtReport,
  exportFileName,
  FULL_BACKUP,
  mergeById,
  monthKey,
  scopeLabel,
  scopedLists,
  validItems,
} from '@/logic/export.logic';

const item = (id: number, date: string, name = `Item ${id}`) => ({ id, name, date, element: id });

const lists = {
  summaries: [item(1, '03-11-26'), item(2, '28-10-26'), item(3, '03-11-26')],
  cases: [item(1, '15-10-26')],
};

describe('export.logic', () => {
  it('builds the month key in local time', () => {
    expect(monthKey(new Date(2026, 10, 30, 23, 59))).toBe('2026-11');
  });

  it('labels a month and a full backup', () => {
    expect(scopeLabel('2026-11')).toBe('noviembre de 2026');
    expect(scopeLabel(FULL_BACKUP)).toBe('Copia completa');
  });

  it('keeps only the items of the chosen month', () => {
    const november = scopedLists(lists, '2026-11');
    expect(november.summaries.map((i) => i.id)).toEqual([1, 3]);
    expect(november.cases).toEqual([]);
    expect(scopedLists(lists, FULL_BACKUP)).toEqual(lists);
  });

  it('names files by period', () => {
    expect(exportFileName('2026-11', 'json')).toBe('sumsy-2026-11.json');
    expect(exportFileName('2026-10', 'txt')).toBe('reporte-sumsy-2026-10.txt');
    expect(exportFileName(FULL_BACKUP, 'json', new Date(2026, 10, 8))).toBe(
      'sumsy-backup-2026-11-08.json'
    );
  });

  it('records the scope in the JSON export', () => {
    const data = buildJsonExport(scopedLists(lists, '2026-10'), '2026-10');
    expect(data.scope).toBe('2026-10');
    expect(data.totals).toEqual({ summaries: 1, cases: 1, extras: 0 });
  });

  it('groups the TXT report by day, oldest first', () => {
    const text = buildTxtReport(lists, FULL_BACKUP, 'Kike');
    expect(text).toContain('Periodo: Copia completa');
    expect(text).toContain('Usuario: Kike');
    expect(text.indexOf('28-10-26 (1)')).toBeLessThan(text.indexOf('03-11-26 (2)'));
  });

  it('merges by id without dropping existing items', () => {
    const merged = mergeById(lists.summaries, [
      item(3, '03-11-26', 'Editado'),
      item(9, '01-11-26'),
    ]);
    expect(merged.map((i) => i.id)).toEqual([1, 2, 3, 9]);
    expect(merged.find((i) => i.id === 3)!.name).toBe('Editado');
  });

  it('drops malformed items from an imported file', () => {
    const valid = validItems([item(1, '03-11-26'), { id: 'x' }, item(2, 'no-date'), null]);
    expect(valid.map((i) => i.id)).toEqual([1]);
    expect(validItems('nope')).toEqual([]);
  });

  describe('extra cases', () => {
    const withExtras = {
      summaries: [item(1, '03-11-26')],
      cases: [item(1, '03-11-26', 'Normal'), { ...item(2, '03-11-26', 'Urgente'), extra: true }],
    };

    it('counts extras apart in the JSON totals and keeps the flag', () => {
      const data = buildJsonExport(withExtras, FULL_BACKUP);
      expect(data.totals).toEqual({ summaries: 1, cases: 1, extras: 1 });
      expect(data.cases[1].extra).toBe(true);
    });

    it('lists extras in their own section of the TXT report', () => {
      const text = buildTxtReport(withExtras, FULL_BACKUP, 'Kike');
      expect(text).toContain('Totales: 1 resúmenes · 1 casos · 1 extras');
      const extrasSection = text.slice(text.indexOf('CASOS EXTRAS'));
      const casesSection = text.slice(text.indexOf(' CASOS:'), text.indexOf('CASOS EXTRAS'));
      expect(extrasSection).toContain('- Urgente');
      expect(casesSection).toContain('- Normal');
      expect(casesSection).not.toContain('Urgente');
    });

    it('rejects an imported item whose extra flag is not a boolean', () => {
      const valid = validItems([
        { ...item(1, '03-11-26'), extra: true },
        { ...item(2, '03-11-26'), extra: 'sí' },
      ]);
      expect(valid.map((i) => i.id)).toEqual([1]);
    });
  });
});
