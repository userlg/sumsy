/**
 * @file useNotify.test.ts
 * @namespace tests.shared.composables
 * @description Tests for the NotifyModal state composable
 */

import { describe, it, expect } from 'vitest';
import { useNotify } from '@/shared/composables/useNotify';

describe('useNotify', () => {
  it('starts closed', () => {
    expect(useNotify().show.value).toBe(false);
  });

  it('fills the message and opens', () => {
    const { notify, show, title, message, type } = useNotify();
    notify('Éxito', 'Datos guardados.', 'success');
    expect([show.value, title.value, message.value, type.value]).toEqual([
      true,
      'Éxito',
      'Datos guardados.',
      'success',
    ]);
  });

  it('defaults to info', () => {
    const { notify, type } = useNotify();
    notify('Aviso', 'Algo pasó.');
    expect(type.value).toBe('info');
  });
});
