<template>
  <h1>Home Page</h1>
  <HLayout
  class="hison-col-12-mb hison-col-12-tb hison-col-12-pc hison-col-12-wd hison-layout-vertical-align-center-mb hison-layout-vertical-align-top-pc"
  >
    <HButton
      id="b1"
      class="hison-col-33p3-pc hison-col-66p3-mb hison-pos-left hison-size-l-mb hison-size-s-pc hison-color-primary-mb hison-color-warning-pc"
      :backgroundType="'empty'"
      @click="goToNoteTest"
    >
      Go to Note<br>(left-button)
    </HButton>
    <HLayout class="hison-col-33p3-pc hison-col-66p3-mb hison-pos-center hison-pos-vertical-center">
        <HButton
        id="b2"
        class="hison-col-5 hison-size-l-mb hison-size-s-pc hison-color-muted-mb hison-color-info-pc"
        text="button1"
        @click="openDrawer1"
        ></HButton>
        <HGap
          class="hison-col-2 hison-size-l-mb hison-size-s-pc hison-color-info-mb hison-color-muted-pc"
          :backgroundType="'empty'"
          :line="'vertical'"
        ></HGap>
        <HButton
        id="b3"
        class="hison-col-5 hison-size-l-mb hison-size-s-pc hison-color-warning-mb hison-color-primary-pc"
        text="button2"
        :backgroundType="'filled'"
        @click="openDrawer2"
        ></HButton>
    </HLayout>
    <HButton
      id="b4"
      class="hison-col-33p3-pc hison-col-66p3-mb hison-pos-right hison-size-l-mb hison-size-s-pc hison-color-danger-mb hison-color-success-pc"
      :backgroundType="'empty'"
      @click="goToGridTest"
    >
      Go to Grid<br>(right-button)
    </HButton>
  </HLayout>
  <HLayout>
    <HChart
      id="chart1"
      type="line"
      class="hison-col-6-pc hison-col-12-mb"
      v-model="chartData1"
      :options="chartOptions1"
      style="height:300px; display: inline-flex; align-items: center; justify-content: center;"
      :loadDelay="10"
      :visible="true"
    />
    <HChart
      id="chart2"
      type="doughnut"
      class="hison-col-6-pc hison-col-12-mb"
      v-model="chartData2"
      :options="chartOptions2"
      style="height:300px; display: inline-flex; align-items: center; justify-content: center;"
      :loadDelay="10"
    />
    <HCalendar
        id="cal1"
        class="hison-size-l-mb hison-size-s-pc hison-color-primary-mb hison-color-warning-pc"
        :activeView="HCalendarView.month"
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
    <HDrawer
        id="dw1"
        position="left"
        class="hison-size-l hison-color-success"
        :width="300"
        :showOverlay="true"
        :closeClickOverlay="true"
        :border="true"
        :visible="false"
        >
        <template #default>
            <div style="padding: 1rem">
            <h3>메뉴</h3>
            <ul>
                <li>홈</li>
                <li>설정</li>
                <li>로그아웃</li>
            </ul>
            </div>
        </template>
    </HDrawer>
    <HDrawer
        id="dw2"
        position="bottom"
        :width="500"
        :height="30"
        :visible="true"
        :showHandle="true"
        :showOverlay="false"
        :scrollLock="false"
        backgroundType="empty"
        >
        <template #default>
            <div style="padding: 1rem; text-align: center;">
            <strong>공지사항:</strong> 이번 주 금요일은 서버 점검이 있습니다.
            </div>
        </template>
    </HDrawer>
  </HLayout>
</template>

<script setup lang="ts">
import { ChartData, ChartOptions } from 'chart.js'
import { DayOfWeek, HCalendarView, hison } from 'hisonvue'
import { useRouter } from 'vue-router'
const router = useRouter()

const openDrawer1 = () => {
  const dw1 = hison.component.getDrawer('dw1')!
  dw1.open()
}
const openDrawer2 = () => {
  const dw2 = hison.component.getDrawer('dw2')!
  dw2.setVisible(true)
  dw2.setHeight(120, true)
}

const selectedDate = ref('20250618')

const onCellClick = (date: Date) => {
    console.log('### onCellClick selectedDate.value', selectedDate.value)
    console.log('### onCellClick typeof selectedDate.value', typeof selectedDate.value)
    console.log('### onCellClick instanceof selectedDate.value', (selectedDate.value as any) instanceof Date)
}
const onViewChange = (e: any) => {
}

const specialTime = {
  [DayOfWeek.sun] : [
    { from: 10 * 60, to: 12 * 60 + 30, className: 'open' },
    { from: 13 * 60, to: 15 * 60 + 30 }
  ]
}

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

const onClickCenterButton2 = () => {
}
const onClickCenterButton3 = () => {
}
const goToGridTest = () => {
  router.push('/gridTest')
}
const goToNoteTest = () => {
  router.push('/noteTest')
}
</script>

<style scoped>
</style>