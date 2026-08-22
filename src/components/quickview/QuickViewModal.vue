<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Product, ProductSize, ProductColor } from '@/types/catalog';
import ProductGallery from '@/components/quickview/ProductGallery.vue';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useScrollLock } from '@vueuse/core';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RefreshCw,
  ShieldCheck,
  Check,
  Minus,
  Plus,
} from 'lucide-vue-next';

interface Props {
  modelValue?: boolean;
  product: Product | null;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  product: null,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'add-to-cart': [
    payload: {
      product: Product;
      selectedColor: ProductColor;
      selectedSize: ProductSize;
      quantity: number;
    }
  ];
}>();

const wishlistStore = useWishlistStore();
const isLocked = useScrollLock(document.body);

const selectedColor = ref<ProductColor | null>(null);
const selectedSize = ref<ProductSize | null>(null);
const quantity = ref(1);
const isAdding = ref(false);
const showAddedSuccess = ref(false);

watch(
  () => props.modelValue,
  (isOpen) => {
    isLocked.value = isOpen;
    if (isOpen && props.product) {
      selectedColor.value = props.product.colors[0] || null;
      selectedSize.value = props.product.sizes[0] || null;
      quantity.value = 1;
      showAddedSuccess.value = false;
    }
  }
);

const isWishlisted = computed(() => {
  return props.product ? wishlistStore.isInWishlist(props.product.id) : false;
});

const handleClose = () => {
  emit('update:modelValue', false);
};

const handleAddToCart = () => {
  if (!props.product || !selectedColor.value || !selectedSize.value) return;

  isAdding.value = true;
  setTimeout(() => {
    emit('add-to-cart', {
      product: props.product!,
      selectedColor: selectedColor.value!,
      selectedSize: selectedSize.value!,
      quantity: quantity.value,
    });
    isAdding.value = false;
    showAddedSuccess.value = true;

    setTimeout(() => {
      showAddedSuccess.value = false;
    }, 2500);
  }, 400);
};

const incrementQuantity = () => {
  if (props.product && quantity.value < props.product.stockCount) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue && product"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        @click="handleClose"
      ></div>

      <!-- Modal Card (Strictly fixed height on desktop) -->
      <div
        class="relative w-full max-w-4xl h-auto md:h-[600px] bg-[#0e1420] border border-zinc-700/90 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.15)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Close Button -->
        <button
          type="button"
          class="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-full transition-colors cursor-pointer"
          aria-label="Cerrar modal"
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
          <!-- Left: Gallery (Edge-to-edge full bleed, 100% fixed height) -->
          <div class="relative h-72 md:h-full bg-[#090d15] border-b md:border-b-0 md:border-r border-zinc-800/80 overflow-hidden">
            <ProductGallery
              :images="product.images"
              :product-name="product.name"
            />
          </div>

          <!-- Right: Details & Purchase Options (Fixed height with scroll if needed) -->
          <div class="p-6 md:p-8 space-y-5 h-full overflow-y-auto flex flex-col justify-between custom-scrollbar">
            <!-- Header Information -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  {{ product.brand }}
                </span>
                <span class="text-zinc-600">•</span>
                <span class="text-xs text-zinc-400 capitalize">{{ product.category }}</span>
              </div>

              <h2 class="text-xl sm:text-2xl font-bold font-serif-luxury text-zinc-100">
                {{ product.name }}
              </h2>

              <!-- Rating & Reviews (Fractional Stars with Exact Mathematical Precision) -->
              <div class="flex items-center gap-2 text-xs text-zinc-300">
                <div class="flex items-center gap-0.5 text-amber-400">
                  <div
                    v-for="s in 5"
                    :key="s"
                    class="relative w-4 h-4"
                  >
                    <!-- Background Empty Star -->
                    <Star class="w-4 h-4 text-zinc-700/60 fill-zinc-800/80" />

                    <!-- Filled Golden Star Layer with Precise % Width -->
                    <div
                      class="absolute inset-0 overflow-hidden"
                      :style="{
                        width: `${Math.max(0, Math.min(100, (product.rating - (s - 1)) * 100))}%`
                      }"
                    >
                      <Star class="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                    </div>
                  </div>
                </div>
                <span class="font-bold text-zinc-100 ml-1 font-mono">{{ product.rating.toFixed(1) }}</span>
                <span class="text-zinc-500">({{ product.reviewsCount }} reseñas)</span>
              </div>

              <!-- Price Tag -->
              <div class="flex items-baseline gap-3 pt-2">
                <span class="text-2xl font-bold font-mono text-zinc-100">
                  €{{ product.price }}
                </span>
                <span
                  v-if="product.originalPrice"
                  class="text-sm text-zinc-500 line-through font-mono"
                >
                  €{{ product.originalPrice }}
                </span>
                <span
                  v-if="product.discountPercentage"
                  class="px-2 py-0.5 rounded-md bg-amber-500 text-black font-bold text-xs shadow-sm select-none"
                >
                  -{{ product.discountPercentage }}%
                </span>
              </div>

              <!-- Description Snippet -->
              <p class="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
                {{ product.description }}
              </p>
            </div>

            <!-- Selectors: Colors & Sizes -->
            <div class="space-y-4 pt-2 border-t border-zinc-800/80">
              <!-- Color Selector -->
              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>COLOR: <strong class="text-amber-400 font-normal">{{ selectedColor?.name }}</strong></span>
                </div>
                <div class="flex items-center gap-3">
                  <button
                    v-for="color in product.colors"
                    :key="color.id"
                    type="button"
                    :title="color.name"
                    :class="[
                      'relative w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center',
                      selectedColor?.id === color.id
                        ? 'border-amber-400 scale-110 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                        : 'border-zinc-700 hover:scale-105 hover:border-zinc-500',
                    ]"
                    :style="{ backgroundColor: color.hex }"
                    @click="selectedColor = color"
                  >
                    <Check
                      v-if="selectedColor?.id === color.id"
                      :class="[
                        'w-4 h-4 stroke-[3]',
                        color.id === 'blanco' || color.id === 'camel' ? 'text-black' : 'text-amber-300',
                      ]"
                    />
                  </button>
                </div>
              </div>

              <!-- Size Selector -->
              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>TALLA: <strong class="text-amber-400 font-normal">{{ selectedSize || 'Selecciona tu talla' }}</strong></span>
                  <button type="button" class="text-zinc-500 hover:text-amber-400 underline font-normal text-[11px]">
                    Guía de tallas
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="size in product.sizes"
                    :key="size"
                    type="button"
                    :class="[
                      'px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer min-w-10',
                      selectedSize === size
                        ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                        : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white',
                    ]"
                    @click="selectedSize = size"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- Quantity & Stock Status -->
              <div class="flex items-center justify-between pt-1">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-semibold text-zinc-300">CANTIDAD:</span>
                  <div class="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg">
                    <button
                      type="button"
                      :disabled="quantity <= 1"
                      class="p-1.5 text-zinc-400 hover:text-zinc-100 disabled:opacity-40 cursor-pointer"
                      @click="decrementQuantity"
                    >
                      <Minus class="w-3.5 h-3.5" />
                    </button>
                    <span class="px-3 text-xs font-mono font-bold text-zinc-100">{{ quantity }}</span>
                    <button
                      type="button"
                      :disabled="quantity >= product.stockCount"
                      class="p-1.5 text-zinc-400 hover:text-zinc-100 disabled:opacity-40 cursor-pointer"
                      @click="incrementQuantity"
                    >
                      <Plus class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>En stock ({{ product.stockCount }} uds)</span>
                </div>
              </div>
            </div>

            <!-- CTA Actions -->
            <div class="space-y-3 pt-2">
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  :disabled="isAdding"
                  :class="[
                    'flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer select-none',
                    showAddedSuccess
                      ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] active:scale-[0.98]',
                  ]"
                  @click="handleAddToCart"
                >
                  <Check v-if="showAddedSuccess" class="w-4 h-4 stroke-[3]" />
                  <ShoppingBag v-else class="w-4 h-4" />
                  <span>{{ showAddedSuccess ? '¡Añadido al Carrito!' : 'Añadir al Carrito' }}</span>
                </button>

                <button
                  type="button"
                  :class="[
                    'p-3.5 rounded-xl border transition-all cursor-pointer',
                    isWishlisted
                      ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700',
                  ]"
                  :title="isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'"
                  @click="wishlistStore.toggleWishlist(product.id)"
                >
                  <Heart :class="['w-5 h-5', isWishlisted ? 'fill-black' : '']" />
                </button>
              </div>

              <!-- Trust Badges Strip -->
              <div class="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400">
                <div class="flex items-center gap-1.5">
                  <Truck class="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span class="truncate">Envío gratis &gt;100€</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <RefreshCw class="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span class="truncate">30 días cambio</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <ShieldCheck class="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span class="truncate">Pago seguro SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
