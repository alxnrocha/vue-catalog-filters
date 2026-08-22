import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import FilterSidebar from '@/components/catalog/FilterSidebar.vue';
import PriceRangeSlider from '@/components/catalog/PriceRangeSlider.vue';

describe('FilterSidebar and PriceRangeSlider', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders FilterSidebar with all filter sections', () => {
    const wrapper = mount(FilterSidebar);

    expect(wrapper.text()).toContain('Filtros');
    expect(wrapper.text()).toContain('Categoría');
    expect(wrapper.text()).toContain('Rango de Precio');
    expect(wrapper.text()).toContain('Color');
    expect(wrapper.text()).toContain('Talla');
    expect(wrapper.text()).toContain('Rating Mínimo');
    expect(wrapper.text()).toContain('Marca');
  });

  it('renders PriceRangeSlider and displays min and max prices', () => {
    const wrapper = mount(PriceRangeSlider, {
      props: {
        minPrice: 100,
        maxPrice: 650,
      },
    });

    expect(wrapper.text()).toContain('€100');
    expect(wrapper.text()).toContain('€650');
  });
});
