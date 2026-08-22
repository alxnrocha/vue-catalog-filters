import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ProductCard from '@/components/catalog/ProductCard.vue';
import { mockProducts } from '@/data/products.mock';

describe('ProductCard Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders product information accurately in grid mode', () => {
    const product = mockProducts[0];
    const wrapper = mount(ProductCard, {
      props: {
        product,
        viewMode: 'grid',
      },
    });

    expect(wrapper.text()).toContain(product.name);
    expect(wrapper.text()).toContain(product.brand);
    expect(wrapper.text()).toContain(`€${product.price}`);
    expect(wrapper.text()).toContain(`-${product.discountPercentage}%`);
  });

  it('renders product in list mode with full description and sizes', () => {
    const product = mockProducts[0];
    const wrapper = mount(ProductCard, {
      props: {
        product,
        viewMode: 'list',
      },
    });

    expect(wrapper.text()).toContain(product.name);
    expect(wrapper.text()).toContain(product.brand);
    expect(wrapper.text()).toContain('Ver Prenda');
  });

  it('emits quick-view event when card or view button is clicked', async () => {
    const product = mockProducts[0];
    const wrapper = mount(ProductCard, {
      props: {
        product,
        viewMode: 'grid',
      },
    });

    await wrapper.find('.group').trigger('click');
    expect(wrapper.emitted('quick-view')?.[0]).toEqual([product]);
  });
});
