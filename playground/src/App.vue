<template>
  <h1>Playground Test</h1>
  <HButton @click="handleClick" text-color="#ff0000">Click me!</HButton>
</template>

<script setup lang="ts">
function handleClick() {
  alert('Clicked!')
}
</script>
