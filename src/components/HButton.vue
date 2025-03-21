<template>
  <button
    class="hison-btn"
    :style="{ color: textColor || '#fff' }"
    @click="$emit('click')"
  >
    <slot>Hison Button</slot>
  </button>
</template>

<script setup lang="ts">
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
