<script setup lang="ts">
  /**
   * @file Charts.vue
   * @namespace src.shared.components
   * @description Reusable bar chart for a daily/weekly count series, themed for dark/light mode.
   * Bars rather than a line: each value is a discrete count, and empty days stay visibly empty.
   *
   * @example
   * <Charts title="Resúmenes" :items="buildSeries(dates, '30d')" tone="blue" />
   * <Charts title="Casos" :items="normal" items-label="Normales" tone="indigo"
   *   :stacked="{ label: 'Extras', tone: 'pink', items: extras }" />
   */

  import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
  import { Chart as ChartJS, ChartData, ChartOptions, registerables } from 'chart.js';
  import { useDarkModeStore } from '@/stores/darkModeStore';

  interface Item {
    date: string;
    count: number;
    /** Full label for the tooltip; falls back to `date`. */
    title?: string;
  }

  type Tone = 'blue' | 'indigo' | 'pink';

  /** A second series drawn on top of `items` in the same bars (e.g. extra cases). */
  interface StackedSeries {
    label: string;
    tone: Tone;
    items: Item[];
  }

  // Permite inyectar Chart para tests
  const props = defineProps<{
    title: string;
    items: Item[];
    tone?: Tone;
    /** When set, this series is stacked on top of `items`, which are named `itemsLabel`. */
    stacked?: StackedSeries;
    itemsLabel?: string;
    chart?: typeof ChartJS;
  }>();

  const Chart = props.chart || ChartJS;
  Chart.register(...registerables);

  const darkModeStore = useDarkModeStore();

  // Tailwind blue/indigo 400–600 and slate, matching the rest of the app.
  const palette: Record<Tone, { light: string; dark: string; rgbLight: string; rgbDark: string }> =
    {
      blue: { light: '#2563EB', dark: '#60A5FA', rgbLight: '37, 99, 235', rgbDark: '96, 165, 250' },
      indigo: {
        light: '#4F46E5',
        dark: '#818CF8',
        rgbLight: '79, 70, 229',
        rgbDark: '129, 140, 248',
      },
      pink: {
        light: '#DB2777',
        dark: '#F472B6',
        rgbLight: '219, 39, 119',
        rgbDark: '244, 114, 182',
      },
    };

  const dotClass: Record<Tone, string> = {
    blue: 'bg-blue-500 dark:bg-blue-400',
    indigo: 'bg-indigo-500 dark:bg-indigo-400',
    pink: 'bg-pink-500 dark:bg-pink-400',
  };

  function toneColors(tone: Tone) {
    const dark = darkModeStore.isDarkMode;
    return {
      bar: dark ? palette[tone].dark : palette[tone].light,
      rgb: dark ? palette[tone].rgbDark : palette[tone].rgbLight,
    };
  }

  const colors = computed(() => {
    const dark = darkModeStore.isDarkMode;
    return {
      axis: dark ? '#94A3B8' : '#64748B',
      grid: dark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(15, 23, 42, 0.05)',
      tooltipBg: dark ? '#F1F5F9' : '#0F172A',
      tooltipText: dark ? '#0F172A' : '#F8FAFC',
    };
  });

  const sum = (items: Item[]) => items.reduce((acc, item) => acc + item.count, 0);
  const mainLabel = computed(() =>
    props.stacked ? (props.itemsLabel ?? props.title) : props.title
  );
  const stackedTotal = computed(() => (props.stacked ? sum(props.stacked.items) : 0));
  const total = computed(() => sum(props.items) + stackedTotal.value);

  /** Count per bar, both series together. */
  const barTotals = computed(() =>
    props.items.map((item, index) => item.count + (props.stacked?.items[index]?.count ?? 0))
  );
  const peak = computed(() => {
    let best: { item: Item; count: number } | null = null;
    props.items.forEach((item, index) => {
      const count = barTotals.value[index];
      if (!best || count > best.count) best = { item, count };
    });
    return best as { item: Item; count: number } | null;
  });

  /** Text alternative for screen readers, since the canvas itself is opaque to them. */
  const summary = computed(() => {
    if (total.value === 0) return `${props.title}: sin registros en el período.`;
    const top = peak.value!;
    const split = props.stacked
      ? ` (${total.value - stackedTotal.value} ${mainLabel.value.toLowerCase()}, ${stackedTotal.value} ${props.stacked.label.toLowerCase()})`
      : '';
    return `${props.title}: ${total.value} en el período${split}. Máximo de ${top.count} el ${top.item.title ?? top.item.date}.`;
  });

  const chartRef = ref<HTMLCanvasElement | null>(null);
  let chartInstance: ChartJS<'bar'> | null = null;

  function dataset(label: string, items: Item[], tone: Tone, isBottom: boolean) {
    const c = toneColors(tone);
    const stackedItems = props.stacked?.items;
    return {
      label,
      data: items.map((i) => i.count),
      // Gradient follows the real plot height instead of a fixed 400px.
      backgroundColor: (context: { chart: ChartJS }) => {
        const { ctx, chartArea } = context.chart;
        if (!chartArea) return c.bar;
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, c.bar);
        gradient.addColorStop(1, `rgba(${c.rgb}, 0.45)`);
        return gradient;
      },
      hoverBackgroundColor: c.bar,
      // Only the top of each bar is rounded: the bottom series stays square where the
      // stacked one sits on it.
      borderRadius: (context: { dataIndex: number }) =>
        isBottom && (stackedItems?.[context.dataIndex]?.count ?? 0) > 0 ? 0 : 6,
      borderSkipped: 'start' as const,
      maxBarThickness: 22,
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      minBarLength: 0,
    };
  }

  function buildData(): ChartData<'bar'> {
    const datasets = [dataset(mainLabel.value, props.items, props.tone ?? 'blue', true)];
    if (props.stacked) {
      const { label, items, tone } = props.stacked;
      datasets.push(dataset(label, items, tone, false));
    }
    return { labels: props.items.map((i) => i.date), datasets };
  }

  function buildOptions(): ChartOptions<'bar'> {
    const c = colors.value;
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500, easing: 'easeOutQuart' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: c.tooltipBg,
          titleColor: c.tooltipText,
          bodyColor: c.tooltipText,
          borderWidth: 0,
          padding: 10,
          cornerRadius: 8,
          displayColors: !!props.stacked,
          boxPadding: 4,
          titleFont: { weight: 600 },
          callbacks: {
            title: (context) => props.items[context[0].dataIndex]?.title ?? context[0].label,
            label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
            footer: (context) =>
              props.stacked ? `Total: ${barTotals.value[context[0].dataIndex]}` : '',
          },
        },
      },
      scales: {
        x: {
          stacked: !!props.stacked,
          ticks: {
            color: c.axis,
            maxTicksLimit: 7,
            maxRotation: 0,
            autoSkip: true,
            font: { size: 11 },
          },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          stacked: !!props.stacked,
          beginAtZero: true,
          suggestedMax: 4,
          ticks: { color: c.axis, precision: 0, font: { size: 11 } },
          border: { display: false },
          grid: { color: c.grid },
        },
      },
    };
  }

  function renderChart() {
    if (!chartRef.value) return;
    chartInstance = new Chart(chartRef.value, {
      type: 'bar',
      data: buildData(),
      options: buildOptions(),
    });
  }

  /** New data animates from the current shape; a theme switch repaints instantly. */
  function updateChart(mode?: 'none') {
    if (!chartInstance) return renderChart();
    chartInstance.data = buildData();
    chartInstance.options = buildOptions();
    chartInstance.update(mode);
  }

  onMounted(renderChart);
  onBeforeUnmount(() => chartInstance?.destroy());
  watch(
    () => props.items,
    () => updateChart(),
    { deep: true }
  );
  watch(
    () => darkModeStore.isDarkMode,
    () => updateChart('none')
  );
</script>

<template>
  <section
    class="w-full bg-white dark:bg-slate-800/80 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full"
  >
    <header class="flex items-baseline justify-between gap-3 mb-5">
      <h3 class="flex items-center gap-2.5 text-xl font-bold text-slate-800 dark:text-slate-100">
        <span :class="['size-2.5 rounded-full', dotClass[tone ?? 'blue']]" aria-hidden="true" />
        {{ title }}
      </h3>
      <p class="text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-200">
        {{ total }}
      </p>
    </header>
    <ul
      v-if="stacked"
      class="-mt-3 mb-4 flex gap-4 text-xs tabular-nums text-slate-500 dark:text-slate-400"
    >
      <li class="flex items-center gap-1.5">
        <span :class="['size-2 rounded-full', dotClass[tone ?? 'blue']]" aria-hidden="true" />
        {{ mainLabel }} {{ total - stackedTotal }}
      </li>
      <li class="flex items-center gap-1.5">
        <span :class="['size-2 rounded-full', dotClass[stacked.tone]]" aria-hidden="true" />
        {{ stacked.label }} {{ stackedTotal }}
      </li>
    </ul>
    <div class="flex-1 min-h-[300px] relative w-full">
      <canvas ref="chartRef" role="img" :aria-label="summary"></canvas>
    </div>
  </section>
</template>
