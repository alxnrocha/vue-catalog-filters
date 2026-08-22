<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '@/stores/useCartStore';
import { useScrollLock } from '@vueuse/core';
import {
  X,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Truck,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
} from 'lucide-vue-next';

interface Props {
  modelValue?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'open-checkout': [];
}>();

const cartStore = useCartStore();
const isLocked = useScrollLock(document.body);
const inputCode = ref('');

const handleClose = () => {
  emit('update:modelValue', false);
  isLocked.value = false;
};

const handleApplyPromo = () => {
  if (inputCode.value.trim()) {
    cartStore.applyPromoCode(inputCode.value);
  }
};

const handleProceedToCheckout = () => {
  handleClose();
  emit('open-checkout');
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        @click="handleClose"
      ></div>

      <!-- Slide-over Drawer Panel -->
      <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          class="w-screen max-w-md bg-[#0e1420] border-l border-zinc-700/80 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          <!-- Drawer Header -->
          <div class="p-5 border-b border-zinc-800/80 flex items-center justify-between bg-[#0b0f17]">
            <div class="flex items-center gap-2.5">
              <ShoppingBag class="w-5 h-5 text-amber-400" />
              <h2 class="text-base font-bold font-serif-luxury tracking-wider text-zinc-100 uppercase">
                Bolsa de Compras
              </h2>
              <span
                v-if="cartStore.totalItemsCount > 0"
                class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs font-mono"
              >
                {{ cartStore.totalItemsCount }}
              </span>
            </div>

            <button
              type="button"
              class="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              @click="handleClose"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Free Shipping Progress Banner -->
          <div class="bg-[#121927] p-4 border-b border-zinc-800/60 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="flex items-center gap-1.5 font-medium text-zinc-200">
                <Truck class="w-4 h-4 text-amber-400" />
                <span v-if="cartStore.isFreeShipping" class="text-emerald-400 font-semibold">
                  ¡Tienes Envío Express Gratuito!
                </span>
                <span v-else>
                  Añade <strong class="text-amber-400 font-mono">€{{ cartStore.freeShippingRemaining }}</strong> más para envío gratis
                </span>
              </span>
              <span class="text-[11px] font-mono text-zinc-400">{{ cartStore.freeShippingProgress }}%</span>
            </div>

            <div class="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                :style="{ width: `${cartStore.freeShippingProgress}%` }"
              ></div>
            </div>
          </div>

          <!-- Items List / Empty State -->
          <div class="flex-1 overflow-y-auto p-5 space-y-4">
            <!-- Items -->
            <div v-if="cartStore.items.length > 0" class="space-y-3.5">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex gap-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all"
              >
                <!-- Image -->
                <img
                  :src="item.product.images[0]"
                  :alt="item.product.name"
                  class="w-18 aspect-[3/4] object-cover object-top rounded-lg bg-zinc-800 shrink-0"
                />

                <!-- Info -->
                <div class="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div class="flex items-start justify-between gap-2">
                      <h4 class="text-xs font-semibold text-zinc-100 line-clamp-1">
                        {{ item.product.name }}
                      </h4>
                      <button
                        type="button"
                        class="text-zinc-500 hover:text-red-400 transition-colors p-1"
                        title="Eliminar artículo"
                        @click="cartStore.removeItem(item.id)"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p class="text-[11px] text-amber-400/90 font-medium">{{ item.product.brand }}</p>

                    <!-- Variants pills -->
                    <div class="flex items-center gap-2 mt-1.5">
                      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700/60">
                        <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: item.selectedColor.hex }"></span>
                        <span>{{ item.selectedColor.name }}</span>
                      </span>
                      <span class="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono border border-zinc-700/60">
                        Talla: {{ item.selectedSize }}
                      </span>
                    </div>
                  </div>

                  <!-- Price & Quantity Stepper -->
                  <div class="flex items-center justify-between pt-2">
                    <span class="text-sm font-bold font-mono text-zinc-100">
                      €{{ item.unitPrice * item.quantity }}
                    </span>

                    <div class="flex items-center bg-zinc-950 border border-zinc-800 rounded-md">
                      <button
                        type="button"
                        class="p-1 text-zinc-400 hover:text-white"
                        @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                      >
                        <Minus class="w-3 h-3" />
                      </button>
                      <span class="px-2 text-xs font-mono font-bold text-zinc-200">{{ item.quantity }}</span>
                      <button
                        type="button"
                        class="p-1 text-zinc-400 hover:text-white"
                        @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                      >
                        <Plus class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-16 space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <ShoppingBag class="w-7 h-7" />
              </div>
              <div class="space-y-1">
                <h4 class="text-sm font-semibold text-zinc-200">Tu bolsa de compras está vacía</h4>
                <p class="text-xs text-zinc-500 max-w-xs mx-auto">
                  Descubre piezas atemporales de diseñador en nuestro catálogo exclusivo.
                </p>
              </div>
              <button
                type="button"
                class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                @click="handleClose"
              >
                Explorar Catálogo
              </button>
            </div>
          </div>

          <!-- Drawer Footer: Promo & Summary & Checkout -->
          <div v-if="cartStore.items.length > 0" class="p-5 border-t border-zinc-800/80 bg-[#090d15] space-y-4">
            <!-- Promo Code Input -->
            <div>
              <div v-if="!cartStore.promoCode" class="flex gap-2">
                <div class="relative flex-1">
                  <Tag class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    v-model="inputCode"
                    type="text"
                    placeholder="Código promocional (ej: AURELIA20)"
                    class="w-full bg-[#111827] text-xs text-zinc-100 placeholder:text-zinc-500 rounded-lg pl-8 pr-3 py-2 border border-zinc-800 focus:outline-none focus:border-amber-500/60 uppercase"
                    @keydown.enter.prevent="handleApplyPromo"
                  />
                </div>
                <button
                  type="button"
                  class="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer"
                  @click="handleApplyPromo"
                >
                  Aplicar
                </button>
              </div>

              <!-- Promo Code Applied Banner -->
              <div v-else class="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
                <div class="flex items-center gap-1.5 text-amber-300 font-medium">
                  <Sparkles class="w-3.5 h-3.5 text-amber-400" />
                  <span>Cupón <strong>{{ cartStore.promoCode }}</strong> (-{{ cartStore.appliedDiscountPercent }}%)</span>
                </div>
                <button
                  type="button"
                  class="text-zinc-500 hover:text-red-400 p-1"
                  title="Quitar cupón"
                  @click="cartStore.removePromoCode"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>

              <p v-if="cartStore.promoError" class="text-[11px] text-red-400 mt-1">{{ cartStore.promoError }}</p>
              <p v-else-if="cartStore.promoSuccess" class="text-[11px] text-emerald-400 mt-1">{{ cartStore.promoSuccess }}</p>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-1.5 text-xs border-t border-zinc-800/60 pt-3">
              <div class="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span class="font-mono text-zinc-200">€{{ cartStore.subtotal }}</span>
              </div>

              <div v-if="cartStore.discountAmount > 0" class="flex justify-between text-amber-400 font-medium">
                <span>Descuento aplicado</span>
                <span class="font-mono">-€{{ cartStore.discountAmount }}</span>
              </div>

              <div class="flex justify-between text-zinc-400">
                <span>Envío express</span>
                <span class="font-mono text-zinc-200">
                  {{ cartStore.isFreeShipping ? 'GRATIS' : '€15' }}
                </span>
              </div>

              <div class="flex justify-between text-sm font-bold text-zinc-100 pt-2 border-t border-zinc-800/80">
                <span>Total estimado</span>
                <span class="text-base font-mono text-amber-400">€{{ cartStore.totalAmount }}</span>
              </div>
            </div>

            <!-- Checkout CTA Button -->
            <button
              type="button"
              class="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.55)] flex items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-[0.98]"
              @click="handleProceedToCheckout"
            >
              <span>Tramitar Pedido</span>
              <ArrowRight class="w-4 h-4" />
            </button>

            <!-- Trust Badge -->
            <div class="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
              <ShieldCheck class="w-3.5 h-3.5 text-amber-400" />
              <span>Pago seguro garantizado con cifrado SSL de 256 bits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
