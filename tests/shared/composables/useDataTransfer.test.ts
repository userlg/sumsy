/**
 * @file useDataTransfer.test.ts
 * @namespace tests.shared.composables
 * @description Tests for export / import of summaries and cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { setActivePinia, createPinia } from 'pinia';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { useDataTransfer } from '@/shared/composables/useDataTransfer';
import { useSummaryStore } from '@/modules/summaries/store/summary.store';
import { useCaseStore } from '@/modules/cases/store/case.store';
import { FULL_BACKUP } from '@/logic/export.logic';

function setup() {
  const notify = vi.fn();
  const transfer = useDataTransfer({
    scope: ref(FULL_BACKUP),
    userName: () => 'Tester',
    notify,
  });
  return { notify, ...transfer };
}

function jsonFile(content: unknown): File {
  return new File([JSON.stringify(content)], 'backup.json', { type: 'application/json' });
}

describe('useDataTransfer', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(save).mockReset().mockResolvedValue(null);
    vi.mocked(writeTextFile).mockReset().mockResolvedValue(undefined);
  });

  it('imports summaries, cases and extras and reports each count', async () => {
    const { importFile, notify } = setup();

    await importFile(
      jsonFile({
        summaries: [{ id: 1, name: 'R', date: '01-11-26', element: 1 }],
        cases: [
          { id: 1, name: 'C', date: '01-11-26', element: 1 },
          { id: 2, name: 'E', date: '02-11-26', element: 2, extra: true },
        ],
      })
    );

    expect(useSummaryStore().list).toHaveLength(1);
    expect(useCaseStore().list).toHaveLength(2);
    expect(notify).toHaveBeenCalledWith(
      'Importación exitosa',
      'Se agregaron o actualizaron 1 resúmenes, 1 casos y 1 extras.',
      'success'
    );
  });

  it('reports an error for a file that is not a Sumsy backup', async () => {
    const { importFile, notify } = setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await importFile(new File(['not json'], 'x.json'));
    await importFile(jsonFile({ summaries: [{ id: 'bad' }] }));

    expect(notify).toHaveBeenCalledTimes(2);
    expect(notify.mock.calls.every(([title]) => title === 'Error de importación')).toBe(true);
    expect(useSummaryStore().list).toHaveLength(0);
  });

  it('writes the JSON export to the chosen path', async () => {
    const { exportJSON, notify } = setup();
    useSummaryStore().create('R');
    vi.mocked(save).mockResolvedValue('C:/backup.json');

    await exportJSON();

    expect(writeTextFile).toHaveBeenCalledWith('C:/backup.json', expect.stringContaining('"R"'));
    expect(notify).toHaveBeenCalledWith('Exportación exitosa', expect.any(String), 'success');
  });

  it('writes nothing when the save dialog is cancelled', async () => {
    const { exportTXT, notify } = setup();

    await exportTXT();

    expect(writeTextFile).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it('reports an export error', async () => {
    const { exportTXT, notify } = setup();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(save).mockRejectedValue(new Error('denied'));

    await exportTXT();

    expect(notify).toHaveBeenCalledWith('Error', expect.stringContaining('denied'), 'error');
  });

  it('tells whether the scope has anything to export', () => {
    const { hasDataToExport } = setup();
    expect(hasDataToExport.value).toBe(false);
    useCaseStore().create('C', true);
    expect(hasDataToExport.value).toBe(true);
  });
});
