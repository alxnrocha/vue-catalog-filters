<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCatalogStore } from '@/stores/useCatalogStore';
import { mockCategories } from '@/data/categories.mock';
import { mockColors } from '@/data/colors.mock';
import { mockBrands } from '@/data/brands.mock';
import PriceRangeSlider from '@/components/catalog/PriceRangeSlider.vue';
import { ChevronDown, ChevronUp, Search, Star, RotateCcw, Check, Sparkles } from 'lucide-vue-next';
import type { ProductSize } from '@/types/catalog';

const store = useCatalogStore();

const brandSearch = ref('');
const availableSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Accordion collapse states
const openSections = ref<Record<string, boolean>>({
  categories: true,
  price: true,
  colors: true,
  sizes: true,
  rating: true,
  brands: true,
  special: true,
});

const toggleSection = (section: string) => {
  openSections.value[section] = !openSections.value[section];
};

const filteredBrandsList = computed(() => {
  if (!brandSearch.value.trim()) return mockBrands;
  const q = brandSearch.value.toLowerCase().trim();
  return mockBrands.filter((b) => b.name.toLowerCase().includes(q));
});
</script>

<template>
  <aside class="w-full space-y-6 select-none">
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between pb-4 border-b border-zinc-800/80">
      <div class="flex items-center gap-2">
        <h2 class="text-sm font-bold uppercase tracking-wider text-zinc-100 font-serif-luxury">
          Filtros
        </h2>
        <span
          v-if="store.activeFiltersCount > 0"
          class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-black leading-none"
        >
          {{ store.activeFiltersCount }}
        </span>
      </div>

      <button
        v-if="store.activeFiltersCount > 0"
        type="button"
        class="text-xs text-amber-400/90 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        @click="store.resetFilters"
      >
        <RotateCcw class="w-3 h-3" />
        <span>Limpiar todo</span>
      </button>
    </div>

    <!-- 1. CATEGORÍA (Accordion) -->
    <div class="pb-5 border-b border-zinc-800/60">
      <button
        type="button"
        class="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-amber-400 py-1 transition-colors cursor-pointer"
        @click="toggleSection('categories')"
      >
        <span>Categoría</span>
        <ChevronUp v-if="openSections.categories" class="w-4 h-4 text-zinc-500" />
        <ChevronDown v-else class="w-4 h-4 text-zinc-500" />
      </button>

      <div v-show="openSections.categories" class="mt-3 space-y-1">
        <button
          v-for="cat in mockCategories"
          :key="cat.id"
          type="button"
          :class="[
            'group w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-xs transition-all duration-200 cursor-pointer text-left',
            store.filters.category === cat.id
              ? 'text-amber-400 font-semibold bg-amber-500/10 pl-3 border-l-2 border-amber-400'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 hover:pl-3',
          ]"
          @click="store.setCategory(cat.id)"
        >
          <span class="flex items-center gap-2">
            <span>{{ cat.label }}</span>
          </span>
          <span
            :class="[
              'text-[11px] font-mono transition-colors',
              store.filters.category === cat.id ? 'text-amber-400/90 font-bold' : 'text-zinc-600 group-hover:text-zinc-400'
            ]"
          >
            {{ store.categoryFacetCounts[cat.id] ?? cat.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- 2. RANGO DE PRECIO -->
    <div class="pb-5 border-b border-zinc-800/60">
      <button
        type="button"
        class="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-amber-400 py-1 transition-colors cursor-pointer"
        @click="toggleSection('price')"
      >
        <span>Rango de Precio</span>
        <ChevronUp v-if="openSections.price" class="w-4 h-4 text-zinc-500" />
        <ChevronDown v-else class="w-4 h-4 text-zinc-500" />
      </button>

      <div v-show="openSections.price" class="mt-3">
        <PriceRangeSlider
          :min="50"
          :max="1000"
          :min-price="store.filters.minPrice"
          :max-price="store.filters.maxPrice"
          @update:min-price="(val) => store.setPriceRange(val, store.filters.maxPrice)"
          @update:max-price="(val) => store.setPriceRange(store.filters.minPrice, val)"
        />
      </div>
    </div>

    <!-- 3. COLOR (Swatches) -->
    <div class="pb-5 border-b border-zinc-800/60">
      <button
        type="button"
        class="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-amber-400 py-1 transition-colors cursor-pointer"
        @click="toggleSection('colors')"
      >
        <span>Color</span>
        <ChevronUp v-if="openSections.colors" class="w-4 h-4 text-zinc-500" />
        <ChevronDown v-else class="w-4 h-4 text-zinc-500" />
      </button>

      <div v-show="openSections.colors" class="mt-3">
        <div class="flex flex-wrap gap-2.5">
          <button
            v-for="color in mockColors"
            :key="color.id"
            type="button"
            :title="`${color.name} (${store.colorFacetCounts[color.id] || 0})`"
            :class="[
              'relative w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center',
              store.filters.colors.includes(color.id)
                ? 'border-amber-400 scale-110 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                : 'border-zinc-700/80 hover:scale-105 hover:border-zinc-500',
            ]"
            :style="{ backgroundColor: color.hex }"
            @click="store.toggleColor(color.id)"
          >
            <Check
              v-if="store.filters.colors.includes(color.id)"
              :class="[
                'w-3.5 h-3.5 stroke-[3]',
                color.id === 'blanco' || color.id === 'camel' ? 'text-black' : 'text-amber-300',
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- 4. TALLA (Size Chips) -->
    <div class="pb-5 border-b border-zinc-800/60">
      <button
        type="button"
        class="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-amber-400 py-1 transition-colors cursor-pointer"
        @click="toggleSection('sizes')"
      >
        <span>Talla</span>
        <ChevronUp v-if="openSections.sizes" class="w-4 h-4 text-zinc-500" />
        <ChevronDown v-else class="w-4 h-4 text-zinc-500" />
      </button>

      <div v-show="openSections.sizes" class="mt-3">
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="size in availableSizes"
            :key="size"
            type="button"
            :class="[
              'py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer',
              store.filters.sizes.includes(size)
                ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : 'bg-zinc-900/60 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white',
            ]"
            @click="store.toggleSize(size)"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <!-- 5. RATING MÍNIMO -->
    <div class="pb-5 border-b border-zinc-800/60">
      <button
        type="button"
        class="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-amber-400 py-1 transition-colors cursor-pointer"
        @click="toggleSection('rating')"
      >
        <span>Rating Mínimo</span>
        <ChevronUp v-if="openSections.rating" class="w-4 h-4 text-zinc-500" />
        <ChevronDown v-else class="w-4 h-4 text-zinc-500" />
      </button>

      <div v-show="openSections.rating" class="mt-3 space-y-1.5">
        <button
          v-for="stars in [4.5, 4.0, 3.0]"
          :key="stars"
          type="button"
          :class="[
            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer',
            store.filters.minRating === stars
              ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
              : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200',
          ]"
          @click="store.setMinRating(stars)"
        >
          <div class="flex items-center gap-1.5">
            <div class="flex text-amber-400">
              <Star
                v-for="s in 5"
                :key="s"
                :class="[
                  'w-3.5 h-3.5',
                  s <= Math.floor(stars)
                    ? 'fill-amber-400 text-amber-400'
                    : s - 0.5 <= stars
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-zinc-700',
                ]"
              />
            </div>
            <span class="text-[11px] font-medium">{{ stars }}+ estrellas</span>
          </div>
          <Check v-if="store.filters.minRating === stars" class="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>
    </div>

    <!-- 6. MARCA (Searchable Checkboxes) -->
    <div class="pb-5 border-b border-zinc-800/60">
      <button
        type="button"
        class="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-amber-400 py-1 transition-colors cursor-pointer"
        @click="toggleSection('brands')"
      >
        <span>Marca</span>
        <ChevronUp v-if="openSections.brands" class="w-4 h-4 text-zinc-500" />
        <ChevronDown v-else class="w-4 h-4 text-zinc-500" />
      </button>

      <div v-show="openSections.brands" class="mt-3 space-y-2">
        <!-- Brand search filter -->
        <div class="relative w-full">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            v-model="brandSearch"
            type="text"
            placeholder="Buscar marca..."
            class="w-full bg-[#111827] text-xs text-zinc-200 placeholder:text-zinc-500 rounded-lg pl-8 pr-2.5 py-1.5 border border-zinc-800 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <!-- Brands Checkbox List -->
        <div class="max-h-40 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          <label
            v-for="brand in filteredBrandsList"
            :key="brand.id"
            :class="[
              'flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors',
              store.brandFacetCounts[brand.name] === 0 && !store.filters.brands.includes(brand.name)
                ? 'text-zinc-600 opacity-40 hover:opacity-70'
                : 'text-zinc-300 hover:bg-zinc-800/40 opacity-100',
            ]"
          >
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="store.filters.brands.includes(brand.name)"
                class="w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-amber-500/20 cursor-pointer accent-amber-500"
                @change="store.toggleBrand(brand.name)"
              />
              <span>{{ brand.name }}</span>
            </div>
            <span class="text-[10px] font-mono text-zinc-500">
              {{ store.brandFacetCounts[brand.name] ?? 0 }}
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- 7. ESTADOS ESPECIALES (Toggles) -->
    <div>
      <button
        type="button"
        class="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-amber-400 py-1 transition-colors cursor-pointer"
        @click="toggleSection('special')"
      >
        <span>Ofertas & Stock</span>
        <ChevronUp v-if="openSections.special" class="w-4 h-4 text-zinc-500" />
        <ChevronDown v-else class="w-4 h-4 text-zinc-500" />
      </button>

      <div v-show="openSections.special" class="mt-3 space-y-2.5">
        <label class="flex items-center justify-between text-xs text-zinc-300 cursor-pointer p-1 rounded hover:bg-zinc-800/40">
          <span class="flex items-center gap-2">
            <Sparkles class="w-3.5 h-3.5 text-amber-400" />
            <span>Solo en Oferta</span>
          </span>
          <input
            type="checkbox"
            :checked="store.filters.onSaleOnly"
            class="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500 accent-amber-500 cursor-pointer"
            @change="store.toggleOnSaleOnly"
          />
        </label>

        <label class="flex items-center justify-between text-xs text-zinc-300 cursor-pointer p-1 rounded hover:bg-zinc-800/40">
          <span>Solo en Stock Inmediato</span>
          <input
            type="checkbox"
            :checked="store.filters.inStockOnly"
            class="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500 accent-amber-500 cursor-pointer"
            @change="store.toggleInStockOnly"
          />
        </label>
      </div>
    </div>
  </aside>
</template>
