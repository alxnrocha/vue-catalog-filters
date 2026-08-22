<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { Search, X, Clock, ArrowRight, Sparkles, Tag, ShoppingBag } from 'lucide-vue-next';
import { useCatalogStore } from '@/stores/useCatalogStore';
import { useLocalStorage, useScrollLock } from '@vueuse/core';
import type { Product } from '@/types/catalog';

interface Props {
  modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'select-product': [product: Product];
}>();

const store = useCatalogStore();
const searchInputRef = ref<HTMLInputElement | null>(null);
const localQuery = ref('');
const recentSearches = useLocalStorage<string[]>('aurelia-recent-searches', [
  'Bomber',
  'Blazer',
  'Acne Studios',
  'Cashmere',
]);

const isLocked = useScrollLock(document.body);

watch(
  () => props.modelValue,
  (isOpen) => {
    isLocked.value = isOpen;
    if (isOpen) {
      localQuery.value = store.filters.search;
      nextTick(() => {
        searchInputRef.value?.focus();
      });
    }
  }
);

const matchingProducts = computed(() => {
  if (!localQuery.value.trim()) return [];
  const q = localQuery.value.toLowerCase().trim();
  return store.products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
    .slice(0, 5);
});

const matchingBrands = computed(() => {
  if (!localQuery.value.trim()) return [];
  const q = localQuery.value.toLowerCase().trim();
  const allBrands = Array.from(new Set(store.products.map((p) => p.brand)));
  return allBrands.filter((b) => b.toLowerCase().includes(q));
});

const handleClose = () => {
  emit('update:modelValue', false);
};

const handleSelectQuery = (query: string) => {
  if (query.trim() && !recentSearches.value.includes(query.trim())) {
    recentSearches.value = [query.trim(), ...recentSearches.value.slice(0, 5)];
  }
  store.setSearch(query.trim());
  handleClose();
};

const handleClearRecent = () => {
  recentSearches.value = [];
};

const handleSelectProduct = (product: Product) => {
  emit('select-product', product);
  handleClose();
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    handleClose();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  isLocked.value = false;
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop with blur -->
      <div
        class="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        @click="handleClose"
      ></div>

      <!-- Modal Card -->
      <div
        class="relative w-full max-w-2xl bg-[#0e1420] border border-zinc-700/80 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_40px_rgba(245,158,11,0.1)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Search Header -->
        <div class="relative flex items-center border-b border-zinc-800/80 p-4">
          <Search class="w-5 h-5 text-amber-400 shrink-0 ml-1 mr-3" />
          <input
            ref="searchInputRef"
            v-model="localQuery"
            type="text"
            placeholder="Buscar prendas, diseñadores, categorías..."
            class="w-full bg-transparent text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            @keydown.enter="handleSelectQuery(localQuery)"
          />
          <button
            v-if="localQuery"
            type="button"
            class="p-1 text-zinc-400 hover:text-zinc-200 rounded mr-2"
            @click="localQuery = ''"
          >
            <X class="w-4 h-4" />
          </button>
          <kbd
            class="hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-zinc-800 text-zinc-400 border border-zinc-700 rounded"
          >
            ESC
          </kbd>
        </div>

        <!-- Search Content -->
        <div class="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          <!-- Live Matching Products -->
          <div v-if="matchingProducts.length > 0" class="space-y-2">
            <div class="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span class="flex items-center gap-1.5">
                <ShoppingBag class="w-3.5 h-3.5 text-amber-400" />
                <span>Productos Encontrados</span>
              </span>
              <span class="text-zinc-500">{{ matchingProducts.length }} sugerencias</span>
            </div>

            <div class="grid grid-cols-1 gap-2">
              <div
                v-for="product in matchingProducts"
                :key="product.id"
                class="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-zinc-800/60 border border-transparent hover:border-zinc-700/60 transition-all cursor-pointer group"
                @click="handleSelectProduct(product)"
              >
                <img
                  :src="product.images[0]"
                  :alt="product.name"
                  class="w-12 aspect-[3/4] object-cover object-top rounded-lg bg-zinc-800 shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-amber-400/90 font-medium">{{ product.brand }}</p>
                  <h4 class="text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors truncate">
                    {{ product.name }}
                  </h4>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-xs font-bold text-zinc-200">€{{ product.price }}</span>
                    <span
                      v-if="product.originalPrice"
                      class="text-[11px] text-zinc-500 line-through"
                    >
                      €{{ product.originalPrice }}
                    </span>
                    <span
                      v-if="product.discountPercentage"
                      class="text-[10px] px-1.5 py-0.5 bg-amber-500 text-black rounded font-bold shadow-sm"
                    >
                      -{{ product.discountPercentage }}%
                    </span>
                  </div>
                </div>
                <ArrowRight class="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </div>
          </div>

          <!-- Matching Brands -->
          <div v-if="matchingBrands.length > 0" class="space-y-2">
            <div class="px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Tag class="w-3.5 h-3.5 text-amber-400" />
              <span>Marcas</span>
            </div>
            <div class="flex flex-wrap gap-2 px-2">
              <button
                v-for="brand in matchingBrands"
                :key="brand"
                type="button"
                class="px-3 py-1.5 bg-zinc-800/80 hover:bg-amber-500/20 hover:text-amber-300 border border-zinc-700/60 rounded-lg text-xs text-zinc-200 transition-colors cursor-pointer"
                @click="handleSelectQuery(brand)"
              >
                {{ brand }}
              </button>
            </div>
          </div>

          <!-- Recent Searches (When query is empty) -->
          <div v-if="!localQuery && recentSearches.length > 0" class="space-y-3">
            <div class="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <span class="flex items-center gap-1.5">
                <Clock class="w-3.5 h-3.5 text-zinc-400" />
                <span>Búsquedas Recientes</span>
              </span>
              <button
                type="button"
                class="text-[11px] text-zinc-500 hover:text-zinc-300 normal-case font-normal"
                @click="handleClearRecent"
              >
                Limpiar historial
              </button>
            </div>
            <div class="flex flex-wrap gap-2 px-2">
              <button
                v-for="term in recentSearches"
                :key="term"
                type="button"
                class="px-3 py-1.5 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs border border-zinc-700/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                @click="handleSelectQuery(term)"
              >
                <Search class="w-3 h-3 text-zinc-500" />
                <span>{{ term }}</span>
              </button>
            </div>
          </div>

          <!-- Quick Categories (When query is empty) -->
          <div v-if="!localQuery" class="space-y-3 pt-2 border-t border-zinc-800/60">
            <div class="px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-amber-400" />
              <span>Colecciones Populares</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 px-2">
              <button
                type="button"
                class="p-2.5 bg-zinc-800/40 hover:bg-zinc-800/90 text-left rounded-xl border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer group"
                @click="store.setCategory('chaquetas'); handleClose()"
              >
                <p class="text-xs font-semibold text-zinc-200 group-hover:text-amber-300">Chaquetas & Abrigos</p>
                <p class="text-[11px] text-zinc-500">6 modelos exclusivos</p>
              </button>

              <button
                type="button"
                class="p-2.5 bg-zinc-800/40 hover:bg-zinc-800/90 text-left rounded-xl border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer group"
                @click="store.setCategory('camisetas'); handleClose()"
              >
                <p class="text-xs font-semibold text-zinc-200 group-hover:text-amber-300">Camisetas & Tops</p>
                <p class="text-[11px] text-zinc-500">5 modelos exclusivos</p>
              </button>

              <button
                type="button"
                class="p-2.5 bg-zinc-800/40 hover:bg-zinc-800/90 text-left rounded-xl border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer group"
                @click="store.setCategory('calzado'); handleClose()"
              >
                <p class="text-xs font-semibold text-zinc-200 group-hover:text-amber-300">Calzado & Botas</p>
                <p class="text-[11px] text-zinc-500">3 modelos exclusivos</p>
              </button>
            </div>
          </div>

          <!-- Empty match state -->
          <div
            v-if="localQuery && matchingProducts.length === 0 && matchingBrands.length === 0"
            class="text-center py-8 space-y-2"
          >
            <p class="text-sm font-medium text-zinc-300">No encontramos resultados para "{{ localQuery }}"</p>
            <p class="text-xs text-zinc-500">Intenta buscar por marcas como Acne Studios, Balenciaga o Totême.</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="border-t border-zinc-800/80 px-4 py-3 bg-[#0a0f18] flex items-center justify-between text-xs text-zinc-500">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-zinc-800 rounded font-mono text-[10px]">↵</kbd>
              <span>Buscar</span>
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-zinc-800 rounded font-mono text-[10px]">esc</kbd>
              <span>Cerrar</span>
            </span>
          </div>
          <span class="text-amber-500/80 font-serif-luxury tracking-wider">AURELIA ATELIER</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>
