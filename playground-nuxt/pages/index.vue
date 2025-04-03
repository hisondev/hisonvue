<template>
    <h1>Nuxt Home Page</h1>
    <HButton @click="goToTest" text-color="#007bff">Go to Test Page</HButton>
    <HGrid></HGrid>
</template>

<script setup lang="ts">
const router = useRouter()
    const goToTest = () => {
    router.push('/test001')
}
</script>
  