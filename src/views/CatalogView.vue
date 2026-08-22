<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';

const searchQuery = ref('');
const cartCount = ref(0);
const wishlistCount = ref(0);

const handleOpenSearchModal = () => {
  // Will connect with search modal in Issue #07
};

const handleOpenCart = () => {
  // Will connect with cart drawer in Issue #12
};

const handleOpenWishlist = () => {
  // Will connect with wishlist in Issue #10
};
</script>

<template>
  <div class="min-h-screen bg-[#0b0f17] text-gray-100 flex flex-col justify-between">
    <AppHeader
      v-model:search-query="searchQuery"
      :cart-count="cartCount"
      :wishlist-count="wishlistCount"
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

      <!-- Placeholder grid content while next issues implement catalog engine -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="hidden md:block p-6 rounded-2xl glass-card border border-zinc-800/80">
          <h2 class="text-sm font-semibold tracking-wider uppercase text-zinc-300 mb-4">Filtros</h2>
          <div class="space-y-4">
            <div class="h-4 bg-zinc-800/80 rounded w-3/4 animate-pulse"></div>
            <div class="h-4 bg-zinc-800/60 rounded w-1/2 animate-pulse"></div>
            <div class="h-4 bg-zinc-800/60 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>

        <div class="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="rounded-2xl glass-card p-4 border border-zinc-800/80 space-y-3">
            <div class="aspect-[3/4] bg-zinc-800/60 rounded-xl animate-pulse"></div>
            <div class="h-4 bg-zinc-800/80 rounded w-2/3"></div>
            <div class="h-4 bg-amber-500/30 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
