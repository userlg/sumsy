import { describe, it, expect } from 'vitest';
import { mountFactory } from '@test/index';

describe('App.vue', () => {
  it('should render NavBar and Footer components', async () => {
    const wrapper = await mountFactory({ initialRoute: '/' });

    expect(wrapper.text()).toContain('Sumsy');

    expect(wrapper.text()).toContain(
      'Sumsy Inicio Resumen CasosModo claro activadoIntroduce tu nombre Cancelar  Guardar  Sumsy  © 2025 Sumsy — Todos los derechos reservados'
    );
  });
});
