<template>
    <h1>Home Page</h1>
    <HLayout class="hison-col-12-mb hison-col-12-tb hison-col-6-pc hison-col-6-wd hison-layout-vertical-align-center-mb hison-layout-vertical-align-top-pc">
        <HButton
        @click="goToNoteTest"
        id="b1"
        class="hison-col-2 hison-pos-left hison-size-l-mb hison-size-s-pc hison-color-danger-mb hison-color-warning-pc">
            Go to Note<br>(left-button)
        </HButton>
        <div class="hison-col-5 hison-pos-center" style="text-align: center;">
            <HButton
            @click="onClickCenterButton1"
            class="hison-col-6 hison-size-l-mb hison-size-s-pc"
            text="center button1"
            ></HButton>
            <HButton @click="onClickCenterButton2" id="b4" class="hison-col-6 hison-size-l-mb hison-size-s-pc" text="center button2"></HButton>
        </div>
        <HButton @click="goToGridTest" id="b2" class="hison-col-2 hison-pos-right hison-size-l-mb hison-size-s-pc">Go to Grid<br>(right-button)</HButton>
    </HLayout>
    <br><br>
    <HInputGroup id="inputGroup1">
        <HLayout class="hison-col-12-tb hison-col-6-pc">
            <HLayout class="hison-col-12-mb hison-col-6-pc hison-pos-right">
                <HInput
                id="input1"
                class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-muted-pc"
                style="margin-bottom: 5px;"
                inputType="date"
                :format="DateFormat['MMMM dd, yyyy']"
                v-model="inputValue1"
                required="true"
                ></HInput>
                <HInput
                id="input2"
                class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-info-pc"
                style="margin-bottom: 5px;"
                :inputType="InputType.month"
                ref="input2Ref"
                v-model="inputValue2"
                required="true"
                ></HInput>
                <HInput
                id="input3"
                class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-success-pc"
                style="margin-bottom: 5px;"
                :inputType="InputType.date"
                v-model="inputValue3"
                ></HInput>
            </HLayout>
            <HLayout>
                <HInput
                id="input4"
                class="hison-col-8 hison-size-l-mb hison-size-s-pc hison-pos-left-mb hison-pos-right-pc hison-color-danger-pc"
                style="margin-bottom: 5px;"
                v-model="inputValue4"
                inputType="number"
                format="$$ #,###.##"
                nullText="$$"
                maxNumber="10000"
                @input="onInput4"
                ></HInput>
                <HInput
                id="input5"
                class="hison-col-8 hison-size-l-mb hison-size-s-pc hison-pos-left-mb hison-pos-right-pc hison-color-warning-pc"
                style="margin-bottom: 5px;"
                v-model="inputValue5"
                inputType="mask"
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
                :inputType="InputType.password"
                placeholder="testtest"
                maxLength="10"
                ></HInput>
            </HLayout>            
        </HLayout>
    </HInputGroup>
    <br><br>
    <HLayout class="hison-col-6-pc">
        <HCalendar
            id="cal1"
            class="hison-size-l-mb hison-size-s-pc hison-color-primary-mb hison-color-warning-pc"
            active-view="week"
            :events-on-month-view="true"
            :selected-date="selectedDate"
            :events="calendarEvents"
            :locale="'en'"
            :time-from="9 * 60"
            :time-to="18 * 60"
            :weekend-color="'#dd5555'"
            :start-week-on-sunday="true"
            :special-hours="specialHours"
            @cell-click="onCellClick"
            @view-change="onViewChange"
            :disable="false"
            >
        </HCalendar>
        <vue-cal
        :time-from="8 * 60"
        :time-to="21 * 60"
        :time-step="2 * 60"
        :max-date="'2025-06-15'"
        />
    </HLayout>
</template>

<script setup lang="ts">
// @ts-ignore
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
const onCellClick = (date: Date) => {
    const day = 
        String(date.getFullYear()) + '-' +
        hison.utils.getLpad(String(date.getMonth() + 1), '0', 2) + '-' +
        hison.utils.getLpad(String(date.getDate()), '0', 2)
    console.log(day)
    const input1 = hison.vue.getInput('input1')!
    input1.setValue(day)
}
const onViewChange = (e: any) => {
    console.log(e)
}
const onClickCenterButton1 = (e: Event, button: HButtonMethods) => {
    const cal1 = hison.vue.getCalendar('cal1')
    console.log(cal1)
    calendarEvents.value.push({
        title: 'Project Kickoff',
        start: new Date(2025, 5, 17, 10, 0),
        end: new Date(2025, 5, 17, 12, 0),
        content: 'Initial project meeting with the team',
        class: 'event-blue',
    })
}
let invertColorToggle = true
const onClickCenterButton2 = () => {
    hison.style.setInvertColor(invertColorToggle)
    invertColorToggle = !invertColorToggle
}

const selectedDate = ref(new Date(2025, 5, 20))
const calendarEvents = ref([
  {
    title: 'Project Kickoff',
    start: new Date(2025, 5, 16, 10, 0),
    end: new Date(2025, 5, 16, 14, 0),
    content: 'Initial project meeting with the team',
    class: 'event-blue',
  },
  {
    title: 'Design Review',
    start: new Date(2025, 5, 16, 15, 0),
    end: new Date(2025, 5, 16, 18, 30),
    content: 'UI/UX final design review',
    class: 'event-green',
  },
  {
    title: 'Client Call',
    start: new Date(2025, 5, 16, 11, 0),
    end: new Date(2025, 5, 16, 17, 30),
    content: 'Call with overseas client (Zoom)',
    class: 'event-red',
  },
  {
    title: 'Dev Sprint Planning',
    start: new Date(2025, 5, 20, 6, 0),
    end: new Date(2025, 5, 20, 11, 30),
    content: 'Weekly planning session for developers',
    class: 'event-purple',
  },
  {
    title: 'Team Lunch',
    start: new Date(2025, 5, 21, 12, 0),
    end: new Date(2025, 5, 21, 20, 0),
    content: 'Casual team lunch at the cafeteria',
    class: 'event-orange',
  },
])


const schedules = [
    {
        id: 1,
        class: 'sch1',
        label: 'user1',
        hide: false
    },
    {
        id: 1,
        class: 'sch2',
        label: 'user1',
        hide: false
    },
]

const specialHours = {
  mon : [
    { from: 9 * 60, to: 12 * 60, class: 'open' },
    { from: 14 * 60, to: 20 * 60, class: 'open' }
  ]
}

const events = ref([
  { start: '2025-06-12 09:00', end: '2025-06-12 11:00', title: 'My Event' }
]);
const isWeekend = (heading: any) => {
    return heading.label === 'Saturday' || heading.label === 'Sunday'
}

import { DateFormat, EditMode, HButtonMethods, HInputGroupMethods, HInputMethods, hison, InputType } from 'hisonvue'
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
const onInput4 = (value: any, ...param: any) => {
    console.log(...param)
}
const goToGridTest = () => {
    router.push('/gridTest')
}
const goToNoteTest = () => {
    router.push('/noteTest')
}
const dw = new hison.data.DataWrapper({
    input1: '20250319',
    input2: '19100301',
    input3: '19100301',
    input4: '123.132',
    input5: 'asdfs!!',
})
const dm = new hison.data.DataModel({
    input1: '20221202',
    input2: '12100301',
    input3: '29100301',
    input4: '321.132',
    input5: 'bbbs!!',
})
const obj = {
    input1: '20220806',
    input2: '20000101',
    input3: '21000228',
    input4: '458.132',
    input5: 'dsgb!!',
}

</script>

<style scoped>
.open {
    color: red;
}
.vuecal__cell.open {
    color: red;
}
.sch1 {
    color: blue;
}
.vuecal__cell.sch1 {
    color: blue;
}
.sch2 {
    color: green;
}
.vuecal__cell.sch2 {
    color: green;
}
</style>
