<script setup lang="ts">
  /**
   * @file Charts.vue
   * @namespace src.shared.components
   * @description Reusable chart component with props for title and data, compatible with dark/light mode via store
   *
   * @example
   * <Charts title="Resúmenes" :items="summaryStore.list" />
   */

  import { ref, onMounted, watch, computed } from 'vue';
  import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
  import { useDarkModeStore } from '@/stores/darkModeStore';

  // Registrar Chart.js
  Chart.register(...registerables);

  interface Item {
    date: string;
    element: number;
  }

  const props = defineProps<{
    title: string;
    items: Item[];
  }>();

  // Store de dark mode
  const darkModeStore = useDarkModeStore();

  // 🎨 Paleta de colores dependiente del tema
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
  let chartInstance: Chart<'line'> | null = null;

  // Función para inicializar / actualizar el gráfico
  const renderChart = () => {
    if (!chartRef.value) return;

    const labels = props.items.map((item) => item.date);
    const dataValues = props.items.map((item) => item.element);

    const data: ChartData<'line'> = {
      labels,
      datasets: [
        {
          label: props.title,
          data: dataValues,
          borderColor: colors.value.border,
          backgroundColor: colors.value.background,
          pointBackgroundColor: colors.value.point,
          pointBorderColor: colors.value.border,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.35,
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

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(chartRef.value, {
      type: 'line',
      data,
      options,
    });
  };

  // Renderizar al montar
  onMounted(() => {
    renderChart();
  });

  // Re-render si cambian items o el modo dark
  watch(
    [() => props.items, () => darkModeStore.isDarkMode],
    () => {
      renderChart();
    },
    { deep: true }
  );
</script>

<template>
  <div class="w-full max-w-4xl mx-auto my-6 p-6 bg-gray-300 dark:bg-gray-800 rounded-2xl shadow-lg">
    <div class="h-80">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>
