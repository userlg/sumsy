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

  import { ref, onMounted } from 'vue';
  import Logo from '@/shared/icons/favicon.svg?component';
  import { useUserStore } from '@/stores/user.store';
  import EditModal from '@/shared/components/EditModal.vue';
  import NotifyModal from '@/shared/components/NotifyModal.vue';
  import HomeSidebar from '@/shared/components/HomeSidebar.vue';
  import { initHome } from '@/logic/home.logic';
  import { buildDemoEntries, buildDemoExtras } from '@/logic/demo.logic';
  import { useSummaryStore } from '@/modules/summaries/store/summary.store';
  import { useCaseStore } from '@/modules/cases/store/case.store';
  import { monthKey, type ExportScope } from '@/logic/export.logic';
  import { useNotify } from '@/shared/composables/useNotify';
  import { useDataTransfer } from '@/shared/composables/useDataTransfer';

  const userStore = useUserStore();
  const summaryStore = useSummaryStore();
  const caseStore = useCaseStore();

  const showNameModal = ref(false);
  const modalTitle = ref('');
  const modalPlaceholder = ref('');
  const showContent = ref(false);
  const isDev = import.meta.env.DEV;

  const {
    show: showNotify,
    title: notifyTitle,
    message: notifyMessage,
    type: notifyType,
    notify,
  } = useNotify();

  // Exports cover the current month unless another month or a full backup is chosen.
  const exportScope = ref<ExportScope>(monthKey(new Date()));
  const { exportLists, exportCases, hasDataToExport, exportJSON, exportTXT, importFile } =
    useDataTransfer({ scope: exportScope, userName: () => userStore.getName || '', notify });

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
    summaryStore.addMany(summaries);
    caseStore.addMany([...cases, ...extras]); // the store orders them by date
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

  const fileInput = ref<HTMLInputElement | null>(null);

  function triggerImport(): void {
    fileInput.value?.click();
  }

  async function onFileChosen(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    await importFile(file);
    input.value = ''; // so choosing the same file again fires change
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
      @change="onFileChosen"
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
          role="img"
          aria-label="Logotipo de Sumsy"
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
      :can-cancel="!!userStore.getName?.trim()"
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
