<script setup lang="ts">
  /**
   * @file HomeSidebar.vue
   * @description Sidebar with data actions (import/export only).
   */

  defineProps<{
    hasData: boolean;
  }>();

  defineEmits<{
    (e: 'importClick'): void;
    (e: 'exportJson'): void;
    (e: 'exportTxt'): void;
  }>();
</script>

<template>
  <aside
    class="w-full sm:w-52 flex-shrink-0 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-4 flex flex-col gap-2.5 h-fit"
    aria-label="Acciones de datos"
  >
    <h3
      class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5"
    >
      Datos
    </h3>

    <!-- Importar -->
    <button
      class="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all duration-200"
      @click="$emit('importClick')"
      aria-label="Importar datos desde un archivo JSON"
    >
      <svg
        class="w-4 h-4 text-blue-500 flex-shrink-0"
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
        />
      </svg>
      Importar
    </button>

    <!-- Exportar JSON -->
    <button
      :disabled="!hasData"
      class="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus-visible:outline-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
      @click="$emit('exportJson')"
      aria-label="Exportar datos a un archivo JSON"
    >
      <svg
        class="w-4 h-4 flex-shrink-0"
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
        />
      </svg>
      Exportar JSON
    </button>

    <!-- Exportar TXT -->
    <button
      :disabled="!hasData"
      class="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus-visible:outline-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
      @click="$emit('exportTxt')"
      aria-label="Exportar datos a un archivo de texto"
    >
      <svg
        class="w-4 h-4 flex-shrink-0"
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
        />
      </svg>
      Exportar TXT
    </button>
  </aside>
</template>
