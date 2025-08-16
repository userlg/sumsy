function sum(a: number, b: number): number {
  return a + b;
}

import { describe, expect, test } from 'vitest';

describe('sum', () => {
  test('suma dos números positivos', () => {
    expect(sum(2, 3)).toBe(5);
  });

  test('suma con número negativo', () => {
    expect(sum(-2, 5)).toBe(3);
  });

  test('suma con cero', () => {
    expect(sum(0, 0)).toBe(0);
  });
});
