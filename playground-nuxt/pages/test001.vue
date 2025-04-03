<template>
    <h1>Nuxt Test Page with multiple editors</h1>
    <HButton @click="goBack" text-color="#ff0000">Back to Home</HButton>
    <HEditor textarea-height="200px" data-id="note1"></HEditor>
    <HEditor textarea-height="200px" data-id="note2"></HEditor>
    <HEditor textarea-height="200px" data-id="note3"></HEditor>
</template>

<script setup lang="ts">
const router = useRouter()
    const goBack = () => {
    router.push('/')
}
</script>
  