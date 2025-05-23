<template>
    <h1>Home Page</h1>
    <HLayout class="hison-col-12-mb hison-col-12-tb hison-col-6-pc hison-col-6-wd">
        <HButton
        @click="goToNoteTest"
        id="b1"
        class="hison-col-2 hison-pos-left hison-size-m-mb hison-size-s-pc hison-color-danger-mb hison-color-warning-pc">
            Go to Note<br>(left-button)
        </HButton>
        <div class="hison-col-5 hison-pos-center" style="text-align: center;">
            <HButton @click="onClickCenterButton1" id="b3" class="hison-col-6 hison-size-l-mb hison-size-s-pc">center<br>button1</HButton>
            <HButton @click="onClickCenterButton2" id="b4" class="hison-col-6 hison-size-l-mb hison-size-s-pc">center<br>button2</HButton>
        </div>
        <HButton @click="goToGridTest" id="b2" class="hison-col-2 hison-pos-right hison-size-l-mb hison-size-s-pc">Go to Grid<br>(right-button)</HButton>
    </HLayout>
</template>

<script setup lang="ts">
import { hison } from 'hisonvue'
import { useRouter } from 'vue-router'

let visibleToggle = false

const router = useRouter()
const goToGridTest = () => {
    router.push('/gridTest')
}
const goToNoteTest = () => {
    router.push('/noteTest')
}
const onClickCenterButton1 = () => {
    hison.vue.getButton('b4')?.setDisable(visibleToggle)
    visibleToggle = !visibleToggle
}
const onClickCenterButton2 = () => {
    alert('test')
}
</script>
