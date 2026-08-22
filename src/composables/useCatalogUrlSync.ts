import { watch, ref } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { useCatalogStore } from '@/stores/useCatalogStore';
import { useDebounceFn } from '@vueuse/core';
import type { ProductSize, SortOption, ViewMode } from '@/types/catalog';

export function useCatalogUrlSync() {
  const route = useRoute();
  const router = useRouter();
  const store = useCatalogStore();

  const isSyncingFromUrl = ref(false);

  // Parse query params from URL and apply to store
  const syncStoreFromUrl = (query: LocationQuery) => {
    isSyncingFromUrl.value = true;

    try {
      if (typeof query.q === 'string') {
        store.filters.search = query.q;
      }

      if (typeof query.category === 'string') {
        store.filters.category = query.category;
      }

      if (typeof query.minPrice === 'string') {
        const min = parseInt(query.minPrice, 10);
        if (!isNaN(min)) store.filters.minPrice = min;
      }

      if (typeof query.maxPrice === 'string') {
        const max = parseInt(query.maxPrice, 10);
        if (!isNaN(max)) store.filters.maxPrice = max;
      }

      if (typeof query.colors === 'string' && query.colors) {
        store.filters.colors = query.colors.split(',').filter(Boolean);
      }

      if (typeof query.sizes === 'string' && query.sizes) {
        store.filters.sizes = query.sizes.split(',').filter(Boolean) as ProductSize[];
      }

      if (typeof query.minRating === 'string') {
        const rating = parseFloat(query.minRating);
        if (!isNaN(rating)) store.filters.minRating = rating;
      }

      if (typeof query.brands === 'string' && query.brands) {
        store.filters.brands = query.brands.split(',').filter(Boolean);
      }

      if (query.inStock === 'true') {
        store.filters.inStockOnly = true;
      }

      if (query.onSale === 'true') {
        store.filters.onSaleOnly = true;
      }

      if (typeof query.sort === 'string') {
        store.filters.sortBy = query.sort as SortOption;
      }

      if (typeof query.view === 'string' && (query.view === 'grid' || query.view === 'list')) {
        store.filters.viewMode = query.view as ViewMode;
      }

      if (typeof query.page === 'string') {
        const p = parseInt(query.page, 10);
        if (!isNaN(p) && p >= 1) store.filters.page = p;
      }
    } finally {
      // Release sync lock
      setTimeout(() => {
        isSyncingFromUrl.value = false;
      }, 50);
    }
  };

  // Build clean URL query params from current filters
  const buildQueryParams = (): Record<string, string> => {
    const query: Record<string, string> = {};

    if (store.filters.search.trim()) {
      query.q = store.filters.search.trim();
    }

    if (store.filters.category && store.filters.category !== 'all') {
      query.category = store.filters.category;
    }

    if (store.filters.minPrice > 50) {
      query.minPrice = store.filters.minPrice.toString();
    }

    if (store.filters.maxPrice < 1000) {
      query.maxPrice = store.filters.maxPrice.toString();
    }

    if (store.filters.colors.length > 0) {
      query.colors = store.filters.colors.join(',');
    }

    if (store.filters.sizes.length > 0) {
      query.sizes = store.filters.sizes.join(',');
    }

    if (store.filters.minRating > 0) {
      query.minRating = store.filters.minRating.toString();
    }

    if (store.filters.brands.length > 0) {
      query.brands = store.filters.brands.join(',');
    }

    if (store.filters.inStockOnly) {
      query.inStock = 'true';
    }

    if (store.filters.onSaleOnly) {
      query.onSale = 'true';
    }

    if (store.filters.sortBy !== 'popularity') {
      query.sort = store.filters.sortBy;
    }

    if (store.filters.viewMode !== 'grid') {
      query.view = store.filters.viewMode;
    }

    if (store.filters.page > 1) {
      query.page = store.filters.page.toString();
    }

    return query;
  };

  // Push clean query to route with debounce
  const updateUrlFromStore = useDebounceFn(() => {
    if (isSyncingFromUrl.value) return;

    const newQuery = buildQueryParams();
    const currentQuery = { ...route.query };

    // Check if query actually changed to avoid redundant router pushes
    const isDifferent =
      JSON.stringify(newQuery) !== JSON.stringify(currentQuery);

    if (isDifferent) {
      router.replace({
        path: route.path,
        query: newQuery,
      }).catch(() => {});
    }
  }, 120);

  // Watch store filters and update URL
  watch(
    () => store.filters,
    () => {
      updateUrlFromStore();
    },
    { deep: true }
  );

  // Watch URL query changes (e.g. Back/Forward button)
  watch(
    () => route.query,
    (newQuery) => {
      if (!isSyncingFromUrl.value) {
        syncStoreFromUrl(newQuery);
      }
    }
  );

  // Initial sync on mount
  if (Object.keys(route.query).length > 0) {
    syncStoreFromUrl(route.query);
  }

  return {
    syncStoreFromUrl,
    buildQueryParams,
  };
}
