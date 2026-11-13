/**
 * @file case.utils.ts
 * @namespace src.shared.utils
 * @description Helpers for telling normal cases from extra cases
 */

import type { BaseItem } from '@/shared/interfaces/BaseItem';

/** Older cases have no flag, so only an explicit `true` makes a case extra. */
export function isExtraCase(item: BaseItem): boolean {
  return item.extra === true;
}

/** Splits a cases list into normal and extra cases, keeping their order. */
export function splitCases(items: BaseItem[]): { normal: BaseItem[]; extra: BaseItem[] } {
  return {
    normal: items.filter((item) => !isExtraCase(item)),
    extra: items.filter(isExtraCase),
  };
}
