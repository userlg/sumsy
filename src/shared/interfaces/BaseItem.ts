/**
 * @file BaseItem.ts
 * @namespace src.shared.interfaces
 * @description Interface for base items in the application
 */

export interface BaseItem {
  id: number;
  name: string;
  date: string;
  element: number;
  /** Cases only: true for an extra case. Missing means a normal case (older data has no flag). */
  extra?: boolean;
}
