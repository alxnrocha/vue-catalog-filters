import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import ActiveFilterChips from '@/components/catalog/ActiveFilterChips.vue';
import CatalogToolbar from '@/components/catalog/CatalogToolbar.vue';
import { useCatalogStore } from '@/stores/useCatalogStore';

describe('ActiveFilterChips and CatalogToolbar', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders ActiveFilterChips when filters are active', async () => {
    const store = useCatalogStore();
    store.setCategory('chaquetas');
    store.toggleColor('negro');

    const wrapper = mount(ActiveFilterChips);
    expect(wrapper.text()).toContain('Filtros activos:');
    expect(wrapper.text()).toContain('Chaquetas & Abrigos');
    expect(wrapper.text()).toContain('Negro');
  });

  it('renders CatalogToolbar with total results count and sorting options', () => {
    const store = useCatalogStore();
    const wrapper = mount(CatalogToolbar);

    expect(wrapper.text()).toContain(store.totalResultsCount.toString());
    expect(wrapper.text()).toContain('resultados encontrados');
    expect(wrapper.find('select').exists()).toBe(true);
  });
});
