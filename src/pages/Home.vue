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
  import HomeSidebar from '@/shared/components/HomeSidebar.vue';
  import { initHome } from '@/logic/home.logic';
  import { useSummaryStore } from '@/modules/summaries/store/summary.store';
  import { useCaseStore } from '@/modules/cases/store/case.store';

  const userStore = useUserStore();
  const summaryStore = useSummaryStore();
  const caseStore = useCaseStore();

  const showNameModal = ref(false);
  const modalTitle = ref('');
  const modalPlaceholder = ref('');
  const showContent = ref(false);
  const isDev = import.meta.env.DEV;

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
    alert('Se han cargado 30 resúmenes de prueba.');
  }

  // EXPORT / IMPORT LOGIC
  function exportJSON(): void {
    const data = {
      exportDate: new Date().toISOString(),
      totals: {
        summaries: summaryStore.list.length,
        cases: caseStore.list.length,
      },
      summaries: summaryStore.list,
      cases: caseStore.list,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sumsy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportTXT(): void {
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

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte-Sumsy-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
        const data = JSON.parse(content);

        if (data.summaries && Array.isArray(data.summaries)) {
          summaryStore.list = data.summaries;
          summaryStore.nextId = Math.max(0, ...data.summaries.map((s: any) => s.id)) + 1;
          summaryStore.reindexAndSort();
        }
        if (data.cases && Array.isArray(data.cases)) {
          caseStore.list = data.cases;
          caseStore.nextId = Math.max(0, ...data.cases.map((c: any) => c.id)) + 1;
          caseStore.reindexAndSort();
        }
        alert('Datos importados correctamente.');
      } catch (err) {
        console.error(err);
        alert(
          'Error al importar los datos. Verifica que sea un archivo JSON válido generado por Sumsy.'
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
      type="file"
      ref="fileInput"
      accept=".json"
      class="hidden"
      @change="importData"
      aria-label="Seleccionar archivo de copia de seguridad"
    />

    <!-- Layout principal: contenido centrado + sidebar -->
    <div
      v-if="showContent"
      class="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full"
    >
      <!-- Contenido principal centrado -->
      <div class="flex-1 text-center flex flex-col items-center justify-center">
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

        <!-- Acciones auxiliares centradas (dev + cambiar nombre) -->
        <div
          v-if="userStore.getName && userStore.getName.trim() !== ''"
          class="mt-8 flex justify-center gap-4 flex-wrap"
        >
          <button
            v-if="isDev"
            id="clear-name-button"
            class="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full shadow-sm hover:scale-105 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none transition-all duration-200 text-sm"
            @click="clearName"
            aria-label="Borrar nombre de usuario"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Borrar Nombre
          </button>

          <button
            v-if="isDev"
            id="seed-summaries-button"
            class="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-sm hover:scale-105 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all duration-200 text-sm"
            @click="seedSummaries"
            aria-label="Cargar datos de prueba"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125v-3.75" />
            </svg>
            Cargar Datos
          </button>

          <button
            id="change-name-button"
            class="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full shadow-sm hover:scale-105 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:outline-none transition-all duration-200 text-sm"
            @click="openNameModal(true)"
            aria-label="Cambiar nombre de usuario"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
            </svg>
            Cambiar nombre
          </button>
        </div>
      </div>

      <!-- Sidebar derecho (solo import/export) -->
      <HomeSidebar
        v-if="userStore.getName && userStore.getName.trim() !== ''"
        :has-data="hasDataToExport"
        @import-click="triggerImport"
        @export-json="exportJSON"
        @export-txt="exportTXT"
      />
    </div>

    <!-- Modal -->
    <EditModal
      v-model="showNameModal"
      :title="modalTitle"
      :initial-name="userStore.getName || ''"
      :place-holder="modalPlaceholder"
      :user-store="userStore"
      @save="handleSaveName"
    />
  </div>
</template>
