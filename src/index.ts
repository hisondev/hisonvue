import { App } from 'vue'
import type { Hison, HisonCloser, HisonConfig } from './types'
import { createHison } from 'hisonjs'
import { createSSRClientOnly, getDefaultHisonConfig, createHisonCloser, setHison, applyCssVariables, initializeDeviceListener } from './core'
import './styles/hisonvue.scss'

const HNote = createSSRClientOnly<typeof import('./components/HNote/HNote.vue').default>(
  () => import('./components/HNote/HNote.vue'),
  'HNote'
)
const HGrid = createSSRClientOnly<typeof import('./components/HGrid/HGrid.vue').default>(
  () => import('./components/HGrid/HGrid.vue'),
  'HGrid'
)
const HButton = createSSRClientOnly<typeof import('./components/HButton/HButton.vue').default>(
  () => import('./components/HButton/HButton.vue'),
  'HButton'
)
const HLayout = createSSRClientOnly<typeof import('./components/HLayout/HLayout.vue').default>(
  () => import('./components/HLayout/HLayout.vue'),
  'HLayout'
)
const HFileSet = createSSRClientOnly<typeof import('./components/HFileSet/HFileSet.vue').default>(
  () => import('./components/HFileSet/HFileSet.vue'),
  'HFileSet'
)
const HImageBox = createSSRClientOnly<typeof import('./components/HImageBox/HImageBox.vue').default>(
  () => import('./components/HImageBox/HImageBox.vue'),
  'HImageBox'
)
const HInput = createSSRClientOnly<typeof import('./components/HInput/HInput.vue').default>(
  () => import('./components/HInput/HInput.vue'),
  'HInput'
)
const HInputGroup = createSSRClientOnly<typeof import('./components/HInputGroup/HInputGroup.vue').default>(
  () => import('./components/HInputGroup/HInputGroup.vue'),
  'HInputGroup'
)
const HCalendar = createSSRClientOnly<typeof import('./components/HCalendar/HCalendar.vue').default>(
  () => import('./components/HCalendar/HCalendar.vue'),
  'HCalendar'
)
const HChart = createSSRClientOnly<typeof import('./components/HChart/HChart.vue').default>(
  () => import('./components/HChart/HChart.vue'),
  'HChart'
)

export const hisonCloser = {
  event : { cssEvent: {} }
} as HisonCloser

export const hison = createHison() as Hison
export const hisonvue = {
  install(app: App, hisonConfig?: HisonConfig) {
    const defaultHisonConfig = getDefaultHisonConfig()
    if(hisonConfig) {
      Object.keys(defaultHisonConfig).forEach((key) => {
        if (!(key in hisonConfig!)) {
          (hisonConfig as any)[key] = defaultHisonConfig[key as keyof HisonConfig]
        }
      })
    }
    else {
      hisonConfig = getDefaultHisonConfig()
    }
    
    createHisonCloser(hisonConfig)
    setHison(hison, hisonConfig)

    //window setting
    if (typeof window !== 'undefined') {
      applyCssVariables()
    }
    //device에 따른 window 이벤트 등록
    initializeDeviceListener()

    //사용자 설정값을 적용하기 위해 두번 실행해야함
    app.provide('hison', hison)
    app.component('HNote', HNote)
    app.component('HGrid', HGrid)
    app.component('HButton', HButton)
    app.component('HLayout', HLayout)
    app.component('HFileSet', HFileSet)
    app.component('HImageBox', HImageBox)
    app.component('HInput', HInput)
    app.component('HInputGroup', HInputGroup)
    app.component('HCalendar', HCalendar)
    app.component('HChart', HChart)
  }
}

export {
  HButton,
  HLayout,
  HNote,
  HGrid,
  HFileSet,
  HImageBox,
  HInput,
  HInputGroup,
  HCalendar,
  HChart,
  getDefaultHisonConfig,
}
export type {
  Hison,
  HisonConfig,
  DeviceType,
  AttachedFileItem,
  HCalendarSpecialTime,
  HCalendarSpecialTimeMap,
  HCalendarEvent,
  HGridColumn,
  ComponentMethods,
  HGridMethods,
  HNoteElement,
  HButtonMethods,
  HLayoutMethods,
  HFileSetMethods,
  HImageBoxMethods,
  HInputMethods,
  HInputGroupMethods,
  HCalendarMethods,
  HChartInstance,
} from './types'
export * from './enums'
