<template>
    <h1>Home Page</h1>
    <HButton @click="goToTest" text-color="#007bff">Go to Test Page</HButton>
    <HGrid></HGrid>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goToTest = () => {
    router.push('/test')
}
</script>
