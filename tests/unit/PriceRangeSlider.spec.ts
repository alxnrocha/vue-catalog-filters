import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PriceRangeSlider from '@/components/catalog/PriceRangeSlider.vue';

describe('PriceRangeSlider.vue Component', () => {
  it('renders minimum and maximum price labels', () => {
    const wrapper = mount(PriceRangeSlider, {
      props: {
        min: 50,
        max: 1000,
        minPrice: 150,
        maxPrice: 850,
        step: 10,
      },
    });

    expect(wrapper.text()).toContain('€150');
    expect(wrapper.text()).toContain('€850');
    expect(wrapper.text()).toContain('hasta');
  });

  it('emits update:minPrice when the minimum range input changes', async () => {
    const wrapper = mount(PriceRangeSlider, {
      props: {
        min: 50,
        max: 1000,
        minPrice: 150,
        maxPrice: 850,
        step: 10,
      },
    });

    const inputs = wrapper.findAll('input[type="range"]');
    expect(inputs.length).toBe(2);

    await inputs[0].setValue(200);
    expect(wrapper.emitted('update:minPrice')).toBeTruthy();
    expect(wrapper.emitted('update:minPrice')![0]).toEqual([200]);
  });

  it('emits update:maxPrice when the maximum range input changes', async () => {
    const wrapper = mount(PriceRangeSlider, {
      props: {
        min: 50,
        max: 1000,
        minPrice: 150,
        maxPrice: 850,
        step: 10,
      },
    });

    const inputs = wrapper.findAll('input[type="range"]');
    await inputs[1].setValue(700);
    expect(wrapper.emitted('update:maxPrice')).toBeTruthy();
    expect(wrapper.emitted('update:maxPrice')![0]).toEqual([700]);
  });
});
