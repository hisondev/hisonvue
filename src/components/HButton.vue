<template>
  <button class="hison-btn" @click="$emit('click')">
    <slot>Hison Button</slot>
  </button>
</template>

<script setup lang="ts"></script>

<style scoped>
.hison-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: var(--primary-color, #42b983);
  color: white;
  border: none;
  cursor: pointer;
}
.hison-btn:hover {
  opacity: 0.8;
}
</style>