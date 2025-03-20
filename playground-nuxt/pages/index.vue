<template>
    <div>
        <h1>Nuxt Playground Test</h1>
        <HButton @click="onClick">Click Me (Nuxt)</HButton>
    </div>
</template>

<script setup lang="ts">
const onClick = () => {
    alert('HButton Clicked in Nuxt Playground!')
}
</script>
