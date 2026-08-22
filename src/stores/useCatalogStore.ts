import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import type {
  Product,
  CatalogFilters,
  ProductSize,
  SortOption,
  ViewMode,
} from '@/types/catalog';
import { mockProducts } from '@/data/products.mock';
import { mockCategories } from '@/data/categories.mock';
import { mockBrands } from '@/data/brands.mock';
import { mockColors } from '@/data/colors.mock';

export interface ActiveFilterChip {
  id: string;
  type: 'category' | 'price' | 'color' | 'size' | 'rating' | 'brand' | 'inStock' | 'onSale' | 'search';
  label: string;
  value?: string;
}

export const useCatalogStore = defineStore('catalog', () => {
  // State
  const products = ref<Product[]>(mockProducts);

  const initialFilters: CatalogFilters = {
    search: '',
    category: 'all',
    minPrice: 50,
    maxPrice: 1000,
    colors: [],
    sizes: [],
    minRating: 0,
    brands: [],
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'popularity',
    viewMode: 'grid',
    page: 1,
    itemsPerPage: 12,
  };

  const filters = reactive<CatalogFilters>({ ...initialFilters });

  const selectedProductForQuickView = ref<Product | null>(null);
  const isQuickViewOpen = ref(false);
  const isMobileFilterDrawerOpen = ref(false);
  const isCommandPaletteOpen = ref(false);

  // Computed / Getters
  const priceBounds = computed(() => {
    const prices = products.value.map((p) => p.price);
    return {
      min: Math.min(...prices, 50),
      max: Math.max(...prices, 1000),
    };
  });

  const filteredProducts = computed(() => {
    return products.value.filter((product) => {
      // 1. Text search (name, brand, description, details)
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesDetails = product.details.some((d) => d.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesDetails) {
          return false;
        }
      }

      // 2. Category
      if (filters.category && filters.category !== 'all') {
        if (product.category !== filters.category) {
          return false;
        }
      }

      // 3. Price range
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // 4. Colors (matches ANY selected color)
      if (filters.colors.length > 0) {
        const hasMatchingColor = product.colors.some((c) => filters.colors.includes(c.id));
        if (!hasMatchingColor) {
          return false;
        }
      }

      // 5. Sizes (matches ANY selected size)
      if (filters.sizes.length > 0) {
        const hasMatchingSize = product.sizes.some((s) => filters.sizes.includes(s));
        if (!hasMatchingSize) {
          return false;
        }
      }

      // 6. Rating (greater than or equal to minRating)
      if (filters.minRating > 0) {
        if (product.rating < filters.minRating) {
          return false;
        }
      }

      // 7. Brands (matches ANY selected brand)
      if (filters.brands.length > 0) {
        if (!filters.brands.includes(product.brand)) {
          return false;
        }
      }

      // 8. In stock only
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // 9. On sale only (has discountPercentage > 0 or originalPrice > price)
      if (filters.onSaleOnly && (!product.discountPercentage || product.discountPercentage <= 0)) {
        return false;
      }

      return true;
    });
  });

  const sortedAndFilteredProducts = computed(() => {
    const list = [...filteredProducts.value];

    switch (filters.sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'rating-desc':
        return list.sort((a, b) => b.rating - a.rating);
      case 'popularity':
      default:
        return list.sort((a, b) => b.rating * b.reviewsCount - a.rating * a.reviewsCount);
    }
  });

  const totalResultsCount = computed(() => sortedAndFilteredProducts.value.length);

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(totalResultsCount.value / filters.itemsPerPage));
  });

  const paginatedProducts = computed(() => {
    const start = (filters.page - 1) * filters.itemsPerPage;
    const end = start + filters.itemsPerPage;
    return sortedAndFilteredProducts.value.slice(start, end);
  });

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.minPrice > 50 || filters.maxPrice < 1000) count++;
    count += filters.colors.length;
    count += filters.sizes.length;
    if (filters.minRating > 0) count++;
    count += filters.brands.length;
    if (filters.inStockOnly) count++;
    if (filters.onSaleOnly) count++;
    return count;
  });

  const activeFiltersList = computed<ActiveFilterChip[]>(() => {
    const list: ActiveFilterChip[] = [];

    if (filters.search.trim()) {
      list.push({
        id: `search-${filters.search}`,
        type: 'search',
        label: `"${filters.search}"`,
      });
    }

    if (filters.category && filters.category !== 'all') {
      const cat = mockCategories.find((c) => c.id === filters.category);
      list.push({
        id: `category-${filters.category}`,
        type: 'category',
        label: cat?.label || filters.category,
        value: filters.category,
      });
    }

    if (filters.minPrice > 50 || filters.maxPrice < 1000) {
      list.push({
        id: 'price-range',
        type: 'price',
        label: `€${filters.minPrice} - €${filters.maxPrice}`,
      });
    }

    filters.colors.forEach((colorId) => {
      const col = mockColors.find((c) => c.id === colorId);
      list.push({
        id: `color-${colorId}`,
        type: 'color',
        label: col?.name || colorId,
        value: colorId,
      });
    });

    filters.sizes.forEach((size) => {
      list.push({
        id: `size-${size}`,
        type: 'size',
        label: `Talla ${size}`,
        value: size,
      });
    });

    if (filters.minRating > 0) {
      list.push({
        id: `rating-${filters.minRating}`,
        type: 'rating',
        label: `${filters.minRating}+ ★`,
      });
    }

    filters.brands.forEach((brand) => {
      list.push({
        id: `brand-${brand}`,
        type: 'brand',
        label: brand,
        value: brand,
      });
    });

    if (filters.inStockOnly) {
      list.push({
        id: 'in-stock',
        type: 'inStock',
        label: 'En Stock',
      });
    }

    if (filters.onSaleOnly) {
      list.push({
        id: 'on-sale',
        type: 'onSale',
        label: 'En Oferta',
      });
    }

    return list;
  });

  // Dynamic Multi-Faceted Match Evaluator (Algolia / Shopify style)
  const matchesFiltersExcept = (product: Product, exceptDimension: string): boolean => {
    // 1. Search query
    if (exceptDimension !== 'search' && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchDetails = product.details.some((d) => d.toLowerCase().includes(q));
      if (!matchName && !matchBrand && !matchDesc && !matchDetails) {
        return false;
      }
    }

    // 2. Category
    if (exceptDimension !== 'category' && filters.category && filters.category !== 'all') {
      if (product.category !== filters.category) {
        return false;
      }
    }

    // 3. Price range
    if (exceptDimension !== 'price') {
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
    }

    // 4. Colors
    if (exceptDimension !== 'colors' && filters.colors.length > 0) {
      const hasMatchingColor = product.colors.some((c) => filters.colors.includes(c.id));
      if (!hasMatchingColor) {
        return false;
      }
    }

    // 5. Sizes
    if (exceptDimension !== 'sizes' && filters.sizes.length > 0) {
      const hasMatchingSize = product.sizes.some((s) => filters.sizes.includes(s));
      if (!hasMatchingSize) {
        return false;
      }
    }

    // 6. Rating
    if (exceptDimension !== 'minRating' && filters.minRating > 0) {
      if (product.rating < filters.minRating) {
        return false;
      }
    }

    // 7. Brands
    if (exceptDimension !== 'brands' && filters.brands.length > 0) {
      if (!filters.brands.includes(product.brand)) {
        return false;
      }
    }

    // 8. In Stock
    if (exceptDimension !== 'inStock' && filters.inStockOnly && !product.inStock) {
      return false;
    }

    // 9. On Sale
    if (exceptDimension !== 'onSale' && filters.onSaleOnly && (!product.discountPercentage || product.discountPercentage <= 0)) {
      return false;
    }

    return true;
  };

  const categoryFacetCounts = computed(() => {
    const counts: Record<string, number> = {
      all: products.value.filter((p) => matchesFiltersExcept(p, 'category')).length,
    };
    mockCategories.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = products.value.filter(
          (p) => matchesFiltersExcept(p, 'category') && p.category === cat.id
        ).length;
      }
    });
    return counts;
  });

  const brandFacetCounts = computed(() => {
    const counts: Record<string, number> = {};
    mockBrands.forEach((b) => {
      counts[b.name] = products.value.filter(
        (p) => matchesFiltersExcept(p, 'brands') && p.brand === b.name
      ).length;
    });
    return counts;
  });

  const colorFacetCounts = computed(() => {
    const counts: Record<string, number> = {};
    mockColors.forEach((col) => {
      counts[col.id] = products.value.filter(
        (p) => matchesFiltersExcept(p, 'colors') && p.colors.some((c) => c.id === col.id)
      ).length;
    });
    return counts;
  });

  const sizeFacetCounts = computed(() => {
    const counts: Record<string, number> = {};
    const allSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única'];
    allSizes.forEach((sz) => {
      counts[sz] = products.value.filter(
        (p) => matchesFiltersExcept(p, 'sizes') && p.sizes.includes(sz)
      ).length;
    });
    return counts;
  });

  // Actions
  const setSearch = (query: string) => {
    filters.search = query;
    filters.page = 1;
  };

  const setCategory = (cat: string) => {
    filters.category = cat;
    filters.page = 1;
  };

  const setPriceRange = (min: number, max: number) => {
    filters.minPrice = min;
    filters.maxPrice = max;
    filters.page = 1;
  };

  const toggleColor = (colorId: string) => {
    const index = filters.colors.indexOf(colorId);
    if (index > -1) {
      filters.colors.splice(index, 1);
    } else {
      filters.colors.push(colorId);
    }
    filters.page = 1;
  };

  const toggleSize = (size: ProductSize) => {
    const index = filters.sizes.indexOf(size);
    if (index > -1) {
      filters.sizes.splice(index, 1);
    } else {
      filters.sizes.push(size);
    }
    filters.page = 1;
  };

  const setMinRating = (rating: number) => {
    filters.minRating = filters.minRating === rating ? 0 : rating;
    filters.page = 1;
  };

  const toggleBrand = (brandName: string) => {
    const index = filters.brands.indexOf(brandName);
    if (index > -1) {
      filters.brands.splice(index, 1);
    } else {
      filters.brands.push(brandName);
    }
    filters.page = 1;
  };

  const toggleInStockOnly = () => {
    filters.inStockOnly = !filters.inStockOnly;
    filters.page = 1;
  };

  const toggleOnSaleOnly = () => {
    filters.onSaleOnly = !filters.onSaleOnly;
    filters.page = 1;
  };

  const setSortBy = (sort: SortOption) => {
    filters.sortBy = sort;
    filters.page = 1;
  };

  const setViewMode = (mode: ViewMode) => {
    filters.viewMode = mode;
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      filters.page = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const removeFilter = (type: ActiveFilterChip['type'], value?: string) => {
    switch (type) {
      case 'search':
        filters.search = '';
        break;
      case 'category':
        filters.category = 'all';
        break;
      case 'price':
        filters.minPrice = 50;
        filters.maxPrice = 1000;
        break;
      case 'color':
        if (value) toggleColor(value);
        break;
      case 'size':
        if (value) toggleSize(value as ProductSize);
        break;
      case 'rating':
        filters.minRating = 0;
        break;
      case 'brand':
        if (value) toggleBrand(value);
        break;
      case 'inStock':
        filters.inStockOnly = false;
        break;
      case 'onSale':
        filters.onSaleOnly = false;
        break;
    }
    filters.page = 1;
  };

  const resetFilters = () => {
    filters.search = '';
    filters.category = 'all';
    filters.minPrice = 50;
    filters.maxPrice = 1000;
    filters.colors = [];
    filters.sizes = [];
    filters.minRating = 0;
    filters.brands = [];
    filters.inStockOnly = false;
    filters.onSaleOnly = false;
    filters.sortBy = 'popularity';
    filters.page = 1;
  };

  const openQuickView = (product: Product) => {
    selectedProductForQuickView.value = product;
    isQuickViewOpen.value = true;
  };

  const closeQuickView = () => {
    isQuickViewOpen.value = false;
    selectedProductForQuickView.value = null;
  };

  const openMobileFilters = () => {
    isMobileFilterDrawerOpen.value = true;
  };

  const closeMobileFilters = () => {
    isMobileFilterDrawerOpen.value = false;
  };

  const openCommandPalette = () => {
    isCommandPaletteOpen.value = true;
  };

  const closeCommandPalette = () => {
    isCommandPaletteOpen.value = false;
  };

  return {
    // State
    products,
    filters,
    selectedProductForQuickView,
    isQuickViewOpen,
    isMobileFilterDrawerOpen,
    isCommandPaletteOpen,
    // Getters
    priceBounds,
    filteredProducts,
    sortedAndFilteredProducts,
    paginatedProducts,
    totalResultsCount,
    totalPages,
    activeFiltersCount,
    activeFiltersList,
    categoryFacetCounts,
    brandFacetCounts,
    colorFacetCounts,
    sizeFacetCounts,
    // Actions
    setSearch,
    setCategory,
    setPriceRange,
    toggleColor,
    toggleSize,
    setMinRating,
    toggleBrand,
    toggleInStockOnly,
    toggleOnSaleOnly,
    setSortBy,
    setViewMode,
    setPage,
    removeFilter,
    resetFilters,
    openQuickView,
    closeQuickView,
    openMobileFilters,
    closeMobileFilters,
    openCommandPalette,
    closeCommandPalette,
  };
});
