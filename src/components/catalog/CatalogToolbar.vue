<script setup lang="ts">
import { useCatalogStore } from '@/stores/useCatalogStore';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-vue-next';
import type { SortOption } from '@/types/catalog';

const store = useCatalogStore();

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Popularidad', value: 'popularity' },
  { label: 'Precio: Menor a Mayor', value: 'price-asc' },
  { label: 'Precio: Mayor a Menor', value: 'price-desc' },
  { label: 'Novedades', value: 'newest' },
  { label: 'Mejor Valorados', value: 'rating-desc' },
];

const handleSortChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  store.setSortBy(target.value as SortOption);
};
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
    <!-- Left: Results Counter -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-800/90 text-zinc-100 border border-zinc-700 rounded-lg text-xs font-semibold hover:border-amber-500/50 transition-colors cursor-pointer"
        @click="store.openMobileFilters"
      >
        <SlidersHorizontal class="w-4 h-4 text-amber-400" />
        <span>Filtros</span>
        <span
          v-if="store.activeFiltersCount > 0"
          class="px-1.5 py-0.2 bg-amber-500 text-black rounded-full text-[10px] font-bold"
        >
          {{ store.activeFiltersCount }}
        </span>
      </button>

      <p class="text-sm text-zinc-300 font-medium">
        <strong class="text-amber-400 font-semibold font-mono">{{ store.totalResultsCount }}</strong>
        <span class="text-zinc-400 ml-1">resultados encontrados</span>
      </p>
    </div>

    <!-- Right: Sorting & View Mode Switcher -->
    <div class="flex items-center gap-3 self-end sm:self-auto">
      <!-- Sort Dropdown -->
      <div class="relative flex items-center">
        <label for="catalog-sort" class="sr-only">Ordenar catálogo por</label>
        <select
          id="catalog-sort"
          :value="store.filters.sortBy"
          class="bg-[#111827] text-xs font-medium text-zinc-200 pl-3 pr-8 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 focus:outline-none focus:border-amber-500/60 transition-colors cursor-pointer appearance-none"
          @change="handleSortChange"
        >
          <option
            v-for="opt in sortOptions"
            :key="opt.value"
            :value="opt.value"
            class="bg-[#111827] text-zinc-200"
          >
            Ordenar por: {{ opt.label }}
          </option>
        </select>
        <div class="absolute right-2.5 pointer-events-none text-zinc-500 text-xs">
          ▾
        </div>
      </div>

      <!-- View Mode Buttons (Grid vs List) -->
      <div class="flex items-center p-0.5 bg-zinc-900/90 rounded-lg border border-zinc-800">
        <button
          type="button"
          :class="[
            'p-1.5 rounded-md transition-all cursor-pointer',
            store.filters.viewMode === 'grid'
              ? 'bg-amber-500/20 text-amber-400 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300',
          ]"
          title="Vista en Cuadrícula"
          @click="store.setViewMode('grid')"
        >
          <LayoutGrid class="w-4 h-4" />
        </button>

        <button
          type="button"
          :class="[
            'p-1.5 rounded-md transition-all cursor-pointer',
            store.filters.viewMode === 'list'
              ? 'bg-amber-500/20 text-amber-400 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300',
          ]"
          title="Vista en Lista"
          @click="store.setViewMode('list')"
        >
          <List class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
