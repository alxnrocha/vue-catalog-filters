<script setup lang="ts">
import ProjectBadge from './components/ProjectBadge.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="min-h-screen bg-[#0b0f17] text-gray-100 flex flex-col font-sans">
    <RouterView />
      <ProjectBadge />
  </div>
</template>
