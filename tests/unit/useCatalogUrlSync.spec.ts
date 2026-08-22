import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCatalogStore } from '@/stores/useCatalogStore';

describe('useCatalogUrlSync Composable Logic', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('correctly maps URL query params to store filter state', () => {
    const store = useCatalogStore();

    // Simulate query parsing
    const query = {
      q: 'bomber',
      category: 'chaquetas',
      minPrice: '100',
      maxPrice: '700',
      colors: 'negro,camel',
      sizes: 'M,L',
      minRating: '4.5',
      brands: 'Acne Studios,Totême',
      inStock: 'true',
      onSale: 'true',
      sort: 'price-asc',
      view: 'list',
      page: '2',
    };

    store.filters.search = query.q;
    store.filters.category = query.category;
    store.filters.minPrice = parseInt(query.minPrice, 10);
    store.filters.maxPrice = parseInt(query.maxPrice, 10);
    store.filters.colors = query.colors.split(',');
    store.filters.sizes = query.sizes.split(',') as any;
    store.filters.minRating = parseFloat(query.minRating);
    store.filters.brands = query.brands.split(',');
    store.filters.inStockOnly = true;
    store.filters.onSaleOnly = true;
    store.filters.sortBy = query.sort as any;
    store.filters.viewMode = query.view as any;
    store.filters.page = parseInt(query.page, 10);

    expect(store.filters.search).toBe('bomber');
    expect(store.filters.category).toBe('chaquetas');
    expect(store.filters.minPrice).toBe(100);
    expect(store.filters.maxPrice).toBe(700);
    expect(store.filters.colors).toEqual(['negro', 'camel']);
    expect(store.filters.sizes).toEqual(['M', 'L']);
    expect(store.filters.minRating).toBe(4.5);
    expect(store.filters.brands).toEqual(['Acne Studios', 'Totême']);
    expect(store.filters.inStockOnly).toBe(true);
    expect(store.filters.onSaleOnly).toBe(true);
    expect(store.filters.sortBy).toBe('price-asc');
    expect(store.filters.viewMode).toBe('list');
    expect(store.filters.page).toBe(2);
  });
});
