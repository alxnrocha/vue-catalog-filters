<script setup lang="ts">
import { useCatalogStore } from '@/stores/useCatalogStore';
import ProductCard from '@/components/catalog/ProductCard.vue';
import { PackageOpen, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-vue-next';
import type { Product } from '@/types/catalog';

const store = useCatalogStore();

const handleQuickView = (product: Product) => {
  store.openQuickView(product);
};
</script>

<template>
  <div class="space-y-8">
    <!-- Products Container -->
    <div
      v-if="store.paginatedProducts.length > 0"
      :class="[
        store.filters.viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6'
          : 'flex flex-col gap-4',
      ]"
    >
      <ProductCard
        v-for="product in store.paginatedProducts"
        :key="product.id"
        :product="product"
        :view-mode="store.filters.viewMode"
        @quick-view="handleQuickView"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="py-16 px-6 text-center rounded-2xl glass-card border border-zinc-800/80 space-y-4"
    >
      <div class="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mx-auto text-amber-400">
        <PackageOpen class="w-8 h-8" />
      </div>
      <div class="space-y-1 max-w-sm mx-auto">
        <h3 class="text-lg font-semibold text-zinc-100">No hay prendas que coincidan</h3>
        <p class="text-xs text-zinc-400 leading-relaxed">
          Prueba a relajar los filtros de precio, cambiar de categoría o buscar términos más generales.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        @click="store.resetFilters"
      >
        <RotateCcw class="w-4 h-4" />
        <span>Restablecer todos los filtros</span>
      </button>
    </div>

    <!-- Pagination Controls -->
    <div
      v-if="store.totalPages > 1"
      class="flex items-center justify-between pt-6 border-t border-zinc-800/80"
    >
      <button
        type="button"
        :disabled="store.filters.page <= 1"
        :class="[
          'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer',
          store.filters.page <= 1
            ? 'opacity-40 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-600'
            : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60',
        ]"
        @click="store.setPage(store.filters.page - 1)"
      >
        <ChevronLeft class="w-4 h-4" />
        <span>Anterior</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1.5">
        <button
          v-for="p in store.totalPages"
          :key="p"
          type="button"
          :class="[
            'w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer',
            store.filters.page === p
              ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800',
          ]"
          @click="store.setPage(p)"
        >
          {{ p }}
        </button>
      </div>

      <button
        type="button"
        :disabled="store.filters.page >= store.totalPages"
        :class="[
          'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer',
          store.filters.page >= store.totalPages
            ? 'opacity-40 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-600'
            : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60',
        ]"
        @click="store.setPage(store.filters.page + 1)"
      >
        <span>Siguiente</span>
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
