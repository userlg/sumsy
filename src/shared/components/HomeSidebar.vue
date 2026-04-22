<script setup lang="ts">
  /**
   * @file HomeSidebar.vue
   * @description Sidebar with data actions, profile and dev tools.
   */

  defineProps<{
    hasData: boolean;
    isDev: boolean;
    hasUser: boolean;
  }>();

  defineEmits<{
    (e: 'importClick'): void;
    (e: 'exportJson'): void;
    (e: 'exportTxt'): void;
    (e: 'changeName'): void;
    (e: 'clearName'): void;
    (e: 'seedData'): void;
  }>();
</script>

<template>
  <aside
    class="w-full sm:w-52 flex-shrink-0 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-4 flex flex-col gap-2.5 h-fit"
    aria-label="Panel de acciones"
  >
    <!-- Sección: Datos -->
    <h3
      class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5"
    >
      Datos
    </h3>

    <button
      class="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all duration-200"
      aria-label="Importar datos desde un archivo JSON"
      @click="$emit('importClick')"
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

    <button
      :disabled="!hasData"
      class="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus-visible:outline-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
      aria-label="Exportar datos a un archivo JSON"
      @click="$emit('exportJson')"
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

    <button
      :disabled="!hasData"
      class="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus-visible:outline-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
      aria-label="Exportar datos a un archivo de texto"
      @click="$emit('exportTxt')"
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

    <!-- Sección: Perfil -->
    <template v-if="hasUser">
      <hr class="border-slate-200 dark:border-slate-700 my-1" />
      <h3
        class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5"
      >
        Perfil
      </h3>

      <button
        class="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:outline-none transition-all duration-200"
        aria-label="Cambiar nombre de usuario"
        @click="$emit('changeName')"
      >
        <svg
          class="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z"
          />
        </svg>
        Cambiar nombre
      </button>
    </template>

    <!-- Sección: Dev (solo en desarrollo) -->
    <template v-if="isDev">
      <hr class="border-slate-200 dark:border-slate-700 my-1" />
      <h3
        class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5"
      >
        Dev
      </h3>

      <button
        class="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all duration-200"
        aria-label="Cargar datos de prueba"
        @click="$emit('seedData')"
      >
        <svg
          class="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125v-3.75"
          />
        </svg>
        Cargar Datos
      </button>

      <button
        v-if="hasUser"
        class="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none transition-all duration-200"
        aria-label="Borrar nombre de usuario"
        @click="$emit('clearName')"
      >
        <svg
          class="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
        Borrar Nombre
      </button>
    </template>
  </aside>
</template>
