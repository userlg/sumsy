/**
 * @file tooltip.constants.test.ts
 * @namespace tests.shared.constants
 * @description Tests for tooltip constants
 */

import { describe, it, expect } from 'vitest';
import { DEFAULT_TOOLTIP_DELAY } from '@/shared/constants/tooltip.constants';

describe('Tooltip Constants', () => {
  it('DEFAULT_TOOLTIP_DELAY is a positive number', () => {
    expect(DEFAULT_TOOLTIP_DELAY).toBe(7000);
    expect(typeof DEFAULT_TOOLTIP_DELAY).toBe('number');
    expect(DEFAULT_TOOLTIP_DELAY).toBeGreaterThan(0);
  });
});
