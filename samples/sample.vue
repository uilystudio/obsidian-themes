<script setup lang="ts">
import { computed, ref } from 'vue';
const name = ref('Obsidian Forest');
const label = computed(() => `Theme: ${name.value}`);
</script>
<template>
  <div class="theme-card"><h1>{{ label }}</h1></div>
</template>
<style scoped>.theme-card { color: #abc9a8; }</style>
