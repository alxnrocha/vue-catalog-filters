import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCatalogStore } from '@/stores/useCatalogStore';

describe('useCatalogStore Pinia Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with all products and default filters', () => {
    const store = useCatalogStore();
    expect(store.products.length).toBeGreaterThanOrEqual(24);
    expect(store.totalResultsCount).toBe(store.products.length);
    expect(store.activeFiltersCount).toBe(0);
    expect(store.filters.page).toBe(1);
    expect(store.filters.category).toBe('all');
  });

  it('filters by category accurately', () => {
    const store = useCatalogStore();
    store.setCategory('chaquetas');

    expect(store.filters.category).toBe('chaquetas');
    expect(store.filteredProducts.every((p) => p.category === 'chaquetas')).toBe(true);
    expect(store.totalResultsCount).toBeGreaterThan(0);
    expect(store.activeFiltersCount).toBe(1);
  });

  it('filters by text search across name, brand and description', () => {
    const store = useCatalogStore();
    store.setSearch('Acne Studios');

    expect(store.filteredProducts.every((p) => p.brand === 'Acne Studios' || p.name.includes('Acne'))).toBe(true);
    expect(store.totalResultsCount).toBeGreaterThan(0);
  });

  it('filters by price range', () => {
    const store = useCatalogStore();
    store.setPriceRange(200, 450);

    expect(store.filteredProducts.every((p) => p.price >= 200 && p.price <= 450)).toBe(true);
  });

  it('filters by color swatch', () => {
    const store = useCatalogStore();
    store.toggleColor('negro');

    expect(store.filters.colors).toContain('negro');
    expect(store.filteredProducts.every((p) => p.colors.some((c) => c.id === 'negro'))).toBe(true);

    // Toggle off
    store.toggleColor('negro');
    expect(store.filters.colors).not.toContain('negro');
  });

  it('filters by sizes', () => {
    const store = useCatalogStore();
    store.toggleSize('XL');

    expect(store.filters.sizes).toContain('XL');
    expect(store.filteredProducts.every((p) => p.sizes.includes('XL'))).toBe(true);
  });

  it('sorts by price asc and desc', () => {
    const store = useCatalogStore();

    store.setSortBy('price-asc');
    const ascPrices = store.sortedAndFilteredProducts.map((p) => p.price);
    for (let i = 0; i < ascPrices.length - 1; i++) {
      expect(ascPrices[i]).toBeLessThanOrEqual(ascPrices[i + 1]);
    }

    store.setSortBy('price-desc');
    const descPrices = store.sortedAndFilteredProducts.map((p) => p.price);
    for (let i = 0; i < descPrices.length - 1; i++) {
      expect(descPrices[i]).toBeGreaterThanOrEqual(descPrices[i + 1]);
    }
  });

  it('removes individual filter and resets all filters', () => {
    const store = useCatalogStore();
    store.setCategory('calzado');
    store.toggleColor('negro');
    store.setSearch('boots');

    expect(store.activeFiltersCount).toBe(3);

    store.removeFilter('search');
    expect(store.filters.search).toBe('');
    expect(store.activeFiltersCount).toBe(2);

    store.resetFilters();
    expect(store.activeFiltersCount).toBe(0);
    expect(store.filters.category).toBe('all');
    expect(store.filters.colors).toEqual([]);
  });

  it('handles quick view and drawer toggles', () => {
    const store = useCatalogStore();
    const product = store.products[0];

    store.openQuickView(product);
    expect(store.isQuickViewOpen).toBe(true);
    expect(store.selectedProductForQuickView?.id).toBe(product.id);

    store.closeQuickView();
    expect(store.isQuickViewOpen).toBe(false);
    expect(store.selectedProductForQuickView).toBeNull();
  });
});
