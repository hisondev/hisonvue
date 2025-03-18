<template>
  <HButton @click="handleClick">Click me!</HButton>
</template>

<script setup lang="ts">
function handleClick() {
  alert('Clicked!')
}
</script>