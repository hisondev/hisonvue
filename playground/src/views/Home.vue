<template>
    <h1>Home Page</h1>
    <HButton @click="goToGridTest">Go to Grid Test Page</HButton><br><br>
    <HButton @click="goToNoteTest">Go to Note Test Page</HButton>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goToGridTest = () => {
    router.push('/gridTest')
}
const goToNoteTest = () => {
    router.push('/noteTest')
}
</script>
