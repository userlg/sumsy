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
  import { useSummaryStore } from '@/modules/summaries/store/summary.store';
  import { useCaseStore } from '@/modules/cases/store/case.store';
  import { save } from '@tauri-apps/plugin-dialog';
  import { writeTextFile } from '@tauri-apps/plugin-fs';

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

  const hasDataToExport = computed(() => {
    return summaryStore.list.length > 0 || caseStore.list.length > 0;
  });

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

  function seedSummaries(): void {
    summaryStore.seed(30, 'Resumen de prueba');
    notify('Datos cargados', 'Se han cargado 30 resúmenes de prueba.', 'success');
  }

  // EXPORT / IMPORT LOGIC
  async function exportJSON(): Promise<void> {
    try {
      const data = {
        exportDate: new Date().toISOString(),
        totals: {
          summaries: summaryStore.list.length,
          cases: caseStore.list.length,
        },
        summaries: summaryStore.list,
        cases: caseStore.list,
      };

      const defaultName = `sumsy-backup-${new Date().toISOString().split('T')[0]}.json`;
      const filePath = await save({
        defaultPath: defaultName,
        filters: [{ name: 'JSON', extensions: ['json'] }],
      });

      if (filePath) {
        await writeTextFile(filePath, JSON.stringify(data, null, 2));
        notify('Exportación exitosa', 'Archivo JSON exportado correctamente.', 'success');
      }
    } catch (err) {
      console.error('Error al exportar JSON:', err);
      notify('Error', `No se pudo exportar el archivo JSON: ${err}`, 'error');
    }
  }

  async function exportTXT(): Promise<void> {
    try {
      const totalSummaries = summaryStore.list.length;
      const totalCases = caseStore.list.length;
      const date = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      let txtContent = `====================================================\n`;
      txtContent += `                 REPORTE DE SUMSY\n`;
      txtContent += `====================================================\n\n`;
      txtContent += `Fecha de generación: ${date}\n`;
      txtContent += `Usuario: ${userStore.getName || 'Desconocido'}\n\n`;

      txtContent += `----------------------------------------------------\n`;
      txtContent += ` RESÚMENES: ${totalSummaries} en total\n`;
      txtContent += `----------------------------------------------------\n`;
      if (totalSummaries > 0) {
        summaryStore.list.forEach((s) => {
          txtContent += ` - [${s.date}] ${s.name}\n`;
        });
      } else {
        txtContent += `   (No hay resúmenes registrados)\n`;
      }
      txtContent += `\n`;

      txtContent += `----------------------------------------------------\n`;
      txtContent += ` CASOS: ${totalCases} en total\n`;
      txtContent += `----------------------------------------------------\n`;
      if (totalCases > 0) {
        caseStore.list.forEach((c) => {
          txtContent += ` - [${c.date}] ${c.name}\n`;
        });
      } else {
        txtContent += `   (No hay casos registrados)\n`;
      }
      txtContent += `\n====================================================\n`;

      const defaultName = `Reporte-Sumsy-${new Date().toISOString().split('T')[0]}.txt`;
      const filePath = await save({
        defaultPath: defaultName,
        filters: [{ name: 'Texto', extensions: ['txt'] }],
      });

      if (filePath) {
        await writeTextFile(filePath, txtContent);
        notify('Exportación exitosa', 'Archivo TXT exportado correctamente.', 'success');
      }
    } catch (err) {
      console.error('Error al exportar TXT:', err);
      notify('Error', `No se pudo exportar el archivo TXT: ${err}`, 'error');
    }
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
        const data = JSON.parse(content) as {
          summaries?: Array<{ id: number; [key: string]: unknown }>;
          cases?: Array<{ id: number; [key: string]: unknown }>;
        };

        if (data.summaries && Array.isArray(data.summaries)) {
          summaryStore.list = data.summaries as any;
          summaryStore.nextId = Math.max(0, ...data.summaries.map((s) => s.id)) + 1;
          summaryStore.reindexAndSort();
        }
        if (data.cases && Array.isArray(data.cases)) {
          caseStore.list = data.cases as any;
          caseStore.nextId = Math.max(0, ...data.cases.map((c) => c.id)) + 1;
          caseStore.reindexAndSort();
        }
        notify('Importación exitosa', 'Datos importados correctamente.', 'success');
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
  <div class="relative flex flex-col items-center justify-center p-4 h-full">
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
    <div v-if="showContent" class="flex flex-col items-center justify-center w-full relative">
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

      <!-- Sidebar derecho (fijo a la derecha) -->
      <HomeSidebar
        v-if="userStore.getName && userStore.getName.trim() !== ''"
        class="lg:absolute lg:-right-10 lg:top-1/2 lg:-translate-y-1/2 mt-8 lg:mt-0"
        :has-data="hasDataToExport"
        :is-dev="isDev"
        :has-user="!!(userStore.getName && userStore.getName.trim() !== '')"
        @import-click="triggerImport"
        @export-json="exportJSON"
        @export-txt="exportTXT"
        @change-name="openNameModal(true)"
        @clear-name="clearName"
        @seed-data="seedSummaries"
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
