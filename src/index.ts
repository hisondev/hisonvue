import { App } from 'vue'
import type { Hison, HisonCloser, HisonConfig } from './types'
import { createHison } from 'hisonjs'
import { createSSRClientOnly, getDefaultHisonConfig, createHisonCloser, setHison, applyCssVariables, initializeDeviceListener } from './core'
import './styles/hisonvue.scss'

const HButton = createSSRClientOnly<typeof import('./components/HButton/HButton.vue').default>(
  () => import('./components/HButton/HButton.vue'),
  'HButton'
)
const HLayout = createSSRClientOnly<typeof import('./components/HLayout/HLayout.vue').default>(
  () => import('./components/HLayout/HLayout.vue'),
  'HLayout'
)
const HNote = createSSRClientOnly<typeof import('./components/HNote/HNote.vue').default>(
  () => import('./components/HNote/HNote.vue'),
  'HNote'
)
const HGrid = createSSRClientOnly<typeof import('./components/HGrid/HGrid.vue').default>(
  () => import('./components/HGrid/HGrid.vue'),
  'HGrid'
)

export const hisonCloser = {
  event : {
    cssEvent: {
      button_onBeforeClick: (e: MouseEvent) => { return true },
      button_onAfterClick: (e: MouseEvent) => {},
      button_onBeforeMouseover: (e: MouseEvent) => { return true },
      button_onAfterMouseover: (e: MouseEvent) => {},
      button_onBeforeMouseout: (e: MouseEvent) => { return true },
      button_onAfterMouseout: (e: MouseEvent) => {},
      button_onBeforeTouchstart: (e: TouchEvent) => { return true },
      button_onAfterTouchstart: (e: TouchEvent) => {},
      button_onBeforeTouchend: (e: TouchEvent) => { return true },
      button_onAfterTouchend: (e: TouchEvent) => {},
    }
  }
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
    app.component('HButton', HButton)
    app.component('HLayout', HLayout)
    app.component('HNote', HNote)
    app.component('HGrid', HGrid)
  }
}

export {
  HButton,
  HLayout,
  HNote,
  HGrid,
  getDefaultHisonConfig,
}
export type {
  Hison,
  HisonConfig,
  HGridColumn,
  HButtonMethods,
} from './types'
export * from './enums'
