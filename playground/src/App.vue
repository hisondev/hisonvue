<template>
  <h1>Nuxt Playground Test</h1>
  <HButton @click="handleClick">Click me!</HButton>
</template>

<script setup lang="ts">
function handleClick() {
  alert('Clicked!')
}
</script>
