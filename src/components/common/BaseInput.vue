<script setup lang="ts">
import { computed, useId } from 'vue';
import { X } from 'lucide-vue-next';

interface Props {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  clearable?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  type: 'text',
  disabled: false,
  error: '',
  hint: '',
  clearable: false,
  id: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  clear: [];
}>();

const autoId = useId();
const inputId = computed(() => props.id || autoId);

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label
      v-if="label"
      :for="inputId"
      class="text-xs font-medium text-zinc-300 flex items-center justify-between"
    >
      <span>{{ label }}</span>
      <slot name="label-extra" />
    </label>

    <div class="relative flex items-center">
      <div v-if="$slots.prefix" class="absolute left-3.5 text-zinc-400 pointer-events-none flex items-center">
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full bg-[#111827]/80 text-zinc-100 text-sm rounded-lg transition-all duration-200 border placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60',
          $slots.prefix ? 'pl-10' : 'pl-3.5',
          clearable || $slots.suffix ? 'pr-10' : 'pr-3.5',
          'py-2.5',
          error ? 'border-red-500/80 focus:ring-red-500/40 focus:border-red-500' : 'border-zinc-800/90 hover:border-zinc-700',
          disabled ? 'opacity-50 cursor-not-allowed bg-zinc-900/50' : '',
        ]"
        @input="handleInput"
      />

      <button
        v-if="clearable && modelValue"
        type="button"
        class="absolute right-3 text-zinc-400 hover:text-zinc-200 p-1 rounded transition-colors"
        @click="handleClear"
      >
        <X class="w-4 h-4" />
      </button>
      <div v-else-if="$slots.suffix" class="absolute right-3 text-zinc-400 flex items-center">
        <slot name="suffix" />
      </div>
    </div>

    <span v-if="error" class="text-xs text-red-400 font-medium">
      {{ error }}
    </span>
    <span v-else-if="hint" class="text-xs text-zinc-500">
      {{ hint }}
    </span>
  </div>
</template>
