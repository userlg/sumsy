<script setup lang="ts">
  /**
   * @file ActivityHeatmap.vue
   * @namespace src.shared.components
   * @description GitHub-style activity calendar: one cell per day, darker the more items were added
   *
   * @component
   * @example
   * <ActivityHeatmap :summary-dates="['03-11-26']" :case-dates="[]" :extra-dates="[]" />
   */

  import { computed, nextTick, onMounted, ref } from 'vue';
  import {
    buildActivityCalendar,
    countByDay,
    LEVEL_RANGES,
    type ActivityDay,
  } from '@/logic/activity.logic';
  import SegmentedControl from '@/shared/components/SegmentedControl.vue';

  type Source = 'all' | 'summaries' | 'cases' | 'extras';

  const props = withDefaults(
    defineProps<{
      summaryDates: string[];
      /** Normal cases only. */
      caseDates: string[];
      extraDates?: string[];
      today?: Date;
    }>(),
    { extraDates: () => [], today: undefined }
  );

  const sources: { id: Source; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'summaries', label: 'Resúmenes' },
    { id: 'cases', label: 'Casos' },
    { id: 'extras', label: 'Extras' },
  ];
  const source = ref<Source>('all');

  const datesBySource = computed<Record<Source, string[]>>(() => ({
    summaries: props.summaryDates,
    cases: props.caseDates,
    extras: props.extraDates,
    all: [...props.summaryDates, ...props.caseDates, ...props.extraDates],
  }));

  const calendar = computed(() =>
    buildActivityCalendar(datesBySource.value[source.value], props.today)
  );

  const dayFormat = new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const monthFormat = new Intl.DateTimeFormat('es-ES', { month: 'short' });

  const weekdayLabels = ['Lun', '', 'Mié', '', 'Vie', '', ''];

  /** A month label sits over the first week that contains the 1st of that month. */
  const monthLabels = computed(() => {
    const labels: { column: number; text: string }[] = [];
    calendar.value.weeks.forEach((week, column) => {
      const first = week.find((day) => day.date.getDate() === 1);
      const isFirstColumn = column === 0 && week[0].date.getDate() <= 7;
      if (!first && !isFirstColumn) return;
      const previous = labels[labels.length - 1];
      if (previous && column - previous.column < 3) return;
      labels.push({ column, text: monthFormat.format((first ?? week[0]).date).replace('.', '') });
    });
    return labels;
  });

  function pluralize(count: number, singular: string, plural: string): string {
    return `${count} ${count === 1 ? singular : plural}`;
  }

  const breakdown = computed(() => [
    { counts: countByDay(props.summaryDates), one: 'resumen', many: 'resúmenes' },
    { counts: countByDay(props.caseDates), one: 'caso', many: 'casos' },
    { counts: countByDay(props.extraDates), one: 'extra', many: 'extras' },
  ]);

  /** "3 registros (2 resúmenes, 1 extra) · mié, 12 nov 2026" */
  function describe(day: ActivityDay): string {
    const when = dayFormat.format(day.date).replace(/\./g, '');
    if (day.count === 0) return `Sin registros · ${when}`;

    let what = pluralize(day.count, 'registro', 'registros');
    if (source.value === 'all') {
      const parts = breakdown.value
        .map(({ counts, one, many }) => ({ count: counts.get(day.key) ?? 0, one, many }))
        .filter((part) => part.count > 0)
        .map((part) => pluralize(part.count, part.one, part.many));
      if (parts.length > 1) what += ` (${parts.join(', ')})`;
    }
    return `${what} · ${when}`;
  }

  // Tooltip + keyboard focus share one "active" day.
  const cardRef = ref<HTMLElement | null>(null);
  const scrollRef = ref<HTMLElement | null>(null);
  const activeKey = ref<string | null>(null);
  const focusKey = ref<string | null>(null);
  const tooltip = ref<{ text: string; x: number; y: number } | null>(null);

  const days = computed(() => calendar.value.weeks.flat());
  const rovingKey = computed(() => {
    const visible = days.value.filter((day) => !day.isFuture);
    return focusKey.value ?? visible[visible.length - 1]?.key ?? null;
  });

  function show(day: ActivityDay, target: HTMLElement) {
    if (!cardRef.value) return;
    const card = cardRef.value.getBoundingClientRect();
    const cell = target.getBoundingClientRect();
    activeKey.value = day.key;
    tooltip.value = {
      text: describe(day),
      x: cell.left - card.left + cell.width / 2,
      y: cell.top - card.top,
    };
  }

  function hide() {
    activeKey.value = null;
    tooltip.value = null;
  }

  /** Arrow keys walk the calendar: up/down move a day, left/right move a week. */
  async function onKeydown(event: KeyboardEvent, index: number) {
    const steps: Record<string, number> = {
      ArrowUp: -1,
      ArrowDown: 1,
      ArrowLeft: -7,
      ArrowRight: 7,
    };
    const step = steps[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const next = days.value[index + step];
    if (!next || next.isFuture) return;
    focusKey.value = next.key;
    await nextTick();
    cardRef.value?.querySelector<HTMLElement>(`[data-key="${next.key}"]`)?.focus();
  }

  // Like GitHub, open on the most recent weeks when the calendar is wider than the card.
  onMounted(() => {
    if (scrollRef.value) scrollRef.value.scrollLeft = scrollRef.value.scrollWidth;
  });
</script>

<template>
  <section
    ref="cardRef"
    class="relative w-full bg-white dark:bg-slate-800/80 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 p-6 sm:p-8"
    aria-labelledby="activity-title"
  >
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h3 id="activity-title" class="text-xl font-bold text-slate-800 dark:text-slate-100">
          Actividad
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
          {{ pluralize(calendar.total, 'registro', 'registros') }} en el último año
        </p>
      </div>

      <SegmentedControl
        v-model="source"
        :options="sources"
        label="Filtrar actividad"
        class="self-start sm:self-auto"
      />
    </header>

    <div ref="scrollRef" class="activity-scroll overflow-x-auto pb-2 -mx-1 px-1">
      <div class="activity-layout">
        <!-- Months -->
        <div class="activity-months" aria-hidden="true">
          <span
            v-for="label in monthLabels"
            :key="label.column"
            class="activity-month"
            :style="{ gridColumnStart: label.column + 1 }"
          >
            {{ label.text }}
          </span>
        </div>

        <!-- Weekdays -->
        <div class="activity-weekdays" aria-hidden="true">
          <span v-for="(label, i) in weekdayLabels" :key="i">{{ label }}</span>
        </div>

        <!-- Days -->
        <div
          class="activity-grid"
          role="group"
          :aria-label="`Calendario de actividad: ${pluralize(calendar.activeDays, 'día activo', 'días activos')}. Usa las flechas para recorrer los días.`"
          @mouseleave="hide"
        >
          <template v-for="(day, index) in days" :key="day.key">
            <span v-if="day.isFuture" class="activity-cell is-future" aria-hidden="true" />
            <button
              v-else
              type="button"
              :data-key="day.key"
              :data-level="day.level"
              :tabindex="day.key === rovingKey ? 0 : -1"
              :aria-label="describe(day)"
              :class="['activity-cell', { 'is-active': activeKey === day.key }]"
              :style="{ '--week': Math.floor(index / 7) }"
              @mouseenter="show(day, $event.currentTarget as HTMLElement)"
              @focus="show(day, $event.currentTarget as HTMLElement)"
              @blur="hide"
              @keydown="onKeydown($event, index)"
            />
          </template>
        </div>
      </div>
    </div>

    <footer
      class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-7 text-sm text-slate-500 dark:text-slate-400"
    >
      <dl class="flex flex-wrap gap-x-6 gap-y-1 tabular-nums">
        <div class="flex gap-1.5">
          <dt>Racha actual</dt>
          <dd class="font-semibold text-slate-700 dark:text-slate-200">
            {{ pluralize(calendar.currentStreak, 'día', 'días') }}
          </dd>
        </div>
        <div class="flex gap-1.5">
          <dt>Racha máxima</dt>
          <dd class="font-semibold text-slate-700 dark:text-slate-200">
            {{ pluralize(calendar.longestStreak, 'día', 'días') }}
          </dd>
        </div>
      </dl>

      <div class="flex items-center gap-1.5 text-xs">
        <span class="mr-1">Menos</span>
        <span
          v-for="(range, level) in LEVEL_RANGES"
          :key="level"
          class="activity-cell"
          :data-level="level"
          :title="`${range} por día`"
          role="img"
          :aria-label="`${range} registros por día`"
        />
        <span class="ml-1">Más</span>
      </div>
    </footer>

    <!-- Tooltip -->
    <Transition name="tip">
      <div
        v-if="tooltip"
        class="activity-tooltip"
        role="status"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
      >
        {{ tooltip.text }}
      </div>
    </Transition>
  </section>
</template>

<style scoped>
  .activity-layout {
    --cell: 12px;
    --gap: 4px;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    column-gap: 10px;
    row-gap: 8px;
    width: max-content;
    margin-inline: auto;
  }

  .activity-months {
    grid-column: 2;
    display: grid;
    grid-template-columns: repeat(53, var(--cell));
    column-gap: var(--gap);
    font-size: 11px;
    line-height: 1;
    color: var(--color-slate-500);
  }

  .activity-month {
    white-space: nowrap;
    text-transform: capitalize;
  }

  .activity-weekdays {
    grid-row: 2;
    display: grid;
    grid-template-rows: repeat(7, var(--cell));
    row-gap: var(--gap);
    font-size: 10px;
    line-height: var(--cell);
    color: var(--color-slate-500);
  }

  .activity-grid {
    grid-row: 2;
    grid-column: 2;
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(7, var(--cell));
    grid-auto-columns: var(--cell);
    gap: var(--gap);
  }

  .activity-cell {
    display: block;
    width: var(--cell, 12px);
    height: var(--cell, 12px);
    border-radius: 3px;
    background-color: var(--activity-0);
    outline: 1px solid var(--activity-edge);
    outline-offset: -1px;
    transition:
      background-color 240ms var(--ease-out),
      transform 160ms var(--ease-out);
  }

  .activity-cell[data-level='1'] {
    background-color: var(--activity-1);
  }
  .activity-cell[data-level='2'] {
    background-color: var(--activity-2);
  }
  .activity-cell[data-level='3'] {
    background-color: var(--activity-3);
  }
  .activity-cell[data-level='4'] {
    background-color: var(--activity-4);
  }

  .activity-cell.is-future {
    background-color: transparent;
    outline-color: transparent;
  }

  button.activity-cell {
    cursor: default;
    animation: cell-in 320ms var(--ease-out) both;
    animation-delay: calc(var(--week) * 4ms);
  }

  button.activity-cell.is-active {
    transform: scale(1.25);
  }

  button.activity-cell:focus-visible {
    outline: 2px solid var(--color-blue-500);
    outline-offset: 1px;
  }

  .activity-tooltip {
    position: absolute;
    z-index: 10;
    transform: translate(-50%, calc(-100% - 8px));
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    color: var(--color-white);
    background-color: var(--color-slate-900);
    box-shadow: 0 6px 16px -4px rgb(15 23 42 / 0.35);
  }

  :global(.dark) .activity-tooltip {
    color: var(--color-slate-900);
    background-color: var(--color-slate-100);
  }

  .tip-enter-active {
    transition: opacity 140ms var(--ease-out);
  }
  .tip-enter-from {
    opacity: 0;
  }

  @keyframes cell-in {
    from {
      opacity: 0;
      transform: scale(0.6);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    button.activity-cell {
      animation: none;
    }
    .activity-cell {
      transition: none;
    }
  }
</style>
