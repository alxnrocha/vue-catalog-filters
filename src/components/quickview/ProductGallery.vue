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
  <div class="relative w-full h-full bg-zinc-950 overflow-hidden flex items-center justify-center select-none">
    <!-- Main Display Image (Absolute fill to keep container strictly 100% fixed) -->
    <img
      :src="images[activeIndex] || images[0]"
      :alt="productName"
      class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
    />

    <!-- Floating Thumbnails Strip Overlaid on Left Edge -->
    <div
      v-if="images.length > 1"
      class="absolute left-4 top-4 bottom-4 flex flex-col gap-3 overflow-y-auto py-1 z-10 custom-scrollbar"
    >
      <button
        v-for="(img, idx) in images"
        :key="idx"
        type="button"
        :class="[
          'relative w-16 aspect-[3/4] rounded-xl overflow-hidden transition-opacity duration-200 cursor-pointer bg-zinc-900 shrink-0 p-0 border-0 outline-none select-none',
          activeIndex === idx ? 'opacity-100' : 'opacity-50 hover:opacity-80',
        ]"
        @click="activeIndex = idx"
      >
        <img
          :src="img"
          :alt="`${productName} miniatura ${idx + 1}`"
          class="w-full h-full object-cover object-top block"
        />

        <!-- Razor-sharp Gold Active Border Overlay -->
        <span
          v-if="activeIndex === idx"
          class="absolute inset-0 rounded-xl border-2 border-amber-400 pointer-events-none"
        ></span>
      </button>
    </div>
  </div>
</template>
