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
        border: '#3B82F6', // blue-500
        background: 'rgba(59, 130, 246, 0.15)',
        point: '#60A5FA', // blue-400
        axis: '#94A3B8', // slate-400
        grid: 'rgba(255,255,255,0.05)',
        title: '#F8FAFC', // slate-50
      };
    } else {
      return {
        border: '#2563EB', // blue-600
        background: 'rgba(37, 99, 235, 0.1)',
        point: '#3B82F6', // blue-500
        axis: '#64748B', // slate-500
        grid: 'rgba(0,0,0,0.04)',
        title: '#0F172A', // slate-900
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
          pointRadius: dataValues.length > 20 ? 0 : 3, // Hide points if there are too many for a cleaner look
          pointHoverRadius: 6,
          pointBorderWidth: 1,
          fill: true,
          tension: 0.4, // Smoother curve
          borderWidth: 2,
        },
      ],
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false, // Hide legend since we have the title above
        },
        tooltip: {
          backgroundColor: darkModeStore.isDarkMode ? '#1F2937' : '#FFFFFF',
          titleColor: darkModeStore.isDarkMode ? '#F3F4F6' : '#111827',
          bodyColor: darkModeStore.isDarkMode ? '#9CA3AF' : '#4B5563',
          borderColor: darkModeStore.isDarkMode ? '#374151' : '#E5E7EB',
          borderWidth: 1,
          padding: 12,
          displayColors: false, // hide color box
          callbacks: {
            title: (context) => `Fecha: ${context[0].label}`,
            label: (context) => `${props.title}: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: colors.value.axis,
            maxTicksLimit: 8, // Avoid overlapping dates
            maxRotation: 45,
            minRotation: 45,
            font: { size: 11 },
          },
          grid: {
            display: false, // Cleaner background
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: colors.value.axis,
            stepSize: 1, // Cases/summaries are integers
            font: { size: 11 },
          },
          border: {
            display: false, // Remove vertical axis line
          },
          grid: {
            color: colors.value.grid,
          },
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
    class="w-full bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
  >
    <h3
      class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 pl-3 border-l-4 border-blue-500"
    >
      {{ title }}
    </h3>
    <div class="flex-1 min-h-[400px] relative w-full">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>
