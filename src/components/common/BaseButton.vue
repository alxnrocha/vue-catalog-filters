<script setup lang="ts">
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
  fullWidth: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_28px_rgba(245,158,11,0.4)] border border-amber-400/40 active:scale-[0.98]';
    case 'secondary':
      return 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/60 shadow-sm active:scale-[0.98]';
    case 'outline':
      return 'bg-transparent hover:bg-zinc-800/60 text-zinc-200 border border-zinc-700 hover:border-amber-500/50 active:scale-[0.98]';
    case 'ghost':
      return 'bg-transparent hover:bg-zinc-800/50 text-zinc-300 hover:text-white active:scale-[0.98]';
    case 'danger':
      return 'bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 active:scale-[0.98]';
    default:
      return '';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-xs rounded-md gap-1.5';
    case 'lg':
      return 'px-6 py-3.5 text-base rounded-xl gap-2.5';
    case 'md':
    default:
      return 'px-4 py-2.5 text-sm rounded-lg gap-2';
  }
});

const handleClick = (e: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', e);
  }
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
      variantClasses,
      sizeClasses,
      fullWidth ? 'w-full' : '',
      disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    ]"
    @click="handleClick"
  >
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin shrink-0" />
    <slot name="prefix" />
    <slot />
    <slot name="suffix" />
  </button>
</template>
