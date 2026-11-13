<script setup lang="ts">
  /**
   * @file HomeSidebar.vue
   * @description Sidebar with data actions, profile and dev tools.
   */

  import { computed, ref } from 'vue';
  import { FULL_BACKUP, monthKey, type ExportScope } from '@/logic/export.logic';

  const props = withDefaults(
    defineProps<{
      hasData: boolean;
      isDev: boolean;
      hasUser: boolean;
      /** Items of the chosen export period. */
      summaryCount?: number;
      /** Normal cases only. */
      caseCount?: number;
      extraCount?: number;
    }>(),
    { summaryCount: 0, caseCount: 0, extraCount: 0 }
  );

  const currentMonth = monthKey(new Date());

  /** "YYYY-MM" or FULL_BACKUP; the current month by default. */
  const scope = defineModel<ExportScope>('scope', { default: () => monthKey(new Date()) });

  // Remembers the picked month while "Copia completa" is on, to restore it when turned off.
  const pickedMonth = ref(scope.value === FULL_BACKUP ? currentMonth : scope.value);

  const isFullBackup = computed({
    get: () => scope.value === FULL_BACKUP,
    set: (full: boolean) => (scope.value = full ? FULL_BACKUP : pickedMonth.value),
  });

  // The picker shows the year as text (with arrows) and only the month name in the select.
  const currentYear = Number(currentMonth.slice(0, 4));
  const currentMonthNumber = Number(currentMonth.slice(5));
  const pickedYear = computed(() => Number(pickedMonth.value.slice(0, 4)));
  const pickedMonthNumber = computed(() => Number(pickedMonth.value.slice(5)));

  const monthNames = Array.from({ length: 12 }, (_, index) =>
    new Date(2000, index, 1).toLocaleDateString('es-ES', { month: 'long' })
  );

  function isFutureMonth(year: number, month: number): boolean {
    return year > currentYear || (year === currentYear && month > currentMonthNumber);
  }

  function setPicked(year: number, month: number) {
    // Moving to the current year from a later month would land in the future: clamp it.
    const safeMonth = isFutureMonth(year, month) ? currentMonthNumber : month;
    pickedMonth.value = `${year}-${String(safeMonth).padStart(2, '0')}`;
    scope.value = pickedMonth.value;
  }

  function pickMonth(event: Event) {
    setPicked(pickedYear.value, Number((event.target as HTMLSelectElement).value));
  }

  function changeYear(step: number) {
    setPicked(pickedYear.value + step, pickedMonthNumber.value);
  }

  const periodSummary = computed(() => {
    const plural = (count: number, one: string, many: string) =>
      `${count} ${count === 1 ? one : many}`;
    return [
      plural(props.summaryCount, 'resumen', 'resúmenes'),
      plural(props.caseCount, 'caso', 'casos'),
      plural(props.extraCount, 'extra', 'extras'),
    ].join(' · ');
  });

  defineEmits<{
    (e: 'importClick'): void;
    (e: 'exportJson'): void;
    (e: 'exportTxt'): void;
    (e: 'changeName'): void;
    (e: 'clearName'): void;
    (e: 'seedData'): void;
    (e: 'seedDemo'): void;
  }>();
</script>

<template>
  <aside
    class="w-full sm:w-64 lg:w-72 flex-shrink-0 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-5 flex flex-col gap-4 h-fit"
    aria-label="Panel de acciones"
  >
    <!-- Sección: Datos -->
    <section class="flex flex-col gap-2">
      <h3
        class="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500"
      >
        Datos
      </h3>

      <button
        class="flex items-center gap-2.5 w-full text-left min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all duration-200"
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
            stroke-width="1.75"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        Importar
      </button>
    </section>

    <hr class="border-slate-200/80 dark:border-slate-700/70" />

    <!-- Periodo a exportar -->
    <section class="flex flex-col gap-2">
      <h3
        class="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500"
      >
        Exportar
      </h3>

      <div class="flex items-center justify-between px-1">
        <span
          id="export-year"
          class="text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-200 transition-opacity duration-200"
          :class="{ 'opacity-40': isFullBackup }"
          aria-live="polite"
        >
          {{ pickedYear }}
        </span>
        <div class="flex items-center gap-1">
          <button
            id="export-year-prev"
            type="button"
            class="grid size-7 place-items-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700/60 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Año anterior"
            :disabled="isFullBackup"
            @click="changeYear(-1)"
          >
            <svg
              class="size-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            id="export-year-next"
            type="button"
            class="grid size-7 place-items-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700/60 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Año siguiente"
            :disabled="isFullBackup || pickedYear >= currentYear"
            @click="changeYear(1)"
          >
            <svg
              class="size-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <label for="export-month" class="sr-only">Mes a exportar</label>
      <div class="relative">
        <select
          id="export-month"
          :value="pickedMonthNumber"
          :disabled="isFullBackup"
          class="w-full min-h-11 appearance-none pl-3 pr-9 py-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 dark:[color-scheme:dark] cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-opacity duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          @change="pickMonth"
        >
          <option
            v-for="(name, index) in monthNames"
            :key="name"
            :value="index + 1"
            :disabled="isFutureMonth(pickedYear, index + 1)"
          >
            {{ name }}
          </option>
        </select>
        <svg
          class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      <label
        class="flex items-center gap-2.5 px-1 py-1 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none"
      >
        <input
          v-model="isFullBackup"
          type="checkbox"
          class="size-4 rounded accent-blue-600 cursor-pointer"
        />
        Copia completa
      </label>

      <Transition name="swap" mode="out-in">
        <p
          :key="periodSummary"
          class="px-1 text-xs leading-5 tabular-nums text-slate-500 dark:text-slate-400"
          aria-live="polite"
        >
          {{ periodSummary }}
        </p>
      </Transition>

      <div class="flex flex-col gap-2 pt-1">
        <button
          :disabled="!hasData"
          class="flex items-center gap-2.5 w-full text-left min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus-visible:outline-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
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
              stroke-width="1.75"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Exportar JSON
        </button>

        <button
          :disabled="!hasData"
          class="flex items-center gap-2.5 w-full text-left min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus-visible:outline-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
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
              stroke-width="1.75"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Exportar TXT
        </button>
      </div>
    </section>

    <!-- Sección: Perfil -->
    <template v-if="hasUser">
      <hr class="border-slate-200/80 dark:border-slate-700/70" />

      <section class="flex flex-col gap-2">
        <h3
          class="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500"
        >
          Perfil
        </h3>

        <button
          id="change-name-button"
          class="flex items-center gap-2.5 w-full text-left min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:outline-none transition-all duration-200"
          aria-label="Cambiar nombre de usuario"
          @click="$emit('changeName')"
        >
          <svg
            class="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.75"
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
      </section>
    </template>

    <!-- Sección: Dev (solo en desarrollo) -->
    <template v-if="isDev">
      <hr class="border-slate-200/80 dark:border-slate-700/70" />

      <section class="flex flex-col gap-2">
        <h3
          class="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500"
        >
          Dev
        </h3>

        <button
          id="seed-summaries-button"
          class="flex items-center gap-2.5 w-full text-left min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all duration-200"
          aria-label="Cargar datos de prueba"
          @click="$emit('seedData')"
        >
          <svg
            class="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.75"
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
          id="seed-demo-button"
          class="flex items-center gap-2.5 w-full text-left min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all duration-200"
          aria-label="Generar 12 meses de resúmenes y casos aleatorios"
          @click="$emit('seedDemo')"
        >
          <svg
            class="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.75"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
          Generar demo
        </button>

        <button
          v-if="hasUser"
          id="clear-name-button"
          class="flex items-center gap-2.5 w-full text-left min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none transition-all duration-200"
          aria-label="Borrar nombre de usuario"
          @click="$emit('clearName')"
        >
          <svg
            class="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.75"
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
      </section>
    </template>
  </aside>
</template>
