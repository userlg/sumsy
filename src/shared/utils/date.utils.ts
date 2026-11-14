/**
 * @file date.utils.ts
 * @namespace src.shared.utils
 * @description Helpers for the DD-MM-YY dates stored on every item
 */

/**
 * Parses a stored DD-MM-YY date into a local Date (years are 20XX).
 * Returns null when the text does not follow that format or names a day that does not exist.
 */
export function parseItemDate(ddmmyy: string): Date | null {
  const parts = ddmmyy.split('-').map(Number);
  if (parts.length !== 3 || !parts.every(Number.isInteger)) return null;
  const [day, month, year] = parts;
  if (year < 0 || year > 99) return null;

  const date = new Date(2000 + year, month - 1, day);
  // Date rolls impossible days over (32-13-26 would become a day in 2027), so check it round-trips.
  const isRealDay = date.getDate() === day && date.getMonth() === month - 1;
  return isRealDay ? date : null;
}

/**
 * Builds a YYYY-MM-DD key in local time, used to bucket items by day.
 */
export function toDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Formats a Date as the stored DD-MM-YY text.
 */
export function formatItemDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}-${String(date.getFullYear()).slice(-2)}`;
}
