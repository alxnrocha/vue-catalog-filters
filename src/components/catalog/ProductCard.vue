<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product, ViewMode } from '@/types/catalog';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { Heart, Eye, Star, ShoppingBag } from 'lucide-vue-next';

interface Props {
  product: Product;
  viewMode?: ViewMode;
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid',
});

const emit = defineEmits<{
  'quick-view': [product: Product];
}>();

const wishlistStore = useWishlistStore();

const activeImageIndex = ref(0);
const isHovered = ref(false);
const activeColorIndex = ref(0);

const currentImage = computed(() => {
  if (isHovered.value && props.product.images.length > 1) {
    return props.product.images[1];
  }
  return props.product.images[activeImageIndex.value] || props.product.images[0];
});

const isWishlisted = computed(() => wishlistStore.isInWishlist(props.product.id));

const handleToggleWishlist = (e: MouseEvent) => {
  e.stopPropagation();
  wishlistStore.toggleWishlist(props.product.id);
};

const handleQuickView = (e?: MouseEvent) => {
  if (e && typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  }
  emit('quick-view', props.product);
};

const handleSelectColor = (index: number, e: MouseEvent) => {
  e.stopPropagation();
  activeColorIndex.value = index;
  if (props.product.images[index]) {
    activeImageIndex.value = index;
  }
};
</script>

<template>
  <!-- GRID VIEW CARD -->
  <div
    v-if="viewMode === 'grid'"
    class="group relative rounded-2xl glass-card border border-zinc-800/80 hover:border-amber-500/40 p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.1)] cursor-pointer"
    @click="handleQuickView"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Top Image Container -->
    <div class="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-900/80 mb-3.5">
      <!-- Discount / New Badge -->
      <div class="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        <span
          v-if="product.discountPercentage"
          class="px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 font-bold text-[11px] border border-amber-500/40 backdrop-blur-md shadow-sm"
        >
          -{{ product.discountPercentage }}%
        </span>
        <span
          v-else-if="product.isNew"
          class="px-2 py-0.5 rounded-md bg-zinc-900/80 text-zinc-200 font-semibold text-[10px] uppercase tracking-wider border border-zinc-700/60 backdrop-blur-md"
        >
          Novedad
        </span>
      </div>

      <!-- Wishlist Action Button -->
      <button
        type="button"
        :class="[
          'absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md',
          isWishlisted
            ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-105'
            : 'bg-zinc-900/70 text-zinc-300 hover:text-white hover:bg-zinc-800/90 border border-zinc-700/50',
        ]"
        :title="isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'"
        @click="handleToggleWishlist"
      >
        <Heart :class="['w-4 h-4 transition-transform active:scale-125', isWishlisted ? 'fill-black' : '']" />
      </button>

      <!-- Main Product Photo with Zoom -->
      <img
        :src="currentImage"
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />

      <!-- Floating Quick View Button on Hover -->
      <button
        type="button"
        class="absolute bottom-3 right-3 z-10 p-2.5 rounded-full bg-zinc-950/80 text-zinc-200 hover:text-amber-400 hover:bg-zinc-900 border border-zinc-700/80 backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer"
        title="Vista rápida"
        @click="handleQuickView"
      >
        <Eye class="w-4 h-4" />
      </button>
    </div>

    <!-- Details Body -->
    <div class="space-y-2">
      <!-- Color Variants Dots -->
      <div class="flex items-center gap-1.5 pt-0.5">
        <button
          v-for="(color, idx) in product.colors"
          :key="color.id"
          type="button"
          :title="color.name"
          :class="[
            'w-3.5 h-3.5 rounded-full border transition-all cursor-pointer',
            activeColorIndex === idx
              ? 'border-amber-400 scale-125 shadow-[0_0_6px_rgba(245,158,11,0.8)]'
              : 'border-zinc-700/80 hover:scale-110',
          ]"
          :style="{ backgroundColor: color.hex }"
          @click="(e) => handleSelectColor(idx, e)"
        ></button>
      </div>

      <!-- Title & Brand -->
      <div>
        <h3 class="text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1">
          {{ product.name }}
        </h3>
        <p class="text-xs text-zinc-400 font-medium mt-0.5">
          {{ product.brand }}
        </p>
      </div>

      <!-- Price & Rating Row -->
      <div class="flex items-center justify-between pt-1 border-t border-zinc-800/60">
        <div class="flex items-baseline gap-2">
          <span class="text-sm sm:text-base font-bold font-mono text-zinc-100">
            €{{ product.price }}
          </span>
          <span
            v-if="product.originalPrice"
            class="text-xs text-zinc-500 line-through font-mono"
          >
            €{{ product.originalPrice }}
          </span>
        </div>

        <div class="flex items-center gap-1 text-xs text-zinc-400">
          <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span class="font-semibold text-zinc-200">{{ product.rating.toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- LIST VIEW CARD -->
  <div
    v-else
    class="group relative rounded-2xl glass-card border border-zinc-800/80 hover:border-amber-500/40 p-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.7)] cursor-pointer"
    @click="handleQuickView"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Left: Image & Badge -->
    <div class="relative w-full sm:w-44 aspect-[3/4] sm:aspect-square rounded-xl overflow-hidden bg-zinc-900/80 shrink-0">
      <span
        v-if="product.discountPercentage"
        class="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 font-bold text-[11px] border border-amber-500/40 backdrop-blur-md"
      >
        -{{ product.discountPercentage }}%
      </span>

      <img
        :src="currentImage"
        :alt="product.name"
        loading="lazy"
        class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
    </div>

    <!-- Center: Details -->
    <div class="flex-1 space-y-2.5 min-w-0">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-amber-400/90 uppercase tracking-wider">{{ product.brand }}</span>
        <span class="text-zinc-600">•</span>
        <span class="text-xs text-zinc-400 capitalize">{{ product.category }}</span>
      </div>

      <h3 class="text-base sm:text-lg font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors">
        {{ product.name }}
      </h3>

      <p class="text-xs text-zinc-400 leading-relaxed line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Sizes & Colors Swatches -->
      <div class="flex flex-wrap items-center gap-4 pt-1">
        <div class="flex items-center gap-1.5">
          <span class="text-[11px] text-zinc-500">Colores:</span>
          <div class="flex items-center gap-1">
            <span
              v-for="color in product.colors"
              :key="color.id"
              class="w-3 h-3 rounded-full border border-zinc-700"
              :style="{ backgroundColor: color.hex }"
            ></span>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <span class="text-[11px] text-zinc-500">Tallas:</span>
          <div class="flex gap-1">
            <span
              v-for="size in product.sizes"
              :key="size"
              class="px-1.5 py-0.5 bg-zinc-900 text-zinc-400 rounded text-[10px] border border-zinc-800"
            >
              {{ size }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Price & Actions CTA -->
    <div class="w-full sm:w-48 sm:border-l sm:border-zinc-800 sm:pl-6 space-y-3 shrink-0 flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-1 text-xs text-zinc-400 mb-1">
          <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span class="font-semibold text-zinc-200">{{ product.rating.toFixed(1) }}</span>
          <span class="text-zinc-500">({{ product.reviewsCount }})</span>
        </div>

        <div class="flex items-baseline gap-2">
          <span class="text-xl font-bold font-mono text-zinc-100">€{{ product.price }}</span>
          <span v-if="product.originalPrice" class="text-xs text-zinc-500 line-through font-mono">
            €{{ product.originalPrice }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          @click="handleQuickView"
        >
          <ShoppingBag class="w-3.5 h-3.5" />
          <span>Ver Prenda</span>
        </button>

        <button
          type="button"
          :class="[
            'p-2 rounded-lg border transition-colors cursor-pointer',
            isWishlisted
              ? 'bg-amber-500 text-black border-amber-400'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700',
          ]"
          @click="handleToggleWishlist"
        >
          <Heart :class="['w-4 h-4', isWishlisted ? 'fill-black' : '']" />
        </button>
      </div>
    </div>
  </div>
</template>
