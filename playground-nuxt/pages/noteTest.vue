<template>
    <h1>Test Page with multiple editors</h1>
    <HButton @click="goBack" id="b1">Back to Home</HButton> | 
    <HButton @click="getNote1" id="b2">getNote1</HButton> | 
    <HButton @click="setNote3" id="b3" @mounted="btnMount">setNote3</HButton>
    <br><br>
    <HLayout>
        <HNote v-model="noteData1"
        class="hison-col-12-mb hison-col-4-pc hison-size-m-mb hison-size-s-pc"
        id="note1"
        @mounted="mountNote1"
        :boldBeforeClick="onBoldBeforeClick"
        :textareaBeforeFocus="onTextareaBeforeFocus"
        textarea-height="200px"
        ></HNote>
        <HNote v-model="noteData2"
        class="hison-col-12-mb hison-col-4-pc hison-size-m-mb hison-size-s-pc"
        @mounted="mountNote2"
        textarea-height="200px"
        ></HNote>
        <HNote v-model="noteData3"
        id="note3"
        class="hison-col-12-mb hison-col-4-pc hison-size-m-mb hison-size-s-pc"
        @mounted="mountNote3"
        textarea-height="200px"
        ></HNote>
    </HLayout>
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

const onBoldBeforeClick = (e: Event) => { console.log('onBoldBeforeClick'); return false }
const onTextareaBeforeFocus = (e: Event) => { console.log('onTextareaBeforeFocus'); return false}

let testToggle = true;

const goBack = () => {
    router.push('/')
}
const getNote1 = () => {
    hison.utils.getNumberFormat(1234.12789,'#,##0.##')
    hison.component.getButton('b3')!.setDisable(testToggle)
    testToggle = !testToggle
}
const setNote3 = () => {
    noteData3.value = noteData1.value;
    hison.style.setInvertColor(testToggle)
    testToggle = !testToggle
}

const mountNote1 = (note: VanillanoteElement) => {
}
const mountNote2 = () => {
}
const mountNote3 = () => {
}
const btnMount = (btn: HButtonMethods) => {
    console.log('btnMount!!!!!!!!!!!!!!!!!!!!!!')
    btn.setDisable(false)
}

onMounted(() => {
})

onBeforeUpdate(() => {
})
</script>
