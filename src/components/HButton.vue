<template>
  <button
    class="hison-btn"
    :style="`background-color: ${buttonColor}; ${buttonSize}`"
    @click="$emit('click')"
  >
    <slot>Hison Button</slot>
  </button>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import { HisonVueConfig } from '..';

const isInsideHProvider = inject('hprovider', false)
if (import.meta.env.DEV && !isInsideHProvider) {
  throw new Error('[HisonVue] <HEditor> must be used inside <HProvider>.')
}

const config = inject<HisonVueConfig>('hisonvue-config', {});
const buttonColor = computed(() => config?.primaryColor || '#000');
const buttonSize = computed(() => {
  switch (config?.size) {
    case 's': return 'padding: 0.25rem 0.5rem; font-size: 0.8rem;';
    case 'm': return 'padding: 0.5rem 1rem; font-size: 1rem;';
    case 'l': return 'padding: 0.75rem 1.25rem; font-size: 1.2rem;';
    case 'xl': return 'padding: 1rem 1.5rem; font-size: 1.4rem;';
    default: return '';
  }
});

const props = defineProps<{
  textColor?: `#${string}`
}>()
defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped>
.hison-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: var(--primary-color, #000);
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}
.hison-btn:hover {
  opacity: 0.8;
}
</style>
