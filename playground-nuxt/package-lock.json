<template>
    <h1>Nuxt Test Page with multiple editors</h1>
    <HButton @click="goBack" text-color="#ff0000">Back to Home</HButton>
    <HButton @click="getNote1" text-color="#ff0000">getNote1</HButton>
    <HButton @click="setNote3" text-color="#ff0000">setNote3</HButton>
    <HEditor data-id="note1" @mounted="mountNote1" textarea-height="200px"></HEditor>
    <HEditor data-id="note2" @mounted="mountNote2" textarea-height="200px"></HEditor>
    <HEditor data-id="note3" @mounted="mountNote3" textarea-height="200px"></HEditor>
</template>

<script setup lang="ts">
import { hison } from 'hisonvue';
import type { VanillanoteElement, NoteData } from 'vanillanote2'

const router = useRouter()
    const goBack = () => {
    router.push('/')
}

let noteData: NoteData;

const getNote1 = () => {
    console.log("##### getNote1");
    noteData = hison.vue.note.getNote('note1')!.getNoteData();
    console.log(hison.utils.getNumberFormat(1234.1289, '#,###.##'));
}
const setNote3 = () => {
    console.log("##### setNote3");
    hison.vue.note.getNote('note3')!.setNoteData(noteData);
    console.log(hison.utils.getNumberFormat(1234.1289, '#,###.##'));
}

const mountNote1 = (note: VanillanoteElement) => {
    console.log("##### mountNote1");
    console.log(note);
}
const mountNote2 = () => {
    console.log("##### mountNote2");
    console.log(hison.vue.note.getNote('note2'));
}
const mountNote3 = () => {
    console.log("##### mountNote3");
    console.log(hison.vue.note.getNote('note3'));
}

onMounted(() => {
    console.log("##### onMounted");
})

onBeforeUpdate(() => {
    console.log("#### onBeforeUpdate");
})
</script>
