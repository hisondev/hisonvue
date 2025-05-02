<template>
    <h1>Test Page with multiple editors</h1>
    <HButton @click="goBack" id="b1">Back to Home</HButton> | 
    <HButton @click="getNote1" id="b2">getNote1</HButton> | 
    <HButton @click="setNote3" id="b3" @mounted="btnMount">setNote3</HButton>
    <br><br>
    <HNote v-model="noteData1"
    id="note1"
    @mounted="mountNote1"
    textarea-height="200px"
    :color="'#123456'"
    ></HNote>
    <br>
    <HNote v-model="noteData2"
    id="note2"
    @mounted="mountNote2"
    textarea-height="200px"
    color-set="blue"
    ></HNote>
    <br>
    <HNote v-model="noteData3"
    id="note3"
    @mounted="mountNote3"
    textarea-height="200px"
    ></HNote>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onBeforeUpdate, onMounted, ref } from 'vue'
import { NoteData, VanillanoteElement } from 'vanillanote2'
import { hison, HButtonMethods } from 'hisonvue'


const router = useRouter()
const noteData1 = ref<NoteData>()
const noteData2 = ref<NoteData>()
const noteData3 = ref<NoteData>()

const goBack = () => {
    router.push('/')
}
const getNote1 = () => {
    console.log('getNote1!!!!!!!!!!!')
    hison.utils.getNumberFormat(1234.12789,'#,##0.##')
    hison.vue.getButton('b3')!.setDisable(false)
}
const setNote3 = () => {
    noteData3.value = noteData1.value;
}

const mountNote1 = (note: VanillanoteElement) => {
    console.log(note);
}
const mountNote2 = () => {
}
const mountNote3 = () => {
}
const btnMount = (btn: HButtonMethods) => {
    console.log(btn)
    btn.setDisable(true)
}

onMounted(() => {
})

onBeforeUpdate(() => {
})
</script>
