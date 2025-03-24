<template>
    <HProvider>
        <h1>Nuxt Test Page with multiple editors</h1>
        <HButton @click="goBack" text-color="#ff0000">Back to Home</HButton>
        <HEditor textarea-height="200px"></HEditor>
        <HEditor textarea-height="200px"></HEditor>
        <HEditor textarea-height="200px"></HEditor>
    </HProvider>
</template>

<script setup lang="ts">
const router = useRouter()
    const goBack = () => {
    router.push('/')
}
</script>
  