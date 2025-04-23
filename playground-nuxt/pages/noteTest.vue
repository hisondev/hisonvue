<template>
    <h1>Nuxt Test Page with multiple editors</h1>
    <HButton @click="goBack" text-color="#ff0000">Back to Home</HButton>
    <HButton @click="getNote1" text-color="#ff0000">getNote1</HButton>
    <HButton @click="setNote3" text-color="#ff0000">setNote3</HButton>
    <HEditor v-model="noteData1" data-id="note1" @mounted="mountNote1" textarea-height="200px"></HEditor>
    <HEditor v-model="noteData2" data-id="note2" @mounted="mountNote2" textarea-height="200px"></HEditor>
    <HEditor v-model="noteData3" data-id="note3" @mounted="mountNote3" textarea-height="200px"></HEditor>
</template>

<script setup lang="ts">
import type { VanillanoteElement, NoteData } from 'vanillanote2'
import { hisonvue } from 'hisonvue';

const router = useRouter()
    const goBack = () => {
    router.push('/')
}
const noteData1 = ref<NoteData>()
const noteData2 = ref<NoteData>()
const noteData3 = ref<NoteData>()
const getNote1 = () => {
    hisonvue.utils.getNumberFormat(1234.12789,'#,##0.##')
    console.log("##### getNote1");
    console.log("noteData1.value", noteData1.value);
}
const setNote3 = () => {
    console.log("##### setNote3");
    console.log("noteData3.value", noteData3.value);
    noteData3.value = noteData1.value;
    console.log("noteData3.value", noteData3.value);
}

const mountNote1 = (note: VanillanoteElement) => {
    console.log("##### mountNote1");
    console.log(note);
}
const mountNote2 = (note: VanillanoteElement) => {
    console.log("##### mountNote2");
    console.log(note);
}
const mountNote3 = (note: VanillanoteElement) => {
    console.log("##### mountNote3");
    console.log(note);
}

onMounted(() => {
    console.log("##### onMounted");
})

onBeforeUpdate(() => {
    console.log("#### onBeforeUpdate");
})
</script>
