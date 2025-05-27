<template>
    <h1>Home Page</h1>
    <HLayout class="hison-col-12-mb hison-col-12-tb hison-col-6-pc hison-col-6-wd hison-layout-vertical-align-center-mb hison-layout-vertical-align-top-pc">
        <HButton
        @click="goToNoteTest"
        id="b1"
        class="hison-col-2 hison-pos-left hison-size-m-mb hison-size-s-pc hison-color-danger-mb hison-color-warning-pc">
            Go to Note<br>(left-button)
        </HButton>
        <div class="hison-col-5 hison-pos-center" style="text-align: center;">
            <HButton
            @click="onClickCenterButton1"
            @mouseover="onMouseoverCenterButton1"
            @mouseout="onMouseoutCenterButton1"
            class="hison-col-6 hison-size-l-mb hison-size-s-pc"
            text="center button1"
            ></HButton>
            <HButton @click="onClickCenterButton2" id="b4" class="hison-col-6 hison-size-l-mb hison-size-s-pc" text="center button2"></HButton>
        </div>
        <HButton @click="goToGridTest" id="b2" class="hison-col-2 hison-pos-right hison-size-l-mb hison-size-s-pc">Go to Grid<br>(right-button)</HButton>
    </HLayout>
    <br><br>
    <HLayout class="hison-col-12-tb hison-col-6-pc">
        <HLayout class="hison-col-5 hison-pos-right">
            <HInput
            id="input1"
            class="hison-col-3 hison-pos-right"
            style="text-align: center; border: none; border-bottom: 1px solid black; margin-bottom: 20px;"
            type="number"
            format="#,###.##"
            v-model="inputValue1"
            @mounted="onInputMounted1"
            @change="onChange1"
            ></HInput>
            <HInput
            id="input2"
            class="hison-col-3 hison-pos-right"
            style="line-height: 30px; margin-bottom: 20px;"
            v-model="inputValue2"
            ></HInput>
            <HInput
            id="input3"
            class="hison-col-3 hison-pos-right"
            style="padding: 20px 0; margin-bottom: 20px;"
            v-model="inputValue3"
            ></HInput>
        </HLayout>
        <HInput
        id="input4"
        class="hison-col-12"
        style="text-align: center; border: none; border-bottom: 1px solid black; margin-bottom: 20px;"
        v-model="inputValue4"
        ></HInput>
        <HInput
        id="input5"
        class="hison-col-12"
        style="text-align: center; border: none; border-bottom: 1px solid black; margin-bottom: 20px;"
        ></HInput>
    </HLayout>
    <input type="number" value="2025-03-19"></input>
</template>

<script setup lang="ts">
import { HButtonMethods, HInputMethods, hison } from 'hisonvue'
import { useRouter } from 'vue-router'

let visibleToggle = true

const inputValue1 = '1123.123';
const inputValue2 = 'test002';
const inputValue3 = 'test003';
const inputValue4 = 'test004';
const inputValue5 = 'test005';

const router = useRouter()
const onChange1 = (oldValue: any, newValue: any, inputMethods: HInputMethods) => {
    console.log(oldValue, newValue, inputMethods)
}
const onInputMounted1 = (inputMethods: HInputMethods) => {
}
const goToGridTest = () => {
    router.push('/gridTest')
}
const goToNoteTest = () => {
    router.push('/noteTest')
}
const onClickCenterButton1 = (e: Event, button: HButtonMethods) => {
    console.log(button.getText());
    hison.vue.getButton('b4')?.setDisable(visibleToggle)
    visibleToggle = !visibleToggle
    hison.vue.getInput('input1')!.setType('text')
}
const onMouseoverCenterButton1 = (e: Event, button: HButtonMethods) => {
    button.setText('click');
}
const onMouseoutCenterButton1 = (e: Event, button: HButtonMethods) => {
    button.setText('center button1');
}
const onClickCenterButton2 = () => {
    alert('test')
}
</script>
