<template>
    <h1>Test Page with multiple editors</h1>
    <HButton @click="goBack" text-color="#ff0000">Back to Home</HButton> | 
    <HButton @click="getNote1" text-color="#ff0000">getNote1</HButton> | 
    <HButton @click="setNote3" text-color="#ff0000">setNote3</HButton>
    <br><br>
    <HNote v-model="noteData1" data-id="note1" @mounted="mountNote1" textarea-height="200px"></HNote>
    <br>
    <HNote v-model="noteData2" data-id="note2" @mounted="mountNote2" textarea-height="200px"></HNote>
    <br>
    <HNote v-model="noteData3" data-id="note3" @mounted="mountNote3" textarea-height="200px"></HNote>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onBeforeUpdate, onMounted, ref } from 'vue'
import { NoteData, VanillanoteElement } from 'vanillanote2'
import { hison } from 'hisonvue'


const router = useRouter()
const noteData1 = ref<NoteData>()
const noteData2 = ref<NoteData>()
const noteData3 = ref<NoteData>()

const goBack = () => {
    router.push('/')
}
const getNote1 = () => {
    hison.utils.getNumberFormat(1234.12789,'#,##0.##')
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
}
const mountNote2 = () => {
}
const mountNote3 = () => {
}

onMounted(() => {
    console.log("##### onMounted");
})

onBeforeUpdate(() => {
    console.log("#### onBeforeUpdate");
})
</script>
