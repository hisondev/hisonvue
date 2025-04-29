<template>
    <h1>Nuxt Home Page</h1>
    <HButton @click="goToGridTest" id="b1">Go to Grid Test Page</HButton><br><br>
    <HButton @click="goToNoteTest" id="b2">Go to Note Test Page</HButton>
</template>

<script setup lang="ts">
const router = useRouter()
const goToGridTest = () => {
    router.push('/gridTest')
}
const goToNoteTest = () => {
    router.push('/noteTest')
}
</script>
