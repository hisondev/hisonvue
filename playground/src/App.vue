<template>
  <HProvider>
    <h1>Playground Test</h1>
    <HButton @click="handleClick" text-color="#ff0000">Click me!</HButton>
    <br><br>
    <HEditor></HEditor>
    <HEditor></HEditor>
    <HEditor></HEditor>
  </HProvider>
  <!--<HEditor></HEditor>-->
</template>

<script setup lang="ts">
function handleClick() {
  alert('Clicked!')
}
</script>
