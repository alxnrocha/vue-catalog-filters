import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import CheckoutDrawer from '@/components/checkout/CheckoutDrawer.vue';

describe('CheckoutDrawer Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders step 1 with address fields when open', () => {
    const wrapper = mount(CheckoutDrawer, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Datos de Entrega');
    expect(wrapper.text()).toContain('Nombre Completo');
    expect(wrapper.text()).toContain('Continuar al Pago');
  });

  it('navigates to step 2 when clicking continue', async () => {
    const wrapper = mount(CheckoutDrawer, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    const nextBtn = wrapper.findAll('button').find((b) => b.text().includes('Continuar al Pago'));
    await nextBtn?.trigger('click');

    expect(wrapper.text()).toContain('Método de Pago Seguro');
    expect(wrapper.text()).toContain('Tarjeta de Crédito');
  });
});
