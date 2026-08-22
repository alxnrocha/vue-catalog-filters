<script setup lang="ts">
import { watch } from 'vue';
import { useCatalogStore } from '@/stores/useCatalogStore';
import FilterSidebar from '@/components/catalog/FilterSidebar.vue';
import { useScrollLock } from '@vueuse/core';
import { X, SlidersHorizontal, Check } from 'lucide-vue-next';

interface Props {
  modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<{
  'update:modelValue': [val: boolean];
}>();

const store = useCatalogStore();
const isLocked = useScrollLock(document.body);

watch(
  () => props.modelValue,
  (isOpen) => {
    isLocked.value = isOpen;
  }
);

const handleClose = () => {
  emit('update:modelValue', false);
  isLocked.value = false;
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 lg:hidden overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        @click="handleClose"
      ></div>

      <!-- Slide-over / Bottom sheet panel -->
      <div class="fixed inset-y-0 right-0 max-w-full flex pl-10 w-full sm:max-w-md">
        <div
          class="w-full bg-[#0e1420] border-l border-zinc-700/80 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          <!-- Drawer Header -->
          <div class="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-[#0b0f17]">
            <div class="flex items-center gap-2">
              <SlidersHorizontal class="w-4 h-4 text-amber-400" />
              <h2 class="text-sm font-bold font-serif-luxury tracking-wider text-zinc-100 uppercase">
                Filtrar Catálogo
              </h2>
              <span
                v-if="store.activeFiltersCount > 0"
                class="px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[10px]"
              >
                {{ store.activeFiltersCount }}
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

          <!-- Drawer Body with FilterSidebar -->
          <div class="flex-1 overflow-y-auto p-5">
            <FilterSidebar />
          </div>

          <!-- Drawer Sticky Footer -->
          <div class="p-4 border-t border-zinc-800/80 bg-[#090d15] flex items-center gap-3">
            <button
              v-if="store.activeFiltersCount > 0"
              type="button"
              class="px-3.5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              @click="store.resetFilters"
            >
              Limpiar
            </button>

            <button
              type="button"
              class="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
              @click="handleClose"
            >
              <Check class="w-4 h-4 stroke-[3]" />
              <span>Ver {{ store.totalResultsCount }} prendas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
