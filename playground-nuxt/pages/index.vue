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
        <HLayout class="hison-col-12-mb hison-col-6-pc hison-pos-right">
            <HInput
            id="input1"
            class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-muted-pc"
            style="margin-bottom: 5px;"
            type="date"
            :format="DateFormat['MMMM dd, yyyy']"
            v-model="inputValue1"
            required="true"
            ></HInput>
            <HInput
            id="input2"
            class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-info-pc"
            style="margin-bottom: 5px;"
            :type="InputType.month"
            ref="input2Ref"
            @input="onInput2"
            v-model="inputValue2"
            required="true"
            ></HInput>
            <HInput
            id="input3"
            class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-success-pc"
            style="margin-bottom: 5px;"
            :type="InputType.date"
            v-model="inputValue3"
            ></HInput>
        </HLayout>
        <HLayout>
            <HInput
            id="input4"
            class="hison-col-8 hison-size-l-mb hison-size-s-pc hison-pos-left-mb hison-pos-right-pc hison-color-danger-pc"
            style="margin-bottom: 5px;"
            v-model="inputValue4"
            type="number"
            format="$$ #,###.##"
            nullText="$$"
            maxNumber="1000"
            ></HInput>
            <HInput
            id="input5"
            class="hison-col-8 hison-size-l-mb hison-size-s-pc hison-pos-left-mb hison-pos-right-pc hison-color-warning-pc"
            style="margin-bottom: 5px;"
            v-model="inputValue5"
            type="mask"
            format="AA999"
            nullText="-"
            required="true"
            placeholder="testtest"
            ></HInput>
            <HInput
            id="input6"
            class="hison-col-8 hison-size-l-mb hison-size-s-pc hison-pos-left-mb hison-pos-right-pc hison-color-warning-pc"
            style="margin-bottom: 5px;"
            v-model="inputValue6"
            :type="InputType.password"
            placeholder="testtest"
            maxLength="5"
            ></HInput>
        </HLayout>
    </HLayout>
    <br><br>
    <input type="date" value="2025-03-19"></input>
</template>

<script setup lang="ts">
import { DateFormat, HButtonMethods, HInputMethods, hison, InputType } from 'hisonvue'
import { ref } from 'vue';
import { useRouter } from 'vue-router'

let toggle = true

const inputValue1 = ref<any>('20240228');

const inputValue2 = ref<any>('2025-03')
const inputValue3 = ref<any>('2025-03-19');
const inputValue4 = ref<any>('1234.1234');
const inputValue5 = 'hr123';
const inputValue6 = '15sdfxzcv1515asd'
const input2Ref = ref<HTMLInputElement | null>(null)

const router = useRouter()
const onChange1 = (oldValue: any, newValue: any, inputMethods: HInputMethods) => {
    console.log(oldValue, newValue, inputMethods)
}
const onInputMounted1 = (inputMethods: HInputMethods) => {
}
const onInput2 = (value: any) => {

}
const goToGridTest = () => {
    router.push('/gridTest')
}
const goToNoteTest = () => {
    router.push('/noteTest')
}
const onClickCenterButton1 = (e: Event, button: HButtonMethods) => {
    hison.vue.getButton('b4')?.setDisable(toggle)
    toggle = !toggle
    hison.vue.getInput('input5')?.setFontThruline(toggle)
    hison.vue.getInput('input4')?.setMaxNumber(1000)
}
const onMouseoverCenterButton1 = (e: Event, button: HButtonMethods) => {
    inputValue1.value = '19900319'
}
const onMouseoutCenterButton1 = (e: Event, button: HButtonMethods) => {
    inputValue1.value = '20000319'
}
const onClickCenterButton2 = () => {
    //hison.vue.getInput('input1')?.setValue('20240506')
    inputValue1.value = '19900319'
    console.log(hison.vue.getInput('input1')?.getValue())
}
</script>
