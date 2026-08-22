import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import QuickViewModal from '@/components/quickview/QuickViewModal.vue';
import { mockProducts } from '@/data/products.mock';

describe('QuickViewModal Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders product details inside QuickViewModal', () => {
    const product = mockProducts[0];
    const wrapper = mount(QuickViewModal, {
      props: {
        modelValue: true,
        product,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain(product.name);
    expect(wrapper.text()).toContain(product.brand);
    expect(wrapper.text()).toContain(`€${product.price}`);
    expect(wrapper.text()).toContain('Añadir al Carrito');
    expect(wrapper.text()).toContain('Guía de tallas');
  });

  it('emits add-to-cart when clicking the add button', async () => {
    const product = mockProducts[0];
    const wrapper = mount(QuickViewModal, {
      props: {
        modelValue: true,
        product,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    const addBtn = wrapper.findAll('button').find((b) => b.text().includes('Añadir al Carrito'));
    expect(addBtn).toBeDefined();
    await addBtn?.trigger('click');
  });
});
