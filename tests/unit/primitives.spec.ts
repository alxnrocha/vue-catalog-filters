import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseBadge from '@/components/common/BaseBadge.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import AppHeader from '@/components/common/AppHeader.vue';

describe('Design System Primitives', () => {
  it('renders BaseButton with correct variants and emits click', async () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'primary' },
      slots: { default: 'Añadir al Carrito' },
    });

    expect(wrapper.text()).toContain('Añadir al Carrito');
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('renders BaseBadge with sale variant', () => {
    const wrapper = mount(BaseBadge, {
      props: { variant: 'sale' },
      slots: { default: '-20%' },
    });

    expect(wrapper.text()).toContain('-20%');
  });

  it('renders BaseInput and handles v-model updates', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: 'Chaqueta',
        label: 'Buscar prenda',
      },
    });

    expect(wrapper.text()).toContain('Buscar prenda');
    const input = wrapper.find('input');
    expect(input.element.value).toBe('Chaqueta');

    await input.setValue('Pantalón');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Pantalón']);
  });

  it('renders AppHeader with brand logo and badges', () => {
    const wrapper = mount(AppHeader, {
      props: {
        cartCount: 3,
        wishlistCount: 2,
      },
    });

    expect(wrapper.text()).toContain('AURELIA');
    expect(wrapper.text()).toContain('3');
    expect(wrapper.text()).toContain('2');
  });
});
