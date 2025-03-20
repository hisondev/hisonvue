<template>
  <button class="hison-btn" @click="$emit('click')">
    <slot>Hison Button</slot>
  </button>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.hison-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: var(--primary-color, #000);
  color: #fff;
  border: none;
  cursor: pointer;
}
.hison-btn:hover {
  opacity: 0.8;
}
</style>
