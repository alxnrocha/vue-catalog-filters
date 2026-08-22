<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  min?: number;
  max?: number;
  minPrice: number;
  maxPrice: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  min: 50,
  max: 1000,
  step: 10,
});

const emit = defineEmits<{
  'update:minPrice': [val: number];
  'update:maxPrice': [val: number];
  change: [min: number, max: number];
}>();

const minPercent = computed(() => {
  return Math.round(((props.minPrice - props.min) / (props.max - props.min)) * 100);
});

const maxPercent = computed(() => {
  return Math.round(((props.maxPrice - props.min) / (props.max - props.min)) * 100);
});

const handleMinInput = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value);
  const safeVal = Math.min(val, props.maxPrice - props.step);
  emit('update:minPrice', safeVal);
  emit('change', safeVal, props.maxPrice);
};

const handleMaxInput = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value);
  const safeVal = Math.max(val, props.minPrice + props.step);
  emit('update:maxPrice', safeVal);
  emit('change', props.minPrice, safeVal);
};
</script>

<template>
  <div class="space-y-3">
    <!-- Value Labels Header -->
    <div class="flex items-center justify-between text-xs font-mono text-zinc-300">
      <span class="px-2 py-1 bg-zinc-900/90 rounded border border-zinc-800 text-amber-400 font-semibold">
        €{{ minPrice }}
      </span>
      <span class="text-zinc-600 font-sans text-[11px]">hasta</span>
      <span class="px-2 py-1 bg-zinc-900/90 rounded border border-zinc-800 text-amber-400 font-semibold">
        €{{ maxPrice }}
      </span>
    </div>

    <!-- Dual Range Track Container -->
    <div class="relative h-6 flex items-center select-none pt-2">
      <!-- Background Base Track -->
      <div class="absolute w-full h-1.5 bg-zinc-800 rounded-full"></div>

      <!-- Active Highlight Track (Amber Gradient) -->
      <div
        class="absolute h-1.5 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
        :style="{
          left: `${minPercent}%`,
          width: `${maxPercent - minPercent}%`,
        }"
      ></div>

      <!-- Native Range Inputs (Overlaid) -->
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="minPrice"
        class="range-slider-thumb absolute w-full h-1.5 opacity-0 cursor-pointer pointer-events-none z-30"
        @input="handleMinInput"
      />
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="maxPrice"
        class="range-slider-thumb absolute w-full h-1.5 opacity-0 cursor-pointer pointer-events-none z-30"
        @input="handleMaxInput"
      />

      <!-- Custom Styled Thumbs -->
      <div
        class="absolute w-4.5 h-4.5 bg-amber-400 border-2 border-[#0b0f17] rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)] -translate-x-1/2 pointer-events-none z-20 transition-transform active:scale-125"
        :style="{ left: `${minPercent}%` }"
      ></div>
      <div
        class="absolute w-4.5 h-4.5 bg-amber-400 border-2 border-[#0b0f17] rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)] -translate-x-1/2 pointer-events-none z-20 transition-transform active:scale-125"
        :style="{ left: `${maxPercent}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.range-slider-thumb {
  pointer-events: all;
  -webkit-appearance: none;
  appearance: none;
}

.range-slider-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  cursor: pointer;
  pointer-events: auto;
}

.range-slider-thumb::-moz-range-thumb {
  width: 20px;
  height: 20px;
  cursor: pointer;
  pointer-events: auto;
}
</style>
