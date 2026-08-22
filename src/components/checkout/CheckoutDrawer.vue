<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useCartStore } from '@/stores/useCartStore';
import { useScrollLock } from '@vueuse/core';
import {
  X,
  Lock,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Package,
} from 'lucide-vue-next';

interface Props {
  modelValue?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'order-completed': [orderId: string];
}>();

const cartStore = useCartStore();
const isLocked = useScrollLock(document.body);

const currentStep = ref<1 | 2 | 3>(1);
const isProcessing = ref(false);
const confirmedOrderId = ref('');

// Form state
const formData = reactive({
  name: 'Elena Rostova',
  email: 'elena.rostova@atelier-luxury.com',
  phone: '+34 612 345 678',
  address: 'Paseo de Gracia, 42, 3º 1ª',
  postalCode: '08007',
  city: 'Barcelona',
  country: 'España',
  shippingMethod: 'express',
  paymentMethod: 'card',
  cardNumber: '•••• •••• •••• 8842',
  cardExpiry: '08/29',
  cardCvc: '•••',
});

const errors = reactive<Record<string, string>>({});

const validateStep1 = () => {
  errors.name = '';
  errors.email = '';
  errors.address = '';
  errors.city = '';
  errors.postalCode = '';

  let isValid = true;
  if (!formData.name.trim()) {
    errors.name = 'El nombre completo es obligatorio';
    isValid = false;
  }
  if (!formData.email.trim() || !formData.email.includes('@')) {
    errors.email = 'Introduce un email válido';
    isValid = false;
  }
  if (!formData.address.trim()) {
    errors.address = 'La dirección es obligatoria';
    isValid = false;
  }
  if (!formData.city.trim()) {
    errors.city = 'La ciudad es obligatoria';
    isValid = false;
  }
  if (!formData.postalCode.trim()) {
    errors.postalCode = 'El código postal es obligatorio';
    isValid = false;
  }

  return isValid;
};

const handleNextStep = () => {
  if (currentStep.value === 1) {
    if (validateStep1()) {
      currentStep.value = 2;
    }
  } else if (currentStep.value === 2) {
    // Process simulated order
    isProcessing.value = true;
    setTimeout(() => {
      confirmedOrderId.value = `AUR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      currentStep.value = 3;
      isProcessing.value = false;
      cartStore.clearCart();
      emit('order-completed', confirmedOrderId.value);
    }, 1200);
  }
};

const handleClose = () => {
  emit('update:modelValue', false);
  isLocked.value = false;
  if (currentStep.value === 3) {
    currentStep.value = 1;
  }
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
        class="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        @click="handleClose"
      ></div>

      <!-- Slide-over Drawer Panel -->
      <div class="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          class="w-screen max-w-lg bg-[#0e1420] border-l border-zinc-700/80 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          <!-- Drawer Header with Step Indicators -->
          <div class="p-5 border-b border-zinc-800/80 bg-[#0b0f17]">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <Lock class="w-4 h-4 text-amber-400" />
                <h2 class="text-sm font-bold font-serif-luxury tracking-wider text-zinc-100 uppercase">
                  Tramitación Segura Atelier
                </h2>
              </div>
              <button
                type="button"
                class="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                @click="handleClose"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Steps Breadcrumb Bar -->
            <div class="grid grid-cols-3 gap-2 text-center text-xs font-semibold select-none">
              <div
                :class="[
                  'py-1.5 rounded-lg border transition-all',
                  currentStep === 1
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : currentStep > 1
                    ? 'bg-zinc-900 text-emerald-400 border-zinc-800'
                    : 'text-zinc-600 border-zinc-800/50',
                ]"
              >
                1. Envío
              </div>
              <div
                :class="[
                  'py-1.5 rounded-lg border transition-all',
                  currentStep === 2
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : currentStep > 2
                    ? 'bg-zinc-900 text-emerald-400 border-zinc-800'
                    : 'text-zinc-600 border-zinc-800/50',
                ]"
              >
                2. Pago
              </div>
              <div
                :class="[
                  'py-1.5 rounded-lg border transition-all',
                  currentStep === 3
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'text-zinc-600 border-zinc-800/50',
                ]"
              >
                3. Confirmación
              </div>
            </div>
          </div>

          <!-- Drawer Body Content -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <!-- STEP 1: DIRECCIÓN Y CONTACTO -->
            <div v-if="currentStep === 1" class="space-y-4">
              <div class="space-y-1">
                <h3 class="text-base font-bold text-zinc-100 font-serif-luxury">Datos de Entrega</h3>
                <p class="text-xs text-zinc-400">Por favor, introduce la dirección donde deseas recibir tu pedido.</p>
              </div>

              <div class="space-y-3 pt-2">
                <!-- Name -->
                <div>
                  <label class="block text-xs font-semibold text-zinc-300 mb-1">Nombre Completo</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    class="w-full bg-[#111827] text-xs text-zinc-100 rounded-lg px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500/60"
                  />
                  <p v-if="errors.name" class="text-[11px] text-red-400 mt-1">{{ errors.name }}</p>
                </div>

                <!-- Email & Phone -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">Email</label>
                    <input
                      v-model="formData.email"
                      type="email"
                      class="w-full bg-[#111827] text-xs text-zinc-100 rounded-lg px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500/60"
                    />
                    <p v-if="errors.email" class="text-[11px] text-red-400 mt-1">{{ errors.email }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">Teléfono</label>
                    <input
                      v-model="formData.phone"
                      type="tel"
                      class="w-full bg-[#111827] text-xs text-zinc-100 rounded-lg px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>

                <!-- Address -->
                <div>
                  <label class="block text-xs font-semibold text-zinc-300 mb-1">Dirección Postal</label>
                  <input
                    v-model="formData.address"
                    type="text"
                    class="w-full bg-[#111827] text-xs text-zinc-100 rounded-lg px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500/60"
                  />
                  <p v-if="errors.address" class="text-[11px] text-red-400 mt-1">{{ errors.address }}</p>
                </div>

                <!-- Postal code, City, Country -->
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">C.P.</label>
                    <input
                      v-model="formData.postalCode"
                      type="text"
                      class="w-full bg-[#111827] text-xs text-zinc-100 rounded-lg px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">Ciudad</label>
                    <input
                      v-model="formData.city"
                      type="text"
                      class="w-full bg-[#111827] text-xs text-zinc-100 rounded-lg px-3 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">País</label>
                    <input
                      v-model="formData.country"
                      type="text"
                      disabled
                      class="w-full bg-[#0a0f18] text-xs text-zinc-400 rounded-lg px-3 py-2.5 border border-zinc-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 2: MÉTODO DE PAGO Y RESUMEN -->
            <div v-else-if="currentStep === 2" class="space-y-5">
              <div class="space-y-1">
                <h3 class="text-base font-bold text-zinc-100 font-serif-luxury">Método de Pago Seguro</h3>
                <p class="text-xs text-zinc-400">Selecciona tu forma de abono preferida.</p>
              </div>

              <!-- Payment Selectors -->
              <div class="space-y-3 pt-2">
                <label
                  :class="[
                    'flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all',
                    formData.paymentMethod === 'card'
                      ? 'bg-amber-500/10 border-amber-500/60'
                      : 'bg-zinc-900/60 border-zinc-800',
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <CreditCard class="w-5 h-5 text-amber-400" />
                    <div>
                      <p class="text-xs font-bold text-zinc-100">Tarjeta de Crédito / Débito</p>
                      <p class="text-[11px] text-zinc-400">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                  <input
                    v-model="formData.paymentMethod"
                    type="radio"
                    value="card"
                    class="accent-amber-500"
                  />
                </label>

                <!-- Card inputs simulation -->
                <div v-if="formData.paymentMethod === 'card'" class="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
                  <div>
                    <label class="block text-[11px] font-medium text-zinc-400 mb-1">Número de Tarjeta</label>
                    <input
                      v-model="formData.cardNumber"
                      type="text"
                      class="w-full bg-[#111827] text-xs text-zinc-100 font-mono rounded-lg px-3 py-2 border border-zinc-800"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] font-medium text-zinc-400 mb-1">Caducidad</label>
                      <input
                        v-model="formData.cardExpiry"
                        type="text"
                        class="w-full bg-[#111827] text-xs text-zinc-100 font-mono rounded-lg px-3 py-2 border border-zinc-800"
                      />
                    </div>
                    <div>
                      <label class="block text-[11px] font-medium text-zinc-400 mb-1">CVC</label>
                      <input
                        v-model="formData.cardCvc"
                        type="password"
                        class="w-full bg-[#111827] text-xs text-zinc-100 font-mono rounded-lg px-3 py-2 border border-zinc-800"
                      />
                    </div>
                  </div>
                </div>

                <label
                  :class="[
                    'flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all',
                    formData.paymentMethod === 'apple'
                      ? 'bg-amber-500/10 border-amber-500/60'
                      : 'bg-zinc-900/60 border-zinc-800',
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-zinc-100"> Apple Pay / Google Pay</span>
                  </div>
                  <input
                    v-model="formData.paymentMethod"
                    type="radio"
                    value="apple"
                    class="accent-amber-500"
                  />
                </label>
              </div>

              <!-- Order Mini Summary -->
              <div class="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div class="flex items-center justify-between text-xs text-zinc-300">
                  <span>Envío a:</span>
                  <span class="font-medium text-zinc-100">{{ formData.name }}, {{ formData.city }}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-zinc-300">
                  <span>Artículos en pedido:</span>
                  <span class="font-mono text-zinc-100">{{ cartStore.totalItemsCount }} prendas</span>
                </div>
                <div class="flex items-center justify-between text-sm font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                  <span>Total a Pagar:</span>
                  <span class="font-mono text-amber-400">€{{ cartStore.totalAmount }}</span>
                </div>
              </div>
            </div>

            <!-- STEP 3: CONFIRMACIÓN DE PEDIDO -->
            <div v-else-if="currentStep === 3" class="text-center py-8 space-y-6">
              <div class="w-18 h-18 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 class="w-10 h-10" />
              </div>

              <div class="space-y-2">
                <h3 class="text-2xl font-bold font-serif-luxury text-zinc-100">¡Pedido Confirmado!</h3>
                <p class="text-xs text-zinc-400">
                  Hemos recibido tu orden con éxito y nuestros artesanos ya están preparando tu paquete.
                </p>
                <div class="pt-2">
                  <span class="inline-block px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-amber-400 font-semibold">
                    {{ confirmedOrderId }}
                  </span>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-left space-y-2 text-xs">
                <div class="flex items-center gap-2 text-zinc-300 font-semibold mb-1">
                  <Package class="w-4 h-4 text-amber-400" />
                  <span>Detalles del Envío</span>
                </div>
                <p class="text-zinc-400">Destinatario: <strong class="text-zinc-200">{{ formData.name }}</strong></p>
                <p class="text-zinc-400">Dirección: <strong class="text-zinc-200">{{ formData.address }}, {{ formData.city }}</strong></p>
                <p class="text-zinc-400">Email de seguimiento: <strong class="text-zinc-200">{{ formData.email }}</strong></p>
              </div>

              <button
                type="button"
                class="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
                @click="handleClose"
              >
                Volver al Catálogo
              </button>
            </div>
          </div>

          <!-- Drawer Footer Controls -->
          <div v-if="currentStep < 3" class="p-5 border-t border-zinc-800/80 bg-[#090d15] flex items-center gap-3">
            <button
              v-if="currentStep > 1"
              type="button"
              class="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              @click="currentStep--"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              type="button"
              :disabled="isProcessing"
              class="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
              @click="handleNextStep"
            >
              <span v-if="isProcessing">Procesando pago seguro...</span>
              <span v-else-if="currentStep === 1">Continuar al Pago</span>
              <span v-else>Pagar €{{ cartStore.totalAmount }}</span>
              <ArrowRight v-if="!isProcessing" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
