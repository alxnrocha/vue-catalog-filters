<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  images: string[];
  productName: string;
}

const props = defineProps<Props>();

const activeIndex = ref(0);

watch(
  () => props.images,
  () => {
    activeIndex.value = 0;
  }
);
</script>

<template>
  <div class="flex flex-col-reverse sm:flex-row gap-4 sm:gap-5 w-full h-full items-center sm:items-stretch">
    <!-- Vertical Thumbnails List -->
    <div class="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] shrink-0 py-1 sm:py-0 pr-1">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        type="button"
        :class="[
          'relative w-16 h-22 sm:w-20 sm:h-28 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-zinc-900 shrink-0',
          activeIndex === idx
            ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105'
            : 'border-zinc-800 hover:border-zinc-600 opacity-60 hover:opacity-100',
        ]"
        @click="activeIndex = idx"
      >
        <img
          :src="img"
          :alt="`${productName} miniatura ${idx + 1}`"
          class="w-full h-full object-cover object-top"
        />
      </button>
    </div>

    <!-- Main Large Display Image Container -->
    <div class="relative flex-1 w-full min-h-[380px] sm:min-h-[500px] lg:min-h-[580px] rounded-2xl overflow-hidden bg-zinc-900/90 border border-zinc-800/80 group">
      <img
        :src="images[activeIndex] || images[0]"
        :alt="productName"
        class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
    </div>
  </div>
</template>
