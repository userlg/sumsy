<script setup lang="ts">
  /**
   * @file Graphs.vue
   * @namespace src.pages
   * @description View to show the statistics: activity calendar plus one trend chart per list
   *
   * @component
   * @example
   * <Graphs />
   */

  import { computed, ref } from 'vue';
  import { useSummaryStore } from '@/modules/summaries/store/summary.store';
  import { useCaseStore } from '@/modules/cases/store/case.store';
  import Charts from '@/shared/components/Charts.vue';
  import ActivityHeatmap from '@/shared/components/ActivityHeatmap.vue';
  import ShareDonut from '@/shared/components/ShareDonut.vue';
  import SegmentedControl from '@/shared/components/SegmentedControl.vue';
  import { buildSeries, CHART_RANGES, type ChartRange } from '@/logic/chart.logic';
  import { reveal as vReveal } from '@/shared/directives/reveal';
  import { splitCases } from '@/shared/utils/case.utils';
  import PresentationChartIcon from '@/shared/icons/presentation-chart.svg?component';

  const summaryStore = useSummaryStore();
  const caseStore = useCaseStore();

  const range = ref<ChartRange>('30d');

  const summaryDates = computed(() => summaryStore.list.map((item) => item.date));
  const cases = computed(() => splitCases(caseStore.list));
  const caseDates = computed(() => cases.value.normal.map((item) => item.date));
  const extraDates = computed(() => cases.value.extra.map((item) => item.date));

  const summarySeries = computed(() => buildSeries(summaryDates.value, range.value));
  const caseSeries = computed(() => buildSeries(caseDates.value, range.value));
  const extraSeries = computed(() => buildSeries(extraDates.value, range.value));

  const hasSummaries = computed(() => summaryStore.list.length > 0);
  const hasCases = computed(() => caseStore.list.length > 0);
</script>

<template>
  <div class="mx-auto max-w-5xl py-4 space-y-8">
    <h1
      class="text-3xl font-bold tracking-tight text-center text-slate-800 dark:text-slate-100 text-balance"
    >
      Estadísticas generales
    </h1>

    <template v-if="hasSummaries || hasCases">
      <ActivityHeatmap
        :summary-dates="summaryDates"
        :case-dates="caseDates"
        :extra-dates="extraDates"
      />

      <ShareDonut
        v-reveal
        :summaries="summaryStore.list.length"
        :cases="cases.normal.length"
        :extras="cases.extra.length"
      />

      <section v-reveal class="space-y-4" aria-labelledby="trend-title">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 id="trend-title" class="text-xl font-bold text-slate-800 dark:text-slate-100">
            Evolución
          </h2>
          <SegmentedControl v-model="range" :options="CHART_RANGES" label="Rango de fechas" />
        </div>

        <div :class="['grid gap-6', hasSummaries && hasCases ? 'lg:grid-cols-2' : 'grid-cols-1']">
          <Charts v-if="hasSummaries" title="Resúmenes" tone="blue" :items="summarySeries" />
          <Charts
            v-if="hasCases"
            v-reveal="hasSummaries ? 80 : 0"
            title="Casos"
            tone="indigo"
            items-label="Normales"
            :items="caseSeries"
            :stacked="{ label: 'Extras', tone: 'pink', items: extraSeries }"
          />
        </div>
      </section>
    </template>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center text-center py-14 px-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700"
    >
      <PresentationChartIcon
        class="w-14 h-14 text-slate-400 dark:text-slate-500 mb-4"
        aria-hidden="true"
      />
      <p class="text-xl font-semibold text-slate-700 dark:text-slate-200">
        No hay datos para mostrar
      </p>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
        Agrega resúmenes o casos para ver las estadísticas.
      </p>
      <div class="flex flex-wrap justify-center gap-3 mt-6">
        <router-link to="/summaries" class="btn-primary">Agregar resumen</router-link>
        <router-link to="/cases" class="btn-secondary">Agregar caso</router-link>
      </div>
    </div>
  </div>
</template>
