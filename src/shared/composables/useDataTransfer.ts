/**
 * @file useDataTransfer.ts
 * @namespace src.shared.composables
 * @description Export (JSON backup, TXT report) and JSON import for the summaries and cases
 *
 * Exports cover the chosen scope: a month or a full backup. Imports merge by id.
 * Every outcome is reported through the given notify().
 */

import { computed, type Ref } from 'vue';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { useSummaryStore } from '@/modules/summaries/store/summary.store';
import { useCaseStore } from '@/modules/cases/store/case.store';
import { splitCases } from '@/shared/utils/case.utils';
import {
  buildJsonExport,
  buildTxtReport,
  exportFileName,
  scopeLabel,
  scopedLists,
  validItems,
  type ExportScope,
} from '@/logic/export.logic';
import type { Notify } from './useNotify';

export function useDataTransfer(options: {
  scope: Ref<ExportScope>;
  userName: () => string;
  notify: Notify;
}) {
  const { scope, userName, notify } = options;
  const summaryStore = useSummaryStore();
  const caseStore = useCaseStore();

  const exportLists = computed(() =>
    scopedLists({ summaries: summaryStore.list, cases: caseStore.list }, scope.value)
  );
  const exportCases = computed(() => splitCases(exportLists.value.cases));
  const hasDataToExport = computed(
    () => exportLists.value.summaries.length > 0 || exportLists.value.cases.length > 0
  );

  async function saveFile(extension: 'json' | 'txt', content: string): Promise<void> {
    const label = extension.toUpperCase();
    try {
      const filePath = await save({
        defaultPath: exportFileName(scope.value, extension),
        filters: [{ name: extension === 'json' ? 'JSON' : 'Texto', extensions: [extension] }],
      });

      if (filePath) {
        await writeTextFile(filePath, content);
        notify(
          'Exportación exitosa',
          `${scopeLabel(scope.value)} exportado a ${label} correctamente.`,
          'success'
        );
      }
    } catch (err) {
      console.error(`Error al exportar ${label}:`, err);
      notify('Error', `No se pudo exportar el archivo ${label}: ${String(err)}`, 'error');
    }
  }

  function exportJSON(): Promise<void> {
    const data = buildJsonExport(exportLists.value, scope.value);
    return saveFile('json', JSON.stringify(data, null, 2));
  }

  function exportTXT(): Promise<void> {
    return saveFile('txt', buildTxtReport(exportLists.value, scope.value, userName()));
  }

  async function importFile(file: File): Promise<void> {
    try {
      const data = JSON.parse(await file.text()) as { summaries?: unknown; cases?: unknown };
      const summaries = validItems(data.summaries);
      const cases = validItems(data.cases);
      if (summaries.length === 0 && cases.length === 0) throw new Error('Sin registros válidos');

      summaryStore.importItems(summaries);
      caseStore.importItems(cases);

      const { normal, extra } = splitCases(cases);
      notify(
        'Importación exitosa',
        `Se agregaron o actualizaron ${summaries.length} resúmenes, ${normal.length} casos y ${extra.length} extras.`,
        'success'
      );
    } catch (err) {
      console.error(err);
      notify(
        'Error de importación',
        'No se pudieron importar los datos. Verifica que sea un archivo JSON válido generado por Sumsy.',
        'error'
      );
    }
  }

  return { exportLists, exportCases, hasDataToExport, exportJSON, exportTXT, importFile };
}
