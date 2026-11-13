<script setup lang="ts">
  /**
   * @file Home.vue
   * @namespace src.pages
   * @description Home page component for the application
   *
   * @component
   * @example
   * <Home />
   */

  import { ref, onMounted, computed } from 'vue';
  import Logo from '@/shared/icons/favicon.svg';
  import { useUserStore } from '@/stores/user.store';
  import EditModal from '@/shared/components/EditModal.vue';
  import NotifyModal from '@/shared/components/NotifyModal.vue';
  import HomeSidebar from '@/shared/components/HomeSidebar.vue';
  import { initHome } from '@/logic/home.logic';
  import { buildDemoEntries, buildDemoExtras } from '@/logic/demo.logic';
  import { splitCases } from '@/shared/utils/case.utils';
  import { parseItemDate } from '@/shared/utils/date.utils';
  import { useSummaryStore } from '@/modules/summaries/store/summary.store';
  import { useCaseStore } from '@/modules/cases/store/case.store';
  import { save } from '@tauri-apps/plugin-dialog';
  import { writeTextFile } from '@tauri-apps/plugin-fs';
  import {
    buildJsonExport,
    buildTxtReport,
    exportFileName,
    mergeById,
    monthKey,
    scopeLabel,
    scopedLists,
    validItems,
    type ExportScope,
  } from '@/logic/export.logic';

  const userStore = useUserStore();
  const summaryStore = useSummaryStore();
  const caseStore = useCaseStore();

  const showNameModal = ref(false);
  const modalTitle = ref('');
  const modalPlaceholder = ref('');
  const showContent = ref(false);
  const isDev = import.meta.env.DEV;

  // Notification modal state
  const showNotify = ref(false);
  const notifyTitle = ref('');
  const notifyMessage = ref('');
  const notifyType = ref<'success' | 'error' | 'info'>('info');

  function notify(title: string, message: string, type: 'success' | 'error' | 'info' = 'info') {
    notifyTitle.value = title;
    notifyMessage.value = message;
    notifyType.value = type;
    showNotify.value = true;
  }

  // Exports cover the current month unless another month or a full backup is chosen.
  const exportScope = ref<ExportScope>(monthKey(new Date()));
  const exportLists = computed(() =>
    scopedLists({ summaries: summaryStore.list, cases: caseStore.list }, exportScope.value)
  );
  const exportCases = computed(() => splitCases(exportLists.value.cases));
  const hasDataToExport = computed(
    () => exportLists.value.summaries.length > 0 || exportLists.value.cases.length > 0
  );

  function openNameModal(isEditing = false) {
    modalTitle.value = isEditing ? 'Editar nombre' : 'Introduce tu nombre';
    modalPlaceholder.value = isEditing ? 'Cambia tu nombre' : 'Escribe tu nombre';
    showNameModal.value = true;
  }

  function handleSaveName(newName: string): void {
    userStore.setName(newName);
  }

  function clearName(): void {
    userStore.clearName();
    openNameModal(true);
  }

  // Dev only: fills the last 12 months with 20–50 summaries and 20–50 cases each.
  function seedDemo(): void {
    const summaries = buildDemoEntries('summaries');
    const cases = buildDemoEntries('cases');
    const extras = buildDemoExtras();
    // Mixed by date, so extras sit among the normal cases in the table.
    const allCases = [...cases, ...extras].sort(
      (a, b) => (parseItemDate(a.date)?.getTime() ?? 0) - (parseItemDate(b.date)?.getTime() ?? 0)
    );
    summaryStore.addMany(summaries);
    caseStore.addMany(allCases);
    notify(
      'Datos demo generados',
      `Se agregaron ${summaries.length} resúmenes, ${cases.length} casos y ${extras.length} extras de los últimos 12 meses.`,
      'success'
    );
  }

  function seedSummaries(): void {
    summaryStore.seed(30, 'Resumen de prueba');
    notify('Datos cargados', 'Se han cargado 30 resúmenes de prueba.', 'success');
  }

  // EXPORT / IMPORT LOGIC
  async function saveFile(extension: 'json' | 'txt', content: string): Promise<void> {
    const label = extension.toUpperCase();
    try {
      const filePath = await save({
        defaultPath: exportFileName(exportScope.value, extension),
        filters: [{ name: extension === 'json' ? 'JSON' : 'Texto', extensions: [extension] }],
      });

      if (filePath) {
        await writeTextFile(filePath, content);
        notify(
          'Exportación exitosa',
          `${scopeLabel(exportScope.value)} exportado a ${label} correctamente.`,
          'success'
        );
      }
    } catch (err) {
      console.error(`Error al exportar ${label}:`, err);
      notify('Error', `No se pudo exportar el archivo ${label}: ${String(err)}`, 'error');
    }
  }

  function exportJSON(): Promise<void> {
    const data = buildJsonExport(exportLists.value, exportScope.value);
    return saveFile('json', JSON.stringify(data, null, 2));
  }

  function exportTXT(): Promise<void> {
    return saveFile(
      'txt',
      buildTxtReport(exportLists.value, exportScope.value, userStore.getName || '')
    );
  }

  const fileInput = ref<HTMLInputElement | null>(null);

  function triggerImport(): void {
    fileInput.value?.click();
  }

  function importData(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as { summaries?: unknown; cases?: unknown };
        const summaries = validItems(data.summaries);
        const cases = validItems(data.cases);
        if (summaries.length === 0 && cases.length === 0) throw new Error('Sin registros válidos');

        // Merge, never replace: importing one month must not erase the others.
        for (const [store, items] of [
          [summaryStore, summaries],
          [caseStore, cases],
        ] as const) {
          if (items.length === 0) continue;
          store.list = mergeById(store.list, items);
          store.nextId = Math.max(0, ...store.list.map((item) => item.id)) + 1;
          store.reindexAndSort();
        }
        notify(
          'Importación exitosa',
          `Se agregaron o actualizaron ${summaries.length} resúmenes y ${cases.length} casos.`,
          'success'
        );
      } catch (err) {
        console.error(err);
        notify(
          'Error de importación',
          'No se pudieron importar los datos. Verifica que sea un archivo JSON válido generado por Sumsy.',
          'error'
        );
      } finally {
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      }
    };
    reader.readAsText(file);
  }

  onMounted(() => {
    initHome(userStore, showContent, openNameModal);
  });
</script>

<template>
  <div class="relative flex flex-col items-center justify-center p-4 lg:px-0 h-full">
    <!-- Input oculto para importar -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden"
      aria-label="Seleccionar archivo de copia de seguridad"
      @change="importData"
    />

    <!-- Layout principal -->
    <!-- On large screens: spacer · welcome · sidebar in equal side columns, so the welcome
         stays centered and the sidebar rests near the window's right edge, inside the
         main area (never over the navbar or footer). -->
    <div
      v-if="showContent"
      class="flex flex-col items-center w-full lg:grid lg:grid-cols-[minmax(16rem,1fr)_auto_minmax(16rem,1fr)] lg:items-center lg:gap-8"
    >
      <div class="hidden lg:block" aria-hidden="true" />

      <!-- Contenido principal centrado -->
      <div class="text-center flex flex-col items-center justify-center">
        <!-- Logo -->
        <Logo
          id="Logo"
          src="@/shared/icons/favicon.svg"
          alt="Logotipo de Sumsy"
          class="w-32 h-32 mb-4 hover:scale-110 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
          tabindex="0"
        />

        <!-- Title -->
        <h1
          class="text-4xl text-center font-bold text-slate-800 dark:text-slate-100 cursor-default tracking-tight"
        >
          Sumsy
        </h1>

        <!-- Welcome message -->
        <div
          v-if="userStore.getName && userStore.getName.trim() !== ''"
          class="flex flex-row justify-center items-center w-full"
        >
          <h2
            id="welcome-message"
            class="mt-4 text-lg text-slate-600 dark:text-slate-300 text-center"
          >
            Bienvenido,
            <span class="font-semibold text-blue-600 dark:text-blue-400">
              {{ userStore.getName }}
            </span>
            !
          </h2>
        </div>
      </div>

      <!-- Sidebar derecho -->
      <HomeSidebar
        v-if="userStore.getName && userStore.getName.trim() !== ''"
        v-model:scope="exportScope"
        class="mt-8 lg:mt-0 lg:justify-self-end"
        :has-data="hasDataToExport"
        :summary-count="exportLists.summaries.length"
        :case-count="exportCases.normal.length"
        :extra-count="exportCases.extra.length"
        :is-dev="isDev"
        :has-user="!!(userStore.getName && userStore.getName.trim() !== '')"
        @import-click="triggerImport"
        @export-json="exportJSON"
        @export-txt="exportTXT"
        @change-name="openNameModal(true)"
        @clear-name="clearName"
        @seed-data="seedSummaries"
        @seed-demo="seedDemo"
      />
    </div>

    <!-- Edit Modal -->
    <EditModal
      v-model="showNameModal"
      :title="modalTitle"
      :initial-name="userStore.getName || ''"
      :place-holder="modalPlaceholder"
      :user-store="userStore"
      @save="handleSaveName"
    />

    <!-- Notification Modal -->
    <NotifyModal
      v-model="showNotify"
      :title="notifyTitle"
      :message="notifyMessage"
      :type="notifyType"
    />
  </div>
</template>
