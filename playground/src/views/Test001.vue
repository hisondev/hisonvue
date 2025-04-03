<template>
    <h1>Test Page with multiple editors</h1>
    <HButton @click="goBack" text-color="#ff0000">Back to Home</HButton>
    <HEditor data-id="note1" textarea-height="200px"></HEditor>
    <HEditor data-id="note2" textarea-height="200px"></HEditor>
    <HEditor data-id="note3" textarea-height="200px"></HEditor>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => {
    router.push('/')
}
</script>
