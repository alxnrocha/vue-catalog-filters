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
import CartDrawer from '@/components/cart/CartDrawer.vue';
import { useCatalogStore } from '@/stores/useCatalogStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCatalogUrlSync } from '@/composables/useCatalogUrlSync';
import type { Product, ProductColor, ProductSize } from '@/types/catalog';

const store = useCatalogStore();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
useCatalogUrlSync();

const isCheckoutDrawerOpen = ref(false);

const handleSelectProductFromSearch = (product: Product) => {
  store.openQuickView(product);
};

const handleOpenSearchModal = () => {
  store.openCommandPalette();
};

const handleOpenCart = () => {
  cartStore.openCart();
};

const handleOpenWishlist = () => {
  store.filters.category = 'all';
  store.resetFilters();
};

const handleAddToCartFromModal = (payload: {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
}) => {
  cartStore.addItem(payload.product, payload.selectedColor, payload.selectedSize, payload.quantity);
};

const handleOpenCheckout = () => {
  isCheckoutDrawerOpen.value = true;
};
</script>

<template>
  <div class="min-h-screen bg-[#0b0f17] text-gray-100 flex flex-col justify-between">
    <AppHeader
      v-model:search-query="store.filters.search"
      :cart-count="cartStore.totalItemsCount"
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

    <!-- Shopping Cart Slide-over Drawer -->
    <CartDrawer
      v-model="cartStore.isCartOpen"
      @open-checkout="handleOpenCheckout"
    />
  </div>
</template>
