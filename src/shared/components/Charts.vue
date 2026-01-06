<script setup lang="ts">
  /**
   * @file Charts.vue
   * @namespace src.shared.components
   * @description Reusable chart component with props for title y data, compatible con dark/light mode via store
   *
   * @example
   * <Charts title="Resúmenes" :items="summaryStore.list" />
   */

  import { ref, onMounted, watch, computed } from 'vue';
  import { Chart as ChartJS, ChartData, ChartOptions, registerables } from 'chart.js';
  import { useDarkModeStore } from '@/stores/darkModeStore';

  interface Item {
    date: string;
    count: number;
  }

  // Permite inyectar Chart para tests
  const props = defineProps<{
    title: string;
    items: Item[];
    chart?: typeof ChartJS;
  }>();

  const Chart = props.chart || ChartJS;
  Chart.register(...registerables);

  const darkModeStore = useDarkModeStore();

  const colors = computed(() => {
    if (darkModeStore.isDarkMode) {
      return {
        border: '#60A5FA', // azul claro
        background: 'rgba(96, 165, 250, 0.25)',
        point: '#93C5FD',
        axis: '#E5E7EB', // gris claro
        grid: 'rgba(255,255,255,0.08)',
        title: '#F9FAFB',
      };
    } else {
      return {
        border: '#1E3A8A', // azul profundo
        background: 'rgba(30, 58, 138, 0.15)',
        point: '#1E40AF',
        axis: '#1F2937', // gris oscuro
        grid: 'rgba(0,0,0,0.08)',
        title: '#111827',
      };
    }
  });

  const chartRef = ref<HTMLCanvasElement | null>(null);
  let chartInstance: ChartJS<'line'> | null = null;

  const renderChart = () => {
    if (!chartRef.value) return;

    const labels = props.items.map((i) => i.date);
    const dataValues = props.items.map((i) => i.count);

    const data: ChartData<'line'> = {
      labels,
      datasets: [
        {
          label: props.title,
          data: dataValues,
          borderColor: colors.value.border,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            if (darkModeStore.isDarkMode) {
              gradient.addColorStop(0, 'rgba(96, 165, 250, 0.5)'); // Blue-400
              gradient.addColorStop(1, 'rgba(96, 165, 250, 0.0)');
            } else {
              gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // Blue-500
              gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
            }
            return gradient;
          },
          pointBackgroundColor: colors.value.point,
          pointBorderColor: colors.value.border,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBorderWidth: 2,
          fill: true,
          tension: 0.4, // Smoother curve
          borderWidth: 3,
        },
      ],
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: colors.value.axis },
        },
      },
      scales: {
        x: {
          ticks: { color: colors.value.axis },
          grid: { color: colors.value.grid },
        },
        y: {
          beginAtZero: true,
          ticks: { color: colors.value.axis },
          grid: { color: colors.value.grid },
        },
      },
    };

    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(chartRef.value, {
      type: 'line',
      data,
      options,
    });
  };

  onMounted(renderChart);
  watch([() => props.items, () => darkModeStore.isDarkMode], renderChart, { deep: true });
</script>

<template>
  <div
    class="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full transform hover:scale-[1.01] transition-transform duration-300"
  >
    <h3
      class="text-xl font-bold text-gray-700 dark:text-gray-200 mb-6 pl-2 border-l-4 border-blue-500"
    >
      {{ title }}
    </h3>
    <div class="flex-1 min-h-[400px] relative w-full">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>
