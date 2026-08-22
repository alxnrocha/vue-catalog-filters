<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'gold' | 'sale' | 'dark' | 'neutral' | 'success' | 'outline';
  size?: 'sm' | 'md';
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  rounded: false,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'gold':
      return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
    case 'sale':
      return 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold tracking-wide';
    case 'success':
      return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
    case 'dark':
      return 'bg-zinc-900/90 text-zinc-300 border border-zinc-700/60';
    case 'outline':
      return 'bg-transparent text-zinc-400 border border-zinc-700/60';
    case 'neutral':
    default:
      return 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/40';
  }
});

const sizeClasses = computed(() => {
  return props.size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1 font-medium transition-colors select-none',
      variantClasses,
      sizeClasses,
      rounded ? 'rounded-full' : 'rounded-md',
    ]"
  >
    <slot name="prefix" />
    <slot />
    <slot name="suffix" />
  </span>
</template>
