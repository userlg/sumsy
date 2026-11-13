/**
 * @file demo.logic.ts
 * @namespace src.logic
 * @description Random demo data for development: fills every month so the charts have something to show
 */

import { formatItemDate } from '@/shared/utils/date.utils';

export interface DemoEntry {
  name: string;
  date: string;
  /** Only set on the entries from buildDemoExtras. */
  extra?: boolean;
}

export type DemoKind = 'summaries' | 'cases';

/** Returns a number in [0, 1); injectable so tests can be deterministic. */
export type RandomSource = () => number;

const TOPICS = [
  'contrato de arrendamiento',
  'reclamo de garantía',
  'factura duplicada',
  'cambio de domicilio',
  'reembolso pendiente',
  'acceso bloqueado',
  'renovación de póliza',
  'pedido retrasado',
  'actualización de datos',
  'cobro no reconocido',
  'solicitud de soporte',
  'revisión de expediente',
  'baja del servicio',
  'error en el pago',
  'consulta de saldo',
  'entrega incompleta',
];

const CLIENTS = [
  'Ana Torres',
  'Carlos Ruiz',
  'María López',
  'José Pérez',
  'Lucía Gómez',
  'Andrés Silva',
  'Valentina Díaz',
  'Diego Romero',
  'Camila Herrera',
  'Javier Castro',
  'Sofía Morales',
  'Miguel Vargas',
];

function pick<T>(items: readonly T[], random: RandomSource): T {
  return items[Math.floor(random() * items.length)];
}

function between(min: number, max: number, random: RandomSource): number {
  return min + Math.floor(random() * (max - min + 1));
}

/** "Resumen: reembolso pendiente – Ana Torres" or "Caso #4821 – cobro no reconocido". */
export function randomName(kind: DemoKind, random: RandomSource = Math.random): string {
  const topic = pick(TOPICS, random);
  if (kind === 'cases') return `Caso #${between(1000, 9999, random)} – ${topic}`;
  const capitalized = topic.charAt(0).toUpperCase() + topic.slice(1);
  return `Resumen: ${capitalized} – ${pick(CLIENTS, random)}`;
}

/**
 * Between `min` and `max` entries for each of the last `months` months (the current one
 * included), on random days that never fall after `today`. Oldest first.
 */
export function buildDemoEntries(
  kind: DemoKind,
  { months = 12, min = 20, max = 50, today = new Date(), random = Math.random as RandomSource } = {}
): DemoEntry[] {
  const entries: DemoEntry[] = [];

  for (let back = months - 1; back >= 0; back--) {
    const first = new Date(today.getFullYear(), today.getMonth() - back, 1);
    const isCurrentMonth = back === 0;
    const lastDay = isCurrentMonth
      ? today.getDate()
      : new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();

    const days = Array.from({ length: between(min, max, random) }, () =>
      between(1, lastDay, random)
    );
    days.sort((a, b) => a - b);

    for (const day of days) {
      const date = new Date(first.getFullYear(), first.getMonth(), day);
      entries.push({ name: randomName(kind, random), date: formatItemDate(date) });
    }
  }

  return entries;
}

/**
 * Between `min` and `max` extra cases in total, on random days of the last `months` months
 * (never after `today`). Oldest first.
 */
export function buildDemoExtras({
  months = 12,
  min = 30,
  max = 50,
  today = new Date(),
  random = Math.random as RandomSource,
} = {}): DemoEntry[] {
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(today.getFullYear(), today.getMonth() - months + 1, 1);
  const spanDays = Math.round((end.getTime() - start.getTime()) / 86_400_000);

  const dates = Array.from({ length: between(min, max, random) }, () => {
    const date = new Date(start);
    date.setDate(start.getDate() + between(0, spanDays, random));
    return date;
  }).sort((a, b) => a.getTime() - b.getTime());

  return dates.map((date) => ({
    name: randomName('cases', random),
    date: formatItemDate(date),
    extra: true,
  }));
}
