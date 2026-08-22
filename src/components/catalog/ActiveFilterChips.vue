<script setup lang="ts">
import { useCatalogStore } from '@/stores/useCatalogStore';
import { X, RotateCcw } from 'lucide-vue-next';

const store = useCatalogStore();
</script>

<template>
  <div
    v-if="store.activeFiltersList.length > 0"
    class="flex flex-wrap items-center gap-2 py-3 px-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm"
  >
    <span class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mr-1 shrink-0">
      Filtros activos:
    </span>

    <!-- Individual Chips -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="chip in store.activeFiltersList"
        :key="chip.id"
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800/90 hover:bg-zinc-700/80 text-zinc-200 hover:text-white rounded-lg text-xs font-medium border border-zinc-700/60 hover:border-amber-500/50 transition-all cursor-pointer group"
        @click="store.removeFilter(chip.type, chip.value)"
      >
        <span>{{ chip.label }}</span>
        <X class="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
      </button>

      <!-- Clear All Button -->
      <button
        type="button"
        class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer ml-auto"
        @click="store.resetFilters"
      >
        <RotateCcw class="w-3 h-3" />
        <span>Limpiar todo</span>
      </button>
    </div>
  </div>
</template>
