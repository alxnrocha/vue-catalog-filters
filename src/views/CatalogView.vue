<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';
import CommandPalette from '@/components/common/CommandPalette.vue';
import FilterSidebar from '@/components/catalog/FilterSidebar.vue';
import ActiveFilterChips from '@/components/catalog/ActiveFilterChips.vue';
import CatalogToolbar from '@/components/catalog/CatalogToolbar.vue';
import ProductGrid from '@/components/catalog/ProductGrid.vue';
import QuickViewModal from '@/components/quickview/QuickViewModal.vue';
import { useCatalogStore } from '@/stores/useCatalogStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useCatalogUrlSync } from '@/composables/useCatalogUrlSync';
import type { Product, ProductColor, ProductSize } from '@/types/catalog';

const store = useCatalogStore();
const wishlistStore = useWishlistStore();
useCatalogUrlSync();

const cartCount = ref(0);

const handleSelectProductFromSearch = (product: Product) => {
  store.openQuickView(product);
};

const handleOpenSearchModal = () => {
  store.openCommandPalette();
};

const handleOpenCart = () => {
  // Will connect with cart drawer in Issue #12
};

const handleOpenWishlist = () => {
  // Will connect with wishlist in Issue #10
};
const handleAddToCartFromModal = (payload: {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
}) => {
  // Handled with cart store in Issue #12
  console.log('Added to cart:', payload);
};
</script>

<template>
  <div class="min-h-screen bg-[#0b0f17] text-gray-100 flex flex-col justify-between">
    <AppHeader
      v-model:search-query="store.filters.search"
      :cart-count="cartCount"
      :wishlist-count="wishlistStore.wishlistCount"
      @open-search-modal="handleOpenSearchModal"
      @open-cart="handleOpenCart"
      @open-wishlist="handleOpenWishlist"
    />

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold font-serif-luxury bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent">
          COLECCIÓN ATELIER 2026
        </h1>
        <p class="text-zinc-400 text-sm mt-2 max-w-xl">
          Explora nuestra selección exclusiva con filtros dinámicos, cortes impecables y tejidos nobles seleccionados a mano.
        </p>
      </div>

      <!-- Main Catalog Layout (Sidebar + Products Grid) -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <!-- Desktop Sidebar Filters -->
        <div class="hidden lg:block p-6 rounded-2xl glass-card border border-zinc-800/80 sticky top-24">
          <FilterSidebar />
        </div>

        <!-- Products Main Section -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Active Filters Bar -->
          <ActiveFilterChips />

          <!-- Toolbar (Count, Sorting, View Switcher) -->
          <CatalogToolbar />

          <!-- Real Products Grid / List -->
          <ProductGrid />
        </div>
      </div>
    </main>

    <AppFooter />

    <!-- Global Command Palette Modal (Ctrl+K / Cmd+K) -->
    <CommandPalette
      v-model="store.isCommandPaletteOpen"
      @select-product="handleSelectProductFromSearch"
    />

    <!-- Quick View Product Modal -->
    <QuickViewModal
      v-model="store.isQuickViewOpen"
      :product="store.selectedProductForQuickView"
      @add-to-cart="handleAddToCartFromModal"
    />
  </div>
</template>
