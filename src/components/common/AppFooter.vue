<script setup lang="ts">
import { ref } from 'vue';
import { ShieldCheck, Truck, RefreshCw, Headphones, ArrowRight, Check } from 'lucide-vue-next';

const email = ref('');
const subscribed = ref(false);
const error = ref('');

const handleSubscribe = () => {
  if (!email.value || !email.value.includes('@')) {
    error.value = 'Introduce un email válido';
    return;
  }
  error.value = '';
  subscribed.value = true;
};
</script>

<template>
  <footer class="bg-[#080c13] border-t border-zinc-800/80 text-zinc-400 mt-20">
    <!-- Value Propositions Strip -->
    <div class="border-b border-zinc-800/60 bg-[#0b0f17]/60">
      <div class="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Truck class="w-6 h-6" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-zinc-100 mb-1">Envío Express Gratuito</h4>
              <p class="text-xs text-zinc-400 leading-relaxed">En todos los pedidos superiores a 100€ con entrega en 24-48 horas.</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <RefreshCw class="w-6 h-6" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-zinc-100 mb-1">Devoluciones en 30 Días</h4>
              <p class="text-xs text-zinc-400 leading-relaxed">Sin complicaciones. Recogida a domicilio gratuita en toda la península.</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-zinc-100 mb-1">Pago 100% Seguro</h4>
              <p class="text-xs text-zinc-400 leading-relaxed">Cifrado SSL de 256 bits y compatibilidad con Apple Pay, Tarjeta y Klarna.</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Headphones class="w-6 h-6" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-zinc-100 mb-1">Atención Personalizada</h4>
              <p class="text-xs text-zinc-400 leading-relaxed">Asesores de estilo dedicados disponibles de lunes a domingo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Links & Newsletter -->
    <div class="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        <!-- Brand Column -->
        <div class="lg:col-span-2 space-y-4">
          <span class="text-2xl font-bold tracking-[0.2em] font-serif-luxury bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            AURELIA ATELIER
          </span>
          <p class="text-sm text-zinc-400 max-w-sm leading-relaxed">
            Curaduría de moda contemporánea de alta costura, calzado de diseñador y accesorios atemporales con acabados artesanales.
          </p>
          <div class="pt-2">
            <p class="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">Newsletter Exclusiva</p>
            <form v-if="!subscribed" class="flex gap-2 max-w-md" @submit.prevent="handleSubscribe">
              <input
                v-model="email"
                type="email"
                placeholder="tu.email@ejemplo.com"
                class="flex-1 bg-[#111827] text-sm text-zinc-100 placeholder:text-zinc-500 rounded-lg px-3.5 py-2.5 border border-zinc-800 focus:outline-none focus:border-amber-500/60"
              />
              <button
                type="submit"
                class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Unirme</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </form>
            <div v-else class="flex items-center gap-2 text-emerald-400 text-sm font-medium py-2">
              <Check class="w-4 h-4" />
              <span>¡Gracias por unirte al club Aurelia! Revisa tu bandeja de entrada.</span>
            </div>
            <p v-if="error" class="text-xs text-red-400 mt-1">{{ error }}</p>
          </div>
        </div>

        <!-- Links Columns -->
        <div>
          <h4 class="text-xs uppercase tracking-wider font-semibold text-zinc-200 mb-4">Colecciones</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Chaquetas & Abrigos</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Camisetas & Tops</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Pantalones & Sastrería</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Vestidos & Alta Noche</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Calzado & Sneakers</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Accesorios de Piel</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs uppercase tracking-wider font-semibold text-zinc-200 mb-4">Atelier & Marcas</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Acne Studios</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">AMI Paris</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">A.P.C.</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Balenciaga</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Bottega Veneta</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Totême</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs uppercase tracking-wider font-semibold text-zinc-200 mb-4">Ayuda & Guías</h4>
          <ul class="space-y-2.5 text-sm">
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Guía de Tallas</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Seguimiento de Pedido</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Política de Devolución</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Cuidado de Prendas</a></li>
            <li><a href="#/" class="hover:text-amber-400 transition-colors">Contacto & Citas</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-16 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© 2026 Aurelia Atelier S.L. Todos los derechos reservados. Desarrollado con Vue 3.5 & Pinia.</p>
        <div class="flex items-center gap-6">
          <a href="#/" class="hover:text-zinc-300 transition-colors">Privacidad</a>
          <a href="#/" class="hover:text-zinc-300 transition-colors">Términos de Servicio</a>
          <a href="#/" class="hover:text-zinc-300 transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>
