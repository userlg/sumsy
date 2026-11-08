/**
 * @file date.utils.ts
 * @namespace src.shared.utils
 * @description Helpers for the DD-MM-YY dates stored on every item
 */

/**
 * Parses a stored DD-MM-YY date into a local Date (years are 20XX).
 * Returns null when the text does not follow that format.
 */
export function parseItemDate(ddmmyy: string): Date | null {
  const parts = ddmmyy.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [day, month, year] = parts;
  return new Date(2000 + year, month - 1, day);
}

/**
 * Builds a YYYY-MM-DD key in local time, used to bucket items by day.
 */
export function toDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
