import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import CartDrawer from '@/components/cart/CartDrawer.vue';

describe('CartDrawer Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders cart items and subtotal when open', () => {
    const wrapper = mount(CartDrawer, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Bolsa de Compras');
    expect(wrapper.text()).toContain('Subtotal');
    expect(wrapper.text()).toContain('Tramitar Pedido');
  });
});
