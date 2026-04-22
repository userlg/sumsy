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
  <div class="relative flex flex-col items-center justify-center text-center p-4 h-full">
    <div
      v-if="showContent"
      class="text-center flex flex-col items-center justify-center w-full max-w-lg"
    >
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

      <!-- Acciones de Importar / Exportar -->
      <div
        v-if="userStore.getName && userStore.getName.trim() !== ''"
        class="mt-8 flex flex-wrap justify-center gap-4 w-full"
        aria-label="Acciones de datos"
      >
        <!-- Input oculto para importar -->
        <input
          type="file"
          ref="fileInput"
          accept=".json"
          class="hidden"
          @change="importData"
          aria-label="Seleccionar archivo de copia de seguridad"
        />

        <!-- Botón Importar -->
        <button
          class="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all duration-200 font-medium w-full sm:w-auto"
          @click="() => fileInput?.click()"
          aria-label="Importar datos desde un archivo JSON"
        >
          <svg
            class="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            ></path>
          </svg>
          Importar Datos
        </button>

        <!-- Botón Exportar JSON -->
        <button
          :disabled="!hasDataToExport"
          class="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 focus-visible:outline-none transition-all duration-200 font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:bg-blue-600"
          @click="exportJSON"
          aria-label="Exportar datos a un archivo JSON"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            ></path>
          </svg>
          Exportar JSON
        </button>

        <!-- Botón Exportar TXT -->
        <button
          :disabled="!hasDataToExport"
          class="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 focus-visible:outline-none transition-all duration-200 font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:bg-indigo-600"
          @click="exportTXT"
          aria-label="Exportar datos a un archivo de texto"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Exportar TXT
        </button>
      </div>

      <!-- Acciones auxiliares (dev + cambiar nombre) -->
      <div
        v-if="isDev || (userStore.getName && userStore.getName.trim() !== '')"
        class="mt-auto pt-12 w-full flex justify-center gap-4"
      >
        <button
          v-if="userStore.getName && userStore.getName.trim() !== '' && isDev"
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
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0h7.5" />
          </svg>
          Cargar Datos
        </button>

        <button
          v-if="userStore.getName && userStore.getName.trim() !== ''"
          id="change-name-button"
          class="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full shadow-sm hover:scale-105 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:outline-none transition-all duration-200 text-sm"
          @click="openNameModal(true)"
          aria-label="Cambiar nombre de usuario"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
          Cambiar nombre
        </button>
      </div>
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
