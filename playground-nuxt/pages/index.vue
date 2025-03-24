<template>
    <div>
        <h1>Nuxt Playground Test</h1>
        <HButton text-color="#ff0000" @click="onClick">Click Me (Nuxt)</HButton>
        <br>
        <HEditor></HEditor>
    </div>
</template>

<script setup lang="ts">
const onClick = () => {
    alert('HButton Clicked in Nuxt Playground!')
}
</script>
