<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Search, Heart, ShoppingBag, User, Menu, X, Sparkles } from 'lucide-vue-next';

interface Props {
  searchQuery?: string;
  cartCount?: number;
  wishlistCount?: number;
}

withDefaults(defineProps<Props>(), {
  searchQuery: '',
  cartCount: 0,
  wishlistCount: 0,
});

const emit = defineEmits<{
  'update:searchQuery': [value: string];
  'open-cart': [];
  'open-wishlist': [];
  'open-search-modal': [];
  'open-mobile-menu': [];
}>();

const mobileNavOpen = ref(false);
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const handleSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:searchQuery', target.value);
};

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    emit('open-search-modal');
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <header
    :class="[
      'sticky top-0 z-40 w-full transition-all duration-300 border-b',
      isScrolled
        ? 'bg-[#0b0f17]/90 backdrop-blur-md border-zinc-800/80 shadow-lg shadow-black/40'
        : 'bg-[#0b0f17] border-zinc-800/40',
    ]"
  >
    <!-- Top announcement banner -->
    <div class="bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border-b border-amber-500/20 py-1.5 px-4 text-center text-xs text-amber-200/90 flex items-center justify-center gap-2">
      <Sparkles class="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>Envío express gratuito en todos los pedidos superiores a <strong class="text-amber-400 font-semibold">100€</strong></span>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 lg:gap-8">
      <!-- Left: Brand Logo -->
      <div class="flex items-center gap-6 shrink-0">
        <a href="#/" class="group flex items-center gap-2.5">
          <span class="text-2xl font-bold tracking-[0.2em] font-serif-luxury bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            AURELIA
          </span>
          <span class="hidden xl:inline-block text-[10px] uppercase tracking-widest text-amber-500/70 border-l border-zinc-800 pl-2.5">
            Atelier
          </span>
        </a>
      </div>

      <!-- Center: Search bar with shortcut -->
      <div class="hidden md:flex flex-1 max-w-xl">
        <div class="relative w-full group">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-400 transition-colors pointer-events-none" />
          <input
            type="text"
            :value="searchQuery"
            placeholder="Buscar productos, marcas, categorías..."
            class="w-full bg-[#111827]/90 text-sm text-zinc-100 placeholder:text-zinc-500 rounded-full pl-10 pr-16 py-2 border border-zinc-800 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all"
            @input="handleSearchInput"
            @keydown.enter="emit('open-search-modal')"
          />
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
            title="Atajo de búsqueda rápida"
            @click="emit('open-search-modal')"
          >
            <span>⌘</span>
            <span>K</span>
          </button>
        </div>
      </div>

      <!-- Right: Navigation links & Actions -->
      <div class="flex items-center gap-5 lg:gap-7">
        <!-- Desktop Nav Links -->
        <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <a href="#/" class="hover:text-amber-400 transition-colors">Novedades</a>
          <a href="#/" class="hover:text-amber-400 transition-colors">Mujer</a>
          <a href="#/" class="hover:text-amber-400 transition-colors">Hombre</a>
          <a href="#/" class="hover:text-amber-400 transition-colors">Marcas</a>
          <a href="#/" class="text-amber-400 font-semibold flex items-center gap-1 hover:text-amber-300 transition-colors">
            <span>Sale</span>
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          </a>
        </nav>

        <div class="h-4 w-px bg-zinc-800 hidden lg:block"></div>

        <!-- Action Icons -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Mobile Search Trigger -->
          <button
            type="button"
            class="md:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-full transition-colors"
            aria-label="Abrir búsqueda"
            @click="emit('open-search-modal')"
          >
            <Search class="w-5 h-5" />
          </button>

          <!-- User Account -->
          <button
            type="button"
            class="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-full transition-colors"
            aria-label="Mi Cuenta"
          >
            <User class="w-5 h-5" />
          </button>

          <!-- Wishlist -->
          <button
            type="button"
            class="relative p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-full transition-colors"
            aria-label="Favoritos"
            @click="emit('open-wishlist')"
          >
            <Heart class="w-5 h-5" />
            <span
              v-if="wishlistCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center leading-none"
            >
              {{ wishlistCount }}
            </span>
          </button>

          <!-- Cart Bag -->
          <button
            type="button"
            class="relative p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-full transition-colors group"
            aria-label="Carrito de compras"
            @click="emit('open-cart')"
          >
            <ShoppingBag class="w-5 h-5 text-zinc-300 group-hover:text-amber-400 transition-colors" />
            <span
              class="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            >
              {{ cartCount }}
            </span>
          </button>

          <!-- Mobile Hamburger -->
          <button
            type="button"
            class="lg:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-lg transition-colors"
            aria-label="Menu"
            @click="mobileNavOpen = !mobileNavOpen"
          >
            <X v-if="mobileNavOpen" class="w-6 h-6" />
            <Menu v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Nav Dropdown -->
    <div
      v-if="mobileNavOpen"
      class="lg:hidden bg-[#0b0f17]/95 backdrop-blur-lg border-t border-zinc-800 px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top-2"
    >
      <div class="relative w-full mb-4">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          :value="searchQuery"
          placeholder="Buscar marcas o prendas..."
          class="w-full bg-[#111827] text-sm text-zinc-100 placeholder:text-zinc-500 rounded-lg pl-10 pr-4 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500/60"
          @input="handleSearchInput"
        />
      </div>

      <nav class="flex flex-col gap-3 text-base font-medium text-zinc-200">
        <a href="#/" class="py-2 border-b border-zinc-800/50 hover:text-amber-400" @click="mobileNavOpen = false">Novedades</a>
        <a href="#/" class="py-2 border-b border-zinc-800/50 hover:text-amber-400" @click="mobileNavOpen = false">Mujer</a>
        <a href="#/" class="py-2 border-b border-zinc-800/50 hover:text-amber-400" @click="mobileNavOpen = false">Hombre</a>
        <a href="#/" class="py-2 border-b border-zinc-800/50 hover:text-amber-400" @click="mobileNavOpen = false">Marcas</a>
        <a href="#/" class="py-2 text-amber-400 font-semibold flex items-center justify-between" @click="mobileNavOpen = false">
          <span>Colección Sale</span>
          <span class="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">-20%</span>
        </a>
      </nav>
    </div>
  </header>
</template>
