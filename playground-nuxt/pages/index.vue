<template>
    <h1>Home Page</h1>
    <HLayout class="hison-col-12-mb hison-col-12-tb hison-col-12-pc hison-col-12-wd hison-layout-vertical-align-center-mb hison-layout-vertical-align-top-pc">
        <HButton
          @click="goToNoteTest"
          :disable="true"
          id="b1"
          class="hison-col-2 hison-pos-left hison-size-l-mb hison-size-s-pc hison-color-danger-mb hison-color-warning-pc">
          Go to Note<br>(left-button)
        </HButton>
        <HLayout class="hison-col-5 hison-pos-center" style="text-align: center;">
            <HButton
            @click="onClickCenterButton1"
            class="hison-col-6 hison-size-l-mb hison-size-s-pc"
            text="center button1"
            ></HButton>
            <HButton @click="onClickCenterButton2" id="b4" class="hison-col-6 hison-size-l-mb hison-size-s-pc" text="center button2"></HButton>
        </HLayout>
        <HButton @click="goToGridTest" id="b2" class="hison-col-2 hison-pos-right hison-size-l-mb hison-size-s-pc">Go to Grid<br>(right-button)</HButton>
    </HLayout>
    <HInputGroup id="inputGroup1" v-model="dataObject">
      <HLayout id="layout1" class="hison-col-12-tb hison-col-6-pc" style="height: 500px;">
        <HFileSet
        id="fileSet"
        class="hison-col-12 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-primary-mb hison-color-success-pc"
        v-model="files"
        :multiCols="true"
        :placeholder="'저장된 파일이 없습니다.'"
        :addButtonText="'추가'"
        :removeButtonText="'삭제'"
        :enableDrop="true"
        :visible="true"
        :editMode="EditMode.editable"
        style="height: 200px; margin-bottom: 5px;"
        ></HFileSet>
        <HInput
        id="range"
        class="hison-col-12 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-primary-mb hison-color-success-pc"
        style="margin-bottom: 5px;"
        inputType="range"
        @mounted="inputMount"
        ></HInput>
        <HInput
        id="color"
        class="hison-col-3 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-primary-mb hison-color-success-pc"
        style="margin-bottom: 5px;"
        inputType="color"
        @mounted="inputMount"
        ></HInput>
        <HInput
        id="checkbox"
        class="hison-col-3 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-danger-mb hison-color-warning-pc"
        style="margin-bottom: 5px;"
        inputType="checkbox"
        @mounted="inputMount"
        ></HInput>
        <HInput
        id="select"
        class="hison-col-6 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-danger-mb hison-color-warning-pc"
        style="margin-bottom: 5px;"
        inputType="select"
        :options="option1"
        @mounted="inputMount"
        ></HInput>
      </HLayout>
      <HLayout id="layout2" class="hison-col-12-tb hison-col-6-pc" style="height: 500px;">
        <HInput
        id="input1"
        class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-muted-pc"
        style="margin-bottom: 5px;"
        inputType="date"
        :format="DateFormat['MMMM dd, yyyy']"
        :required="true"
        :editMode="EditMode.readonly"
        ></HInput>
        <HInput
        id="input2"
        class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-info-pc"
        style="margin-bottom: 5px;"
        :inputType="InputType.text"
        placeholder="please insert text here."
        ref="input2Ref"
        :required="true"
        :editMode="EditMode.editable"
        ></HInput>
        <HInput
        id="input3"
        class="hison-col-4 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-success-pc"
        style="margin-bottom: 5px;"
        :inputType="InputType.date"
        ></HInput>
        <HInput
        id="input4"
        class="hison-col-8 hison-size-l-mb hison-size-s-pc hison-pos-left-mb hison-pos-right-pc hison-color-danger-pc"
        style="margin-bottom: 5px;"
        v-model="inputValue4"
        inputType="number"
        format="$$ #,###.##"
        nullText="$$"
        maxNumber="10000"
        :editMode="EditMode.editable"
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
        :required="true"
        :editMode="EditMode.disable"
        placeholder="testtest"
        ></HInput>
        <HInput
        id="input6"
        class="hison-col-8 hison-size-l-mb hison-size-s-pc hison-pos-left-mb hison-pos-right-pc hison-color-warning-pc"
        style="margin-bottom: 5px;"
        v-model="inputValue6"
        :inputType="InputType.password"
        placeholder="testtest"
        :editMode="EditMode.readonly"
        maxLength="10"
        ></HInput>
      </HLayout>
    </HInputGroup>
    <br><br>
    <HChart
      id="chart1"
      type="line"
      class="hison-col-6-pc hison-col-12-mb"
      v-model="chartData1"
      :options="chartOptions1"
      style="height:300px; display: inline-flex; align-items: center; justify-content: center;"
      :visible="false"
    />
    <HChart
      type="doughnut"
      class="hison-col-6-pc hison-col-12-mb"
      v-model="chartData2"
      :options="chartOptions2"
      style="height:300px; display: inline-flex; align-items: center; justify-content: center;"
    />
    <br><br>
    <HCalendar
        id="cal1"
        class="hison-size-l-mb hison-size-s-pc hison-color-primary-mb hison-color-warning-pc"
        active-view="week"
        :events-on-month-view="'short'"
        :date-cell-max-height="100"
        :date-cell-min-height="100"
        v-model:selected-date="selectedDate"
        v-model:events="calendarEvents"
        :locale="'en'"
        :time-step="60"
        :time-from="9 * 60"
        :time-to="18 * 60"
        :twelve-hour="true"
        :weekend-color="'#dd5555'"
        :start-week-on-sunday="false"
        :show-today-color="true"
        @cell-click="onCellClick"
        @view-change="onViewChange"
        :special-time="specialTime"
        >
    </HCalendar>
    <br><br>
    <HLayout>
      <HGrid
        id="grid01"
        class="
        hison-col-12-mb hison-col-6-pc
        hison-color-primary-mb hison-color-warning-wd
        hison-size-m-mb hison-size-s-pc
        "
        :columns="testColumns1"
        :height="'400px'"
        :horizenBorderSize="0"
        @mounted="mountGridTest1"
      />
      <HGrid
        id="grid02"
        class="
        hison-col-12-mb hison-col-6-pc
        hison-color-primary-mb hison-color-warning-wd
        hison-size-m-mb hison-size-s-pc
        "
        :columns="testColumns2"
        :height="'400px'"
        @mounted="mountGridTest2"
      />
    </HLayout>
    <br><br>
    <HLayout>
        <HNote v-model="noteData1"
        class="hison-col-12-mb hison-col-6-pc hison-size-m-mb hison-size-s-pc hison-color-primary-mb hison-color-warning-wd"
        id="note1"
        @mounted="mountNote1"
        :boldBeforeClick="onBoldBeforeClick"
        :textareaBeforeFocus="onTextareaBeforeFocus"
        textarea-height="200px"
        ></HNote>
        <HNote v-model="noteData2"
        id="note2"
        class="hison-col-12-mb hison-col-6-pc hison-size-m-mb hison-size-s-pc hison-color-primary-mb hison-color-warning-wd"
        @mounted="mountNote2"
        textarea-height="200px"
        ></HNote>
    </HLayout>
</template>

<script setup lang="ts">
const files = ref<AttachedFileItem[]>([])
const inputMount = (input: HInputMethods) => {
  console.log(input.getId())
}

let toggle = true
let data, dataModel, dataWrapper
let invertColorToggle = true
const noteData1 = ref<NoteData>()
const noteData2 = ref<NoteData>()
const onClickCenterButton1 = (e: Event, button: HButtonMethods) => {
  const inputGroup1 = hison.vue.getInputGroup('inputGroup1')
  inputGroup1?.reload()
  console.log(files.value)
}
const onClickCenterButton2 = () => {
  const fileSet = hison.vue.getFileSet('fileSet')
  fileSet?.setEditMode(EditMode.readonly)
  console.log(fileSet?.getEditMode())
  files.value.splice(1)
}
const colorValue = ref('#f4ed25')
const rangeValue = ref(100)
const checkboxValue = ref(true)
const selectValue = ref('value2')
const option1 = [
  { text: '가나다1', value: 'value1' },
  { text: '가나다2', value: 'value2' },
  { text: 'text3', value: 'value3' },
  { text: 'text4', value: 'value4' },
  { text: 'text5', value: 'value5' },
]
let dataObject = ref({
  checkbox : true,
  color : "#128483",
  input1 : "2025-11-28",
  input2 : '',
  input3 : "2025-11-19",
  input4 : 4321.4231,
  input5 : "FA123",
  input6 : "15sdfxzcv1",
  range : 70,
  select : "value4",
})

import type { ChartData, ChartOptions } from 'chart.js'

const chartData1 = ref<ChartData>({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Sales',
      data: [100, 150, 80, 120, 90],
      borderColor: 'primary',
      borderWidth: 1,
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      fill: true,
      tension: 0.4
    }
  ]
})
const chartData2 = ref<ChartData>({
  labels: [
    'A level',
    'B level',
    'C level'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'primary',
      'warning',
      'danger'
    ],
    hoverOffset: 4
  }]
})
const chartOptions2 = ref<ChartOptions>({
  responsive: true,
  layout: {
    padding: 0  // 또는 { left: 0, right: 0, top: 0, bottom: 0 }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top'
    }
  }
})

const chartOptions1 = ref<ChartOptions>({
  responsive: true,
  plugins: {
    title: {
        display: false,
        text: '',
        font: {
            size: 50,
            style: 'normal',
            weight: 'bold',
            lineHeight: 1.2,
        },
    },
    legend: {
      position: 'top',
      labels: {
        font: {
          size: 12,
        }
      }
    },
    tooltip: {
      enabled: true,
      titleFont: {
        size: 12
      },
      bodyFont: {
        size: 10
      }
    }
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 10
        }
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 10
        }
      }
    }
  }
})

const mountNote1 = (note: VanillanoteElement) => {
}
const mountNote2 = () => {
}
const onBoldBeforeClick = (e: Event) => { console.log('onBoldBeforeClick'); return false }
const onTextareaBeforeFocus = (e: Event) => { console.log('onTextareaBeforeFocus'); return false}

const testColumns1: HGridColumn[] = [
  { id : "dept", header : "Click the Sigma button to the left of the header;filter1(mask);dept ", dataType : "mask", format : "AAA99", width : "100", rowMerge : true },
  { id : "f_nm", header : ";filter2(text);first name", dataType : "text", width : "120", align : Align.center, locked : true },
  { id : "l_nm", header : ";filter3(text);last name", dataType : "text", width : "120", align : Align.center, locked : true, colMerge : true },
  { id : "d_o_j", header : ";filter4(month);DOJ", dataType : "month", format : "yyyy/mm", width : "120", align : Align.center, locked : true },
  { id : "e_id", header : "sort1(text);;", dataType : "number", width : "120", align : Align.center, locked : true, footer : "MAX;MIN;AVG;SUM", roundNumber : -1 },
  { id : "salary", header : "sort2(number);;salary", dataType : "number", format : "$ #,###.#####", width : "150", footer : "$$MAX;$$MIN;$$AVG;$$SUM" },
  { id : "status", header : "Please double click;checkbox;status", dataType : "checkbox", width : "80", align : Align.center, footer : "$$COUNT_CHECK" },
  { id : "radio", header : "radio", dataType : "radio", width : "80", align : Align.center, footer : "$$COUNT_CHECK" }
]
const mountGridTest1 = (grid: GridMethods) => {
  grid.load(testData)
}
const testColumns2: HGridColumn[] = [
  { id : "dept", header : "Click the Sigma button to the left of the header;filter1(mask);dept ", dataType : "mask", format : "AAA99", width : "100", rowMerge : true },
  { id : "f_nm", header : ";filter2(text);first name", dataType : "text", width : "120", align : Align.center, locked : true },
  { id : "l_nm", header : ";filter3(text);last name", dataType : "text", width : "120", align : Align.center, locked : true, colMerge : true },
  { id : "d_o_j", header : ";filter4(month);DOJ", dataType : "month", format : "yyyy/mm", width : "120", align : Align.center, locked : true },
  { id : "e_id", header : "sort1(text);;", dataType : "number", width : "120", align : Align.center, locked : true, footer : "MAX;MIN;AVG;SUM", roundNumber : -1 },
  { id : "salary", header : "sort2(number);;salary", dataType : "number", format : "$ #,###.#####", width : "150", footer : "$$MAX;$$MIN;$$AVG;$$SUM" },
  { id : "status", header : "Please double click;checkbox;status", dataType : "checkbox", width : "80", align : Align.center, footer : "$$COUNT_CHECK" },
  { id : "radio", header : "radio", dataType : "radio", width : "80", align : Align.center, footer : "$$COUNT_CHECK" }
]
const mountGridTest2 = (grid: GridMethods) => {
  grid.load(testData)
}


import 'vue-cal/dist/vuecal.css'

const specialTime = {
  [DayOfWeek.sun] : [
    { from: 10 * 60, to: 12 * 60 + 30, className: 'open' },
    { from: 13 * 60, to: 15 * 60 + 30 }
  ]
}

const disableDays = ['2025-06-16','2025-06-17','2025-06-21','2025-06-22']

const onCellClick = (date: Date) => {
    console.log('### onCellClick selectedDate.value', selectedDate.value)
    console.log('### onCellClick typeof selectedDate.value', typeof selectedDate.value)
    console.log('### onCellClick instanceof selectedDate.value', (selectedDate.value as any) instanceof Date)
}
const onViewChange = (e: any) => {
}
const selectedDate = ref('20250618')

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

const calendarEvents2 = ref([
  {
    title: 'Dev Sprint Planning 222',
    start: new Date(2025, 5, 20, 6, 0),
    end: new Date(2025, 5, 20, 11, 30),
    content: 'Weekly planning session for developers',
    class: 'event-purple',
  },
  {
    title: 'Team Lunch 222',
    start: new Date(2025, 5, 21, 12, 0),
    end: new Date(2025, 5, 21, 20, 0),
    content: 'Casual team lunch at the cafeteria',
    class: 'event-orange',
  },
])


const events = ref([
  { start: '2025-06-12 09:00', end: '2025-06-12 11:00', title: 'My Event' }
]);
const isWeekend = (heading: any) => {
    return heading.label === 'Saturday' || heading.label === 'Sunday'
}

import { AttachedFileItem, DateFormat, DayOfWeek, EditMode, HButtonMethods, HCalenderTimeFormat, HCalenderView, HGridColumn, HInputMethods, hison, InputType, NoteToolPosition } from 'hisonvue'
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { Align, GridMethods } from 'vanillagrid2'
import { NoteData, NoteModeByDevice, ToolPosition, VanillanoteElement } from 'vanillanote2'
import { sassTrue } from 'sass-embedded'
import { InterfaceDataModel } from 'hisonjs'

const inputValue1 = ref<any>('20240228');
const inputValue2 = ref<any>('2025-03')
const inputValue3 = ref<any>('2025-03-19');
const inputValue4 = ref<any>('1234.1234');
const inputValue5 = 'hr123';
const inputValue6 = '15sdfxzcv1515asd'
const input2Ref = ref<HTMLInputElement | null>(null)

const router = useRouter()
const onChange1 = (oldValue: any, newValue: any, inputMethods: HInputMethods) => {
}
const onInputMounted1 = (inputMethods: HInputMethods) => {
}
const onInput4 = (value: any, ...param: any) => {
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

const testData = [
  {
      dept : "AAA01",
      f_nm : "James",
      l_nm : "Smith",
      d_o_j : "201603",
      e_id : "7",
      salary : 100000,
      status : "Y",
  },
  {
      dept : "AAA01",
      f_nm : "Johnson",
      l_nm : "Johnson",
      d_o_j : "200103",
      e_id : "2",
      salary : 200000,
      status : "Y",
  },
  {
      dept : "AAA01",
      f_nm : "Michael",
      l_nm : "Williams",
      d_o_j : "200803",
      e_id : "4",
      salary : 150000,
      status : "N",
  },
  {
      dept : "AAA01",
      f_nm : "Smith",
      l_nm : "Smith",
      d_o_j : "202403",
      e_id : "46",
      salary : 50000,
      status : "Y",
  },
  {
      dept : "AAA01",
      f_nm : "William",
      l_nm : "Brown",
      d_o_j : "202203",
      e_id : "25",
      salary : 70000,
      status : "N",
  },
  {
      dept : "AAA01",
      f_nm : "Charles",
      l_nm : "Jones",
      d_o_j : "202103",
      e_id : "27",
      salary : 30000,
      status : "N",
  },
  {
      dept : "AAA02",
      f_nm : "David",
      l_nm : "Smith",
      d_o_j : "201403",
      e_id : "12",
      salary : 180000,
      status : "N",
  },
  {
      dept : "AAA02",
      f_nm : "James",
      l_nm : "Jones",
      d_o_j : "202303",
      e_id : "26",
      salary : 80000,
      status : "N",
  },
  {
      dept : "AAA02",
      f_nm : "Richard",
      l_nm : "Garcia",
      d_o_j : "202203",
      e_id : "24",
      salary : 60000,
      status : "Y",
  },
  {
      dept : "AAA02",
      f_nm : "David",
      l_nm : "Miller",
      d_o_j : "202403",
      e_id : "48",
      salary : 90000,
      status : "Y",
  },
  {
      dept : "AAA02",
      f_nm : "Joseph",
      l_nm : "Davis",
      d_o_j : "202403",
      e_id : "34",
      salary : 40000,
      status : "Y",
  },
  {
      dept : "AAA02",
      f_nm : "Richard",
      l_nm : "Miller",
      d_o_j : "202303",
      e_id : "35",
      salary : 50000,
      status : "Y",
  },
  {
      dept : "BBB01",
      f_nm : "Joseph",
      l_nm : "Davis",
      d_o_j : "200403",
      e_id : "3",
      salary : 140000,
      status : "Y",
  },
  {
      dept : "BBB01",
      f_nm : "Thomas",
      l_nm : "Johnson",
      d_o_j : "200903",
      e_id : "9",
      salary : 110000,
      status : "N",
  },
  {
      dept : "BBB01",
      f_nm : "Charles",
      l_nm : "Brown",
      d_o_j : "200703",
      e_id : "11",
      salary : 130000,
      status : "Y",
  },
  {
      dept : "BBB01",
      f_nm : "James",
      l_nm : "Rodriguez",
      d_o_j : "201303",
      e_id : "14",
      salary : 120000,
      status : "N",
  },
  {
      dept : "BBB02",
      f_nm : "Richard",
      l_nm : "Garcia",
      d_o_j : "200803",
      e_id : "10",
      salary : 190000,
      status : "Y",
  },
  {
      dept : "BBB02",
      f_nm : "David",
      l_nm : "Martinez",
      d_o_j : "202403",
      e_id : "37",
      salary : 60000,
      status : "Y",
  },
  {
      dept : "BBB02",
      f_nm : "Robert",
      l_nm : "Rodriguez",
      d_o_j : "202303",
      e_id : "31",
      salary : 90000,
      status : "N",
  },
  {
      dept : "BBB02",
      f_nm : "James",
      l_nm : "Williams",
      d_o_j : "202403",
      e_id : "40",
      salary : 60000,
      status : "Y",
  },
];
</script>

<style scoped>
::v-deep(.vuecal__time-column .open) {
    color: blue;
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
