import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import MobileFilterDrawer from '@/components/catalog/MobileFilterDrawer.vue';
import { useCatalogStore } from '@/stores/useCatalogStore';

describe('MobileFilterDrawer Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders mobile filter drawer with filter controls and action button', () => {
    const store = useCatalogStore();
    const wrapper = mount(MobileFilterDrawer, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Filtrar Catálogo');
    expect(wrapper.text()).toContain(`Ver ${store.totalResultsCount} prendas`);
  });
});
