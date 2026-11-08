<script setup lang="ts">
  /**
   * @file ShareDonut.vue
   * @namespace src.shared.components
   * @description Doughnut chart of how all-time items split between summaries and cases
   *
   * @component
   * @example
   * <ShareDonut :summaries="120" :cases="40" />
   */

  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

  const props = defineProps<{
    summaries: number;
    cases: number;
  }>();

  const RADIUS = 52;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  /** Gap between the two arcs, in the same units as the circumference. */
  const GAP = 6;

  const total = computed(() => props.summaries + props.cases);

  const percentFormat = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });

  function share(count: number): number {
    return total.value === 0 ? 0 : (count / total.value) * 100;
  }

  const segments = computed(() => {
    const items = [
      { id: 'summaries', label: 'Resúmenes', count: props.summaries, tone: 'text-blue-500' },
      { id: 'cases', label: 'Casos', count: props.cases, tone: 'text-indigo-500' },
    ];
    const visible = items.filter((item) => item.count > 0);
    // A lone segment closes the ring, so it needs no gap.
    const gap = visible.length > 1 ? GAP : 0;

    let offset = 0;
    return items.map((item) => {
      const length = (item.count / (total.value || 1)) * CIRCUMFERENCE;
      const drawn = Math.max(0, length - gap);
      const segment = {
        ...item,
        percent: share(item.count),
        dash: `${drawn} ${CIRCUMFERENCE - drawn}`,
        offset: -offset,
      };
      offset += length;
      return segment;
    });
  });

  const lead = computed(() =>
    segments.value.reduce((best, item) => (item.count > best.count ? item : best))
  );

  const description = computed(() =>
    segments.value
      .map((item) => `${item.label}: ${item.count} (${percentFormat.format(item.percent)} %)`)
      .join(', ')
  );

  // The arcs sweep in once, the first time the chart is on screen.
  const rootRef = ref<HTMLElement | null>(null);
  const drawn = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined' || !rootRef.value) {
      drawn.value = true;
      return;
    }
    observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      drawn.value = true;
      observer?.disconnect();
    });
    observer.observe(rootRef.value);
  });
  onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <section
    ref="rootRef"
    class="w-full bg-white dark:bg-slate-800/80 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 p-6"
    aria-labelledby="share-title"
  >
    <h3 id="share-title" class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-5">
      Distribución histórica
    </h3>

    <div class="flex flex-col sm:flex-row items-center gap-8">
      <figure class="relative size-44 shrink-0" role="img" :aria-label="description">
        <svg viewBox="0 0 120 120" class="size-full -rotate-90" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            :r="RADIUS"
            fill="none"
            stroke-width="14"
            class="stroke-slate-100 dark:stroke-slate-700/60"
          />
          <circle
            v-for="segment in segments"
            :key="segment.id"
            cx="60"
            cy="60"
            :r="RADIUS"
            fill="none"
            stroke="currentColor"
            stroke-width="14"
            stroke-linecap="butt"
            :class="['donut-arc', segment.tone, { 'is-drawn': drawn }]"
            :style="{
              '--dash': segment.dash,
              '--circumference': CIRCUMFERENCE,
              strokeDashoffset: segment.offset,
            }"
          />
        </svg>

        <figcaption class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-3xl font-bold tabular-nums text-slate-800 dark:text-slate-100">
            {{ percentFormat.format(lead.percent) }}
            <span class="text-lg">%</span>
          </span>
          <span class="text-xs text-slate-500 dark:text-slate-400">{{ lead.label }}</span>
        </figcaption>
      </figure>

      <dl class="w-full grid gap-3">
        <div
          v-for="segment in segments"
          :key="segment.id"
          class="flex items-center gap-3 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900/40"
        >
          <span :class="['size-3 rounded-full bg-current', segment.tone]" aria-hidden="true" />
          <dt class="flex-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            {{ segment.label }}
          </dt>
          <dd class="text-sm tabular-nums text-slate-500 dark:text-slate-400">
            <span class="font-semibold text-slate-800 dark:text-slate-100">
              {{ segment.count }}
            </span>
            · {{ percentFormat.format(segment.percent) }} %
          </dd>
        </div>
        <div class="flex justify-between px-4 text-sm text-slate-500 dark:text-slate-400">
          <span>Total de todos los tiempos</span>
          <span class="font-semibold tabular-nums text-slate-700 dark:text-slate-200">
            {{ total }}
          </span>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
  /* Arcs start empty and sweep to their length; later changes (new items) glide. */
  .donut-arc {
    stroke-dasharray: 0 var(--circumference);
    transition:
      stroke-dasharray 900ms var(--ease-out),
      stroke-dashoffset 900ms var(--ease-out);
  }

  .donut-arc.is-drawn {
    stroke-dasharray: var(--dash);
  }

  @media (prefers-reduced-motion: reduce) {
    .donut-arc {
      transition: none;
    }
  }
</style>
