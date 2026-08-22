import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import CommandPalette from '@/components/common/CommandPalette.vue';

describe('CommandPalette Modal Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders correctly when modelValue is true', () => {
    const wrapper = mount(CommandPalette, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.text()).toContain('Búsquedas Recientes');
    expect(wrapper.text()).toContain('Colecciones Populares');
  });

  it('filters live products when typing in input', async () => {
    const wrapper = mount(CommandPalette, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    const input = wrapper.find('input');
    await input.setValue('Bomber');

    expect(wrapper.text()).toContain('Technical Bomber Jacket');
  });
});
