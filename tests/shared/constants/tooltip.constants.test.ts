/**
 * @file tooltip.constants.test.ts
 * @namespace tests.shared.constants
 * @description Tests for the Tooltip constants
 */

import { describe, it, expect } from 'vitest';
import { DEFAULT_TOOLTIP_DELAY } from '@/shared/constants/tooltip.constants';

describe('Tooltip Constants', () => {
  it('opens fast enough to feel responsive', () => {
    expect(DEFAULT_TOOLTIP_DELAY).toBeGreaterThan(0);
    expect(DEFAULT_TOOLTIP_DELAY).toBeLessThanOrEqual(1000);
  });
});
