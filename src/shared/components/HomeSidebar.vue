<script setup lang="ts">
  /**
   * @file HomeSidebar.vue
   * @description Sidebar with data actions, profile and dev tools.
   */

  import { computed, ref } from 'vue';
  import Tooltip from './Tooltip.vue';
  import { FULL_BACKUP, monthKey, type ExportScope } from '@/logic/export.logic';
  import ArrowDownTrayIcon from '@/shared/icons/arrow-down-tray.svg?component';
  import ArrowUpTrayIcon from '@/shared/icons/arrow-up-tray.svg?component';
  import ChartBarIcon from '@/shared/icons/chart-bar.svg?component';
  import ChevronDownIcon from '@/shared/icons/chevron-down.svg?component';
  import ChevronLeftIcon from '@/shared/icons/chevron-left.svg?component';
  import ChevronRightIcon from '@/shared/icons/chevron-right.svg?component';
  import CircleStackIcon from '@/shared/icons/circle-stack.svg?component';
  import DocumentTextIcon from '@/shared/icons/document-text.svg?component';
  import PencilIcon from '@/shared/icons/pencil.svg?component';
  import TrashIcon from '@/shared/icons/trash.svg?component';

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
        <ArrowUpTrayIcon class="w-4 h-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
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
          <Tooltip text="Año anterior">
            <button
              id="export-year-prev"
              type="button"
              class="grid size-7 place-items-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700/60 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Año anterior"
              :disabled="isFullBackup"
              @click="changeYear(-1)"
            >
              <ChevronLeftIcon class="size-4" aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip text="Año siguiente">
            <button
              id="export-year-next"
              type="button"
              class="grid size-7 place-items-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700/60 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors duration-150 disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Año siguiente"
              :disabled="isFullBackup || pickedYear >= currentYear"
              @click="changeYear(1)"
            >
              <ChevronRightIcon class="size-4" aria-hidden="true" />
            </button>
          </Tooltip>
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
        <ChevronDownIcon
          class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
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
          <ArrowDownTrayIcon class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Exportar JSON
        </button>

        <button
          :disabled="!hasData"
          class="flex items-center gap-2.5 w-full text-left min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus-visible:outline-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
          aria-label="Exportar datos a un archivo de texto"
          @click="$emit('exportTxt')"
        >
          <DocumentTextIcon class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
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
          <PencilIcon class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
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
          <CircleStackIcon class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Cargar Datos
        </button>

        <button
          id="seed-demo-button"
          class="flex items-center gap-2.5 w-full text-left min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all duration-200"
          aria-label="Generar 12 meses de resúmenes y casos aleatorios"
          @click="$emit('seedDemo')"
        >
          <ChartBarIcon class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Generar demo
        </button>

        <button
          v-if="hasUser"
          id="clear-name-button"
          class="flex items-center gap-2.5 w-full text-left min-h-11 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none transition-all duration-200"
          aria-label="Borrar nombre de usuario"
          @click="$emit('clearName')"
        >
          <TrashIcon class="w-4 h-4 flex-shrink-0" stroke-width="1.75" aria-hidden="true" />
          Borrar Nombre
        </button>
      </section>
    </template>
  </aside>
</template>
